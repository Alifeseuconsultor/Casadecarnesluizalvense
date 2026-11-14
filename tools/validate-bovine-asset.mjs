/** Intake checks for piece bindings. This is not a geometric/anatomical validator. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function parseGlb(bytes) {
  if (bytes.length < 20 || bytes.readUInt32LE(0) !== 0x46546c67) throw new Error('Invalid GLB header');
  if (bytes.readUInt32LE(4) !== 2) throw new Error('Only GLB version 2 is supported');
  if (bytes.readUInt32LE(8) !== bytes.length) throw new Error('GLB length mismatch or truncation');
  let json;
  let binarySeen = false;
  for (let offset = 12, chunk = 0; offset < bytes.length; chunk++) {
    if (offset + 8 > bytes.length) throw new Error('Truncated chunk header');
    const size = bytes.readUInt32LE(offset);
    const type = bytes.readUInt32LE(offset + 4);
    const end = offset + 8 + size;
    if (size % 4 || end > bytes.length) throw new Error('Invalid chunk length');
    if (chunk === 0 && type !== 0x4e4f534a) throw new Error('JSON must be the first chunk');
    if (type === 0x4e4f534a) {
      if (chunk !== 0) throw new Error('Duplicate JSON chunk');
      json = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(offset + 8, end)));
    } else if (type === 0x004e4942) {
      if (chunk !== 1 || binarySeen) throw new Error('Invalid BIN chunk ordering');
      binarySeen = true;
    }
    offset = end;
  }
  if (!json || json.asset?.version !== '2.0') throw new Error('Expected glTF asset version 2.0');
  return json;
}

export function validateAsset(manifest, gltf) {
  const errors = [];
  const add = (code, message) => errors.push({ code, message });
  if (manifest?.version !== 1) add('MANIFEST_VERSION', 'Expected manifest version 1');
  if (manifest?.asset?.webUseApproved !== true || !manifest?.asset?.licenseEvidence?.trim()) {
    add('UNAPPROVED_WEB_USE', 'Document authorization to deliver the model through the website');
  }
  const pieces = Array.isArray(manifest?.pieces) ? manifest.pieces : [];
  if (!pieces.length) add('NO_PIECES', 'No individual pieces are defined');
  if (gltf?.asset?.version !== '2.0') add('GLTF_VERSION', 'Expected glTF 2.0');
  const nodes = Array.isArray(gltf?.nodes) ? gltf.nodes : [];
  const meshes = Array.isArray(gltf?.meshes) ? gltf.meshes : [];
  const names = new Map();
  nodes.forEach((node, index) => {
    if (typeof node.name === 'string') names.set(node.name, [...(names.get(node.name) ?? []), index]);
  });
  const reachable = new Set();
  const pending = [...(gltf?.scenes?.[gltf.scene ?? 0]?.nodes ?? [])];
  while (pending.length) {
    const index = pending.pop();
    if (reachable.has(index)) continue;
    if (!Number.isInteger(index) || !nodes[index]) {
      add('INVALID_SCENE_NODE', `Invalid scene node index: ${index}`);
      continue;
    }
    reachable.add(index);
    pending.push(...(nodes[index].children ?? []));
  }
  const ids = new Set();
  const bound = new Map();
  for (const piece of pieces) {
    if (!piece || typeof piece.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(piece.id)) {
      add('INVALID_PIECE', 'Every piece needs a stable lowercase ID');
      continue;
    }
    if (ids.has(piece.id)) add('DUPLICATE_ID', piece.id);
    ids.add(piece.id);
    if (piece.validation?.status !== 'approved' || !piece.validation?.evidence?.trim()) {
      add('UNREVIEWED_PIECE', piece.id);
    }
    if (!Array.isArray(piece.nodes) || !piece.nodes.length) {
      add('MISSING_BINDINGS', piece.id);
      continue;
    }
    for (const name of piece.nodes) {
      const matches = names.get(name) ?? [];
      if (!matches.length) { add('UNKNOWN_NODE', `${piece.id}: ${name}`); continue; }
      if (matches.length > 1) { add('AMBIGUOUS_NODE', `${piece.id}: ${name}`); continue; }
      const index = matches[0];
      const node = nodes[index];
      if (!reachable.has(index)) add('UNREACHABLE_NODE', `${piece.id}: ${name}`);
      if (bound.has(index)) add('SHARED_NODE', `${name}: ${bound.get(index)} / ${piece.id}`);
      bound.set(index, piece.id);
      if (!Number.isInteger(node.mesh) || !meshes[node.mesh]) {
        add('NOT_A_MESH', `${piece.id}: ${name}`);
      } else if (!meshes[node.mesh].primitives?.length) {
        add('EMPTY_MESH', `${piece.id}: ${name}`);
      }
    }
  }
  for (const resource of [...(gltf?.buffers ?? []), ...(gltf?.images ?? [])]) {
    if (resource.uri && !resource.uri.startsWith('data:')) {
      add('EXTERNAL_RESOURCE', resource.uri);
    }
  }
  return errors;
}

function main() {
  const [manifestFile, modelFile] = process.argv.slice(2);
  if (!manifestFile || !modelFile) throw new Error('Usage: node tools/validate-bovine-asset.mjs manifest.json model.glb');
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  const gltf = parseGlb(readFileSync(modelFile));
  const errors = validateAsset(manifest, gltf);
  console.log(JSON.stringify({ metadataChecksPassed: errors.length === 0, errors,
    nextChecks: 'Run the Khronos glTF Validator; inspect geometry, anatomy, licenses and browser behavior separately.' }, null, 2));
  if (errors.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { main(); } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
