import test from 'node:test';
import assert from 'node:assert/strict';

// Dynamic import keeps the pre-implementation baseline an explicit assertion.
let api;
try { api = await import('../validate-bovine-asset.mjs'); } catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
}

function fixture() {
  return {
    manifest: {
      version: 1,
      asset: { licenseEvidence: 'docs/license.txt', webUseApproved: true },
      pieces: [{ id: 'picanha', name: 'Picanha', nodes: ['cut_picanha_L'],
        validation: { status: 'approved', evidence: 'docs/review.pdf' } }],
    },
    gltf: { asset: { version: '2.0' }, scene: 0, scenes: [{ nodes: [0] }],
      nodes: [{ name: 'cut_picanha_L', mesh: 0 }],
      meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
      accessors: [{ count: 3, type: 'VEC3', componentType: 5126 }] },
  };
}

test('anatomical intake validator is available', () => assert.ok(api?.validateAsset));

for (const [name, change, code] of [
  ['missing geometry bindings', f => { f.manifest.pieces[0].nodes = []; }, 'MISSING_BINDINGS'],
  ['unreviewed anatomy', f => { f.manifest.pieces[0].validation.status = 'pending'; }, 'UNREVIEWED_PIECE'],
  ['unapproved web use', f => { f.manifest.asset.webUseApproved = false; }, 'UNAPPROVED_WEB_USE'],
  ['unknown GLB node', f => { f.manifest.pieces[0].nodes = ['missing']; }, 'UNKNOWN_NODE'],
  ['a transform without geometry', f => { delete f.gltf.nodes[0].mesh; }, 'NOT_A_MESH'],
  ['node outside active scene', f => { f.gltf.scenes[0].nodes = []; }, 'UNREACHABLE_NODE'],
  ['ambiguous duplicate node names', f => { f.gltf.nodes.push({ ...f.gltf.nodes[0] }); }, 'AMBIGUOUS_NODE'],
  ['same node assigned to two pieces', f => { f.manifest.pieces.push({ ...f.manifest.pieces[0], id: 'maminha' }); }, 'SHARED_NODE'],
  ['external buffer dependency', f => { f.gltf.buffers = [{ uri: 'remote.bin' }]; }, 'EXTERNAL_RESOURCE'],
  ['empty mesh primitive list', f => { f.gltf.meshes[0].primitives = []; }, 'EMPTY_MESH'],
]) {
  test(`rejects ${name}`, () => {
    assert.ok(api?.validateAsset, 'validator has not been implemented');
    const f = fixture();
    change(f);
    assert.ok(api.validateAsset(f.manifest, f.gltf).some(e => e.code === code));
  });
}

test('accepts reviewed mappings and independent mesh nodes', () => {
  assert.ok(api?.validateAsset);
  const f = fixture();
  assert.deepEqual(api.validateAsset(f.manifest, f.gltf), []);
});

test('reads GLB JSON and rejects truncated chunks', () => {
  assert.ok(api?.parseGlb);
  let json = JSON.stringify(fixture().gltf);
  json += ' '.repeat((4 - Buffer.byteLength(json) % 4) % 4);
  const body = Buffer.from(json);
  const file = Buffer.alloc(20 + body.length);
  file.writeUInt32LE(0x46546c67, 0);
  file.writeUInt32LE(2, 4);
  file.writeUInt32LE(file.length, 8);
  file.writeUInt32LE(body.length, 12);
  file.writeUInt32LE(0x4e4f534a, 16);
  body.copy(file, 20);
  assert.equal(api.parseGlb(file).nodes[0].name, 'cut_picanha_L');
  const bad = file.subarray(0, file.length - 4);
  assert.throws(() => api.parseGlb(bad), /length|trunc/i);
});
