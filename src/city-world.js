/* Two ground-floor apartment units and two accessible workplaces. Upper stories are decorative. */
for(const o of scene)if(Math.abs(o.m[12])<1&&Math.abs(o.m[0])>50&&o.m[14]>14&&o.m[14]<26)o.m[0]=101;
for(const side of [-1,1]){const x=side*41;box('#e2d7c5',x,.005,17.1,20,.06,2.6);box('#e2d7c5',x,.005,25.7,20,.06,2.3);for(let i=-2;i<=2;i++)box('#f8efe2',side*42+i*.48,.032,21.35,.26,.025,5.1);}
Housing.extraSolids.horizon=Housing.extraSolids.rose.map(b=>b.slice());
for(const id of ['studio','horizon']){const h=Town.houses[id],start=scene.length;
 for(const o of scene)if(o.homeId===id){if(o.roof)o.color=hex('#6e797d');else if(o.m[13]>1.3&&o.shape==='cube'&&Math.abs(o.m[14]-5.05)<.12)o.color=hex(id==='studio'?'#bbc4c2':'#c5bbaa');}
 box('#6d7575',h.x,3.45,0,12.9,.14,10.9);for(const dx of [-6.2,6.2])box('#afb6af',h.x+dx,3.75,0,.07,.55,10.6);
 box('#e8e2d5',h.x,2.75,5.2,2.3,.47,.13);box('#758c86',h.x,2.75,5.29,1.9,.32,.025);
 for(const b of Housing.extraSolids[id]||[]){box('#dedbcf',h.x+(b[0]+b[1])/2,1.3,(b[2]+b[3])/2,b[1]-b[0],2.6,b[3]-b[2]);quarterBarriers.push(b.map((v,i)=>v+(i<2?h.x:0)));}
 for(const o of scene.slice(start))o.homeId=id;
}
function civicBuilding(x,kind){const z=32,start=scene.length,w=11,d=10;
 box('#e6d7c3',x,.015,z,w,.10,d);box('#eee5d7',x,.08,z,w-.3,.04,d-.3);
 for(const side of [-1,1]){box('#c1c4ba',x+side*w/2,1.6,z,.16,3.2,d);quarterBarriers.push([x+side*w/2-.09,x+side*w/2+.09,z-d/2,z+d/2]);}
 box('#c1c4ba',x,1.6,z+d/2,w,3.2,.16);quarterBarriers.push([x-w/2,x+w/2,z+d/2-.09,z+d/2+.09]);
 for(const side of [-1,1]){const cx=x+side*(w/4+.6);box('#b5beb8',cx,1.6,z-d/2,w/2-1.2,3.2,.16);quarterBarriers.push([cx-(w/2-1.2)/2,cx+(w/2-1.2)/2,z-d/2-.09,z-d/2+.09]);}
 for(const side of [-1,1])box('#a3bbc0',x+side*3,1.7,z-d/2-.1,2.0,1.3,.055);
 box('#767f7b',x,3.22,z,w+.3,.12,d+.3);box('#dacbb3',x,2.55,z-d/2-.16,2.3,.5,.1);
 if(kind==='school'){
  box('#f0dbc0',x+2.2,1.3,z+2.2,.12,2.6,5.4);quarterBarriers.push([x+2.14,x+2.26,z-.5,z+4.9]);
  box('#476e63',x-.5,1.8,z+4.85,5,.95,.08);for(let i=0;i<4;i++)box('#e9ddbf',x-2.2+i*1.1,1.8,z+4.79,.65,.025,.01);
  for(const [dx,dz]of [[-3,-.4],[-.8,-.4],[1.1,-.4],[-3,1.4],[-.8,1.4],[1.1,1.4]]){box('#c7a682',x+dx,.72,z+dz,.92,.055,.54);for(const side of [-1,1])box('#9e8568',x+dx+side*.37,.34,z+dz,.045,.68,.4);box('#91aaa0',x+dx,.38,z+dz-.65,.46,.08,.43);box('#91aaa0',x+dx,.65,z+dz-.82,.45,.5,.06);}
  box('#b9a487',x+3.2,.72,z-2,.85,.06,.55);box('#6b7478',x+3.2,1,z-2.15,.55,.36,.035);box('#dbc7ae',x+3.9,.53,z+1,1.4,.32,.68);box('#eeece0',x+3.9,.73,z+1,1.3,.10,.64);
 }else{
  box('#9ea9a8',x+3,.9,z+3,.95,.08,.55);for(const dx of [2.6,3.4])box('#858e8f',x+dx,.45,z+3,.045,.9,.4);
  box('#b29d80',x+4.6,1.2,z+1.5,.12,2,2.8);for(let i=0;i<5;i++){box('#758087',x+4.52,.6+i*.26,z+1.5,.09,.07,.8);}
  for(const dx of [-1.1,1.1]){box('#708581',x+dx,.14,z+.8,.25,.28,4.3);box('#d2c4a9',x+dx,.36,z+.8,.27,.15,4.25);}box('#9fada8',x-3,.75,z-2,1.35,.10,.55);
 }
 for(const o of scene.slice(start)){o.cityBuilding=kind;if(o.m[13]>1&&(Math.abs(o.m[0])>3||Math.abs(o.m[10])>3))o.foreground='city-'+kind;}
 foregroundFixtures.push({id:'city-'+kind,zone:kind,bounds:{min:[x-w/2,0,z-d/2],max:[x+w/2,3.3,z+d/2]}});
}
civicBuilding(-42,'school');civicBuilding(42,'atelier');

// More patrons need real separate chairs, while preserving a free seat for the player.
for(const x of [-25.5,-28.2]){box('#dccab3',x,.03,27.5,2.4,.08,3.6);solid(x,.75,27.5,1.25,.1,1.25,'#b58b6e');cyl('#997d65',x,.37,27.5,.09,.7,.09);flower(x,27.5);for(const z of [26.5,28.5]){box('#c9ad8e',x,.4,z,.55,.12,.5);box('#c9ad8e',x,.72,z+(z>27.5?.2:-.2),.55,.7,.08);}}
