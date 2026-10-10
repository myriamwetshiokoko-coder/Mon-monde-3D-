/* Capture the game's real draw commands for offscreen GLES inspection, without a browser.
   node tools/capture_render.cjs /tmp/frame.json studio:female:0:walk
   Scenes: street, bedroom, garden, cafe, studio:<body>:<style>:<pose>. Synthetic saves only. */
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
run("started=true;paused=false;state.time=1;state.skin=skin=2;state.outfit=outfit=3;state.settings.quality=quality=1;state.x=0;state.z=18;camYaw=.8;smoothEye=null;state.name='Personnage test'");
if(scene==='bedroom')run('state.x=.1;state.z=-2;camYaw=.22;camPitch=.34');
if(scene==='garden')run("state.x=-3;state.z=13;camYaw=.5;activity={name:'Potager',pose:'garden',t:0,seconds:5}");
if(scene==='cafe')run("state.x=-12;state.z=31.4;state.time=9;camYaw=0;camPitch=.4;activity={name:'Café Fleur',pose:'eat',anchor:[-9.5,30,Math.PI,0],t:0,seconds:5}");
if(scene.startsWith('studio')){
 const [,body='female',style='0',pose='idle',hair='1']=scene.split(':');
 run(`state.time=10;gl.viewport(0,0,393,700);gl.clearColor(.86,.9,.86,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.useProgram(program);gl.enableVertexAttribArray(attrPosition);gl.enableVertexAttribArray(attrNormal);gl.uniform1f(uOpacity,1);gl.uniform3fv(uLight,[1,1,1]);const checkVP=mul(perspective(PI/4,393/700,.1,100),lookAt([.12,1.22,-3.4],[0,.9,0]));gl.uniformMatrix4fv(uVP,false,new Float32Array(checkVP));HumanRenderer.setView(checkVP);human(0,0,PI,2,3,1.57,${pose==='walk'?1:0},${Number(hair)},0,${JSON.stringify(pose==='idle'||pose==='walk'?'':pose)},${Number(style)},0,1,0,{body:${JSON.stringify(body)},height:1,width:1});`);
}else run('tick(16)');
const metrics=JSON.parse(run('JSON.stringify(Object.fromEntries(["female","male"].map(type=>[type,Object.fromEntries(Object.entries(HumanRenderer.models[type].garments).filter(([k])=>k!=="shirtTop").map(([k,g])=>[k,{vertices:g.vertices.length/22,triangles:g.indices.length/3,bytes:g.vertices.length+g.indices.byteLength}]))])))'));
fs.writeFileSync(process.argv[2],JSON.stringify({width:393,height:700,scene,metrics,commands}));
console.log(JSON.stringify({scene,commands:commands.length,draws:commands.filter(c=>c[0].startsWith('draw')).length}));
