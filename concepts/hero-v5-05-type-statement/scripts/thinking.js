(function(){
 'use strict';
 const section=document.getElementById('thinking'),visual=document.getElementById('signal-visual');
 if(!section||!visual)return;
 const main=document.getElementById('mainPage');
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 visual.dataset.renderer='canvas';
 const model=window.DTLensOrbit;
 if(!('meaningLens' in section.dataset))initLegacyLens();
 function initLegacyLens(){
 const sticky=section.querySelector('.thinking-sticky'),noise=section.querySelector('.signal-noise'),clarity=section.querySelector('.signal-clarity');
 const model=window.DTLensOrbit,phrases=Array.from(noise.children),original=phrases.map(el=>el.textContent);
 const phraseGlyphs=new WeakMap();
 const morph=document.createElement('canvas');morph.className='signal-morph';morph.setAttribute('aria-hidden','true');visual.append(morph);
 const context=morph.getContext('2d');
 let lensClock=null;
 let visible=false,scrollDirty=true,sceneFrame=0,lastTime=0,lastPaint=0,clock=0,progress=0,state=model.flightState(0),width=0,height=0,pixelRatio=1,targets=[],sourceRows=[],overviewRows=[];
 function resizeMorph(){glyphMetrics.clear();const r=visual.getBoundingClientRect();width=r.width;height=r.height;if(main.hidden||width<=0||height<=0)return;const dpr=Math.min(devicePixelRatio||1,2,Math.max(1,Math.sqrt(8000000/(width*height))));pixelRatio=dpr;morph.width=Math.round(width*dpr);morph.height=Math.round(height*dpr);if(context){context.setTransform(dpr,0,0,dpr,0,0);layoutClarity();}paint();}
 const glyphMetrics=new Map();
 function textMetrics(text,font){
  const key=font+"\n"+text;
  if(!glyphMetrics.has(key)){
   context.font=font;
   glyphMetrics.set(key,{width:context.measureText(text).width});
  }
  return glyphMetrics.get(key);
 }
 function layoutClarity(){
  if(!width||!height)return;
  const compact=width<600,lens=model.glassGeometry(width,height,1);
  const cap=Math.min(compact?34:68,width*.085);
  const levels=[.42,.57,.72];
  const pairs=[0,1,2].map(row=>model.signalPairState(lensClock??(media.matches?0:clock),row));
  const rows=pairs.map((pair,index)=>({lines:pair.lines,size:cap*(index===0?1:.74),y:height*levels[index]}));
  // Fit all rows together so the main goal always keeps its type hierarchy.
  const fits=scale=>rows.every(row=>{
   const size=row.size*scale,font='700 '+size+'px ThinkingNarrow';
   const extent=Math.abs(row.y-lens.cy)+size*(row.lines.length*1.04/2+.1);
   const chord=2*lens.rx*Math.sqrt(Math.max(0,1-(extent/lens.ry)**2))*.92;
   return row.lines.every(line=>textMetrics(line,font).width<=Math.min(width*.86,chord));
  });
  let scale=1;
  if(!fits(1)){let low=0,high=1;for(let i=0;i<12;i++){const mid=(low+high)/2;if(fits(mid))low=mid;else high=mid;}scale=low;}
  targets=rows.map(row=>({...row,size:row.size*scale,center:lens.cx,font:'700 '+row.size*scale+'px ThinkingNarrow'}));
  const sourceLines=pairs.map(pair=>{
   const words=original[pair.sourceIndex].split(' '),lines=[''];
   for(const word of words){const last=lines.length-1;if(lines[last]&&lines[last].length+1+word.length>20)lines.push(word);else lines[last]+=(lines[last]?' ':'')+word;}
   lines[0]='“'+lines[0];lines[lines.length-1]+='”';return lines;
  });
  const sourceCap=Math.min(compact?22:34,width*.058);
  let sourceSize=sourceCap;
  sourceLines.forEach((lines,index)=>{
   const extent=Math.abs(height*levels[index]-lens.cy)+sourceCap*(lines.length*1.04/2+.2);
   const chord=2*lens.rx*Math.sqrt(Math.max(0,1-(extent/lens.ry)**2))*.85;
   const near=model.glassGeometry(width,height,.30);
   const nearExtent=Math.abs(height*levels[index]-near.cy)+sourceCap*(lines.length*1.04/2+.2);
   const nearChord=2*near.rx*Math.sqrt(Math.max(0,1-(nearExtent/near.ry)**2))*.85;
   const maxWidth=Math.min(width*.76,chord,nearChord);
   lines.forEach(line=>{sourceSize=Math.min(sourceSize,sourceCap*maxWidth/textMetrics(line,'italic '+sourceCap+'px Georgia').width);});
  });
  sourceRows=sourceLines.map((lines,index)=>({lines,font:'italic '+sourceSize+'px Georgia',size:sourceSize,y:height*levels[index]}));
  targets.forEach(row=>{row.texture=phraseTexture(row.lines,row.font,row.size);});
  sourceRows.forEach(row=>{row.texture=phraseTexture(row.lines,row.font,row.size);});
  // Output pairs follow the same six-second handoffs as their input lanes.
  const copy=[0,1,2].map(row=>model.signalPairState(0,row).variants.map(variant=>compact?variant.compact:variant.wide));
  overviewRows=copy.map((variants,index)=>{
   const size=compact?Math.min(18,width*.046):Math.min(30,width*.025);
   const max=Math.max(...variants.flat().map(t=>textMetrics(t,'700 '+size+'px ThinkingNarrow').width));
   const fitted=size*Math.min(1,width*(compact?.22:.24)/max);
   return {variants,font:'700 '+fitted+'px ThinkingNarrow',size:fitted,y:height*(.40+index*.15)};
  });
 }
 function ellipse(ctx,x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,Math.max(1,rx),Math.max(1,ry),0,0,Math.PI*2);}
 function drawGlass(){
  const ctx=context,base=model.glassGeometry(width,height,progress),life=model.glassLife(clock,progress,media.matches);
  const {depth,zoom,retreat}=base,cx=base.cx+life.dx,cy=base.cy+life.dy,rx=base.rx*life.stretchX,ry=base.ry*life.stretchY;
  const passage=model.smooth(.38,.55,progress)*(1-model.smooth(.68,.84,progress));
  // Once the camera is inside the glass, its rim and bevels are offscreen.
  // Avoid rasterizing an enormous clipped ellipse and shadow outside the canvas.
  const margin=depth+24;
  const fillsView=[-margin,width+margin].every(x=>[-margin,height+margin].every(y=>((x-cx)/rx)**2+((y-cy)/ry)**2<1));
  ctx.save();ctx.globalAlpha=(1-retreat*.55)*(1-passage*.12);ctx.lineJoin='round';ctx.lineCap='round';
  ctx.translate(cx,cy);ctx.rotate(life.tilt);ctx.translate(-cx,-cy);
  // A broad caustic and a cut glass edge retain volume at every camera angle.
  const aura=ctx.createRadialGradient(cx,cy,0,cx,cy,ry*1.3);
  aura.addColorStop(0,'#c8d0ce07');aura.addColorStop(.6,'#c8d0ce02');aura.addColorStop(1,'#c8d0ce00');
  ctx.fillStyle=aura;ctx.fillRect(0,0,width,height);
  const edge=ctx.createLinearGradient(cx-rx-depth,cy-ry+ry*life.sweep*.16,cx+rx+depth,cy+ry-ry*life.sweep*.16);
  [[0,'#e8eeed'],[.12,'#525c5c'],[.33,'#151d1e'],[.5,'#9da8a8'],[.67,'#202728'],[.9,'#dae0df'],[1,'#4b5655']].forEach(([n,c])=>edge.addColorStop(n,c));
  if(!fillsView){ellipse(ctx,cx+depth,cy,rx,ry);ctx.strokeStyle=edge;ctx.lineWidth=Math.max(2,depth*.38);ctx.stroke();}
  const glass=ctx.createLinearGradient(cx-rx,cy,cx+rx,cy);
  [[0,'#dce7e21c'],[.08,'#a8b9b10d'],[.28,'#151d1b25'],[.64,'#dce6e603'],[.88,'#dce6e614'],[1,'#f3f7f430']].forEach(([n,c])=>glass.addColorStop(n,c));
  ctx.fillStyle=glass;
  if(fillsView)ctx.fillRect(0,0,width,height);
  else{
   ellipse(ctx,cx,cy,rx,ry);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.7;ctx.stroke();
   // Two soft bevels keep the edge clean when the camera approaches the glass.
   for(let i=1;i<=2;i++){const inset=i*1.4*Math.sqrt(zoom);ellipse(ctx,cx+depth*.12,cy,rx-inset,ry-inset);ctx.strokeStyle='rgba(219,231,226,'+(.12-i*.035)+')';ctx.lineWidth=.8;ctx.stroke();}
  }
  ctx.save();if(!fillsView){ellipse(ctx,cx,cy,rx-2,ry-2);ctx.clip();}
  const drift=rx*life.sweep*.55;
  const reflection=ctx.createLinearGradient(cx-rx+drift,cy-ry,cx+rx+drift,cy+ry);
  reflection.addColorStop(0,'#ffffff00');reflection.addColorStop(.18,'#ffffff03');reflection.addColorStop(.42,'#edf6f315');reflection.addColorStop(.7,'#ffffff03');reflection.addColorStop(1,'#ffffff00');
  ctx.fillStyle=reflection;ctx.fillRect(Math.max(0,cx-rx),Math.max(0,cy-ry),Math.min(width,rx*2),Math.min(height,ry*2));
  const glowX=cx+rx*life.sweep*.52,glowY=cy-ry*.28;
  const caustic=ctx.createRadialGradient(glowX,glowY,0,glowX,glowY,Math.max(24,Math.min(rx,ry)*1.1));
  caustic.addColorStop(0,'#edf6f310');caustic.addColorStop(.45,'#edf6f305');caustic.addColorStop(1,'#edf6f300');
  ctx.fillStyle=caustic;ctx.fillRect(Math.max(0,cx-rx),Math.max(0,cy-ry),Math.min(width,rx*2),Math.min(height,ry*2));
  ctx.restore();
  if(!fillsView){const arc=life.sweep*.14;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,Math.PI*(.96+arc),Math.PI*(1.53+arc));ctx.strokeStyle='#eef5f0bd';ctx.lineWidth=1.6;ctx.shadowColor='#e4efe8';ctx.shadowBlur=9;ctx.stroke();}
  ctx.restore();
 }
 function drawOverview(){
  if(state.noise<.001)return;
  const ctx=context,overviewInk=state.noise*(1-model.smooth(.18,.24,progress)),right=width*(width<600?.75:.73);
  ctx.save();ctx.textAlign='left';ctx.textBaseline='alphabetic';
  overviewRows.forEach((row,index)=>{
   const output=model.outputState(media.matches?0:clock,index);
   ctx.font=row.font;ctx.fillStyle='#f0f1ed';
   for(const [variant,ink] of [[output.current,1-output.mix],[output.next,output.mix]]){
    if(ink<.001)continue;
    ctx.globalAlpha=overviewInk*ink;
    const words=row.variants[variant];
    words.forEach((line,j)=>ctx.fillText(line,right,row.y+(j-(words.length-1)/2)*row.size*1.12));
   }
   ctx.globalAlpha=overviewInk*.45;
   ctx.beginPath();ctx.moveTo(width*.57,row.y);ctx.lineTo(right-width*.025,row.y);
   const ray=ctx.createLinearGradient(width*.57,row.y,right,row.y);
   ray.addColorStop(0,'#cbd7d200');ray.addColorStop(.5,'#dce8e58c');ray.addColorStop(1,'#cbd7d200');
   ctx.strokeStyle=ray;ctx.lineWidth=.7;ctx.stroke();
  });
  ctx.restore();
 }
 function phraseTexture(lines,font,size){
  const pad=12,w=Math.ceil(Math.max(...lines.map(line=>textMetrics(line,font).width))+pad*2),h=Math.ceil(size*(lines.length*1.04+.4)+pad*2);
  const canvas=document.createElement('canvas');canvas.width=Math.ceil(w*pixelRatio);canvas.height=Math.ceil(h*pixelRatio);
  const ink=canvas.getContext('2d');ink.setTransform(pixelRatio,0,0,pixelRatio,0,0);
  ink.fillStyle='#edf0eb';ink.font=font;ink.textAlign='center';ink.textBaseline='middle';
  lines.forEach((line,i)=>ink.fillText(line,w/2,h/2+(i-(lines.length-1)/2)*size*1.04));
  return {canvas,width:w,height:h,ratio:pixelRatio};
 }
 function drawTexture(texture,x,y,alpha){
  const ctx=context;ctx.save();ctx.globalAlpha=alpha;
  ctx.drawImage(texture.canvas,x-texture.width/2,y-texture.height/2,texture.width,texture.height);ctx.restore();
 }
 function drawSplitPhrase(src,dst,x,y,reveal,alpha,compact){
  const ctx=context,count=5;
  if(reveal<=0){drawTexture(src,x,y,alpha);return;}
  if(reveal>=1){drawTexture(dst,x,y,alpha);return;}
  // Five broad vertical facets carry pieces of the entire phrase.
  // Shared perspective keeps them part of one optical object.
  const envelope=src.width+(dst.width-src.width)*model.smooth(0,1,reveal);
  for(let i=0;i<count;i++){
   const layer=model.opticalSliceState(reveal,i,count,compact),texture=layer.target?dst:src;
   const strip=texture.width/count,sx=i*strip;
   const shimmer=model.glassLife(clock,progress,media.matches).refraction*width*layer.split*(i-(count-1)/2)/count;
   const center=x+(i+.5-count/2)*envelope/count+layer.dx+shimmer;
   const w=strip*layer.scaleX,h=texture.height*layer.scaleY;
   ctx.save();ctx.globalAlpha=alpha;
   if(w>.015)ctx.drawImage(texture.canvas,sx*texture.ratio,0,strip*texture.ratio,texture.height*texture.ratio,center-w/2,y-h/2+layer.dy,w,h);
   ctx.restore();
  }
 }
 function drawMorph(){
  if(!context||width<=0||height<=0)return;
  const ctx=context;ctx.clearRect(0,0,width,height);drawGlass();drawOverview();
  const presence=state.focus;
  if(presence<.001)return;
  const compact=width<600,approach=model.smooth(.24,.38,progress);
  for(let group=0;group<3;group++){
   const motion=model.opticalRowState(progress,group,compact),src=sourceRows[group],dst=targets[group];
   const x=model.glassGeometry(width,height,progress).cx,y=src.y+(dst.y-src.y)*approach;
   if(media.matches){drawTexture(progress>=.5?dst.texture:src.texture,x,y,presence);continue;}
   drawSplitPhrase(src.texture,dst.texture,x,y,motion.reveal,presence,compact);
  }
 }
 function setPhrase(phrase,copy){
  const fragment=document.createDocumentFragment(),glyphs=[];
  const length=Array.from(copy).length;let index=0;
  for(const token of copy.split(/(\s+)/)){
   if(!token)continue;
   if(/^\s+$/.test(token)){fragment.append(document.createTextNode(token));index+=Array.from(token).length;continue;}
   const word=document.createElement('span');word.className='signal-word';
   for(const char of Array.from(token)){
    const letter=document.createElement('span');letter.className='signal-glyph';letter.textContent=char;
    word.append(letter);glyphs.push({element:letter,position:index/Math.max(1,length-1)});index++;
   }
   fragment.append(word);
  }
  phrase.replaceChildren(fragment);phraseGlyphs.set(phrase,glyphs);
 }
 function paint(){
  if(progress>=.24&&lensClock===null){lensClock=media.matches?0:clock;layoutClarity();}
  else if(progress<.18&&lensClock!==null){lensClock=null;layoutClarity();}
  section.dataset.orbit=state.phase;section.dataset.stage=progress<.3?'0':progress<.8?'1':'2';
  noise.style.opacity=state.noise;noise.style.transform='perspective(1100px)';
  if(state.noise>.001)phrases.forEach((phrase,i)=>{
   const flow=model.flowState(media.matches?2:clock,i),lane=i%10;
   const travel=media.matches?.2:flow.travel;
   const entrance=flow.t<.5?model.smooth(0,.07,flow.t):0;
   const compact=width<600;
   const opacity=(compact&&lane>=6?0:media.matches?(i<10?.8:0):entrance)*(.72+(i%3)*.12)*([1,2,3].includes(i%10)?state.selectedNoise:1);
   phrase.style.opacity=String(opacity);
   if(opacity<.001)return;
   // Fixed layout coordinates; animate translation without reflowing each phrase.
   const paired=[1,2,3].includes(lane),levels=compact?[28,70,55,40,62.5,79]:[22,70,55,40,30,47.5,62.5,77.5,85,92];
   phrase.style.left='5%';phrase.style.top=levels[lane]+'%';phrase.style.fontStyle='italic';
   phrase.style.filter='none';
   phrase.style.transform='translate3d('+(travel*width*(compact?.18:.25))+'px,0,0) translateX(-'+(travel*40)+'%) scale('+(1-travel*.12)+')'+(paired?' translateY(-50%)':'');
   const copy='“'+original[i]+'”';
   if(phrase.textContent!==copy||!phraseGlyphs.has(phrase))setPhrase(phrase,copy);
   const glyphs=phraseGlyphs.get(phrase);
   // Only the short dissolution interval needs per-letter updates.
   if(!media.matches&&flow.t>=.34&&flow.t<.5){
    for(const glyph of glyphs){
     const ink=model.phraseGlyphState(flow.t,glyph.position);
     glyph.element.style.opacity=String(ink.opacity);
     // Opacity and translation keep dissolution light; per-letter blur is costly.
     glyph.element.style.filter='none';
     glyph.element.style.transform='none';
    }
   }else if(media.matches||flow.t<.34){
    for(const glyph of glyphs){
     if(glyph.element.style.opacity){glyph.element.style.opacity='';glyph.element.style.filter='';glyph.element.style.transform='';}
    }
   }
  });
  // Canvas owns the complete optical scene; retain HTML only as its fallback.
  clarity.style.opacity=0;
  drawMorph();
 }
 function animate(now){
  sceneFrame=0;
  if(!visible||document.hidden||main.hidden)return;
  // Live input lanes use 30fps; quiet glass uses 24fps. Scroll paints immediately.
  const interval=state.noise>.001?32:1000/24;
  if(!scrollDirty&&!media.matches&&lastPaint&&now-lastPaint<interval){sceneFrame=requestAnimationFrame(animate);return;}
  const changed=scrollDirty;
  if(changed){scrollDirty=false;scrollState();}
  if(!media.matches){clock+=Math.max(0,(now-(lastTime||now))/1000);lastTime=now;}
  lastPaint=!changed&&state.noise<=.001&&lastPaint?now-(now-lastPaint)%interval:now;
  if(changed||state.noise>.001)paint();else drawMorph();
  if(!media.matches)sceneFrame=requestAnimationFrame(animate);
 }
 function syncMotion(){
  if(sceneFrame)cancelAnimationFrame(sceneFrame);sceneFrame=0;lastTime=0;lastPaint=0;
  requestScrollState();
 }
 function scrollState(){
  const travel=Math.max(1,section.offsetHeight-sticky.offsetHeight);
  progress=Math.max(0,Math.min(1,((window.DTViewport.top?.()||0)-section.getBoundingClientRect().top)/travel));
  if(media.matches)progress=[0,.3,.6,1][Math.min(3,Math.floor(progress*4))];
  state=model.flightState(progress);
 }
 function requestScrollState(){
  scrollDirty=true;
  if(visible&&!document.hidden&&!main.hidden&&!sceneFrame)sceneFrame=requestAnimationFrame(animate);
 }
 function measureThinking(){
  if(main.hidden)return;
  const readingScale=document.documentElement.lang==='ru'?1.25:1;
  section.style.minHeight=(sticky.offsetHeight+Math.round(window.DTViewport.height()*(visual.getBoundingClientRect().width<600?2:2.25)*readingScale))+'px';sticky.style.top=(window.DTViewport.top?.()||0)+'px';resizeMorph();requestScrollState();
 }
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncMotion();}).observe(section);
 new ResizeObserver(measureThinking).observe(sticky);
 window.addEventListener('scroll',requestScrollState,{passive:true});window.addEventListener('resize',measureThinking,{passive:true});
 window.addEventListener('hashchange',requestScrollState);document.addEventListener('visibilitychange',syncMotion);media.addEventListener('change',syncMotion);
 new MutationObserver(()=>{measureThinking();syncMotion();}).observe(main,{attributes:true,attributeFilter:['hidden']});
 if(document.fonts)document.fonts.ready.then(()=>{glyphMetrics.clear();resizeMorph();});measureThinking();
 syncMotion();requestScrollState();
 }
 const edit=document.getElementById('the-edit');
 if(!('bottleneck' in edit.dataset))initLegacyEdit();
 function initLegacyEdit(){
 const edits=[
  'Example: better enquiries.\nSeven possible actions.',
  'Useful ideas.\nNot all for now.',
  'One goal. Three priorities.\nPut them in order.'
 ];
 const editControls=Array.from(edit.querySelectorAll('[data-edit-stage]'));
 const editIntervals=Math.max(1,editControls.length-1);
 const editSticky=edit.querySelector('.edit-sticky');
 const editCards=Array.from(edit.querySelectorAll('[data-edit-plane]'));
 edit.dataset.motion='continuous';
 let editSelected=-1,editQueued=0,pendingEdit=null,lastEditProgress=null;
 function setEdit(index){
  if(index===editSelected)return;
  editSelected=index;edit.dataset.edit=String(index);
  const copy=document.getElementById('edit-explanation');
  const lines=edits[index].split('\n');copy.replaceChildren(document.createTextNode(lines[0]),document.createElement('br'),document.createTextNode(lines[1]));
  editControls.forEach((button,i)=>{button.classList.toggle('is-selected',i===index);button.setAttribute('aria-pressed',String(i===index));});
 }
 editControls.forEach((button,index)=>{
  button.addEventListener('click',()=>goEditStage(index));
  button.addEventListener('keydown',e=>{
   if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
   e.preventDefault();const next=(index+(e.key==='ArrowRight'?1:editControls.length-1))%editControls.length;editControls[next].focus({preventScroll:true});goEditStage(next);
  });
 });
 function editProgress(){
  const top=parseFloat(getComputedStyle(editSticky).top)||0;
  const travel=Math.max(1,edit.offsetHeight-editSticky.offsetHeight);
  return {top,travel,progress:Math.max(0,Math.min(1,(top-edit.getBoundingClientRect().top)/travel))};
 }
 function paintEditScroll(){
  editQueued=0;if(main.hidden)return;
  if(pendingEdit&&Math.abs(scrollY-pendingEdit.target)<=2)pendingEdit=null;
  const {progress}=editProgress();
  const motion=model.editState(media.matches?Math.round(progress*editIntervals)/editIntervals:progress);
  setEdit(pendingEdit?pendingEdit.index:motion.stage);
  if(motion.progress===lastEditProgress)return;
  lastEditProgress=motion.progress;
  edit.style.setProperty('--priority',String(motion.priority));
  editCards.forEach((card,i)=>{
   const pose=motion.cards[i];
   card.style.left=pose.x+'%';card.style.top=pose.y+'%';card.style.width=pose.w+'%';card.style.height=pose.h+'%';
   card.style.opacity=String(pose.opacity);card.style.setProperty('--strike',String(pose.strike));
   card.style.transform='rotateY('+pose.ry+'deg) rotateZ('+pose.rz+'deg)';
  });
 }
 function queueEditScroll(){if(!editQueued)editQueued=requestAnimationFrame(paintEditScroll);}
 function measureEditScroll(){
  if(main.hidden)return;
  const height=editSticky.offsetHeight;
  edit.style.minHeight=(height+model.editTravel(window.DTViewport.height()))+'px';
  editSticky.style.top=((window.DTViewport.top?.()||0)+Math.min(0,(window.DTViewport.contentHeight?.()||window.DTViewport.height())-height))+'px';
  if(pendingEdit){
   const {top,travel}=editProgress();
   const target=scrollY+edit.getBoundingClientRect().top-top+travel*pendingEdit.index/editIntervals;
   if(Math.abs(target-pendingEdit.target)>2){pendingEdit.target=target;if(window.DTScenes)window.DTScenes.goTo(target);}
  }
  queueEditScroll();
 }
 function goEditStage(index){
  setEdit(index);
  const {top,travel}=editProgress();
  const target=window.scrollY+edit.getBoundingClientRect().top-top+travel*index/editIntervals;
  pendingEdit={index,target};
  if(window.DTScenes)window.DTScenes.goTo(target);else window.scrollTo({top:target,behavior:'instant'});
 }
 function resumeEditScroll(){pendingEdit=null;queueEditScroll();}
 window.addEventListener('wheel',event=>{if(!event.ctrlKey&&!event.metaKey)resumeEditScroll();},{passive:true});
 window.addEventListener('touchstart',resumeEditScroll,{passive:true});
 window.addEventListener('keydown',event=>{if(!event.defaultPrevented&&['ArrowDown','ArrowUp','PageDown','PageUp',' ','Home','End'].includes(event.key))resumeEditScroll();});
 window.addEventListener('pointerdown',resumeEditScroll,{passive:true});
 media.addEventListener('change',queueEditScroll);
 window.addEventListener('scroll',queueEditScroll,{passive:true});
 window.addEventListener('resize',measureEditScroll,{passive:true});
 window.addEventListener('hashchange',()=>{pendingEdit=null;measureEditScroll();});
 new ResizeObserver(measureEditScroll).observe(editSticky);
 new MutationObserver(()=>{pendingEdit=null;measureEditScroll();}).observe(main,{attributes:true,attributeFilter:['hidden']});
 setEdit(0);measureEditScroll();
 if(document.fonts)document.fonts.ready.then(measureEditScroll);
 }
 document.getElementById('thinking-jump')?.addEventListener('click',()=>{
  const rootHidden=main.hidden;if(rootHidden)window.location.hash='#home';
  requestAnimationFrame(()=>window.DTScenes.goTo(scrollY+section.getBoundingClientRect().top));
 });
})();

