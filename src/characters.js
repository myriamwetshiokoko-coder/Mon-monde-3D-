/* Original procedural meshes: connected anatomical rings, articulated limbs, no external assets. */
function profileMesh(rings,segments=14){const vertices=[];const pts=rings.map(([y,rx,rz])=>Array.from({length:segments},(_,i)=>{const a=i/segments*Math.PI*2;return [Math.cos(a)*rx,y,Math.sin(a)*rz]}));
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<segments;i++){const next=(i+1)%segments;for(const triangle of [[pts[j][i],pts[j+1][i],pts[j][next]],[pts[j][next],pts[j+1][i],pts[j+1][next]]]){const [a,b,c]=triangle,ab=b.map((x,i)=>x-a[i]),ac=c.map((x,i)=>x-a[i]);let n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]],len=Math.hypot(...n)||1;n=n.map(x=>x/len);if(n[0]*a[0]+n[2]*a[2]<0)n=n.map(x=>-x);for(const p of triangle)vertices.push(...p,...n)}}return makeMesh(vertices)}
shapes.torso=profileMesh([[0,.10,.075],[.04,.19,.11],[.17,.19,.115],[.27,.145,.10],[.38,.19,.12],[.51,.22,.105],[.58,.10,.075],[.64,.055,.055]]);
shapes.dress=profileMesh([[0,.28,.18],[.08,.285,.18],[.3,.22,.14],[.52,.145,.10],[.63,.19,.12],[.76,.22,.10],[.83,.1,.075],[.88,.055,.055]]);
shapes.head=profileMesh([[-.20,.015,.03],[-.16,.07,.072],[-.09,.12,.11],[0,.145,.125],[.1,.145,.12],[.18,.10,.095],[.205,.025,.025]]);
shapes.limb=profileMesh([[0,.015,.015],[.035,.07,.065],[.20,.075,.065],[.34,.045,.045],[.38,.025,.025]],10);
const hairColors=['#352a2a','#765340','#ac8457','#171b22'];
function jointMatrix(x,y,z,sx,sy,sz,yaw,tilt=0){let m=modelMatrix(x,y,z,1,1,1,yaw);if(tilt){const c=Math.cos(tilt),s=Math.sin(tilt);m=mul(m,[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1])}return mul(m,modelMatrix(0,0,0,sx,sy,sz,0))}
function human(x,z,dir,teint,tenue,phase,moving,hair=0,face=0,pose='',style=0,hairColor=0,scale=1,lift=0){
 const sk=skins[teint],cloth=outfits[tenue],hc=hairColors[hairColor],swing=Math.sin(phase)*.55*moving,bob=moving?Math.abs(Math.sin(phase))*.022:Math.sin(phase*.3)*.007;
 const base=modelMatrix(x,pose==='sleep'?.90:lift,z,scale,scale,scale,dir);const transform=pose==='sleep'?mul(base,[1,0,0,0,0,0,1,0,0,-1,0,0,0,0,-.90,1]):base;
 function part(shape,color,px,y,pz,sx,sy,sz,tilt=0){drawOne(shapes[shape],hex(color),mul(transform,jointMatrix(px,y+bob,pz,sx,sy,sz,0,tilt)))}
 const seated=['sit','eat','read','cuddle'].includes(pose),cook=pose==='cook',shower=pose==='shower',wave=pose==='talk';const waist=seated?.5:.78;
 part(style===1?'dress':'torso',cloth,0,style===1?waist-.22:waist,0,1,1,1);
 part('cyl',sk,0,waist+.61,0,.053,.15,.053);part('head',sk,0,waist+.83,.012,1+face*.07,1,1);
 part('sphere',hc,0,waist+.99,-.017,.147,.082,.126);
 if(hair===1)part('sphere',hc,0,waist+1.10,-.07,.095,.09,.09);
 if(hair===2){for(const side of [-1,1]){part('sphere',hc,side*.135,waist+.85,-.025,.04,.19,.085);part('sphere',hc,side*.13,waist+.7,-.06,.05,.15,.07)}}
 const blink=Math.sin(phase*.21)> .992?.003:.017;
 for(const side of [-1,1]){part('sphere',sk,side*.145,waist+.83,.005,.023,.045,.025);part('sphere','#fffaf2',side*.058,waist+.87,.118,.032,blink,.012);part('sphere','#463531',side*.058,waist+.87,.13,.013,blink,.009);part('cube',hc,side*.06,waist+.915,.117,.066,.01,.014);}
 part('sphere',sk,0,waist+.82,.133,.025,.037,.028);part('sphere','#a76766',0,waist+.748,.113,.042,pose==='talk'?.016:.009,.012);
 for(const side of [-1,1]){
  let leg=seated?-1.45:swing*side;
  const hip=[side*.11,waist+.06,0],knee=[hip[0],hip[1]-.38*Math.cos(leg),hip[2]-.38*Math.sin(leg)];
  part('limb',style===2?sk:'#4e4750',hip[0],hip[1],hip[2],1,-1,1,leg);part('sphere',style===2?sk:'#4e4750',...knee,.047,.052,.047);
  const bend=seated?0:Math.max(0,-swing*side)*.9;part('limb',style===2?sk:'#4e4750',knee[0],knee[1],knee[2],.8,-.95,.85,bend);
  part('sphere','#f3e6d3',knee[0],knee[1]-.36*Math.cos(bend),knee[2]-.36*Math.sin(bend)+.07,.085,.054,.14);
  let arm=-swing*side*.75;if(cook||shower||pose==='eat'||pose==='cuddle')arm=-.85+Math.sin(phase)*.15;if(wave&&side===1)arm=-1.25+Math.sin(phase)*.2;
  const shoulder=[side*.225,waist+.48,0],elbow=[side*.245,shoulder[1]-.27*Math.cos(arm),-.27*Math.sin(arm)];part('limb',cloth,...shoulder,.9,-.7,.9,arm);part('limb',sk,...elbow,.68,-.65,.7,arm*.6);part('sphere',sk,elbow[0],elbow[1]-.24*Math.cos(arm*.6),elbow[2]-.24*Math.sin(arm*.6),.042,.06,.038);
 }
 if(['cook','eat'].includes(pose)){part('sphere','#efcea4',0,waist+.16,.37,.14,.038,.14);part('sphere','#a16c44',.04,waist+.20,.36,.06,.022,.04)}
 if(pose==='read'){part('cube','#eee0c4',0,waist+.25,.33,.28,.02,.18)}
}
function drawBaby(c,index){const x=3.9+index*1.2,z=-.5;dynamic('sphere',outfits[outfit],x,.82,z,.19,.07,.3);dynamic('sphere',skins[c.skin],x,.88,z+.22,.11,.1,.1);for(const side of [-1,1])dynamic('sphere','#473531',x+side*.035,.955,z+.26,.01,.01,.01)}
