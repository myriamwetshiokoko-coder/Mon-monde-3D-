"""Prepare the original Aurore GLB for the existing WebGL 1 renderer.

python3 tools/build_furniture.py
Requires numpy and Pillow. No Blender or remote assets at runtime.
This adapter intentionally supports this static, identity-node GLB only.
"""
import base64, io, json, struct
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'assets/models/canape-aurore.glb'
raw = source.read_bytes()
assert raw[:4] == b'glTF' and struct.unpack_from('<I', raw, 4)[0] == 2
length = struct.unpack_from('<I', raw, 12)[0]
gltf = json.loads(raw[20:20+length])
binary = raw[28+length:]
assert all(not any(k in n for k in ('matrix', 'translation', 'rotation', 'scale')) for n in gltf['nodes'])

def accessor(index):
    a = gltf['accessors'][index]
    view = gltf['bufferViews'][a['bufferView']]
    dtype = {5126: '<f4', 5123: '<u2', 5125: '<u4'}[a['componentType']]
    size = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3}[a['type']]
    assert 'byteStride' not in view and 'sparse' not in a
    return np.frombuffer(binary, dtype=dtype, count=a['count']*size,
                         offset=view.get('byteOffset', 0)+a.get('byteOffset', 0)).reshape(-1, size).copy()

def encode(data):
    return base64.b64encode(data).decode('ascii')

textures = []
for image in gltf['images']:
    view = gltf['bufferViews'][image['bufferView']]
    start = view.get('byteOffset', 0)
    tile = Image.open(io.BytesIO(binary[start:start+view['byteLength']])).convert('RGBA')
    # Power-of-two tiles keep texture memory and mipmapping bounded on iPhone.
    tile = tile.resize((128, 128), Image.Resampling.BOX)
    textures.append({'width': 128, 'height': 128, 'pixels': encode(tile.tobytes())})

groups = {i: [] for i in range(len(gltf['materials']))}
for mesh in gltf['meshes']:
    for primitive in mesh['primitives']:
        assert primitive.get('mode', 4) == 4
        at = primitive['attributes']
        p, n, uv = (accessor(at[k]) for k in ('POSITION', 'NORMAL', 'TEXCOORD_0'))
        ids = accessor(primitive['indices']).reshape(-1).astype(np.uint16)
        # Source faces +Z. Existing seats face -Z; preserve the playable footprint.
        scale = np.array([-1.04, 1.0, -1.24])
        p *= scale
        p[:, 1] += .012
        n /= scale
        n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-9)
        t = np.zeros_like(p)
        bt = np.zeros_like(p)
        for a, b, c in ids.reshape(-1, 3):
            e1, e2 = p[b]-p[a], p[c]-p[a]
            d1, d2 = uv[b]-uv[a], uv[c]-uv[a]
            det = d1[0]*d2[1]-d1[1]*d2[0]
            if abs(det) > 1e-9:
                tangent = (e1*d2[1]-e2*d1[1])/det
                bitangent = (e2*d1[0]-e1*d2[0])/det
                for k in (a, b, c):
                    t[k] += tangent
                    bt[k] += bitangent
        t -= n*np.sum(n*t, axis=1, keepdims=True)
        for k in np.where(np.linalg.norm(t, axis=1) < 1e-9)[0]:
            t[k] = np.cross(n[k], [0, 1, 0] if abs(n[k, 1]) < .9 else [1, 0, 0])
        t /= np.maximum(np.linalg.norm(t, axis=1, keepdims=True), 1e-9)
        sign = np.where(np.sum(np.cross(n, t)*bt, axis=1) < 0, -1, 1)
        groups[primitive['material']].append((p, n, uv, np.c_[t, sign], ids))

parts = []
all_positions = []
for material, chunks in groups.items():
    if not chunks:
        continue
    p = np.concatenate([c[0] for c in chunks])
    n = np.concatenate([c[1] for c in chunks])
    uv = np.concatenate([c[2] for c in chunks])
    tangent = np.concatenate([c[3] for c in chunks])
    indices, offset = [], 0
    for chunk in chunks:
        indices.extend((chunk[4].astype(np.uint32)+offset).tolist())
        offset += len(chunk[0])
    assert offset < 65536 and np.isfinite(p).all() and np.isfinite(tangent).all()
    # Float positions/UVs and normalized int16 normals/tangents; aligned stride 36.
    packed = bytearray(offset*36)
    for k in range(offset):
        struct.pack_into('<3f3h2x2f4h', packed, k*36, *p[k],
                         *np.rint(np.clip(n[k], -1, 1)*32767).astype(int), *uv[k],
                         *np.rint(np.clip(tangent[k], -1, 1)*32767).astype(int))
    mat = gltf['materials'][material]
    pbr = mat['pbrMetallicRoughness']
    normal = mat.get('normalTexture', {})
    tex = pbr.get('baseColorTexture', {})
    parts.append({'name': mat['name'], 'vertices': encode(packed),
                  'indices': encode(np.array(indices, dtype='<u2').tobytes()),
                  'count': len(indices), 'color': pbr['baseColorFactor'][:3],
                  'roughness': pbr['roughnessFactor'],
                  'texture': gltf['textures'][tex['index']]['source'] if tex else -1,
                  'normalTexture': gltf['textures'][normal['index']]['source'] if normal else -1,
                  'normalScale': normal.get('scale', 0)})
    all_positions.append(p)
p = np.concatenate(all_positions)
asset = {'name': 'Aurore', 'license': 'CC0-1.0', 'stride': 36, 'parts': parts,
         'textures': textures, 'bounds': {'min': p.min(axis=0).tolist(), 'max': p.max(axis=0).tolist()},
         'vertices': len(p), 'triangles': sum(x['count'] for x in parts)//3}
target = ROOT / 'assets/aurore.js'
target.write_text('/* Generated by tools/build_furniture.py; original Aurore model, CC0. */\n'
                  +'const AuroreAsset='+json.dumps(asset, separators=(',', ':'), ensure_ascii=False)+';\n')
print(json.dumps({'vertices': len(p), 'triangles': asset['triangles'], 'bytes': target.stat().st_size}))
