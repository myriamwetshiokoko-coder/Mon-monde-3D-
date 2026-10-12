const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function createRuntime(initialSave=null){
// Execute the complete game under a DOM/WebGL stub to check integration without claiming browser rendering.
const ids=[...fs.readFileSync('index.html','utf8').matchAll(/id="([^"]+)"/g)].map(m=>m[1]),els={};
function el(){const classes=new Set();return {handlers:{},remove(){this.removed=true},style:{},classList:{add(...names){names.forEach(n=>classes.add(n))},remove(...names){names.forEach(n=>classes.delete(n))},contains(n){return classes.has(n)},toggle(n,force){const add=force===undefined?!classes.has(n):force;if(add)classes.add(n);else classes.delete(n);return add}},replaceChildren(){this.children=[]},focus(){},value:'',children:[],addEventListener(type,fn){(this.handlers[type]??=[]).push(fn)},emit(type,e){for(const fn of this.handlers[type]||[])fn(e)},setAttribute(){},setPointerCapture(){},append(...nodes){this.children.push(...nodes)},click(){},getBoundingClientRect(){return {left:0,top:0,width:118,height:118}},querySelector(){return el()}}}
for(const id of ids)els[id]=el();for(const tag of fs.readFileSync('index.html','utf8').matchAll(/<[^>]+id="([^"]+)"[^>]*>/g))els[tag[1]].hidden=/\bhidden\b/.test(tag[0]);let draws=0;const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:(_p,name)=>name,createShader:()=>({}),createProgram:()=>({}),createBuffer:()=>({}),drawArrays:()=>draws++},{get:(o,k)=>o[k]||(()=>{})});els.world.getContext=()=>gl;
const storage=new Map([['monmonde3d_v02',JSON.stringify({x:0,z:3,name:'Test',skin:3,outfit:1})]]);
if(initialSave)storage.set('monmonde3d_v2',JSON.stringify(initialSave));
const ctx={atob:s=>Buffer.from(s,'base64').toString('binary'),Uint8Array,console,Math,JSON,Number,Float32Array,Map,Blob,URL,setTimeout:()=>0,clearTimeout(){},performance:{now:()=>0},innerWidth:393,innerHeight:852,devicePixelRatio:3,requestAnimationFrame(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById:id=>{assert.ok(els[id],id);return els[id]},body:el(),createElement:()=>el(),addEventListener(){},hidden:false},window:{addEventListener(){}},location:{reload(){}}};vm.createContext(ctx);
for(const script of fs.readFileSync('index.html','utf8').matchAll(/<script src="([^"]+)"/g)){const file=script[1].split('?')[0];vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file})}
const run=s=>vm.runInContext(s,ctx);
return {els,ctx,storage,gl,run,drawCount:()=>draws};
}
module.exports=createRuntime();module.exports.createRuntime=createRuntime;
