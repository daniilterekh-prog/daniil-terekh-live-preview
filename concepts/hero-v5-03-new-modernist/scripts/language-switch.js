(function(){
 'use strict';
 const links=[...document.querySelectorAll('[data-language-switch]')];
 const targets=links.map(link=>new URL(link.getAttribute('href'),location.href));
 function sync(){links.forEach((link,index)=>{const target=new URL(targets[index]);target.search=location.search;target.hash=location.hash;link.href=target.href;});}
 sync();window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);
})();
