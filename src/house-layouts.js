/* Interior partitions belong to their own home and have matching collision boxes. */
const familyPartitions=Housing.extraSolids.rose;
for(const b of familyPartitions){const h=Town.houses.rose,x=h.x+(b[0]+b[1])/2,z=(b[2]+b[3])/2,start=scene.length;
 fixture('family-wall-'+start,'rose',()=>{box('#dfc5b8',x,1.35,z,b[1]-b[0],2.7,b[3]-b[2]);box('#b49985',x,.10,z,b[1]-b[0],.12,b[3]-b[2]+.025);});
 for(const o of scene.slice(start))o.homeId='rose';quarterBarriers.push([b[0]+h.x,b[1]+h.x,b[2],b[3]]);
}
// Nursery bedding, wall art, rug and toys distinguish this room from the adult bedroom.
{const h=Town.houses.rose,start=scene.length;
 box('#dcc8b0',h.x+4.2,.04,.73,1.7,.02,.9);
 for(const [x,z,color]of [[3.7,.8,'#c18f86'],[4.3,.95,'#8ba693'],[4.7,.7,'#d0b477']]){add('soft',color,h.x+x,.11,z,.13,.13,.13);}
 box('#ecdcca',h.x+5.9,1.68,.5,.025,.7,.66);box('#b9cbb5',h.x+5.87,1.68,.5,.02,.55,.5);
 for(const o of scene.slice(start))o.homeId='rose';
}
// An actual desk and shelving occupy an otherwise unused corner of Maison Sauge.
{const h=Town.houses.sauge,start=scene.length;box('#ad947b',h.x-3.8,.78,-1.2,1.35,.08,.55);for(const x of [-4.3,-3.3])box('#8f7a65',h.x+x,.37,-1.2,.07,.74,.5);box('#f2e8cf',h.x-3.8,.83,-1.2,.35,.02,.23);
 for(const o of scene.slice(start))o.homeId='sauge';quarterBarriers.push([h.x-4.475,h.x-3.125,-1.475,-.925]);
}
for(const [id,h]of Object.entries(Town.houses)){
 const tv='home-tv-'+id;for(const o of scene)if(o.homeId===id&&Math.abs(o.m[12]-h.x+4.96)<.1&&Math.abs(o.m[14]-.7)<.1)o.foreground=tv;
 foregroundFixtures.push({id:tv,zone:id==='soleil'?'maison':id,bounds:{min:[h.x-5.6,0,.3],max:[h.x-4.3,1.45,1.1]}});
 const start=scene.length;cyl('#a78b69',h.x+.18,2.82,.53,.014,.62,.014);cyl('#ead5b4',h.x+.18,2.45,.53,.22,.16,.22);ball('#ffe4ac',h.x+.18,2.34,.53,.12,.08,.12);for(const o of scene.slice(start))o.homeId=id;
}
// The original TV cabinet lacked a world collision. The root home collider is
// copied to the other two homes by the existing world collision builder.
quarterBarriers.push([-5.24,-4.76,.38,1.13]);
for(const [id,h]of Object.entries(Town.houses))for(let i=0;i<2;i++)for(const o of scene){const color=o.color.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');if(o.homeId===id&&Math.abs(o.m[12]-h.x-(3.9+i*1.2))<.5&&o.m[14]>=-1.1&&o.m[14]<.11&&['e4cbb4','f6ebdf','a7826b'].includes(color))o.nursery=i;}
// Small beds for the two neighbouring children use the same compact footprint.
for(const x of [28.3,-25.7]){box('#b49a80',x,.34,7.3,.94,.25,1.14);add('soft','#e6dbc9',x,.50,7.3,.86,.13,1.06);add('soft','#aec0ad',x,.58,7.48,.84,.06,.62);add('soft','#f1e6d0',x,.585,6.92,.58,.09,.26);quarterBarriers.push([x-.475,x+.475,6.725,7.875]);}
