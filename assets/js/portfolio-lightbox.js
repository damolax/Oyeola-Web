(function lightbox(){
 const cssImageSelectors=['.case-screen img','.project-main-media img','[data-project-fullpage]','.oy-project-stage img','.oy-showcase-split img','.case-result-surface img','.project-video img','.blog-body figure img','.blog-gallery img','.blog-cover img','.oy-authentic-gallery img','.oy-original-hero','.case-study-gallery img'].join(',');
 const matches=target=>target instanceof HTMLImageElement&&target.matches(cssImageSelectors)&&!target.closest('.project-platform-card,.project-skill-tags')&&!!(target.naturalWidth||target.getAttribute('src'));
 const dialog=document.createElement('dialog');dialog.className='oy-image-lightbox';dialog.setAttribute('aria-label','Full resolution portfolio image');
 dialog.innerHTML='<div class="oy-lightbox-top"><span>Original image · full resolution</span><div class="oy-lightbox-controls"><button data-zoom-out type="button" aria-label="Zoom out">−</button><button data-zoom-reset type="button">100%</button><button data-zoom-in type="button" aria-label="Zoom in">+</button><button data-close type="button" aria-label="Close image">×</button></div></div><div class="oy-lightbox-scroll"><img alt=""></div><p class="oy-lightbox-help">Scroll to explore tall screenshots · zoom to inspect details</p>';
 document.body.append(dialog);
 const viewer=dialog.querySelector('img'),wrap=dialog.querySelector('.oy-lightbox-scroll');let zoom=1,lastFocus=null;
 const setZoom=z=>{zoom=Math.max(.5,Math.min(4,Math.round(z*100)/100));viewer.style.width=(zoom*100)+'%';dialog.querySelector('[data-zoom-reset]').textContent=Math.round(zoom*100)+'%'};
 dialog.querySelector('[data-zoom-in]').onclick=()=>setZoom(zoom+.25);
 dialog.querySelector('[data-zoom-out]').onclick=()=>setZoom(zoom-.25);
 dialog.querySelector('[data-zoom-reset]').onclick=()=>setZoom(1);
 dialog.querySelector('[data-close]').onclick=()=>dialog.close();
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>{viewer.removeAttribute('src');lastFocus?.focus({preventScroll:true})});
 document.addEventListener('click',e=>{
  const t=e.target.closest('img');if(!matches(t)||t.closest('.oy-image-lightbox'))return;
  if(t.closest('a')&&t.closest('a').getAttribute('href')&&!t.closest('a').hasAttribute('data-blog-image'))return;
  e.preventDefault();e.stopPropagation();lastFocus=t;
  viewer.src=t.currentSrc||t.src;viewer.alt=t.alt||'Full-resolution project screenshot';wrap.scrollTop=0;wrap.scrollLeft=0;setZoom(1);dialog.showModal();
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open)dialog.close();else if((e.key==='Enter'||e.key===' ')&&!dialog.open&&matches(document.activeElement)){e.preventDefault();document.activeElement.click()}});
 document.querySelectorAll(cssImageSelectors).forEach(img=>{if(matches(img)){img.classList.add('oy-can-zoom');img.setAttribute('title','View full resolution');img.setAttribute('tabindex','0');img.setAttribute('role','button');img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();img.click()}})}});
})();