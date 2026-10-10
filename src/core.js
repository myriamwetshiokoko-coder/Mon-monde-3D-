/* Pure simulation rules, independent of rendering. Saved family IDs reserve future expansion. */
const Life = (() => {
 const needs=['hunger','energy','hygiene','fun','social'];
 const defaults={version:1,x:0,z:3,time:9,day:1,hunger:75,energy:82,hygiene:88,fun:72,social:65,name:'Mon personnage',skin:2,outfit:0,hair:0,face:0,money:120,groceries:3,meals:0,relationships:{lina:0,noah:0,emma:0},family:{partnerId:null,children:[]},workDay:0};
 function restore(raw){const s=JSON.parse(JSON.stringify(defaults));if(!raw||typeof raw!=='object')return s;
 for(const k of ['x','z','time','day',...needs,'skin','outfit','hair','face','money','groceries','meals','workDay'])if(Number.isFinite(raw[k]))s[k]=raw[k];
 for(const k of needs)s[k]=Math.max(0,Math.min(100,s[k]));for(const k of ['money','groceries','meals'])s[k]=Math.max(0,Math.min(1e6,Math.floor(s[k])));
 for(const k of ['skin','outfit'])s[k]=Math.max(0,Math.min(3,Math.floor(s[k])));for(const k of ['hair','face'])s[k]=Math.max(0,Math.min(2,Math.floor(s[k])));
 s.time=((s.time%24)+24)%24;s.day=Math.max(1,Math.floor(s.day));s.name=typeof raw.name==='string'?raw.name.slice(0,18):s.name;
 for(const id of ['lina','noah','emma'])s.relationships[id]=Math.max(0,Math.min(100,Number(raw.relationships?.[id])||0));return s;
 }
 function valid(x,z,barriers,door=1){if(!Number.isFinite(x)||!Number.isFinite(z)||x< -31.5||x>31.5||z< -4.48||z>45.5)return false;for(const b of barriers){const xx=Math.max(b[0],Math.min(x,b[1])),zz=Math.max(b[2],Math.min(z,b[3]));if(Math.hypot(x-xx,z-zz)<.28)return false}return !(door<.56&&Math.abs(x)<1.08&&Math.abs(z-5.05)<.24)}
 function can(s,a){if(a.cost&&s.money<a.cost)return 'Pas assez d’argent.';if(a.cook&&s.groceries<1)return 'Achète des provisions à l’épicerie.';if(a.eat&&s.meals<1)return 'Prépare d’abord un repas dans la cuisine.';if(a.work&&s.workDay===s.day)return 'Tu as déjà travaillé aujourd’hui.';return null}
 function apply(s,a){const error=can(s,a);if(error)return error;s.money-=a.cost||0;if(a.cook){s.groceries--;s.meals++}if(a.eat)s.meals--;if(a.shop)s.groceries+=3;if(a.work){s.money+=65;s.workDay=s.day;s.time+=3}if(a.sleep)s.time+=8;while(s.time>=24){s.time-=24;s.day++}for(const [k,v]of Object.entries(a.effect||{}))if(needs.includes(k))s[k]=Math.max(0,Math.min(100,s[k]+v));if(a.npc)s.relationships[a.npc]=Math.min(100,(s.relationships[a.npc]||0)+12);return null}
 return {needs,defaults,restore,valid,can,apply};
})();
if(typeof module!=='undefined')module.exports=Life;
