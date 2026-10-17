(function cursorUI(){
 if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const ring=document.createElement('div');ring.className='oyeola-cursor';ring.setAttribute('aria-hidden','true');ring.innerHTML='<span class="oy-pointer"></span><span class="oy-wave oy-wave-one"></span><span class="oy-wave oy-wave-two"></span>';
 document.body.appendChild(ring);
 let x=-100,y=-100,cx=-100,cy=-100,active=false,raf=0;
 function tick(){cx+=(x-cx)*.23;cy+=(y-cy)*.23;ring.style.transform=`translate3d(${cx}px,${cy}px,0)`;raf=requestAnimationFrame(tick)}
 document.addEventListener('pointermove',e=>{if(e.pointerType&&e.pointerType!=='mouse')return;x=e.clientX;y=e.clientY;if(!active){active=true;ring.classList.add('is-visible');if(!raf)tick()}ring.classList.toggle('is-interactive',!!e.target.closest('a,button,[role="button"],select'));ring.classList.toggle('is-text',!!e.target.closest('input,textarea,[contenteditable="true"]'))},{passive:true});
 document.addEventListener('pointerleave',()=>{ring.classList.remove('is-visible')});
 document.addEventListener('pointerover',e=>{ring.classList.toggle('is-text',!!e.target.closest('input,textarea,[contenteditable="true"]'))},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){ring.classList.remove('is-visible');if(raf){cancelAnimationFrame(raf);raf=0;active=false}}});
})();