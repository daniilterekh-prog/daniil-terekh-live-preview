(function(root){
 'use strict';
 const categories={strategy:"Стратегия",performance:"Лидогенерация",leadership:"Управление",automation:"Технологии",design:"Дизайн",analytics:"Аналитика"};
 const initial=root.DTSkillsData;
 let columns=12,rows=8,slots=[];
 function configureLayout(count){
  columns=count===8?8:12;rows=columns===8?12:8;slots=[];
  const keys=Object.keys(categories),perRow=columns/4;
  keys.forEach((category,g)=>{
   const gx=(g%perRow)*4,gy=Math.floor(g/perRow)*4;
   const items=initial.map((item,i)=>({item,i})).filter(x=>x.item.category===category);
   const cells=[];
   for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(x>=2||y>=2)cells.push((gy+y)*columns+gx+x);
   slots[items.find(x=>x.item.kind==='topic').i]=gy*columns+gx;
   items.filter(x=>x.item.kind==='tool').forEach((x,i)=>{slots[x.i]=cells[i];});
  });
 }
 configureLayout(12);
 const slotFor=i=>slots[i];
 function createState(items=initial){return {items:items.map(x=>({...x})),selected:items.length?0:-1,category:'all',query:''};}
 function matches(s){return s.items.flatMap((x,i)=>(s.category==='all'||x.category===s.category)&&[x.name,x.description,categories[x.category]].join(' ').toLowerCase().includes(s.query.toLowerCase().trim())?[i]:[]);}
 function reduce(s,a){
  const n={...s};
  if(a.type==='category'&&(a.value==='all'||Object.hasOwn(categories,a.value)))n.category=a.value;
  if(a.type==='query')n.query=String(a.value);
  if(a.type==='select'&&Number.isInteger(a.value)&&n.items[a.value]){
   if(a.reveal&&!matches(n).includes(a.value)){n.category='all';n.query='';}
   if(matches(n).includes(a.value))n.selected=a.value;
  }
  const visible=matches(n);
  if(a.type==='step'&&visible.length){const at=visible.indexOf(n.selected);n.selected=visible[((at<0?0:at)+a.value%visible.length+visible.length)%visible.length];}
  if(!visible.includes(n.selected))n.selected=visible[0]??-1;
  return n;
 }
 function related(s){if(s.selected<0)return [];return [s.selected,...(s.items[s.selected].related||[]).map(name=>s.items.findIndex(x=>x.name===name)).filter(i=>i>=0&&i!==s.selected)];}
 function layout(s,slot){return {x:slot%columns,y:Math.floor(slot/columns),span:initial[slots.indexOf(slot)]?.span||1,z:s.selected>=0&&slot===slotFor(s.selected)?.45:related(s).some(i=>slotFor(i)===slot)?.28:0};}
 function navigate(s,key){
  const visible=matches(s).sort((a,b)=>slotFor(a)-slotFor(b));if(!visible.length)return s;
  if(key==='Home'||key==='End')return reduce(s,{type:'select',value:key==='Home'?visible[0]:visible.at(-1)});
  const delta={ArrowRight:1,ArrowLeft:-1,ArrowDown:1,ArrowUp:-1}[key];if(!delta)return s;
  const slot=slotFor(s.selected),vertical=key==='ArrowDown'||key==='ArrowUp';
  const column=visible.filter(i=>slotFor(i)%columns===slot%columns),list=vertical&&column.length>1?column:visible;
  const at=list.indexOf(s.selected),next=list[(at+delta+list.length)%list.length];return reduce(s,{type:'select',value:next});
 }
 function solutionFor(item){return {challenge:item.solution[0],approach:item.solution[1],deliverable:item.solution[2]};}
 const api={categories,initial,get columns(){return columns;},get rows(){return rows;},configureLayout,slotFor,createState,matches,reduce,related,layout,navigate,solutionFor};
 if(typeof module==='object'&&module.exports)module.exports=api;root.DTSkillsModel=api;
})(typeof globalThis==='object'?globalThis:this);

(function(){
 'use strict';
 const root=document.getElementById('skills');if(!root)return;
 const M=globalThis.DTSkillsModel,$=id=>document.getElementById('skills-'+id),media=matchMedia('(prefers-reduced-motion: reduce)');
 let state=M.createState(),unit=60,entered=false,initialized=false,lastSelected=null,mobileFocus=null,lastView=null,cameraTimer=null;
 const stage=$('stage'),field=$('field'),story=$('solution'),cubeNodes=[],filters=[];
 const cardDots=[...$('pagination').querySelectorAll('button')];
 let cardFrame=null;
 function syncCardIndicator(){
  const cards=[...story.children],left=story.getBoundingClientRect().left;
  const at=cards.reduce((best,card,i)=>Math.abs(card.getBoundingClientRect().left-left)<Math.abs(cards[best].getBoundingClientRect().left-left)?i:best,0);
  cardDots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===at)));
 }
 story.addEventListener('scroll',()=>{if(cardFrame===null)cardFrame=requestAnimationFrame(()=>{cardFrame=null;syncCardIndicator();});},{passive:true});
 cardDots.forEach((dot,i)=>dot.addEventListener('click',()=>story.scrollTo({left:story.children[i].getBoundingClientRect().left-story.getBoundingClientRect().left+story.scrollLeft,behavior:media.matches?'instant':'smooth'})));

 function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
 function button(text,action){const e=el('button','',text);e.type='button';e.addEventListener('click',action);return e;}
 function dispatch(action,focus=false){
  root.classList.add('skills-interacted');entered=true;
  if(root.clientWidth<=800&&action.type==='select'){
   const item=state.items[action.value];
   if(item)mobileFocus=item.kind==='topic'&&mobileFocus===item.category?null:item.category;
  }
  state=M.reduce(state,action);render();
  if(focus)cubeNodes[state.selected]?.focus({preventScroll:true});
 }
 function build(){
  M.initial.forEach((item,i)=>{
   const slot=M.slotFor(i),socket=el('div','skills-socket');socket.dataset.slot=slot;socket.dataset.kind=item.kind;$('sockets').append(socket);
   const cube=button('',()=>dispatch({type:'select',value:i,reveal:true}));cube.className='skills-cube';cube.dataset.index=i;cube.dataset.slot=slot;cube.dataset.kind=item.kind;
   cube.setAttribute('aria-label',item.name+' — '+M.categories[item.category]);cube.setAttribute('aria-controls','skills-detail-name');
   for(const side of ['front','back','left','right']){const face=el('span','sk-side sk-'+side);face.setAttribute('aria-hidden','true');cube.append(face);}
   const cap=el('span','sk-cap');cap.setAttribute('aria-hidden','true');cap.append(el('span','sk-label',item.label||item.name));cube.append(cap);
   cube.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    event.preventDefault();entered=true;
    if(root.clientWidth<=800){
     const candidates=state.items.map((item,n)=>({item,n})).filter(x=>mobileFocus?x.item.category===mobileFocus:x.item.kind==='topic').map(x=>x.n).sort((a,b)=>M.slotFor(a)-M.slotFor(b));
     const at=candidates.indexOf(state.selected),delta=['ArrowLeft','ArrowUp'].includes(event.key)?-1:1;
     const next=event.key==='Home'?candidates[0]:event.key==='End'?candidates.at(-1):candidates[(at+delta+candidates.length)%candidates.length];
     state=M.reduce(state,{type:'select',value:next,reveal:true});
    }else state=M.navigate(state,event.key);
    root.classList.add('skills-interacted');render();cubeNodes[state.selected]?.focus({preventScroll:true});
   });
   field.append(cube);cubeNodes.push(cube);
  });
  Object.entries({all:"Все",...M.categories}).forEach(([key,name])=>{const b=button(name,()=>dispatch({type:'category',value:key}));b.dataset.category=key;$('filters').append(b);filters.push(b);});
 }
 function fitLabels(){
  const minimum=root.clientWidth>800?7:4;
  cubeNodes.forEach(cube=>{
   if(cube.classList.contains('is-outside'))return;
   const label=cube.querySelector('.sk-label'),cap=cube.querySelector('.sk-cap');
   label.style.fontSize='';let size=parseFloat(getComputedStyle(label).fontSize);
   while(size>minimum&&(label.scrollHeight>cap.clientHeight||label.scrollWidth>cap.clientWidth)){
    size-=.25;label.style.fontSize=size+'px';
   }
  });
 }
 function camera(){
  const compact=root.clientWidth<=800;
  if(!compact)mobileFocus=null;
  const view=compact?(mobileFocus||'overview'):'desktop';
  if(lastView!==null&&view!==lastView&&!media.matches){
   clearTimeout(cameraTimer);root.classList.add('skills-camera-moving');
   cameraTimer=setTimeout(()=>{root.classList.remove('skills-camera-moving');fitLabels();},760);
  }
  lastView=view;
  root.classList.toggle('skills-compact',compact);root.classList.toggle('skills-focused',compact&&!!mobileFocus);
  $('overview').hidden=!compact||!mobileFocus;
  let zoom=1,px=0,py=0;
  unit=compact?60:70*(window.DTViewport?.scale?.()||1);
  zoom=compact?Math.min(stage.clientWidth/(unit*(M.columns+1.6)),stage.clientHeight/(unit*(M.rows+2))):Math.min(1,stage.clientWidth/(unit*(M.columns+1.2)),stage.clientHeight/(unit*(M.rows+1.2)));
  field.style.setProperty('--unit',unit+'px');field.style.setProperty('--depth',Math.max(7,unit*.24)+'px');
  $('sockets').querySelectorAll('.skills-socket').forEach((e,i)=>{const slot=M.slotFor(i);e.style.transform='translate('+(slot%M.columns*unit)+'px,'+(Math.floor(slot/M.columns)*unit)+'px)';});
  if(compact&&mobileFocus){
   const hub=state.items.findIndex(x=>x.kind==='topic'&&x.category===mobileFocus),p=M.layout(state,M.slotFor(hub));
   px=(M.columns/2-p.x-2)*unit;py=(M.rows/2-p.y-2)*unit;
   zoom=Math.min(stage.clientWidth/(unit*5.2),stage.clientHeight/(unit*5.2));
  }
  field.style.setProperty('--camera-zoom',zoom);field.style.setProperty('--camera-x',px+'px');field.style.setProperty('--camera-y',py+'px');
  cubeNodes.forEach((cube,i)=>{
   const item=state.items[i],outside=compact&&mobileFocus&&item.category!==mobileFocus,overviewTool=compact&&!mobileFocus&&item.kind==='tool';
   cube.classList.toggle('is-outside',!!outside);cube.classList.toggle('is-overview-tool',overviewTool);
   cube.inert=!!outside;
   if(!compact)cube.querySelector('.sk-label').style.fontSize='';
   cube.querySelector('.sk-label').textContent=item.label||item.name;
  });
 }
 function geometry(){
  const visible=new Set(M.matches(state)),links=new Set(M.related(state));
  cubeNodes.forEach((cube,i)=>{
   const selected=i===state.selected,p=M.layout(state,M.slotFor(i)),z=entered||media.matches?p.z:0;
   cube.classList.toggle('is-selected',selected);cube.classList.toggle('is-related',links.has(i)&&!selected);cube.classList.toggle('is-dim',!visible.has(i)&&!links.has(i));
   cube.style.transform='translate3d('+(p.x*unit)+'px,'+(p.y*unit)+'px,'+(z*unit)+'px)';
   cube.tabIndex=selected||root.clientWidth<=800&&!mobileFocus&&state.items[i].kind==='topic'?0:-1;cube.disabled=!visible.has(i)&&!links.has(i);cube.setAttribute('aria-pressed',String(selected));
  });
 }
 function drawConnections(){
  const svg=$('connections');svg.replaceChildren();if(state.selected<0)return;
  const origin=M.layout(state,M.slotFor(state.selected));
  M.related(state).filter(i=>i!==state.selected&&(!mobileFocus||state.items[i].category===mobileFocus)).forEach(i=>{
   const p=M.layout(state,M.slotFor(i)),x=origin.x*100+origin.span*50,y=origin.y*100+origin.span*50,tx=p.x*100+p.span*50,ty=p.y*100+p.span*50;
   const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M'+x+' '+y+' L'+tx+' '+ty);path.setAttribute('pathLength','1');path.dataset.target=state.items[i].name;svg.append(path);
  });
 }
 function render(){
  camera();geometry();fitLabels();drawConnections();filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
  const visible=M.matches(state),picker=$('picker'),signature=visible.join(',');
  if(picker.dataset.options!==signature){picker.replaceChildren(...visible.map(i=>{const o=el('option','',state.items[i].name);o.value=i;return o;}));picker.dataset.options=signature;}
  picker.value=state.selected;picker.disabled=!visible.length;
  if(lastSelected===state.selected)return;
  const animate=lastSelected!==null;lastSelected=state.selected;const item=state.items[state.selected],solution=item?M.solutionFor(item):null;
  $('detail-name').textContent=item?.name||"Выберите навык";
  for(const key of ['challenge','approach','deliverable'])$('solution-'+key).textContent=solution?.[key]||'';
  $('related').replaceChildren(...M.related(state).filter(i=>i!==state.selected).map(i=>{
   const b=button(state.items[i].name,()=>{dispatch({type:'select',value:i,reveal:true});$('detail-name').focus({preventScroll:true});});return b;
  }));
  story.scrollTo({left:0,behavior:'instant'});syncCardIndicator();drawConnections();story.getAnimations().forEach(a=>a.cancel());
  if(animate&&!media.matches)story.animate([{opacity:.35,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:340,easing:'cubic-bezier(.22,.72,.18,1)'});
 }
 function resize(){
  M.configureLayout(12);
  field.style.setProperty('--columns',M.columns);field.style.setProperty('--rows',M.rows);
  unit=Math.min(70*(window.DTViewport?.scale?.()||1),stage.clientWidth/(M.columns+(M.columns===12?1.2:1)),stage.clientHeight/(M.rows+1.2));
  field.style.setProperty('--unit',unit+'px');field.style.setProperty('--depth',Math.max(7,unit*.24)+'px');
  $('connections').setAttribute('viewBox','0 0 '+M.columns*100+' '+M.rows*100);
  cubeNodes.forEach((cube,i)=>{cube.dataset.slot=M.slotFor(i);});
  $('sockets').querySelectorAll('.skills-socket').forEach((e,i)=>{const slot=M.slotFor(i);e.dataset.slot=slot;e.style.transform='translate('+(slot%M.columns*unit)+'px,'+(Math.floor(slot/M.columns)*unit)+'px)';});
  camera();geometry();fitLabels();drawConnections();
 }
 function motion(){root.classList.toggle('no-motion',media.matches);if(media.matches)root.getAnimations({subtree:true}).forEach(a=>a.cancel());}
 $('overview').addEventListener('click',()=>{
  const hub=state.items.findIndex(x=>x.kind==='topic'&&x.category===mobileFocus);
  mobileFocus=null;if(hub>=0)state=M.reduce(state,{type:'select',value:hub,reveal:true});render();
  cubeNodes[hub]?.focus({preventScroll:true});
 });
 root.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobileFocus){event.preventDefault();$('overview').click();}});
 $('picker').addEventListener('change',e=>dispatch({type:'select',value:Number(e.target.value)}));media.addEventListener('change',motion);
 function initialize(){
  if(initialized)return;initialized=true;build();resize();render();motion();setTimeout(fitLabels,600);document.fonts?.ready.then(fitLabels);new ResizeObserver(resize).observe(stage);root.dataset.ready='true';
  if(!('IntersectionObserver' in window)){entered=true;geometry();return;}
  const entry=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){entered=true;root.classList.add('skills-entered');geometry();entry.disconnect();}},{threshold:.2});entry.observe(stage);
 }
 if(location.hash==='#skills'||!('IntersectionObserver' in window))initialize();
 else{const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){initialize();observer.disconnect();}},{rootMargin:'150% 0px'});observer.observe(root);}
})();
