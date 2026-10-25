/* V12.5 — small, save-compatible, opt-in household stories. */
const LifeStories=(()=>{
 const definitions=[
  {id:'first-steps',title:'Une journée qui commence',group:'quotidien',available:s=>s.day>=1,
   lead:'Une nouvelle page de ton histoire commence. Comment veux-tu profiter de la journée ?',
   options:[{label:'🌷 Explorer le quartier',text:'Tu choisis de sortir et de découvrir ta ville.',effect:{fun:12,social:4}},
    {label:'🏡 Prendre soin de la maison',text:'Tu profites d’un moment paisible chez toi.',effect:{energy:8,fun:6}}]},
  {id:'couple-evening',title:'Un soir rien qu’à deux',group:'couple',available:s=>!!s.family.partnerId&&s.family.movedIn,
   lead:'Après une journée bien remplie, votre couple a besoin d’un moment à deux.',
   options:[{label:'💞 Une vraie discussion',text:'Vous prenez le temps de parler de vos projets.',effect:{social:15,fun:5},affection:8},
    {label:'🍿 Soirée cinéma à la maison',text:'Un moment léger et complice qui fait du bien.',effect:{fun:16,energy:3},affection:5}]},
  {id:'engagement',title:'Nos projets de couple',group:'couple',available:s=>s.family.status==='engaged'||s.family.status==='married',
   lead:'Votre engagement ouvre de nouvelles conversations sur votre avenir.',
   options:[{label:'💍 Parler de nos rêves',text:'Vous imaginez ensemble votre avenir.',effect:{social:12},affection:7},
    {label:'🌻 Préparer une belle sortie',text:'Vous préparez votre prochaine escapade.',effect:{fun:14},affection:4}]},
  {id:'baby-on-way',title:'Un bébé se prépare',group:'famille',available:s=>!!s.family.pregnancy,
   lead:'Votre foyer s’apprête à accueillir un nouveau membre. C’est le moment de préparer son arrivée.',
   options:[{label:'🍼 Préparer son petit coin',text:'Le foyer s’organise pour recevoir le bébé.',effect:{fun:8,social:7}},
    {label:'🤍 Partager nos émotions',text:'Vous parlez de ce grand changement dans votre vie.',effect:{social:13,energy:4},affection:5}]},
  {id:'family-morning',title:'Un matin en famille',group:'famille',available:s=>s.family.children.length>0,
   lead:'La maison est animée ! Les enfants ont envie de partager un moment avec toi.',
   options:[{label:'🧸 Jouer tous ensemble',text:'Les enfants adorent ce moment en famille.',effect:{fun:16,social:10},children:8},
    {label:'📚 Raconter une histoire',text:'Une histoire douce rassemble tout le monde.',effect:{social:14,energy:5},children:10}]},
  {id:'career-balance',title:'Une vie bien remplie',group:'travail',available:s=>!!s.career.job,
   lead:'Le travail prend une place importante dans ta vie. Comment retrouver ton équilibre ?',
   options:[{label:'☕ Prendre une pause méritée',text:'Tu prends soin de toi entre deux services.',effect:{energy:16,fun:5}},
    {label:'🎯 Préparer mes objectifs',text:'Tu fais le point sur tes ambitions professionnelles.',effect:{fun:8,social:3}}]}
 ];
 const normalize=(raw)=>({completed:Array.isArray(raw?.completed)?[...new Set(raw.completed.filter(x=>definitions.some(d=>d.id===x)))].slice(0,definitions.length):[],lastDay:Number.isFinite(raw?.lastDay)?Math.max(0,Math.floor(raw.lastDay)):0,log:Array.isArray(raw?.log)?raw.log.filter(x=>x&&typeof x.text==='string').slice(-12).map(x=>({day:Number(x.day)||1,text:x.text.slice(0,180)})):[]});
 const available=s=>definitions.filter(d=>d.available(s)&&!s.stories.completed.includes(d.id));
 function choose(s,id,index){const d=definitions.find(x=>x.id===id);if(!d||!d.available(s)||s.stories.completed.includes(id)||!Number.isInteger(index)||!d.options[index])return false;const o=d.options[index];s.stories.completed.push(id);s.stories.lastDay=s.day;s.stories.log.push({day:s.day,text:d.title+' — '+o.text});s.stories.log=s.stories.log.slice(-12);for(const [k,v]of Object.entries(o.effect||{}))s[k]=Life.clamp(s[k]+v,0,100);if(o.affection&&s.family.partnerId)s.romance[s.family.partnerId]=Life.clamp((s.romance[s.family.partnerId]||0)+o.affection,0,100);if(o.children)for(const child of s.family.children)child.fun=Life.clamp(child.fun+o.children,0,100);Life.record(s,o.text);return true;}
 return {definitions,normalize,available,choose};
})();
const storyRestore=Life.restore;
Life.restore=function(raw){const s=storyRestore(raw);s.stories=LifeStories.normalize(raw?.stories);return s;};
