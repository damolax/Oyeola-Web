
const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
document.querySelectorAll('[data-scroll]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href'); if(id && id.startsWith('#')){e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:'smooth'});}}));
