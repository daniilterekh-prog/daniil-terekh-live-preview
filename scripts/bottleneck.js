(function(root){
 'use strict';
 const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
 const smooth=(a,b,n)=>{const t=clamp((n-a)/(b-a));return t*t*(3-2*t);};
 function sceneState(progress){const p=clamp(progress);return {progress:p,opening:smooth(.12,.9,p),focus:smooth(.16,.3,p)*(1-smooth(.8,1,p)*.65),stage:p<.24?0:p<.65?1:2};}
 function scrollTravel(height){return Math.round(Math.max(160,Math.min(280,(Number.isFinite(height)?height:700)*.34)));}
 function createFlow(){const crossings=new Map();for(let i=-8;i<=0;i++)crossings.set(i,i/.85);return {time:0,flux:0,crossings};}
 function advanceFlow(flow,delta,opening){
  const dt=Math.max(0,Math.min(.05,Number.isFinite(delta)?delta:0)),rate=.85+3.65*clamp(opening),old=flow.flux;
  flow.time+=dt;flow.flux+=rate*dt;
  for(let i=Math.floor(old)+1;i<=Math.floor(flow.flux);i++)flow.crossings.set(i,flow.time-(flow.flux-i)/rate);
  for(const [i,t] of flow.crossings)if(flow.time-t>20)flow.crossings.delete(i);
  return flow;
 }
 function particleState(flow,index,opening=0){
  const r=flow.flux-index,departure=flow.crossings.get(index);let s;
  if(r>=0){if(departure===undefined)s=2;else{const dt=Math.max(0,flow.time-departure),tau=.22;s=.365+.18*(dt-tau*(1-Math.exp(-dt/tau)))+.012*tau*(1-Math.exp(-dt/tau));}}
  else s=r>=-8?.365+r/68:.365-8/68+(r+8)/18.2;
  const open=clamp(opening),spread=Math.min(1,Math.abs(s-.365)/.055),straight=.365+r/18;
  s+=(straight-s)*open;
  return {s,lane:((index%3+3)%3)-1,spread:spread+(1-spread)*open,opacity:clamp(Math.min(s/.025,(1-s)/.025))};
 }
 if(typeof module==='object'&&module.exports){module.exports={sceneState,scrollTravel,createFlow,advanceFlow,particleState};return;}
 const section=document.querySelector('#the-edit[data-bottleneck]');if(!section)return;
 const sticky=section.querySelector('.bottleneck-sticky'),visual=section.querySelector('.bottleneck-visual'),canvas=visual.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
 const main=document.getElementById('mainPage'),media=matchMedia('(prefers-reduced-motion:reduce)'),button=section.querySelector('.bottleneck-motion');
 const caption=section.querySelector('.bottleneck-caption'),copies=Array.from(section.querySelectorAll('[data-bottleneck-copy]')),controls=Array.from(section.querySelectorAll('[data-bottleneck-stage]'));
 const flow=createFlow();let width=0,height=0,dpr=1,frame=0,lastTime=null,opening=null,visible=false,paused=false,override=false,lastStage=-1;
 const reduced=()=>media.matches&&!override;
 const active=()=>visible&&!document.hidden&&!main?.hidden;
 const moving=()=>!paused&&!reduced();
 const progress=()=>reduced()?1:clamp(((root.DTViewport?.top?.()||0)-section.getBoundingClientRect().top)/Math.max(1,section.offsetHeight-sticky.offsetHeight));
 function draw(state){
  ctx.clearRect(0,0,width,height);const mobile=width<600,axis=mobile?width*.79:height*.55,start=mobile?height*.035:width*.03,L=mobile?height*.93:width*.94;
  const wide=mobile?Math.min(width*.115,48):Math.min(height*.19,70),G=L*.365,throat=wide*(.28+.72*state.opening);
  const point=(s,y)=>mobile?[axis+y,start+s]:[start+s,axis+y];
  const path=(pts,color,lineWidth)=>{ctx.beginPath();pts.forEach((v,i)=>{const p=point(v[0],v[1]);i?ctx.lineTo(...p):ctx.moveTo(...p);});ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.lineCap='round';ctx.stroke();};
  // A substantial clear conduit: body shading and separated polished edges.
  const body=[point(0,-wide),point(G-L*.09,-wide),point(G,-throat),point(G+L*.09,-wide),point(L,-wide),point(L,wide),point(G+L*.09,wide),point(G,throat),point(G-L*.09,wide),point(0,wide)];
  ctx.beginPath();body.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.closePath();
  const bodyShade=mobile?ctx.createLinearGradient(axis-wide,0,axis+wide,0):ctx.createLinearGradient(0,axis-wide,0,axis+wide);
  bodyShade.addColorStop(0,'rgba(225,226,222,.10)');bodyShade.addColorStop(.12,'rgba(225,226,222,.035)');bodyShade.addColorStop(.5,'rgba(225,226,222,.012)');bodyShade.addColorStop(.88,'rgba(225,226,222,.03)');bodyShade.addColorStop(1,'rgba(225,226,222,.12)');ctx.fillStyle=bodyShade;ctx.fill();
  for(const sign of [-1,1]){
   const pts=[[0,sign*wide],[G-L*.09,sign*wide],[G,sign*throat],[G+L*.09,sign*wide],[L,sign*wide]];
   path(pts,'rgba(227,228,224,.025)',15);path(pts,'rgba(227,228,224,.08)',5);path(pts,'rgba(227,228,224,.65)',1.1);
   const back=pts.map(v=>[v[0],v[1]+sign*4]);path(back,'rgba(190,192,185,.16)',.6);
   const extent=wide*.82,center=throat+extent/2,at=point(G,sign*center),thick=mobile?11:13;
   const x=at[0]-(mobile?extent:thick)/2,y=at[1]-(mobile?thick:extent)/2,w=mobile?extent:thick,h=mobile?thick:extent;
   const metal=ctx.createLinearGradient(x,y,x+w,y+h);metal.addColorStop(0,'#4b4d47');metal.addColorStop(.13,'#e5e6df');metal.addColorStop(.22,'#7f8278');metal.addColorStop(.72,'#353831');metal.addColorStop(.90,'#aeb3a5');metal.addColorStop(1,'#575b51');ctx.fillStyle=metal;ctx.fillRect(x,y,w,h);
   ctx.strokeStyle='rgba(240,241,234,.4)';ctx.lineWidth=.6;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
   const a=point(G-L*.018,sign*(throat+extent*.5));path([[G-L*.018,sign*(throat+extent*.5)],[G-L*.01,sign*(throat+extent*.5)]],'rgba(237,238,231,'+(state.focus*.7)+')',1.2);
  }
  const radius=mobile?Math.max(2.7,Math.min(4,width*.009)):Math.max(2.4,Math.min(4,width*.0035));
  for(let i=Math.floor(flow.flux)-14;i<=Math.ceil(flow.flux)+18;i++){
   const p=particleState(flow,i,state.opening);if(!p||!p.opacity)continue;
   const at=point(p.s*L,p.lane*wide*.35*p.spread),halo=ctx.createRadialGradient(...at,0,...at,radius*3.1);
   halo.addColorStop(0,'rgba(222,224,215,'+(.18*p.opacity)+')');halo.addColorStop(1,'rgba(222,224,215,0)');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(...at,radius*3.1,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='rgba(241,242,235,'+(.94*p.opacity)+')';ctx.beginPath();ctx.arc(...at,radius,0,Math.PI*2);ctx.fill();
  }
 }
 function paint(now){
  frame=0;if(!active()||!width||!height){lastTime=null;return;}
  const state=sceneState(progress());
  const dt=lastTime===null?0:Math.max(0,Math.min(.05,(now-lastTime)/1000));
  if(opening===null||lastTime===null||!moving())opening=state.opening;
  else {opening+=(state.opening-opening)*(1-Math.exp(-dt/.09));if(Math.abs(state.opening-opening)<.0005)opening=state.opening;}
  state.opening=opening;
  if(moving()&&lastTime!==null)advanceFlow(flow,dt,state.opening);lastTime=now;
  section.style.setProperty('--bottleneck-focus',String(state.focus));section.dataset.bottleneckProgress=state.progress.toFixed(4);section.dataset.bottleneckOpening=state.opening.toFixed(4);
  section.dataset.bottleneckFlow=String(moving());
  if(state.stage!==lastStage){lastStage=state.stage;caption.textContent=copies[state.stage].textContent;controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===state.stage)));}
  section.classList.toggle('bottleneck-resolved',state.opening>.85);draw(state);
  if(moving())frame=requestAnimationFrame(paint);
 }
 function queue(){if(active()&&!frame)frame=requestAnimationFrame(paint);}
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;lastTime=null;}
 function measure(){
  if(main?.hidden)return;sticky.style.top=(root.DTViewport?.top?.()||0)+'px';
  const r=visual.getBoundingClientRect();width=r.width;height=r.height;if(!width||!height)return;
  dpr=Math.min(devicePixelRatio||1,2,Math.sqrt(2200000/(width*height)));canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  section.style.minHeight=(sticky.offsetHeight+(reduced()?0:scrollTravel(root.DTViewport?.height?.()||innerHeight)))+'px';
  section.dataset.bottleneckReady='true';section.dataset.bottleneckStatic=String(reduced());
  button.textContent=moving()?button.dataset.pause:button.dataset.play;button.setAttribute('aria-pressed',String(moving()));queue();
 }
 controls.forEach((b,i)=>{
  b.addEventListener('click',()=>{const p=[0,.42,1][i],top=root.DTViewport?.top?.()||0,target=scrollY+section.getBoundingClientRect().top-top+(section.offsetHeight-sticky.offsetHeight)*p;if(reduced()){lastStage=-1;caption.textContent=copies[i].textContent;controls.forEach((c,j)=>c.setAttribute('aria-pressed',String(j===i)));return;}if(root.DTScenes)root.DTScenes.goTo(target);else scrollTo({top:target,behavior:'instant'});});
  b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:2))%3;controls[next].focus();controls[next].click();});
 });
 button.addEventListener('click',()=>{if(reduced()){override=true;paused=false;}else paused=!paused;stop();measure();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)queue();else stop();}).observe(sticky);
 new ResizeObserver(measure).observe(visual);
 root.addEventListener('scroll',queue,{passive:true});root.addEventListener('resize',measure,{passive:true});root.addEventListener('hashchange',measure);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else queue();});media.addEventListener('change',()=>{override=false;paused=false;stop();measure();});
 if(main)new MutationObserver(()=>{if(main.hidden)stop();else measure();}).observe(main,{attributes:true,attributeFilter:['hidden']});
 if(document.fonts)document.fonts.ready.then(measure);measure();
})(globalThis);
