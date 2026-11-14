"""Bake texture maps with Cycles: high->low (selected-to-active) or self-bake procedural materials.

Maps: normal, ao, roughness, basecolor, metallic, opacity, emit, id, thickness, curvature
(curvature is derived from the baked tangent normal map), combined.
--pack-orm writes T_<name>_ORM (R=AO, G=Roughness, B=Metallic) from the baked maps.
Usage:
  blender -b f.blend -P bake_maps.py -- --low SM_Crate --high Crate_high [Crate_bolts]
      [--maps normal ao curvature] [--res 2048] [--samples 64] [--margin-px 16]
      [--extrusion 0.02] [--cage Crate_cage] [--directx] [--out //textures] [--name Crate]
      [--pack-orm] [--device GPU|CPU] [--save out.blend]
  Self-bake (no --high): bakes the low object's own materials (procedurals -> textures).
  MCP: import bake_maps; print(bake_maps.run(low="SM_Crate", high=["Crate_high"], maps=["normal","ao"]))
"""
import hashlib
import os
import sys
from contextlib import ExitStack, contextmanager

import bpy
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import _bpyx as bx  # noqa: E402

NATIVE = {"normal": "NORMAL", "ao": "AO", "roughness": "ROUGHNESS", "emit": "EMIT",
          "combined": "COMBINED", "position": "POSITION"}
OVERRIDE = {"basecolor": "Base Color", "metallic": "Metallic", "opacity": "Alpha"}
SUFFIX = {"normal": "N", "ao": "AO", "roughness": "R", "basecolor": "BC", "metallic": "M",
          "opacity": "A", "emit": "E", "id": "ID", "thickness": "TH", "curvature": "CURV",
          "combined": "C", "position": "POS"}


def _set_device(sc, device):
    """Use an already enabled GPU; never rewrite the user's Cycles preferences."""
    sc.cycles.device = "CPU"
    if device == "CPU":
        return "CPU"
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        backend = prefs.compute_device_type
        if backend != "NONE" and any(d.use and d.type == backend for d in prefs.devices):
            sc.cycles.device = "GPU"
            return backend
    except (AttributeError, KeyError):
        pass
    return "CPU"


def _signal_override(mats, key, cleanup):
    """Register each undo before changing links, including partial failures."""
    for mat in mats:
        nt = mat.node_tree
        out = next((n for n in nt.nodes if n.type == "OUTPUT_MATERIAL" and n.is_active_output), None) \
            or bx.node(nt, "OUTPUT_MATERIAL")
        if out is None:
            continue
        previous_link = out.inputs["Surface"].links[0] if out.inputs["Surface"].is_linked else None
        prev = (previous_link.from_socket, previous_link.is_muted) if previous_link else None
        em = nt.nodes.new("ShaderNodeEmission")
        cleanup.callback(_restore, [(nt, em, out, prev)])
        em.inputs["Strength"].default_value = 1.0
        bsdf = bx.node(nt, "BSDF_PRINCIPLED")
        col = em.inputs["Color"]
        if key in OVERRIDE and bsdf:
            s = bsdf.inputs[OVERRIDE[key]]
            if s.is_linked:
                nt.links.new(s.links[0].from_socket, col)
            else:
                v = s.default_value
                col.default_value = tuple(v) if hasattr(v, "__len__") else (v, v, v, 1)
        elif key == "id":
            h = hashlib.md5(mat.name.encode()).digest()
            col.default_value = (h[0] / 255, h[1] / 255, h[2] / 255, 1)
        elif key == "thickness":
            ao = nt.nodes.new("ShaderNodeAmbientOcclusion")
            cleanup.callback(nt.nodes.remove, ao)
            ao.inside, ao.samples = True, 16
            ao.inputs["Distance"].default_value = _thick_dist
            nt.links.new(ao.outputs["AO"], col)
        nt.links.new(em.outputs["Emission"], out.inputs["Surface"])


def _restore(undo):
    for nt, node, out, prev in reversed(undo):
        nt.nodes.remove(node)
        if out is not None and prev is not None:
            link = nt.links.new(prev[0], out.inputs["Surface"])
            link.is_muted = prev[1]


def _target_node(low, img, cleanup):
    """Ensure every low material has an active Image node pointing at img."""
    if not low.data.materials:
        mat = bpy.data.materials.new(f"M_{low.name}")
        cleanup.callback(bpy.data.materials.remove, mat)
        if hasattr(mat, "use_nodes"):
            mat.use_nodes = True
        low.data.materials.append(mat)
        cleanup.callback(low.data.materials.pop, index=0)
    for slot in low.material_slots:
        if slot.material is None:
            mat = bpy.data.materials.new(f"M_{low.name}")
            cleanup.callback(bpy.data.materials.remove, mat)
            if hasattr(mat, "use_nodes"):
                mat.use_nodes = True
            slot.material = mat
            cleanup.callback(setattr, slot, "material", None)
        nt = slot.material.node_tree
        n = nt.nodes.new("ShaderNodeTexImage")
        cleanup.callback(nt.nodes.remove, n)
        n.image, n.label = img, "BAKE_TARGET"
        for o in nt.nodes:
            o.select = False
        n.select = True
        nt.nodes.active = n


BAKE_PROPERTIES = (
    "margin", "margin_type", "use_selected_to_active", "cage_extrusion",
    "max_ray_distance", "use_cage", "cage_object", "normal_space",
    "normal_r", "normal_g", "normal_b", "target", "use_clear",
)


def _restore_context(layer, active, mode, selection, mode_objects):
    bx.object_mode()
    bx.select_only(mode_objects if mode != "OBJECT" else [], active=active)
    if active is not None and mode != "OBJECT":
        bpy.ops.object.mode_set(mode=mode)
    for obj, selected in selection:
        obj.select_set(selected)
    layer.objects.active = active


@contextmanager
def _preserve_bake_state(low, sources):
    """Restore transient state even if setup, baking, or file saving fails."""
    sc = bpy.context.scene
    layer = bpy.context.view_layer
    active = layer.objects.active
    mode = active.mode if active else "OBJECT"
    selection = [(obj, obj.select_get()) for obj in layer.objects]
    mode_objects = [obj for obj in layer.objects if obj.mode != "OBJECT"]
    materials = {s.material for obj in [low, *sources] for s in obj.material_slots if s.material}
    for mat in materials:
        if mat.node_tree is None or (hasattr(mat, "use_nodes") and not mat.use_nodes):
            raise ValueError(f"Material {mat.name!r} must use nodes before baking")

    with ExitStack() as cleanup:
        cleanup.callback(_restore_context, layer, active, mode, selection, mode_objects)
        # LIFO restores the render engine after Cycles and bake settings.
        cleanup.callback(setattr, sc.render, "engine", sc.render.engine)
        for prop in ("device", "samples", "use_denoising"):
            cleanup.callback(setattr, sc.cycles, prop, getattr(sc.cycles, prop))
        for prop in BAKE_PROPERTIES:
            cleanup.callback(setattr, sc.render.bake, prop, getattr(sc.render.bake, prop))
        if low.data.uv_layers:
            cleanup.callback(setattr, low.data.uv_layers, "active_index", low.data.uv_layers.active_index)
        for mat in materials:
            nodes = mat.node_tree.nodes
            cleanup.callback(setattr, nodes, "active", nodes.active)
            for node in nodes:
                cleanup.callback(setattr, node, "select", node.select)
        yield


def _blur(x, r):
    for axis in (0, 1):
        x = sum(np.roll(x, k, axis=axis) for k in range(-r, r + 1)) / (2 * r + 1)
    return x


def _curvature_from_normal(img_n, res, strength=1.5):
    """Divergence of the tangent normal field: convex > 0.5 (white), concave < 0.5 (dark)."""
    a = np.empty(res * res * 4, dtype=np.float32)
    img_n.pixels.foreach_get(a)
    a = a.reshape(res, res, 4)
    r = max(1, res // 512)  # smooth 8-bit stepping; scale with resolution
    nx, ny = _blur(a[..., 0] * 2 - 1, r), _blur(a[..., 1] * 2 - 1, r)
    dx = np.roll(nx, -1, axis=1) - np.roll(nx, 1, axis=1)
    dy = np.roll(ny, -1, axis=0) - np.roll(ny, 1, axis=0)
    c = np.clip(0.5 + _blur(dx + dy, r) * strength * res / 512, 0, 1)
    out = np.stack([c, c, c, np.ones_like(c)], -1)
    return out.ravel()


_thick_dist = 0.1


def run(low=None, high=None, maps=None, res=2048, samples=64, margin_px=16, extrusion=None,
        cage=None, directx=False, out="//textures", name=None, pack_orm=False, device="GPU",
        uv_layer=None, **_):
    # Resolve inputs before leaving Edit/Sculpt mode or changing any scene state.
    if not low:
        raise ValueError("--low is required")
    lo = bpy.data.objects[low]
    his = [bpy.data.objects[h] for h in (high or [])]
    with _preserve_bake_state(lo, his):
        return _run(low=low, high=high, maps=maps, res=res, samples=samples,
                    margin_px=margin_px, extrusion=extrusion, cage=cage, directx=directx,
                    out=out, name=name, pack_orm=pack_orm, device=device, uv_layer=uv_layer)


def _run(low=None, high=None, maps=None, res=2048, samples=64, margin_px=16, extrusion=None,
         cage=None, directx=False, out="//textures", name=None, pack_orm=False, device="GPU",
         uv_layer=None):
    global _thick_dist
    bx.object_mode()
    if not low:
        raise ValueError("--low is required")
    lo = bpy.data.objects[low]
    his = [bpy.data.objects[h] for h in (high or [])]
    if not lo.data.uv_layers:
        raise ValueError(f"{low} has no UVs (see blender-retopology-uv)")
    maps = maps or (["normal", "ao"] if his else ["basecolor", "roughness", "metallic", "normal"])
    if "curvature" in maps and "normal" not in maps:
        maps = ["normal"] + maps
    name = name or low.removeprefix("SM_")
    out_dir = bpy.path.abspath(out)
    os.makedirs(out_dir, exist_ok=True)
    sc = bpy.context.scene
    prev_engine = sc.render.engine
    sc.render.engine = "CYCLES"
    backend = _set_device(sc, device)
    sc.cycles.samples = samples
    sc.cycles.use_denoising = False
    bake = sc.render.bake
    bpy.context.view_layer.update()
    diag = max(lo.dimensions.length, 1e-3)
    _thick_dist = diag * 0.1
    ext = extrusion if extrusion is not None else diag * 0.02
    bake.margin, bake.margin_type = margin_px, "EXTEND"
    bake.use_selected_to_active = bool(his)
    bake.cage_extrusion = ext
    bake.max_ray_distance = ext * 2 if his else 0.0
    bake.use_cage = bool(cage)
    if cage:
        bake.cage_object = bpy.data.objects[cage]
    bake.normal_space = "TANGENT"
    bake.normal_r, bake.normal_g, bake.normal_b = "POS_X", ("NEG_Y" if directx else "POS_Y"), "POS_Z"
    bake.target = "IMAGE_TEXTURES"
    bake.use_clear = True
    if uv_layer:
        lo.data.uv_layers.active = lo.data.uv_layers[uv_layer]
    src_objs = his or [lo]
    src_mats = {s.material for o in src_objs for s in o.material_slots if s.material}
    bx.select_only(his + [lo], active=lo)
    results, images = {}, {}
    try:
        for key in maps:
            if key == "curvature":
                continue
            data = key not in ("basecolor", "emit", "combined", "id")
            img = bpy.data.images.new(f"T_{name}_{SUFFIX[key]}", res, res, alpha=False,
                                      float_buffer=key in ("position",), is_data=data)
            img.colorspace_settings.name = "Non-Color" if data else "sRGB"
            if key == "normal":
                img.generated_color = (0.5, 0.5, 1, 1)
            with ExitStack() as map_cleanup:
                _target_node(lo, img, map_cleanup)
                if key in NATIVE:
                    btype, pf = NATIVE[key], set()
                else:
                    _signal_override(src_mats, key, map_cleanup)
                    btype = "EMIT"
                    pf = set()
                kw = {"type": btype}
                if pf:
                    kw["pass_filter"] = pf
                r = bpy.ops.object.bake(**kw)
                if r != {"FINISHED"}:
                    raise RuntimeError(f"bake {key} failed")
            path = os.path.join(out_dir, f"{img.name}.png")
            img.filepath_raw, img.file_format = path, "PNG"
            img.save()
            images[key] = img
            results[key] = path
        if "curvature" in maps:
            img = bpy.data.images.new(f"T_{name}_CURV", res, res, alpha=False, is_data=True)
            img.colorspace_settings.name = "Non-Color"
            img.pixels.foreach_set(_curvature_from_normal(images["normal"], res))
            path = os.path.join(out_dir, f"{img.name}.png")
            img.filepath_raw, img.file_format = path, "PNG"
            img.save()
            results["curvature"] = path
        if pack_orm:
            chans = []
            for k, default in (("ao", 1.0), ("roughness", 0.5), ("metallic", 0.0)):
                if k in images:
                    a = np.empty(res * res * 4, dtype=np.float32)
                    images[k].pixels.foreach_get(a)
                    chans.append(a.reshape(-1, 4)[:, 0])
                else:
                    chans.append(np.full(res * res, default, dtype=np.float32))
            orm = np.stack(chans + [np.ones(res * res, dtype=np.float32)], -1).ravel()
            img = bpy.data.images.new(f"T_{name}_ORM", res, res, alpha=False, is_data=True)
            img.colorspace_settings.name = "Non-Color"
            img.pixels.foreach_set(orm)
            path = os.path.join(out_dir, f"{img.name}.png")
            img.filepath_raw, img.file_format = path, "PNG"
            img.save()
            results["orm"] = path
    finally:
        sc.render.engine = prev_engine
    return {"ok": True, "device": backend, "extrusion": round(ext, 5), "res": res,
            "maps": {k: bpy.path.relpath(v) if bpy.data.filepath else v for k, v in results.items()}}


if __name__ == "__main__":
    p = bx.parser(__doc__)
    p.add_argument("--low", required=True)
    p.add_argument("--high", nargs="*", default=None)
    p.add_argument("--maps", nargs="*", default=None,
                   choices=sorted(set(NATIVE) | set(OVERRIDE) | {"id", "thickness", "curvature"}))
    p.add_argument("--res", type=int, default=2048)
    p.add_argument("--samples", type=int, default=64)
    p.add_argument("--margin-px", type=int, default=16)
    p.add_argument("--extrusion", type=float, default=None)
    p.add_argument("--cage", default=None)
    p.add_argument("--directx", action="store_true")
    p.add_argument("--out", default="//textures")
    p.add_argument("--name", default=None)
    p.add_argument("--pack-orm", action="store_true")
    p.add_argument("--device", default="GPU", choices=["GPU", "CPU"])
    p.add_argument("--uv-layer", default=None)
    p.add_argument("--save", default=None)
    bx.cli(run, p)
