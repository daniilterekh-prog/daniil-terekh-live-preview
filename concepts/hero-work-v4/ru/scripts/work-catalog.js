(function(root){
 'use strict';
 const disciplines={websites:"Сайты",ppc:"Контекстная реклама",seo:'SEO',analytics:"Аналитика",crm:"CRM и автоматизация",strategy:"Стратегия",creative:"Креатив",leadership:"Руководство"};
 const normalizeFilter=value=>Object.hasOwn(disciplines,value)?value:'all';
 const matchingProjects=(projects,value)=>{const key=normalizeFilter(value);return key==='all'?projects:projects.filter(project=>project.disciplines.includes(key));};
 const api={disciplines,normalizeFilter,matchingProjects};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTWorkCatalog=api;
})(typeof window==='undefined'?globalThis:window);
