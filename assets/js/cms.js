(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  async function get(type){
    try{const r=await fetch('/api/content?type='+encodeURIComponent(type));if(!r.ok)return[];const d=await r.json();return d.items||[]}catch{return[]}
  }
  function animateStats(){
    const section=$('[data-cms-stats]'); if(!section)return;
    const nums=$('[data-stat-value]',section);
    let played=false;
    const run=()=>{ if(played)return; played=true; nums.forEach((el,idx)=>{
      const end=Number(el.dataset.value||0),suffix=el.dataset.suffix||'';
      if(!end){el.textContent='0'+suffix;return}
      const dur=1100+idx*120,start=performance.now();
      const step=now=>{const p=Math.min(1,(now-start)/dur),ease=1-Math.pow(1-p,3);el.textContent=Math.round(end*ease)+suffix;if(p<1)requestAnimationFrame(step)};
      requestAnimationFrame(step);
    }); };
    if('IntersectionObserver'in window){const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){run();io.disconnect()}},{threshold:.2});io.observe(section);setTimeout(run,1400)}else run();
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
  async function hydrateProjects(){
    const host=$('[data-cms-projects]'); if(!host)return;
    const items=await get('project'); if(!items.length)return;
    host.innerHTML=items.map(i=>{const d=i.data||{},img=d.thumbnail_url||d.hero_image_url||'',meta=[d.industry,d.platform].filter(Boolean).join(' · '),href='project.html?slug='+encodeURIComponent(i.slug);return `<article class="project-card"><a class="browser-mockup" href="${href}"><div class="browser-bar"><i></i><i></i><i></i><span></span></div><div class="browser-screen">${img?`<img src="${img}" alt="${i.title}">`:''}</div></a><div class="project-copy"><div class="work-meta">${meta}</div><h3>${i.title}</h3><p>${i.excerpt||''}</p><a class="text-link" href="${href}">View project</a></div></article>`}).join('');
  }
  async function hydratePlannerProjects(){
    const host=$('[data-cms-planner-projects]'); if(!host)return;
    const items=(await get('project')).filter(i=>{
      const d=i.data||{};
      return d.service==='Digital Planner Design'||(Array.isArray(d.service_slugs)&&d.service_slugs.includes('digital-planners'))||String(d.portfolio_kind||'').includes('planner');
    });
    if(!items.length)return;
    host.innerHTML=items.map(i=>{
      const d=i.data||{},img=d.thumbnail_url||d.hero_image_url||d.cover_url||'',href='project.html?slug='+encodeURIComponent(i.slug);
      return `<article class="planner-portfolio-card"><a class="planner-device-card" href="${href}">${img?`<img src="${img}" alt="${i.title}">`:''}</a><div><p class="eyebrow">${d.platform||'Digital Planner'}</p><h3>${i.title}</h3><p>${i.excerpt||d.summary||''}</p><div class="actions"><a class="btn small" href="${href}">View project</a>${d.sample_pdf_url?`<a class="btn small secondary" href="${d.sample_pdf_url}" target="_blank" rel="noopener">Try watermarked PDF</a>`:''}</div></div></article>`;
    }).join('');
  }

  async function hydrateTestimonials(){
    const host=$('[data-cms-testimonials]'); if(!host)return;
    const items=await get('review'); if(!items.length)return;
    host.innerHTML=items.map(i=>{const d=i.data||{},stars='★'.repeat(Math.max(1,Math.min(5,Number(d.rating)||5)));return `<article class="review-card"><div class="testimonial-stars">${stars}</div><span class="proof-tag">${d.service||'Client project'}</span><blockquote>“${d.full_review||i.excerpt||''}”</blockquote><div class="review-meta"><strong>${d.source||'Client feedback'}</strong><span>${d.project_slug||d.reviewer_label||''}</span></div></article>`}).join('');
  }
  hydrateStats(); hydrateFeaturedReviews(); hydrateProjects(); hydratePlannerProjects(); hydrateTestimonials();
})();