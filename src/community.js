// Each resident keeps an independent route, needs, activity and paid workday.
const npcInfo=Town.byId,npcNames=Object.fromEntries(Town.people.map(p=>[p.id,p.name]));
function targetFor(n){const f=state.family,h=state.time,c=state.citizens[n.id],info=npcInfo[n.id],at=(x,z)=>Town.point(state,x,z),meet=state.appointments[n.id];
 if(meet?.until>Life.stamp(state))return {key:'meeting'+meet.until,point:meet.point,pose:'',label:'Votre rendez-vous'};
 if(state.visits[n.id]>Life.stamp(state))return {key:'visit',point:at(-1,3),pose:'talk',label:'En visite chez toi'};
 const together=Household.partner(state,n.id);
 if(together&&(h>=22||h<6))return {key:'shared-sleep',point:at(2.6,-1.85),pose:'sleep',anchor:[...at(2.6,-3.55),0,0],label:'Au repos à la maison',rest:true};
 const work=Household.workTarget(state,n.id);if(work)return work;
 if(together&&(h>=18||h<8||['player','housemate'].includes(n.id))){
  if(c.needs.hunger<65&&Life.stamp(state)-c.lastMeal>2){if(state.meals>0)return {key:'family-eat',point:at(-1.2,1.2),pose:'eat',anchor:[...at(-1.2,.5),PI/2,0],label:'Mange un repas à la maison',meal:true};if(state.groceries>0)return {key:'family-cook',point:at(-3.3,-3.05),pose:'cook',dir:PI,label:'Prépare le dîner du foyer',cook:true};}
  if(c.needs.hygiene<55)return {key:'family-wash',point:at(3.55,2.5),pose:'shower',label:'Se rafraîchit à la maison',wash:true};
  return {key:f.autoCare?'home-care':'home-together',point:at(f.autoCare?2.5:-3.8,f.autoCare?1:1.4),pose:f.autoCare?'':'watch',anchor:f.autoCare?null:[...at(-4.4,2.65),PI,.18],label:'À la maison',leisure:true};
 }
 const house=n.id==='noah'?27:-27,seat=info.seat;
 if(h<6||h>=22)return {key:'home',point:info.home,pose:['noah','emma'].includes(n.id)?'sleep':n.id==='lina'?'sit':'readStand',anchor:n.id==='lina'?seat:['noah','emma'].includes(n.id)?[house-1.8,7,0,0]:null,label:'Chez soi',rest:true};
 if(h<8)return {key:'breakfast',point:seat.slice(0,2),pose:'eat',anchor:seat,label:'Petit déjeuner au café',meal:true};
 if(h<12)return {key:'morning',point:info.park,pose:'readStand',label:'Une matinée libre',leisure:true};
 if(h<14)return {key:'lunch',point:seat.slice(0,2),pose:'eat',anchor:seat,label:'Déjeuner au café',meal:true};
 if(h<18)return {key:'park',point:info.park,pose:info.parkSeat?'read':'readStand',anchor:info.parkSeat||null,label:'Au parc',leisure:true};
 if(h<20){if(['noah','emma'].includes(n.id))return {key:'dinner',point:[house+2,8.7],pose:'eat',anchor:[house+2,9.7,PI,.26],label:'Dîner au calme',meal:true};return {key:'dinner-cafe',point:seat.slice(0,2),pose:'eat',anchor:seat,label:'Dîner au café',meal:true};}
 return {key:'evening',point:n.id==='lina'?seat.slice(0,2):['noah','emma'].includes(n.id)?[house+2,8.7]:info.park,pose:['lina','noah','emma'].includes(n.id)?'watch':'readStand',anchor:n.id==='lina'?[-9.5,30,0,0]:['noah','emma'].includes(n.id)?[house+2,9.7,PI,.26]:null,label:['lina','noah','emma'].includes(n.id)?'Soirée télévision':'Lecture du soir',leisure:true};
}
// A conversation uses one shared direction convention (+Z is the model's face).
function alignConversation(a){const n=residents.find(n=>n.id===a.npc);if(!n)return 'Cette personne est indisponible.';if(Math.hypot(state.x-n.x,state.z-n.z)>3.1)return 'Approche-toi de cette personne pour discuter.';
 const routine=targetFor(n);if(routine.anchor&&n.pose===routine.pose){const origin=[n.x,n.z];for(const angle of [routine.anchor[2]+PI/2,routine.anchor[2]-PI/2,routine.anchor[2],routine.anchor[2]+PI]){const x=origin[0]+Math.sin(angle)*1.05,z=origin[1]+Math.cos(angle)*1.05;if(Math.hypot(x-state.x,z-state.z)<=3.1&&Life.valid(x,z,barriers)&&!residents.some(p=>p!==n&&Math.hypot(p.x-x,p.z-z)<.7)){n.x=x;n.z=z;break;}}}
 let d=Math.hypot(state.x-n.x,state.z-n.z);if(d<1.05||(a.planBaby&&d>1.75)){const initial=Math.atan2(state.x-n.x,state.z-n.z);let found=null;for(const angle of [initial,initial+.6,initial-.6,initial+1.2,initial-1.2,initial+PI]){const x=n.x+Math.sin(angle)*1.25,z=n.z+Math.cos(angle)*1.25;if([.25,.5,.75,1].every(t=>Life.valid(state.x+(x-state.x)*t,state.z+(z-state.z)*t,barriers))){found=[x,z];break}}if(!found)return 'Il manque un peu de place ici. Avance dans un espace libre.';[state.x,state.z]=found;}
 facing=Math.atan2(n.x-state.x,n.z-state.z);n.dir=Math.atan2(state.x-n.x,state.z-n.z);n.pose='talk';n.moving=0;n.socialUntil=0;n.socialPartner=null;n.targetKey=null;state.citizens[n.id].x=n.x;state.citizens[n.id].z=n.z;return null;
}
function updateResidents(dt){for(const n of residents){const c=state.citizens[n.id];Household.prepareWork(state,n.id);n.moving=0;
 if(activity?.npc===n.id){n.pose=activity.familyStart?'sleep':activity.pose==='eat'?'eat':'talk';const p=avatarLocation();n.dir=Math.atan2(p[0]-n.x,p[1]-n.z);n.label='En conversation';n.el.textContent=n.name+' · '+n.label;c.x=n.x;c.z=n.z;continue;}
 if(n.socialUntil>0){n.socialUntil-=dt;const friend=residents.find(p=>p.id===n.socialPartner);if(friend){n.dir=Math.atan2(friend.x-n.x,friend.z-n.z);n.pose='talk';n.label='Discute avec '+friend.name;n.el.textContent=n.name+' · '+n.label;}if(n.socialUntil<=0){n.socialPartner=null;n.targetKey=null;}continue;}
 const t=targetFor(n);n.label=t.label;if(n.targetKey!==t.key){n.targetKey=t.key;n.path=Navigation.path([n.x,n.z],t.point,barriers);n.pathIndex=0;n.pose='';n.routineProgress=0;n.blockedTime=0;}
 if(n.pathIndex<n.path.length){const p=n.path[n.pathIndex],d=Math.hypot(p[0]-n.x,p[1]-n.z);if(d<.06){n.pathIndex++;}else{const step=Math.min(d,dt*1.02),oldX=n.x,oldZ=n.z;const obstacles=Traffic.movementBarriers(barriers);Navigation.move(n,(p[0]-n.x)/d*step,(p[1]-n.z)/d*step,obstacles);const travelled=Math.hypot(n.x-oldX,n.z-oldZ);n.blockedTime=travelled<step*.1?(n.blockedTime||0)+dt:0;if(n.blockedTime>1){const path=Navigation.path([n.x,n.z],t.point,obstacles);if(path.length){n.path=path;n.pathIndex=0;}n.blockedTime=0;}n.dir=Math.atan2(p[0]-n.x,p[1]-n.z);n.moving=travelled>.0001?1:0;n.phase+=travelled*4.5;n.pose='';}}
 else if(Math.hypot(n.x-t.point[0],n.z-t.point[1])<.56){n.pose=t.pose;n.dir=t.anchor?.[2]??t.dir??n.dir;n.routineProgress+=dt;if(t.work){if(Household.performWork(state,n.id,dt,n.x,n.z)){n.targetKey=null;save();}}
  else if(t.cook&&n.routineProgress>=10&&state.groceries>0){state.groceries--;state.meals+=2;n.routineProgress=0;n.targetKey=null;Life.record(state,n.name+' a préparé deux repas pour le foyer.');save();}
  else if(t.meal&&n.routineProgress>=10&&Life.stamp(state)-c.lastMeal>2){if(t.key==='family-eat'&&state.meals>0)state.meals--;c.needs.hunger=Math.min(100,c.needs.hunger+45);c.lastMeal=Life.stamp(state);n.routineProgress=0;save();}
  else if(t.wash&&n.routineProgress>=8){c.needs.hygiene=95;n.targetKey=null;save();}
  else if(t.rest){c.needs.energy=Math.min(100,c.needs.energy+dt*.12);}
  else if(t.leisure){c.needs.fun=Math.min(100,c.needs.fun+dt*.1);}
 }
 if(n.careUntil>elapsed)n.pose='cuddle';c.x=n.x;c.z=n.z;n.el.textContent=n.name+' · '+n.label;
 }
 updateAmbientSocial(dt);
}
let ambientTimer=0;
function availableForAmbient(n){const t=targetFor(n);return !n.moving&&!n.socialUntil&&activity?.npc!==n.id&&!t.work&&!t.rest&&!t.meal&&!t.cook&&!t.wash&&(n.careUntil||0)<=elapsed&&Life.valid(n.x,n.z,barriers);}
function updateAmbientSocial(dt){ambientTimer+=dt;if(ambientTimer<4)return;ambientTimer=0;for(const a of residents){const ca=state.citizens[a.id];if(!availableForAmbient(a)||ca.needs.social>=62||Life.stamp(state)-ca.lastChat<1)continue;const b=residents.find(n=>n!==a&&availableForAmbient(n)&&Life.stamp(state)-state.citizens[n.id].lastChat>=1&&Math.hypot(n.x-a.x,n.z-a.z)>.9&&Math.hypot(n.x-a.x,n.z-a.z)<2.4);if(!b)continue;for(const [n,other]of [[a,b],[b,a]]){n.socialUntil=8;n.socialPartner=other.id;n.pose='talk';n.dir=Math.atan2(other.x-n.x,other.z-n.z);const c=state.citizens[n.id];c.needs.social=Math.min(100,c.needs.social+18);c.lastChat=Life.stamp(state);}}}
// Objects retain their original effects; animation poses match their activity.
for(const a of interactions){if(a.cook)a.pose='cook';else if(a.eat||a.name==='Café Fleur')a.pose='eat';else if(a.name==='Salle de bain')a.pose='shower';else if(a.name==='Salon'||a.name==='Télévision'||a.name.includes('Banc'))a.pose='sit';else if(a.verb.includes('Lire'))a.pose='read'}
interactions.push({x:0,z:38.5,r:2,name:'Arche des fleurs',verb:'💐 Célébrer le mariage · 40 sols',desc:'Les vœux sont échangés sous les fleurs.',seconds:12,cost:40,wedding:true,effect:{social:35,fun:35},pose:'talk',result:'Vous êtes mariés ! Le carnet garde ce souvenir.'});
const childEntities=new Map();
function childEntity(index){const c=state.family.children[index];if(!c)return null;let n=childEntities.get(index);if(!n||n.name!==c.name){n?.el.remove?.();n={x:Life.valid(c.x,c.z,barriers)?c.x:Town.home(state).x+1.7+index*.45,z:Life.valid(c.x,c.z,barriers)?c.z:2.3,dir:0,moving:0,next:0,returning:!state.family.outing&&Life.valid(c.x,c.z,barriers)&&(Math.abs(c.x-Town.home(state).x)>5.8||c.z>4.6),name:c.name};n.el=document.createElement('div');n.el.className='worldLabel';n.el.textContent=c.name;$('labels').append(n.el);childEntities.set(index,n)}return n}
function updateChildren(dt){for(let i=0;i<state.family.children.length;i++){const c=state.family.children[i],n=childEntity(i);n.moving=0;if(Life.stage(state,c)==='baby'||activity?.child===i)continue;if(state.family.outing||n.returning){followChild(n,dt);if(!state.family.outing&&Math.hypot(n.x-Town.home(state).x-2.5,n.z-2.3)<1.3)n.returning=false;continue}n.path=null;const route=[[1.7,2.3],[2.5,1.6],[3.2,1.8],[2.5,2.5]],local=route[n.next],p=Town.point(state,...local),d=Math.hypot(p[0]-n.x,p[1]-n.z);if(d<.07){n.next=(n.next+1)%route.length;continue}const step=Math.min(d,dt*.35);Navigation.move(n,(p[0]-n.x)/d*step,(p[1]-n.z)/d*step,barriers);n.dir=Math.atan2(p[0]-n.x,p[1]-n.z);n.moving=1}for(const [index,n]of childEntities)if(!state.family.children[index]){n.el.remove?.();childEntities.delete(index)}}
function familyInteractions(){return state.family.children.map((c,i)=>{const n=childEntity(i),baby=Life.stage(state,c)==='baby';return {x:baby?Town.home(state).x+3.9+i*1.2:n.x,z:baby?-.5:n.z,r:1.5,name:c.name,verb:'🧸 Prendre soin',child:i}})}
function drawFamily(){for(let i=0;i<state.family.children.length;i++){const c=state.family.children[i];if(Life.stage(state,c)==='baby')drawBaby(c,i);else{const n=childEntity(i);human(n.x,n.z,n.dir,c.skin,(i+1)%8,elapsed*5,n.moving,c.hair||0,1,activity?.child===i?'talk':'',2,0,Life.stage(state,c)==='toddler'?.43:.6,0,{body:c.sex==='male'?'male':'female'})}}}
