/* Visual-only locomotion and pose transitions. No simulation time or saved state. */
const CharacterMotion=(()=>{
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),tau=Math.PI*2;
 function feet(phase,moving,running=false){
  const stride=(running?.307:.249)*clamp(moving,0,1),duty=running?.45:.5;
  return [0,Math.PI].map(offset=>{
   const t=((phase+offset)%tau+tau)%tau/tau,stance=t<duty,u=stance?t/duty:(t-duty)/(1-duty);
   return {z:stance?stride*(1-2*u):-stride*Math.cos(Math.PI*u),lift:stance?0:(running?.105:.065)*moving*Math.sin(Math.PI*u),pitch:stance?0:-.16*Math.sin(Math.PI*u),stance};
  });
 }
 function legs(model,phase,moving,running,posture){const out={},targets=feet(phase,moving,running);
  for(const [index,id]of [15,18].entries()){
   const hip=model.bones[id],knee=model.bones[id+1],foot=model.bones[id+2],a=[knee.pivot[1]-hip.pivot[1],knee.pivot[2]-hip.pivot[2]],b=[foot.pivot[1]-knee.pivot[1],foot.pivot[2]-knee.pivot[2]],l1=Math.hypot(...a),l2=Math.hypot(...b),t=targets[index];
   const y=(posture.floor+(foot.pivot[1]+.007)*posture.height-posture.baseY)/posture.height+t.lift,z=foot.pivot[2]+t.z,dy=y-hip.pivot[1],dz=z-hip.pivot[2],d=clamp(Math.hypot(dy,dz),Math.abs(l1-l2)+.002,l1+l2-.002);
   const theta=Math.atan2(dz,-dy)+Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1)),ky=hip.pivot[1]-l1*Math.cos(theta),kz=hip.pivot[2]+l1*Math.sin(theta),thigh=Math.atan2(a[1],-a[0])-theta,total=Math.atan2(b[1],-b[0])-Math.atan2(z-kz,-(y-ky));
   out[hip.name]=thigh;out[knee.name]=total-thigh;out[foot.name]=-total+t.pitch;
  }return out;
 }
 const point=(m,p)=>p.map((v,k)=>m[k]*p[0]+m[4+k]*p[1]+m[8+k]*p[2]+m[12+k]);
 function frame(m,p){const out=m.slice(),t=point(m,p);for(let k=0;k<3;k++)out[12+k]=t[k];return out;}
 function inverse(m){const out=[m[0],m[4],m[8],0,m[1],m[5],m[9],0,m[2],m[6],m[10],0,0,0,0,1];for(let k=0;k<3;k++)out[12+k]=-out[k]*m[12]-out[k+4]*m[13]-out[k+8]*m[14];return out;}
 function quat(m){const trace=m[0]+m[5]+m[10];let x,y,z,w,s;
  if(trace>0){s=Math.sqrt(trace+1)*2;w=s/4;x=(m[6]-m[9])/s;y=(m[8]-m[2])/s;z=(m[1]-m[4])/s;}
  else if(m[0]>m[5]&&m[0]>m[10]){s=Math.sqrt(1+m[0]-m[5]-m[10])*2;w=(m[6]-m[9])/s;x=s/4;y=(m[4]+m[1])/s;z=(m[8]+m[2])/s;}
  else if(m[5]>m[10]){s=Math.sqrt(1+m[5]-m[0]-m[10])*2;w=(m[8]-m[2])/s;x=(m[4]+m[1])/s;y=s/4;z=(m[9]+m[6])/s;}
  else{s=Math.sqrt(1+m[10]-m[0]-m[5])*2;w=(m[1]-m[4])/s;x=(m[8]+m[2])/s;y=(m[9]+m[6])/s;z=s/4;}return [x,y,z,w];
 }
 function blend(a,b,t){const qa=quat(a),qb=quat(b),sign=qa.reduce((n,v,k)=>n+v*qb[k],0)<0?-1:1,q=qa.map((v,k)=>v*(1-t)+qb[k]*sign*t),norm=Math.hypot(...q)||1,[x,y,z,w]=q.map(v=>v/norm),out=[1-2*(y*y+z*z),2*(x*y+z*w),2*(x*z-y*w),0,2*(x*y-z*w),1-2*(x*x+z*z),2*(y*z+x*w),0,2*(x*z+y*w),2*(y*z-x*w),1-2*(x*x+y*y),0,0,0,0,1];
  const va=a.slice(12,15),vb=b.slice(12,15),v=va.map((x,k)=>x*(1-t)+vb[k]*t),length=Math.hypot(...vb),l=Math.hypot(...v);
  for(let k=0;k<3;k++)out[12+k]=length>.0001&&l>.0001?v[k]*length/l:v[k];return out;
 }
 const actors=new Map();
 function smooth(id,model,palette,mode,time,multiply){if(!id)return palette;
  const frames=palette.map((m,i)=>frame(m,model.bones[i].pivot)),local=frames.map((m,i)=>model.bones[i].parent<0?m:multiply(inverse(frames[model.bones[i].parent]),m));let c=actors.get(id);
  if(!c||c.model!==model||time<c.time||time-c.time>1){c={model,mode,time,local,start:null,began:time};actors.set(id,c);}
  else if(mode!==c.mode){c.start=c.local;c.began=time;c.mode=mode;}
  let shown=local;if(c.start){const u=clamp((time-c.began)/.30,0,1),t=u*u*(3-2*u);shown=local.map((m,i)=>blend(c.start[i],m,t));if(u===1)c.start=null;}
  c.local=shown;c.time=time;if(actors.size>48)for(const [key,val]of actors)if(time-val.time>2)actors.delete(key);
  const world=[];return shown.map((m,i)=>{const bone=model.bones[i],f=bone.parent<0?m:multiply(world[bone.parent],m);world[i]=f;const out=f.slice();for(let k=0;k<3;k++)out[12+k]-=f[k]*bone.pivot[0]+f[4+k]*bone.pivot[1]+f[8+k]*bone.pivot[2];return out;});
 }
 return {feet,legs,smooth,reset(){actors.clear();}};
})();
if(typeof module!=='undefined')module.exports=CharacterMotion;
