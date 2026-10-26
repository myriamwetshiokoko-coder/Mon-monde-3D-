const assert=require('node:assert/strict');
const {run,els,storage,ctx,createRuntime}=require('./runtime.cjs');
let count=0;
function test(name,fn){fn();count++;console.log('PASS',name);}
const json=expression=>JSON.parse(run('JSON.stringify('+expression+')'));
const fixture={name:'Personnage principal',day:5,time:11,hunger:50,energy:50,hygiene:50,fun:50,social:50,romance:{noah:40},career:{job:'cafe'},family:{partnerId:'noah',status:'married',movedIn:true,pregnancy:{dueDay:12,startedDay:4,carrierId:'player',name:'Soleil'},children:[{bornDay:1,name:'Aube',fun:40},{bornDay:2,name:'Lune',fun:50}]}};
function reset(raw=fixture){run('restoreGame('+JSON.stringify(raw)+');activity=null;started=true;$("welcome").style.display="none";closePhone();closeMenu();');}
function clickChoice(index){assert.ok(els.menuChoices.children[index]);els.menuChoices.children[index].onclick();}
const cases=[
 ['first-steps',0,{fun:12,social:4}],['first-steps',1,{energy:8,fun:6}],
 ['couple-evening',0,{social:15,fun:5,affection:8}],['couple-evening',1,{fun:16,energy:3,affection:5}],
 ['engagement',0,{social:12,affection:7}],['engagement',1,{fun:14,affection:4}],
 ['baby-on-way',0,{fun:8,social:7}],['baby-on-way',1,{social:13,energy:4,affection:5}],
 ['family-morning',0,{fun:16,social:10,children:8}],['family-morning',1,{social:14,energy:5,children:10}],
 ['career-balance',0,{energy:16,fun:5}],['career-balance',1,{fun:8,social:3}]
];
test('Older saves gain an empty story history and only the everyday story',()=>{
 reset(null);
 assert.deepEqual(json('state.stories'),{completed:[],lastDay:0,log:[]});
 assert.deepEqual(json('LifeStories.available(state).map(d=>d.id)'),['first-steps']);
});
const gates=[
 ['couple-evening','state.family.movedIn=false'],
 ['couple-evening','state.family.partnerId=null'],
 ['engagement','state.family.status="couple"'],
 ['baby-on-way','state.family.pregnancy=null;state.family.project={readyDay:6,partnerId:"noah"}'],
 ['family-morning','state.family.children=[]'],
 ['career-balance','state.career.job=null']
];
for(const [id,change]of gates)test('Unavailable context cannot consume '+id+' ('+change+')',()=>{
 reset();run(change);const before=run('JSON.stringify(state)');
 assert.equal(run('LifeStories.available(state).some(d=>d.id==='+JSON.stringify(id)+')'),false);
 assert.equal(run('LifeStories.choose(state,'+JSON.stringify(id)+',0)'),false);
 assert.equal(run('JSON.stringify(state)'),before);
});
for(const [id,index,expected]of cases)test('Playable choice persists exact effects and rejects replay: '+id+' / '+index,()=>{
 reset();const before=json('state');
 run('openLifeStory('+JSON.stringify(id)+')');assert.equal(els.menuChoices.children.length,2);clickChoice(index);
 const after=json('state');
 for(const key of ['hunger','energy','hygiene','fun','social'])assert.equal(after[key],before[key]+(expected[key]||0));
 assert.equal(after.romance.noah,40+(expected.affection||0));
 assert.deepEqual(after.family.children.map(c=>c.fun),[40+(expected.children||0),50+(expected.children||0)]);
 assert.deepEqual(after.stories.completed,[id]);assert.equal(after.stories.lastDay,5);assert.equal(after.stories.log.length,1);
 assert.equal(after.journal.length,before.journal.length+1);
 for(const key of ['x','z','day','time','home','money','career'])assert.deepEqual(after[key],before[key]);
 assert.equal(run('activity'),null);assert.equal(run('paused'),true);
 assert.equal(els.menuTitle.textContent,'🌷 Un nouveau souvenir');assert.match(els.menuText.textContent,/enregistré/);
 const saved=JSON.parse(storage.get('monmonde3d_v2'));
 const slots=JSON.parse(storage.get('monmonde3d_stories'));
 assert.deepEqual(saved.stories,after.stories);
 assert.deepEqual(slots.slots.find(s=>s.id===slots.active).state.stories,after.stories);
 run('restoreGame(JSON.parse(localStorage.getItem("monmonde3d_v2")))');
 for(const key of ['energy','fun','social','romance','stories'])assert.deepEqual(json('state.'+key),after[key]);
 assert.deepEqual(json('state.family.children.map(c=>c.fun)'),after.family.children.map(c=>c.fun));
 const restored=run('JSON.stringify(state)');
 assert.equal(run('LifeStories.choose(state,'+JSON.stringify(id)+','+(1-index)+')'),false);
 assert.equal(run('JSON.stringify(state)'),restored);
});
test('Closing without a choice and invalid choices preserve the whole state',()=>{
 reset();const before=run('JSON.stringify(state)');
 run('openLifeStory("first-steps");closeMenu()');
 for(const index of [-1,2,0.5,'"0"',null])assert.equal(run('LifeStories.choose(state,"first-steps",'+index+')'),false);
 assert.equal(run('LifeStories.choose(state,"unknown",0)'),false);
 assert.equal(run('JSON.stringify(state)'),before);
});
test('All six stories can complete on one day and never renew overnight',()=>{
 reset();
 for(const id of [...new Set(cases.map(c=>c[0]))])assert.equal(run('LifeStories.choose(state,'+JSON.stringify(id)+',0)'),true);
 assert.equal(json('state.stories.completed.length'),6);assert.equal(json('state.stories.log.length'),6);
 assert.equal(json('LifeStories.available(state).length'),0);
 run('Life.advance(state,24)');assert.equal(json('LifeStories.available(state).length'),0);
});
test('Player, partner and every child receive capped effects',()=>{
 reset();run('state.fun=99;state.social=99;state.romance.noah=99;for(const child of state.family.children)child.fun=99');
 assert.equal(run('LifeStories.choose(state,"couple-evening",0)'),true);
 assert.equal(run('LifeStories.choose(state,"family-morning",0)'),true);
 for(const expression of ['state.fun','state.social','state.romance.noah'])assert.equal(json(expression),100);
 assert.deepEqual(json('state.family.children.map(c=>c.fun)'),[100,100]);
});
test('A separated pregnant parent can play without creating affection for a missing partner',()=>{
 reset();run('Life.breakup(state)');const romance=json('state.romance');
 assert.equal(run('LifeStories.choose(state,"baby-on-way",1)'),true);assert.deepEqual(json('state.romance'),romance);
});
test('Phone home and household both open stories and keep the game paused',()=>{
 for(const app of ['home','household']){
  reset();run('openPhone('+JSON.stringify(app)+')');
  const button=els.phoneBody.children.find(b=>b.textContent?.includes('Mes histoires de vie'));
  assert.ok(button);button.onclick();assert.equal(els.phone.hidden,true);
  assert.equal(els.menuTitle.textContent,'📖 Mes histoires de vie');assert.equal(run('paused'),true);
  const clock=json('[state.day,state.time]');run('tick(1000);tick(1100)');
  assert.deepEqual(json('[state.day,state.time]'),clock);
 }
});
test('Direct Foyer and compact menu Foyer use the latest story-aware handler',()=>{
 reset();els.familyBtn.onclick();
 assert.ok(els.menuChoices.children.some(b=>b.textContent==='📖 Nos histoires de vie'));
 run('closeMenu()');els.moreBtn.onclick();
 const family=els.menuChoices.children.find(b=>b.textContent==='Mon foyer');assert.ok(family);family.onclick();
 const story=els.menuChoices.children.find(b=>b.textContent==='📖 Nos histoires de vie');assert.ok(story);story.onclick();
 assert.equal(els.menuTitle.textContent,'📖 Mes histoires de vie');
});
test('Story summary, result and memory list contain real line breaks',()=>{
 reset();run('openLifeStories()');assert.ok(els.menuText.textContent.includes('\n\n'));assert.ok(!els.menuText.textContent.includes('\\n'));
 run('openLifeStory("first-steps")');clickChoice(0);assert.ok(els.menuText.textContent.includes('\n\n'));assert.ok(!els.menuText.textContent.includes('\\n'));
 run('openLifeStory("career-balance")');clickChoice(0);run('openLifeStories()');
 els.menuChoices.children.find(b=>b.textContent.includes('Revoir mes souvenirs')).onclick();
 assert.ok(els.menuText.textContent.includes('\n\n'));assert.ok(!els.menuText.textContent.includes('\\n'));
 assert.ok(els.menuText.textContent.indexOf('Une vie bien remplie')<els.menuText.textContent.indexOf('Une journée qui commence'));
});
test('The second adult cannot consume family or couple stories or change their affection',()=>{
 reset();run('HomeControl.create(state,"male",Life);HomeControl.switchMember(state,Life)');
 const before=run('JSON.stringify(state)');
 for(const id of ['couple-evening','engagement','baby-on-way','family-morning']){
  assert.equal(run('LifeStories.available(state).some(d=>d.id==='+JSON.stringify(id)+')'),false);
  assert.equal(run('LifeStories.choose(state,'+JSON.stringify(id)+',0)'),false);
 }
 assert.equal(run('JSON.stringify(state)'),before);
 run('openLifeStory("couple-evening")');assert.equal(els.menuTitle.textContent,'📖 Mes histoires de vie');
 assert.ok(els.menuText.textContent.includes(json('HomeControl.main(state).name')));
 run('HomeControl.switchMember(state,Life)');assert.equal(run('LifeStories.choose(state,"couple-evening",0)'),true);
 assert.equal(json('state.romance.noah'),48);
});
test('The second adult keeps everyday and own-career stories, with shared once-per-save completion',()=>{
 reset();run('HomeControl.create(state,"male",Life);HomeControl.switchMember(state,Life);Life.apply(state,{jobApply:"shop"})');
 assert.deepEqual(json('LifeStories.available(state).map(d=>d.id)'),['first-steps','career-balance']);
 assert.equal(run('LifeStories.choose(state,"career-balance",0)'),true);
 run('HomeControl.switchMember(state,Life)');assert.equal(run('LifeStories.choose(state,"career-balance",0)'),false);
});
test('Completed stories survive a complete runtime restart',()=>{
 reset();run('openLifeStory("first-steps")');clickChoice(0);
 const saved=JSON.parse(storage.get('monmonde3d_v2')),fresh=createRuntime(saved);
 assert.deepEqual(JSON.parse(fresh.run('JSON.stringify(state.stories)')),saved.stories);
 assert.equal(fresh.run('LifeStories.available(state).some(d=>d.id==="first-steps")'),false);
});
for(const failedKey of ['all','monmonde3d_v2','monmonde3d_stories'])test('Storage failure is explicit and retry saves without granting twice: '+failedKey,()=>{
 reset();const setItem=ctx.localStorage.setItem;
 ctx.localStorage.setItem=(key,value)=>{if(failedKey==='all'||key===failedKey)throw Error('test quota');setItem(key,value);};
 try{
  run('openLifeStory("first-steps")');clickChoice(0);
  assert.equal(els.menuTitle.textContent,'💾 Souvenir à sauvegarder');assert.match(els.menuText.textContent,/enregistrement a échoué/);
  assert.ok(els.menuChoices.children.some(b=>b.textContent.includes('Exporter')));
  const after=json('state');
  run('openLifeStory("first-steps")');assert.equal(els.menuTitle.textContent,'📖 Mes histoires de vie');
  // Reopen only the pending result; choosing again stays blocked.
  run('showLifeStoryResult(LifeStories.definitions[0].options[0])');
  ctx.localStorage.setItem=setItem;
  els.menuChoices.children.find(b=>b.textContent.includes('Réessayer')).onclick();
  assert.equal(els.menuTitle.textContent,'🌷 Un nouveau souvenir');
  assert.deepEqual(json('state.stories'),after.stories);assert.equal(json('state.fun'),after.fun);assert.equal(json('state.social'),after.social);
  const slots=JSON.parse(storage.get('monmonde3d_stories'));assert.deepEqual(slots.slots.find(s=>s.id===slots.active).state.stories,after.stories);
 }finally{ctx.localStorage.setItem=setItem;}
});
test('Malformed history drops unknown IDs and preserves a bounded, deduplicated history',()=>{
 reset({...fixture,stories:{completed:['first-steps','unknown','first-steps'],lastDay:-8,log:[null,{day:2,text:'x'.repeat(300)}]}});
 assert.deepEqual(json('state.stories.completed'),['first-steps']);assert.equal(json('state.stories.lastDay'),0);
 assert.equal(json('state.stories.log.length'),1);assert.equal(json('state.stories.log[0].text.length'),180);
});
console.log('FINAL: '+count+' life story checks passed. DOM/WebGL simulated; native Safari/iPhone still requires device validation.');

