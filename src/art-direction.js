/* Designed interiors replace the original blocks inside the same playable footprints. */
function bevelBoxMesh(){const out=[],grid=[-.5,-.475,0,.475,.5],r=.025;for(let axis=0;axis<3;axis++)for(const side of [-1,1])for(let i=0;i<4;i++)for(let j=0;j<4;j++){const sample=(u,v)=>{const p=[0,0,0];p[axis]=side*.5;p[(axis+1)%3]=u;p[(axis+2)%3]=v;const core=p.map(v=>Math.max(-.5+r,Math.min(.5-r,v))),d=p.map((v,k)=>v-core[k]),n=d.map(v=>v/(Math.hypot(...d)||1));return [...core.map((v,k)=>v+n[k]*r),...n];};const a=sample(grid[i],grid[j]),b=sample(grid[i+1],grid[j]),c=sample(grid[i],grid[j+1]),d=sample(grid[i+1],grid[j+1]);for(const v of [a,b,c,b,d,c])out.push(...v);}return makeMesh(out);}
shapes.bevel=bevelBoxMesh();
function foliageMesh(){const out=[];for(let i=0;i<28;i++){const a=i*2.39996,z=-.85+1.7*(i+.5)/28,r=Math.sqrt(1-z*z)*.80,c=[Math.cos(a)*r,z,Math.sin(a)*r],yaw=a*.7,pitch=Math.sin(i*1.3)*.8,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),at=(x,y,z)=>[c[0]+cy*x+sy*(sp*y+cp*z),c[1]+cp*y-sp*z,c[2]-sy*x+cy*(sp*y+cp*z)],p=[at(0,-.23,0),at(-.11,0,.015),at(0,0,.045),at(.11,0,.015),at(0,.23,0)],n=[sy*cp,-sp,cy*cp];for(const tri of [[0,1,2],[0,2,3],[1,4,2],[2,4,3]])for(const side of [1,-1])for(const id of side===1?tri:tri.slice().reverse())out.push(...p[id],...n.map(v=>v*side));}return makeMesh(out);}
shapes.crown=foliageMesh();
const InteriorArt=(()=>{
 const made=[];
 function addPart(home,builtin,shape,color,x,y,z,w,h,d,material=0,turn=0){const start=scene.length;add(shape,color,home.x+x,y,home.z+z,w,h,d,turn);const o=scene[start];Object.assign(o,{homeId:home.id,builtin,material});made.push(o);return o;}
 const trim=(home,builtin,color,x,y,z,w,h,d,mat=1)=>addPart(home,builtin,'cube',color,x,y,z,w,h,d,mat);
 const pad=(home,builtin,color,x,y,z,w,h,d)=>addPart(home,builtin,'soft',color,x,y,z,w,h,d,2);
 // Reuse the same furniture tags so arranging, sitting and collisions still agree.
 scene=scene.filter(o=>!['bed','sofa','dining'].includes(o.builtin));
 for(const [id,data]of Object.entries(Town.houses)){const home={...data,id},studio=id==='studio',apartment=data.type==='apartment',wood=apartment?'#a1886c':'#94785c',linen=studio?'#c4c8bf':id==='horizon'?'#b4bfc2':'#c4b4a2';
  const sofa='sofa',sx=-3.95,sz=2.7;trim(home,sofa,'#51483f',sx,.18,sz,2.29,.18,1.13);
  for(const dx of [-1.02,1.02])for(const dz of [-.45,.45])addPart(home,sofa,'cyl','#554c40',sx+dx,.13,sz+dz,.045,.25,.045,1);
  pad(home,sofa,linen,sx,.39,sz,2.22,.28,1.05);for(const dx of [-.55,.55]){pad(home,sofa,'#e4ddd1',sx+dx,.56,sz-.09,1.02,.16,.83);pad(home,sofa,linen,sx+dx,.82,sz+.46,1.035,.62,.21);trim(home,sofa,'#9b998e',sx+dx,.615,sz-.43,.97,.012,.017,2);}
  for(const dx of [-1.12,1.12]){pad(home,sofa,linen,sx+dx,.58,sz,.17,.58,1.05);trim(home,sofa,wood,sx+dx,.19,sz,.12,.06,1.04);}
  for(const [dx,color]of [[-.79,'#82988a'],[.78,'#c99f82']])pad(home,sofa,color,sx+dx,.78,sz+.21,.39,.35,.14);
  const bed='bed',bx=3.15,bz=-3.55;trim(home,bed,wood,bx,.61,bz,2.30,.36,2.36);trim(home,bed,wood,bx,.81,bz-1.18,2.32,1.19,.11);pad(home,bed,'#d3c9b8',bx,.97,bz-1.105,2.16,.84,.10);for(const dx of [-.76,-.25,.25,.76])trim(home,bed,'#b6aa98',bx+dx,.97,bz-1.17,.016,.72,.018,2);
  pad(home,bed,'#f3eee4',bx,.88,bz,2.20,.17,2.26);pad(home,bed,'#e9e4d7',bx,.985,bz+.27,2.21,.06,1.57);pad(home,bed,id==='horizon'?'#82999f':studio?'#97a48d':'#bfa894',bx,1.025,bz+.56,2.24,.035,.88);for(const dx of [-.58,.58])pad(home,bed,'#faf3e7',bx+dx,1.01,bz-.77,.91,.14,.48);
  for(const dx of [-1.03,1.03])for(const dz of [-1.03,1.03])addPart(home,bed,'cyl','#605548',bx+dx,.20,bz+dz,.046,.30,.046,1);
  const table='dining',tx=.18,tz=.53;addPart(home,table,'soft',wood,tx,.76,tz,1.78,.095,1.14,1);trim(home,table,'#443d36',tx,.38,tz,.085,.73,.085,5);addPart(home,table,'soft','#5b5449',tx,.075,tz,.82,.10,.66,5);
  for(const [cx,cz,a]of [[-1.22,.53,PI/2],[1.49,.53,-PI/2]]){const o=addPart(home,table,'soft','#b6bcb2',cx,.40,cz,.47,.11,.50,2,a);addPart(home,table,'soft','#b6bcb2',cx+(cx<0?-.19:.19),.65,cz,.075,.57,.48,2);for(const dx of [-.17,.17])for(const dz of [-.16,.16])addPart(home,table,'cyl','#746451',cx+dx,.20,cz+dz,.02,.38,.02,1);}
  // An open book, bowl and vase give the dining room a purpose without blocking it.
  trim(home,table,'#e7dcc9',tx-.34,.818,tz+.12,.29,.015,.22,2);trim(home,table,'#a29073',tx-.34,.831,tz+.12,.28,.014,.018,1);addPart(home,table,'cyl','#b4bbaa',tx+.34,.856,tz-.10,.095,.09,.095,4);
 }
 // Refine wall/window materials and palettes without changing doors or collision plans.
 for(const o of scene){if(o.shape==='leaf'&&o.m[13]>2)o.shape='crown';if(o.shape==='cyl'&&o.color.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('')==='3a3638'){o.m[0]*=.33;o.m[10]*=.33;}}
 const softWalls=new Set(['ead3c7','dfc5b8','c1c4ba','b5beb8']);
 for(const o of scene){const hexKey=o.color.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');if(softWalls.has(hexKey)){o.color=hex('#e5e1d7');o.material=0;}if(['a9cbd0','a6ced2','9ec5cc','a3bbc0'].includes(hexKey)){o.color=hex('#8ea6ae');o.material=8;}if(o.shape==='cube'&&o.homeId&&Math.abs(o.m[12]-Town.houses[o.homeId].x)<6.3&&o.m[13]>.3&&o.m[5]<1.2&&!o.builtin&&!o.roof){if(['d4b7a0','e9b6a2','e1c9b5'].includes(hexKey)){o.shape='bevel';o.color=hex('#c8c6b9');o.material=4;}if(hexKey==='faf2e9'){o.color=hex('#e5e0d5');o.material=4;}}}
 // Every home has believable window casings, skirting, power sockets and kitchen fronts.
 for(const [id,h]of Object.entries(Town.houses)){const home={...h,id},start=scene.length;
  const ceiling=addPart(home,null,'cube','#edece2',0,3.14,0,11.75,.025,9.85,0);ceiling.roof=true;ceiling.cutSide='roof';
  for(const x of [-6,6])trim(home,null,'#b7b0a2',x,.12,0,.055,.13,9.8,1);
  trim(home,null,'#b7b0a2',0,.12,-4.93,11.7,.13,.055,1);
  for(const cx of [-3.35,3.35]){for(const dx of [-1.12,1.12])trim(home,null,'#e9e9df',cx+dx,1.70,5.30,.065,1.33,.085,5);for(const y of [1.065,2.335])trim(home,null,'#e9e9df',cx,y,5.30,2.3,.065,.085,5);trim(home,null,'#d2cabb',cx,1.05,5.32,2.45,.07,.20,4);}
  const cabinetStart=scene.length;for(const x of [-5.13,-4.17,-3.22,-2.28]){trim(home,null,'#b9b9ae',x,.48,-3.465,.87,.75,.025,4);trim(home,null,'#7f7d70',x,.71,-3.435,.29,.025,.03,5);}
  for(const o of scene.slice(cabinetStart))o.interiorKey='kitchen';
  const fridgeStart=scene.length,fridgeTag=scene.find(o=>o.homeId===id&&o.foreground&&o.foreground.includes('fridge'))?.foreground;
  addPart(home,null,'bevel','#c4c7be',-5.35,1.69,-1.903,1.02,1.30,.045,4);addPart(home,null,'bevel','#c4c7be',-5.35,.54,-1.903,1.02,.91,.045,4);trim(home,null,'#71766e',-5.35,1.015,-1.875,1.0,.013,.021,5);
  for(const y of [.63,1.63])trim(home,null,'#777c71',-4.94,y,-1.858,.028,.26,.026,5);for(const o of scene.slice(fridgeStart)){o.foreground=fridgeTag;o.interiorKey='fridge';}
  addPart(home,null,'bevel','#343b39',-2.40,1.043,-3.95,1.10,.026,.61,5).interiorKey='kitchen';
  for(const x of [-4.9,4.5]){trim(home,null,'#e7e4d9',x,.34,-4.885,.08,.085,.026,4);trim(home,null,'#6f726d',x,.34,-4.868,.008,.027,.01,5);}
  if(id==='studio'){trim(home,null,'#a3ad9e',5.70,1.33,-3.2,.10,1.36,1.78,2);for(const z of [-3.72,-2.86])trim(home,null,'#6c756b',5.635,1.33,z,.02,.023,.70,5);}
  if(id==='horizon'){trim(home,null,'#91a5a4',5.91,1.34,.50,.025,.68,1.26,2);for(let i=0;i<3;i++)trim(home,null,['#b4c4b4','#cfb893','#b29c8f'][i],5.887,1.45,.04+i*.35,.015,.31,.22,2);}
  for(const o of scene.slice(start))o.homeId=id;
 }

 // Apartment façades have an upper storey and balcony, with a cutaway for play inside.
 for(const id of ['studio','horizon']){const h=Town.houses[id],home={...h,id},start=scene.length;
  for(const x of [-4.0,0,4.0]){trim(home,null,'#b7bdb7',x,4.45,5.10,3.55,2.30,.16,0);trim(home,null,'#91a7ac',x,4.50,5.195,1.75,1.18,.035,8);for(const side of [-1,1])trim(home,null,'#dddcd3',x+side*.91,4.50,5.22,.055,1.25,.06,5);}
  trim(home,null,'#7a8380',0,5.68,0,12.8,.17,10.8,4);trim(home,null,'#ccc9bc',0,3.42,5.52,11.8,.12,.95,4);
  for(const x of [-5.8,-3.8,-1.8,.2,2.2,4.2,5.8])trim(home,null,'#696f6b',x,3.90,5.96,.027,.92,.027,5);trim(home,null,'#696f6b',0,4.36,5.96,11.6,.035,.035,5);
  for(const o of scene.slice(start)){o.apartmentStorey=true;o.cutSide='upper';o.roof=true;}
 }
 for(const o of scene){if(!o.homeId)continue;const h=Town.houses[o.homeId],x=o.m[12]-h.x,z=o.m[14]-h.z;
  if(o.apartmentStorey)continue;
  if(o.roof||(o.m[13]>3.15&&Math.abs(o.m[0])>9&&Math.abs(o.m[10])>9)){o.roof=true;o.cutSide='roof';continue;}
  if(o.m[13]>1.25){if(Math.abs(x)>5.8&&Math.abs(x)<6.4)o.cutSide=x<0?'left':'right';else if(z>4.85&&z<5.4)o.cutSide='front';else if(z<-4.8)o.cutSide='back';}
 }
 return {parts:made.length};
})();
