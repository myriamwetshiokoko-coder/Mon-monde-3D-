const interactions=[{x:-3.3,z:-3.6,r:2.05,name:'Cuisine',verb:'🍳 Cuisiner',desc:'Tu prépares un bon petit plat.',seconds:4,effect:{hunger:45,fun:6}},{x:3.25,z:-3.35,r:2.1,name:'Chambre',verb:'🌙 Dormir',desc:'Une bonne nuit de repos.',seconds:5,effect:{energy:62,hygiene:-4},sleep:true},{x:-3.8,z:2.7,r:2.0,name:'Salon',verb:'🌷 Se détendre',desc:'Un petit moment rien que pour toi.',seconds:4,effect:{fun:38,energy:8}},{x:-4.93,z:.75,r:1.25,name:'Télévision',verb:'📺 Regarder la TV',desc:'Tu profites d’une émission.',seconds:4,effect:{fun:32}},{x:5,z:3,r:1.8,name:'Salle de bain',verb:'🫧 Prendre une douche',desc:'Une douche rafraîchissante.',seconds:4,effect:{hygiene:65}},{x:4.35,z:12.1,r:2.15,name:'Fleurs du jardin',verb:'🌼 Arroser',desc:'Tu prends soin des fleurs de ton jardin.',seconds:4,effect:{fun:20,hygiene:-3}},{x:-5.8,z:10.2,r:2.05,name:'Banc du jardin',verb:'🌿 Se reposer',desc:'Tu profites du soleil et du calme.',seconds:4,effect:{energy:16,fun:22}},{x:2.85,z:14.35,r:1.6,name:'Boîte aux lettres',verb:'💌 Regarder le courrier',desc:'Une jolie carte de bienvenue t’attend !',seconds:3,effect:{fun:10}},{x:0,z:21.35,r:2.0,name:'Promenade',verb:'🚶 Faire une promenade',desc:'Une petite balade dans la rue.',seconds:4,effect:{fun:20,energy:-5}}];
const skins=['#f6ceb1','#dca982','#a36b4d','#66412f'];const outfits=['#bd8197','#8ba8ad','#caa26c','#977eae'];let skin=2,outfit=0;
const defaultState=Life.defaults;
let state=Life.restore(null);try{state=Life.restore(JSON.parse(localStorage.getItem('monmonde3d_v1')||localStorage.getItem('monmonde3d_v02')||localStorage.getItem('monmonde3d_v01')))}catch(_){}
skin=Math.max(0,Math.min(3,state.skin));outfit=Math.max(0,Math.min(3,state.outfit));document.getElementById('playerName').value=state.name;
function setupSwatches(id,colors,value,onChange){const container=document.getElementById(id);const update=()=>{container.innerHTML='';colors.forEach((c,i)=>{const b=document.createElement('button');b.className='swatch'+(value()===i?' selected':'');b.style.background=c;b.type='button';b.title=(id==='skins'?'Teint ':'Tenue ')+(i+1);b.setAttribute('aria-label',b.title);b.onclick=()=>{onChange(i);update()};container.append(b)})};update()};setupSwatches('skins',skins,()=>skin,v=>skin=v);setupSwatches('clothes',outfits,()=>outfit,v=>outfit=v);
let started=false,camYaw=0,camPitch=0.77,camZoom=7.5,joystick={x:0,y:0},keys={},activity=null,elapsed=0,saveTimer=0,walkPhase=0,noticeTimeout=0,last=performance.now(),near=null;
let doorAmount=0,zone='maison';
// Les collisions sont calculées dans le plan horizontal (rayon du personnage ~0,28 m).
const barriers=[
 [-6.3,-5.9,-5.2,5.2],[5.9,6.3,-5.2,5.2],[-6.3,6.3,-5.27,-4.87],
 [-6.3,-1.08,4.9,5.23],[1.08,6.3,4.9,5.23],
 [-5.82,-1.02,-4.52,-3.45], // plan de cuisine
 [1.9,4.43,-4.85,-2.2], // lit
 [-5.25,-2.61,2.04,3.39], // canapé
 [-2.95,-1.43,1.55,2.49], // table basse
 [-.93,1.29,-.33,1.31], // table à manger
 [4.05,5.96,2.54,4.06], // baignoire
 [4.7,5.88,-2.28,-1.31], // armoire
 [-9.42,-9.0,5.6,15.8],[9.0,9.42,5.6,15.8],
 [-9.42,-1.65,15.4,15.75],[1.65,9.42,15.4,15.75],
 [-6.96,-4.84,9.76,10.75], // banc
 [6.25,7.13,10.0,11.0] // tronc d'arbre
];
barriers.push(...quarterBarriers);
function validPosition(x,z){return Life.valid(x,z,barriers,doorAmount)}
if(!Life.valid(state.x,state.z,barriers)){state.x=0;state.z=3}
// La porte s’ouvre automatiquement à proximité et ne requiert pas de bouton.
function renderDoor(){
 const a=doorAmount*PI*.5;
 dynamic('cube','#bc8b75',.86*doorAmount,1.09,5.1+.89*doorAmount,1.72,2.13,.13,a);
 dynamic('sphere','#f1e4cf',-.59+.85*doorAmount,1.06,5.2+.9*doorAmount,.075,.075,.075);
}
function currentZone(z){if(z>26&&z<34.3&&state.x< -7.3&&state.x> -16.7)return 'café';if(z>26&&z<34.3&&state.x>7.3&&state.x<16.7)return 'épicerie';return Math.abs(state.x)<6&&z<5.05?'maison':Math.abs(state.x)<9.5&&z<15.65?'jardin':z>34?'parc':'quartier'}

function save(){state.skin=skin;state.outfit=outfit;try{localStorage.setItem('monmonde3d_v1',JSON.stringify(state));document.getElementById('saveStatus').textContent='Sauvegardé ✓'}catch(_){document.getElementById('saveStatus').textContent='Sauvegarde indisponible'}}
document.getElementById('start').onclick=()=>{state.name=(document.getElementById('playerName').value||'Mon personnage').trim().slice(0,18);save();document.getElementById('welcome').style.display='none';started=true;inform('Traverse le jardin : café à gauche, épicerie à droite, parc en face.');};
const joy=document.getElementById('joy'),stick=document.getElementById('stick');let joyPointer=null;
function moveJoy(e){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=35;let dx=e.clientX-cx,dy=e.clientY-cy,dist=Math.hypot(dx,dy);if(dist>max){dx*=max/dist;dy*=max/dist}joystick={x:dx/max,y:dy/max};stick.style.transform=`translate(${dx}px,${dy}px)`}
joy.addEventListener('pointerdown',e=>{e.preventDefault();joyPointer=e.pointerId;joy.setPointerCapture(e.pointerId);moveJoy(e)});joy.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)moveJoy(e)});function stopJoy(e){if(e.pointerId!==joyPointer)return;joyPointer=null;joystick={x:0,y:0};stick.style.transform='translate(0,0)'}joy.addEventListener('pointerup',stopJoy);joy.addEventListener('pointercancel',stopJoy);joy.addEventListener('lostpointercapture',stopJoy);
let dragPointer=null,dragX=0,dragY=0;canvas.addEventListener('pointerdown',e=>{if(!started)return;dragPointer=e.pointerId;dragX=e.clientX;dragY=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!started||e.pointerId!==dragPointer)return;camYaw-=((e.clientX-dragX)/innerWidth)*3.4;camPitch=Math.min(1.18,Math.max(.42,camPitch+(e.clientY-dragY)/innerHeight*2.3));dragX=e.clientX;dragY=e.clientY});canvas.addEventListener('pointerup',e=>{if(e.pointerId===dragPointer)dragPointer=null});canvas.addEventListener('pointercancel',()=>dragPointer=null);
window.addEventListener('keydown',e=>{if(['INPUT','SELECT'].includes(e.target.tagName))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e'&&!e.repeat)startActivity()});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);document.getElementById('act').onclick=()=>startActivity();document.getElementById('recenter').onclick=()=>{camYaw=.22;camPitch=.77;inform('Caméra recentrée ✨')};
function inform(msg){const h=document.getElementById('hint');h.textContent=msg;h.classList.add('show');clearTimeout(noticeTimeout);noticeTimeout=setTimeout(()=>h.classList.remove('show'),3300)}
function startActivity(){if(activity||!near||!started)return;const error=Life.can(state,near);if(error){inform(error);return;}if(near.dress){openWardrobe();return;}activity={...near,t:0};document.getElementById('activityTitle').textContent=near.verb;document.getElementById('activityText').textContent=near.desc;document.getElementById('activity').classList.add('show')}
function cap(k,v){state[k]=Math.max(0,Math.min(100,(state[k]||0)+v))}
function finishActivity(){const a=activity;Life.apply(state,a);inform(a.npc?`${a.name} : ${state.relationships[a.npc]>=48?'Nous sommes amis !':'Ravie de te parler !'}`:a.cook?'Repas préparé : approche-toi de la table pour manger.':a.work?'Service terminé : +65 pièces.':a.shop?'Trois provisions ajoutées.':a.desc);activity=null;document.getElementById('activity').classList.remove('show');save()}
function drawOne(mesh,col,m){gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffer);gl.vertexAttribPointer(attrPosition,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(attrNormal,3,gl.FLOAT,false,24,12);gl.uniformMatrix4fv(uModel,false,new Float32Array(m));gl.uniform3fv(uTint,col);gl.drawArrays(gl.TRIANGLES,0,mesh.count)}
function dynamic(shape,color,x,y,z,sx,sy,sz,rot=0){drawOne(shapes[shape],hex(color),modelMatrix(x,y,z,sx,sy,sz,rot))}
function human(x,z,dir,teint,tenue,phase,moving,hair=0,face=0,pose=''){
 const c=Math.cos(dir),sn=Math.sin(dir),bob=Math.sin(phase*2)*.025*moving;
 function part(color,px,y,pz,sx,sy,sz){if(pose==='sleep'){dynamic('sphere',color,x+px,.92+pz,z+y-.95,sx,sz,sy,0);return}dynamic('sphere',color,x+c*px+sn*pz,y+bob,z-sn*px+c*pz,sx,sy,sz,dir)}
 const sk=skins[teint],cloth=outfits[tenue],swing=Math.sin(phase)*.18*moving;
 part('#8e9d80',0,.035,0,.32,.018,.22);
 part(cloth,0,1.05,0,.25,.36,.16);part(cloth,0,.77,0,.24,.18,.17);
 part(sk,0,1.4,0,.065,.10,.065);part(sk,0,1.61,0,.16+face*.01,.215,.15);
 part('#30252a',0,1.75,-.02,.17,.10,.155);
 if(hair===1){part('#30252a',0,1.86,-.04,.14,.13,.13)}if(hair===2){for(let side of [-1,1])part('#30252a',side*.15,1.56,-.07,.09,.25,.1)}
 part(sk,0,1.6,.147,.035,.045,.035);for(let side of [-1,1]){part('#fffaf3',side*.061,1.66,.132,.04,.025,.022);part('#352b2b',side*.061,1.66,.15,.015,.019,.012);part(sk,side*.17,1.61,0,.025,.055,.025)}
 part('#a76564',0,1.535,.136,.06,state.social>40?.016:.009,.018);
 for(let side of [-1,1]){let sw=swing*side;part(cloth,side*.255,1.18,sw*.3,.09,.17,.09);part(sk,side*.29,.95,sw,.065,.18,.065);part(sk,side*.29,.76,sw*1.4,.063,.075,.06);part('#51494d',side*.12,.53,sw,.095,.25,.1);part('#51494d',side*.12,.25,-sw,.08,.20,.085);part('#f4e7db',side*.12,.07,.05-sw,.1,.065,.17)}
 if(pose){part(pose==='Cuisine'?'#eac99a':'#d8e2de',.35,1,.17,.09,.08,.09)}
}
let facing=0;let smoothEye=null;
function avatar(t){if(activity?.sleep){human(3.15,-3.55,0,skin,outfit,0,0,state.hair,state.face,'sleep');return}const active=!!activity;human(state.x,state.z,facing,skin,outfit,active?elapsed*4:walkPhase,active&&!activity.sleep?.35:t?.moving||0,state.hair,state.face,activity?.name);if(activity?.name==='Salle de bain'){for(let i=0;i<7;i++)dynamic('sphere','#c6e7eb',state.x+Math.sin(i*2+elapsed)*.3,.3+(elapsed*.6+i*.2)%1.5,state.z+Math.cos(i)*.25,.045,.06,.045)}if(activity?.sleep){dynamic('sphere','#eed9ad',state.x,.1,state.z,.38,.025,.28)}}
function updateUI(){for(let k of Life.needs)document.getElementById(k).style.width=Math.round(state[k])+'%';let hour=Math.floor(state.time),min=Math.floor((state.time-hour)*60);let night=hour<6||hour>=19;document.getElementById('clock').textContent=(night?'🌙':'☀️')+' Jour '+state.day+' · '+String(hour).padStart(2,'0')+':'+String(min).padStart(2,'0');let b=document.getElementById('act');b.disabled=!near||!!activity||!started;b.textContent=activity?'En cours…':(near?near.verb:'Approche-toi d’un objet');document.getElementById('wallet').textContent=`${state.money} ◈ · ${state.groceries} provisions · ${state.meals} repas`;let nz=currentZone(state.z);if(zone!==nz){zone=nz;inform('✿ '+({maison:'Maison Soleil',jardin:'Jardin Soleil',café:'Café Fleur',épicerie:'Épicerie',parc:'Parc Soleil',quartier:'Quartier Soleil'}[nz]||nz))}document.getElementById('sceneLabel').textContent=activity?activity.verb:near?near.name+' · '+near.verb: '✿ '+nz+' — '+state.name;}

function resize(){let ratio=Math.min(devicePixelRatio||1,quality),w=Math.max(1,Math.floor(innerWidth*ratio)),h=Math.max(1,Math.floor(innerHeight*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h)}
function tick(now){requestAnimationFrame(tick);if(document.hidden){last=now;return;}let dt=Math.min((now-last)/1000,.05);last=now;resize();if(started&&!paused){elapsed+=dt;saveTimer+=dt;state.time+=dt/45;while(state.time>=24){state.time-=24;state.day++}if(!activity){cap('hunger',-dt*.09);cap('energy',-dt*.065);cap('hygiene',-dt*.04);cap('fun',-dt*.06);cap('social',-dt*.045)}let mx=joystick.x,my=joystick.y;if(keys.a||keys.q||keys.arrowleft)mx-=1;if(keys.d||keys.arrowright)mx+=1;if(keys.w||keys.z||keys.arrowup)my-=1;if(keys.s||keys.arrowdown)my+=1;let targetDoor=Math.hypot(state.x,state.z-5.05)<2.55?1:0;doorAmount+=((targetDoor-doorAmount)*Math.min(1,dt*6));let magnitude=Math.min(1,Math.hypot(mx,my));let moving=(!activity&&magnitude>.10)?1:0;if(moving){mx/=Math.hypot(mx,my);my/=Math.hypot(mx,my);let dx=Math.cos(camYaw)*mx + Math.sin(camYaw)*my;let dz=-Math.sin(camYaw)*mx+Math.cos(camYaw)*my;facing=Math.atan2(dx,dz);let speed=(keys.shift||running?4.2:2.85)*(state.energy<10?.65:1),step=dt*speed*magnitude,nx=state.x+dx*step,nz=state.z+dz*step;if(validPosition(nx,state.z))state.x=nx;if(validPosition(state.x,nz))state.z=nz;walkPhase+=dt*10}updateResidents(dt);window.avatarState={moving,dir:facing};near=null;for(let i of [...interactions,...residents.map(n=>({x:n.x,z:n.z,r:1.65,name:n.name,verb:"💬 Discuter",desc:"Un moment avec ton voisin.",seconds:4,effect:{social:28,fun:10},npc:n.id}))]){let d=Math.hypot(state.x-i.x,state.z-i.z);if(d<i.r&&(!near||d<Math.hypot(state.x-near.x,state.z-near.z)))near=i}if(activity){activity.t+=dt;document.getElementById('activityProgress').style.width=Math.min(100,activity.t/activity.seconds*100)+'%';if(activity.t>=activity.seconds)finishActivity()}if(saveTimer>=6){saveTimer=0;save()}updateUI()}
let sunlight=Math.max(.25,(Math.sin(((state.time-6)/24)*PI*2)+.55)/1.55);gl.clearColor(.64*sunlight+.16,.76*sunlight+.11,.80*sunlight+.10,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.useProgram(program);gl.enableVertexAttribArray(attrPosition);gl.enableVertexAttribArray(attrNormal);gl.uniform3fv(uLight,[.63+.37*sunlight,.64+.36*sunlight,.72+.28*sunlight]);let aspect=canvas.width/canvas.height;let cameraDistance=camZoom+(aspect<.8?2.0:0);let eye=[state.x+Math.sin(camYaw)*cameraDistance*Math.cos(camPitch),1.15+Math.sin(camPitch)*cameraDistance,state.z+Math.cos(camYaw)*cameraDistance*Math.cos(camPitch)];if(!smoothEye)smoothEye=eye.slice();for(let i=0;i<3;i++)smoothEye[i]+=(eye[i]-smoothEye[i])*Math.min(1,dt*10);let vp=mul(perspective(PI/3,aspect,.12,100),lookAt(smoothEye,[state.x,1.1,state.z]));gl.uniformMatrix4fv(uVP,false,new Float32Array(vp));drawScene();renderDoor();for(const n of residents)human(n.x,n.z,n.dir,n.skin,n.outfit,elapsed*6,n.moving,1,0);avatar(window.avatarState);drawLabels(vp);}
window.addEventListener('beforeunload',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});requestAnimationFrame(tick);
// Life extensions. All transaction effects are applied once at completion.
let paused=false,running=false,quality=1.35;
Object.assign(interactions[0],{cook:true,effect:{fun:6},desc:'Tu cuisines une portion avec une provision.'});
interactions.push(
 {x:.18,z:1.7,r:1.5,name:'Table',verb:'🥐 Manger un repas',desc:'Bon appétit !',seconds:4,effect:{hunger:45},eat:true},
 {x:1.2,z:-2.4,r:1.2,name:'Dressing',verb:'👗 Changer de style',desc:'Ton style, tes envies.',seconds:1,effect:{},dress:true},
 {x:-12,z:31.4,r:1.6,name:'Café Fleur',verb:'☕ Café et pâtisserie · 12 ◈',desc:'Une pause gourmande au café.',seconds:5,effect:{hunger:28,fun:20,energy:10},cost:12},
 {x:-15.1,z:31.4,r:1.4,name:'Emploi au café',verb:'🧑‍🍳 Faire un service · +65 ◈',desc:'Tu aides au café pendant trois heures de jeu.',seconds:15,effect:{energy:-22,hunger:-15,social:12},work:true},
 {x:12,z:31.9,r:1.5,name:'Épicerie',verb:'🛍️ 3 provisions · 18 ◈',desc:'Tes provisions sont prêtes !',seconds:3,effect:{},cost:18,shop:true},
 {x:-6,z:39,r:1.5,name:'Parc Soleil',verb:'🌿 Lire au parc',desc:'Une lecture au milieu des arbres.',seconds:6,effect:{fun:30,energy:10}},
 {x:6,z:39,r:1.5,name:'Parc Soleil',verb:'🧘 Méditer',desc:'Un instant pour respirer.',seconds:6,effect:{fun:24,energy:15}}
);
const residents=[{id:'lina',name:'Lina',x:-5,z:25,skin:2,outfit:1,dir:0,route:[[-5,25],[-4,36],[4,36],[5,25]],next:1},{id:'noah',name:'Noah',x:19,z:25,skin:3,outfit:2,dir:0,route:[[19,25],[23,25],[23,39],[19,39]],next:1},{id:'emma',name:'Emma',x:-20,z:25,skin:0,outfit:3,dir:0,route:[[-20,25],[-24,25],[-24,39],[-20,39]],next:1}];
function updateResidents(dt){for(const n of residents){n.moving=0;if(activity?.npc===n.id||Math.hypot(n.x-state.x,n.z-state.z)<1.7)continue;const [tx,tz]=n.route[n.next],d=Math.hypot(tx-n.x,tz-n.z);if(d<.15){n.next=(n.next+1)%n.route.length;continue}let dx=(tx-n.x)/d*.75*dt,dz=(tz-n.z)/d*.75*dt;if(Life.valid(n.x+dx,n.z+dz,barriers)){n.x+=dx;n.z+=dz;n.dir=Math.atan2(dx,dz);n.moving=1}}}
const $=id=>document.getElementById(id);
function openWardrobe(){save();paused=true;keys={};joystick={x:0,y:0};$('playerName').value=state.name;$('welcome').style.display='grid';$('start').textContent='Reprendre ma partie →'}
$('styleBtn').onclick=openWardrobe;
for(const [id,key]of [['hair','hair'],['face','face']]){$(id).value=state[key];$(id).onchange=e=>{state[key]=Number(e.target.value)}}
$('run').onclick=()=>{running=!running;$('run').textContent=running?'Marcher':'Courir';$('run').setAttribute('aria-pressed',running)};
const originalStart=$('start').onclick;$('start').onclick=()=>{paused=false;originalStart()};
$('saveBtn').onclick=()=>{save();inform($('saveStatus').textContent)};
$('quality').onchange=e=>{quality=Number(e.target.value);inform('Résolution ajustée')};
$('cancel').onclick=()=>{activity=null;$('activity').classList.remove('show');inform('Activité annulée, aucune transaction effectuée.')};
function releaseControls(){keys={};joystick={x:0,y:0};joyPointer=null;dragPointer=null;stick.style.transform='translate(0,0)'}
window.addEventListener('blur',releaseControls);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseControls()});
$('export').onclick=()=>{save();const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(state)],{type:'application/json'}));a.href=url;a.download='mon-monde-sauvegarde.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('import').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>50000)throw Error();const raw=JSON.parse(await f.text());if(raw.version!==1||!Number.isFinite(raw.x))throw Error();state=Life.restore(raw);if(!Life.valid(state.x,state.z,barriers)){state.x=0;state.z=3}skin=state.skin;outfit=state.outfit;$('playerName').value=state.name;setupSwatches('skins',skins,()=>skin,v=>skin=v);setupSwatches('clothes',outfits,()=>outfit,v=>outfit=v);$('hair').value=state.hair;$('face').value=state.face;save();inform('Partie restaurée.')}catch{inform('Ce fichier ne contient pas une sauvegarde valide.')}e.target.value=''};
$('journalBtn').onclick=()=>{paused=true;releaseControls();$('journalText').textContent=`Jour ${state.day} · ${state.money} pièces · ${state.groceries} provisions · ${state.meals} repas préparés.\n\n`+residents.map(n=>`${n.name} : ${(state.relationships[n.id]||0)>=48?'Amitié':'Connaissance'} (${state.relationships[n.id]||0}/100)`).join('\n')+'\n\nCafé Fleur : à gauche après le passage piéton. Épicerie : à droite. Parc : tout droit entre les commerces. Les deux maisons latérales sont décoratives.';$('journal').hidden=false};$('closeJournal').onclick=()=>{paused=false;$('journal').hidden=true};
// Project labels: navigation without exposing internal coordinates.
const labels=[{text:'☕ Café Fleur',x:-12,y:3.5,z:26},{text:'🛍 Épicerie',x:12,y:3.5,z:26},{text:'🌿 Parc Soleil',x:0,y:1.5,z:36}];
for(const l of [...labels,...residents]){l.el=document.createElement('div');l.el.className='worldLabel';l.el.textContent=l.text||l.name;$('labels').append(l.el)}
function drawLabels(vp){for(const l of [...labels,...residents]){const v=[l.x,l.y||2.15,l.z,1],p=[0,0,0,0];for(let r=0;r<4;r++)for(let c=0;c<4;c++)p[r]+=vp[c*4+r]*v[c];const x=p[0]/p[3],y=p[1]/p[3];const visible=started&&p[3]>0&&Math.abs(x)<.95&&Math.abs(y)<.8&&Math.hypot(l.x-state.x,l.z-state.z)<30;l.el.style.display=visible?'block':'none';if(visible){l.el.style.left=(x*.5+.5)*innerWidth+'px';l.el.style.top=(-y*.5+.5)*innerHeight+'px'}}}
// Static geometry is transformed once and grouped by tint (~60 draw calls instead of hundreds).
const batches=new Map();for(const o of scene){const inside=isCutawayWall(o),key=inside+o.color.join(','),group=batches.get(key)||{v:[],color:o.color,inside};const vertices=shapes[o.shape].vertices,m=o.m;for(let i=0;i<vertices.length;i+=6){const p=vertices.slice(i,i+3),n=vertices.slice(i+3,i+6);for(let r=0;r<3;r++)group.v.push(m[r]*p[0]+m[4+r]*p[1]+m[8+r]*p[2]+m[12+r]);const scales=[Math.hypot(m[0],m[1],m[2]),Math.hypot(m[4],m[5],m[6]),Math.hypot(m[8],m[9],m[10])];let nn=[0,1,2].map(r=>m[r]*n[0]/scales[0]**2+m[4+r]*n[1]/scales[1]**2+m[8+r]*n[2]/scales[2]**2);let len=Math.hypot(...nn)||1;group.v.push(...nn.map(x=>x/len))}batches.set(key,group)}
const staticBatches=[...batches.values()].map(b=>({mesh:makeMesh(b.v),color:b.color,inside:b.inside}));batches.clear();
function isCutawayWall(o){const x=o.m[12],y=o.m[13],z=o.m[14];if(y>1.3&&Math.abs(x)<6.2&&z>4.85&&z<5.4)return 'maison';if(y>1.3&&z>25.7&&z<26.3){if(x< -7)return 'café';if(x>7)return 'épicerie'}return ''}
function drawScene(){const zone=currentZone(state.z);for(const b of staticBatches)if(!b.inside||b.inside!==zone)drawOne(b.mesh,b.color,mIdentity())}
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();save();paused=true;inform('Affichage 3D interrompu. Recharge la page pour reprendre ta sauvegarde.')});canvas.addEventListener('webglcontextrestored',()=>location.reload());
