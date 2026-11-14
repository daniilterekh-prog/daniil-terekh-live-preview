(function(root){
 'use strict';
 const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
 const smooth=(a,b,n)=>{const t=clamp((n-a)/(b-a));return t*t*(3-2*t);};
 function sceneState(width,height,progress,reduced=false,scale=1){
  const w=Math.max(0,Number.isFinite(width)?width:0),h=Math.max(0,Number.isFinite(height)?height:0);
  const p=reduced?1:clamp(progress),travel=smooth(.14,.72,p),focus=smooth(.48,.78,p);
  const r=Math.min(w*.46,h*.46,500*scale),start=-r*1.4-10*scale;
  return {progress:p,cx:start+(w/2-start)*travel,cy:h/2+r*.06*(1-travel),
   rx:r*(.34+.66*travel),ry:r,radius:r,focus,
   questionOpacity:smooth(.32,.56,p),refractionOpacity:(1-smooth(.35,.55,p)),
   caption:smooth(.73,.84,p),textWidth:r*1.5,textHeight:r*1.2};
 }
 if(typeof module==='object'&&module.exports){module.exports={sceneState};return;}
 const section=document.querySelector('#thinking[data-meaning-lens]');
 if(!section)return;
 const sticky=section.querySelector('.thinking-sticky'),stage=section.querySelector('.meaning-visual');
 const main=document.getElementById('mainPage'),request=stage.querySelector('.meaning-request');
 const question=stage.querySelector('.meaning-question'),glass=stage.querySelector('canvas');
 const caption=section.querySelector('.meaning-caption'),hint=section.querySelector('.meaning-hint');
 const media=matchMedia('(prefers-reduced-motion:reduce)');
 const motionButton=section.querySelector('.meaning-motion-control');
 let motionOverride=false;
 const reduced=()=>media.matches&&!motionOverride;
 const context=glass.getContext('2d');
 // Without masks or Canvas the complete, semantic HTML remains visible.
 if(!context||!CSS.supports('mask-image','radial-gradient(black,transparent)'))return;
 const refracted=request.cloneNode(true);refracted.classList.add('meaning-refraction');stage.insertBefore(refracted,question);
 let width=0,height=0,dpr=1,frame=0,visible=false,lastProgress=-1,wideScale=1;
 function ellipse(s,inset=0,dx=0){
  context.beginPath();context.ellipse(s.cx+dx,s.cy,Math.max(.1,s.rx-inset),Math.max(.1,s.ry-inset),0,0,Math.PI*2);
 }
 function draw(s){
  context.clearRect(0,0,width,height);
  if(!s.radius)return;
  const turn=s.rx/s.radius,thickness=(1-turn)*s.radius*.035;
  context.save();
  ellipse(s,0,thickness);context.strokeStyle='rgba(128,151,176,.22)';context.lineWidth=1;context.stroke();
  ellipse(s);context.fillStyle='rgba(90,116,145,.025)';context.fill();
  // The edge has thickness and opposite reflections; the centre stays clear.
  const rim=context.createLinearGradient(s.cx-s.rx,s.cy-s.ry,s.cx+s.rx,s.cy+s.ry);
  rim.addColorStop(0,'rgba(219,232,247,.05)');rim.addColorStop(.19,'rgba(224,237,251,.85)');
  rim.addColorStop(.38,'rgba(119,144,170,.13)');rim.addColorStop(.68,'rgba(119,144,170,.12)');
  rim.addColorStop(.85,'rgba(215,231,249,.66)');rim.addColorStop(1,'rgba(147,173,200,.08)');
  for(let i=14;i>=1;i--){
   ellipse(s,i*.85);context.lineWidth=1.7;context.globalAlpha=.04*(1-i/16);context.strokeStyle=rim;context.stroke();
  }
  context.globalAlpha=1;ellipse(s);context.strokeStyle=rim;context.lineWidth=1.3;context.stroke();
  ellipse(s,3);context.strokeStyle='rgba(175,198,222,.13)';context.lineWidth=.65;context.stroke();
  // A soft specular sweep settles with the scroll, with no idle animation loop.
  const shift=(1-s.focus)*.35;
  for(const [a,b,alpha] of [[3.65+shift,4.65+shift,.72],[.42+shift,1.1+shift,.48]]){
   context.beginPath();context.ellipse(s.cx,s.cy,s.rx,s.ry,0,a,b);
   context.strokeStyle='rgba(226,239,255,'+alpha+')';context.lineWidth=1.7;
   context.shadowColor='rgba(192,218,249,.5)';context.shadowBlur=7;context.stroke();
  }
  context.restore();
 }
 function paint(){
  frame=0;if(!visible||document.hidden||main?.hidden||!width||!height)return;
  const top=root.DTViewport?.top?.()||0,range=Math.max(1,section.offsetHeight-sticky.offsetHeight);
  const progress=reduced()?1:clamp((top-section.getBoundingClientRect().top)/range);
  if(progress===lastProgress)return;lastProgress=progress;
  const s=sceneState(width,height,progress,reduced(),wideScale);
  const aperture='ellipse('+s.rx+'px '+s.ry+'px at '+s.cx+'px '+s.cy+'px)';
  const mask='radial-gradient(ellipse '+s.rx+'px '+s.ry+'px at '+s.cx+'px '+s.cy+'px,transparent calc(100% - 1px),#000 100%)';
  request.style.maskImage=mask;request.style.webkitMaskImage=mask;
  question.style.clipPath=aperture;refracted.style.clipPath=aperture;
  question.style.opacity=String(s.questionOpacity);refracted.style.opacity=String(s.refractionOpacity);
  const content=question.firstElementChild;
  content.style.filter=s.focus<1?'blur('+((1-s.focus)*3.2)+'px)':'none';
  content.style.transform='scale('+(1+(1-s.focus)*.045)+')';
  if(caption){caption.style.opacity=String(s.caption);caption.style.transform='translateY('+((1-s.caption)*8)+'px)';}
  hint.style.opacity=String(1-smooth(.08,.24,progress));
  section.dataset.orbit=progress<.14?'inputs':progress<.4?'focus':progress<.84?'passage':'clarity';
  section.dataset.meaningProgress=progress.toFixed(4);
  draw(s);
 }
 function queue(){
  if(visible&&!document.hidden&&!main?.hidden&&!frame)frame=requestAnimationFrame(paint);
 }
 function measure(){
  if(main?.hidden)return;
  const top=root.DTViewport?.top?.()||0;
  sticky.style.top=top+'px';
  const rect=stage.getBoundingClientRect();width=rect.width;height=rect.height;
  if(!width||!height)return;
  wideScale=root.DTViewport?.scale?.()||1;
  const final=sceneState(width,height,1,false,wideScale);
  stage.style.setProperty('--meaning-type',final.radius*.16+'px');
  stage.style.setProperty('--meaning-radius',final.radius+'px');
  stage.style.setProperty('--meaning-copy-width',final.textWidth+'px');
  dpr=Math.min(devicePixelRatio||1,2,Math.sqrt(2500000*Math.min(4,wideScale*wideScale)/Math.max(1,width*height)));
  glass.width=Math.round(width*dpr);glass.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);
  const travel=reduced()?0:Math.round((root.DTViewport?.height?.()||innerHeight)*(width<600?1.55:1.8));
  section.style.minHeight=(sticky.offsetHeight+travel)+'px';
  section.dataset.meaningReady='true';section.dataset.meaningStatic=String(reduced());
  if(motionButton){motionButton.hidden=!media.matches;motionButton.setAttribute('aria-pressed',String(motionOverride));motionButton.textContent=motionOverride?motionButton.dataset.disable:motionButton.dataset.enable;}
  lastProgress=-1;queue();
 }
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}else queue();},{rootMargin:'100px'}).observe(section);
 new ResizeObserver(measure).observe(stage);
 root.addEventListener('scroll',queue,{passive:true});
 root.addEventListener('resize',measure,{passive:true});
 root.addEventListener('hashchange',()=>{lastProgress=-1;measure();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;}else{lastProgress=-1;queue();}});
 media.addEventListener('change',()=>{motionOverride=false;measure();});
 motionButton?.addEventListener('click',()=>{motionOverride=!motionOverride;measure();});
 if(main)new MutationObserver(()=>{if(main.hidden&&frame){cancelAnimationFrame(frame);frame=0;}else measure();}).observe(main,{attributes:true,attributeFilter:['hidden']});
 if(document.fonts)document.fonts.ready.then(measure);
 measure();
})(globalThis);
