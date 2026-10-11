/* Original local geometry. Changes stay inside existing obstacle footprints. */
function softBoxMesh(){const v=[],segments=4;
 for(const axis of [0,1,2])for(const side of [-1,1]){
  const a=(axis+1)%3,b=(axis+2)%3;
  function p(u,w){const raw=[0,0,0];raw[axis]=side*.5;raw[a]=u;raw[b]=w;const core=raw.map(n=>Math.max(-.39,Math.min(.39,n))),delta=raw.map((n,i)=>n-core[i]),length=Math.hypot(...delta),normal=delta.map(n=>n/length);return [...core.map((n,i)=>n+normal[i]*.11),...normal];}
  for(let i=0;i<segments;i++)for(let j=0;j<segments;j++){const x=i/segments-.5,y=j/segments-.5,d=1/segments,A=p(x,y),B=p(x+d,y),C=p(x,y+d),D=p(x+d,y+d);v.push(...A,...B,...C,...B,...D,...C);}
 }return makeMesh(v);
}
function leafMesh(){const v=[],s=10,t=7;function p(i,j){const a=i/s*PI*2,b=j/t*PI,n=[Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)];return [...n,...n];}for(let j=0;j<t;j++)for(let i=0;i<s;i++)v.push(...p(i,j),...p(i+1,j),...p(i,j+1),...p(i+1,j),...p(i+1,j+1),...p(i,j+1));return makeMesh(v);}
shapes.soft=softBoxMesh();shapes.leaf=leafMesh();
const landscapeShadows=[];
// Break up large green ellipsoids into lower hedges or asymmetrical crowns.
const originalScenery=scene.slice();
for(const o of originalScenery){const [r,g,b]=o.color,m=o.m;if(o.shape!=='sphere'||g<r*1.10||g<b*1.12||m[5]<.80)continue;
 const tree=m[13]>2,rx=Math.abs(m[0]),ry=Math.abs(m[5]),rz=Math.abs(m[10]);
 o.shape='leaf';o.material=6;m[5]*=tree?.63:.40;m[13]=tree?m[13]:Math.max(.35,m[13]*.64);
 for(let i=0;i<(tree?4:2);i++){const angle=i*2.4+o.m[12]*.13,scale=tree?.55:.61,part={...o,color:o.color.map((v,k)=>Math.min(1,v*(.92+(i%3)*.045)+(k===1?.015:0))),m:modelMatrix(m[12]+Math.sin(angle)*rx*(tree?.47:.40),m[13]+(tree?(i%2?.40:-.30):.07),m[14]+Math.cos(angle)*rz*.38,rx*scale,ry*(tree?.52:.40),rz*scale)};scene.push(part);}
 if(tree)landscapeShadows.push({x:m[12],z:m[14],y:-.073,rx:rx*1.18,rz:rz*.84});
}
// Rounded upholstered pieces preserve the original dimensions, including pillows.
const padded=new Set(['cda88f','e2c6b6','f7e1d2','f0e7d9','ddb4a6','fef8ee','bd958f','ece2d7','f4d3c0']);
for(const o of scene){const c=o.color.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');if(padded.has(c)&&Math.abs(o.m[13])<1.4){if(o.shape==='sphere')for(let k=0;k<12;k++)o.m[k]*=2;o.shape='soft';o.material=2;}}
// Proper garden pots, leaves and layered flowers instead of tall lollipop stems.
for(const [id,h]of Object.entries(Town.houses)){
 const at=(x,z)=>[h.x+x,h.z+z],start=scene.length;
 for(const [x,z]of [[-4.9,4.0],[5.5,.9]]){const [xx,zz]=at(x,z);cyl('#b98a6a',xx,.19,zz,.16,.34,.16);cyl('#6d6650',xx,.36,zz,.14,.02,.14);
  for(let i=0;i<6;i++){const a=i*2.4;add('leaf','#69865b',xx+Math.cos(a)*.11,.55+(i%3)*.13,zz+Math.sin(a)*.11,.07,.22,.10);}
 }
 // A thin lamp and a pool of warm evening light beside the sofa.
 const [lx,lz]=at(-5.4,3.9);cyl('#6d6257',lx,.045,lz,.16,.05,.16);cyl('#b49670',lx,.91,lz,.023,1.74,.023);cyl('#f0ddbb',lx,1.85,lz,.24,.32,.24);cyl('#cfb98f',lx,1.69,lz,.25,.035,.25);
 for(const o of scene.slice(start)){o.homeId=id;if(o.m[13]>1.6)o.material=9;}
 for(const [x,z,rx,rz,y]of [[-3.95,2.7,1.23,.70,.078],[3.15,-3.55,1.21,1.26,.10],[.18,.53,1.03,.77,.038]]){const [xx,zz]=at(x,z);landscapeShadows.push({x:xx,z:zz,rx,rz,y});}
}
// Keep the additions in the existing shrub beds, never across a doorway.
for(const x of [-23,23])for(const z of [36,43])for(let i=0;i<5;i++){const a=i*2.4;add('leaf','#8ca379',x+Math.sin(a)*.7,.18,z+Math.cos(a)*.6,.25,.18,.31);ball(i%2?'#e4a28d':'#e9c98c',x+Math.sin(a)*.7,.36,z+Math.cos(a)*.6,.065,.075,.065);}

// Fine coplanar parquet strips alias at long distances; use the plank material instead.
scene=scene.filter(o=>!['e4d2bd','dcc4ad'].includes(o.color.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('')));
for(const o of scene)if(o.homeId&&o.shape==='cube'&&o.m[13]<=.01&&Math.abs(o.m[0])>11&&Math.abs(o.m[10])>9)o.material=1;
