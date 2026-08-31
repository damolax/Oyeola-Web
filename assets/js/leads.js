(()=>{
  const forms=[...document.querySelectorAll('[data-lead-form]')];
  forms.forEach(form=>{
    const status=form.querySelector('[data-form-status]');
    const submit=form.querySelector('[type="submit"]');
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(status){status.textContent='Sending…';status.className='status';}
      if(submit)submit.disabled=true;
      const fd=new FormData(form), payload=Object.fromEntries(fd.entries());
      payload.source=form.dataset.source||payload.source||'website';
      payload.page_url=location.href;
      try{
        const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        const d=await r.json().catch(()=>({}));
        if(!r.ok||!d.ok) throw new Error(d.error||'Could not send your details.');
        if(status){status.textContent=d.email_sent?'Done — check your email.':'Saved. Email delivery will follow once mail delivery is connected.';status.className='status success';}
        form.classList.add('submitted');
        document.querySelectorAll('[data-unlock]').forEach(el=>el.classList.remove('hidden'));
        document.querySelectorAll('[data-lock]').forEach(el=>el.classList.add('hidden'));
        form.reset();
      }catch(err){
        if(status){status.textContent=err.message||'Could not send. Please email oyeolawebmaster@gmail.com.';status.className='status error';}
      }finally{if(submit)submit.disabled=false;}
    });
  });
})();
