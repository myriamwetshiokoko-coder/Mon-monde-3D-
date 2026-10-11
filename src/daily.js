/* Playable jobs, phone messages and purchases. Pure rules shared by UI and tests. */
const Daily = ((life) => {
 const jobs={
  cafe:{name:'Équipe du Café Fleur',role:'Service au café',pay:65,start:[-15.1,31.4],tasks:[
   {name:'Accueillir les clients',point:[-12,27.6],pose:'talk',seconds:6,dir:Math.PI},
   {name:'Préparer les commandes',point:[-14,31.4],pose:'cook',seconds:8,dir:0},
   {name:'Servir la table fleurie',point:[-9.5,30],pose:'serve',seconds:6,dir:Math.PI},
   {name:'Ranger la table',point:[-14.5,30],pose:'clean',seconds:6,dir:Math.PI}]},
  shop:{name:'Épicerie du Soleil',role:'Employé de l’épicerie',pay:60,start:[14,31.9],tasks:[
   {name:'Recevoir les provisions',point:[12,27.3],pose:'carry',seconds:6,dir:Math.PI},
   {name:'Remplir le rayon de gauche',point:[9.5,29],pose:'stock',seconds:7,dir:-Math.PI/2},
   {name:'Remplir le rayon de droite',point:[14.5,30],pose:'stock',seconds:7,dir:Math.PI/2},
   {name:'Accueillir en caisse',point:[12,31.9],pose:'talk',seconds:6,dir:0}]},
  gardener:{name:'Jardins du Parc Soleil',role:'Jardinier du quartier',pay:55,start:[9,36],tasks:[
   {name:'Préparer les outils',point:[9,36],pose:'carry',seconds:5,dir:Math.PI/2},
   {name:'Arroser les fleurs',point:[10,38],pose:'water',seconds:8,dir:Math.PI/2},
   {name:'Entretenir le massif',point:[-10,38],pose:'garden',seconds:8,dir:-Math.PI/2},
   {name:'Ramasser les feuilles',point:[3,40],pose:'sweep',seconds:7,dir:0}]}
 };
 const books={novel:{name:'Les jours lumineux',color:'#b784a1'},cookbook:{name:'Ma cuisine fleurie',color:'#c59760'},garden:{name:'Un jardin au Soleil',color:'#829b77'}};
 const items={cookbook:{name:'Livre de cuisine',price:25,book:'cookbook'},garden:{name:'Livre de jardinage',price:18,book:'garden'},takeaway:{name:'Repas à emporter',price:16,meals:1},provisions:{name:'Panier de 3 provisions',price:18,groceries:3}};
 const channels=['Cuisine au Soleil','Voyages et jardins','Soirée musique'];
 const rank=s=>Math.min(4,Math.floor(s.career.completed/3));
 const wage=s=>jobs[s.career.job]?jobs[s.career.job].pay+rank(s)*10:0;
 const currentTask=s=>{const shift=s.career.shift;if(!shift)return null;const job=jobs[shift.job];return shift.step<job.tasks.length?job.tasks[shift.step]:{name:'Terminer le service et recevoir le salaire',point:job.start,pose:'talk',seconds:3,clockOut:true}};
 function message(s,from,text,to='me'){s.phone.messages.push({from,to,text,day:s.day,time:s.time});if(s.phone.messages.length>30)s.phone.messages.shift();if(from!=='me')s.phone.unread=Math.min(30,s.phone.unread+1)}
 function can(s,a){
  if(!life.isAdult(s)&&(a.work||a.startDelivery))return 'Les emplois sont disponibles à partir de 18 ans.';
  if(a.jobApply){if(!Object.hasOwn(jobs,a.jobApply))return 'Cet emploi est indisponible.';if(!life.isAdult(s))return 'Les emplois sont disponibles à partir de 18 ans.';if(s.career.shift)return 'Termine ton service avant de changer de métier.'}
  if(a.shiftStart){const j=jobs[s.career.job];if(!life.isAdult(s))return 'Les emplois sont disponibles à partir de 18 ans.';if(!j)return 'Choisis un emploi dans ton téléphone.';if(s.career.shift)return 'Un service est déjà en cours.';if(s.workDay===s.day)return 'Ton salaire du jour a déjà été versé.';if(s.time<8||s.time>=20)return 'Les prises de service ont lieu de 8 h à 20 h.';if(Math.hypot(s.x-j.start[0],s.z-j.start[1])>1.8)return 'Rends-toi au comptoir de ton lieu de travail.'}
  if(a.shiftTask!==undefined){const shift=s.career.shift,t=currentTask(s);if(!shift||a.shiftTask!==shift.step)return 'Cette étape de service est terminée ou indisponible.';if(!life.isAdult(s))return 'Ce service est réservé aux adultes.';if(Math.hypot(s.x-t.point[0],s.z-t.point[1])>1.65)return 'Approche-toi du poste indiqué pour cette tâche.';if(t.clockOut&&s.workDay===s.day)return 'Ton salaire du jour a déjà été versé.'}
  if(a.item){const item=items[a.item];if(!Object.hasOwn(items,a.item)||a.cost!==item.price)return 'Cet achat est indisponible.';if(item.book&&s.inventory.books[item.book])return 'Ce livre est déjà dans ta bibliothèque.';if(Math.hypot(s.x-(a.item==='takeaway'?-12:12),s.z-31.4)>4)return 'Achète cet article au comptoir de son commerce.'}
  if(a.readBook&&(!Object.hasOwn(books,a.readBook)||!s.inventory.books[a.readBook]))return 'Ce livre se trouve à l’épicerie.';
  if(a.phoneMessage){if(!life.ids.includes(a.phoneMessage)&&!(s.control&&a.phoneMessage===(s.control.active==='housemate'?'player':'housemate')))return 'Contact introuvable.';if(!['hello','meet'].includes(a.messageKind))return 'Message indisponible.';if(life.stamp(s)-(s.phone.lastMessage[a.phoneMessage]??-100)<1)return 'Laisse une heure de jeu avant le prochain message à ce contact.';if(a.messageKind==='meet'&&s.relationships[a.phoneMessage]<20)return 'Faites connaissance avant de proposer une rencontre.'}
  return null;
 }
 function apply(s,a){
  if(a.jobApply){s.career.job=a.jobApply;message(s,a.jobApply,'Bienvenue dans l’équipe ! Présente-toi au comptoir entre 8 h et 20 h pour ton premier service.');life.record(s,'Nouvel emploi : '+jobs[a.jobApply].role+'.')}
  if(a.shiftStart)s.career.shift={job:s.career.job,day:s.day,step:0};
  if(a.shiftTask!==undefined){const t=currentTask(s);if(t.clockOut){const pay=wage(s);life.transfer(s,pay,'Salaire · '+jobs[s.career.job].role);s.workDay=s.day;s.career.completed++;s.career.shift=null;life.advance(s,2,true);message(s,s.career.job,'Service terminé : '+pay+' sols versés sur ton compte.');life.record(s,'Un service complet au travail : '+pay+' sols.')}else{s.career.shift.step++;s.energy=life.clamp(s.energy-4,0,100);s.social=life.clamp(s.social+3,0,100)}}
  if(a.item){const item=items[a.item];if(item.book)s.inventory.books[item.book]=true;if(item.meals)s.meals+=item.meals;if(item.groceries)s.groceries+=item.groceries}
  if(a.readBook)s.daily.reading++;
  if(a.watchTV)s.daily.tv++;
  if(a.eat)s.daily.meals++;
  if(a.phoneMessage){const id=a.phoneMessage,meet=a.messageKind==='meet';message(s,'me',meet?'On se retrouve au parc ?':'Coucou, comment se passe ta journée ?',id);message(s,id,meet?'Avec plaisir ! Je marche vers le parc. À tout de suite.':({lina:'Coucou ! Une jolie journée au café. Passe me voir quand tu veux.',noah:'Salut ! Je profite du quartier. Ça fait plaisir d’avoir de tes nouvelles.',emma:'Coucou ! J’ai trouvé un bon livre. On en parle bientôt ?'}[id]||'Coucou ! Je profite du quartier entre mes activités. Ça me fait plaisir !'));s.phone.lastMessage[id]=life.stamp(s);s.relationships[id]=life.clamp(s.relationships[id]+3,0,100);s.social=life.clamp(s.social+8,0,100);if(meet)s.appointments[id]={until:life.stamp(s)+4,point:[(life.ids.indexOf(id)%3-1)*1.2,36]}}
 }
 const api={jobs,books,items,channels,rank,wage,currentTask,message,can,apply};life.daily=api;return api;
})(typeof module!=='undefined'?require('./core.js'):Life);
if(typeof module!=='undefined')module.exports=Daily;
