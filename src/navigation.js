/* Grid search is used only when a destination changes, never every frame. */
const Navigation=(()=>{
 function path(start,end,barriers){const step=.5,code=(x,z)=>x+','+z;const cells=new Map(),queue=[],parents=new Map();const snap=v=>Math.round(v/step)*step;
 function nearest(p){const cx=snap(p[0]),cz=snap(p[1]);for(let radius=0;radius<5;radius++)for(let dx=-radius;dx<=radius;dx++)for(let dz=-radius;dz<=radius;dz++){let x=cx+dx*step,z=cz+dz*step;if(Life.valid(x,z,barriers))return [x,z]}return null}
 const a=nearest(start),b=nearest(end);if(!a||!b)return [];const ak=code(...a),bk=code(...b);cells.set(ak,a);queue.push(a);let head=0,found=false;
 while(head<queue.length&&head<20000){const p=queue[head++],pk=code(...p);if(pk===bk){found=true;break}for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const n=[p[0]+dx*step,p[1]+dz*step],k=code(...n);if(cells.has(k)||!Life.valid(...n,barriers)||!Life.valid((p[0]+n[0])/2,(p[1]+n[1])/2,barriers))continue;cells.set(k,n);parents.set(k,pk);queue.push(n)}}
 if(!found)return [];let points=[],k=bk;while(k!==ak){points.push(cells.get(k));k=parents.get(k)}points.reverse();return points;
 }
 function move(entity,dx,dz,barriers,door=1){const pieces=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));for(let i=0;i<pieces;i++){const nx=entity.x+dx/pieces,nz=entity.z+dz/pieces;if(Life.valid(nx,entity.z,barriers,door))entity.x=nx;if(Life.valid(entity.x,nz,barriers,door))entity.z=nz}}
 return {path,move};
})();
if(typeof module!=='undefined')module.exports=Navigation;
