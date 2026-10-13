"""Prepare compact CC0 MakeHuman bodies for Mon Monde 3D's existing 21-joint rig.

Only graphical data is read; no MakeHuman program code is bundled or executed.
Preparation dependencies: numpy, scipy, fast-simplification. None are used by the game.
Usage: python tools/build_natural_characters.py /path/to/makehuman-data
See ASSETS.md for the pinned source files and their licences.
"""
import base64,json,struct,sys
from pathlib import Path
import numpy as np
from scipy.sparse import coo_matrix
from scipy.spatial.transform import Rotation
import fast_simplification

ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(sys.argv[1])
RIG=json.loads((ROOT/'tools/character-rig.json').read_text())

def obj(path):
    points=[];faces=[];groups={};group='';uv=[];uvs={}
    for line in path.read_text().splitlines():
        p=line.split()
        if not p:continue
        if p[0]=='v':points.append(list(map(float,p[1:4])))
        elif p[0]=='vt':uv.append(list(map(float,p[1:3])))
        elif p[0]=='g':group=' '.join(p[1:])
        elif p[0]=='f':
            ids=[int(x.split('/')[0])-1 for x in p[1:]]
            groups.setdefault(group,set()).update(ids)
            for k in range(1,len(ids)-1):faces.append((group,[ids[0],ids[k],ids[k+1]]))
            for item,i in zip(p[1:],ids):
                fields=item.split('/')
                if len(fields)>1 and fields[1]:uvs[i]=uv[int(fields[1])-1]
    return np.array(points),faces,groups,uvs

BASE,FACES,GROUPS,UV=obj(SOURCE/'base.obj')
SKELETON=json.loads((SOURCE/'default.mhskel').read_text())
SOURCE_WEIGHTS=json.loads((SOURCE/'default_weights.mhw').read_text())['weights']

def target(name):
    out=np.zeros_like(BASE)
    for line in (SOURCE/name).read_text().splitlines():
        p=line.split()
        if p and not p[0].startswith('#'):out[int(p[0])]=list(map(float,p[1:4]))
    return out

def smooth(a,b,x):
    t=np.clip((x-a)/(b-a),0,1);return t*t*(3-2*t)

def rotation_between(a,b):
    a=a/np.linalg.norm(a);b=b/np.linalg.norm(b)
    cross=np.cross(a,b);s=np.linalg.norm(cross);c=float(a@b)
    if s<1e-10:return np.eye(3) if c>0 else Rotation.from_rotvec(np.array([0,np.pi,0])).as_matrix()
    return Rotation.from_rotvec(cross/s*np.arctan2(s,c)).as_matrix()

def segment_map(points,source_a,source_b,target_a,target_b):
    a=source_b-source_a;b=target_b-target_a
    direction=a/np.linalg.norm(a);r=rotation_between(a,b)
    scale=np.linalg.norm(b)/np.linalg.norm(a)
    stretch=np.eye(3)+(scale-1)*np.outer(direction,direction)
    return (points-source_a)@(r@stretch).T+target_a

def normals(points,triangles):
    n=np.zeros_like(points)
    face=np.cross(points[triangles[:,1]]-points[triangles[:,0]],points[triangles[:,2]]-points[triangles[:,0]])
    for k in range(3):np.add.at(n,triangles[:,k],face)
    n/=np.maximum(np.linalg.norm(n,axis=1,keepdims=True),1e-12)
    return n

def pack(points,triangles,weights,material,tex=None,surface_normals=None):
    n=normals(points,triangles) if surface_normals is None else surface_normals;data=bytearray()
    if tex is None:tex=np.zeros((len(points),2))
    for p,normal,w,uv in zip(points,n,weights,tex):
        joints=np.argsort(-w)[:4];v=w[joints];v=v/max(v.sum(),1e-12)
        wi=np.rint(v*255).astype(int);wi[np.argmax(wi)]+=255-wi.sum()
        data.extend(struct.pack('<3h3b4B4BB2H',*np.rint(p*10000).astype(int),*np.clip(np.rint(normal*127),-127,127).astype(int),*joints,*wi,material,*np.clip(np.rint(uv*65535),0,65535).astype(int)))
    return data,triangles.astype('<u2').flatten()

def build(sex):
    bones=RIG[sex];q=np.array([b['pivot'] for b in bones]);v=BASE.copy()
    # A blended adult shape provides a neutral starting face, independent of skin colour.
    for kind,amount in [('african',.4),('asian',.2),('caucasian',.4)]:v+=target(kind+'-'+sex+'-young.target')*amount
    v+=target('universal-'+sex+'-young-averagemuscle-averageweight.target')
    def joint(name):return v[SKELETON['joints'][name]].mean(0)
    def helper(name):return v[list(GROUPS['joint-'+name])].mean(0)
    floor=v[np.unique(np.array([f for g,f in FACES if g=='body']))][:,1].min()
    scale=.106
    pelvis=helper('pelvis');eye=helper('l-eye');head_shift=q[6,1]+.1045-(eye[1]-floor)*scale
    hip_shift=q[1,1]-(pelvis[1]-floor)*scale
    z_shift=q[1,2]-pelvis[2]*scale
    def canonical(points):
        points=np.array(points,copy=True);points*=scale;points[...,1]-=floor*scale
        y=points[...,1].copy();points[...,1]+=head_shift*smooth(1.30,1.53,y)+hip_shift*smooth(.5,.85,y)*(1-smooth(1.08,1.45,y))
        points[...,2]+=z_shift;return points
    rest=canonical(v)
    def j(name):return canonical(joint(name))
    def h(name):return canonical(helper(name))
    explicit={'root':0,'spine01':4,'spine02':3,'spine03':2,'spine04':2,'spine05':1,'neck01':5,'neck02':5,'neck03':5,'head':6,'jaw':6,'breast.L':4,'breast.R':4,'pelvis.L':1,'pelvis.R':1}
    for suffix,side,base,leg in [('L',1,7,15),('R',-1,11,18)]:
        explicit['clavicle.'+suffix]=base
        for part in ['upperarm01','upperarm02']:explicit[part+'.'+suffix]=base+1
        for part in ['lowerarm01','lowerarm02']:explicit[part+'.'+suffix]=base+2
        explicit['wrist.'+suffix]=base+3
        for name in SKELETON['bones']:
            if name.endswith('.'+suffix) and name.startswith(('finger','metacarpal')):explicit[name]=base+3
            if name.endswith('.'+suffix) and name.startswith('toe'):explicit[name]=leg+2
        for part in ['upperleg01','upperleg02']:explicit[part+'.'+suffix]=leg
        for part in ['lowerleg01','lowerleg02']:explicit[part+'.'+suffix]=leg+1
        explicit['foot.'+suffix]=leg+2
    def mapped(name):
        while name not in explicit:name=SKELETON['bones'][name]['parent']
        return explicit[name]
    weights=np.zeros((len(v),21))
    for name,items in SOURCE_WEIGHTS.items():
        k=mapped(name)
        for i,w in items:weights[i,k]+=w
    empty=weights.sum(1)<1e-10;weights[empty,0]=1;weights/=weights.sum(1,keepdims=True)
    transformed=np.zeros_like(rest)
    for k in range(21):
        pts=rest
        if k in [7,8,9,10,11,12,13,14]:
            side='l' if k<11 else 'r';base=7 if k<11 else 11
            source=[h(side+'-clavicle'),h(side+'-shoulder'),h(side+'-elbow'),h(side+'-hand')]
            part=k-base
            if part<3:pts=segment_map(rest,source[part],source[part+1],q[k],q[k+1])
            else:
                forward=h(side+'-finger-3-4')-source[3];forward/=np.linalg.norm(forward)
                wide=h(side+'-finger-2-1')-h(side+'-finger-5-1');wide-=forward*(wide@forward);wide/=np.linalg.norm(wide)
                normal=np.cross(forward,wide);a=np.column_stack([forward,wide,normal]);sign=1 if side=='l' else -1
                b=np.column_stack([[sign,0,0],[0,0,-sign],[0,1,0]])
                pts=(rest-source[3])@(b@a.T).T+q[k]
        elif k>=15:
            side='l' if k<18 else 'r';base=15 if k<18 else 18
            source=[h(side+'-upper-leg'),h(side+'-knee'),h(side+'-ankle')]
            part=k-base
            if part<2:pts=segment_map(rest,source[part],source[part+1],q[k],q[k+1])
            else:
                pts=rest-source[2]+q[k]
                # Match the compact game's ankle/sole height without changing foot direction.
                pts[:,1]=q[k,1]+(rest[:,1]-source[2][1])*q[k,1]/max(source[2][1],.001)
        transformed+=pts*weights[:,k,None]
    triangles=np.array([f for group,f in FACES if group=='body'],dtype=np.int64)
    used=np.unique(triangles);ids=np.full(len(v),-1,dtype=int);ids[used]=np.arange(len(used));triangles=ids[triangles]
    points=transformed[used]
    simplified,faces,collapses=fast_simplification.simplify(points,triangles,target_count=14000,return_collapses=True)
    _,_,mapping=fast_simplification.replay_simplification(points,triangles,collapses)
    w=np.zeros((len(simplified),21));tex=np.zeros((len(simplified),2));sizes=np.bincount(mapping,minlength=len(simplified))
    # Keep the original smooth anatomical shading, rather than large QEM face normals.
    smooth_normals=np.zeros_like(simplified);np.add.at(smooth_normals,mapping,normals(points,triangles))
    smooth_normals/=np.maximum(np.linalg.norm(smooth_normals,axis=1,keepdims=True),1e-12)
    edges=np.concatenate([faces[:,[0,1]],faces[:,[1,2]],faces[:,[2,0]]]);edges=np.concatenate([edges,edges[:,::-1]])
    adjacency=coo_matrix((np.ones(len(edges)),(edges[:,0],edges[:,1])),shape=(len(simplified),len(simplified))).tocsr()
    count=np.maximum(np.asarray(adjacency.sum(axis=1)),1)
    cloth_area=(simplified[:,1]>1.05)&(simplified[:,1]<1.49)&(np.abs(simplified[:,0])<.25)
    for _ in range(5):
        average=adjacency@smooth_normals/count
        smooth_normals[cloth_area]=smooth_normals[cloth_area]*.55+average[cloth_area]*.45
        smooth_normals/=np.maximum(np.linalg.norm(smooth_normals,axis=1,keepdims=True),1e-12)
    np.add.at(w,mapping,weights[used]);w/=np.maximum(sizes[:,None],1)
    original_uv=np.array([UV.get(int(i),[0,0]) for i in used]);np.add.at(tex,mapping,original_uv);tex/=np.maximum(sizes[:,None],1)
    # The eye proxy directly maps every vertex to the base's eye fitting surface.
    ep,ef,_,_=obj(SOURCE/'low-poly.obj');proxy=(SOURCE/'low-poly.mhclo').read_text().split('verts 0',1)[1]
    indices=[int(x) for x in proxy.splitlines() if x.strip().isdigit()]
    assert len(indices)==len(ep)
    eyes=canonical(v[indices]);eye_faces=np.array([f for _,f in ef]);eye_weights=np.zeros((len(eyes),21));eye_weights[:,6]=1
    skin,skin_ix=pack(simplified,faces,w,2,tex,smooth_normals);eye_data,eye_ix=pack(eyes,eye_faces,eye_weights,1)
    out=skin+eye_data;ix=np.concatenate([skin_ix,eye_ix+len(simplified)]).astype('<u2')
    torso=simplified[(np.abs(simplified[:,0])<.13)&(simplified[:,1]>1.08)&(simplified[:,1]<1.40)]
    centre=float((np.quantile(torso[:,2],.02)+np.quantile(torso[:,2],.98))*.5)
    eye_centre=h('l-eye')
    body={'bones':bones,'vertices':base64.b64encode(out).decode(),'indices':base64.b64encode(ix.tobytes()).decode(),'count':len(ix),'vertexCount':len(out)//22,'source':'MakeHuman CC0','sourceCommit':(SOURCE/'source-commit.txt').read_text().strip(),'bodyTriangles':len(faces),'eyeTriangles':len(eye_faces),'shape':{'eyeX':float(eye_centre[0]),'torsoZ':centre,'eyeZ':float(max(eyes[:,2].max(),simplified[(np.abs(simplified[:,0])>.010)&(np.abs(simplified[:,0])<.067)&(np.abs(simplified[:,1]-q[6,1]-.1045)<.020),2].max()))}}
    print(json.dumps({'body':sex,'vertices':body['vertexCount'],'triangles':len(ix)//3,'bytes':len(out)+ix.nbytes,'bounds':[simplified.min(0).tolist(),simplified.max(0).tolist()],'eye':h('l-eye').tolist(),'mouth':h('mouth').tolist()}),flush=True)
    np.savez(SOURCE/('prepared-'+sex+'.npz'),points=simplified,faces=faces,weights=w)
    return body

models={sex:build(sex) for sex in ['female','male']};models['hair']=[]
(ROOT/'assets/humans.js').write_text('/* CC0 MakeHuman bodies, adapted to the existing game rig. See ASSETS.md. */\nconst HumanAssets='+json.dumps(models,separators=(',',':'))+';\n')
