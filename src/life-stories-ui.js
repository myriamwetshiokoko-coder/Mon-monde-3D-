/* V12.5 — narrative layer added to the existing 3D game, not a replacement. */
function openLifeStories(){
 const pending=LifeStories.available(state),history=state.stories.log;
 const summary='Tes histoires évoluent avec tes rencontres, ta carrière, ton couple et tes enfants. Chaque choix se sauvegarde dans ta partie.\\n\\n'+
 'Histoires vécues : '+state.stories.completed.length+'/'+LifeStories.definitions.length+
 (history.length?'\\n\\nDernier souvenir (jour '+history.at(-1).day+') : '+history.at(-1).text:'\\n\\nTa première histoire t’attend.');
 showMenu('📖 Mes histoires de vie',summary,[
  ...pending.map(d=>({label:'✨ '+d.title,onClick:()=>openLifeStory(d.id)})),
  ...(history.length?[{label:'📔 Revoir mes souvenirs',onClick:()=>showMenu('Mes souvenirs',history.slice().reverse().map(x=>'Jour '+x.day+' — '+x.text).join('\\n\\n'),[{label:'Retour aux histoires',onClick:openLifeStories}])}]:[]),
  {label:'Retour à ma vie 3D',onClick:closeMenu}
 ]);
}
function openLifeStory(id){
 const d=LifeStories.definitions.find(x=>x.id===id);
 if(!d||!LifeStories.available(state).some(x=>x.id===id)){openLifeStories();return;}
 showMenu('✨ '+d.title,d.lead,d.options.map((o,i)=>({label:o.label,onClick:()=>{
  if(!LifeStories.choose(state,id,i)){openLifeStories();return;}
  save();
  showMenu('🌷 Un nouveau souvenir',o.text+'\\n\\nCe choix fait désormais partie de ton histoire.',[
   {label:'📖 Mes autres histoires',onClick:openLifeStories},
   {label:'Continuer ma vie',onClick:closeMenu}
  ]);
 }})));
}
const storyPhoneRender=renderPhone;
renderPhone=function(){
 storyPhoneRender();
 if(phoneApp==='home'||phoneApp==='household'){
  $('phoneBody').append(phoneButton('📖 Mes histoires de vie · '+LifeStories.available(state).length+' à découvrir',()=>{closePhone();openLifeStories();}));
 }
};
const storyFamilyMenu=openFamily;
openFamily=function(){
 storyFamilyMenu();
 const b=document.createElement('button');b.className='choice';b.textContent='📖 Nos histoires de vie';b.onclick=openLifeStories;menuChoices.append(b);
};
