const assert=require('node:assert/strict');
const {run,createRuntime}=require('./runtime.cjs');
let count=0;function test(name,fn){fn();count++;console.log('PASS',name);}
test('Four new models have finite packed geometry, bounded resources and valid tangent frames',()=>{
 assert.equal(run('FurnitureRenderer.ready'),true);const models=run('InteriorAsset.models');assert.deepEqual(Object.keys(models),['bed','dining','kitchen','fridge']);let bytes=0,triangles=0;
 for(const m of Object.values(models)){assert(m.vertices<12000);triangles+=m.triangles;
  for(const a of m.parts){const v=Buffer.from(a.vertices,'base64'),ids=Buffer.from(a.indices,'base64');bytes+=v.length+ids.length;assert.equal(v.length%36,0);assert.equal(ids.length,a.count*2);
   for(let i=0;i<ids.length;i+=2)assert(ids.readUInt16LE(i)<v.length/36);
   for(let i=0;i<v.length;i+=36){const n=[12,14,16].map(k=>v.readInt16LE(i+k)/32767),t=[28,30,32].map(k=>v.readInt16LE(i+k)/32767);assert(Math.abs(Math.hypot(...n)-1)<.0001);assert(Math.abs(Math.hypot(...t)-1)<.0001);assert(Math.abs(n.reduce((s,x,k)=>s+x*t[k],0))<.0001);for(const k of [0,4,8,20,24])assert(Number.isFinite(v.readFloatLE(i+k)));}
   assert(a.texture>=-1&&a.texture<3);assert(a.normalTexture>=-1&&a.normalTexture<3);
  }
 }assert(bytes<1000000);assert(triangles<30000);
});
test('Beds fit existing collision footprints, tables keep seat centers and kitchens keep their old sites',()=>{
 for(const id of run('Object.keys(Town.houses)'))for(let turn=0;turn<4;turn++){
  run(`state.home.layouts['${id}']={bed:{x:3.15,z:-3.55,turn:${turn}},dining:{x:.18,z:.53,turn:${turn}}}`);
  const h=run(`Town.houses['${id}']`),b=run(`FurnitureRenderer.bounds('${id}','bed')`),c=run(`FurnitureCore.bounds(state,'bed','${id}')`);assert(b.min[0]-h.x>=c[0]);assert(b.max[0]-h.x<=c[1]);assert(b.min[2]-h.z>=c[2]);assert(b.max[2]-h.z<=c[3]);
  for(const key of ['bed','dining']){const m=run(`FurnitureRenderer.placement('${id}','${key}')`),p=run(`FurnitureCore.placement(state,'${key}','${id}')`);assert.equal(m[12],h.x+p.x);assert.equal(m[14],h.z+p.z);}
 }
 assert(run("scene.some(o=>o.interiorKey==='kitchen')"));assert(run("staticBatches.some(b=>b.interiorKey==='fridge'&&b.foreground==='home-fridge')"));
 const k=run('InteriorAsset.models.kitchen.bounds');assert(k.min[0]>=-5.81&&k.max[0]<=-1);assert(k.max[2]<=-3.45);assert(k.max[1]<2.2);
});
test('Shared buffers render without allocations or state mutations and old valid layouts restore',()=>{
 const r=createRuntime({money:654,home:{residence:'soleil',theme:2,layouts:{soleil:{dining:{x:-3.5,z:-1.25,turn:0},bed:{x:.25,z:.3,turn:0},sofa:{x:3.3,z:-3.5,turn:2}}}}});
 const before=r.run('JSON.stringify(state)');let allocations=0;const old=r.gl.createBuffer;r.gl.createBuffer=()=>{allocations++;return old()};
 r.run("var interiorTestEye=[0,2.5,6],interiorTestVP=mul(perspective(PI/3,1,.1,100),lookAt(interiorTestEye,[0,.6,0]));for(let i=0;i<12;i++){FurnitureRenderer.draw(interiorTestEye,interiorTestVP);FurnitureRenderer.drawFaded()}");assert.equal(allocations,0);assert.equal(r.run('JSON.stringify(state)'),before);
 r.run('save();restoreGame(JSON.parse(localStorage.getItem("monmonde3d_v2")))');assert.equal(r.run('state.money'),654);assert.equal(r.run('state.home.layouts.soleil.bed.x'),.25);assert.equal(r.run('state.home.layouts.soleil.dining.x'),-3.5);assert.equal(r.run('state.home.theme'),2);
});
test('The detailed fridge defers its translucent pass and draws it only once',()=>{
 const r=createRuntime();const opacities=[];let draws=0;r.gl.uniform1f=(name,v)=>{if(name==='opacity')opacities.push(v)};r.gl.drawElements=()=>draws++;
 r.run("state.x=-3.3;state.z=-1.2;var fridgeEye=[-3.7,2,.2],fridgeVP=mul(perspective(PI/2,1,.1,100),lookAt(fridgeEye,[-5.35,1.2,-2.45]));FurnitureRenderer.draw(fridgeEye,fridgeVP,new Set(['home-fridge']))");const before=draws;assert(!opacities.includes(.16));r.run('FurnitureRenderer.drawFaded()');assert(opacities.includes(.16));assert.equal(draws-before,r.run('InteriorAsset.models.fridge.parts.length'));const after=draws;r.run('FurnitureRenderer.drawFaded()');assert.equal(draws,after);
});
test('A rejected new shader retains the old furniture and a usable game frame',()=>{
 const r=createRuntime(null,{rejectFurniture:true});assert.equal(r.run('FurnitureRenderer.ready'),false);assert.equal(r.run("FurnitureRenderer.replaces('soleil','bed')"),false);assert(r.run("staticBatches.some(b=>b.builtin==='bed')"));assert(r.run("staticBatches.some(b=>b.interiorKey==='kitchen')"));r.run('started=true;paused=false;tick(16);tick(32)');assert.equal(r.run('state.money'),120);
});
test('Upper cabinets follow the back wall cutaway rather than obscuring a cooking view',()=>{
 const r=createRuntime();let draws=0;r.gl.drawElements=()=>draws++;
 r.run("FurnitureRenderer.preview('kitchen',[0,2,0],mIdentity())");const front=draws;draws=0;
 r.run("FurnitureRenderer.preview('kitchen',[0,2,-5.5],mIdentity())");assert.equal(front-draws,3);
});
console.log('FINAL INTERIORS:',count,'tests passed');
