(function(root){
 'use strict';
 function create(panel,items,reduced){
  let state=null,narrowState=null,revision=0,animations=[];
  function cancel(){animations.forEach(animation=>animation.cancel());animations=[];}
  function render(show,narrow,animate=true){
   if(state===show&&narrowState===narrow)return;
   state=show;narrowState=narrow;
   const token=++revision,visible=!panel.hidden,nodes=[panel,...items];
   const from=visible&&animate?nodes.map(node=>{const css=panel.ownerDocument.defaultView.getComputedStyle(node);return {opacity:css.opacity,transform:css.transform,...(node===panel?{clipPath:css.clipPath&&css.clipPath!=='none'?css.clipPath:'inset(0 0 0% 0)'}:{})};}):null;
   cancel();panel.inert=narrow&&!show;
   if(narrow&&!show)panel.setAttribute('aria-hidden','true');else panel.removeAttribute('aria-hidden');
   if(!narrow){panel.hidden=false;return;}
   if(!animate||reduced.matches||typeof panel.animate!=='function'||(!show&&!visible)){panel.hidden=!show;return;}
   panel.hidden=false;
   const entrance={opacity:0,transform:'translateY(-8px)',clipPath:'inset(0 0 100% 0)'};
   const parent=panel.animate([from?.[0]||entrance,{opacity:show?1:0,transform:show?'none':'translateY(-6px)',clipPath:show?'inset(0 0 0% 0)':'inset(0 0 100% 0)'}],{duration:show?600:260,easing:'cubic-bezier(.22,.8,.25,1)',fill:'both'});
   animations.push(parent);
   items.forEach((item,index)=>animations.push(item.animate([
    from?.[index+1]||{opacity:0,transform:'translateY(18px)'},
    {opacity:show?1:0,transform:show?'none':'translateY(-3px)'}
   ],{duration:show?480:180,delay:show?70+index*32:0,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})));
   const last=show?animations.at(-1):parent;
   last.onfinish=()=>{if(token!==revision)return;if(!show)panel.hidden=true;cancel();};
  }
  return {render};
 }
 const api={create};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTMenuMotion=api;
})(globalThis);
