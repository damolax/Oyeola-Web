(function hydratePortfolioOriginals(){
 const isCase=location.pathname.includes('/case-studies/');
 const list=document.querySelectorAll('a[href*="case-studies/"]');
 if(!isCase&&!list.length)return;
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const allowed=x=>{try{const u=new URL(x,location.origin);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return''}};
 fetch('/api/content?type=project').then(r=>r.ok?r.json():{items:[]}).then(({items=[]})=>{
  const bySlug=new Map(items.map(x=>[x.slug,x]));
  for(const a of list){const m=a.getAttribute('href')?.match(/case-studies\/([^/?#]+)(?:\.html)?/);if(!m)continue;const slug=m[1].replace(/\.html$/,'');const data=bySlug.get(slug)?.data||{};const url=allowed(data.fullpage_image_url||data.hero_image_url);if(!url)continue;const image=a.querySelector('img');if(image&&image.src!==url){image.src=url;image.alt=(bySlug.get(slug)?.title||slug)+' — original project screenshot';image.style.objectPosition='top center';image.style.objectFit='contain';image.loading='lazy';}}
  if(!isCase)return;
  const slug=location.pathname.split('/').pop().replace(/\.html$/,''),record=bySlug.get(slug),d=record?.data||{},url=allowed(d.fullpage_image_url||d.hero_image_url);if(!url)return;
  const title=record?.title||document.querySelector('h1')?.textContent||'Portfolio project';
  const hero=document.querySelector('.case-screen');
  if(hero){hero.innerHTML='<img class="oy-original-hero oy-can-zoom" src="'+esc(url)+'" alt="'+esc(title)+' — original full-page screenshot" tabindex="0" role="button" title="Open full-resolution screenshot">';hero.classList.add('oy-has-original');}
  const stage=document.querySelector('.oy-project-opening .oy-project-stage');
  if(stage){stage.innerHTML='<img class="oy-original-hero oy-can-zoom" src="'+esc(url)+'" alt="'+esc(title)+' — original website screenshot" tabindex="0" role="button" title="Open full-resolution screenshot">';stage.classList.add('oy-has-original');}
  const illustrative=document.querySelector('.project-video img');if(illustrative){illustrative.src=url;illustrative.alt=title+' original screenshot';illustrative.style.objectFit='contain'}
  const note=document.querySelector('.case-study-visual-note');if(note)note.remove();
  const insertAfter=document.querySelector('.case-hero,.oy-project-opening');if(!insertAfter)return;
  if(!document.querySelector('[data-original-portfolio-showcase]')){
    const section=document.createElement('section');section.className='section oy-original-portfolio-showcase';section.dataset.originalPortfolioShowcase='';
    const gallery=Array.isArray(d.gallery)?d.gallery.filter(x=>x&&allowed(x.url)):[],other=[...new Set([url,...gallery.map(x=>allowed(x.url))])].slice(0,10);
    section.innerHTML='<div class="container"><div class="section-head"><div><p class="eyebrow">Original project screenshots</p><h2>Explore the completed work.</h2><p>Click an image to zoom in and inspect the original screenshot.</p></div></div><div class="oy-authentic-gallery">'+other.map((u,i)=>'<figure><img class="oy-can-zoom" src="'+esc(u)+'" alt="'+esc(title)+' screenshot '+(i+1)+'" loading="lazy" tabindex="0" role="button" title="Open full resolution screenshot">'+(other.length>1?'<figcaption>View '+(i+1)+'</figcaption>':'')+'</figure>').join('')+'</div></div>';
    insertAfter.insertAdjacentElement('afterend',section);
  }
 }).catch(()=>{});
})();