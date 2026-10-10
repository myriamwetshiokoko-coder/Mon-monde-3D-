/* Furniture placement rules shared by the floor plan, collisions and save migration. */
const Housing=((town)=>{
 const solids=[[-6.3,-5.9,-5.2,5.2],[5.9,6.3,-5.2,5.2],[-6.3,6.3,-5.27,-4.87],[-6.3,-1.08,4.9,5.23],[1.08,6.3,4.9,5.23],[-5.82,-1.02,-4.52,-3.45],[1.9,4.43,-4.85,-2.2],[-5.25,-2.61,2.04,3.39],[-2.95,-1.43,1.55,2.49],[-.93,1.29,-.33,1.31],[4.05,5.96,2.54,4.06],[4.7,5.88,-2.28,-1.31],[-5.9,-4.8,-2.98,-1.88],[.85,1.7,-4.325,-2.675],[-1.6,-.6,-1.95,-1.45],[-5.58,-4.34,.35,1.05],[3.42,4.38,-1.08,.08],[4.62,5.58,-1.08,.08]];
 // The entrance, kitchen approach, dining seats, bedroom and nursery stay accessible.
 const passages=[[-1.15,1.15,1.55,5.3],[-4.45,-2.4,-3.35,-2.55],[2,4.5,-2.1,-1.45],[1.2,2,0,1.3],[-1.65,-1,0,1.3],[3,5.7,.1,1.4]];
 function bounds(f){const item=town.furniture[f.type],turn=f.turn%2===1,w=turn?item.d:item.w,d=turn?item.w:item.d;return [f.x-w/2,f.x+w/2,f.z-d/2,f.z+d/2];}
 const overlaps=(a,b,p=.12)=>a[0]<b[1]+p&&a[1]>b[0]-p&&a[2]<b[3]+p&&a[3]>b[2]-p;
 function canPlace(s,f,ignore=null,restoring=false){if(!Object.hasOwn(town.furniture,f.type)||!Number.isFinite(f.x)||!Number.isFinite(f.z)||!Number.isInteger(f.turn)||f.turn<0||f.turn>3)return 'Placement invalide.';
  const b=bounds(f);if(b[0]< -5.55||b[1]>5.55||b[2]< -4.45||b[3]>4.45)return 'Place ce meuble à l’intérieur de la maison.';
  const rug=f.type==='rug';if(solids.some(a=>overlaps(b,a,rug?0:.18))||(!rug&&passages.some(a=>overlaps(b,a,.08))))return 'Cet emplacement occupe un meuble ou un passage.';
  if(s.home.furnishings.some(a=>a.id!==ignore&&!a.stored&&a.type!=='rug'&&!rug&&overlaps(b,bounds(a),.22)))return 'Laisse de la place autour des autres meubles.';
  const h=town.home(s);if(!restoring&&!rug&&s.x>=b[0]+h.x-.3&&s.x<=b[1]+h.x+.3&&s.z>=b[2]+h.z-.3&&s.z<=b[3]+h.z+.3)return 'Cet emplacement est trop proche de ton personnage.';
  if(!restoring&&!rug&&[...Object.values(s.citizens||{}),...(s.family?.children||[])].some(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)&&p.x>=b[0]+h.x-.35&&p.x<=b[1]+h.x+.35&&p.z>=b[2]+h.z-.35&&p.z<=b[3]+h.z+.35))return 'Une personne se trouve à cet endroit. Attends qu’elle se déplace.';
  return null;
 }
 function restore(s,raw){s.home.residence=Object.hasOwn(town.houses,raw?.residence)?raw.residence:'soleil';s.home.owned=[...new Set(['soleil',s.home.residence,...(Array.isArray(raw?.owned)?raw.owned.filter(k=>Object.hasOwn(town.houses,k)):[])])];s.home.furnishings=[];s.home.nextFurniture=1;
  for(const f of (Array.isArray(raw?.furnishings)?raw.furnishings:[]).slice(0,10)){if(!Object.hasOwn(town.furniture,f?.type))continue;const used=s.home.furnishings.map(a=>a.id),id=Number.isInteger(f.id)&&f.id>0&&!used.includes(f.id)?f.id:s.home.nextFurniture;const a={id,type:f.type,x:Number.isFinite(f.x)?Math.round(f.x*4)/4:0,z:Number.isFinite(f.z)?Math.round(f.z*4)/4:0,turn:[0,1,2,3].includes(f.turn)?f.turn:0};if(f.stored||canPlace(s,a,null,true))a.stored=true;s.home.furnishings.push(a);s.home.nextFurniture=Math.max(s.home.nextFurniture,id+1);}
  if(Number.isSafeInteger(raw?.nextFurniture))s.home.nextFurniture=Math.max(s.home.nextFurniture,raw.nextFurniture);
 }
 const collision=(s,f)=>{const b=bounds(f),h=town.home(s);return [b[0]+h.x,b[1]+h.x,b[2]+h.z,b[3]+h.z];};
 return {solids,passages,bounds,overlaps,canPlace,restore,collision};
})(typeof module!=='undefined'?require('./town.js'):Town);
if(typeof module!=='undefined')module.exports=Housing;
