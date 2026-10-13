/* Live character studio, rotatable on touch or desktop; it never advances a life activity. */
let studioPose='',studioAngle=0;
const studioFields=['jaw','nose','lips','brows','makeup','accessory'];
function syncStudio(){$('facePreset').value='';for(const k of studioFields)$(k).value=state.appearance[k]??0;}
const studioSync=syncAppearance;syncAppearance=function(){studioSync();syncStudio();};syncStudio();
for(const k of studioFields)$(k).oninput=e=>{state.appearance[k]=FaceDesign.normalize({[k]:e.target.value})[k];};
const toolbar=document.createElement('div');toolbar.className='studio-toolbar';
for(const [label,action]of [['↶ Tourner',()=>{camYaw-=Math.PI/4;smoothEye=null;}],['Tourner ↷',()=>{camYaw+=Math.PI/4;smoothEye=null;}],['Visage',()=>{camZoom=1.35;camPitch=.03;studioAngle=1;smoothEye=null;}],['Silhouette',()=>{camZoom=3.5;camPitch=.18;studioAngle=0;smoothEye=null;}]]){const b=document.createElement('button');b.textContent=label;b.onclick=action;toolbar.append(b);}
for(const [label,pose]of [['Repos',''],['Discussion','talk'],['Lecture','readStand'],['Repas','eat'],['Cuisine','cook'],['Marche','walk'],['Course','run'],['Assis','sit'],['Téléphone','phone']]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>studioPose=pose;toolbar.append(b);}
$('editor').append(toolbar);
const studioOpen=$('previewBtn').onclick;$('previewBtn').onclick=()=>{studioPose='';studioAngle=0;studioOpen();};
const studioClose=$('finishEditor').onclick;$('finishEditor').onclick=()=>{studioPose='';studioAngle=0;studioClose();save();};
const studioAvatar=avatar;avatar=function(t){if(!editorMode){studioAvatar(t);return;}human(state.x,state.z,0,skin,outfit,performance.now()*.005,['walk','run'].includes(studioPose)?1:0,state.hair,state.face,['walk','run'].includes(studioPose)?'':studioPose,state.style,state.hairColor,Life.avatarScale(state),0,{...state.appearance,actorId:'studio',running:studioPose==='run',age:state.age});};
// The studio uses a steady portrait framing, and orbit controls reset camera smoothing.
const studioEye=cameraEye;cameraEye=function(target,distance,yaw,pitch){if(editorMode&&studioAngle){target[1]=(HumanRenderer.models[state.appearance.body==='male'?'male':'female'].bones[6].pivot[1]+.1045)*Life.avatarScale(state)*(state.appearance.height||1)+groundAt(state.x,state.z)+.015;distance=1.35;}return studioEye(target,distance,yaw,pitch);};
// Lips, brows and makeup are now shaded on the skinned face itself. Only actual
// jewellery is drawn here; no fixed-depth facial primitives can float in profile.
function drawFaceDetails(actor,model,palette,appearance,pose,phase){if(!editorMode&&Math.hypot(actor[12]-state.x,actor[14]-state.z)>8)return;const a=FaceDesign.normalize(appearance),head=mul(actor,palette[6]),h=model.bones[6].pivot;
 const part=(color,x,y,z,sx,sy,sz)=>drawOne(shapes.sphere,typeof color==='string'?hex(color):color,mul(head,modelMatrix(x,y,z,sx,sy,sz,0)));
 for(const side of [-1,1]){if(a.accessory===1||a.accessory===3){part('#c49a52',side*.094,h[1]+.056,h[2]+.005,.009,.017,.008);}}
 if(a.accessory>=2&&model.necklace){for(const [i,v]of model.necklace.entries()){const p=[0,1,2].map(k=>Object.entries(v.w).reduce((sum,[j,w])=>{const m=palette[j];return sum+w*(m[k]*v.p[0]+m[k+4]*v.p[1]+m[k+8]*v.p[2]+m[k+12]);},0));drawOne(shapes.sphere,hex(i===9?'#e2bc65':'#c49a52'),mul(actor,modelMatrix(...p,i===9?.006:.004,i===9?.011:.003,.004,0)));}}
}

function drawStudioStage(){gl.clearColor(.86,.90,.86,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform3fv(uLight,[1,1,1]);dynamic('cyl','#d6d5ca',state.x,-.015,state.z,.7,.025,.7);if(studioPose==='eat'){dynamic('cube','#c7ab91',state.x,.36,state.z,.6,.08,.55);for(const side of [-1,1])dynamic('cube','#8d735d',state.x+side*.23,.16,state.z,.055,.32,.44);}}

// Five focused sections keep long appearance forms usable on a portrait phone.
let studioSection='body';const studioTabs=document.createElement('div');studioTabs.className='studio-tabs';
const studioTabButtons={};for(const [key,label]of [['face','Visage'],['hair','Cheveux'],['clothes','Tenue'],['body','Corps'],['gestures','Gestes']]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>selectStudioSection(key);studioTabButtons[key]=b;studioTabs.append(b);} $('editor').append(studioTabs);
function selectStudioSection(key,frame=true){studioSection=key;$('editor').setAttribute('data-style-section',key);for(const [name,b]of Object.entries(studioTabButtons)){b.classList.toggle('selected',name===key);b.setAttribute('aria-pressed',String(name===key));}if(frame){studioAngle=['face','hair'].includes(key)?1:0;camZoom=studioAngle?1.35:3.5;camPitch=studioAngle?.03:.18;smoothEye=null;smoothTarget=null;}}
const sectionsPreview=$('previewBtn').onclick;$('previewBtn').onclick=()=>{sectionsPreview();selectStudioSection('body');};
$('facePreset').onchange=e=>{const presets={doux:{jaw:-.35,nose:-.3,lips:.35,brows:-.4},affirme:{jaw:.75,nose:.35,lips:-.2,brows:.25},delicat:{jaw:-.7,nose:-.6,lips:.1,brows:-.65},ouvert:{jaw:.25,nose:-.1,lips:.65,brows:0}},p=presets[e.target.value];if(p){Object.assign(state.appearance,p);syncStudio();smoothEye=null;}};
selectStudioSection('body',false);
