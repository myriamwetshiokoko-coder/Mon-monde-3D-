const assert=require('node:assert/strict');
const {run,createRuntime}=require('./runtime.cjs');
let count=0;function test(name,fn){fn();count++;console.log('PASS',name);}
test('Aurore uploads once with bounded geometry, textures and valid tangent frames',()=>{
 assert.equal(run('FurnitureRenderer.ready'),true);
 const a=run('AuroreAsset');assert.equal(a.parts.length,6);assert(a.triangles<=16000);assert(a.vertices<=10000);
 let total=0;
 for(const p of a.parts){const v=Buffer.from(p.vertices,'base64'),indices=Buffer.from(p.indices,'base64');total+=v.length+indices.length;assert.equal(v.length%36,0);assert.equal(indices.length,p.count*2);
  for(let i=0;i<indices.length;i+=2)assert(indices.readUInt16LE(i)<v.length/36);
  for(let i=0;i<v.length;i+=36){const n=[12,14,16].map(k=>v.readInt16LE(i+k)/32767),t=[28,30,32].map(k=>v.readInt16LE(i+k)/32767);assert(Math.abs(Math.hypot(...n)-1)<.0001);assert(Math.abs(Math.hypot(...t)-1)<.0001);assert(Math.abs(n.reduce((s,x,k)=>s+x*t[k],0))<.0001);assert.equal(Math.abs(v.readInt16LE(i+34)),32767);for(const k of [0,4,8,20,24])assert(Number.isFinite(v.readFloatLE(i+k)));}
 }
 for(const t of a.textures){assert.equal(t.width,128);assert.equal(t.height,128);assert.equal(Buffer.from(t.pixels,'base64').length,128*128*4);total+=128*128*4;}
 assert(total<650000);
});
test('Detailed geometry fits unchanged collision footprints at all four rotations in five homes',()=>{
 for(const id of run('Object.keys(Town.houses)'))for(let turn=0;turn<4;turn++){
  run(`state.home.layouts['${id}']={sofa:{x:-3.95,z:2.7,turn:${turn}}}`);
  const m=run(`FurnitureRenderer.placement('${id}')`),b=run(`FurnitureCore.bounds(state,'sofa','${id}')`),h=run(`Town.houses['${id}']`),a=run('AuroreAsset.bounds');
  for(const x of [a.min[0],a.max[0]])for(const z of [a.min[2],a.max[2]]){const px=m[0]*x+m[8]*z+m[12]-h.x,pz=m[2]*x+m[10]*z+m[14]-h.z;assert(px>=b[0]&&px<=b[1]);assert(pz>=b[2]&&pz<=b[3]);}
 }
});
test('Near detailed sofas, distant fallback and saved placement remain separate from simulation',()=>{
 const r=createRuntime({name:'Test Aurore',money:654,home:{residence:'soleil',theme:1,layouts:{soleil:{dining:{x:-3.5,z:-1.25,turn:0},bed:{x:.25,z:.3,turn:0},sofa:{x:3.3,z:-3.5,turn:2}}}}});
 r.run('state.x=3.3;state.z=-1.35');assert(r.run("FurnitureRenderer.replaces('soleil')"));assert.equal(r.run('state.home.layouts.soleil.sofa.turn'),2);
 const before=r.run('JSON.stringify(state)');r.run('FurnitureRenderer.draw([3.3,2,-1.35],null)');assert.equal(r.run('JSON.stringify(state)'),before);
 r.run('save();restoreGame(JSON.parse(localStorage.getItem("monmonde3d_v2")))');assert.equal(r.run('state.money'),654);assert.equal(r.run('state.home.layouts.soleil.sofa.x'),3.3);assert.equal(r.run('state.home.theme'),1);
 r.run('state.x=48;state.z=48');assert.equal(r.run("FurnitureRenderer.replaces('soleil')"),false);assert(r.run("staticBatches.some(b=>b.homeId==='soleil'&&b.builtin==='sofa')"));
});
console.log('FINAL AURORE:',count,'tests passed');
