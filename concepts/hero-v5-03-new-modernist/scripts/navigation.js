(function(){
 'use strict';
 const header=document.getElementById('siteHeader'),main=document.getElementById('mainPage');
 const toggle=document.getElementById('headerMenuToggle'),nav=document.getElementById('headerNavigation');
 const narrow=matchMedia('(max-width:800px)');
 const links=Array.from(nav.querySelectorAll('[data-nav-target]'));
 const menuMotion=window.DTMenuMotion.create(nav,links,matchMedia('(prefers-reduced-motion:reduce)'));
 const targets={home:'hero',...Object.fromEntries((window.DTChapters||[]).map(chapter=>[chapter.id,chapter.id]))};
 const groups={hero:null,work:'work',thinking:'thinking','the-edit':'thinking',skills:'skills',services:'services',cycle:'services',human:'human',contact:null,'site-footer':null};
 let open=false,observer,pendingHeaderTarget=null;
 function setMenu(value,restoreFocus=false){
  open=narrow.matches&&value;header.dataset.menuOpen=String(open);
  if(open)window.DTScenes?.goTo(scrollY);
  document.documentElement.classList.toggle('nav-open',open);
  toggle.hidden=!narrow.matches;toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
  toggle.querySelector('span').textContent=open?'Close':'Menu';
  menuMotion.render(open,narrow.matches);
  if(restoreFocus)toggle.focus({preventScroll:true});
 }
 header.classList.add('is-enhanced');menuMotion.render(false,narrow.matches,false);setMenu(false);
 toggle.addEventListener('click',()=>setMenu(!open));
 header.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&open){event.preventDefault();setMenu(false,true);}
 });
 header.addEventListener('focusout',()=>requestAnimationFrame(()=>{
  if(open&&!header.contains(document.activeElement))setMenu(false);
 }));
 document.addEventListener('pointerdown',event=>{if(open&&!header.contains(event.target))setMenu(false);});
 narrow.addEventListener('change',()=>{
  const focusWasToggle=document.activeElement===toggle;setMenu(false);
  if(focusWasToggle&&!narrow.matches)links[0].focus({preventScroll:true});
 });
 header.addEventListener('click',event=>{if(event.target instanceof Element&&event.target.closest('a'))setMenu(false);});
 // Standalone pages use native links and scrolling, with the same disclosure menu.
 if(document.body.dataset.page)return;
 function activate(key){
  for(const link of links){
   if(link.dataset.navTarget==='work'){if(main.hidden)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');continue;}
   if(link.dataset.navTarget==='services'){link.removeAttribute('aria-current');continue;}
   if(link.dataset.navTarget===key)link.setAttribute('aria-current',main.hidden?'page':'location');
   else link.removeAttribute('aria-current');
  }
 }
 function goToSection(key,smooth=false,focus=false){
  const target=document.getElementById(targets[key]);if(!target||main.hidden)return;
  const inset=window.DTViewport.top(),top=scrollY+target.getBoundingClientRect().top-inset;
  const position=target.id==='hero'?0:(window.DTScenes?.getStops().find(p=>p.ids.includes(target.id))?.y??top);
  if(smooth&&window.DTScenes)window.DTScenes.goTo(position);
  else scrollTo({top:position,behavior:'instant'});
  if(focus){const heading=target.querySelector('h1,h2')||target;heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  activate(groups[targets[key]]);
 }
 function afterRoute(key,smooth=false,focus=false){
  requestAnimationFrame(()=>requestAnimationFrame(()=>goToSection(key,smooth,focus)));
 }
 document.addEventListener('click',event=>{
  const link=event.target instanceof Element?event.target.closest('a[href^="#"]'):null;if(!link)return;
  if(link.id==='contactBtn'){setMenu(false);return;}
  const key=link.getAttribute('href').slice(1);
  if(!Object.hasOwn(targets,key)||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();setMenu(false);
  if(main.hidden){pendingHeaderTarget=key;location.hash='#'+key;}
  else{
   if(location.hash!=='#'+key)history.pushState(null,'','#'+key);
   goToSection(key,true,true);
  }
 });
 window.addEventListener('hashchange',()=>{
  setMenu(false);
  const key=location.hash.slice(1);
  if(pendingHeaderTarget){const target=pendingHeaderTarget;pendingHeaderTarget=null;afterRoute(target,true,true);}
  // Case Back restores its saved Work position in work.js, not the first project.
  else if(Object.hasOwn(targets,key)&&key!=='work')afterRoute(key);
  if(main.hidden)activate('work');
 });
 function observeSections(){
  observer?.disconnect();
  const sections=Array.from(main.children).filter(el=>Object.hasOwn(groups,el.id));
  const inset=window.DTViewport.top(),line=inset+window.DTViewport.contentHeight()*.25;
  observer=new IntersectionObserver(()=>{
   if(main.hidden){activate('work');return;}
   const current=[...sections].reverse().find(el=>el.getBoundingClientRect().top<=line);
   activate(current?groups[current.id]:null);
  },{rootMargin:`-${inset}px 0px -${Math.max(0,innerHeight-line)}px 0px`,threshold:0});
  sections.forEach(section=>observer.observe(section));
 }
 window.addEventListener('resize',observeSections,{passive:true});observeSections();
 const initial=location.hash.slice(1);
 if(Object.hasOwn(targets,initial))afterRoute(initial);
 else if(main.hidden)activate('work');
 document.getElementById('footer-top').addEventListener('click',()=>{if(location.hash!=='#home')history.pushState(null,'','#home');goToSection('home',true,true);});
})();
