(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const path=location.pathname.toLowerCase(),root=/\/(case-studies|services)\//.test(path)?'../':'';
 const navDetails=$('.nav-services'),nav=$('.nav-links'),menu=$('.menu-btn');
 document.addEventListener('pointerdown',e=>{if(navDetails&&!navDetails.contains(e.target))navDetails.open=false});
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(navDetails?.open){navDetails.open=false;navDetails.querySelector('summary')?.focus()}if(nav?.classList.contains('open')){nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.focus()}});
 $$('.nav-services-menu a').forEach(a=>a.addEventListener('click',()=>{if(navDetails)navDetails.open=false}));
 const work=$('[data-cms-projects]');
 if(work){
   const buttons=$$('[data-work-filter]'),search=$('#work-search'),count=$('#work-count');
   let group='all';
   const classify=card=>{const s=(card.textContent+' '+(card.querySelector('img')?.alt||'')+' '+(card.querySelector('img')?.src||'')).toLowerCase();return /planner|hyperlinked pdf|digital product/.test(s)?'products':/analytics|dashboard|operations|crm|automation|tracking/.test(s)?'systems':'websites'};
   const apply=()=>{const q=(search?.value||'').trim().toLowerCase();let shown=0;$$('.project-card',work).forEach(card=>{const yes=(group==='all'||classify(card)===group)&&(!q||card.textContent.toLowerCase().includes(q));card.hidden=!yes;if(yes)shown++});if(count)count.textContent=shown+(shown===1?' project':' projects')+' to explore'};
   buttons.forEach(b=>b.addEventListener('click',()=>{group=b.dataset.workFilter;buttons.forEach(x=>{const selected=x===b;x.classList.toggle('active',selected);x.setAttribute('aria-pressed',String(selected))});apply()}));
   search?.addEventListener('input',apply);new MutationObserver(apply).observe(work,{childList:true});apply();
 }
 const directory=$('[data-filterable-demos]');
 if(directory){
   const cards=$$(':scope > .demo-directory-card',directory),buttons=$$('[data-demo-filter]'),count=$('#demo-filter-count');
   const featured=['demo-ecommerce.html','demo-beauty.html','demo-professional-services.html'];
   const category=card=>{const t=card.querySelector('span')?.textContent.toLowerCase()||'';return /ecommerce|travel/.test(t)?'commerce':/wedding|beauty|therapy|hospitality/.test(t)?'booking':'business'};
   const apply=key=>{let n=0;cards.forEach(c=>{const show=key==='all'||(key==='featured'?featured.includes(c.getAttribute('href')):category(c)===key);c.hidden=!show;if(show)n++});buttons.forEach(b=>{const on=b.dataset.demoFilter===key;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});if(count)count.textContent=key==='featured'?'Three starting points. Explore a category or view all 12.':n+' interactive examples'};
   buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.demoFilter)));apply('featured');
 }
 if(path==='/'||/\/index(?:\.html)?$/.test(path)){
   const work=$('[data-home-work-carousel]')?.closest('section'),demos=$('.feature-grid')?.closest('section'),about=$('.home-about')?.closest('section'),reviews=$('[data-cms-reviews]')?.closest('section');
   if(work&&demos) demos.before(work);
   if(about&&reviews) reviews.after(about);
   const track=$('[data-home-work-track]');if(track){track.tabIndex=0;track.setAttribute('aria-label','Scrollable gallery of real portfolio projects')}
 }
 if(/\/about(?:\.html)?$/.test(path)){
   const sections=$$('main > section.section'),extra=sections.filter(x=>/Formal education|Learning has been|What I actually bring|2020 → 2026/.test(x.querySelector('h2')?.textContent||'')),proof=sections.find(x=>x.textContent.includes('Do not take the biography alone'));
   if(extra.length&&proof){const details=document.createElement('details');details.className='about-background';details.innerHTML='<summary><span><strong>More about my background</strong><small>Education, training and experience</small></span><span class="details-indicator" aria-hidden="true">+</span></summary><div class="about-background-inner"></div>';proof.before(details);extra.forEach(s=>$('.about-background-inner',details).appendChild(s))}
 }
 if(/\/contact(?:\.html)?$/.test(path)){
   const grid=$('.lead-form .form-grid');if(grid){const fields=['#contact-timeline','#contact-url'].map(s=>$(s)?.closest('.field')).filter(Boolean);if(fields.length){const d=document.createElement('details');d.className='optional-fields field full';d.innerHTML='<summary>Optional: timeline and website link <span aria-hidden="true">+</span></summary><div class="optional-fields-inner"></div>';grid.appendChild(d);fields.forEach(f=>$('.optional-fields-inner',d).appendChild(f))}}
 }
 if(path.includes('/case-studies/')){
   const projects=[['one-love-beauty','One Love Beauty'],['guestwork-property-management','Guestwork Property Management'],['bare-canvas-media','Bare Canvas Media'],['zentravels','ZenTravels'],['three-nails-one-cross','3 Nails 1 Cross'],['dr-akira','Dr. Akira'],['bambo-oladipo','Bambo Oladipo'],['shop-ship-express-analytics','Shop & Ship Express Analytics'],['concierge-wellness','Concierge Wellness'],['davinci-resolve-craftsman','DaVinci Resolve Craftsman'],['latonya-speaks','Latonya Speaks'],['somatra-healing','Somatra Healing'],['vapourvend','VapourVend']];
   const i=projects.findIndex(p=>p[0]===path.split('/').pop().replace('.html',''));
   if(i>=0&&$('main')){const next=projects[(i+1)%projects.length];$('main').insertAdjacentHTML('beforeend','<nav class="next-project container" aria-label="Next portfolio project"><span>Keep exploring</span><a href="'+next[0]+'.html"><strong>'+next[1]+'</strong><span aria-hidden="true">↗</span></a></nav>')}
 }
 if(/^\/demo-[a-z-]+(?:\.html)?$/.test(path)){const top=$('.id-demo-top');if(top&&!$('.demo-disclaimer'))top.insertAdjacentHTML('afterend','<p class="demo-disclaimer">Interactive concept · No real booking, order or personal information is submitted in this demo.</p>')}
})();
