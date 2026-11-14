"""Regression tests for the real baker with a minimal, non-rendering bpy boundary.

These exercise state restoration, not Blender's renderer or RNA integration.
Run the companion test in Blender before using the patch on production assets.
"""
import importlib.util
import os
from pathlib import Path
import sys
import tempfile
from types import ModuleType, SimpleNamespace as NS
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "bake_maps.py"


class Objects(list):
    active = None

    def __getitem__(self, key):
        if isinstance(key, str):
            return next(x for x in self if x.name == key)
        return super().__getitem__(key)


class UVs(list):
    active_index = 0

    def __getitem__(self, key):
        if isinstance(key, str):
            return next(x for x in self if x.name == key)
        return super().__getitem__(key)

    @property
    def active(self):
        return self[self.active_index]

    @active.setter
    def active(self, value):
        self.active_index = self.index(value)


class Obj:
    def __init__(self, name, selected=False):
        self.name, self.mode, self.type = name, "OBJECT", "MESH"
        self.selected = selected
        self.data = NS(uv_layers=UVs([NS(name="Original"), NS(name="Bake")]))
        self.material_slots = []
        self.dimensions = NS(length=2)

    def select_get(self):
        return self.selected

    def select_set(self, value):
        self.selected = value


class Image:
    def __init__(self, name):
        self.name = name
        self.colorspace_settings = NS(name="sRGB")

    def save(self):
        Path(self.filepath_raw).write_bytes(b"test image boundary")


def fixture():
    lo, other = Obj("Low"), Obj("Other", True)
    other.mode = "EDIT"
    objects = Objects([lo, other])
    objects.active = other
    bake = NS(margin=3, margin_type="ADJACENT_FACES", use_selected_to_active=True,
              cage_extrusion=0.5, max_ray_distance=4, use_cage=False,
              cage_object=None, normal_space="OBJECT", normal_r="NEG_X",
              normal_g="NEG_Y", normal_b="NEG_Z", target="VERTEX_COLORS", use_clear=False)
    scene = NS(render=NS(engine="BLENDER_EEVEE_NEXT", bake=bake),
               cycles=NS(device="GPU", samples=321, use_denoising=True))
    prefs = NS(compute_device_type="CUDA", devices=[NS(type="CUDA", use=False), NS(type="CPU", use=True)])
    prefs.refresh_devices = lambda: None
    bpy = ModuleType("bpy")
    bpy.context = NS(scene=scene, view_layer=NS(objects=objects, update=lambda: None),
                     preferences=NS(addons={"cycles": NS(preferences=prefs)}))
    bpy.data = NS(objects=objects, filepath="", images=NS(new=lambda name, *a, **k: Image(name)))
    bpy.path = NS(abspath=os.path.abspath, relpath=lambda path: path)
    bpy.ops = NS(object=NS(
        mode_set=lambda mode: setattr(objects.active, "mode", mode),
        bake=lambda **kw: {"FINISHED"}))
    return bpy, lo, other, prefs


def snapshot(bpy, lo, other, prefs):
    sc = bpy.context.scene
    return {"engine": sc.render.engine, "cycles": vars(sc.cycles).copy(),
            "bake": vars(sc.render.bake).copy(), "uv": lo.data.uv_layers.active_index,
            "selected": [o.select_get() for o in bpy.data.objects],
            "active": bpy.context.view_layer.objects.active.name, "mode": other.mode,
            "device_type": prefs.compute_device_type, "device_use": [d.use for d in prefs.devices]}


class BakeStateTests(unittest.TestCase):
    def setUp(self):
        self.bpy, self.lo, self.other, self.prefs = fixture()
        self.temp = tempfile.TemporaryDirectory(dir=SCRIPT.parent)
        self.addCleanup(self.temp.cleanup)
        # No NumPy operation is exercised by these normal-only state tests.
        modules = {"bpy": self.bpy, "numpy": ModuleType("numpy")}
        self.patch_modules = patch.dict(sys.modules, modules)
        self.patch_modules.start()
        self.addCleanup(self.patch_modules.stop)
        sys.modules.pop("_bpyx", None)
        spec = importlib.util.spec_from_file_location("baker_under_test", SCRIPT)
        self.baker = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.baker)
        self.before = snapshot(self.bpy, self.lo, self.other, self.prefs)

    def run_bake(self):
        # Material/node behavior has its own Blender integration test. This seam
        # isolates the real run() control flow from the unavailable bpy renderer.
        with patch.object(self.baker, "_target_node", lambda *a, **kw: []):
            return self.baker.run(low="Low", maps=["normal"], res=8, samples=2,
                                  device="GPU", uv_layer="Bake", out=self.temp.name)

    def assert_restored(self):
        self.assertEqual(snapshot(self.bpy, self.lo, self.other, self.prefs), self.before)

    def test_success_preserves_scene_uv_selection_mode_and_preferences(self):
        result = self.run_bake()
        self.assertTrue(result["ok"])
        self.assertTrue(Path(result["maps"]["normal"]).exists())
        self.assert_restored()

    def test_bake_failure_restores_state(self):
        self.bpy.ops.object.bake = lambda **kw: {"CANCELLED"}
        with self.assertRaisesRegex(RuntimeError, "bake normal failed"):
            self.run_bake()
        self.assert_restored()

    def test_setup_failure_restores_state_before_bake_starts(self):
        def fail():
            raise RuntimeError("view layer unavailable")
        self.bpy.context.view_layer.update = fail
        with self.assertRaisesRegex(RuntimeError, "view layer unavailable"):
            self.run_bake()
        self.assert_restored()

    def test_file_save_failure_restores_state(self):
        with patch.object(Image, "save", side_effect=OSError("disk full")):
            with self.assertRaisesRegex(OSError, "disk full"):
                self.run_bake()
        self.assert_restored()

    def test_invalid_object_does_not_leave_edit_mode(self):
        with self.assertRaises((KeyError, StopIteration)):
            self.baker.run(low="Missing", out=self.temp.name)
        self.assert_restored()

    def test_gpu_request_never_changes_user_device_preferences(self):
        result = self.baker._set_device(self.bpy.context.scene, "GPU")
        self.assertEqual(self.prefs.compute_device_type, "CUDA")
        self.assertEqual([d.use for d in self.prefs.devices], [False, True])
        self.assertEqual(result, "CPU")

    def test_restored_surface_link_preserves_muted_state(self):
        restored_links = []
        def connect(source, target):
            link = NS(from_socket=source, to_socket=target, is_muted=False)
            restored_links.append(link)
            return link
        tree = NS(nodes=NS(remove=lambda node: None), links=NS(new=connect))
        self.baker._restore([(tree, object(), NS(inputs={"Surface": "surface"}), ("shader", True))])
        self.assertEqual(len(restored_links), 1)
        self.assertEqual((restored_links[0].from_socket, restored_links[0].to_socket), ("shader", "surface"))
        self.assertTrue(restored_links[0].is_muted)


if __name__ == "__main__":
    unittest.main()
