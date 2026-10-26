(function hydratePortfolioOriginals(){
 const isCase=location.pathname.includes('/case-studies/');
 const list=document.querySelectorAll('a[href*="case-studies/"]');
 if(!isCase&&!list.length)return;
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const originalSlugs=new Set(['bambo-oladipo','bare-canvas-media','concierge-wellness','davinci-resolve-craftsman','dr-akira','guestwork-property-management','latonya-speaks','one-love-beauty','shop-ship-express-analytics','somatra-healing','three-nails-one-cross','vapourvend','zentravels']);
 const localBackup=(slug,full=false)=>originalSlugs.has(slug)?'/assets/portfolio/'+(full?'full':'thumbs')+'/'+slug+'.jpg':slug==='warranty-wizards-figma'?'/assets/portfolio/thumbs/warranty-wizards-figma.svg':'';
 const bindBackup=(image,slug,full=false)=>{
  const fallback=localBackup(slug,full);
  if(!image||!fallback)return;
  image.addEventListener('error',()=>{
   if(image.dataset.oyBackupUsed==='1')return;
   image.dataset.oyBackupUsed='1';
   image.src=fallback;
  });
 };
 const allowed=x=>{try{
  if(typeof x!=='string'||!x.trim())return'';
  const u=new URL(x,location.origin);
  if(!['https:','http:'].includes(u.protocol)||/^\/(?:mnt\/data|tmp|home\/oai)\//i.test(u.pathname)||['localhost','127.0.0.1'].includes(u.hostname))return'';
  return u.href;
 }catch{return''}};
 for(const a of list){
  const slug=a.getAttribute('href')?.match(/case-studies\/([^/?#]+)(?:\.html)?/)?.[1]?.replace(/\.html$/,'');
  if(slug)bindBackup(a.querySelector('img'),slug);
 }
 fetch('/api/content?type=project').then(r=>r.ok?r.json():{items:[]}).then(({items=[]})=>{
  const bySlug=new Map(items.map(x=>[x.slug,x]));
  for(const a of list){const m=a.getAttribute('href')?.match(/case-studies\/([^/?#]+)(?:\.html)?/);if(!m)continue;const slug=m[1].replace(/\.html$/,'');const data=bySlug.get(slug)?.data||{};const url=allowed(data.fullpage_image_url||data.hero_image_url);if(!url)continue;const image=a.querySelector('img');if(image&&image.src!==url){image.src=url;image.alt=(bySlug.get(slug)?.title||slug)+' — original project screenshot';image.style.objectPosition='top center';image.style.objectFit='contain';image.loading='lazy';}}
  if(!isCase)return;
  const slug=location.pathname.split('/').pop().replace(/\.html$/,''),record=bySlug.get(slug),d=record?.data||{},url=allowed(d.fullpage_image_url||d.hero_image_url);if(!url)return;
  const title=record?.title||document.querySelector('h1')?.textContent||'Portfolio project';
  const hero=document.querySelector('.case-screen');
  if(hero){hero.innerHTML='<img class="oy-original-hero oy-can-zoom" src="'+esc(url)+'" alt="'+esc(title)+' — original full-page screenshot" tabindex="0" role="button" title="Open full-resolution screenshot">';hero.classList.add('oy-has-original');bindBackup(hero.querySelector('img'),slug,true);}
  const stage=document.querySelector('.oy-project-opening .oy-project-stage');
  if(stage){stage.innerHTML='<img class="oy-original-hero oy-can-zoom" src="'+esc(url)+'" alt="'+esc(title)+' — original website screenshot" tabindex="0" role="button" title="Open full-resolution screenshot">';stage.classList.add('oy-has-original');bindBackup(stage.querySelector('img'),slug,true);}
  const illustrative=document.querySelector('.project-video img');if(illustrative){illustrative.src=url;illustrative.alt=title+' original screenshot';illustrative.style.objectFit='contain';bindBackup(illustrative,slug,true)}
  const note=document.querySelector('.case-study-visual-note');if(note)note.remove();
  const insertAfter=document.querySelector('.case-hero,.oy-project-opening');if(!insertAfter)return;
  if(!document.querySelector('[data-original-portfolio-showcase]')){
    const section=document.createElement('section');section.className='section oy-original-portfolio-showcase';section.dataset.originalPortfolioShowcase='';
    const gallery=Array.isArray(d.gallery)?d.gallery.filter(x=>x&&allowed(x.url)):[],other=[...new Set([url,...gallery.map(x=>allowed(x.url))])].slice(0,10);
    section.innerHTML='<div class="container"><div class="section-head"><div><p class="eyebrow">Original project screenshots</p><h2>Explore the completed work.</h2><p>Click an image to zoom in and inspect the original screenshot.</p></div></div><div class="oy-authentic-gallery">'+other.map((u,i)=>'<figure><img class="oy-can-zoom" src="'+esc(u)+'" alt="'+esc(title)+' screenshot '+(i+1)+'" loading="lazy" tabindex="0" role="button" title="Open full resolution screenshot">'+(other.length>1?'<figcaption>View '+(i+1)+'</figcaption>':'')+'</figure>').join('')+'</div></div>';
    insertAfter.insertAdjacentElement('afterend',section);section.querySelectorAll('img').forEach(img=>bindBackup(img,slug,true));
  }
 }).catch(()=>{});
})();