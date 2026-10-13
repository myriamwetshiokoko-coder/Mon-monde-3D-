const assert=require('node:assert/strict');
const Motion=require('../src/character-motion.js');
const {run,els,gl,storage}=require('./runtime.cjs');
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS',name);};
const point=(m,p)=>p.map((v,k)=>m[k]*p[0]+m[k+4]*p[1]+m[k+8]*p[2]+m[k+12]);
const distance=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
const json=code=>JSON.parse(run('JSON.stringify('+code+')'));
const palette=(body,phase,moving,pose,posture)=>json(`HumanRenderer.palette(HumanRenderer.models.${body},${phase},${moving},'${pose}',${JSON.stringify(posture)})`);
const multiply=(a,b)=>{const c=Array(16).fill(0);for(let col=0;col<4;col++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)c[col*4+row]+=a[k*4+row]*b[col*4+k];return c;};

test('Both bodies use pinned CC0 anatomical assets within a compact mobile budget',()=>{
 for(const body of ['female','male']){const m=run('HumanAssets.'+body);assert.equal(m.source,'MakeHuman CC0');assert.equal(m.sourceCommit,'a8bc2d54ff0ac92e78ff71431b1023eda42bf482');assert.equal(m.bones.length,21);assert.ok(m.count/3<14500);assert.ok(Buffer.from(m.vertices,'base64').length+Buffer.from(m.indices,'base64').length<250000);assert.ok(m.shape.eyeX>.025&&m.shape.eyeX<.04);assert.ok(m.shape.eyeZ>0&&m.shape.eyeZ<.15);}
 assert.notEqual(run('HumanAssets.female.vertices'),run('HumanAssets.male.vertices'));
});
test('New eye surfaces remain fitted to the actual head and rigidly share its joint',()=>{
 for(const body of ['female','male']){const model=run('HumanAssets.'+body),v=Buffer.from(model.vertices,'base64'),h=model.bones[6].pivot[1];let eyes=0;
  for(let o=0;o<v.length;o+=22)if(v[o+17]===1){eyes++;assert.equal(v[o+9],6);assert.equal(v[o+13],255);assert.ok(Math.abs(v.readInt16LE(o+2)/10000-h-.1045)<.03);}assert.ok(eyes>=60);
 }
});
test('Foot trajectories are continuous and the two legs alternate support',()=>{
 for(const running of [false,true]){const start=Motion.feet(0,1,running),end=Motion.feet(Math.PI*2-1e-8,1,running);for(let i=0;i<2;i++){assert.ok(Math.abs(start[i].z-end[i].z)<1e-6);assert.ok(Math.abs(start[i].lift-end[i].lift)<1e-6);}for(let n=0;n<100;n++){const feet=Motion.feet(n/100*Math.PI*2,1,running);assert.ok(feet.every(f=>f.lift>=0&&Number.isFinite(f.z)));if(!running)assert.equal(feet.filter(f=>f.stance).length,1);}}
});
test('Planted walking feet follow travelled distance without sliding backward',()=>{
 let baseline;for(const phase of [.1,.4,1,1.7,2.5,3]){const z=Motion.feet(phase,1)[0].z+phase/6.3;baseline??=z;assert.ok(Math.abs(z-baseline)<.001);}
 baseline=undefined;for(const phase of [.1,.5,1,1.8,2.5]){const z=Motion.feet(phase,1,true)[0].z+phase/4.6;baseline??=z;assert.ok(Math.abs(z-baseline)<.002);}
});
test('Gentle joystick walking also keeps the planted foot steady',()=>{for(const amount of [.25,.5,1]){let first;for(const phase of [.1,.5,1,2,3]){const worldZ=Motion.feet(phase,amount)[0].z+phase*amount/6.3;first??=worldZ;assert.ok(Math.abs(worldZ-first)<.001);}}});
test('Running has a longer stride and higher swing than walking',()=>{
 const walk=Motion.feet(0,1),runFeet=Motion.feet(0,1,true);assert.ok(runFeet[0].z>walk[0].z);assert.ok(Motion.feet(Math.PI*1.5,1,true)[0].lift>Motion.feet(Math.PI*1.5,1)[0].lift);
 assert.ok(Motion.feet(0,0).every(f=>f.z===0&&f.lift===0));
});
test('Actual skinned feet stay flat at the floor during stance for both bodies',()=>{
 for(const body of ['female','male'])for(const height of [.9,1,1.1])for(const running of [false,true])for(const phase of [.3,1.3,2.3,3.6,4.6,5.6]){
  const model=run('HumanRenderer.models.'+body),floor=.075,baseY=floor+.015-(running?.075:.055),mats=palette(body,phase,1,'',{baseY,height,floor,running}),targets=Motion.feet(phase,1,running);
  for(const [i,id]of [15,18].entries()){const foot=model.bones[id+2],p=point(mats[id+2],foot.pivot);if(targets[i].stance){assert.ok(Math.abs(baseY+p[1]*height-floor-(foot.pivot[1]+.007)*height)<.008,body+' ankle');assert.ok(Math.abs(mats[id+2][1])+Math.abs(mats[id+2][9])<1e-7);}}
 }
});
test('Locomotion preserves hip-knee and knee-ankle lengths',()=>{
 for(const body of ['female','male']){const model=run('HumanRenderer.models.'+body);for(let phase=0;phase<6.3;phase+=.2){const mats=palette(body,phase,1,'',{baseY:-.06,height:1,floor:0,running:true});for(const id of [15,18]){const p=[id,id+1,id+2].map(i=>point(mats[i],model.bones[i].pivot));for(let k=0;k<2;k++)assert.ok(Math.abs(distance(p[k],p[k+1])-distance(model.bones[id+k].pivot,model.bones[id+k+1].pivot))<1e-7);}}}
});
test('Visual breathing animates a stationary player without changing the gait phase',()=>{
 const a=palette('female',0,0,'',{baseY:.015,height:1,floor:0,clock:0}),b=palette('female',0,0,'',{baseY:.015,height:1,floor:0,clock:8});assert.notDeepEqual(a[4],b[4]);assert.deepEqual(a[15],b[15]);
});
test('Pose changes begin at the previous pose and converge within three tenths of a second',()=>{
 Motion.reset();const model=run('HumanRenderer.models.female'),idle=palette('female',1,0,''),read=palette('female',1,0,'readStand');Motion.smooth('test',model,idle,'idle',0,multiply);
 const start=Motion.smooth('test',model,read,'read',.01,multiply),half=Motion.smooth('test',model,read,'read',.16,multiply),end=Motion.smooth('test',model,read,'read',.4,multiply);
 assert.ok(start.flat().every((v,i)=>Math.abs(v-idle.flat()[i])<1e-7));assert.notDeepEqual(half,start);assert.notDeepEqual(half,end);assert.ok(end.flat().every((v,i)=>Math.abs(v-read.flat()[i])<1e-7));
});
test('Blended poses preserve bone lengths, finite matrices and connected wrists',()=>{
 for(const body of ['female','male']){Motion.reset();const model=run('HumanRenderer.models.'+body);let time=0;for(const pose of ['', 'talk','eat','cook','readStand','phone','watch'])for(let n=0;n<4;n++){
  const result=Motion.smooth('actor',model,palette(body,n,0,pose),pose,time+=.06,multiply);assert.ok(result.flat().every(Number.isFinite));for(let i=1;i<21;i++){const p=model.bones[i].parent;if(p<0)continue;assert.ok(Math.abs(distance(point(result[i],model.bones[i].pivot),point(result[p],model.bones[p].pivot))-distance(model.bones[i].pivot,model.bones[p].pivot))<1e-6,body+' bone '+i);}
 }}
});
test('Transition caches stay separate per person and reset on model changes or time rollback',()=>{
 Motion.reset();const m=run('HumanRenderer.models.female'),n=run('HumanRenderer.models.male'),a=palette('female',0,0,''),b=palette('female',0,0,'phone');Motion.smooth('a',m,a,'idle',1,multiply);Motion.smooth('a',m,b,'phone',1.1,multiply);
 for(const [id,model,pal,time]of [['b',m,b,1.1],['a',m,b,0],['a',n,palette('male',0,0,'phone'),.1]]){const result=Motion.smooth(id,model,pal,'phone',time,multiply);assert.ok(result.flat().every((v,i)=>Math.abs(v-pal.flat()[i])<1e-7));}
});
test('Studio offers walking, running, seating and phone previews without advancing life',()=>{
 run("restoreGame(null);state.time=12;state.day=3;state.money=87;$('previewBtn').onclick()");const toolbar=els.editor.children.find(e=>e.className==='studio-toolbar');assert.deepEqual(toolbar.children.slice(9).map(b=>b.textContent),['Marche','Course','Assis','Téléphone']);
 for(const [index,pose]of [[9,'walk'],[10,'run'],[11,'sit'],[12,'phone']]){toolbar.children[index].onclick();assert.equal(run('studioPose'),pose);run('avatar({moving:0});tick(1500)');assert.equal(run('state.time'),12);assert.equal(run('state.day'),3);assert.equal(run('state.money'),87);}run("$('finishEditor').onclick()");
});
test('Facial animation uses the live clock, reaches a blink and resets on a neutral face',()=>{
 const old=gl.uniform3fv,values=[];gl.uniform3fv=(key,val)=>{if(key==='faceExpression')values.push(Array.from(val));old(key,val);};
 run("editorMode=false;elapsed=5.90;HumanRenderer.draw(0,0,0,2,3,0,0,0,0,'talk',17,0,1,0,{body:'female'})");assert.ok(values.at(-1)[0]>.95);assert.ok(values.at(-1)[1]>0);assert.ok(values.at(-1)[2]>0);
 run("elapsed=0;HumanRenderer.draw(0,0,0,2,3,0,0,0,0,'',17,0,1,0,{body:'male'})");assert.deepEqual(values.at(-1),[0,0,0]);gl.uniform3fv=old;
});
test('Character previews and transitions allocate no GPU buffers or saved animation fields',()=>{
 const old=gl.createBuffer;let made=0;gl.createBuffer=()=>{made++;return old();};run('restoreGame(null);elapsed=1');const before=json('state');for(const pose of ['', 'talk','readStand','eat','cook'])run(`elapsed+=.05;HumanRenderer.draw(0,0,0,2,3,2,0,7,0,'${pose}',17,0,1,0,{body:'female',actorId:'test'})`);
 assert.equal(made,0);assert.deepEqual(json('state'),before);run('save()');const saved=JSON.parse(storage.get('monmonde3d_v2'));assert.equal(saved.appearance.actorId,undefined);assert.equal(saved.appearance.running,undefined);gl.createBuffer=old;
});
test('Necklace landmarks follow the shirt and inherit mixed torso weights',()=>{for(const body of ['female','male']){const m=run('HumanRenderer.models.'+body);assert.equal(m.necklace.length,10);for(const v of m.necklace){assert.ok(v.p.every(Number.isFinite));assert.ok(Math.abs(Object.values(v.w).reduce((s,w)=>s+w,0)-1)<1e-6);assert.ok(v.p[1]<m.garments.shirtTop&&v.p[1]>m.garments.shirtTop-.08);const shirt=Buffer.from(m.garments.shirt.vertices);let nearest=Infinity;for(let o=0;o<shirt.length;o+=22){const p=[0,2,4].map(k=>shirt.readInt16LE(o+k)/10000);nearest=Math.min(nearest,distance(p,v.p));}assert.ok(nearest<.040,body+' necklace floats off the surface');}}});
console.log('FINAL CHARACTERS V10:',count,'tests passed; native Safari FPS are not measured.');
