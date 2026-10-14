/* Shared indexed furniture + embedded textile/wood tiles. WebGL 1, no Blender/CDN.
   Old procedural furniture remains a distance/error fallback; no simulation writes. */
const FurnitureRenderer=(()=>{
 let ready=false,parts=[],models={},textures=[],p,attrs={},u={},pending=[],pendingEye=null,pendingVP=null;
 const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 const vertex=`attribute vec3 position,normal;attribute vec2 uv;attribute vec4 tangent;
 uniform mat4 model,viewProjection;varying vec3 P,N;varying vec2 UV;varying vec4 T;
 void main(){vec4 w=model*vec4(position,1.0);P=w.xyz;N=mat3(model)*normal;
 T=vec4(mat3(model)*tangent.xyz,tangent.w);UV=uv;gl_Position=viewProjection*w;}`;
 const fragment=`precision mediump float;
 varying vec3 P,N;varying vec2 UV;varying vec4 T;
 uniform sampler2D baseMap,normalMap;
 uniform vec3 color,sunDirection,sunColor,ambientColor,eyePosition,fogColor;
 uniform float useTexture,normalScale,roughness,opacity;
 vec3 linearColor(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));}
 void main(){vec3 n=normalize(N),t=normalize(T.xyz-n*dot(n,T.xyz));
 vec3 local=texture2D(normalMap,UV).xyz*2.0-1.0;local.xy*=normalScale;
 n=normalize(t*local.x+cross(n,t)*T.w*local.y+n*local.z);
 vec3 base=color*mix(vec3(1.0),linearColor(texture2D(baseMap,UV).rgb),useTexture);
 vec3 hemi=mix(ambientColor*.65,ambientColor,clamp(n.y*.5+.5,0.0,1.0));
 float contact=.82+.18*smoothstep(.08,.56,P.y);
 vec3 light=base*(hemi+sunColor*max(dot(n,sunDirection),0.0)) * contact;
 vec3 v=normalize(eyePosition-P),h=normalize(v+sunDirection);
 float spec=pow(max(dot(n,h),0.0),mix(75.0,5.0,roughness));
 light+=sunColor*spec*(1.0-roughness)*.06;
 vec3 col=pow(max(light,vec3(0.0)),vec3(1.0/2.2));
 float fog=1.0-exp(-max(0.0,length(P-eyePosition)-12.0)*.009);
 gl_FragColor=vec4(mix(col,fogColor,min(.42,fog)),opacity);}`;
 function texture(width,height,data){const tex=gl.createTexture();textures.push(tex);gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.generateMipmap(gl.TEXTURE_2D);return tex;}
 let maps=[],white,flat;
 try{
  p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
  for(const name of ['position','normal','uv','tangent'])attrs[name]=gl.getAttribLocation(p,name);
  for(const name of ['model','viewProjection','baseMap','normalMap','color','sunDirection','sunColor','ambientColor','eyePosition','fogColor','useTexture','normalScale','roughness','opacity'])u[name]=gl.getUniformLocation(p,name);
  maps=AuroreAsset.textures.map(x=>texture(x.width,x.height,bytes(x.pixels)));
  white=texture(1,1,new Uint8Array([255,255,255,255]));flat=texture(1,1,new Uint8Array([128,128,255,255]));
  for(const [key,asset]of Object.entries({sofa:AuroreAsset,...InteriorAsset.models})){
   models[key]={bounds:asset.bounds,parts:asset.parts.map(a=>{const buffer=gl.createBuffer(),index=gl.createBuffer(),part={...a,buffer,index};parts.push(part);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,bytes(a.vertices),gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,bytes(a.indices),gl.STATIC_DRAW);return part;})};
  }
  ready=true;
 }catch(e){for(const a of parts){gl.deleteBuffer?.(a.buffer);gl.deleteBuffer?.(a.index);}for(const tex of textures)gl.deleteTexture?.(tex);console.warn('Aurore indisponible, mobilier standard conservé.',e);}
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,null);gl.useProgram(program);

 function local(id,key){return FurnitureCore.items[key]?FurnitureCore.placement(state,key,id):{x:0,z:0,turn:0};}
 function replaces(id,key='sofa'){if(!ready||!models[key])return false;const h=Town.houses[id],q=local(id,key),b=models[key].bounds;return !!h&&Math.hypot(state.x-h.x-q.x-(FurnitureCore.items[key]?0:(b.min[0]+b.max[0])/2),state.z-h.z-q.z-(FurnitureCore.items[key]?0:(b.min[2]+b.max[2])/2))<18;}
 function placement(id,key='sofa'){const h=Town.houses[id],q=local(id,key);return modelMatrix(h.x+q.x,0,h.z+q.z,1,1,1,-q.turn*PI/2);}
 function bounds(id,key){const m=placement(id,key),b=models[key].bounds,min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(const x of [b.min[0],b.max[0]])for(const y of [b.min[1],b.max[1]])for(const z of [b.min[2],b.max[2]])for(let k=0;k<3;k++){const value=m[k]*x+m[k+4]*y+m[k+8]*z+m[k+12];min[k]=Math.min(min[k],value);max[k]=Math.max(max[k],value);}return {min,max};}
 function render(list,eye,vp){if(!list.length)return;gl.useProgram(p);for(const a of Object.values(attrs))gl.enableVertexAttribArray(a);gl.uniformMatrix4fv(u.viewProjection,false,new Float32Array(vp));gl.uniform3fv(u.eyePosition,eye);gl.uniform1i(u.baseMap,0);gl.uniform1i(u.normalMap,1);
  for(const {id,key,opacity=1}of list){const h=Town.houses[id],q=local(id,key),b=models[key].bounds,light=Atmosphere.localLight(h.x+q.x+(b.min[0]+b.max[0])/2,h.z+q.z+(b.min[2]+b.max[2])/2,state.time);
   for(const [k,v]of [['sunDirection',light.sun],['sunColor',light.sunColor],['ambientColor',light.ambient],['fogColor',light.fog]])gl.uniform3fv(u[k],v);
   gl.uniformMatrix4fv(u.model,false,new Float32Array(placement(id,key)));gl.uniform1f(u.opacity,opacity);
   const theme=id===state.home.residence?state.home.theme:h.theme;
   for(const a of models[key].parts){if(a.cutSide==='back'&&currentZone(state.z)===(id==='soleil'?'maison':id)&&eye[2]<h.z-4.75)continue;gl.bindBuffer(gl.ARRAY_BUFFER,a.buffer);
    gl.vertexAttribPointer(attrs.position,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(attrs.normal,3,gl.SHORT,true,36,12);
    gl.vertexAttribPointer(attrs.uv,2,gl.FLOAT,false,36,20);gl.vertexAttribPointer(attrs.tangent,4,gl.SHORT,true,36,28);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,a.index);let color=a.color;
    if(((key==='sofa'&&a.name.startsWith('Lin'))||a.theme)&&theme)color=theme===1?[.59,.69,.60]:[.70,.55,.73];
    gl.uniform3fv(u.color,color);gl.uniform1f(u.roughness,a.roughness);gl.uniform1f(u.useTexture,a.texture>=0?1:0);gl.uniform1f(u.normalScale,a.normalScale);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,a.texture>=0?maps[a.texture]:white);
    gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,a.normalTexture>=0?maps[a.normalTexture]:flat);
    gl.drawElements(gl.TRIANGLES,a.count,gl.UNSIGNED_SHORT,0);
   }
  }
  for(const a of Object.values(attrs))gl.disableVertexAttribArray(a);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);gl.activeTexture(gl.TEXTURE0);gl.useProgram(program);gl.enableVertexAttribArray(attrPosition);gl.enableVertexAttribArray(attrNormal);
 }
 function draw(eye,vp,faded=new Set()){pending=[];pendingEye=eye;pendingVP=vp;if(!ready||!eye||!vp)return;const opaque=[];
  for(const id of Object.keys(Town.houses))for(const key of Object.keys(models)){
   if(!replaces(id,key)||!frustumVisible(bounds(id,key),vp))continue;
   const foreground=id==='soleil'?'home-fridge':'home-fridge-'+id;
   if(key==='fridge'&&faded.has(foreground))pending.push({id,key,opacity:.16});else opaque.push({id,key});
  }
  render(opaque,eye,vp);
 }
 function drawFaded(){if(!ready||!pending.length)return;gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);render(pending,pendingEye,pendingVP);gl.depthMask(true);gl.disable(gl.BLEND);pending=[];}
 return {get ready(){return ready;},replaces,placement,bounds,draw,drawFaded,preview:(key,eye,vp)=>{if(ready&&models[key])render([{id:'soleil',key}],eye,vp);}};
})();
