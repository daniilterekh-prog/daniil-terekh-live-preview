(function(){
 'use strict';
 const CHAPTERS=[
  {id:'hero',label:'DANIIL TEREKH'},
  {id:'work',label:'Selected work'},
  {id:'thinking',label:"Найти реальную проблему"},
  {id:'the-edit',label:"Только главное"},
  {id:'skills',label:"Навыки"},
  {id:'human',label:'Still curious'},
  {id:'cycle',label:"Сложное делаем командой."},
  {id:'services',label:"Чем могу помочь?"},
  {id:'contact',label:"Обсудим задачу?"},
  {id:'site-footer',label:'Footer'}
 ];
 const TOLERANCE=8;
 const smootherStep=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
 const navigationDuration=(distance,chapter,soft)=>soft?380:chapter?Math.min(1100,650+Math.abs(distance)*.08):Math.min(700,450+Math.abs(distance)*.1);
 const holdRestWheel=({now,arrivedAt,lastInputAt,direction,distance})=>direction>0&&Math.abs(distance)<=TOLERANCE&&now-arrivedAt<320&&now-lastInputAt<180;
 const READING_PAUSE=680;
 const holdReadingWheel=({now,arrivedAt,lastInputAt,direction,arrivedDirection,distance})=>direction===arrivedDirection&&Math.abs(distance)<=TOLERANCE&&now-arrivedAt<READING_PAUSE&&now-lastInputAt<180;
 function readingOffsets(id,travel,stored,start){
  if(id==='the-edit')return travel>300?[travel/2]:[];
  if(id!=='work')return [];
  try{return JSON.parse(stored||'[]').slice(0,-1).filter(Number.isFinite).map(y=>y-start).filter(y=>y>32&&y<travel-32);}catch{return [];}
 }
 const restOffset=(height,frame,preferred=height-frame)=>Math.max(0,Math.min(Math.max(0,height-frame),Number.isFinite(preferred)?preferred:height-frame));
 function nextTarget(points,y,direction){
  const point=direction>0?points.find(p=>p.y>y+TOLERANCE):[...points].reverse().find(p=>p.y<y-TOLERANCE);
  return point?point.y:null;
 }
 const crossingTarget=(points,y,pixels)=>{const target=nextTarget(points,y,Math.sign(pixels));return target!==null&&Math.abs(target-y)<=Math.abs(pixels)?target:null;};
 if(typeof module==='object'&&module.exports){module.exports={nextTarget,crossingTarget,chapters:CHAPTERS,smootherStep,navigationDuration,holdRestWheel,holdReadingWheel,readingOffsets,restOffset};return;}
 window.DTChapters=CHAPTERS;
 const main=document.getElementById('mainPage');if(!main)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const root=document.documentElement;
 const readingMode=root.lang==='ru';
 const nativeSnap=typeof CSS!=='undefined'&&CSS.supports('scroll-snap-stop','always');
 function syncSnap(){root.classList.toggle('chapter-snapping',nativeSnap&&!main.hidden&&!reduced.matches);}
 let points=[],animation=0,settleTimer=0,settleEligible=false,inputTarget=null,direction=0;
 let measuredWidth=0,measuredHeight=0,measuredHeader=0;
 let gesture=null,touchActive=false,lastScrollY=scrollY,restHold=null,lastWheelAt=-Infinity,restTimer=0,wheelLanding=null;
 const absolute=e=>e.getBoundingClientRect().top+scrollY;
 function measure(){
  if(main.hidden)return;
  const header=window.DTViewport.top?.()||0;
  root.style.setProperty('--chapter-header-offset',header+'px');
  const max=Math.max(0,document.documentElement.scrollHeight-window.DTViewport.height());
  const sections=Array.from(main.children);
  points=CHAPTERS.flatMap(chapter=>{
   const section=sections.find(el=>el.id===chapter.id);if(!section)return [];
   section.dataset.chapterAnchor='true';
   const y=chapter.id==='hero'?0:absolute(section)-header;
   const start={...chapter,y:Math.round(Math.max(0,Math.min(max,y))),ids:[chapter.id],semantic:true};
   const selector={work:'.story-sticky',thinking:'.thinking-sticky','the-edit':'.edit-sticky',cycle:'.cycle-composition'}[chapter.id];
   const frame=selector&&section.querySelector?.(selector);
   if(!frame||typeof document.createElement!=='function')return [start];
   const preferred=chapter.id==='work'?Number(section.dataset.restOffset):undefined;
   const offset=restOffset(section.offsetHeight,frame.offsetHeight,preferred);
   if(offset<=32)return [start];
   let marker=section.querySelector('.scene-rest:not(.scene-reading-rest)');
   if(!marker){marker=document.createElement('span');marker.className='scene-rest';marker.setAttribute('aria-hidden','true');marker.dataset.sceneRest=chapter.id;section.append(marker);}
   marker.style.top=offset+'px';
   const end={id:chapter.id+':end',label:chapter.label+' — complete',y:Math.round(Math.max(0,Math.min(max,absolute(section)+offset-header))),ids:[chapter.id+':end'],semantic:false,rest:true};
   const reading=readingMode?readingOffsets(chapter.id,offset,section.dataset.scrollStops,absolute(section)-header).map((offset,index)=>{
    let marker=section.querySelector('[data-reading-index="'+index+'"]');
    if(!marker){marker=document.createElement('span');marker.className='scene-rest scene-reading-rest';marker.setAttribute('aria-hidden','true');marker.dataset.readingIndex=String(index);section.append(marker);}
    marker.style.top=offset+'px';
    return {id:chapter.id+':reading-'+index,label:chapter.label+' — reading '+(index+1),y:Math.round(Math.max(0,Math.min(max,absolute(section)+offset-header))),ids:[chapter.id+':reading-'+index],semantic:false,rest:true,reading:true};
   }):[];
   return [start,...reading,end];
  }).sort((a,b)=>a.y-b.y);
 }

 function cancel(){
  if(animation)cancelAnimationFrame(animation);
  animation=0;main.removeAttribute('aria-busy');root.classList.remove('chapter-navigating');
 }
 function releaseGesture(){clearTimeout(settleTimer);settleTimer=0;settleEligible=false;gesture=null;touchActive=false;cancel();}
 function moveTo(target,soft=false,arrived=null){
  if(target===null)return;
  cancel();gesture=null;touchActive=false;settleEligible=false;
  target=Math.max(0,Math.min(document.documentElement.scrollHeight-window.DTViewport.height(),target));
  const from=scrollY,start=performance.now(),chapter=points.some(p=>Math.abs(p.y-target)<=TOLERANCE);
  const duration=navigationDuration(target-from,chapter,soft);
  if(Math.abs(target-from)<1)return;
  if(reduced.matches){scrollTo({top:target,behavior:'instant'});return;}
  root.classList.add('chapter-navigating');
  main.setAttribute('aria-busy','true');
  function frame(now){
   const t=Math.min(1,(now-start)/duration),ease=smootherStep(t);
   scrollTo({top:from+(target-from)*ease,behavior:'instant'});
   if(t<1)animation=requestAnimationFrame(frame);
   else {animation=0;main.removeAttribute('aria-busy');root.classList.remove('chapter-navigating');if(arrived)arrived();}
  }
  animation=requestAnimationFrame(frame);
 }
 function clearReadingInput(){wheelLanding=null;root.classList.remove('reading-wheel');clearRestHold();}
 window.DTScenes={getStops:()=>{measure();return points.map(p=>({...p}));},goTo:target=>{clearReadingInput();releaseGesture();measure();moveTo(target);}};
 function nestedScroll(target,delta){
  for(let el=target instanceof Element?target:null;el&&el!==main&&el!==document.body;el=el.parentElement){
   const css=getComputedStyle(el);
   if(/auto|scroll/.test(css.overflowY)&&el.scrollHeight>el.clientHeight+2&&
    (delta>0?el.scrollTop+el.clientHeight<el.scrollHeight-1:el.scrollTop>0))return true;
  }
  return false;
 }
 function exempt(target,delta){return main.hidden||document.querySelector('dialog[open],.site-header[data-menu-open="true"]')||
  target instanceof Element&&(target.closest('input,textarea,select,[contenteditable="true"]')||nestedScroll(target,delta));}
 function clearRestHold(){restHold=null;clearTimeout(restTimer);restTimer=0;window.removeEventListener('wheel',brakeRestWheel,true);}
 function brakeRestWheel(event){
  if(!restHold)return;
  const now=performance.now(),delta=Math.sign(event.deltaY);
  const sample={now,arrivedAt:restHold.at,lastInputAt:lastWheelAt,direction:delta,arrivedDirection:restHold.direction,distance:scrollY-restHold.y};
  if(!reduced.matches&&!event.ctrlKey&&!event.metaKey&&Math.abs(event.deltaY)>Math.abs(event.deltaX||0)&&!exempt(event.target,delta)&&(readingMode?holdReadingWheel(sample):holdRestWheel(sample))){
   lastWheelAt=now;event.preventDefault();
  }else clearRestHold();
 }
 function armRestHold(y,direction=1){clearRestHold();restHold={y,direction,at:performance.now()};window.addEventListener('wheel',brakeRestWheel,{passive:false,capture:true});restTimer=setTimeout(clearRestHold,readingMode?READING_PAUSE:320);}
 // Touch uses native snap-stop. Russian wheel input keeps free movement
 // between reading points and a small forward-only finish after idle.
 function settle(){
  settleTimer=0;
  if((nativeSnap&&!(readingMode&&gesture==='wheel'))||touchActive||!settleEligible||reduced.matches||exempt(inputTarget,direction))return;
  settleEligible=false;
  measure();
  const target=nextTarget(points,scrollY,direction);
  const reach=Math.min(112,(window.DTViewport.contentHeight?.()||window.DTViewport.height())*.14);
  if(target!==null&&Math.abs(target-scrollY)<=reach)moveTo(target,true);
 }
 function queueSettle(){
  clearTimeout(settleTimer);settleTimer=0;
  if((!nativeSnap||readingMode&&gesture==='wheel')&&settleEligible&&!animation&&!touchActive)settleTimer=setTimeout(settle,180);
 }
 // Wheel engines do not consistently honour scroll-snap-stop. Intercept only
 // an actual crossing; free movement, nested readers and new gestures stay native.
 if(readingMode)window.addEventListener('wheel',event=>{
  if(event.defaultPrevented||reduced.matches||event.ctrlKey||event.metaKey||Math.abs(event.deltaY)<=Math.abs(event.deltaX||0)||exempt(event.target,Math.sign(event.deltaY)))return;
  const now=performance.now(),dir=Math.sign(event.deltaY);
  if(restHold){brakeRestWheel(event);if(event.defaultPrevented)return;}
  root.classList.add('reading-wheel');
  if(wheelLanding&&animation){
   if(dir===wheelLanding.direction&&now-lastWheelAt<180){lastWheelAt=now;event.preventDefault();return;}
   wheelLanding=null;cancel();
  }
  const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?(window.DTViewport.contentHeight?.()||window.DTViewport.height()):1);
  const target=crossingTarget(points,scrollY,pixels);
  if(target===null||Math.abs(target-scrollY)>=Math.abs(pixels)-TOLERANCE)return;
  event.preventDefault();lastWheelAt=now;wheelLanding={direction:dir};
  moveTo(target,false,()=>{wheelLanding=null;armRestHold(target,dir);});
 },{passive:false,capture:true});
 window.addEventListener('wheel',event=>{
  if(event.defaultPrevented)return;
  const now=performance.now(),delta=Math.sign(event.deltaY);
  if(!readingMode&&delta<0)clearRestHold();
  lastWheelAt=now;releaseGesture();
  if(reduced.matches||event.ctrlKey||event.metaKey||Math.abs(event.deltaY)<=Math.abs(event.deltaX||0))return;
  inputTarget=event.target;direction=Math.sign(event.deltaY);gesture='wheel';settleEligible=true;
 },{passive:true});
 window.addEventListener('scroll',()=>{
  const previous=lastScrollY,delta=scrollY-previous;lastScrollY=scrollY;
  if(gesture==='wheel'&&delta){const end=points.find(point=>(readingMode||point.rest)&&(delta>0?previous<point.y-2&&scrollY>=point.y-2&&scrollY<=point.y+TOLERANCE:readingMode&&previous>point.y+2&&scrollY<=point.y+2&&scrollY>=point.y-TOLERANCE));if(end)armRestHold(end.y,Math.sign(delta));}
  if(gesture==='touch'&&delta){direction=Math.sign(delta);settleEligible=true;}
  queueSettle();
 },{passive:true});
 window.addEventListener('touchstart',event=>{
  clearReadingInput();releaseGesture();
  if(event.touches?.length!==1||reduced.matches)return;
  gesture='touch';touchActive=true;inputTarget=event.target;lastScrollY=scrollY;
 },{passive:true});
 window.addEventListener('touchmove',event=>{if(event.touches?.length>1)releaseGesture();},{passive:true});
 window.addEventListener('touchend',event=>{
  if(gesture!=='touch'||event.touches?.length)return;
  touchActive=false;queueSettle();
 },{passive:true});
 window.addEventListener('touchcancel',releaseGesture,{passive:true});
 window.addEventListener('keydown',event=>{
  if(!event.defaultPrevented&&['ArrowDown','ArrowUp','PageDown','PageUp',' ','Home','End'].includes(event.key)){clearReadingInput();releaseGesture();}
 });
 // Direct links, scrollbar dragging and nested controls keep their own navigation.
 window.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'){clearReadingInput();releaseGesture();}},{passive:true});
 window.addEventListener('hashchange',()=>{clearReadingInput();releaseGesture();measure();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseGesture();});
 reduced.addEventListener('change',()=>{releaseGesture();syncSnap();});
 new MutationObserver(()=>{if(main.hidden)releaseGesture();syncSnap();}).observe(main,{attributes:true,attributeFilter:['hidden']});
 function resize(){
  const height=window.DTViewport.height(),header=window.DTViewport.top?.()||0;
  if(measuredWidth===innerWidth&&measuredHeight===height&&measuredHeader===header)return;
  measuredWidth=innerWidth;measuredHeight=height;measuredHeader=header;
  releaseGesture();document.documentElement.style.setProperty('--scene-height',(height-header)+'px');
  document.documentElement.style.setProperty('--footer-height',document.getElementById('site-footer').offsetHeight+'px');measure();
 }
 window.addEventListener('resize',resize,{passive:true});
 window.addEventListener('load',resize,{once:true});
 new ResizeObserver(()=>{document.documentElement.style.setProperty('--footer-height',document.getElementById('site-footer').offsetHeight+'px');measure();}).observe(main);
 if(document.fonts)document.fonts.ready.then(()=>{measure();});
 resize();syncSnap();
})();
