// V0.2 : la maison existante et un extérieur d’un seul tenant, sans chargement.
const foregroundFixtures=[];
box('#a9c89c',0,-.4,20,65,.3,53);
function fixture(id,zone,build){
 const start=scene.length;build();const bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
 for(const o of scene.slice(start)){o.foreground=id;const m=o.m,r=o.shape==='cube'?[.5,.5,.5]:o.shape==='sphere'?[1,1,1]:[1,.5,1];for(let axis=0;axis<3;axis++){const extent=Math.abs(m[axis])*r[0]+Math.abs(m[4+axis])*r[1]+Math.abs(m[8+axis])*r[2];bounds.min[axis]=Math.min(bounds.min[axis],m[12+axis]-extent);bounds.max[axis]=Math.max(bounds.max[axis],m[12+axis]+extent)}}
 foregroundFixtures.push({id,zone,bounds});
}
box('#aed5ab',0,-.22,0,29,.3,29);box('#e8c8b1',0,-.03,0,12.3,.14,10.5);box('#f8eadd',0,.01,0,11.8,.04,10.0);
box('#ead3c7',0,1.6,-5.05,12.25,3.3,.20);box('#ead3c7',-6.04,1.6,0,.20,3.3,10.3);box('#ead3c7',6.04,1.6,0,.20,3.3,10.3);
// Façade côté jardin : deux pans de mur encadrent une vraie ouverture praticable.
box('#ead3c7',-3.60,1.6,5.05,4.89,3.3,.20);box('#ead3c7',3.60,1.6,5.05,4.89,3.3,.20);
box('#f7eee4',-3.35,1.70,5.18,2.4,1.5,.05);box('#a9cbd0',-3.35,1.70,5.23,2.1,1.2,.05);box('#faf9f2',-3.35,1.70,5.27,.07,1.25,.09);
box('#f7eee4',3.35,1.70,5.18,2.4,1.5,.05);box('#a9cbd0',3.35,1.70,5.23,2.1,1.2,.05);box('#faf9f2',3.35,1.70,5.27,.07,1.25,.09);
box('#a57c68',0,2.28,5.10,2.04,.17,.28);box('#d1a896',-.98,1.08,5.10,.15,2.20,.26);box('#d1a896',.98,1.08,5.10,.15,2.20,.26);
box('#f8fbf9',-2.3,1.78,-4.92,2.65,1.45,.04);box('#9ec5cc',-2.3,1.78,-4.89,2.38,1.18,.05);box('#ffffff',-2.3,1.78,-4.85,.06,1.2,.08);box('#ffffff',-2.3,1.78,-4.85,2.4,.06,.08);
box('#f8fbf9',3.9,1.78,-4.92,1.8,1.45,.04);box('#a6ced2',3.9,1.78,-4.89,1.5,1.17,.05);box('#ffffff',3.9,1.78,-4.85,.06,1.2,.08);
// Zone salon (avant gauche)
box('#e4bda7',-3.2,.04,2.2,4.4,.06,3.5);box('#cda88f',-3.95,.40,2.7,2.25,.62,1.25);box('#e2c6b6',-3.95,.76,3.10,2.3,.54,.42);box('#f7e1d2',-4.73,.64,2.65,.35,.45,1.3);box('#f7e1d2',-3.18,.64,2.65,.35,.45,1.3);box('#f0e7d9',-4.35,.75,2.3,.5,.3,.5);box('#ddb4a6',-3.64,.75,2.28,.54,.31,.5);
box('#a77762',-2.2,.35,2.0,1.25,.17,.78);for(let dx of [-.46,.46])for(let dz of [-.26,.26])box('#a77762',-2.2+dx,.18,2+dz,.10,.32,.10);
box('#bd9279',-5.0,.38,.75,.4,.74,.7);box('#42383c',-4.96,.97,.7,.74,.66,.07);fixture('home-entry-flowers','maison',()=>flower(-1.3,3.55));
// Cuisine (fond gauche)
box('#e9b6a2',-3.4,.47,-3.95,4.65,.92,.85);box('#faf2e9',-3.4,.97,-3.95,4.8,.13,.95);box('#e1c9b5',-4.45,1.8,-4.96,2.1,.78,.16);box('#e1c9b5',-2.2,1.8,-4.96,1.6,.78,.16);
box('#a6b9b5',-4.35,1.06,-3.91,.9,.02,.4);box('#75716e',-4.35,1.07,-3.91,.5,.02,.22);for(let xx of [-2.75,-2.05])cyl('#3a3638',xx,1.05,-3.95,.42,.045,.42);
fixture('home-fridge','maison',()=>{box('#d4b7a0',-5.35,1.2,-2.45,1.1,2.4,1.05);box('#f6e5d8',-5.35,1.7,-1.91,.10,.96,.05);box('#ad816f',-5.06,1.30,-1.88,.09,.14,.05)});
// Chambre (fond droit)
box('#ddd1c7',2.9,.06,-3.2,5.4,.07,3.2);box('#bd958f',3.15,.4,-3.55,2.25,.68,2.4);box('#ece2d7',3.15,.78,-3.55,2.08,.16,2.24);box('#f4d3c0',3.15,.9,-3.1,2.05,.24,1.4);box('#fef8ee',2.6,.91,-4.43,.76,.19,.46);box('#fef8ee',3.52,.91,-4.43,.76,.19,.46);box('#9f766a',3.15,.96,-4.79,2.5,1.1,.23);
box('#b38b76',5.22,.35,-3.7,.86,.7,.7);flower(5.2,-3.75);fixture('home-wardrobe','maison',()=>{box('#cab2a4',1.2,.86,-3.5,.7,1.74,1.65);box('#927766',1.64,1.02,-3.45,.05,.25,.10)});
// Coin détente et salle d'eau (avant droit)
box('#d6e1da',3.7,.035,2.75,4,.06,3.5);box('#e7f0ec',5.0,.11,3.28,1.65,.23,1.35);box('#d3ddd5',5,.45,3.28,1.65,.58,1.35);box('#fefdfa',5,.6,3.28,1.28,.34,1.08);box('#d3d8d4',5.78,1.08,3.28,.08,1.2,1.24);cyl('#abb9b8',5.27,.85,3.27,.08,.28,.08);box('#e7ece5',3.15,.32,3.72,1.0,.58,.8);box('#a6b8b5',3.15,.68,3.72,.8,.13,.6);box('#efe9df',2.4,.05,2.2,.6,.05,.8);
// Espace repas central
box('#e2c3a9',.18,.78,.53,1.8,.17,1.32);for(let dx of [-.7,.7])for(let dz of [-.46,.46])box('#a58373',.18+dx,.38,.53+dz,.12,.65,.12);
for(let xx of [-1.20,1.48]){box('#ad8d78',xx,.48,.5,.40,.16,.58);box('#ad8d78',xx,.87,.2,.40,.66,.15)}cyl('#e8c5a1',.18,.94,.53,.40,.09,.40);ball('#d89279',.18,1.10,.53,.18,.17,.18);
// Lampes, ornements, terrain
for(let x of [-5.25,5.25])for(let z of [-4.6,4.5])cyl('#b3c5a9',x,.1,z,.24,.15,.24);flower(5.6,.8);flower(-5.5,4.1);
for(let z=-11;z<12;z+=2.2){ball('#87b88a',-10,.8,z,1,1.7,1);ball('#91be93',10,.75,z,1,1.5,1)}

// Retain the original house meshes; the two new homes share its proven interior.
const houseTemplate=scene.filter(o=>Math.abs(o.m[12])<6.4&&Math.abs(o.m[14])<5.4&&Math.abs(o.m[0])<13&&Math.abs(o.m[10])<11);
for(const o of houseTemplate)o.homeId='soleil';
// === V0.2 : le jardin et la rue ===
// Relief volontairement léger pour rester fluide sur Safari iOS.
box('#9fca98',0,-.35,13,35,.34,40);
// Chemin continu depuis l'entrée vers la rue.
box('#edd9be',0,-.025,10.45,2.35,.075,11.0);
for(let z=5.75;z<=14.6;z+=1.15)box('#e2c7a8',0,.021,z,2.02,.023,.12);
// Terrasse
box('#d6bda5',0,.014,6.15,5.5,.08,2.1);
box('#f8eade',-3.6,.07,6.15,1.25,.07,1.10);
box('#b48e77',-3.6,.43,6.15,1.36,.13,1.10);
for(let xx of [-4.12,-3.08])for(let zz of [5.80,6.50])box('#a47d67',xx,.23,zz,.11,.35,.11);
// Délimitations du jardin, avec un portail central accessible.
for(let side of [-1,1]){
 const x=side*9.2;
 for(let z=6.1;z<=15.4;z+=1.2)cyl('#e9ddc6',x,.56,z,.14,1.15,.14);
 box('#e1d1b8',x,.62,10.65,.13,.12,9.55);
 box('#e1d1b8',x,.35,10.65,.13,.10,9.55);
}
for(let side of [-1,1]){
 const span=7.6,cx=side*5.5;
 box('#e1d1b8',cx,.59,15.55,span,.11,.13);
 box('#e1d1b8',cx,.33,15.55,span,.10,.13);
 for(let x=Math.min(cx-3.7,cx+3.7);x<cx+3.7;x+=1.25)cyl('#e9ddc6',x,.56,15.55,.14,1.14,.14);
}
// Haies, fleurs et allée latérale.
for(let x of [-7.8,7.8])for(let z of [7.3,9.7,12.1,14.3])ball('#7faa7e',x,.60,z,.85,1.1,.86);
for(let x of [-6.3,-4.6,4.7,6.2])for(let z of [8.4,12.7]){
 ball('#5b9a66',x,.28,z,.36,.30,.36);
 for(let a=0;a<5;a++){let angle=a*2*PI/5;ball(a%2?'#f6d3ad':'#f1b8bc',x+Math.cos(angle)*.2,.6,z+Math.sin(angle)*.2,.15,.16,.15)}
}
// Arbre ombragé à droite.
cyl('#896748',6.7,1.1,10.5,.36,2.25,.36);
ball('#78af78',6.7,2.85,10.5,1.50,1.28,1.50);
ball('#88bb85',5.85,2.65,10.7,.87,1.02,.9);
// Banc de jardin et petit arrosoir.
box('#b99174',-5.9,.55,10.2,2.0,.16,.63);
box('#b99174',-5.9,1.01,10.52,2.0,.77,.15);
for(let x of [-6.65,-5.15])box('#8d7867',x,.27,10.23,.15,.54,.15);
cyl('#85aca2',4.0,.21,12.0,.31,.37,.30);
// Trottoir + route et éléments d'un premier quartier.
box('#d4d1c8',0,-.015,17.05,34,.13,2.8);
box('#8e939a',0,-.045,21.35,34,.12,6.7);
box('#d4d1c8',0,-.015,25.25,34,.13,1.6);
for(let x=-15;x<=15;x+=4)box('#f7ecd0',x,.025,21.35,1.9,.012,.14);
// Lampadaires et arbres de rue.
for(let x of [-12.7,12.7]){
 cyl('#6c7779',x,1.53,17.0,.10,3.05,.10);
 ball('#f4e2a7',x,3.13,17.0,.33,.29,.33);
 cyl('#88694b',x,1.10,25.8,.33,2.10,.33);
 ball('#77aa77',x,2.77,25.8,1.25,1.18,1.2);
}
// Boîte aux lettres et enseigne d'accueil.
box('#b39a82',2.85,.77,14.37,.12,1.52,.12);
box('#efd5c7',2.85,1.47,14.37,.64,.39,.42);
box('#b6897e',2.85,1.64,14.37,.68,.08,.45);

// Continuous quarter: open fronts with walkable doors; walls are shared with collision data.
const quarterBarriers=[];
// These existing tall pieces had no matching collision in the earlier house.
for(const f of foregroundFixtures.filter(f=>['home-fridge','home-wardrobe'].includes(f.id)))quarterBarriers.push([f.bounds.min[0],f.bounds.max[0],f.bounds.min[2],f.bounds.max[2]]);
function solid(x,y,z,w,h,d,color){box(color,x,y,z,w,h,d);quarterBarriers.push([x-w/2,x+w/2,z-d/2,z+d/2]);}
box('#a9c89c',0,-.24,29,65,.3,35);
box('#8e939a',0,-.045,21.35,64,.12,6.7);box('#d4d1c8',0,-.015,17,64,.13,2.8);box('#d4d1c8',0,-.015,25,64,.13,2);
for(let x=-29;x<=29;x+=4)box('#f7ecd0',x,.025,21.35,1.9,.012,.14);
for(let x of [-22,-9,9,22])for(let z of [17,25]){cyl('#6c7779',x,1.6,z,.07,3.2,.07);ball('#ffe4ac',x,3.2,z,.22,.24,.22)}
for(let z=18.4;z<24.5;z+=.85)box('#f9efdd',0,.03,z,2.4,.02,.4);
function building(cx,color){
 box('#f5e6d2',cx,.01,30,9,.08,8);box('#d9c1a8',cx,.06,30,8.6,.03,7.6);
 solid(cx-4.5,1.5,30,.2,3,8,color);solid(cx+4.5,1.5,30,.2,3,8,color);solid(cx,1.5,34,9,3,.2,color);
 solid(cx-2.9,1.5,26,3.2,3,.2,color);solid(cx+2.9,1.5,26,3.2,3,.2,color);
 box('#957a68',cx,2.95,26,9.4,.18,.55);box('#b58e77',cx,2.4,26,2.55,.12,.35);
 for(let side of [-1,1]){box('#abcbd0',cx+side*2.9,1.7,25.85,2,1.3,.06);box('#fff3e1',cx+side*2.9,1.7,25.8,.06,1.3,.08)}
}
building(-12,'#e4b7a5');building(12,'#c4cbb6');
// Café: counter, machine, tables and chairs.
fixture('cafe-counter','café',()=>{solid(-12,.5,32.7,7,1,.85,'#bb8c73');box('#f9eee0',-12,1.07,32.7,7.2,.12,1);box('#56575a',-14,1.4,32.7,.9,.6,.55);cyl('#e9cda6',-12,1.2,32.5,.17,.22,.17)});
for(let x of [-14.5,-9.5]){fixture('cafe-table-'+x,'café',()=>{solid(x,.75,29,1.4,.1,1.4,'#b58b6e');cyl('#9f7d65',x,.38,29,.12,.7,.12);flower(x,29)});for(let z of [28,30])fixture('cafe-chair-'+x+'-'+z,'café',()=>{box('#d2aa86',x,.4,z,.55,.12,.5);box('#c8a382',x,.72,z+(z>29?.2:-.2),.55,.7,.08)})}
// Shop shelves are solid, leaving a wide central aisle.
for(let x of [8.5,15.5])fixture('shop-shelf-'+x,'épicerie',()=>{solid(x,.8,30,.6,1.6,5,'#b6987e');for(let z=28;z<=32;z++)for(let y of [.6,1.2,1.8]){box('#f5dec0',x,y,z,.7,.08,.75);ball(z%2?'#b27a66':'#dcb571',x,y+.18,z,.16,.18,.18)}});
fixture('shop-counter','épicerie',()=>{solid(12,.5,33,3,1,.8,'#b79776');box('#f5eee0',12,1.06,33,3.2,.12,1)});
// Park paths, benches, pond, and a decorative residential block.
box('#e5d5b8',0,.02,36,7,.06,18);box('#e5d5b8',0,.03,39,49,.07,2);
for(let x of [-23,-18,18,23])for(let z of [30,36,43]){solid(x,1.1,z,.55,2.2,.55,'#88694b');ball('#80ab77',x,3,z,1.6,1.6,1.5);ball('#a0bd80',x+.8,3.3,z,.85,1,.9)}
for(let x of [-6,6]){solid(x,.5,40,2,.15,.7,'#b99174');box('#b99174',x,.9,40.3,2,.8,.12);for(let dx of [-.8,.8])box('#796658',x+dx,.25,40,.1,.5,.55)}
solid(0,.13,43,3.8,.25,2.2,'#b9c9bb');box('#99c4cb',0,.28,43,3.5,.03,1.9);
for(let x of [-27,27]){
 box('#efdfce',x,.03,8,7,.10,7);solid(x-3.5,1.5,8,.18,3,7,'#e2c9b1');solid(x+3.5,1.5,8,.18,3,7,'#e2c9b1');solid(x,1.5,4.5,7,3,.18,'#e2c9b1');for(let side of [-1,1])solid(x+side*2.3,1.5,11.5,2.4,3,.18,'#e2c9b1');
 for(let dx of [-2,2])box('#a8c7ce',x+dx,1.7,11.6,1.3,1.3,.1);
 solid(x-1.8,.43,7,1.5,.75,2.2,'#c0a995');box('#f7e8d7',x-1.8,.85,7,1.45,.12,2.1);box('#ebccb8',x-1.8,.95,6.3,1.1,.2,.4);
 solid(x+2,.4,9.7,1.4,.7,.8,'#a6b5aa');box('#a6b5aa',x+2,.8,10.0,1.4,.7,.18);
 solid(x+1.7,.5,5.2,2,1,.6,'#ccae98');flower(x+1.7,5.2);box('#ddc4a7',x,2.65,4.65,1.5,.6,.05);
}
// Nursery corners, ceremony arbor and interior accents.
for(let x of [3.9,5.1]){solid(x,.39,-.5,.95,.72,1.15,'#e4cbb4');box('#f6ebdf',x,.76,-.5,.81,.13,1.02);for(let side of [-1,1])for(let z=-.95;z<.1;z+=.25)cyl('#a7826b',x+side*.43,.88,z,.018,.32,.018)}
for(let x of [-1.5,1.5]){cyl('#eadcc2',x,1.5,39,.08,3,.08);flower(x,39)}box('#eadcc2',0,3.02,39,3.2,.12,.12);for(let x=-1.4;x<1.5;x+=.4)ball('#dfb6ac',x,2.98,39,.14,.17,.13);
box('#d5b3a0',-5.92,2.1,-.5,.035,1.1,1.5);box('#f2e5ce',-5.89,2.1,-.5,.04,.85,1.25);ball('#d2ad8f',-5.84,2.1,-.5,.03,.27,.3);
for(let z=-4.8;z<4.8;z+=.7)box('#dcc4ad',0,.035,z,11.7,.012,.022);

// Everyday accents: a real book corner, larger TV frames and café details.
fixture('home-library','maison',()=>{solid(-1.1,1,-1.8,.95,1.9,.24,'#b49a80');
for(let y of [.5,1,1.5]){box('#f1e2ce',-1.1,y,-1.62,1,.045,.3);for(let i=0;i<5;i++)box(['#b98499','#8faaa0','#d0ac77'][i%3],-1.45+i*.17,y+.16,-1.62,.11,.28+(i%2)*.07,.18)}});
box('#42383c',-4.96,1.06,.71,1.24,.73,.08);
for(let x of [-27,27]){box('#42383c',x+2,1.05,8.74,1.23,.73,.07);box('#ad8d78',x+2,.45,8.74,1.38,.85,.32)}
box('#42383c',-12,1.7,33.9,1.24,.73,.07);
for(let x of [-14.5,-9.5]){const start=scene.length;cyl('#fff0db',x-.42,.87,29.22,.13,.025,.13);cyl('#dcc4a4',x-.42,.96,29.22,.055,.15,.055);ball('#c2955e',x+.3,.86,28.7,.1,.04,.06);for(const o of scene.slice(start))o.foreground='cafe-table-'+x}
const counterDetailStart=scene.length;box('#d8b788',-15,1.35,32.5,.75,.5,.2);box('#ecd2b2',-15,1.08,32.5,.85,.025,.3);for(const o of scene.slice(counterDetailStart))o.foreground='cafe-counter';

houseTemplate.length=0;houseTemplate.push(...scene.filter(o=>Math.abs(o.m[12])<6.4&&Math.abs(o.m[14])<5.4&&Math.abs(o.m[0])<13&&Math.abs(o.m[10])<11));for(const o of houseTemplate)o.homeId='soleil';
// Two furnished, walkable homes with the same tested room proportions.
for(const id of ['sauge','rose']){
 const h=Town.houses[id];for(const o of houseTemplate){const m=o.m.slice();m[12]+=h.x;m[14]+=h.z;scene.push({...o,m,homeId:id,foreground:o.foreground?o.foreground+'-'+id:''});}
 for(const f of foregroundFixtures.filter(f=>f.zone==='maison'))foregroundFixtures.push({id:f.id+'-'+id,zone:id,bounds:{min:[f.bounds.min[0]+h.x,f.bounds.min[1],f.bounds.min[2]+h.z],max:[f.bounds.max[0]+h.x,f.bounds.max[1],f.bounds.max[2]+h.z]}});
 box(id==='sauge'?'#adc2b1':'#d9b1ad',h.x,.03,7.6,7.5,.09,5);
 box('#e6d5b8',h.x,.02,12,2,.08,8);
 for(const dx of [-4.6,4.6]){cyl('#a7826b',h.x+dx,.25,7,.32,.5,.32);for(let i=0;i<5;i++)ball(id==='sauge'?'#a4bd91':'#d79ca9',h.x+dx+Math.sin(i)*.18,.7,7+Math.cos(i)*.18,.15,.23,.15);}
}
// Porch and window trim add depth without heavy textures or extra downloads.
for(const [id,h]of Object.entries(Town.houses)){
 const roofStart=scene.length;box('#b48f77',h.x,3.3,h.z,12.7,.16,10.8);for(const o of scene.slice(roofStart)){o.homeId=id;o.roof=true;}
 for(const dx of [-5.5,5.5]){cyl('#a4876e',h.x+dx,1.9,5.25,.045,1.25,.045);ball('#789b75',h.x+dx,1.25,5.25,.27,.3,.25);}
}
// A terrace provides eight separate breakfast/lunch seats for the residents.
box('#dccab3',-21,.03,27.5,4.4,.08,3.6);
for(const x of [-20,-22,-18.2]){solid(x,.75,27.5,1.25,.1,1.25,'#b58b6e');cyl('#997d65',x,.37,27.5,.09,.7,.09);flower(x,27.5);for(const z of [26.5,28.5]){box('#c9ad8e',x,.4,z,.55,.12,.5);box('#c9ad8e',x,.72,z+(z>27.5?.2:-.2),.55,.7,.08);}}
// Gardener's visible work stations and colourful, accessible flower beds.
box('#b79476',10,.47,36,1,.9,.6);box('#d6c6ac',10,.98,36,1.1,.09,.7);
for(const x of [-11.2,11.2]){box('#b6a485',x,.18,38,1.2,.35,3);for(let z=37;z<=39;z+=.5){ball('#789866',x,.44,z,.23,.3,.23);ball(z%1?'#dca5b3':'#edcd8b',x,.72,z,.2,.17,.2);}}
box('#b39780',1.8,.46,17.1,.85,.8,.35);box('#f0dbbd',1.8,1,17.1,1.1,.25,.13);
