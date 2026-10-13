/* Visible school routines and persistent attendance, not a time-skipping daycare. */
const School=((Life)=>{
 const age=(s,c)=>Number.isFinite(c.age)?c.age:Life.stage(s,c)==='baby'?0:Life.stage(s,c)==='toddler'?3:8;
 const weekday=s=>(s.day-1)%7<5;
 const open=s=>weekday(s)&&s.time>=7.5&&s.time<15;
 const eligible=(s,c)=>age(s,c)>=3&&age(s,c)<18;
 const seats=[[-45,31,0,.02],[-42.8,31,0,.02],[-40.9,31,0,.02],[-45,32.8,0,.02],[-42.8,32.8,0,.02],[-40.9,32.8,0,.02]];
 function target(s,c,index){if(!open(s)||!eligible(s,c))return null;const anchor=seats[index%seats.length];return {point:[anchor[0],anchor[1]-.55],anchor,pose:s.time>=12&&s.time<13?'eat':s.time<10.5?'sit':'read',label:age(s,c)<6?'Maternelle · activités':'École · '+(s.time>=12&&s.time<13?'déjeuner':'classe')};}
 function record(s,c,id,dt){s.school??={records:{},player:{lastDay:0,lessons:0}};s.school.records??={};const r=s.school.records[id]??={lastDay:0,days:0,lunchDay:0,progress:0};r.progress+=dt;if(r.progress>=8&&r.lastDay!==s.day){r.lastDay=s.day;r.days++;c.learning=(c.learning||0)+5;c.fun=Math.min(100,c.fun+8);}if(s.time>=12&&s.time<13&&r.lunchDay!==s.day){c.hunger=Math.min(100,c.hunger+40);r.lunchDay=s.day;}return r;}
 function restore(s,r){const old=r?.school;s.school={records:{},player:{lastDay:Math.max(0,Math.min(s.day,Number(old?.player?.lastDay)||0)),lessons:Math.max(0,Math.min(10000,Number(old?.player?.lessons)||0))}};for(const [id,a]of Object.entries(old?.records||{}))if(['child0','child1','mila','lou'].includes(id))s.school.records[id]={lastDay:Math.max(0,Math.min(s.day,Number(a.lastDay)||0)),days:Math.max(0,Math.min(10000,Number(a.days)||0)),lunchDay:Math.max(0,Math.min(s.day,Number(a.lunchDay)||0)),progress:0};}
function can(s,a){if(a.schoolLesson){if(s.age>=18)return 'Ce cours est destiné aux élèves.';if(!open(s)||s.time<8)return 'L’école accueille les élèves les jours de semaine, de 8 h à 15 h.';if(Math.hypot(s.x+42.8,s.z-32.3)>2)return 'Rends-toi dans la classe de l’école.';if(s.school.player.lastDay===s.day)return 'Ton cours du jour est déjà enregistré.';}return null;}
 function apply(s,a){if(a.schoolLesson){s.school.player.lastDay=s.day;s.school.player.lessons++;s.fun=Math.min(100,s.fun+15);s.social=Math.min(100,s.social+15);Life.record(s,'Un cours suivi à l’école Soleil.');}}
 const api={age,weekday,open,eligible,seats,target,record,restore,can,apply};Life.school=api;return api;
})(typeof module!=='undefined'?require('./core.js'):Life);
if(typeof module!=='undefined')module.exports=School;
