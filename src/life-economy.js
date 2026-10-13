/* Housing contracts, paid wardrobe and explicit creative controls. All amounts are game sols. */
const LifeEconomy=((life,town,HomeControl)=>{
 const modes=['owner','rent','shared'],prices=town.styles.map((v,i)=>i===0||i===15?0:20+i*2);
 function restore(s,raw){const r=raw?.economy||{},contract=raw?.home?.contract||{};
  s.economy={creative:r.creative===true,wardrobe:[...new Set([0,15,s.style,raw?.control?.inactive?.style??0,...(Array.isArray(r.wardrobe)?r.wardrobe.filter(i=>Number.isInteger(i)&&i>=0&&i<town.styles.length):[s.style,raw?.control?.inactive?.style??0])])],pregnancyDays:[3,7,14].includes(r.pregnancyDays)?r.pregnancyDays:7};
  if(!s.economy.wardrobe.includes(s.style))s.style=0;
  life.school?.restore(s,raw);
  s.home.contract={mode:modes.includes(contract.mode)?contract.mode:'owner',deposit:life.clamp(Math.floor(Number(contract.deposit)||0),0,1000),lastDay:life.clamp(Math.floor(Number(contract.lastDay)||s.day),1,s.day),arrears:life.clamp(Math.floor(Number(contract.arrears)||0),0,1e6)};
  if(s.home.contract.mode!=='owner')s.home.owned=s.home.owned.filter(k=>k!==s.home.residence);
  for(let i=0;i<s.family.children.length;i++){const old=raw?.family?.children?.[i];if(Number.isInteger(old?.age)&&old.age>=0&&old.age<=17)s.family.children[i].age=old.age;}
 }
 const rent=(s,id=s.home.residence,mode=s.home.contract?.mode)=>mode==='owner'?0:Math.ceil(town.houses[id].rent/(mode==='shared'?2:1));
 const fee=(s,id,mode)=>mode==='owner'?(s.home.owned.includes(id)?0:town.houses[id].price):Math.ceil(town.houses[id].deposit/(mode==='shared'?2:1))+rent(s,id,mode);
 function can(s,a){
  if(a.creative!==undefined&&typeof a.creative!=='boolean')return 'Choix de mode invalide.';
  if(a.grant!==undefined&&(!s.economy.creative||![500,5000].includes(a.grant)))return 'Active le mode créatif pour ajouter des sols.';
  if(a.setAge!==undefined){if(!Number.isInteger(a.setAge)||a.setAge<6||a.setAge>90)return 'Choisis un âge de 6 à 90 ans.';if(s.career.shift)return 'Termine ton service avant de changer d’âge.';if(a.setAge<18&&(s.control||s.family.partnerId||s.family.children.length||s.family.pregnancy))return 'Ce foyer a une histoire adulte : minimum 18 ans.';}
  if(a.childAge){const c=s.family.children[a.childAge.index];if(!c||!Number.isInteger(a.childAge.age)||a.childAge.age<0||a.childAge.age>17)return 'Choisis un enfant du foyer et un âge de 0 à 17 ans.';}
  if(a.pregnancyDays!==undefined&&![3,7,14].includes(a.pregnancyDays))return 'Rythme indisponible.';
  if(a.buyStyle!==undefined){if(!Number.isInteger(a.buyStyle)||a.buyStyle<0||a.buyStyle>=prices.length||a.cost!==prices[a.buyStyle])return 'Cette tenue est indisponible.';if(s.economy.wardrobe.includes(a.buyStyle))return 'Cette tenue est déjà dans le dressing.';}
  if(a.estateMove){const h=town.houses[a.estateMove];if(!h||!modes.includes(a.tenure)||a.cost!==fee(s,a.estateMove,a.tenure))return 'Contrat ou prix du logement invalide.';if(!life.isAdult(s))return 'Un bail ou un achat nécessite un adulte.';if(s.home.residence===a.estateMove&&s.home.contract.mode===a.tenure)return 'Ce contrat est déjà actif.';if(s.home.contract.arrears)return 'Règle les loyers en attente avant de déménager.';if(s.career.shift||Object.entries(s.citizens).some(([id,c])=>life.household.partner(s,id)&&c.shift))return 'Terminez vos services avant de déménager.';if(a.tenure!=='owner'&&s.home.owned.includes(a.estateMove))return 'Ce logement t’appartient déjà : emménage comme propriétaire.';}
  if(a.sellHome){if(!town.houses[a.sellHome]||!s.home.owned.includes(a.sellHome)||town.houses[a.sellHome].price===0)return 'Ce logement ne peut pas être revendu.';if(a.sellHome===s.home.residence)return 'Installe-toi dans un autre logement avant de vendre celui-ci.';}
  if(a.payArrears&&(!s.home.contract.arrears||a.cost!==Math.min(s.money,s.home.contract.arrears)||a.cost<=0))return 'Aucun règlement disponible.';
  return null;
 }
 function apply(s,a){
  if(a.creative!==undefined)s.economy.creative=a.creative;
  if(a.grant!==undefined){life.transfer(s,a.grant,'Mode créatif');life.record(s,'Mode créatif : +'+a.grant+' sols.');}
  if(a.setAge!==undefined){s.age=a.setAge;if(!life.isAdult(s))for(const id of Object.keys(s.romance))s.romance[id]=0;life.record(s,'Âge choisi : '+s.age+' ans.');}
  if(a.childAge){const c=s.family.children[a.childAge.index];c.age=a.childAge.age;life.record(s,c.name+' : âge choisi '+c.age+' an'+(c.age===1?'':'s')+'.');}
  if(a.pregnancyDays!==undefined)s.economy.pregnancyDays=a.pregnancyDays;
  if((a.deliver||a.adopt)&&s.family.children.length)s.family.children.at(-1).age=0;
  if(a.planBaby&&s.family.pregnancy&&a.confirmProject)s.family.pregnancy.dueDay=s.family.pregnancy.startedDay+s.economy.pregnancyDays;
  if(a.buyStyle!==undefined){s.economy.wardrobe.push(a.buyStyle);s.style=a.buyStyle;life.record(s,'Tenue achetée : '+town.styles[a.buyStyle].name+'.');}
  if(a.estateMove){const old=s.home.contract,owned=[...s.home.owned],id=a.estateMove;life.transfer(s,old.deposit,'Retour de caution');life.household.apply(s,{moveHouse:id});if(a.tenure!=='owner')s.home.owned=owned;const deposit=a.tenure==='owner'?0:Math.ceil(town.houses[id].deposit/(a.tenure==='shared'?2:1));s.home.contract={mode:a.tenure,deposit,lastDay:s.day,arrears:0};if(a.tenure==='shared'&&!s.control){const error=HomeControl.create(s,'male',life);if(!error){s.control.inactive.name='Alex';s.control.inactive.career.job='shop';s.citizens.housemate.job='shop';}}life.record(s,(a.tenure==='owner'?'Achat':a.tenure==='shared'?'Colocation':'Location')+' : '+town.houses[id].name+'.');}
  if(a.moveHouse&&!a.estateMove)s.home.contract={mode:'owner',deposit:0,lastDay:s.day,arrears:0};
  if(a.sellHome){s.home.owned=s.home.owned.filter(id=>id!==a.sellHome);life.transfer(s,Math.floor(town.houses[a.sellHome].price*.8),'Vente · '+town.houses[a.sellHome].name);}
  if(a.payArrears)s.home.contract.arrears-=a.cost;
 }
 function advance(s,oldDay){const c=s.home.contract;if(!c||c.mode==='owner'||s.day<=c.lastDay)return;const days=s.day-c.lastDay,total=days*rent(s);c.lastDay=s.day;const payment=Math.min(s.money,total);life.transfer(s,-payment,'Loyer · '+days+' jour'+(days>1?'s':''));c.arrears=life.clamp(c.arrears+total-payment,0,1e6);if(c.arrears)life.daily?.message(s,'quartier','Loyer en attente : '+c.arrears+' sols. Ton logement reste accessible ; consulte Logement.');}
 const api={restore,rent,fee,prices,can,apply,advance};life.economy=api;return api;
})(typeof module!=='undefined'?require('./core.js'):Life,typeof module!=='undefined'?require('./town.js'):Town,typeof module!=='undefined'?require('./home-control.js'):HomeControl);
if(typeof module!=='undefined')module.exports=LifeEconomy;
