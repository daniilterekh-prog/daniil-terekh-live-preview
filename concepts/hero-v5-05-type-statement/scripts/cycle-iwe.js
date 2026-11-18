(function(root){
 const clamp=n=>Math.max(0,Math.min(1,n)),smooth=(a,b,p)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
 function state(p){return {shift:smooth(.15,.5,p),e:smooth(.35,.72,p),w:smooth(.27,.74,p),w1:smooth(.27,.58,p),w2:smooth(.34,.65,p),w3:smooth(.41,.72,p),w4:smooth(.48,.79,p),result:smooth(.79,.98,p)}}
 function mobileTravel(viewportHeight){return Math.max(480,Math.min(720,viewportHeight*.95))}
 function entryProgress(sectionTop,viewportTop,viewportHeight){return clamp((viewportTop-sectionTop)/mobileTravel(viewportHeight))}
 if(typeof module==='object'&&module.exports){module.exports={state,entryProgress,mobileTravel};return}
 const section=document.querySelector('#cycle.cycle-iwe');if(!section)return;
 const svg=section.querySelector('.cycle-letter-art'),signatures=section.querySelector('.cycle-signatures');
 const frame=section.querySelector('.cycle-composition'),button=section.querySelector('.cycle-motion'),reduced=matchMedia('(prefers-reduced-motion:reduce)'),natural=matchMedia('(max-width:800px) and (orientation:portrait)');let visible=false,queued=0,last=-1,override=false;
 const staticScene=()=>reduced.matches&&!override;
 function paint(){queued=0;if(!visible)return;const r=section.getBoundingClientRect(),top=root.DTViewport?.top()||52,travel=Math.max(1,section.offsetHeight-frame.offsetHeight),p=staticScene()?1:natural.matches?entryProgress(r.top,top,root.DTViewport?.contentHeight?.()||innerHeight-top):clamp((top-r.top)/travel);if(p===last)return;last=p;const s=state(p);for(const key of ['shift','e','w','w1','w2','w3','w4','result'])section.style.setProperty('--iwe-'+key,s[key]);const matrix=svg.getScreenCTM();if(matrix){const left=signatures.getBoundingClientRect().left;section.style.setProperty('--iwe-person-anchor',(matrix.e+(292-100.3*s.shift)*matrix.a-left)+'px');section.style.setProperty('--iwe-team-anchor',(matrix.e+457*matrix.a-left)+'px');}}
 function queue(){if(visible&&!queued)queued=requestAnimationFrame(paint)}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;queue()}).observe(section);
 function measure(){section.style.setProperty('--iwe-mobile-height',frame.offsetHeight+'px');section.style.setProperty('--iwe-mobile-travel',mobileTravel(root.DTViewport?.contentHeight?.()||innerHeight-(root.DTViewport?.top()||52))+'px');last=-1;queue()}
 function syncMotion(){section.dataset.iweMotion=String(!staticScene());button.hidden=!reduced.matches;button.textContent=staticScene()?button.dataset.play:button.dataset.pause;button.setAttribute('aria-pressed',String(!staticScene()));measure()}
 button.addEventListener('click',()=>{override=!override;syncMotion()});
 root.addEventListener('scroll',queue,{passive:true});root.addEventListener('resize',measure,{passive:true});natural.addEventListener('change',measure);reduced.addEventListener('change',()=>{override=false;syncMotion()});syncMotion();
 if(typeof ResizeObserver==='function')new ResizeObserver(measure).observe(frame);
 if(document.fonts)document.fonts.ready.then(measure);
})(globalThis);
