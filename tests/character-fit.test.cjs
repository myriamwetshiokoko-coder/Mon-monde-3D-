const assert=require('node:assert/strict');
const Life=require('../src/core.js'),Control=require('../src/home-control.js');
const {run,els,gl,storage,createRuntime}=require('./runtime.cjs');
let count=0;
function test(name,fn){fn();count++;console.log('PASS',name);}
const values=[],oldUniform=gl.uniform1f;
gl.uniform1f=(key,value)=>{if(key==='bust')values.push(value);oldUniform(key,value);};
const draw=appearance=>run(`HumanRenderer.setView(modelMatrix(0,0,0,1,1,1,0));HumanRenderer.draw(0,0,.7,2,3,2,0,0,2,'talk',3,0,1,0,${JSON.stringify(appearance)})`);

test('Legacy bodies get a neutral bust setting and invalid imports stay bounded',()=>{
 assert.equal(Life.restore(null).appearance.bust,.5);
 for(const [value,want] of [[undefined,.5],[0,0],[1,1],[-4,0],[7,1],[NaN,.5],[Infinity,.5],['bad',.5]])
  assert.equal(Life.restore({appearance:{bust:value}}).appearance.bust,want);
});
test('Live adult bust controls are saved and restored without resetting the family',()=>{
 run("restoreGame(null);state.money=83;state.family.children=[{id:'child0',name:'Test',bornDay:1,hunger:73,comfort:81,fun:64,skin:2,arrival:'birth',arrivalSeen:true}];state.family.pregnancy={carrierId:'player',startedDay:1,dueDay:4,name:'Test'};state.style=17;state.hair=6");
 els.bust.oninput({target:{value:'.8'}});run('save()');
 const fresh=createRuntime(JSON.parse(storage.get('monmonde3d_v2')));
 assert.equal(fresh.run('state.appearance.bust'),.8);assert.equal(fresh.run('state.money'),83);
 assert.equal(fresh.run('state.style'),17);assert.equal(fresh.run('state.hair'),6);
 assert.equal(fresh.run('state.family.children[0].hunger'),73);assert.equal(fresh.run('state.family.children[0].arrivalSeen'),true);
 assert.equal(fresh.run('state.family.pregnancy.dueDay'),4);assert.equal(Number(fresh.els.bust.value),.8);
});
test('Each playable adult keeps their own setting across control switches and a fresh save',()=>{
 let s=Life.restore(null);s.appearance.bust=.2;Control.create(s,'female',Life);Control.switchMember(s,Life);s.appearance.bust=.9;
 s=Life.restore(JSON.parse(JSON.stringify(s)));Control.switchMember(s,Life);assert.equal(s.appearance.bust,.2);
 assert.equal(Control.person(s).features.bust,.9);Control.switchMember(s,Life);assert.equal(s.appearance.bust,.9);
});
test('Morphology and age show the fitting control only on a female adult without losing its value',()=>{
 run('restoreGame(null);state.appearance.bust=.7;syncAppearance()');assert.equal(els.bustField.hidden,false);
 els.bodyType.onchange({target:{value:'male'}});assert.equal(els.bustField.hidden,true);assert.equal(els.bust.disabled,true);
 els.bust.oninput({target:{value:'.1'}});assert.equal(run('state.appearance.bust'),.7);
 els.bodyType.onchange({target:{value:'female'}});assert.equal(els.bustField.hidden,false);
 els.startAge.onchange({target:{value:'12'}});assert.equal(els.bustField.hidden,true);
 els.bust.oninput({target:{value:'.1'}});assert.equal(run('state.appearance.bust'),.7);
 els.startAge.onchange({target:{value:'24'}});assert.equal(els.bustField.hidden,false);assert.equal(Number(els.bust.value),.7);
});
test('GPU chest volume resets between adults, male bodies and children',()=>{
 values.length=0;
 for(const appearance of [{body:'female',age:24,bust:0},{body:'female',age:24,bust:1},{body:'male',age:24,bust:1},{body:'female',age:6,bust:1},{body:'female',age:17,bust:1},{body:'female',age:18,bust:.5},{body:'female',age:24}])draw(appearance);
 assert.equal(values.length,7);for(const [i,want]of [.006,.031,0,0,0,.0185,.0185].entries())assert.ok(Math.abs(values[i]-want)<1e-12);
});
test('The actual game and studio pass the selected age to the renderer',()=>{
 run('restoreGame(null);state.age=12;state.appearance.bust=1');values.length=0;run('avatar({moving:0})');assert.equal(values.pop(),0);
 run("$('previewBtn').onclick();avatar({moving:0})");assert.equal(values.pop(),0);
 run("$('finishEditor').onclick();state.age=24;avatar({moving:0})");assert.equal(values.pop(),.031);
});
test('The two child rendering paths suppress the new adult displacement',()=>{
 run("restoreGame(null);state.day=6;state.family.children=[{id:'child0',name:'Test',bornDay:1,skin:2,hunger:80,comfort:80,fun:80}]");
 values.length=0;run('drawFamily()');assert.ok(values.length>0);assert.ok(values.every(x=>x===0));
 values.length=0;run('state.x=27;state.z=10;drawFamily()');assert.ok(values.length>=2);assert.ok(values.every(x=>x===0));
});
test('Makeup and expressions are bound to each skinned draw and reset on the next face',()=>{
 const old=gl.uniform3fv,colors=[];gl.uniform3fv=(key,data)=>{if(key==='faceCosmetics')colors.push(Array.from(data));old(key,data);};
 draw({body:'female',makeup:.8});run("HumanRenderer.draw(0,0,0,2,3,2,0,0,0,'',3,0,1,0,{body:'male'})");
 gl.uniform3fv=old;assert.equal(colors.length,2);assert.equal(colors[0][0],.8);assert.ok(colors[0][1]>0);assert.ok(colors[0][2]>0);assert.deepEqual(colors[1],[0,0,0]);
});
test('All generated garments retain normalized weights and finite normal vectors after finer cloth sampling',()=>{
 for(const body of ['female','male'])for(const [key,g] of Object.entries(run(`HumanRenderer.models.${body}.garments`))){
  if(key==='shirtTop')continue;const v=Buffer.from(g.vertices);assert.ok(v.length<220000,key);
  assert.ok(Array.from(g.indices).every(i=>i<v.length/22));
  for(let o=0;o<v.length;o+=22){assert.equal(v[o+13]+v[o+14]+v[o+15]+v[o+16],255);assert.ok(Math.abs(Math.hypot(v.readInt8(o+6),v.readInt8(o+7),v.readInt8(o+8))/127-1)<.025,key);}
 }
});
test('Collar vertices lie within a few millimetres of the real shirt triangles on both bodies',()=>{
 for(const body of ['female','male']){
  const model=run(`HumanRenderer.models.${body}`),shirt=model.garments.shirt,collar=Buffer.from(model.garments.collar.vertices),v=Buffer.from(shirt.vertices);
  const pos=i=>[0,2,4].map(k=>v.readInt16LE(i*22+k)/10000);
  for(let o=0;o<collar.length;o+=22){const [x,y,z]=[0,2,4].map(k=>collar.readInt16LE(o+k)/10000);let front=-Infinity;
   for(let i=0;i<shirt.indices.length;i+=3){const [a,b,c]=[shirt.indices[i],shirt.indices[i+1],shirt.indices[i+2]].map(pos),det=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(det)<1e-12)continue;
    const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/det,w=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/det,t=1-u-w;
    if(Math.min(u,w,t)>=-1e-6)front=Math.max(front,u*a[2]+w*b[2]+t*c[2]);
   }
   assert.ok(Number.isFinite(front),body+' collar reaches shirt');assert.ok(z-front>=0&&z-front<.005,body+' collar gap '+(z-front));
  }
 }
});
test('The actual shirt shoulders stay within cloth thickness of the animated body',()=>{
 for(const body of ['female','male']){
  const model=run(`HumanRenderer.models.${body}`),skin=Buffer.from(model.surfaceVertices),shirt=Buffer.from(model.garments.shirt.vertices),pairs=[],seen=new Set();
  const point=(v,o)=>[0,2,4].map(k=>v.readInt16LE(o+k)/10000),weights=(v,o)=>{const w=Array(21).fill(0);for(let j=0;j<4;j++)w[v[o+9+j]]+=v[o+13+j]/255;return w;};
  const clothes=Array.from({length:shirt.length/22},(_,i)=>({p:point(shirt,i*22),w:weights(shirt,i*22)}));
  for(let o=0;o<skin.length;o+=22){const p=point(skin,o),key=p.join(',');if(skin[o+17]!==2||Math.abs(p[0])<.14||Math.abs(p[0])>.28||p[1]<1.39||p[1]>1.48||seen.has(key))continue;seen.add(key);
   const w=weights(skin,o),near=clothes.filter(v=>v.w.every((value,j)=>Math.abs(value-w[j])<.0041)).sort((a,b)=>Math.hypot(...a.p.map((x,j)=>x-p[j]))-Math.hypot(...b.p.map((x,j)=>x-p[j])))[0];
   assert.ok(near,body+' shoulder has matching cloth joints');assert.ok(Math.hypot(...near.p.map((x,j)=>x-p[j]))<.0125,body+' continuous shoulder');pairs.push([{p,w},near]);
  }
  assert.ok(pairs.length>20);
  for(const pose of ['', 'talk','eat','readStand','cook']){
   const m=run(`HumanRenderer.palette(HumanRenderer.models.${body},1.57,0,'${pose}')`),skinPoint=v=>[0,1,2].map(k=>v.w.reduce((sum,w,j)=>sum+w*(m[j][k]*v.p[0]+m[j][4+k]*v.p[1]+m[j][8+k]*v.p[2]+m[j][12+k]),0));
   for(const [a,b]of pairs){const x=skinPoint(a),y=skinPoint(b);assert.ok(Math.hypot(...x.map((v,j)=>v-y[j]))<.02,body+' '+pose+' opens shoulder');}
  }
 }
});
test('Both jacket cuffs reach their own wrist and match the skin masking limit',()=>{
 const old=gl.uniform1f,cuffs=[];gl.uniform1f=(name,value)=>{if(name==='sleeveEnd')cuffs.push(value);old(name,value);};
 for(const body of ['female','male']){
  const model=run(`HumanRenderer.models.${body}`),cloth=Buffer.from(model.garments.jacket.vertices),want=Math.abs(model.bones[10].pivot[0])-.015;let far=0;
  for(let o=0;o<cloth.length;o+=22)far=Math.max(far,Math.abs(cloth.readInt16LE(o)/10000));
  assert.ok(far>=want-.004,body+' incomplete cuff');draw({body,age:24});assert.ok(Math.abs(cuffs.pop()-want)<1e-7);
 }
 gl.uniform1f=old;
});
test('Fitting and facial changes do not allocate face buffers during animation',()=>{
 const old=gl.createBuffer;let buffers=0;gl.createBuffer=()=>{buffers++;return old();};
 for(const body of ['female','male'])for(const pose of ['','talk','readStand','eat','cook','sleep'])for(const bust of [0,1])
  run(`HumanRenderer.draw(0,0,.7,2,3,2,0,5,2,'${pose}',17,0,1,0,{body:'${body}',age:24,bust:${bust},makeup:1,jaw:-1,nose:1,brows:1,lips:1})`);
 gl.createBuffer=old;assert.equal(buffers,0);
});
gl.uniform1f=oldUniform;
console.log('FINAL CHARACTER FIT:',count,'tests passed; native Safari and FPS remain unmeasured.');
