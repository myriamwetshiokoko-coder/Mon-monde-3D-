/* Virtual driving licence and visible assisted road journeys; no free steering. */
const Transport=((life,town)=>{
 const vehicles={city:{name:'Citadine Aurore',price:320,color:'#a8c0ba'},family:{name:'Familiale Horizon',price:520,color:'#b393a6'}};
 const questions=[['Un piéton traverse devant toi.',['Je m’arrête et le laisse passer','Je klaxonne et continue']],['Au feu rouge…',['Je m’arrête','Je passe si la route semble libre']],['Avant de tourner…',['Je vérifie et signale mon intention','Je tourne immédiatement']],['En ville, près de l’école…',['Je ralentis et reste attentif','J’accélère']],['Au volant, le téléphone…',['Attend que je sois stationné','Peut être consulté en roulant']]];
 const parking=s=>[town.home(s).x-2,17.2];
 function restore(s,raw){const r=raw?.transport||{},p=parking(s);s.transport={enrolled:r.enrolled===true,theory:r.theory===true,question:life.clamp(Math.floor(Number(r.question)||0),0,4),licence:r.licence===true,vehicle:Object.hasOwn(vehicles,r.vehicle)?r.vehicle:null,x:Number.isFinite(r.x)?life.clamp(r.x,-48,48):p[0],z:Number.isFinite(r.z)?life.clamp(r.z,17.2,25.2):p[1],yaw:Number.isFinite(r.yaw)?r.yaw:Math.PI/2,trip:null};}
 function destinations(s){return {home:{name:town.home(s).name,point:parking(s)},cafe:{name:'Café Fleur',point:[-19,25.2]},park:{name:'Parc Soleil',point:[0,25.2]},school:{name:'École Soleil',point:[-42,25.2]},atelier:{name:'Atelier Horizon',point:[42,25.2]}};}
 function can(s,a){const t=s.transport;if(!t)return null;const any=a.drivingEnroll||a.drivingAnswer!==undefined||a.drivingPractice||a.buyVehicle||a.sellVehicle||a.travel||a.carContinue||a.carCancel;if(t.trip&&!a.carContinue&&!a.carCancel)return 'Stationne avant de commencer une autre activité.';if(!any)return null;
 if(s.age<18)return 'Le permis et les contrats automobiles nécessitent 18 ans.';
 if(a.drivingEnroll&&(t.enrolled||t.licence||a.cost!==25))return 'Inscription indisponible.';
 if(a.drivingAnswer!==undefined&&(!t.enrolled||t.theory||![0,1].includes(a.drivingAnswer)))return 'Question indisponible.';
 if(a.buyVehicle&&(!vehicles[a.buyVehicle]||t.vehicle||a.cost!==vehicles[a.buyVehicle].price))return 'Achat automobile invalide.';
 if(a.sellVehicle&&(!t.vehicle||t.trip))return 'Stationne ton véhicule avant de le vendre.';
 if(a.drivingPractice||a.travel){if(t.trip||s.career.shift)return 'Termine ton trajet ou ton service.';if(a.drivingPractice&&(!t.theory||t.licence))return 'Valide le code avant le parcours accompagné.';if(a.travel&&(!t.licence||!t.vehicle||!destinations(s)[a.travel]))return 'Un permis, une voiture et une destination sont nécessaires.';const p=a.drivingPractice?[-42,25.2]:[t.x,t.z];if(Math.hypot(s.x-p[0],s.z-p[1])>3)return 'Rejoins le véhicule indiqué sur la carte avant de monter.';}
 if(a.carContinue&&!t.trip?.waiting)return 'Le véhicule ne se trouve pas à un arrêt.';if(a.carCancel&&!t.trip)return 'Aucun trajet en cours.';return null;
 }
 function route(from,to){const dir=to[0]>=from[0]?1:-1,lane=dir===1?19.65:23.05;return [[from[0],lane],[to[0],lane],[to[0],to[1]]];}
 function apply(s,a){const t=s.transport;if(a.drivingEnroll){t.enrolled=true;t.question=0;}if(a.drivingAnswer!==undefined){if(a.drivingAnswer===0){if(t.question===4){t.theory=true;life.record(s,'Code validé : parcours accompagné disponible à l’école.');}else t.question++;}else life.record(s,'Code : révise cette situation avant de continuer.');}
 if(a.buyVehicle){t.vehicle=a.buyVehicle;[t.x,t.z]=parking(s);life.record(s,'Voiture achetée : '+vehicles[t.vehicle].name+'.');}if(a.sellVehicle){life.transfer(s,Math.floor(vehicles[t.vehicle].price*.7),'Vente automobile');t.vehicle=null;}
 if(a.drivingPractice){t.x=-42;t.z=25.2;t.trip={practice:true,name:'Parcours accompagné',points:[[-42,23.05],[-46,23.05],[-46,19.65],[-37,19.65],[-37,23.05],[-42,23.05],[-42,25.2]],step:0,waiting:true,stops:0};}
 if(a.travel){const d=destinations(s)[a.travel];t.trip={practice:false,name:d.name,points:route([t.x,t.z],d.point),step:0,waiting:true,stops:0};}
 if(a.carContinue){t.trip.waiting=false;t.trip.stops++;}if(a.carCancel){t.trip=null;s.x=t.x+1.15*Math.cos(t.yaw);s.z=t.z-1.15*Math.sin(t.yaw);life.record(s,'Trajet interrompu ; voiture stationnée.');}
 }
 function step(s,dt,people=[],cars=[]){const t=s.transport,q=t?.trip;if(!q)return;dt=Math.min(.05,Math.max(0,dt));s.x=t.x;s.z=t.z;if(q.waiting)return;const p=q.points[q.step],dx=p[0]-t.x,dz=p[1]-t.z,d=Math.hypot(dx,dz);if(d<.04){q.step++;if(q.step===q.points.length){if(q.practice){t.licence=true;life.record(s,'Permis obtenu après le parcours accompagné.');}else life.record(s,'Arrivée : '+q.name+'.');t.trip=null;s.x=t.x+1.15*Math.cos(t.yaw);s.z=t.z-1.15*Math.sin(t.yaw);return;}q.waiting=true;return;}const ux=dx/d,uz=dz/d;t.yaw=Math.atan2(dx,dz);const blocked=[...people,...cars].some(n=>{const x=n.x-t.x,z=n.z-t.z,ahead=x*ux+z*uz,side=Math.abs(x*uz-z*ux);return ahead>0&&ahead<3.2&&side<1.15;});if(!blocked){const distance=Math.min(d,dt*3);t.x+=ux*distance;t.z+=uz*distance;s.x=t.x;s.z=t.z;}}
 const api={vehicles,questions,parking,restore,destinations,can,apply,step,active:s=>!!s.transport?.trip};life.transport=api;return api;
})(typeof module!=='undefined'?require('./core.js'):Life,typeof module!=='undefined'?require('./town.js'):Town);
if(typeof module!=='undefined')module.exports=Transport;
