(function(root){
 const clamp=n=>Math.max(0,Math.min(1,n));
 const smooth=(a,b,p)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t);};
 function flightState(value){
  const p=clamp(value);
  return {progress:p,phase:p<.18?'inputs':p<.38?'focus':p<.84?'passage':'clarity',focus:smooth(.24,.38,p),selectedNoise:1-smooth(.18,.24,p),result:smooth(.76,.84,p),noise:1-smooth(.18,.30,p),scatter:0};
 }
 function flowState(time,index){
  const raw=time/12+(index%10)*.067+Math.floor(index/10)*.5,cycle=Math.floor(raw),t=raw-cycle;
  return {cycle,t,opacity:smooth(0,.07,t)*(1-smooth(.34,.5,t)),dust:smooth(.32,.41,t)*(1-smooth(.46,.55,t)),travel:smooth(0,.5,t)};
 }
 function outputState(time,row){
  const lane=[3,2,1][row],raw=Math.max(0,time)/6+lane*.134,cycle=Math.floor(raw),phase=raw-cycle;
  return {current:cycle%2,next:(cycle+1)%2,mix:smooth(.85,1,phase)};
 }
 const signalVariants=[
  [
   {goal:'ATTRACT QUALIFIED DEMAND.',lines:['ATTRACT QUALIFIED','DEMAND.'],compact:['ATTRACT','QUALIFIED','DEMAND.'],wide:['ATTRACT QUALIFIED','DEMAND.']},
   {goal:'MAKE ACQUISITION PROFITABLE.',lines:['MAKE ACQUISITION','PROFITABLE.'],compact:['MAKE','ACQUISITION','PROFITABLE.'],wide:['MAKE ACQUISITION','PROFITABLE.']}
  ],
  [
   {goal:'IMPROVE ENQUIRY CONVERSION.',lines:['IMPROVE ENQUIRY','CONVERSION.'],compact:['IMPROVE','ENQUIRY','CONVERSION.'],wide:['IMPROVE ENQUIRY','CONVERSION.']},
   {goal:'VALIDATE CUSTOMER DEMAND.',lines:['VALIDATE CUSTOMER','DEMAND.'],compact:['VALIDATE','CUSTOMER','DEMAND.'],wide:['VALIDATE CUSTOMER','DEMAND.']}
  ],
  [
   {goal:'REDUCE CUSTOMER ACQUISITION COST.',lines:['REDUCE CUSTOMER','ACQUISITION COST.'],compact:['REDUCE','CUSTOMER','ACQUISITION','COST.'],wide:['REDUCE CUSTOMER','ACQUISITION COST.']},
   {goal:'CONNECT ENQUIRIES TO REVENUE.',lines:['CONNECT ENQUIRIES','TO REVENUE.'],compact:['CONNECT','ENQUIRIES','TO REVENUE.'],wide:['CONNECT ENQUIRIES','TO REVENUE.']}
  ]
 ];
 function signalPairState(time,row){
  const state=outputState(time,row),variants=signalVariants[row],selected=state.current;
  return {...state,...variants[selected],variants,selected,sourceIndex:[3,2,1][row]+selected*10};
 }
 function phraseGlyphState(phase,position){
  const start=.34+(1-clamp(position))*.1;
  const dissolved=smooth(start,start+.06,phase);
  return {opacity:1-dissolved,dust:Math.sin(dissolved*Math.PI)};
 }
 // Each phrase splits into five vertical glass facets, then resolves as one result.
 function opticalRowState(value,row,compact=false){
  const p=clamp(value),start=.39+row*.125,reveal=smooth(start,start+.12,p);
  return {reveal,distortion:reveal===0||reveal===1?0:Math.sin(reveal*Math.PI)*(compact?.65:1),settle:smooth(.76,.84,p)};
 }
 function opticalSliceState(reveal,index,count=5,compact=false){
  const delay=index*.022,t=clamp((reveal-delay)/(1-(count-1)*.022));
  const split=Math.sin(t*Math.PI),fold=Math.abs(Math.cos(t*Math.PI));
  const direction=(index-(count-1)/2)/Math.max(1,(count-1)/2);
  return {target:t>=.5,dx:direction*split*(compact?8:14),dy:(index-(count-1)/2)*split*(compact?1.5:2),scaleX:fold*fold,scaleY:1+split*.12,split};
 }
 function glassGeometry(width,height,value){
  const p=Math.min(.84,clamp(value)),turn=smooth(.12,.44,p),approach=smooth(.18,.59,p),retreat=smooth(.64,.84,p);
  const compact=width<600,base=Math.min(height*(compact?.28:.30),width*(compact?.46:.30));
  const peak=Math.min(height*.40,width*(compact?.62:.43));
  const originalRy=base+(peak-base)*approach-(peak-base*1.1)*retreat;
  const ry=originalRy*(1+.14*(1-approach)+.08*retreat);
  return {cx:width*(.51+.025*Math.sin(p/.84*Math.PI)-.01*retreat),cy:height*(.57+.01*approach*(1-retreat)-(compact?.06*(1-smooth(.08,.38,p)):0)),ry,rx:originalRy*(.24+turn*.70),depth:base>0?Math.min(width*.025,27)*(1-turn*.7)*(ry/base):0,zoom:1+approach*(compact?.5:.75)-retreat*((compact?.5:.75)-.1),retreat};
 }
 function glassLife(time,value,reduced=false){
  const t=Number.isFinite(time)?Math.max(0,time):0,still={dx:0,dy:0,stretchX:1,stretchY:1,tilt:0,sweep:0,refraction:0};
  if(reduced)return still;
  const settle=1-smooth(.68,.84,clamp(value)),breath=Math.sin(t*.58)*.006*settle;
  if(!settle)return {...still,sweep:Math.sin(t*.39)};
  return {dx:Math.sin(t*.43)*2.5*settle,dy:Math.sin(t*.36)*3.2*settle,stretchX:1+breath,stretchY:1-breath*.45,tilt:Math.sin(t*.31)*.012*settle,sweep:Math.sin(t*.39),refraction:Math.sin(t*.53)*.002*settle};
 }
 const editTravel=height=>Math.max(480,Math.round(height*2.2));
 function editState(value){
  const p=clamp(value),t=p*2/3,remove=smooth(.13,.29,t),order=smooth(.40,.64,t);
  const cluster=[[27,32,38,30,-12,-4],[28,75,39,23,-10,3],[54,61,37,24,-14,-3],[20,7,33,25,-15,4],[4,64,32,27,-12,-6],[0,31,32,26,-13,5],[70,37,29,29,-16,-4],[62,11,31,25,-12,4]];
  const hierarchy=[[6,68,44,28,-12,0],[30,45,35,29,-12,0],[54,22,30,29,-12,0],[76,1,23,28,-12,0]];
  const cards=cluster.map((from,i)=>{
   const to=hierarchy[i]||from,pose={};
   ['x','y','w','h','ry','rz'].forEach((key,j)=>{pose[key]=from[j]+(to[j]-from[j])*order;});
   pose.opacity=i<4?1:(1-remove*.62)*(1-order);
   pose.strike=i<4?0:remove;
   return pose;
  });
  return {progress:p,priority:order,stage:t<.18?0:t<.43?1:2,cards};
 }
 const api={flightState,flowState,outputState,signalPairState,phraseGlyphState,opticalRowState,opticalSliceState,glassGeometry,glassLife,editTravel,editState,smooth};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTLensOrbit=api;
})(globalThis);
