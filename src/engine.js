
'use strict';
// Mon Monde 3D — prototype V0.2 autonome, WebGL 1.0 (pas de CDN, pas de compte, pas de réseau requis après ouverture).
const canvas=document.getElementById('world');
const gl=canvas.getContext('webgl',{antialias:true,premultipliedAlpha:false,alpha:false})||canvas.getContext('experimental-webgl');
if(!gl){document.getElementById('welcome').querySelector('.modal').innerHTML='<h1>WebGL indisponible</h1><p>Le navigateur n’a pas activé l’affichage 3D. Ouvre cette démo dans un navigateur moderne prenant en charge WebGL.</p>';throw new Error('WebGL indisponible');}
const VS=`attribute vec3 position;attribute vec3 normal;uniform mat4 model,viewProjection;varying vec3 N;varying vec3 P;void main(){vec4 world=model*vec4(position,1.0);P=world.xyz;vec3 scales=vec3(dot(model[0].xyz,model[0].xyz),dot(model[1].xyz,model[1].xyz),dot(model[2].xyz,model[2].xyz));N=mat3(model)*(normal/scales);gl_Position=viewProjection*world;}`;
const FS=`precision mediump float;varying vec3 N;varying vec3 P;uniform vec3 tint,lightColor;uniform float skyLevel;void main(){vec3 n=normalize(N);float diffuse=max(dot(n,normalize(vec3(-0.35,0.87,0.55))),0.0);vec3 col=tint*(0.59+0.42*diffuse)*lightColor;float haze=clamp((length(P.xz)-13.0)/24.0,0.0,0.20);col=mix(col,vec3(0.72,0.80,0.79),haze);gl_FragColor=vec4(col,1.0);}`;
function shader(type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const attrPosition=gl.getAttribLocation(program,'position'),attrNormal=gl.getAttribLocation(program,'normal');const uModel=gl.getUniformLocation(program,'model'),uVP=gl.getUniformLocation(program,'viewProjection'),uTint=gl.getUniformLocation(program,'tint'),uLight=gl.getUniformLocation(program,'lightColor');
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
