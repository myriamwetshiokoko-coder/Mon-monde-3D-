/* Stable coordinates of the three original movable furnishings. No DOM or GPU. */
const FurnitureCore=(()=>{
 const items={bed:{name:'Lit double',x:3.15,z:-3.55,box:[1.9,4.43,-4.85,-2.2],solid:6},sofa:{name:'Canapé',x:-3.95,z:2.7,box:[-5.25,-2.61,2.04,3.39],solid:7},dining:{name:'Table et chaises',x:.18,z:.53,box:[-.93,1.29,-.33,1.31],solid:9}};
 const placement=(s,key,home=s.home.residence)=>s.home.layouts?.[home]?.[key]||{x:items[key].x,z:items[key].z,turn:0};
 function map(s,key,x,z,home=s.home.residence){const o=items[key],p=placement(s,key,home),a=-p.turn*Math.PI/2,c=Math.cos(a),q=Math.sin(a),dx=x-o.x,dz=z-o.z;return [p.x+c*dx+q*dz,p.z-q*dx+c*dz];}
 function bounds(s,key,home=s.home.residence){const b=items[key].box,ps=[[b[0],b[2]],[b[0],b[3]],[b[1],b[2]],[b[1],b[3]]].map(p=>map(s,key,...p,home));return [Math.min(...ps.map(p=>p[0])),Math.max(...ps.map(p=>p[0])),Math.min(...ps.map(p=>p[1])),Math.max(...ps.map(p=>p[1]))];}
 const changed=(s,home,key)=>{const p=placement(s,key,home),o=items[key];return Math.abs(p.x-o.x)>.001||Math.abs(p.z-o.z)>.001||p.turn!==0;};
 function normalize(raw){const out={};for(const home of ['soleil','sauge','rose']){const entries={};for(const key of Object.keys(items)){const p=raw?.[home]?.[key];if(p&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&Number.isInteger(p.turn)&&p.turn>=0&&p.turn<4&&Math.abs(p.x)<=6&&Math.abs(p.z)<=5)entries[key]={x:Math.round(p.x*20)/20,z:Math.round(p.z*20)/20,turn:p.turn};}if(Object.keys(entries).length)out[home]=entries;}return out;}
 function candidate(s,key,p){return {...s,home:{...s.home,layouts:{...s.home.layouts,[s.home.residence]:{...s.home.layouts?.[s.home.residence],[key]:{x:p.x,z:p.z,turn:p.turn}}}}};}
 return {items,placement,map,bounds,changed,normalize,candidate};
})();
if(typeof module!=='undefined')module.exports=FurnitureCore;
