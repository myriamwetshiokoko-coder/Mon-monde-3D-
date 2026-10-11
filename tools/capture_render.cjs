/* Capture the game's real draw commands for offscreen GLES inspection, without a browser.
   node tools/capture_render.cjs /tmp/frame.json studio:female:0:walk
   Scenes: street, bedroom, garden, cafe, conversation, home:<id>, partner-work,
   furniture, family, foyer, studio:<body>:<style>:<pose>:<hair>. Synthetic saves only. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),commands=[];
let serial=1,attribute=0;
const constants={ARRAY_BUFFER:34962,ELEMENT_ARRAY_BUFFER:34963,STATIC_DRAW:35044,VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,MAX_VERTEX_UNIFORM_VECTORS:36347,FLOAT:5126,SHORT:5122,BYTE:5120,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123,TRIANGLES:4,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,DEPTH_TEST:2929,LEQUAL:515,CULL_FACE:2884,BLEND:3042,SRC_ALPHA:770,ONE_MINUS_SRC_ALPHA:771};
const pack=x=>ArrayBuffer.isView(x)?{bytes:Buffer.from(x.buffer,x.byteOffset,x.byteLength).toString('base64'),type:x.constructor.name}:x;
const gl=new Proxy(constants,{get:(o,k)=>{
 if(k in o)return o[k];
 return (...args)=>{
  if(k==='getParameter')return 512;
  if(k==='getShaderParameter'||k==='getProgramParameter')return true;
  if(k==='getShaderInfoLog'||k==='getProgramInfoLog')return '';
  let result;
  if(k.startsWith('create'))result={id:serial++};
  if(k==='getAttribLocation')result=attribute++;
  if(k==='getUniformLocation')result={id:serial++};
  commands.push([k,args.map(pack),result]);return result;
 };
}});
const els={};function element(){return {style:{},children:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},handlers:{},addEventListener(k,fn){(this.handlers[k]??=[]).push(fn)},setAttribute(){},setPointerCapture(){},append(...c){this.children.push(...c)},replaceChildren(){this.children=[]},remove(){},focus(){},getBoundingClientRect(){return {left:0,top:0,width:0,height:0}},querySelector(){return element()}}}
for(const m of html.matchAll(/<[^>]+id="([^"]+)"[^>]*>/g)){els[m[1]]=element();els[m[1]].hidden=/\bhidden\b/.test(m[0])}
els.world.getContext=()=>gl;
const ctx={console,Math,JSON,Number,Float32Array,Uint8Array,Map,Blob,URL,atob:s=>Buffer.from(s,'base64').toString('binary'),setTimeout:()=>0,clearTimeout(){},innerWidth:393,innerHeight:700,devicePixelRatio:1,performance:{now:()=>0},requestAnimationFrame(){},window:{addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},document:{body:element(),hidden:false,getElementById:id=>els[id],createElement:()=>element(),addEventListener(){}},location:{reload(){}}};
vm.createContext(ctx);for(const m of html.matchAll(/<script src="([^"]+)"/g)){const f=m[1].split('?')[0];vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f})}
const run=s=>vm.runInContext(s,ctx),scene=process.argv[3]||'street';
run("started=true;paused=false;state.time=10;state.skin=skin=2;state.outfit=outfit=3;state.settings.quality=quality=1;state.x=0;state.z=18;camYaw=.8;smoothEye=null;state.name='Personnage test'");

if(scene==='sunset'||scene==='night-street')run(`state.time=${scene==='sunset'?18.4:23};camYaw=.8;`);
if(scene==='focus-cook')run("state.appearance.body='female';state.hair=6;state.style=7;state.x=-3.3;state.z=-3.0;beginAction({cook:true,recipe:'simple',name:'Cuisine',verb:'Cuisiner',pose:'cook'});activity.t=13;updateNeighbourhood(0);$('observeActivity').onclick()");
if(scene==='focus-read')run("state.appearance.body='female';state.hair=5;state.style=6;state.x=-3.7;state.z=1.4;beginAction(readingAction('novel',[Town.home(state).x-3.55,2.65,Math.PI,.18]));$('observeActivity').onclick()");
if(scene==='focus-work')run("state.appearance.body='male';state.hair=0;state.career={job:'cafe',completed:0,shift:{job:'cafe',day:1,step:1}};state.x=-14;state.z=31.4;state.time=10;beginAction({shiftTask:1,name:'Poste de travail',verb:'Préparer les commandes',pose:'cook',seconds:8});$('observeActivity').onclick()");
if(scene==='focus-conversation')run("state.x=0;state.z=25;residents[1].x=1.25;residents[1].z=25;state.time=15;beginAction({npc:'noah',pose:'talk',verb:'Discussion',seconds:10});updateResidents(.05);$('observeActivity').onclick()");
if(scene==='bedroom')run('state.x=.1;state.z=-2;camYaw=.22;camPitch=.34');
if(scene==='garden')run("state.x=-3;state.z=13;camYaw=.5;activity={name:'Potager',pose:'garden',t:0,seconds:5}");
if(scene==='cafe')run("state.x=-12;state.z=31.4;state.time=9;camYaw=0;camPitch=.4;activity={name:'Café Fleur',pose:'eat',anchor:[-9.5,30,Math.PI,0],t:0,seconds:5}");
if(scene==='conversation')run("state.x=0;state.z=25;residents[1].x=1.25;residents[1].z=25;state.time=15;camYaw=0;camZoom=4.4;camPitch=.3;beginAction({npc:'noah',pose:'talk',verb:'Discussion',seconds:10});updateResidents(.05)");
if(scene.startsWith('home:')){const id=scene.split(':')[1];if(!['soleil','sauge','rose'].includes(id))throw Error('Unknown home');run(`state.home.residence='${id}';state.home.theme=Town.home(state).theme;state.x=Town.home(state).x;state.z=2.8;syncHomeInteractions();state.time=${id==='rose'?22:10};camYaw=.65;camZoom=4.5;camPitch=.32;`);}
if(scene==='partner-work')run("state.x=-13;state.z=30.5;state.time=9;camYaw=-.3;camZoom=5;camPitch=.34;residents[0].x=-14;residents[0].z=31.4;Household.prepareWork(state,'lina');state.citizens.lina.shift.step=1;residents[0].targetKey=targetFor(residents[0]).key;residents[0].path=[];residents[0].pathIndex=0;residents[0].pose='cook';residents[0].dir=0;paused=true");
if(scene==='furniture')run("state.x=-2.2;state.z=-.8;state.home.furnishings=[{id:1,type:'desk',x:-3.5,z:-1,turn:0},{id:2,type:'plant',x:-2.5,z:-2.5,turn:0},{id:3,type:'armchair',x:4,z:-1.5,turn:1},{id:4,type:'rug',x:-3,z:.5,turn:0}];rebuildFurnitureCollisions();state.time=14;camYaw=.6;camZoom=5;camPitch=.4;activity={name:'Bureau',pose:'readStand',t:0,seconds:20}");
if(scene==='studio-live')run("state.x=0;state.z=3;state.name='Personnage test';$('previewBtn').onclick();studioPose='readStand';performance.now=()=>1500");
if(scene==='new-furniture')run("state.x=-2.2;state.z=-.8;state.home.furnishings=[{id:1,type:'shelf',x:-3.5,z:-1,turn:0},{id:2,type:'console',x:-2.5,z:-2.5,turn:0},{id:3,type:'bench',x:4,z:-1.5,turn:1}];rebuildFurnitureCollisions();state.time=14;camYaw=.6;camZoom=5;camPitch=.4;");
if(scene==='foyer')run("HomeControl.create(state,'male',Life);refreshHomeMember();state.x=0;state.z=3;residents.find(n=>n.id==='housemate').x=1.25;residents.find(n=>n.id==='housemate').z=3;state.time=15;camYaw=0;camZoom=4.4;camPitch=.3;beginAction({npc:'housemate',socialAction:'chat',pose:'talk',verb:'Discussion du foyer',seconds:10});updateResidents(.05)");
if(scene==='family')run("state.x=0;state.z=2.8;Object.assign(state.family,{partnerId:'emma',status:'couple',movedIn:true,pregnancy:{carrierId:'emma',startedDay:1,dueDay:4,name:'Test'}});residents[2].x=-1.25;residents[2].z=2.8;state.time=18;state.day=2;camYaw=-.3;camZoom=4.5;camPitch=.3;beginAction({npc:'emma',pose:'talk',verb:'Discussion',seconds:10});updateResidents(.05)");
if(scene.startsWith('studio:')||scene.startsWith('portrait')){
 const close=scene.startsWith('portrait');
 const [,body='female',style='0',pose='idle',hair='1',angle='0']=scene.split(':');
 run(`state.x=0;state.z=0;editorMode=true;state.time=10;gl.viewport(0,0,393,700);gl.clearColor(.86,.9,.86,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.useProgram(program);gl.enableVertexAttribArray(attrPosition);gl.enableVertexAttribArray(attrNormal);gl.uniform1f(uOpacity,1);gl.uniform3fv(uLight,[1,1,1]);const checkVP=mul(perspective(PI/4,393/700,.1,100),lookAt([Math.sin(${Number(angle)})*${close?1:3.4},${close?1.66:1.22},-Math.cos(${Number(angle)})*${close?1:3.4}],[0,${close?1.66:.9},0]));gl.uniformMatrix4fv(uVP,false,new Float32Array(checkVP));HumanRenderer.setView(checkVP);smoothEye=[Math.sin(${Number(angle)})*${close?1:3.4},${close?1.66:1.22},-Math.cos(${Number(angle)})*${close?1:3.4}];setEnvironment(smoothEye,true);human(0,0,PI,2,3,1.57,${pose==='walk'?1:0},${Number(hair)},0,${JSON.stringify(pose==='idle'||pose==='walk'?'':pose)},${Number(style)},0,1,0,{body:${JSON.stringify(body)},height:1,width:1,jaw:.2,nose:-.2,lips:.6,brows:-.3,makeup:.3,accessory:3});`);
}else run('tick(16)');
const metrics=JSON.parse(run('JSON.stringify(Object.fromEntries(["female","male"].map(type=>[type,Object.fromEntries(Object.entries(HumanRenderer.models[type].garments).filter(([k])=>k!=="shirtTop").map(([k,g])=>[k,{vertices:g.vertices.length/22,triangles:g.indices.length/3,bytes:g.vertices.length+g.indices.byteLength}]))])))'));
fs.writeFileSync(process.argv[2],JSON.stringify({width:393,height:700,scene,metrics,commands}));
console.log(JSON.stringify({scene,commands:commands.length,draws:commands.filter(c=>c[0].startsWith('draw')).length}));
