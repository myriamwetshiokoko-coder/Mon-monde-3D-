/* Furniture placement rules shared by the floor plan, collisions and save migration. */
const Housing=((town)=>{
 const core=typeof module!=='undefined'?require('./furniture-core.js'):FurnitureCore;
 const solids=[[-6.3,-5.9,-5.2,5.2],[5.9,6.3,-5.2,5.2],[-6.3,6.3,-5.27,-4.87],[-6.3,-1.08,4.9,5.23],[1.08,6.3,4.9,5.23],[-5.82,-1.02,-4.52,-3.45],[1.9,4.43,-4.85,-2.2],[-5.25,-2.61,2.04,3.39],[-2.95,-1.43,1.55,2.49],[-.93,1.29,-.33,1.31],[4.05,5.96,2.54,4.06],[4.7,5.88,-2.28,-1.31],[-5.9,-4.8,-2.98,-1.88],[.85,1.7,-4.325,-2.675],[-1.6,-.6,-1.95,-1.45],[-5.58,-4.34,.35,1.05],[3.42,4.38,-1.08,.08],[4.62,5.58,-1.08,.08]];
 // The entrance, kitchen approach, dining seats, bedroom and nursery stay accessible.
 const extraSolids={rose:[[1.9,2.23,-1.80,-1.66],[3.10,5.95,-1.80,-1.66],[2.84,2.98,-1.65,-.65],[4.30,5.95,1.43,1.57]],sauge:[[-4.475,-3.125,-1.475,-.925]]};
 extraSolids.horizon=extraSolids.rose.map(b=>b.slice());
 const solidsFor=s=>[...solids.map((b,i)=>{const key=Object.keys(core.items).find(k=>core.items[k].solid===i);return key?core.bounds(s,key):b;}),...(extraSolids[s.home.residence]||[])];
 const passages=[[-1.15,1.15,1.55,5.3],[-4.45,-2.4,-3.35,-2.55],[2,4.5,-2.1,-1.45],[1.2,2,0,1.3],[-1.65,-1,0,1.3],[3,5.7,.1,1.4]];
 const passagesFor=s=>passages.map((b,i)=>{const key=i===2?'bed':i===3||i===4?'dining':null;if(!key)return b;const ps=[[b[0],b[2]],[b[0],b[3]],[b[1],b[2]],[b[1],b[3]]].map(p=>core.map(s,key,...p));return [Math.min(...ps.map(p=>p[0])),Math.max(...ps.map(p=>p[0])),Math.min(...ps.map(p=>p[1])),Math.max(...ps.map(p=>p[1]))];});
 function bounds(f){const item=town.furniture[f.type],turn=f.turn%2===1,w=turn?item.d:item.w,d=turn?item.w:item.d;return [f.x-w/2,f.x+w/2,f.z-d/2,f.z+d/2];}
 const overlaps=(a,b,p=.12)=>a[0]<b[1]+p&&a[1]>b[0]-p&&a[2]<b[3]+p&&a[3]>b[2]-p;
 function canPlace(s,f,ignore=null,restoring=false){if(!Object.hasOwn(town.furniture,f.type)||!Number.isFinite(f.x)||!Number.isFinite(f.z)||!Number.isInteger(f.turn)||f.turn<0||f.turn>3)return 'Placement invalide.';
  const b=bounds(f);if(b[0]< -5.55||b[1]>5.55||b[2]< -4.45||b[3]>4.45)return 'Place ce meuble à l’intérieur de la maison.';
  const rug=f.type==='rug';if(solidsFor(s).some(a=>overlaps(b,a,rug?0:.18))||(!rug&&passagesFor(s).some(a=>overlaps(b,a,.08))))return 'Cet emplacement occupe un meuble ou un passage.';
  if(s.home.furnishings.some(a=>a.id!==ignore&&!a.stored&&a.type!=='rug'&&!rug&&overlaps(b,bounds(a),.22)))return 'Laisse de la place autour des autres meubles.';
  const h=town.home(s);if(!restoring&&!rug&&s.x>=b[0]+h.x-.3&&s.x<=b[1]+h.x+.3&&s.z>=b[2]+h.z-.3&&s.z<=b[3]+h.z+.3)return 'Cet emplacement est trop proche de ton personnage.';
  if(!restoring&&!rug&&[...Object.values(s.citizens||{}),...(s.family?.children||[])].some(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)&&p.x>=b[0]+h.x-.35&&p.x<=b[1]+h.x+.35&&p.z>=b[2]+h.z-.35&&p.z<=b[3]+h.z+.35))return 'Une personne se trouve à cet endroit. Attends qu’elle se déplace.';
  return null;
 }
 function canBuiltin(s,key,p,restoring=false){if(!core.items[key]||!Number.isFinite(p.x)||!Number.isFinite(p.z)||!Number.isInteger(p.turn)||p.turn<0||p.turn>3)return 'Placement invalide.';const n=core.candidate(s,key,p),b=core.bounds(n,key);if(b[0]<-5.85||b[1]>5.85||b[2]<-4.87||b[3]>4.75)return 'Garde ce meuble dans la maison.';
  const original=p.turn===0&&Math.abs(p.x-core.items[key].x)<.001&&Math.abs(p.z-core.items[key].z)<.001;
  if(!original&&solidsFor(n).some((v,i)=>i!==core.items[key].solid&&overlaps(b,v,.14)))return 'Ce meuble touche un mur ou un autre meuble.';
  if([[-.8,.8,3.8,5.3],passages[1]].some(v=>overlaps(b,v,.08)))return 'Laisse libres l’entrée et la cuisine.';
  if((s.home.furnishings||[]).some(f=>!f.stored&&f.type!=='rug'&&overlaps(b,bounds(f),.18)))return 'Un meuble acheté occupe cet espace.';
  if(!restoring){const h=town.home(s);for(const a of [s,...Object.values(s.citizens||{}),...(s.family?.children||[])])if(Number.isFinite(a.x)&&Number.isFinite(a.z)&&a.x-h.x>b[0]-.30&&a.x-h.x<b[1]+.30&&a.z-h.z>b[2]-.30&&a.z-h.z<b[3]+.30)return 'Une personne est à cet emplacement.';}
  return null;
 }
 function restore(s,raw){s.home.residence=Object.hasOwn(town.houses,raw?.residence)?raw.residence:'soleil';s.home.owned=[...new Set(['soleil',...(['rent','shared'].includes(raw?.contract?.mode)?[]:[s.home.residence]),...(Array.isArray(raw?.owned)?raw.owned.filter(k=>Object.hasOwn(town.houses,k)):[])])];s.home.layouts=core.normalize(raw?.layouts);for(const home of Object.keys(s.home.layouts))for(const key of Object.keys(s.home.layouts[home])){const candidate={...s,home:{...s.home,residence:home}};if(canBuiltin(candidate,key,core.placement(candidate,key),true))delete s.home.layouts[home][key];}s.home.furnishings=[];s.home.nextFurniture=1;
  for(const f of (Array.isArray(raw?.furnishings)?raw.furnishings:[]).slice(0,10)){if(!Object.hasOwn(town.furniture,f?.type))continue;const used=s.home.furnishings.map(a=>a.id),id=Number.isInteger(f.id)&&f.id>0&&!used.includes(f.id)?f.id:s.home.nextFurniture;const a={id,type:f.type,x:Number.isFinite(f.x)?Math.round(f.x*4)/4:0,z:Number.isFinite(f.z)?Math.round(f.z*4)/4:0,turn:[0,1,2,3].includes(f.turn)?f.turn:0};if(Number.isInteger(f.finish)&&f.finish>=0&&f.finish<4)a.finish=f.finish;if(f.stored||canPlace(s,a,null,true))a.stored=true;s.home.furnishings.push(a);s.home.nextFurniture=Math.max(s.home.nextFurniture,id+1);}
  if(Number.isSafeInteger(raw?.nextFurniture))s.home.nextFurniture=Math.max(s.home.nextFurniture,raw.nextFurniture);
 }
 const collision=(s,f)=>{const b=bounds(f),h=town.home(s);return [b[0]+h.x,b[1]+h.x,b[2]+h.z,b[3]+h.z];};
 return {solids,extraSolids,solidsFor,passages,passagesFor,bounds,overlaps,canPlace,canBuiltin,restore,collision};
})(typeof module!=='undefined'?require('./town.js'):Town);
if(typeof module!=='undefined')module.exports=Housing;
