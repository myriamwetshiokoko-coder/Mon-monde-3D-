"""Convert the CC0 Quaternius Standard glTF package to compact local GPU assets.
Usage: python tools/build_characters.py /path/to/Universal-Base-Characters-Standard
Requires numpy. The game does not require Python or the original archive.
"""
import sys,json,base64,struct
from pathlib import Path
import numpy as np
root=Path(sys.argv[1]);out=Path(__file__).resolve().parents[1]/'assets';out.mkdir(exist_ok=True)
keep=['root','pelvis','spine_01','spine_02','spine_03','neck_01','Head','clavicle_l','upperarm_l','lowerarm_l','hand_l','clavicle_r','upperarm_r','lowerarm_r','hand_r','thigh_l','calf_l','foot_l','thigh_r','calf_r','foot_r']
models={}
for sex in ['Female','Male']:
 p=root/'Base Characters/Godot - UE'/f'Superhero_{sex}_FullBody.gltf';d=json.loads(p.read_text());blob=(p.parent/d['buffers'][0]['uri']).read_bytes()
 def read(i):
  a=d['accessors'][i];b=d['bufferViews'][a['bufferView']];types={5126:'f4',5123:'u2',5121:'u1',5125:'u4'};size={'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16,'SCALAR':1}[a['type']];dt=np.dtype('<'+types[a['componentType']]);offset=b.get('byteOffset',0)+a.get('byteOffset',0);stride=b.get('byteStride',size*dt.itemsize)
  return np.ndarray((a['count'],size),dtype=dt,buffer=blob,offset=offset,strides=(stride,dt.itemsize)).copy()
 parent={c:i for i,n in enumerate(d['nodes']) for c in n.get('children',[])};named={n['name']:i for i,n in enumerate(d['nodes'])}
 def local(n):
  x,y,z,w=n.get('rotation',[0,0,0,1]);m=np.array([[1-2*y*y-2*z*z,2*x*y-2*z*w,2*x*z+2*y*w,0],[2*x*y+2*z*w,1-2*x*x-2*z*z,2*y*z-2*x*w,0],[2*x*z-2*y*w,2*y*z+2*x*w,1-2*x*x-2*y*y,0],[0,0,0,1.]])
  m[:3,:3]=m[:3,:3]@np.diag(n.get('scale',[1,1,1]));m[:3,3]=n.get('translation',[0,0,0]);return m
 def world(i):return world(parent[i])@local(d['nodes'][i]) if i in parent else local(d['nodes'][i])
 joints=d['skins'][0]['joints'];mapping=[]
 for node in joints:
  while d['nodes'][node]['name'] not in keep:node=parent[node]
  mapping.append(keep.index(d['nodes'][node]['name']))
 bones=[]
 for name in keep:
  i=named[name];j=parent.get(i)
  while j is not None and d['nodes'][j]['name'] not in keep:j=parent.get(j)
  pivot=world(i)[:3,3];bones.append({'name':name,'parent':keep.index(d['nodes'][j]['name']) if j is not None else -1,'pivot':[round(float(v),6) for v in pivot]})
 vertices=bytearray();indices=[];offset=0
 for mesh in d['meshes']:
  for pr in mesh['primitives']:
   a=pr['attributes'];pos=read(a['POSITION']);norm=read(a['NORMAL']);js=read(a['JOINTS_0']);weights=read(a['WEIGHTS_0']);uv=read(a['TEXCOORD_0']);mat=1 if mesh['name'].lower().startswith('eyes') else 0 if mesh['name'].lower().startswith('eyebrows') else 2
   for v,n,j,w,t in zip(pos,norm,js,weights,uv):
    v=v.copy();n=n.copy();w=w/max(w.sum(),.00001);wi=np.rint(w*255).astype(int);wi[np.argmax(w)]+=255-wi.sum()
    vertices.extend(struct.pack('<3h3b4B4BB2H',*np.rint(v*10000).astype(int),*np.clip(np.rint(n*127),-127,127).astype(int),*[mapping[int(i)] for i in j],*wi,mat,*np.clip(np.rint(t*65535),0,65535).astype(int)))
   indices.extend((read(pr['indices']).flatten()+offset).tolist());offset+=len(pos)
  packed=base64.b64encode(vertices).decode();ix=base64.b64encode(np.array(indices,dtype='<u2').tobytes()).decode();models[sex.lower()]={'bones':bones,'vertices':packed,'indices':ix,'count':len(indices),'vertexCount':offset}
 print(sex,offset,'vertices',len(indices)//3,'triangles',len(vertices)+len(indices)*2,'bytes')
# Hairstyles share the female head bind space; runtime offsets them to the male head.
models['hair']=[]
for name in ['Hair_BuzzedFemale','Hair_Buns','Hair_Long']:
 p=root/'Hairstyles/Rigged to Head Bone/glTF (Godot -Unreal)'/(name+'.gltf');d=json.loads(p.read_text());blob=(p.parent/d['buffers'][0]['uri']).read_bytes();vertices=bytearray();indices=[];offset=0
 for mesh in d['meshes']:
  for pr in mesh['primitives']:
   a=pr['attributes'];pos=read(a['POSITION']);norm=read(a['NORMAL']);uv=read(a['TEXCOORD_0'])
   for v,n,t in zip(pos,norm,uv):
    v=v.copy();n=n.copy()
    vertices.extend(struct.pack('<3h3b4B4BB2H',*np.rint(v*10000).astype(int),*np.clip(np.rint(n*127),-127,127).astype(int),6,0,0,0,255,0,0,0,3,*np.clip(np.rint(t*65535),0,65535).astype(int)))
   indices.extend((read(pr['indices']).flatten()+offset).tolist());offset+=len(pos)
 models['hair'].append({'vertices':base64.b64encode(vertices).decode(),'indices':base64.b64encode(np.array(indices,dtype='<u2').tobytes()).decode(),'count':len(indices),'vertexCount':offset})
 print(name,offset,'vertices',len(indices)//3,'triangles')
(out/'humans.js').write_text('/* Adapted from Quaternius Universal Base Characters, CC0. See ASSETS.md. */\nconst HumanAssets='+json.dumps(models,separators=(',',':'))+';\n')
