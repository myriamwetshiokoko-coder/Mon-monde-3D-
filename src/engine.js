
'use strict';
// Mon Monde 3D — prototype V0.2 autonome, WebGL 1.0 (pas de CDN, pas de compte, pas de réseau requis après ouverture).
const canvas=document.getElementById('world');
const gl=canvas.getContext('webgl',{antialias:true,premultipliedAlpha:false,alpha:false})||canvas.getContext('experimental-webgl');
if(!gl){document.getElementById('welcome').querySelector('.modal').innerHTML='<h1>WebGL indisponible</h1><p>Le navigateur n’a pas activé l’affichage 3D. Ouvre cette démo dans un navigateur moderne prenant en charge WebGL.</p>';throw new Error('WebGL indisponible');}
const VS=`attribute vec3 position;attribute vec3 normal;uniform mat4 model,viewProjection;uniform highp float surfaceKind;uniform float worldTime;varying vec3 N;varying vec3 P;void main(){vec4 world=model*vec4(position,1.0);if(surfaceKind>5.5&&surfaceKind<6.5){float bend=clamp(world.y-.5,0.0,1.0);world.x+=sin(worldTime*.9+world.z*.8+world.y)*.035*bend;world.z+=cos(worldTime*.7+world.x)*.025*bend;}P=world.xyz;vec3 scales=vec3(dot(model[0].xyz,model[0].xyz),dot(model[1].xyz,model[1].xyz),dot(model[2].xyz,model[2].xyz));N=mat3(model)*(normal/scales);gl_Position=viewProjection*world;}`;
const FS=`precision highp float;
varying vec3 N,P;uniform vec3 tint,lightColor,sunDirection,sunColor,ambientColor,eyePosition,fogColor;
uniform float opacity,surfaceKind,nightAmount;
float grain(vec2 p){return sin(p.x*47.0+sin(p.y*7.0)*1.4)*sin(p.y*23.0)*.5+.5;}
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash2(i),hash2(i+vec2(1.0,0.0)),f.x),mix(hash2(i+vec2(0.0,1.0)),hash2(i+vec2(1.0)),f.x),f.y);}
void main(){vec3 n=normalize(N),base=tint;vec2 coord=abs(n.y)>.7?P.xz:(abs(n.x)>.7?P.zy:P.xy);
 float detail=1.0;if(surfaceKind>.5&&surfaceKind<1.5){detail=.97+.025*sin(coord.x*32.0+sin(coord.y*3.0)*1.8);if(abs(n.y)>.7){vec2 plank=vec2(P.x*2.4,P.z*.55+mod(floor(P.x*2.4),2.0)*.5);vec2 seam=abs(fract(plank)-.5);detail*=1.0-.075*smoothstep(.485,.499,max(seam.x,seam.y));}}
 else if(surfaceKind>1.5&&surfaceKind<2.5){detail=.995+.005*sin(coord.x*42.0)*sin(coord.y*42.0);}
 else if(surfaceKind>2.5&&surfaceKind<3.5){detail=.96+.035*grain(P.xz*.09);}
 else if(surfaceKind>3.5&&surfaceKind<4.5){detail=.98+.018*grain(coord*.16);if(tint.r>.6){vec2 seam=abs(fract(coord*.68)-.5);detail*=1.0-.08*smoothstep(.474,.499,max(seam.x,seam.y));}}
 else if(surfaceKind>5.5&&surfaceKind<6.5){detail=.9+.1*grain(coord*.3);base=mix(base,base*vec3(.89,1.04,.88),max(n.y,0.0)*.45);}
 else if(surfaceKind>6.5&&surfaceKind<7.5){n=normalize(n+vec3(sin(P.x*5.0)*.13,0.0,cos(P.z*6.0)*.13));detail=.97+.03*sin(P.x*8.0+P.z*3.0);}
 float closeDetail=1.0-smoothstep(2.0,7.0,length(P-eyePosition));
 if(surfaceKind>.5&&surfaceKind<1.5){float w=sin(coord.y*170.0+noise2(coord*vec2(3.0,18.0))*9.0);detail=.955+.025*w*closeDetail+.018*noise2(coord*8.0);if(n.y>.85&&P.y<.18){float row=floor(P.z/.19),joint=min(abs(fract(P.z/.19)-.5),abs(fract(P.x/1.15+hash2(vec2(row,3.0)))-.5));detail*=1.0-.13*(1.0-smoothstep(.004,.018,joint));}}
 else if(surfaceKind>1.5&&surfaceKind<2.5){float weave=sin(coord.x*230.0)*sin(coord.y*247.0);detail=.978+.014*weave*closeDetail+.014*noise2(coord*13.0);}
 else if(surfaceKind>2.5&&surfaceKind<3.5)detail=.96+.04*noise2(P.xz*6.0);
 else if(surfaceKind>3.5&&surfaceKind<4.5){detail=.98+.016*noise2(coord*21.0);if(n.y>.8&&P.y<.18){vec2 tile=abs(fract(coord*.8)-.5);detail*=1.0-.075*smoothstep(.485,.498,max(tile.x,tile.y));}}
 float diffuse=max(dot(n,sunDirection),0.0);vec3 hemisphere=mix(ambientColor*.64,ambientColor,clamp(n.y*.5+.5,0.0,1.0));
 vec3 col=base*detail*(hemisphere+sunColor*diffuse);
 float homeLamp=max(max(0.0,1.0-length(P-vec3(-3.8,2.2,2.7))/5.2),max(max(0.0,1.0-length(P-vec3(-21.0,2.2,2.7))/5.2),max(0.0,1.0-length(P-vec3(13.4,2.2,2.7))/5.2)));
 homeLamp=max(homeLamp,max(max(0.0,1.0-length(P-vec3(.18,2.35,.53))/4.0),max(max(0.0,1.0-length(P-vec3(-17.02,2.35,.53))/4.0),max(0.0,1.0-length(P-vec3(17.38,2.35,.53))/4.0))));
 float streetLamp=max(max(0.0,1.0-length(P-vec3(-12.7,3.13,17.0))/5.0),max(0.0,1.0-length(P-vec3(12.7,3.13,17.0))/5.0));
 float indoor=step(abs(P.z),5.1)*step(min(min(abs(P.x),abs(P.x+17.2)),min(abs(P.x-17.2),min(abs(P.x+42.0),abs(P.x-42.0)))),6.15)*step(P.y,3.3);col+=base*indoor*.15;
 col+=base*vec3(1.0,.73,.40)*max(homeLamp,streetLamp)*nightAmount*.52;
 if((surfaceKind>4.5&&surfaceKind<5.5)||(surfaceKind>6.5&&surfaceKind<8.5)){vec3 halfVector=normalize(sunDirection+normalize(eyePosition-P));float spec=pow(max(dot(n,halfVector),0.0),surfaceKind>7.5?34.0:18.0);col+=sunColor*spec*.22;}
 if(surfaceKind>8.5&&surfaceKind<9.5)col=mix(col,base*1.08,nightAmount*.85);
 if(surfaceKind>4.5&&surfaceKind<5.5){vec3 v=normalize(eyePosition-P),h=normalize(v+sunDirection);col+=sunColor*pow(max(dot(n,h),0.0),48.0)*.12;}
 if(surfaceKind>7.5&&surfaceKind<8.5){vec3 v=normalize(eyePosition-P),r=reflect(-v,n);float fres=.08+.52*pow(1.0-max(dot(n,v),0.0),5.0);vec3 sky=mix(fogColor,vec3(.42,.65,.74),clamp(r.y*.7+.3,0.0,1.0));col=mix(col,sky,fres);col+=sunColor*pow(max(dot(n,normalize(v+sunDirection)),0.0),80.0)*.22;}
 float fog=1.0-exp(-max(0.0,length(P-eyePosition)-12.0)*.009);col=mix(col,fogColor,min(.42,fog));
 gl_FragColor=vec4(clamp(col,0.0,1.0),opacity);}`;
function shader(type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const attrPosition=gl.getAttribLocation(program,'position'),attrNormal=gl.getAttribLocation(program,'normal');const uModel=gl.getUniformLocation(program,'model'),uVP=gl.getUniformLocation(program,'viewProjection'),uTint=gl.getUniformLocation(program,'tint'),uLight=gl.getUniformLocation(program,'lightColor'),uOpacity=gl.getUniformLocation(program,'opacity');
const environmentUniforms=Object.fromEntries(['sunDirection','sunColor','ambientColor','eyePosition','fogColor','surfaceKind','nightAmount','worldTime'].map(k=>[k,gl.getUniformLocation(program,k)]));
function setEnvironment(eye,studio=false){const a=Atmosphere.frame(state.time,studio);for(const [key,value]of [['sunDirection',a.sun],['sunColor',a.sunColor],['ambientColor',a.ambient],['eyePosition',eye],['fogColor',a.fog]])gl.uniform3fv(environmentUniforms[key],value);gl.uniform1f(environmentUniforms.nightAmount,a.night);gl.uniform1f(environmentUniforms.worldTime,typeof elapsed==='number'?elapsed:0);return a;}
const PI=Math.PI;
function hex(v){let s=v.replace('#','');return [parseInt(s.slice(0,2),16)/255,parseInt(s.slice(2,4),16)/255,parseInt(s.slice(4,6),16)/255]}
function mIdentity(){return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}
function mul(a,b){const o=new Array(16);for(let col=0;col<4;col++)for(let row=0;row<4;row++)o[col*4+row]=a[0*4+row]*b[col*4+0]+a[1*4+row]*b[col*4+1]+a[2*4+row]*b[col*4+2]+a[3*4+row]*b[col*4+3];return o}
function modelMatrix(x,y,z,sx,sy,sz,angle=0){let c=Math.cos(angle),s=Math.sin(angle);return [c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,x,y,z,1]}
function perspective(fovy,aspect,near,far){let f=1/Math.tan(fovy/2),nf=1/(near-far);return [f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]}
function lookAt(eye,at){let zz=[eye[0]-at[0],eye[1]-at[1],eye[2]-at[2]];let n=Math.hypot(...zz);zz=zz.map(v=>v/n);let xx=[zz[2],0,-zz[0]];n=Math.hypot(...xx);xx=xx.map(v=>v/n);let yy=[zz[1]*xx[2]-zz[2]*xx[1],zz[2]*xx[0]-zz[0]*xx[2],zz[0]*xx[1]-zz[1]*xx[0]];return [xx[0],yy[0],zz[0],0,xx[1],yy[1],zz[1],0,xx[2],yy[2],zz[2],0,-(xx[0]*eye[0]+xx[1]*eye[1]+xx[2]*eye[2]),-(yy[0]*eye[0]+yy[1]*eye[1]+yy[2]*eye[2]),-(zz[0]*eye[0]+zz[1]*eye[1]+zz[2]*eye[2]),1]}
function makeMesh(vertices){const array=new Float32Array(vertices);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW);return {buffer,count:vertices.length/6,vertices}}
function meshCube(){const v=[];const faces=[[[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]],[[-1,0,0],[[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,-1,-1]]],[[0,1,0],[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]]],[[0,-1,0],[[-1,-1,1],[-1,-1,-1],[1,-1,-1],[1,-1,1]]],[[0,0,1],[[1,-1,1],[1,1,1],[-1,1,1],[-1,-1,1]]],[[0,0,-1],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]]];for(const [n,p] of faces){for(let k of [0,1,2,0,2,3])v.push(...p[k].map(t=>t*.5),...n);}return makeMesh(v)}
function meshSphere(){const v=[],ns=14,nt=10;for(let j=0;j<nt;j++)for(let i=0;i<ns;i++){function point(q,r){let a=q/ns*PI*2,t=r/nt*PI;return [Math.sin(t)*Math.cos(a),Math.cos(t),Math.sin(t)*Math.sin(a)]}let a=point(i,j),b=point(i+1,j),c=point(i,j+1),d=point(i+1,j+1);for(let p of [a,b,c,b,d,c])v.push(...p,...p)}return makeMesh(v)}
function meshCylinder(){const v=[];const n=18;for(let k=0;k<n;k++){let a=k/n*2*PI,b=(k+1)/n*2*PI,p=[Math.cos(a),0,Math.sin(a)],q=[Math.cos(b),0,Math.sin(b)];for(let t of [[p[0],-.5,p[2]],[p[0],.5,p[2]],[q[0],-.5,q[2]],[q[0],-.5,q[2]],[p[0],.5,p[2]],[q[0],.5,q[2]]]){let na=t[0],nz=t[2];v.push(...t,na,0,nz)}for(let y of [-.5,.5]){for(let t of [[0,y,0],[q[0],y,q[2]],[p[0],y,p[2]]])v.push(...t,0,y>0?1:-1,0)}}return makeMesh(v)}
const shapes={cube:meshCube(),sphere:meshSphere(),cyl:meshCylinder()};let scene=[];
function add(shape,color,x,y,z,sx,sy,sz,rot=0){scene.push({shape,color:hex(color),m:modelMatrix(x,y,z,sx,sy,sz,rot)})}
function box(color,x,y,z,sx,sy,sz,rot=0){add('cube',color,x,y,z,sx,sy,sz,rot)}
function ball(color,x,y,z,sx,sy,sz){add('sphere',color,x,y,z,sx,sy,sz)}
function cyl(color,x,y,z,sx,sy,sz){add('cyl',color,x,y,z,sx,sy,sz)}
function flower(x,z){cyl('#b9977e',x,.37,z,.36,.55,.36);cyl('#527f67',x,.89,z,.06,.55,.06);for(let a=0;a<6;a++){let theta=a*PI/3;ball('#ecc5bb',x+Math.cos(theta)*.19,1.19,z+Math.sin(theta)*.19,.15,.15,.15)}ball('#e9c982',x,1.19,z,.14,.14,.14)}
