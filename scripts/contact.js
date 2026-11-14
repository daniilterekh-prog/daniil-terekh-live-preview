(function(){
 'use strict';
 const dialog=document.getElementById('connect');
 if(!dialog)return;
 const closeButton=document.getElementById('connect-close');
 const email=document.getElementById('connect-email');
 const telegram=document.getElementById('connect-telegram');
 const whatsapp=document.getElementById('connect-whatsapp');
 const context=document.getElementById('connect-context');
 const status=document.getElementById('copy-status');
 const callback=document.getElementById('callback-form');
 const phone=document.getElementById('callback-phone');
 const phoneError=document.getElementById('callback-error');
 const callbackText=document.getElementById('callback-text');
 const callbackChannel=document.getElementById('callback-channel');
 const callbackSubmit=document.getElementById('callback-submit');
 const callbackLabel=document.getElementById('callback-submit-label');
 const wechatNumber=document.getElementById('wechat-number');
 const wechatStatus=document.getElementById('wechat-status');
 const panelButtons=[...dialog.querySelectorAll('[data-connect-panel]')];
 const address='daniilterekh@gmail.com';
 const chatDestinations={telegram:new URL(telegram.href).origin+new URL(telegram.href).pathname,whatsapp:new URL(whatsapp.href).origin+new URL(whatsapp.href).pathname};
 let opener=null,backdropDown=false,topic='';
 function updateCallbackChannel(){
  const channel=callbackChannel.value;
  const label=channel==='email'?'Open email draft':channel==='whatsapp'?'Continue in WhatsApp':'Continue in Telegram';
  callbackLabel.textContent=label;
  callbackSubmit.setAttribute('aria-label',label+(channel==='email'?' (opens your email app)':' (opens in a new tab)'));
  callback.action=chatDestinations[channel]||chatDestinations.telegram;
  callbackText.value='';
 }
 callbackChannel.addEventListener('change',updateCallbackChannel);
 function resetCallback(){
  callback.reset();
  updateCallbackChannel();
  phone.removeAttribute('aria-invalid');
  phoneError.textContent='';
 }
 function resetPanels(){
  for(const button of panelButtons){
   button.setAttribute('aria-expanded','false');
   document.getElementById(button.getAttribute('aria-controls')).hidden=true;
  }
  resetCallback();wechatStatus.textContent='';
 }
 function open(trigger){
  if(dialog.open)return;
  opener=trigger||document.activeElement;
  topic=trigger?.dataset.contactTopic||'';
  if(trigger?.closest('#detailPage'))topic='About '+document.getElementById('detailName').textContent;
  context.textContent=topic;context.hidden=!topic;
  const intent=trigger?.dataset.contactIntent;
  const greeting=intent==='role'?'Hi Daniil! I’d like to discuss a role on our team.':'Hi Daniil! I’d like to discuss a project.';
  const brief=intent==='role'?'Company and team:\nRole and responsibilities:\nWorking format:':'Goal:\nWhat we have now:\nTiming:';
  const draft=intent==='project'||intent==='role'?greeting+'\n\n'+(topic?topic+'\n\n':'')+brief:topic?'Hi Daniil! I’d like to connect.\n\n'+topic+'\n\n':'Hi Daniil! I’d like to discuss a project or a role with you.';
  email.href='mailto:'+address+'?subject='+encodeURIComponent(topic||'Let’s connect')+'&body='+encodeURIComponent(draft);
  for(const link of [telegram,whatsapp]){
   const chat=new URL(link.href);chat.searchParams.set('text',draft);link.href=chat.href;
  }
  resetPanels();
  status.textContent='';
  window.DTScenes?.goTo(scrollY);
  document.documentElement.classList.add('connect-open');
  dialog.showModal();
  dialog.scrollTop=0;
  closeButton.focus({preventScroll:true});
  if(trigger?.dataset.contactChannel==='wechat')document.getElementById('connect-wechat').click();
 }
 for(const button of panelButtons)button.addEventListener('click',()=>{
  const show=button.getAttribute('aria-expanded')!=='true';
  for(const item of panelButtons){
   const active=item===button&&show;
   item.setAttribute('aria-expanded',String(active));
   document.getElementById(item.getAttribute('aria-controls')).hidden=!active;
  }
  if(show){
   const panel=document.getElementById(button.getAttribute('aria-controls'));
   panel.querySelector('input:not([type="hidden"]),button').focus({preventScroll:true});
   panel.scrollIntoView({block:'nearest',behavior:'instant'});
  }
 });
 phone.addEventListener('input',()=>{
  phone.removeAttribute('aria-invalid');phoneError.textContent='';callbackText.value='';
 });
 callback.addEventListener('submit',event=>{
  const number=phone.value.trim().replace(/[\s().-]/g,'').replace(/^00/,'+');
  if(!/^\+[1-9]\d{6,14}$/.test(number)){
   event.preventDefault();
   callbackText.value='';
   phone.setAttribute('aria-invalid','true');
   phoneError.textContent='Enter your number with a country code, e.g. +44 7700 900123.';
   phone.focus();return;
  }
  phone.removeAttribute('aria-invalid');phoneError.textContent='';
  const draft='Hi Daniil! I’d like to request a call.\n\nMy phone number: '+number+(topic?'\n\n'+topic:'');
  if(callbackChannel.value==='email'){
   event.preventDefault();callbackText.value='';
   location.href='mailto:'+address+'?subject='+encodeURIComponent('Call request'+(topic?' — '+topic:''))+'&body='+encodeURIComponent(draft);
   return;
  }
  callback.action=chatDestinations[callbackChannel.value]||chatDestinations.telegram;
  callbackText.value=draft;
  // Native GET opens a draft; the visitor sends it in their chosen app.
 });
 function outside(event){
  const r=dialog.getBoundingClientRect();
  return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;
 }
 document.addEventListener('click',event=>{
  const trigger=event.target instanceof Element?event.target.closest('[data-contact-open]'):null;
  if(!trigger||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();open(trigger);
 });
 closeButton.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('pointerdown',event=>{backdropDown=event.target===dialog&&outside(event);});
 dialog.addEventListener('click',event=>{if(backdropDown&&event.target===dialog&&outside(event))dialog.close();backdropDown=false;});
 dialog.addEventListener('close',()=>{
  resetPanels();topic='';
  document.documentElement.classList.remove('connect-open');
  if(location.hash==='#connect'){
   history.replaceState(history.state,'',location.pathname+location.search+'#contact');
   document.getElementById('contact').scrollIntoView({behavior:'instant',block:'start'});
   opener=document.getElementById('contact-cta');
  }
  if(opener?.isConnected&&!opener.closest('[hidden],[inert]'))opener.focus({preventScroll:true});
  opener=null;
 });
 document.getElementById('copy-email').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(address);status.textContent='Email copied.';}
  catch{status.textContent='Select the email address above to copy it.';}
 });
 document.getElementById('copy-wechat').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(wechatNumber.textContent.replace(/\s/g,''));wechatStatus.textContent='Number copied. Add me by phone in WeChat.';}
  catch{wechatStatus.textContent='Select the number above to copy it, then add me in WeChat.';}
 });
 function route(){
  if(location.hash==='#connect')open();
  else if(dialog.open)dialog.close();
 }
 window.addEventListener('hashchange',route);
 requestAnimationFrame(route);
})();
