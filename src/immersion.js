/* Optional activity framing; it does not change walking controls or saved camera settings. */
let observedActivity=null,activityViewAngle=0,activityViewPitch=.18,activityViewDistance=3.45;
function leaveActivityView(){observedActivity=null;activityViewAngle=0;activityViewPitch=.18;activityViewDistance=3.45;smoothEye=null;smoothTarget=null;$('observeActivity').textContent='Observer';}
$('observeActivity').onclick=()=>{if(!activity)return;if(observedActivity===activity){leaveActivityView();return;}observedActivity=activity;activityViewAngle=0;activityViewPitch=.18;activityViewDistance=activity.npc?3.9:3.45;smoothEye=null;smoothTarget=null;$('observeActivity').textContent='Vue libre';};
for(const [id,sign]of [['activityLeft',-1],['activityRight',1]])$(id).onclick=()=>{if(!activity)return;observedActivity=activity;activityViewAngle+=sign*PI/6;smoothEye=null;smoothTarget=null;$('observeActivity').textContent='Vue libre';};
const immersiveCameraEye=cameraEye;cameraEye=function(target,distance,yaw,pitch){
 if(editorMode||!activity||observedActivity!==activity)return immersiveCameraEye(target,distance,yaw,pitch);
 const p=avatarLocation(),talk=!!activity.npc,look=target;look[1]=talk?1.12:['read','eat','watch','sit'].includes(activity.pose)?.82:1.07;
 return immersiveCameraEye(look,activityViewDistance,p[2]+(talk?PI/2:PI*.28)+activityViewAngle,activityViewPitch);
};
const immersiveUpdate=updateUI;updateUI=function(){immersiveUpdate();if(observedActivity&&observedActivity!==activity)leaveActivityView();
 const urgent=Life.needs.filter(k=>state[k]<25);$('needsHUD').classList.toggle('urgent',urgent.length>0);
 for(const k of Life.needs){$(k).style.background=state[k]<25?'#b96658':'';$(k).setAttribute('aria-label',k+' '+Math.round(state[k])+' sur 100');}
 $('activityAngles').hidden=!activity;$('observeActivity').hidden=!activity;
};
const immersiveRestore=restoreGame;restoreGame=function(raw){leaveActivityView();immersiveRestore(raw);};
const immersiveCancel=$('cancel').onclick;$('cancel').onclick=()=>{leaveActivityView();immersiveCancel();};
const immersiveFinish=finishActivity;finishActivity=function(){leaveActivityView();immersiveFinish();};
// Keep body language calmer in conversation: one participant gestures at a time.
const immersiveFace=drawFaceDetails;drawFaceDetails=function(actor,model,palette,appearance,pose,phase){
 if(pose==='talk'&&activity?.npc&&Math.hypot(actor[12]-state.x,actor[14]-state.z)<4){const player=Math.hypot(actor[12]-avatarLocation()[0],actor[14]-avatarLocation()[1])<.2,turn=Math.floor(activity.t/2)%2===0;if(player!==turn)pose='';}
 immersiveFace(actor,model,palette,appearance,pose,phase);
};

// Visual anchors stay collision safe while transaction checks retain the task's location.
function workstationAnchor(task,job){const p=[...task.point,task.dir||0,0];let dx=0,dz=0;if(job==='cafe'&&task.pose==='cook')dz=.54;if(job==='shop'&&task.pose==='stock')dx=Math.sin(task.dir)*.28;
 if(Life.valid(p[0]+dx,p[1]+dz,barriers)){p[0]+=dx;p[1]+=dz;}if(!Life.valid(p[0],p[1],barriers)){let found=false;for(const r of [.15,.3,.45]){for(const [x,z]of [[-r,0],[r,0],[0,-r],[0,r]])if(Life.valid(p[0]+x,p[1]+z,barriers)){p[0]+=x;p[1]+=z;found=true;break;}if(found)break;}}return p;
}
const situatedBegin=beginAction;beginAction=function(a){if(a.shiftTask!==undefined){const task=Daily.currentTask(state);if(task)a={...a,anchor:workstationAnchor(task,state.career.shift.job)};}return situatedBegin(a);};
