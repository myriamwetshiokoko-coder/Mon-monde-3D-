/* Grid search is used only when a destination changes, never every frame. */
const Navigation=(()=>{
 function path(start,end,barriers){const step=.5,code=(x,z)=>x+','+z;const cells=new Map(),queue=[],parents=new Map();const snap=v=>Math.round(v/step)*step;
 function nearest(p){const cx=snap(p[0]),cz=snap(p[1]),candidates=[];for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++)candidates.push([cx+dx*step,cz+dz*step]);candidates.sort((a,b)=>Math.hypot(a[0]-p[0],a[1]-p[1])-Math.hypot(b[0]-p[0],b[1]-p[1]));return candidates.find(p=>Life.valid(...p,barriers))||null}
 const a=nearest(start),b=nearest(end);if(!a||!b)return [];const ak=code(...a),bk=code(...b);cells.set(ak,a);queue.push(a);let head=0,found=false;
 while(head<queue.length&&head<20000){const p=queue[head++],pk=code(...p);if(pk===bk){found=true;break}for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const n=[p[0]+dx*step,p[1]+dz*step],k=code(...n);if(cells.has(k)||!Life.valid(...n,barriers)||!Life.valid((p[0]+n[0])/2,(p[1]+n[1])/2,barriers))continue;cells.set(k,n);parents.set(k,pk);queue.push(n)}}
 if(!found)return [];let points=[],k=bk;while(k!==ak){points.push(cells.get(k));k=parents.get(k)}points.reverse();const from=points.at(-1)||start;if([0,.25,.5,.75,1].every(t=>Life.valid(from[0]+(end[0]-from[0])*t,from[1]+(end[1]-from[1])*t,barriers))&&Math.hypot(from[0]-end[0],from[1]-end[1])>.001)points.push(end.slice());return points;
 }
 function move(entity,dx,dz,barriers,door=1){const pieces=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));for(let i=0;i<pieces;i++){const nx=entity.x+dx/pieces,nz=entity.z+dz/pieces;if(Life.valid(nx,entity.z,barriers,door))entity.x=nx;if(Life.valid(entity.x,nz,barriers,door))entity.z=nz}}
 return {path,move};
})();
if(typeof module!=='undefined')module.exports=Navigation;
