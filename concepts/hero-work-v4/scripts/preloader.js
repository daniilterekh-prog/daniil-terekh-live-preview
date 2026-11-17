(function(){
 'use strict';
 const boot=window.DTIntro,root=document.documentElement;
 if(!boot||root.dataset.preloader!=='loading')return;
 const overlay=document.getElementById('siteIntro'),skip=document.getElementById('introSkip');
 if(!overlay||!skip){boot.done();return}
 for(const id of ['siteHeader','site']){const node=document.getElementById(id);if(node){boot.background.push([node,node.inert]);node.inert=true}}
 overlay.hidden=false;
 function close(){if(root.dataset.preloader!=='loading')return;root.dataset.preloader='closing';setTimeout(boot.done,320)}
 skip.addEventListener('click',close);
 skip.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close()}else if(event.key==='Tab'){event.preventDefault();skip.focus({preventScroll:true})}});
 overlay.addEventListener('pointerdown',close);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)boot.done()});
 window.addEventListener('hashchange',close);
 window.addEventListener('pagehide',boot.done);
 window.addEventListener('pageshow',event=>{if(event.persisted)boot.done()});
 const motion=matchMedia('(prefers-reduced-motion:reduce)');motion.addEventListener('change',()=>{if(motion.matches)boot.done()});
 Promise.resolve(document.fonts?.ready).catch(()=>{}).then(()=>{if(root.dataset.preloader==='loading')setTimeout(close,700)});
})();
