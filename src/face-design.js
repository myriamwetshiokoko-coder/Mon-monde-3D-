/* Stable, optional personal features; imported old characters keep neutral settings. */
const FaceDesign=(()=>{
 const defaults={jaw:0,nose:0,lips:0,brows:0,makeup:0,accessory:0};
 function normalize(raw){const out={};for(const [k,v]of Object.entries(defaults)){const n=Number(raw?.[k]);out[k]=Number.isFinite(n)?Math.max(k==='makeup'||k==='accessory'?0:-1,Math.min(k==='accessory'?3:1,n)):v;}out.accessory=Math.round(out.accessory);return out;}
 function expression(pose,phase){const t=((phase/5)%6+6)%6,blink=t>5.82?Math.sin((t-5.82)/.18*Math.PI):0;return {blink,speech:pose==='talk'?.5+.5*Math.sin(phase*1.8):pose==='eat'?Math.max(0,Math.sin(phase*.65)):0,smile:['talk','watch'].includes(pose)?.35:0};}
 return {defaults,normalize,expression};
})();
if(typeof module!=='undefined')module.exports=FaceDesign;
