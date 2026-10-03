(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  async function get(type){
    try{const r=await fetch('/api/content?type='+encodeURIComponent(type));if(!r.ok)return[];const d=await r.json();return d.items||[]}catch{return[]}
  }
  function animateStats(){
    const section=$('[data-cms-stats]'); if(!section)return;
    const nums=$$('[data-stat-value]',section);
    const run=()=>nums.forEach((el,idx)=>{
      const end=Number(el.dataset.value||0),suffix=el.dataset.suffix||'';
      if(!end){el.textContent='0'+suffix;return}
      const dur=1100+idx*120,start=performance.now();
      const step=now=>{const p=Math.min(1,(now-start)/dur),ease=1-Math.pow(1-p,3);el.textContent=Math.round(end*ease)+suffix;if(p<1)requestAnimationFrame(step)};
      requestAnimationFrame(step);
    });
    if('IntersectionObserver'in window){const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){run();io.disconnect()}},{threshold:.35});io.observe(section)}else run();
  }
  async function hydrateStats(){
    const section=$('[data-cms-stats]'); if(!section)return;
    const items=await get('stat');
    if(items.length){
      const host=$('[data-stat-grid]',section);
      host.innerHTML=items.filter(i=>i.featured_home).map(i=>{const d=i.data||{},href=d.href||'#';return `<a class="proof-stat" href="${href}"><strong data-stat-value data-value="${Number(d.value)||0}" data-suffix="${d.suffix||''}">0${d.suffix||''}</strong><span>${d.label||i.excerpt||i.title}</span></a>`}).join('');
    }
    animateStats();
  }
  async function hydrateFeaturedReviews(){
    const host=$('[data-cms-reviews]'); if(!host)return;
    const items=(await get('review')).filter(i=>i.featured_home);
    if(!items.length)return;
    host.innerHTML=items.slice(0,3).map(i=>{const d=i.data||{},stars='★'.repeat(Math.max(1,Math.min(5,Number(d.rating)||5)));return `<article class="testimonial-card"><div class="testimonial-stars">${stars}</div><blockquote>“${d.full_review||i.excerpt||''}”</blockquote><div class="testimonial-source"><strong>${d.project_slug||d.service||'Client project'}</strong><span>${d.source||'Client feedback'}</span></div></article>`}).join('');
  }
  hydrateStats(); hydrateFeaturedReviews();
})();