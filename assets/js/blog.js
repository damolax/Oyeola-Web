(function blogUI(){
 const $=(s,r=document)=>r.querySelector(s);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const textFromHTML=s=>String(s||'').replace(/<[^>]+>/g,' ').replace(/&[a-z0-9#]+;/gi,' ');
 const timeToRead=blocks=>Math.max(1,Math.ceil((blocks||[]).map(b=>[b.text,b.caption,...(b.items||[]),...(b.rows||[]).flat()].filter(x=>typeof x==='string').map(textFromHTML).join(' ')).join(' ').trim().split(/\s+/).filter(Boolean).length/220));
 const fmtDate=raw=>{if(!raw)return'';const d=new Date(raw);return isNaN(+d)?'':d.toLocaleString(undefined,{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'})};
 const card=p=>{const d=p.data||{},url='/blog/'+encodeURIComponent(p.slug),cover=d.cover_url&&(/^(?:https?:\/\/|\/(?:api\/portal-media|assets\/blog)\b)/i.test(d.cover_url))?d.cover_url:'',desc=(d.excerpt||p.excerpt||'').slice(0,150);return `<article class="blog-card"><a href="${url}" class="blog-card-image" aria-label="Read ${esc(p.title)}">${cover?`<img src="${esc(cover)}" alt="${esc(d.cover_alt||p.title)}" loading="lazy" decoding="async">`:'<span class="blog-card-placeholder">Oyeola<br>Journal</span>'}</a><div class="blog-card-body"><p class="blog-card-meta"><time datetime="${esc(p.created_at||'')}">${esc(fmtDate(p.created_at))}</time><span aria-hidden="true">·</span><span>${timeToRead(d.blocks)} min read</span></p><h3><a href="${url}">${esc(p.title)}</a></h3>${desc?`<p class="blog-card-excerpt">${esc(desc)}</p>`:''}<a class="text-link" href="${url}">Read article ↗</a></div></article>`};
 async function fetchPosts(){
  try{
   const r=await fetch('/api/content?type=blog',{cache:'no-store'});
   const data=await r.json().catch(()=>({}));
   if(!r.ok)throw new Error(data.error||'The article service is unavailable.');
   return {posts:data.items||[],error:''};
  }catch(e){return {posts:[],error:e.message||'Could not load articles.'}}
 }
 document.addEventListener('error',event=>{
  const img=event.target;if(img?.tagName!=='IMG'||!img.closest('.blog-card-image'))return;
  const place=img.parentElement;img.remove();place.innerHTML='<span class="blog-card-placeholder">Oyeola<br>Journal</span>';
 },true);
 async function init(){
  document.querySelectorAll('.blog-local-time').forEach(el=>{if(el.dateTime)el.textContent=fmtDate(el.dateTime)});
  const home=$('[data-blog-home]'),list=$('[data-blog-list]');
  if(!home&&!list)return;
  const loaded=await fetchPosts();
  const posts=loaded.posts.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  if(home){if(!posts.length){home.hidden=true}else{home.hidden=false;const track=$('[data-blog-track]',home);track.innerHTML=posts.slice(0,9).map(card).join('');const move=(dir)=>track.scrollBy({left:dir*Math.max(track.clientWidth*.75,280),behavior:'smooth'});$('[data-blog-prev]',home)?.addEventListener('click',()=>move(-1));$('[data-blog-next]',home)?.addEventListener('click',()=>move(1));}}
  if(list&&loaded.error){list.innerHTML='<div class="blog-load-error" role="alert"><h3>Articles are temporarily unavailable</h3><p>'+esc(loaded.error)+'</p><button type="button" id="blog-retry">Try again</button></div>';$('#blog-retry')?.addEventListener('click',init);return}
  if(list){const search=$('#blog-search');const render=()=>{const q=(search?.value||'').trim().toLowerCase();const shown=posts.filter(p=>!q||(p.title+' '+(p.data?.excerpt||'')).toLowerCase().includes(q));list.innerHTML=shown.map(card).join('');$('[data-blog-empty]').hidden=shown.length>0};search?.addEventListener('input',render);render();}
 }
 init();
})();