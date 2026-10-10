/* Calm traffic yields to pedestrians. Vehicles are scenery, not a driving mode. */
const Traffic=(()=>{
 const cars=[{x:-24,z:19.65,dir:1,color:'#a8c0ba',speed:0},{x:7,z:19.65,dir:1,color:'#ceb29a',speed:0},{x:24,z:23.05,dir:-1,color:'#b393a6',speed:0},{x:-7,z:23.05,dir:-1,color:'#829bb2',speed:0}];
 const bounds=c=>[c.x-1.85,c.x+1.85,c.z-.78,c.z+.78];
 function reset(people=[]){const starts=[-24,7,24,-7],placed=[];cars.forEach((c,i)=>{const choices=[starts[i],-33,33,-27,27,-21,21,-15,15,-9,9,-3,3];c.x=choices.find(x=>!people.some(p=>Math.abs(p.z-c.z)<1.5&&Math.abs(p.x-x)<4)&&!placed.some(p=>p.z===c.z&&Math.abs(p.x-x)<6))??(c.dir===1?-36:36);c.speed=0;placed.push(c);});}
 function advance(dt,people){for(const c of cars){const blocked=people.some(p=>Math.abs(p.z-c.z)<1.35&&(p.x-c.x)*c.dir> -1.9&&(p.x-c.x)*c.dir<5.2)||cars.some(p=>p!==c&&p.dir===c.dir&&Math.abs(p.z-c.z)<.5&&(p.x-c.x)*c.dir>0&&(p.x-c.x)*c.dir<6);c.speed=Math.max(0,Math.min(2.6,c.speed+(blocked?-7:1.6)*Math.max(0,Math.min(dt,.05))));c.x+=c.dir*c.speed*Math.min(dt,.05);if(c.x>36)c.x=-36;if(c.x< -36)c.x=36;}}
 const movementBarriers=base=>[...base,...cars.filter(c=>Math.abs(c.x)<34).map(bounds)];
 return {cars,bounds,advance,movementBarriers,reset};
})();
if(typeof module!=='undefined')module.exports=Traffic;
