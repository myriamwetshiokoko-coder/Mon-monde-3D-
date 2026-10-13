/* Analytic two-bone arm placement. Original code, no animation downloads. */
const MotionRig=(()=>{
 const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),len=a=>Math.hypot(...a),unit=a=>a.map(v=>v/(len(a)||1)),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 function rotation(a,b){a=unit(a);b=unit(b);let axis=cross(a,b),w=1+dot(a,b);if(w<.00001){axis=unit(cross(a,Math.abs(a[1])<.8?[0,1,0]:[0,0,1]));w=0;}const l=Math.hypot(...axis,w)||1,[x,y,z]=axis.map(v=>v/l);w/=l;return [1-2*(y*y+z*z),2*(x*y+z*w),2*(x*z-y*w),0,2*(x*y-z*w),1-2*(x*x+z*z),2*(y*z+x*w),0,2*(x*z+y*w),2*(y*z-x*w),1-2*(x*x+y*y),0,0,0,0,1];}
 function transform(r,from,to){const m=r.slice();for(let k=0;k<3;k++)m[12+k]=to[k]-r[k]*from[0]-r[4+k]*from[1]-r[8+k]*from[2];return m;}
 function solve(s,e,w,target,side){const l1=len(sub(e,s)),l2=len(sub(w,e)),delta=sub(target,s),d=Math.max(Math.abs(l1-l2)+.005,Math.min(len(delta),l1+l2-.005)),axis=len(delta)<.000001?[0,-1,0]:unit(delta),a=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-a*a)),pole=[side,-.5,-.25],perp=unit(sub(pole,axis.map(v=>v*dot(pole,axis)))),elbow=s.map((v,i)=>v+axis[i]*a+perp[i]*h),hand=s.map((v,i)=>v+axis[i]*d);return {elbow,hand,upper:transform(rotation(sub(e,s),sub(elbow,s)),s,s),lower:transform(rotation(sub(w,e),sub(hand,elbow)),e,elbow),wrist:transform(rotation([side,0,0],[0,-1,0]),w,hand)};}
 function target(pose,side,phase,headY){const y=headY-1.55,beat=(1-Math.cos(phase*.65))/2;
  if(['read','readStand'].includes(pose))return [side*.125,1.16+y,.33];
  if(pose==='eat')return side===1?[.12,1.12+y,.33]:[-.025,1.13+y+beat*.37,.35-beat*.22];
  if(pose==='drive')return [side*.17,1.12+y,.36];
  if(pose==='push')return [side*.19,1.17+y,.35];
  if(pose==='phone')return side===1?[.09,1.33+y,.25]:[-.22,1.00+y,.06];
  if(['prepare','chop','stir'].includes(pose))return [side*.12+(pose==='stir'&&side===-1?Math.cos(phase)*.03:0),1.19+y+(pose==='chop'&&side===-1?Math.max(0,Math.sin(phase*1.3))*.05:0),.33+(pose==='stir'?Math.sin(phase)*.025:0)];
  if(pose==='cook')return [side*.12+Math.sin(phase)*.035,1.18+y+Math.cos(phase)*.025,.29+Math.sin(phase+side)*.025];
  if(['carry','stock','serve','cuddle'].includes(pose))return [side*.14,1.12+y,.34];
  if(pose==='talk')return [side*.23,1.08+y+Math.sin(phase*.8+side)*.075,.22+Math.sin(phase*.55+side)*.05];
  if(pose==='clean')return [side*.17+Math.sin(phase)*.075,1.16+y,.29];
  return null;
 }
 function apply(model,palette,pose,phase,multiply){for(const [u,e,w,side]of [[8,9,10,1],[12,13,14,-1]]){const t=target(pose,side,phase,model.bones[6].pivot[1]);if(!t)continue;const solution=solve(model.bones[u].pivot,model.bones[e].pivot,model.bones[w].pivot,t,side),parent=palette[model.bones[u].parent],direction=pose==='phone'?[0,1,0]:pose==='eat'&&side===-1?[0,1,0]:[0,0,1];solution.wrist=transform(rotation([side,0,0],direction),model.bones[w].pivot,solution.hand);palette[u]=multiply(parent,solution.upper);palette[e]=multiply(parent,solution.lower);palette[w]=multiply(parent,solution.wrist);}return palette;}
 return {solve,target,apply,rotation};
})();
if(typeof module!=='undefined')module.exports=MotionRig;
