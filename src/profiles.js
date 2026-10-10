/* Local independent stories. The legacy save remains available for older versions. */
const Profiles=(()=>{
 const key='monmonde3d_stories',limit=6;
 function read(storage,fallback){let raw;try{raw=JSON.parse(storage.getItem(key))}catch{}const slots=Array.isArray(raw?.slots)?raw.slots.filter(s=>s&&typeof s.id==='string'&&/^story-[0-9]+$/.test(s.id)&&s.state&&Number.isFinite(s.state.x)).filter((s,i,a)=>a.findIndex(t=>t.id===s.id)===i).slice(0,limit):[];
  if(!slots.length)slots.push({id:'story-1',state:JSON.parse(JSON.stringify(fallback))});
  return {active:slots.some(s=>s.id===raw?.active)?raw.active:slots[0].id,next:Math.max(2,...slots.map(s=>Number(s.id.split('-')[1])+1||2)),slots};
 }
 function persist(storage,data){storage.setItem(key,JSON.stringify(data))}
 function snapshot(data,state){const copy=JSON.parse(JSON.stringify(data)),slot=copy.slots.find(s=>s.id===copy.active);slot.state=JSON.parse(JSON.stringify(state));return copy}
 function create(data,state){if(data.slots.length>=limit)throw Error('Six parties au maximum.');const copy=JSON.parse(JSON.stringify(data)),id='story-'+copy.next++;copy.slots.push({id,state:JSON.parse(JSON.stringify(state))});copy.active=id;return copy}
 return {key,limit,read,persist,snapshot,create};
})();
if(typeof module!=='undefined')module.exports=Profiles;
