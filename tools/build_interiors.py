"""Original lightweight bedroom, dining and kitchen meshes, CC0.
Run python3 tools/build_interiors.py. Reuses Aurore's local texture tiles.
No Blender, downloaded models or network dependencies. NumPy required.
"""
import base64, json, math, struct
from collections import defaultdict
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
models = {}
current = None
materials = {
 'wood': {'color':[.69,.52,.33],'roughness':.52,'texture':2},
 'linen': {'color':[.86,.83,.75],'roughness':.86,'texture':0,'normalTexture':1,'normalScale':.38},
 'pillow': {'color':[.95,.92,.84],'roughness':.9,'texture':0,'normalTexture':1,'normalScale':.3},
 'throw': {'color':[.63,.45,.35],'roughness':.86,'texture':0,'normalTexture':1,'normalScale':.38,'theme':True},
 'upholstery': {'color':[.48,.58,.47],'roughness':.86,'texture':0,'normalTexture':1,'normalScale':.35},
 'cabinet': {'color':[.76,.74,.67],'roughness':.6,'theme':True},
 'stone': {'color':[.87,.83,.74],'roughness':.45},
 'steel': {'color':[.50,.56,.54],'roughness':.24},
 'dark': {'color':[.045,.055,.052],'roughness':.38},
 'brass': {'color':[.55,.39,.20],'roughness':.24},
 'fridge': {'color':[.73,.77,.74],'roughness':.3},
 'seam': {'color':[.51,.43,.34],'roughness':.88},
}

def unit(x):
    x=np.asarray(x,dtype=float); return x/max(np.linalg.norm(x),1e-9)

def mesh(mat, p, n, uv, indices):
    current[mat].append((np.asarray(p),np.asarray(n),np.asarray(uv),np.asarray(indices,dtype=int)))

def rounded(mat, center, size, radius=.025, grid=6, warp=None, turn=0):
    half=np.asarray(size)/2; radius=min(radius,min(half)*.85)
    # Close-spaced edge samples + wider face samples keep real corner roundness.
    def steps(h):
        inner=np.linspace(-h+radius,h-radius,max(2,grid-3))
        return np.unique(np.r_[-h,-h+radius*.22,inner,h-radius*.22,h])
    p,n,uv,idx=[],[],[],[]
    for axis in range(3):
        a,b=(axis+1)%3,(axis+2)%3
        u,v=steps(half[a]),steps(half[b])
        for side in [-1,1]:
            offset=len(p)
            for x in u:
                for y in v:
                    q=np.zeros(3);q[axis]=side*half[axis];q[a]=x;q[b]=y
                    core=np.clip(q,-half+radius,half-radius);normal=unit(q-core);q=core+normal*radius
                    if warp:q,normal=warp(q,normal)
                    c,s=math.cos(turn),math.sin(turn)
                    q=np.array([c*q[0]+s*q[2],q[1],-s*q[0]+c*q[2]])
                    normal=unit([c*normal[0]+s*normal[2],normal[1],-s*normal[0]+c*normal[2]])
                    p.append(q+center);n.append(normal);uv.append([x/(2*half[a])+.5,y/(2*half[b])+.5])
            for i in range(len(u)-1):
                for j in range(len(v)-1):
                    x=offset+i*len(v)+j;y=x+len(v)
                    idx.extend([x,y,x+1,x+1,y,y+1] if side>0 else [x,x+1,y,x+1,y+1,y])
    mesh(mat,p,n,uv,idx)

def tube(mat, points, radius, sides=10, cap=True):
    p,n,uv,idx=[],[],[],[];points=np.asarray(points)
    for i,c in enumerate(points):
        d=unit(points[min(i+1,len(points)-1)]-points[max(0,i-1)])
        a=unit(np.cross(d,[0,1,0] if abs(d[1])<.9 else [1,0,0]));b=unit(np.cross(d,a))
        for j in range(sides+1):
            angle=j/sides*math.tau;normal=a*math.cos(angle)+b*math.sin(angle)
            p.append(c+normal*radius);n.append(normal);uv.append([j/sides,i/max(1,len(points)-1)])
    for i in range(len(points)-1):
        for j in range(sides):
            a=i*(sides+1)+j;b=a+sides+1;idx.extend([a,a+1,b,b,a+1,b+1])
    if cap:
        for row,sgn in [(0,-1),(len(points)-1,1)]:
            normal=unit(points[-1]-points[0])*sgn;center=len(p);p.append(points[row]);n.append(normal);uv.append([.5,.5])
            for j in range(sides):
                a=len(p);p.extend([np.array(p[row*(sides+1)+j]),np.array(p[row*(sides+1)+j+1])])
                n.extend([normal,normal]);uv.extend([[0,0],[1,0]]);idx.extend([center,a,a+1])
    mesh(mat,p,n,uv,idx)

def slab(mat, center, size, corner=.14):
    w,h,d=size;outline=[]
    for x,z,start in [(w/2-corner,d/2-corner,0),(-w/2+corner,d/2-corner,math.pi/2),(-w/2+corner,-d/2+corner,math.pi),(w/2-corner,-d/2+corner,3*math.pi/2)]:
        for j in range(9):
            a=start+j/8*math.pi/2;outline.append([x+math.cos(a)*corner,z+math.sin(a)*corner])
    p,n,uv,idx=[],[],[],[];count=len(outline)
    for level,(y,factor,ny) in enumerate([(-h/2,.992,-.65),(-h/2+.008,1,0),(h/2-.008,1,0),(h/2,.992,.65)]):
        for x,z in outline:
            normal=unit([x/(w/2),ny,z/(d/2)]);p.append(np.array(center)+[x*factor,y,z*factor]);n.append(normal);uv.append([x/w+.5,z/d+.5])
    for level in range(3):
        for j in range(count):
            a=level*count+j;b=level*count+(j+1)%count;idx.extend([a,b,a+count,b,b+count,a+count])
    for level,sgn in [(0,-1),(3,1)]:
        center_id=len(p);p.append(np.array(center)+[0,sgn*h/2,0]);n.append([0,sgn,0]);uv.append([.5,.5]);offset=len(p)
        for x,z in outline:p.append(np.array(center)+[x*.992,sgn*h/2,z*.992]);n.append([0,sgn,0]);uv.append([x/w+.5,z/d+.5])
        for j in range(count):idx.extend([center_id,offset+j,offset+(j+1)%count])
    mesh(mat,p,n,uv,idx)

def ring(mat, center, radius, thickness=.0025):
    points=[[center[0]+radius*math.cos(a),center[1],center[2]+radius*math.sin(a)] for a in np.linspace(0,math.tau,33)]
    tube(mat,points,thickness,sides=6,cap=False)

def basin():
    p,n,uv,idx=[],[],[],[]
    for row in range(9):
        t=row/8;ry=1.043-.215*t;scale=1-.38*math.sin(t*math.pi/2)
        for j in range(49):
            a=j/48*math.tau;ca,sa=math.cos(a),math.sin(a)
            x=.4*math.copysign(abs(ca)**.45,ca)*scale;z=.22*math.copysign(abs(sa)**.45,sa)*scale
            p.append([-4.35+x,ry,-3.90+z]);n.append(unit([-x/.4,.38,-z/.22]));uv.append([j/48,t])
    for i in range(8):
        for j in range(48):a=i*49+j;b=a+49;idx.extend([a,b,a+1,b,b+1,a+1])
    center=len(p);p.append([-4.35,.828,-3.90]);n.append([0,1,0]);uv.append([.5,.5])
    for j in range(48):idx.extend([center,8*49+j,8*49+j+1])
    mesh('steel',p,n,uv,idx)
    ring('dark',[-4.35,.831,-3.90],.04,.006)

def start(name):
    global current
    current=defaultdict(list);models[name]=current

start('bed')
rounded('wood',[0,.52,0],[2.28,.37,2.34],.04)
rounded('wood',[0,.84,-1.16],[2.30,1.18,.11],.035)
rounded('linen',[0,1.03,-1.092],[2.17,.79,.115],.05)
for x in [-.8,-.4,0,.4,.8]:rounded('seam',[x,1.03,-1.028],[.006,.67,.008],.002,4)
rounded('pillow',[0,.866,0],[2.20,.18,2.26],.055)
for x in [-.56,.56]:
    rounded('pillow',[x,1.012,-.76],[.92,.16,.49],.068,8)
    tube('seam',[[x-.38,1.017,-.51],[x+.38,1.017,-.51]],.0025,6)
def folds(q,n):
    if n[1]>.4:
        envelope=max(0,1-(q[0]/1.11)**4)*max(0,1-(q[2]/.79)**4)
        wave=.021*math.sin(q[0]*11+q[2]*4)+.010*math.sin(q[2]*15)
        q[1]+=wave*envelope
        n=unit(n+[-.16*math.cos(q[0]*11+q[2]*4)*envelope,0,-.11*math.cos(q[2]*15)*envelope])
    return q,n
rounded('linen',[0,.995,.27],[2.21,.058,1.57],.02,12,warp=folds)
rounded('throw',[0,1.045,.68],[2.23,.052,.57],.02,10,warp=folds)
for x in [-1.015,1.015]:
    for z in [-1.015,1.015]:tube('wood',[[x,.03,z],[x,.36,z]],.03)

start('dining')
slab('wood',[0,.76,0],[1.78,.095,1.14],.20)
for x in [-.62,.62]:
    for z in [-.34,.34]:tube('wood',[[x*1.12,.025,z*1.14],[x,.70,z]],.04)
rounded('wood',[0,.66,0],[1.39,.07,.71],.02)
for cx,angle in [(-1.40,0),(1.31,math.pi)]:
    slab('wood',[cx,.377,0],[.47,.05,.50],.09)
    rounded('upholstery',[cx,.434,0],[.47,.10,.50],.039,8)
    def bend(q,n):
        q[0]+=.075*(q[2]/.25)**2-.06*q[1];n=unit([n[0],n[1]+.06*n[0],n[2]-.6*q[2]/.25*n[0]]);return q,n
    delta=-.17 if angle==0 else .17
    rounded('upholstery',[cx+delta,.69,0],[.075,.56,.48],.03,8,warp=bend,turn=angle)
    for dx in [-.16,.16]:
        for dz in [-.17,.17]:tube('wood',[[cx+dx*1.25,.025,dz*1.18],[cx+dx,.375,dz]],.021)

start('kitchen')
rounded('wood',[-3.4,.46,-4.34],[4.65,.90,.08],.018,4)
for x in [-5.685,-1.115]:rounded('wood',[x,.46,-3.97],[.08,.90,.82],.018,4)
rounded('wood',[-3.4,.15,-3.97],[4.65,.10,.82],.018,4)
rounded('dark',[-3.4,.09,-3.92],[4.57,.15,.76],.014,4)
for x in [-5.26,-4.34,-3.42,-2.50,-1.58]:
    rounded('cabinet',[x,.50,-3.512],[.895,.75,.055],.015,4)
    rounded('brass',[x,.73,-3.466],[.28,.022,.03],.006,4)
for center,size in [([-5.275,1.005,-3.95],[1.05,.075,.95]),([-2.475,1.005,-3.95],[2.95,.075,.95]),([-4.35,1.005,-4.2725],[.8,.075,.305]),([-4.35,1.005,-3.5775],[.8,.075,.205])]:
    rounded('stone',center,size,.017,4)
basin()
points=[[-4.35,1.04,-4.24],[-4.35,1.20,-4.24],[-4.35,1.34,-4.20],[-4.35,1.40,-4.13],[-4.35,1.38,-4.05],[-4.35,1.29,-3.99],[-4.35,1.21,-3.99]]
tube('steel',points,.018,12)
rounded('steel',[-4.23,1.105,-4.24],[.12,.027,.035],.01,4)
rounded('dark',[-2.40,1.05,-3.95],[1.18,.018,.63],.007,4)
for x in [-2.75,-2.05]:ring('steel',[x,1.061,-3.95],.12,.0022);ring('steel',[x,1.061,-3.95],.098,.0016)
for x in [-2.50,-2.40,-2.30]:rounded('stone',[x,1.063,-3.72],[.02,.001,.009],.0004,4)
for cx,w in [(-4.45,2.1),(-2.20,1.6)]:
    rounded('wood-upper',[cx,1.80,-4.93],[w,.78,.20],.022,4)
    for dx in [-w/4,w/4]:
        rounded('cabinet-upper',[cx+dx,1.80,-4.817],[w/2-.02,.76,.035],.01,4)
        rounded('brass-upper',[cx+dx+(.17 if dx<0 else -.17),1.78,-4.785],[.016,.16,.022],.005,4)

start('fridge')
rounded('fridge',[-5.35,1.21,-2.45],[1.08,2.38,1.035],.042,6)
for y,h in [(.54,.91),(1.68,1.30)]:rounded('fridge',[-5.35,y,-1.912],[1.025,h,.046],.015,6)
rounded('dark',[-5.35,1.015,-1.878],[.99,.012,.014],.003,4)
for y in [.63,1.63]:
    rounded('steel',[-4.92,y,-1.863],[.026,.30,.028],.009,4)
    for dy in [-.13,.13]:rounded('steel',[-4.92,y+dy,-1.888],[.025,.020,.033],.005,4)

for name in ['wood','cabinet','brass']:materials[name+'-upper']={**materials[name],'cutSide':'back'}

output={}
for key,groups in models.items():
    parts=[];positions=[]
    for mat,chunks in groups.items():
        p=np.concatenate([c[0] for c in chunks]);n=np.concatenate([c[1] for c in chunks]);uv=np.concatenate([c[2] for c in chunks]);ids=[];offset=0
        for chunk in chunks:ids.extend((chunk[3]+offset).tolist());offset+=len(chunk[0])
        assert offset<65536 and np.isfinite(p).all()
        t=np.zeros_like(p);b=np.zeros_like(p)
        for a,c,d in np.asarray(ids).reshape(-1,3):
            e1,e2=p[c]-p[a],p[d]-p[a];v1,v2=uv[c]-uv[a],uv[d]-uv[a];det=v1[0]*v2[1]-v1[1]*v2[0]
            if abs(det)>1e-9:
                ta=(e1*v2[1]-e2*v1[1])/det;bt=(e2*v1[0]-e1*v2[0])/det
                for i in [a,c,d]:t[i]+=ta;b[i]+=bt
        t-=n*np.sum(n*t,axis=1,keepdims=True)
        for i in np.where(np.linalg.norm(t,axis=1)<1e-9)[0]:t[i]=np.cross(n[i],[0,1,0] if abs(n[i,1])<.9 else [1,0,0])
        t/=np.maximum(np.linalg.norm(t,axis=1,keepdims=True),1e-9)
        sign=np.where(np.sum(np.cross(n,t)*b,axis=1)<0,-1,1)
        packed=bytearray(len(p)*36)
        for i in range(len(p)):struct.pack_into('<3f3h2x2f4h',packed,i*36,*p[i],*np.rint(np.clip(n[i],-1,1)*32767).astype(int),*uv[i],*np.rint(np.clip(np.r_[t[i],sign[i]],-1,1)*32767).astype(int))
        props={'name':mat,'texture':-1,'normalTexture':-1,'normalScale':0,**materials[mat]}
        parts.append({**props,'vertices':base64.b64encode(packed).decode(),'indices':base64.b64encode(np.asarray(ids,dtype='<u2').tobytes()).decode(),'count':len(ids)})
        positions.append(p)
    p=np.concatenate(positions)
    output[key]={'name':key,'parts':parts,'vertices':len(p),'triangles':sum(a['count'] for a in parts)//3,'bounds':{'min':p.min(axis=0).tolist(),'max':p.max(axis=0).tolist()}}
asset={'license':'CC0-1.0','stride':36,'models':output}
target=ROOT/'assets/interiors.js';target.write_text('/* Original models generated by tools/build_interiors.py, CC0. */\nconst InteriorAsset='+json.dumps(asset,separators=(',',':'))+';\n')
print(json.dumps({'models':{k:{'vertices':v['vertices'],'triangles':v['triangles']} for k,v in output.items()},'bytes':target.stat().st_size}))
