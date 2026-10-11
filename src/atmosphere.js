/* Shared, deterministic lighting. Time changes the world, never a saved resource. */
const Atmosphere=(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
 function frame(hour=12,studio=false){
  hour=Number.isFinite(hour)?((hour%24)+24)%24:12;
  if(studio)return {sun:[-.45,.75,.45],sunColor:[.75,.71,.65],ambient:[.53,.56,.62],skyTop:[.68,.78,.82],skyBottom:[.92,.90,.83],fog:[.88,.9,.87],night:0};
  const theta=(hour-6)/24*Math.PI*2,elevation=Math.sin(theta),day=clamp((elevation+.14)/.55,0,1),gold=day*(1-clamp(elevation/.6,0,1)),night=1-day,dusk=(1-clamp(Math.abs(elevation)/.33,0,1))*.65;
  const sun=[Math.cos(theta)*.7,Math.max(.12,elevation),.45],length=Math.hypot(...sun);
  return {sun:sun.map(v=>v/length),sunColor:mix([.58,.61,.65],[.75,.53,.32],gold).map(v=>v*day),ambient:mix([.34,.38,.49],[.48,.52,.56],day),skyTop:mix([.06,.10,.20],[.31,.61,.76],day),skyBottom:mix(mix([.22,.24,.34],mix([.84,.91,.89],[.96,.73,.49],gold),day),[.91,.55,.34],dusk),fog:mix(mix([.20,.24,.34],mix([.78,.85,.82],[.87,.75,.62],gold),day),[.75,.58,.44],dusk*.4),night};
 }
 // Classify once at build time. No texture download or per-frame material search.
 const wood=new Set(['a77762','bd9279','b38b76','ad8d78','a58373','b99174','b58b6e','997d65','bb8c73','a98d72','b79476','b49a80','b6987e','c9ad8e','c8a382','c39a70','cda88f']);
 const fabric=new Set(['e2c6b6','f7e1d2','f0e7d9','ddb4a6','fef8ee','f4d3c0','ece2d7','e4bda7','ddd1c7','c0a995','a6b5aa']);
 function material(o){if(Number.isFinite(o.material))return o.material;const [r,g,b]=o.color,c=o.color.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');
  if(o.shape==='leaf'||g>r*1.12&&g>b*1.10&&o.shape==='sphere')return 6;
  if(o.m[13]<0&&g>r*1.04&&g>b*1.06)return 3;
  if(wood.has(c))return 1;if(fabric.has(c))return 2;
  if(['8e939a','d4d1c8','e5d5b8','edd9be','e6d5b8'].includes(c))return 4;
  if(['6c7779','75716e','8d9b95','42383c'].includes(c))return 5;
  if(['99c4cb'].includes(c))return 7;
  if(['a9cbd0','a6ced2','9ec5cc','abcbd0','a8c7ce'].includes(c))return 8;
  if(['ffe4ac','f4e2a7'].includes(c))return 9;
  return 0;
 }
 function localLight(x,z,hour,studio=false){const a=frame(hour,studio);if(studio)return a;let lamp=0;for(const cx of [0,-17.2,17.2])lamp=Math.max(lamp,Math.max(0,1-Math.hypot(x-(cx-3.8),z-2.7)/5.2));for(const cx of [-12.7,12.7])lamp=Math.max(lamp,Math.max(0,1-Math.hypot(x-cx,z-17)/5));a.ambient=a.ambient.map((v,i)=>v+[.34,.24,.12][i]*lamp*a.night);return a;}
 return {frame,material,localLight};
})();
if(typeof module!=='undefined')module.exports=Atmosphere;
