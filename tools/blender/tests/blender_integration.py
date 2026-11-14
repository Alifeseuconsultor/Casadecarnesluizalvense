"""Run in a fresh process: blender --background --factory-startup --python-exit-code 1 --python THIS_FILE.

Uses Blender's real data API and a tiny CPU bake. Never open a user's .blend file.
"""
from contextlib import ExitStack
from pathlib import Path
import sys
import tempfile
from unittest.mock import patch

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import bake_maps


def state(obj):
    sc = bpy.context.scene
    mat = obj.active_material
    nt = mat.node_tree if mat else None
    return {
        "engine": sc.render.engine,
        "cycles": (sc.cycles.device, sc.cycles.samples, sc.cycles.use_denoising),
        "bake": tuple(getattr(sc.render.bake, key) for key in bake_maps.BAKE_PROPERTIES),
        "uv": obj.data.uv_layers.active_index,
        "selected": tuple(o.name for o in bpy.context.selected_objects),
        "active": bpy.context.view_layer.objects.active,
        "mode": obj.mode,
        "materials": tuple(bpy.data.materials),
        "slots": tuple(s.material for s in obj.material_slots),
        "nodes": tuple((n, n.select) for n in nt.nodes) if nt else (),
        "active_node": nt.nodes.active if nt else None,
        "links": frozenset((l.from_socket, l.to_socket, l.is_muted) for l in nt.links) if nt else frozenset(),
    }


def main():
    if not bpy.app.background:
        raise RuntimeError("Run this test in a disposable background Blender process")
    bpy.ops.mesh.primitive_cube_add()
    obj = bpy.context.object
    obj.name = "BakingRegressionCube"
    if not obj.data.uv_layers:
        obj.data.uv_layers.new(name="Original")
    obj.data.uv_layers.new(name="Bake")
    mat = bpy.data.materials.new("BakingRegressionMaterial")
    if hasattr(mat, "use_nodes"):
        mat.use_nodes = True
    obj.data.materials.append(mat)
    nt = mat.node_tree
    original_node = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    for node in nt.nodes:
        node.select = node == original_node
    nt.nodes.active = original_node
    bpy.context.scene.cycles.samples = 57
    bpy.ops.object.mode_set(mode="EDIT")
    expected = state(obj)
    with tempfile.TemporaryDirectory() as directory:
        result = bake_maps.run(low=obj.name, maps=["basecolor", "normal"], res=16,
                               samples=1, device="CPU", uv_layer="Bake", out=directory)
        assert result["ok"] and all(Path(p).is_file() for p in result["maps"].values())
        assert state(obj) == expected, "Successful bake changed the source scene"

        # An injected target failure exercises cleanup after setup.
        with patch.object(bake_maps, "_target_node", side_effect=RuntimeError("injected failure")):
            try:
                bake_maps.run(low=obj.name, maps=["normal"], res=16, device="CPU", out=directory)
            except RuntimeError as error:
                assert "injected failure" in str(error)
            else:
                raise AssertionError("Expected injected failure")
        assert state(obj) == expected, "Failure changed the source scene"

    bpy.ops.object.mode_set(mode="OBJECT")
    output = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
    output.inputs["Surface"].links[0].is_muted = True
    expected = state(obj)
    try:
        with ExitStack() as cleanup:
            bake_maps._signal_override([mat], "thickness", cleanup)
            raise RuntimeError("interrupt after shader replacement")
    except RuntimeError:
        pass
    assert state(obj) == expected, "Temporary shader nodes or muted link state leaked"

    # Empty slots and objects without materials must not retain generated materials.
    obj.data.materials.clear()
    for empty_slot in (False, True):
        if empty_slot:
            obj.data.materials.append(None)
        expected = state(obj)
        image = bpy.data.images.new("RegressionTarget", width=4, height=4)
        try:
            with ExitStack() as cleanup:
                bake_maps._target_node(obj, image, cleanup)
                raise RuntimeError("interrupt after target creation")
        except RuntimeError:
            pass
        assert state(obj) == expected, "Temporary material or slot leaked"
        bpy.data.images.remove(image)
    print("BLENDER_BAKE_STATE_OK")


if __name__ == "__main__":
    main()
