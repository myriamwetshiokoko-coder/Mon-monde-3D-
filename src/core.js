/* Versioned simulation, transactions and family lifecycle. No network or private data. */
const Life = (() => {
 const needs=['hunger','energy','hygiene','fun','social'],ids=['lina','noah','emma'];
 const defaults={version:2,x:0,z:3,time:9,day:1,hunger:75,energy:82,hygiene:88,fun:72,social:65,name:'Mon personnage',skin:2,outfit:0,hair:0,face:0,style:0,hairColor:0,money:120,groceries:3,meals:0,relationships:{lina:0,noah:0,emma:0},romance:{lina:0,noah:0,emma:0},lastTalk:{},visits:{},appointments:{},family:{partnerId:null,status:'single',sinceDay:0,movedIn:false,pregnancy:null,children:[],outing:false,autoCare:false},workDay:0,skill:0,journal:[],settings:{quality:1.35,zoom:6.8,follow:false,sound:false,deadZone:.18,sensitivity:.7},appearance:{body:'female',height:1,width:1,eyes:0,glasses:false},home:{theme:0,flowers:false,lights:false},skills:{garden:0,creative:0},garden:{plantedDay:0,harvestDay:0},inventory:{bouquets:0},delivery:null,deliveryDay:0,achievements:[],lastCare:0};
 const recipes={simple:{name:'Assiette maison',provisions:1,portions:1,level:0},brunch:{name:'Brunch gourmand',provisions:2,portions:3,level:2},feast:{name:'Repas de famille',provisions:3,portions:5,level:5}};
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));const stamp=s=>s.day*24+s.time;
 function restore(raw){const s=JSON.parse(JSON.stringify(defaults));if(!raw||typeof raw!=='object')return s;
 for(const k of ['deliveryDay','lastCare','x','z','time','day',...needs,'skin','outfit','hair','face','style','hairColor','money','groceries','meals','workDay','skill'])if(Number.isFinite(raw[k]))s[k]=raw[k];
 for(const k of needs)s[k]=clamp(s[k],0,100);for(const k of ['money','groceries','meals','skill','workDay','deliveryDay'])s[k]=clamp(Math.floor(s[k]),0,1e6);
 for(const k of ['skin','outfit','hairColor'])s[k]=clamp(Math.floor(s[k]),0,3);for(const k of ['hair','face','style'])s[k]=clamp(Math.floor(s[k]),0,2);
 s.time=((s.time%24)+24)%24;s.day=clamp(Math.floor(s.day),1,1e6);s.name=typeof raw.name==='string'?raw.name.slice(0,18):s.name;
 for(const id of ids){s.relationships[id]=clamp(Number(raw.relationships?.[id])||0,0,100);s.romance[id]=clamp(Number(raw.romance?.[id])||0,0,100);if(Number.isFinite(raw.lastTalk?.[id]))s.lastTalk[id]=raw.lastTalk[id];if(Number.isFinite(raw.visits?.[id]))s.visits[id]=raw.visits[id]}
 for(const id of ids){const a=raw.appointments?.[id];if(a&&Number.isFinite(a.until)&&Array.isArray(a.point)&&a.point.length===2&&a.point.every(Number.isFinite)&&Math.abs(a.point[0])<=31.5&&a.point[1]>=-4.48&&a.point[1]<=45.5)s.appointments[id]={until:a.until,point:[...a.point]}}
 const f=raw.family;if(f&&ids.includes(f.partnerId)){s.family.partnerId=f.partnerId;s.family.status=['couple','engaged','married'].includes(f.status)?f.status:'couple';s.family.sinceDay=clamp(Math.floor(Number(f.sinceDay)||s.day),1,s.day);s.family.movedIn=!!f.movedIn;}
 if(f?.pregnancy&&Number.isFinite(f.pregnancy.dueDay))s.family.pregnancy={dueDay:Math.max(s.day,Math.floor(f.pregnancy.dueDay)),name:String(f.pregnancy.name||'Soleil').slice(0,18)};
 if(Array.isArray(f?.children))s.family.children=f.children.slice(0,2).filter(c=>c&&Number.isFinite(c.bornDay)).map((c,i)=>({id:'child'+i,name:String(c.name||'Soleil').slice(0,18),bornDay:clamp(Math.floor(c.bornDay),1,s.day),hunger:clamp(Number.isFinite(c.hunger)?c.hunger:50,0,100),comfort:clamp(Number.isFinite(c.comfort)?c.comfort:50,0,100),fun:clamp(Number.isFinite(c.fun)?c.fun:50,0,100),skin:clamp(Math.floor(Number.isFinite(c.skin)?c.skin:s.skin),0,3)}));
 s.journal=Array.isArray(raw.journal)?raw.journal.slice(-30).filter(e=>e&&typeof e.text==='string').map(e=>({day:clamp(Number(e.day)||1,1,s.day),text:e.text.slice(0,140)})):[];
 s.appearance={body:raw.appearance?.body==='male'?'male':'female',height:clamp(Number(raw.appearance?.height)||1,.9,1.1),width:clamp(Number(raw.appearance?.width)||1,.85,1.2),eyes:clamp(Math.floor(Number(raw.appearance?.eyes)||0),0,2),glasses:!!raw.appearance?.glasses};
 s.home={theme:clamp(Math.floor(Number(raw.home?.theme)||0),0,2),flowers:!!raw.home?.flowers,lights:!!raw.home?.lights};
 for(const key of ['garden','creative'])s.skills[key]=clamp(Math.floor(Number(raw.skills?.[key])||0),0,1000);
 s.garden={plantedDay:clamp(Math.floor(Number(raw.garden?.plantedDay)||0),0,s.day),harvestDay:clamp(Math.floor(Number(raw.garden?.harvestDay)||0),0,s.day)};
 s.inventory.bouquets=clamp(Math.floor(Number(raw.inventory?.bouquets)||0),0,99);
 if(raw.delivery&&Number.isFinite(raw.delivery.day)&&raw.delivery.day===s.day)s.delivery={day:s.day};
 s.achievements=Array.isArray(raw.achievements)?[...new Set(raw.achievements.filter(v=>['meal','explorer','friend','artist','family'].includes(v)))]:[];
 s.family.outing=!!f?.outing;s.family.autoCare=!!f?.autoCare;for(let i=0;i<s.family.children.length;i++)s.family.children[i].learning=clamp(Math.floor(Number(f.children[i]?.learning)||0),0,1000);
 for(let i=0;i<s.family.children.length;i++){const c=f.children[i];if(Number.isFinite(c.x)&&Number.isFinite(c.z)){s.family.children[i].x=c.x;s.family.children[i].z=c.z}}
 if(raw.settings){s.settings.quality=[1,1.35,1.7].includes(raw.settings.quality)?raw.settings.quality:1.35;s.settings.zoom=clamp(Number(raw.settings.zoom)||6.8,3.5,11);s.settings.follow=!!raw.settings.follow;s.settings.sound=!!raw.settings.sound;s.settings.deadZone=clamp(Number(raw.settings.deadZone)||.18,.1,.3);s.settings.sensitivity=clamp(Number(raw.settings.sensitivity)||.7,.4,1.2)}return s;
 }
 function valid(x,z,barriers,door=1){if(!Number.isFinite(x)||!Number.isFinite(z)||x< -31.5||x>31.5||z< -4.48||z>45.5)return false;for(const b of barriers){if(x<b[0]-.28||x>b[1]+.28||z<b[2]-.28||z>b[3]+.28)continue;const xx=clamp(x,b[0],b[1]),zz=clamp(z,b[2],b[3]);if((x-xx)**2+(z-zz)**2<.28**2)return false}return !(door<.56&&Math.abs(x)<1.08&&Math.abs(z-5.05)<.24)}
 function record(s,text){s.journal.push({day:s.day,text});if(s.journal.length>30)s.journal.shift()}
 function advance(s,hours,simulate=false){if(simulate)decay(s,hours*45);s.time+=hours;while(s.time>=24){s.time-=24;s.day++;if(s.delivery&&s.delivery.day<s.day)s.delivery=null;record(s,'Une nouvelle journée au quartier Soleil.')}const p=s.family.pregnancy;if(p&&s.day>=p.dueDay&&s.family.children.length<2){addChild(s,p.name);s.family.pregnancy=null;record(s,'La famille accueille un bébé !')}}
 function addChild(s,name){s.family.children.push({id:'child'+s.family.children.length,name:String(name||'Soleil').trim().slice(0,18)||'Soleil',bornDay:s.day,hunger:80,comfort:85,fun:75,skin:s.skin,learning:0})}
 function stage(s,c){return s.day-c.bornDay>=4?'child':s.day-c.bornDay>=2?'toddler':'baby'}
 function can(s,a){const f=s.family,id=a.npc;
 if(a.recipe&&(!recipes[a.recipe]||s.skill<recipes[a.recipe].level))return 'Améliore ta cuisine pour débloquer cette recette.';
 if(a.recipe&&s.groceries<recipes[a.recipe].provisions)return 'Pas assez de provisions pour cette recette.';
 if(a.plant&&s.garden.plantedDay)return 'Une plantation pousse déjà.';
 if(a.harvest&&(!s.garden.plantedDay||s.day<=s.garden.plantedDay))return 'La récolte sera prête le lendemain de la plantation.';
 if(a.bouquet&&s.groceries<1)return 'Une provision est nécessaire pour confectionner le bouquet.';
 if(a.socialAction==='gift'&&s.inventory.bouquets<1)return 'Confectionne un bouquet à la table créative.';
 if(a.socialAction==='date'&&(f.partnerId!==id||Math.hypot(s.x+12,s.z-29)>5))return 'Retrouvez-vous au Café Fleur avec ton partenaire.';
 if(a.startDelivery&&(s.delivery||s.deliveryDay===s.day))return 'Une livraison est en cours ou a déjà été faite aujourd’hui.';
 if(a.completeDelivery&&(!s.delivery||s.delivery.day!==s.day||Math.hypot(s.x-27,s.z-12.3)>2))return 'Récupère une commande au café puis apporte-la devant la maison de Noah.';
 if(a.purchase&&(!['flowers','lights'].includes(a.purchase)||s.home[a.purchase]))return 'Cette décoration est déjà installée ou indisponible.';
 if(a.care==='learn'&&s.family.children[a.child]&&stage(s,s.family.children[a.child])==='baby')return 'Les apprentissages commencent au stade bambin.';
 if(a.picnic&&!f.children.some(c=>stage(s,c)!=='baby'))return 'Une sortie nécessite un bambin ou un enfant.';
 if(a.picnic&&s.meals<1)return 'Prépare un repas à partager.';
 if(a.picnic&&(!f.outing||Math.hypot(s.x,s.z-36)>4))return 'Active la sortie familiale puis retrouve ta famille au parc.';
 if(a.cost&&s.money<a.cost)return 'Pas assez de pièces.';if(a.cook&&s.groceries<1)return 'Achète des provisions à l’épicerie.';if(a.eat&&s.meals<1)return 'Prépare un repas dans la cuisine.';if(a.work&&s.workDay===s.day)return 'Tu as déjà travaillé aujourd’hui.';
 if(a.socialAction&&!ids.includes(id))return 'Habitant introuvable.';
 if(a.socialAction&&['chat','interest','joke','flirt','gift','date'].includes(a.socialAction)&&stamp(s)-(s.lastTalk[id]??-100)<.16)return 'Laissons un peu de temps entre deux conversations.';
 if(['flirt','couple'].includes(a.socialAction)&&f.partnerId&&f.partnerId!==id)return 'Tu es déjà en couple. Une séparation se décide dans le carnet.';
 if(a.socialAction==='flirt'&&s.relationships[id]<35)return 'Apprenez d’abord à vous connaître (amitié 35).';
 if(a.socialAction==='couple'&&(s.relationships[id]<55||s.romance[id]<40))return 'Votre lien doit grandir : amitié 55 et affection 40.';
 if(a.socialAction==='couple'&&f.partnerId===id)return 'Vous êtes déjà en couple.';
 if(['moveIn','propose'].includes(a.socialAction)&&f.partnerId!==id)return 'Il faut être en couple avec cette personne.';
 if(a.socialAction==='propose'&&(f.status!=='couple'||s.romance[id]<75||s.day<=f.sinceDay))return 'La demande attend un jour de couple et une affection de 75.';
 if(a.socialAction==='moveIn'&&f.movedIn)return 'Vous habitez déjà ensemble.';
 if(a.socialAction==='invite'&&s.relationships[id]<20)return 'Faites connaissance avant une invitation (amitié 20).';
 if(a.wedding&&(f.status!=='engaged'||Math.hypot(s.x,s.z-39)>3))return 'Des fiançailles et une présence sous l’arche du parc sont nécessaires.';
 if(a.planBaby||a.adopt){if(!f.partnerId||!f.movedIn)return 'Commencez par vivre ensemble.';if(f.children.length>=2||f.pregnancy)return 'La famille a déjà un projet en cours ou deux enfants.';}
 if(a.child!==undefined&&!s.family.children[a.child])return 'Enfant introuvable.';if(a.care==='feed'&&s.groceries<1)return 'Une provision est nécessaire.';return null}
 function apply(s,a){const error=can(s,a);if(error)return error;s.money-=a.cost||0;if(a.cook){const r=recipes[a.recipe||'simple'];s.groceries-=r.provisions;s.meals+=r.portions;s.skill++}if(a.eat)s.meals--;if(a.shop)s.groceries+=3;if(a.work){s.money+=65+Math.min(20,s.skill);s.workDay=s.day;advance(s,3,true)}if(a.sleep)advance(s,8,true);
 for(const [k,v]of Object.entries(a.effect||{}))if(needs.includes(k))s[k]=clamp(s[k]+v,0,100);
 if(a.socialAction){const id=a.npc,action=a.socialAction,bonuses={chat:8,interest:12,joke:7,flirt:3,gift:10,date:15};if(bonuses[action]){s.relationships[id]=clamp(s.relationships[id]+bonuses[action],0,100);s.lastTalk[id]=stamp(s)}if(action==='gift'){s.inventory.bouquets--;s.romance[id]=clamp(s.romance[id]+5,0,100)}if(action==='date'){s.romance[id]=clamp(s.romance[id]+18,0,100);record(s,'Un rendez-vous au Café Fleur.')}if(action==='flirt')s.romance[id]=clamp(s.romance[id]+15,0,100);if(action==='couple'){s.family.partnerId=id;s.family.status='couple';s.family.sinceDay=s.day;record(s,'Une nouvelle histoire de couple commence.')}if(action==='moveIn'){s.family.movedIn=true;record(s,'Vous emménagez ensemble à la Maison Soleil.')}if(action==='propose'){s.family.status='engaged';record(s,'Fiançailles : préparez votre cérémonie au parc.')}if(action==='invite')s.visits[id]=stamp(s)+4;
 }else if(a.npc)s.relationships[a.npc]=clamp(s.relationships[a.npc]+12,0,100);
 if(a.wedding){s.family.status='married';record(s,'Mariage célébré au Parc Soleil.')}if(a.planBaby){s.family.pregnancy={dueDay:s.day+3,name:String(a.childName||'Soleil').slice(0,18)};record(s,'Un bébé est attendu dans trois jours de jeu.')}if(a.adopt){addChild(s,a.childName);record(s,'Un bébé rejoint la famille par adoption.')}if(a.child!==undefined){const c=s.family.children[a.child];if(a.care==='feed'){s.groceries--;c.hunger=clamp(c.hunger+55,0,100)}if(a.care==='cuddle')c.comfort=clamp(c.comfort+50,0,100);if(a.care==='play')c.fun=clamp(c.fun+50,0,100);if(a.care==='learn'){c.learning=(c.learning||0)+1;c.fun=clamp(c.fun+25,0,100);c.comfort=clamp(c.comfort+15,0,100)}if(a.care==='sleep')c.comfort=clamp(c.comfort+35,0,100)}
 if(a.plant){s.garden.plantedDay=s.day;s.skills.garden++;record(s,'Le potager est semé : récolte demain.')}if(a.harvest){s.garden.plantedDay=0;s.garden.harvestDay=s.day;s.groceries+=3;s.skills.garden++}
 if(a.bouquet){s.groceries--;s.inventory.bouquets++;s.skills.creative++}
 if(a.startDelivery)s.delivery={day:s.day};if(a.completeDelivery){s.delivery=null;s.deliveryDay=s.day;s.money+=40;record(s,'Livraison chez Noah terminée : 40 pièces.')}
 if(a.purchase)s.home[a.purchase]=true;
 if(a.picnic){for(const c of fChildren(s).filter(c=>stage(s,c)!=='baby')){c.hunger=clamp(c.hunger+35,0,100);c.comfort=clamp(c.comfort+25,0,100);c.fun=clamp(c.fun+35,0,100)}s.meals--;record(s,'Pique-nique en famille au Parc Soleil.')}
 return null}
 function fChildren(s){return s.family.children}
 function goals(s){return [{id:'meal',name:'Un repas fait maison',done:s.skill>=1,reward:15},{id:'explorer',name:'Livrer une commande dans le quartier',done:s.deliveryDay>0,reward:20},{id:'friend',name:'Créer une amitié (50)',done:Object.values(s.relationships).some(v=>v>=50),reward:20},{id:'artist',name:'Composer trois bouquets',done:s.skills.creative>=3,reward:25},{id:'family',name:'Accueillir un enfant',done:s.family.children.length>0,reward:30}]}
 function claim(s,id){const g=goals(s).find(g=>g.id===id);if(!g?.done||s.achievements.includes(id))return false;s.achievements.push(id);s.money+=g.reward;record(s,'Objectif accompli : '+g.name);return true}
 function mood(s){const min=Math.min(...needs.map(k=>s[k]));if(min<20)return {name:'Besoin de douceur',color:'#b7746d'};if(s.fun>=80&&s.social>=70)return {name:'Rayonnante',color:'#a67c39'};if(s.energy<40)return {name:'Fatiguée',color:'#8f85a6'};return {name:'Bien dans mon monde',color:'#5e866c'}}
 function decay(s,dt){for(const [k,rate]of Object.entries({hunger:.07,energy:.045,hygiene:.03,fun:.045,social:.035}))s[k]=clamp(s[k]-dt*rate,0,100);for(const c of s.family.children){c.hunger=clamp(c.hunger-dt*.065,0,100);c.comfort=clamp(c.comfort-dt*.04,0,100);c.fun=clamp(c.fun-dt*.045,0,100)}}
 function breakup(s){s.family.partnerId=null;s.family.status='single';s.family.movedIn=false;record(s,'Votre couple se sépare. Les enfants restent dans ton foyer.')}
 return {recipes,goals,claim,mood,needs,defaults,restore,valid,can,apply,advance,decay,stage,record,breakup,stamp,clamp};
})();
if(typeof module!=='undefined')module.exports=Life;
