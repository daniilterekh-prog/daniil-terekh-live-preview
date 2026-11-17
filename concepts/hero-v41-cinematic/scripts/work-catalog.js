(function(root){
 'use strict';
 const disciplines={websites:'Websites',ppc:'PPC',seo:'SEO',analytics:'Analytics',crm:'CRM & automation',strategy:'Strategy',creative:'Creative',leadership:'Leadership'};
 const normalizeFilter=value=>Object.hasOwn(disciplines,value)?value:'all';
 const matchingProjects=(projects,value)=>{const key=normalizeFilter(value);return key==='all'?projects:projects.filter(project=>project.disciplines.includes(key));};
 const api={disciplines,normalizeFilter,matchingProjects};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTWorkCatalog=api;
})(typeof window==='undefined'?globalThis:window);
