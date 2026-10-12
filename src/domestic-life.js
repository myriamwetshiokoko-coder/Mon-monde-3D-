/* Saved household appointments, walks and memories. No offline simulation. */
const DomesticLife=(()=>{
 const town=typeof module!=='undefined'?require('./town.js'):Town;
 const kinds={talk:{name:'Raconter notre journée',label:'Une pause pour votre journée',pose:'talk'},meal:{name:'Dîner ensemble',label:'Le dîner du foyer',pose:'eat'},tv:{name:'Une émission ensemble',label:'Votre soirée au salon',pose:'watch'}};
 const bounded=(v,min,max,fallback)=>Number.isFinite(v)?Math.max(min,Math.min(max,v)):fallback;
 function normalize(raw,s){const day=s.day,now=day*24+s.time,plan=raw?.plan===null?null:raw?.plan&&kinds[raw.plan.kind]?{kind:raw.plan.kind,hour:Math.round(bounded(raw.plan.hour,6,21,20)*2)/2}:raw?.plan?null:{kind:'talk',hour:20};
  const valid=id=>town.ids.includes(id)||['player','housemate'].includes(id)&&!!s.control;
  const memories=Array.isArray(raw?.memories)?raw.memories.filter(m=>m&&valid(m.actor)&&typeof m.text==='string'&&Number.isFinite(m.day)).slice(-12).map(m=>({actor:m.actor,day:Math.floor(bounded(m.day,1,day,day)),text:m.text.slice(0,160),kind:['talk','meal','tv','walk'].includes(m.kind)?m.kind:'talk'})):[];
  const out={plan,actor:valid(raw?.actor)?raw.actor:null,lastDay:Math.floor(bounded(raw?.lastDay,0,day,0)),notifiedDay:Math.floor(bounded(raw?.notifiedDay,0,day,0)),lastOutcome:['done','later','missed'].includes(raw?.lastOutcome)?raw.lastOutcome:'',lastWalkDay:Math.floor(bounded(raw?.lastWalkDay,0,day,0)),memories,walk:null};
  const w=raw?.walk;if(w&&valid(w.actor)&&s.citizens[w.actor]&&cohabits(s,w.actor)&&Number.isFinite(w.started)&&Number.isFinite(w.until)&&w.started<=now&&w.until>now&&w.until-w.started<=6&&Number.isInteger(w.checkpoint)&&w.checkpoint>=0&&w.checkpoint<3)out.walk={actor:w.actor,started:w.started,until:w.until,checkpoint:w.checkpoint};return out;
 }
 function actor(s){const id=s.domestic.actor||s.family.movedIn&&s.family.partnerId||s.control&&(s.control.active==='housemate'?'player':'housemate');return id&&s.citizens[id]?id:null;}
 function cohabits(s,id){return s.family.movedIn&&s.family.partnerId===id||!!s.control&&id===(s.control.active==='housemate'?'player':'housemate');}
 function due(s,id){const d=s.domestic,p=d.plan,c=s.citizens[id];return !!(p&&actor(s)===id&&cohabits(s,id)&&d.lastDay!==s.day&&!d.walk&&s.rp.enabled&&s.rp.autonomy&&s.time>=p.hour&&s.time<Math.min(22,p.hour+2)&&!s.career.shift&&!c.shift&&c.needs.energy>24&&c.needs.hygiene>30&&c.needs.hunger>20);}
 function remember(s,id,kind,text){s.domestic.memories.push({actor:id,kind,day:s.day,text:String(text).slice(0,160)});if(s.domestic.memories.length>12)s.domestic.memories.shift();}
 function finishPlan(s,id,kind){const d=s.domestic;if(d.lastDay===s.day)return false;d.lastDay=s.day;d.lastOutcome='done';remember(s,id,kind,kinds[kind].name+' avec '+(town.byId[id]?.name||s.control?.inactive.name||'un membre du foyer')+'.');return true;}
 function walkError(s,id){if(!cohabits(s,id)||!s.citizens[id])return 'Choisis une personne qui vit dans ton foyer.';if(s.domestic.walk)return 'Une promenade est déjà en cours.';if(s.career.shift||s.citizens[id].shift)return 'Terminez vos services avant la promenade.';if(s.time<6||s.time>=21)return 'Les promenades commencent entre 6 h et 21 h.';if(!town.inside(s)||!town.inside(s,s.citizens[id].x,s.citizens[id].z)||Math.hypot(s.x-s.citizens[id].x,s.z-s.citizens[id].z)>3.1)return 'Retrouvez-vous près l’un de l’autre à la maison.';return null;}
 function finishWalk(s){const w=s.domestic.walk;if(!w||w.checkpoint<3)return false;const c=s.citizens[w.actor];if(!c)return false;const rewarded=s.domestic.lastWalkDay!==s.day;if(rewarded){s.fun=Math.min(100,s.fun+18);s.social=Math.min(100,s.social+12);c.needs.fun=Math.min(100,c.needs.fun+18);c.needs.social=Math.min(100,c.needs.social+12);s.relationships[w.actor]=Math.min(100,(s.relationships[w.actor]||0)+3);s.domestic.lastWalkDay=s.day;}remember(s,w.actor,'walk','Une promenade de la maison au parc, en passant par le quartier.');s.domestic.walk=null;return true;}
 return {kinds,normalize,actor,cohabits,due,remember,finishPlan,walkError,finishWalk};
})();
if(typeof module!=='undefined')module.exports=DomesticLife;
