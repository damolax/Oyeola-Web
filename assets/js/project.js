(() => {
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 const slug=new URLSearchParams(location.search).get('slug')||location.pathname.split('/').filter(Boolean).pop()?.replace('.html','');
 const STATIC_PROJECTS={
  'busy-moms-money-reset-hyperlinked-planner':{
    slug:'busy-moms-money-reset-hyperlinked-planner',
    title:"The Busy Mom's Money Reset - Hyperlinked Planner",
    excerpt:'A 60-page premium hyperlinked iPad money planner built around a clear money-reset workflow.',
    data:{
      industry:'Digital Planner / Personal Finance',platform:'Hyperlinked PDF',service:'Digital Planner Design',year:'2026',
      thumbnail_url:'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech/oyeola-media/portfolio/planners/busy-moms-money-reset-cover.jpg',hero_image_url:'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech/oyeola-media/portfolio/planners/busy-moms-money-reset-cover.jpg',sample_pdf_url:'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech/oyeola-media/portfolio/planners/busy-moms-money-reset-watermarked.pdf',download_url:'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech/oyeola-media/portfolio/planners/busy-moms-money-reset-watermarked.pdf',
      gallery:[{url:'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech/oyeola-media/portfolio/planners/busy-moms-money-reset-cover.jpg',caption:'Planner cover',type:'image'}],
      skills:['Hyperlink Architecture','Digital Planner UX','PDF Navigation','Information Architecture','Page System Design'],
      story:{
        goal:'Create a planner that helps busy mothers move from money overwhelm to a repeatable reset routine.',
        challenge:'The planner needed to hold many financial workflows without feeling heavy while keeping navigation fast on a tablet.',
        solution:'A 60-page system with a central home page, category menus, right-edge navigation tabs and linked worksheets across income, bills, spending, savings, debt and monthly reset sections.',
        result:'A planner that can be explored like a small app, with fast jumps between sections and a complete money-reset flow.'
      },
      branding:{logo_designed:false,identity_designed:true},protected_sample:true
    }
  },
  'busy-moms-money-reset-printable-planner':{
    slug:'busy-moms-money-reset-printable-planner',
    title:"The Busy Mom's Money Reset - Printable Planner",
    excerpt:'A printable companion edition built for clear at-home planning and repeat use.',
    data:{
      industry:'Printable Planner / Personal Finance',platform:'Printable PDF',service:'Digital Planner Design',year:'2026',
      thumbnail_url:'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech/oyeola-media/portfolio/planners/busy-moms-money-reset-cover.jpg',hero_image_url:'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech/oyeola-media/portfolio/planners/busy-moms-money-reset-cover.jpg',gallery:[{url:'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech/oyeola-media/portfolio/planners/busy-moms-money-reset-cover.jpg',caption:'Printable planner cover',type:'image'}],
      skills:['Printable Product Design','Information Architecture','Financial Planner Layout','Page System Design','PDF Production'],
      story:{
        goal:'Create a printable version that keeps the same money-reset structure while working naturally on paper.',
        challenge:'The layouts needed enough writing space and repeated planning systems without feeling crowded.',
        solution:'US Letter and A4 printable editions with a consistent visual system covering paychecks, bills, spending, savings, debt and monthly resets.',
        result:'A cohesive printable product that extends the planner system beyond tablet use.'
      },
      branding:{logo_designed:false,identity_designed:true}
    }
  }
 };
 let gallery=[],index=0;
 function setMain(i){if(!gallery.length)return;index=(i+gallery.length)%gallery.length;const item=gallery[index],img=$('[data-project-main-image]');img.src=item.url;img.alt=item.caption||'';$('[data-gallery-count]').textContent=(index+1)+' / '+gallery.length;$$('[data-thumb]').forEach((t,n)=>t.classList.toggle('active',n===index))}
 async function load(){
   let project=null;
   try{const r=await fetch('/api/content?type=project');const d=await r.json();project=(d.items||[]).find(x=>x.slug===slug)}catch{}
   if(!project) project=STATIC_PROJECTS[slug]||null;
   if(!project){$('[data-project-title]').textContent='Project not found';$('[data-project-excerpt]').textContent='This portfolio story is not published yet.';return}
   const d=project.data||{},summary=project.excerpt||d.excerpt||d.summary||'';
   document.title=project.title+' | Oyeola Online'; $('[data-project-title]').textContent=project.title;$('[data-project-excerpt]').textContent=summary;

   const media=Array.isArray(d.gallery)?d.gallery:(Array.isArray(d.media)?d.media:[]);
   gallery=media.map(x=>typeof x==='string'?{url:x,caption:project.title}:x).filter(x=>x?.url);
   const hero=d.hero_image_url||d.cover_url||d.thumbnail_url;
   if(hero&&!gallery.some(x=>x.url===hero))gallery.unshift({url:hero,caption:'Project preview'});
   if(gallery.length){
     $('[data-project-thumbs]').innerHTML=gallery.map((x,i)=>`<button data-thumb="${i}"><img src="${x.url}" alt="${esc(x.caption||project.title)}"></button>`).join('');
     $$('[data-thumb]').forEach(b=>b.onclick=()=>setMain(Number(b.dataset.thumb)));setMain(0);
   }else{
     $('.project-gallery')?.setAttribute('hidden','');
   }
   $('[data-gallery-prev]').onclick=()=>setMain(index-1);$('[data-gallery-next]').onclick=()=>setMain(index+1);

   const video=d.video_url||(Array.isArray(d.media)?d.media.find(x=>x?.type==='video')?.url:'');
   if(video){const shell=$('[data-video-shell]'),v=$('[data-project-video]');shell.hidden=false;v.src=video;shell.addEventListener('mouseenter',()=>v.play().catch(()=>{}));shell.addEventListener('mouseleave',()=>{v.pause();v.currentTime=0});shell.addEventListener('click',()=>{v.muted=!v.muted;if(v.paused)v.play().catch(()=>{})})}

   const facts=[
     ['Industry',d.industry],
     ['Service',d.service||(Array.isArray(d.service_slugs)?d.service_slugs.join(', '):'')],
     ['Platform',d.platform],
     ['Year',d.year]
   ].filter(x=>x[1]);
   $('[data-project-facts]').innerHTML=facts.map(x=>`<div><span>${esc(x[0])}</span><strong>${esc(x[1])}</strong></div>`).join('')+(d.live_url?`<a class="btn small" href="${d.live_url}" target="_blank" rel="noopener">View live website ↗</a>`:'');

   const s=typeof d.story==='object'&&d.story?d.story:{goal:d.client_goal,challenge:d.challenge,solution:d.solution,result:d.result};
   const blocks=[['Client goal',s.goal||d.client_goal],['The challenge',s.challenge||d.challenge],['What I built',s.solution||d.solution],['The improved journey',s.result||d.result]].filter(x=>x[1]);
   const branding=d.branding||{logo_designed:d.logo_designed,identity_designed:!!d.branding_scope};
   if(branding?.logo_designed||branding?.identity_designed)blocks.push(['Branding contribution',[branding.logo_designed?'Logo design':'',branding.identity_designed?(d.branding_scope||'Brand identity'):''].filter(Boolean).join(' · ')]);
   $('[data-project-story]').innerHTML=blocks.map(x=>`<article><p class="eyebrow">${esc(x[0])}</p><h2>${esc(x[1])}</h2></article>`).join('');

   const full=d.fullpage_image_url||d.full_page_url;
   if(full){$('[data-project-fullpage-section]').hidden=false;$('[data-project-fullpage]').src=full;$('[data-project-fullpage]').alt=project.title+' full-page website preview'}

   if(d.sample_pdf_url){
     const section=$('[data-project-pdf-section]'); section.hidden=false;
     $('[data-project-pdf]').src=d.sample_pdf_url+'#toolbar=1&navpanes=0&view=FitH';
     $('[data-project-pdf-open]').href=d.sample_pdf_url;
     $('[data-project-pdf-download]').href=d.download_url||d.sample_pdf_url;
     $('[data-project-pdf-download]').setAttribute('download',(project.slug||'oyeola-planner-sample')+'.pdf');
   }

   $('[data-project-tools]').innerHTML=(d.tools||[]).map(x=>`<span>${esc(x)}</span>`).join('');
   $('[data-project-skills]').innerHTML=(d.skills||[]).map(x=>`<span>${esc(x)}</span>`).join('');
   const demo=d.related_demo||d.related_demo_slug;
   const demoBtn=$('[data-project-demo]');
   if(demo){
     const routes={
       wedding:'demo-wedding.html',ecommerce:'demo-ecommerce.html',travel:'demo-travel.html',
       realestate:'demo-real-estate.html',hospitality:'demo-hospitality.html',beauty:'demo-beauty.html',
       therapy:'demo-therapy.html',professional:'demo-professional-services.html',
       homeservices:'demo-home-services.html',education:'demo-education.html',saas:'demo-saas.html',
       nonprofit:'demo-nonprofit.html',operations:'operations-demo.html',planner:'planner-demo.html',
       'smart-match':'smart-match.html',configure:'configure.html'
     };
     demoBtn.href=routes[String(demo).toLowerCase()]||'demos.html';
   }else{demoBtn.hidden=true}
 }
 load();
})();