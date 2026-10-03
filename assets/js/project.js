(() => {
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 const slug=new URLSearchParams(location.search).get('slug')||location.pathname.split('/').filter(Boolean).pop()?.replace('.html','');
 let gallery=[],index=0;
 function setMain(i){if(!gallery.length)return;index=(i+gallery.length)%gallery.length;const item=gallery[index],img=$('[data-project-main-image]');img.src=item.url;img.alt=item.caption||'';$('[data-gallery-count]').textContent=(index+1)+' / '+gallery.length;$$('[data-thumb]').forEach((t,n)=>t.classList.toggle('active',n===index))}
 async function load(){
   let project=null;
   try{const r=await fetch('/api/content?type=project');const d=await r.json();project=(d.items||[]).find(x=>x.slug===slug)}catch{}
   if(!project){$('[data-project-title]').textContent='Project not found';$('[data-project-excerpt]').textContent='This portfolio story is not published yet.';return}
   const d=project.data||{}; document.title=project.title+' | Oyeola Online'; $('[data-project-title]').textContent=project.title;$('[data-project-excerpt]').textContent=project.excerpt||'';
   gallery=[...(Array.isArray(d.gallery)?d.gallery:[])].filter(x=>x?.url);
   if(d.hero_image_url&&!gallery.some(x=>x.url===d.hero_image_url))gallery.unshift({url:d.hero_image_url,caption:'Project hero'});
   if(d.thumbnail_url&&!gallery.length)gallery=[{url:d.thumbnail_url,caption:project.title}];
   if(gallery.length){$('[data-project-thumbs]').innerHTML=gallery.map((x,i)=>`<button data-thumb="${i}"><img src="${x.url}" alt="${esc(x.caption||project.title)}"></button>`).join('');$$('[data-thumb]').forEach(b=>b.onclick=()=>setMain(Number(b.dataset.thumb)));setMain(0)}
   $('[data-gallery-prev]').onclick=()=>setMain(index-1);$('[data-gallery-next]').onclick=()=>setMain(index+1);
   if(d.video_url){const shell=$('[data-video-shell]'),v=$('[data-project-video]');shell.hidden=false;v.src=d.video_url;shell.addEventListener('mouseenter',()=>v.play().catch(()=>{}));shell.addEventListener('mouseleave',()=>{v.pause();v.currentTime=0});shell.addEventListener('click',()=>{v.muted=!v.muted;if(v.paused)v.play().catch(()=>{})})}
   const facts=[['Industry',d.industry],['Service',d.service],['Platform',d.platform],['Year',d.year]].filter(x=>x[1]);$('[data-project-facts]').innerHTML=facts.map(x=>`<div><span>${esc(x[0])}</span><strong>${esc(x[1])}</strong></div>`).join('')+(d.live_url?`<a class="btn small" href="${d.live_url}" target="_blank" rel="noopener">View live website ↗</a>`:'');
   const s=d.story||{},blocks=[['Client goal',s.goal],['The challenge',s.challenge],['What I built',s.solution],['The improved journey',s.result]].filter(x=>x[1]);
   if(d.branding?.logo_designed||d.branding?.identity_designed)blocks.push(['Branding contribution',[d.branding.logo_designed?'Logo design':'',d.branding.identity_designed?'Brand identity':''].filter(Boolean).join(' · ')]);
   $('[data-project-story]').innerHTML=blocks.map(x=>`<article><p class="eyebrow">${esc(x[0])}</p><h2>${esc(x[1])}</h2></article>`).join('');
   if(d.fullpage_image_url){$('[data-project-fullpage-section]').hidden=false;$('[data-project-fullpage]').src=d.fullpage_image_url;$('[data-project-fullpage]').alt=project.title+' full-page website preview'}
   $('[data-project-tools]').innerHTML=(d.tools||[]).map(x=>`<span>${esc(x)}</span>`).join('');$('[data-project-skills]').innerHTML=(d.skills||[]).map(x=>`<span>${esc(x)}</span>`).join('');
   if(d.related_demo)$('[data-project-demo]').href='demos.html?demo='+encodeURIComponent(d.related_demo);
 }
 load();
})();