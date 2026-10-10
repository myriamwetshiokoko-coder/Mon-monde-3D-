/* Pure input calibration shared by touch handlers and tests. */
const Controls=(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function joystick(x,y,dead=.18){const distance=Math.hypot(x,y);if(distance<=dead)return {x:0,y:0};const strength=Math.pow(clamp((distance-dead)/(1-dead),0,1),1.35);return {x:x/distance*strength,y:y/distance*strength}}
 function ease(dt,rate){return 1-Math.exp(-Math.max(0,dt)*rate)}
 function camera(dx,dy,width,height,sensitivity=.7){return {yaw:clamp(dx,-100,100)/Math.max(1,width)*2.4*sensitivity,pitch:clamp(dy,-100,100)/Math.max(1,height)*1.6*sensitivity}}
 return {joystick,ease,camera};
})();
if(typeof module!=='undefined')module.exports=Controls;
