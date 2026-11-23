/* Oyeola Portfolio Viewer — scrollable full-page project previews */
(() => {
  const activeViewers = new Set();
  function lockScroll() { document.documentElement.classList.toggle('pv-scroll-locked', activeViewers.size > 0); }
  for (const box of document.querySelectorAll('[data-portfolio-viewer]')) {
    const image=box.querySelector('[data-pv-image]'), screen=box.querySelector('[data-pv-scroller]'),
      tabs=[...box.querySelectorAll('[data-pv-tab]')], expand=box.querySelector('[data-pv-expand]'),
      progress=box.querySelector('[data-pv-progress]'), label=box.querySelector('[data-pv-page-label]'),
      expLabel=box.querySelector('[data-pv-expand-label]');
    if (!image || !screen || !tabs.length) continue;
    function updateProgress() {
      if (!progress) return;
      const max=Math.max(0,screen.scrollHeight-screen.clientHeight);
      progress.style.width=(max ? Math.round((screen.scrollTop/max)*100) : 100)+'%';
    }
    function useTab(button) {
      const src=button.getAttribute('data-pv-src');
      if (!src) return;
      for (const t of tabs) t.setAttribute('aria-pressed',String(t===button));
      box.dataset.view=button.dataset.pvView||'desktop';
      image.alt=(box.getAttribute('aria-label')||'Website project')+' — '+button.textContent.trim()+' full-page image';
      image.onload=()=>{box.classList.remove('pv-loading');updateProgress();};
      image.onerror=()=>{box.classList.remove('pv-loading');box.classList.add('pv-image-error');};
      box.classList.remove('pv-image-error');
      box.classList.add('pv-loading');
      image.src=src;
      screen.scrollTop=0;screen.scrollLeft=0;
      if(label) label.textContent=button.textContent.trim();
      requestAnimationFrame(updateProgress);
    }
    for(const tab of tabs) tab.addEventListener('click',()=>useTab(tab));
    screen.addEventListener('scroll',updateProgress,{passive:true});
    const openOrClose=force=>{
      const next=(typeof force==='boolean')?force:!box.classList.contains('pv-expanded');
      box.classList.toggle('pv-expanded',next);
      if(next) activeViewers.add(box); else activeViewers.delete(box);
      lockScroll();
      expand?.setAttribute('aria-label',next?'Close expanded project preview':'Expand project preview');
      if(expLabel)expLabel.textContent=next?'Close':'Expand';
      requestAnimationFrame(updateProgress);
      if(!next)expand?.focus();
    };
    expand?.addEventListener('click',()=>openOrClose());
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&box.classList.contains('pv-expanded'))openOrClose(false);});
    image.addEventListener('load',updateProgress);
    window.addEventListener('resize',updateProgress,{passive:true});
    requestAnimationFrame(updateProgress);
  }
  const filters=[...document.querySelectorAll('[data-pp-filter]')];
  const cards=[...document.querySelectorAll('[data-pp-category]')];
  for(const b of filters)b.addEventListener('click',()=>{
    const category=b.getAttribute('data-pp-filter');
    for(const f of filters)f.setAttribute('aria-pressed',String(f===b));
    for(const c of cards)c.hidden=category!=='all'&&c.getAttribute('data-pp-category')!==category;
  });
})();