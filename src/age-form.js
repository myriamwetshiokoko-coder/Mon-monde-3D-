/* Anatomical age groups share stable joint names, not a scaled adult silhouette. */
const AgeForm=(()=>{
 const adult=[0,.535,.932,1.055,1.291,1.485,1.55,4],child=[0,.445,.815,.930,1.180,1.375,1.440,3.890];
 function map(y,from,to){let i=0;while(i<from.length-2&&y>from[i+1])i++;return to[i]+(y-from[i])*(to[i+1]-to[i])/(from[i+1]-from[i]);}
 const toChild=y=>map(y,adult,child),toAdult=y=>map(y,child,adult);
 function slope(y){let i=0;while(i<adult.length-2&&y>adult[i+1])i++;return (child[i+1]-child[i])/(adult[i+1]-adult[i]);}
 const key=(sex,age=24)=>age<3?'baby'+(sex==='male'?'Male':'Female'):age<13?'child'+(sex==='male'?'Male':'Female'):age>=60?'senior'+(sex==='male'?'Male':'Female'):sex==='male'?'male':'female';
 return {toChild,toAdult,slope,key};
})();
if(typeof module!=='undefined')module.exports=AgeForm;
