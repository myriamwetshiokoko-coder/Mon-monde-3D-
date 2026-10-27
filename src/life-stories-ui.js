/* V12.5 — narrative layer added to the existing 3D game, not a replacement. */
function openLifeStories(){
 const pending=LifeStories.available(state),history=state.stories.log;
 const memberNote=state.control?.active==='housemate'?'\n\nLes histoires de couple et de famille se vivent avec '+HomeControl.main(state).name+'. Reprends son contrôle depuis « Mon foyer jouable ».':'';
 const summary='Tes histoires évoluent avec tes rencontres, ta carrière, ton couple et tes enfants. Chaque histoire se joue une fois dans cette partie.\n\n'+
 'Histoires vécues : '+state.stories.completed.length+'/'+LifeStories.definitions.length+
 (history.length?'\n\nDernier souvenir (jour '+history.at(-1).day+') : '+history.at(-1).text:'\n\nTa première histoire t’attend.')+memberNote;
 showMenu('📖 Mes histoires de vie',summary,[
  ...pending.map(d=>({label:'✨ '+d.title,onClick:()=>openLifeStory(d.id)})),
  ...(history.length?[{label:'📔 Revoir mes souvenirs',onClick:()=>showMenu('Mes souvenirs',history.slice().reverse().map(x=>'Jour '+x.day+' — '+x.text).join('\n\n'),[{label:'Retour aux histoires',onClick:openLifeStories}])}]:[]),
  {label:'Retour à ma vie 3D',onClick:closeMenu}
 ]);
}
function showLifeStoryResult(option){
 save();
 const saved=$('saveStatus').textContent==='Sauvegardé ✓';
 showMenu(saved?'🌷 Un nouveau souvenir':'💾 Souvenir à sauvegarder',option.text+'\n\n'+(saved?
  'Ce choix est enregistré dans ta partie.':
  'Ton choix est appliqué pour cette session, mais son enregistrement a échoué. Réessaie ou exporte ta sauvegarde avant de fermer le jeu.'),[
  ...(!saved?[
   {label:'💾 Réessayer l’enregistrement',onClick:()=>showLifeStoryResult(option)},
   {label:'📤 Exporter ma sauvegarde',onClick:()=>$('export').onclick()}
  ]:[]),
  {label:'📖 Mes autres histoires',onClick:openLifeStories},
  {label:'Continuer ma vie',onClick:closeMenu}
 ]);
}
function openLifeStory(id){
 const d=LifeStories.available(state).find(x=>x.id===id);
 if(!d){openLifeStories();return;}
 showMenu('✨ '+d.title,d.lead,d.options.map((o,i)=>({label:o.label,onClick:()=>{
  if(!LifeStories.choose(state,id,i)){openLifeStories();return;}
  showLifeStoryResult(o);
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
$('familyBtn').onclick=()=>openFamily();

