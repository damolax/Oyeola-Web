(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const services={
 'wellness':{title:'Wellness & checkups',detail:'Routine visits and a plan for keeping track of everyday care.',url:'/showroom/kindred-pet/service-wellness.html',note:'For planned checkups and ongoing care conversations.'},
 'new-pet':{title:'Puppies & kittens',detail:'A first-visit route for new pets and their families.',url:'/showroom/kindred-pet/service-new-pet.html',note:'For new pet questions, first exams and the next steps.'},
 'dental':{title:'Dental health',detail:'A conversation about your pet’s teeth, gums and oral health.',url:'/showroom/kindred-pet/service-dental.html',note:'For dental questions that are not an emergency.'},
 'sick':{title:'Sick visits',detail:'Help preparing a request to speak with a veterinary clinic.',url:'/showroom/kindred-pet/service-sick.html',note:'For new concerns that are not a life-threatening emergency.'}
};
const menu=$('[data-nav]'),menuBtn=$('[data-menu]');
menuBtn?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'×':'☰';document.body.classList.toggle('lock',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.classList.contains('open')){menu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.textContent='☰';document.body.classList.remove('lock');menuBtn.focus() }});
const guide=$('[data-care-guide]');if(guide){
 const type=$('[data-need]',guide),pet=$('[data-pet]',guide),result=$('[data-guide-result]');
 const render=()=>{let need=type.value,animal=pet.value,svc=services[need]||services.wellness;
 const emergency=need==='emergency';
 result.innerHTML=emergency?'<p class="kicker light">Do not wait for an online form</p><h2>Find emergency care now.</h2><p>This is a website concept, not a clinic or emergency service. Contact a nearby 24-hour veterinary emergency hospital immediately. If you suspect poisoning, contact an emergency vet or animal poison service right away.</p><a class="button light" href="/showroom/kindred-pet/emergency.html">Read emergency guidance ↗</a>':'<p class="kicker light">A place to start</p><h2>'+svc.title+'</h2><p>'+svc.note+' These are sample service paths, not a diagnosis or an appointment decision.</p><div class="line"><span>Your pet</span><span>'+ (animal==='cat'?'Cat':animal==='dog'?'Dog':'Not chosen')+'</span></div><div class="line"><span>Visit type</span><span>'+svc.title+'</span></div><a class="button light" href="'+svc.url+'">Explore this service ↗</a><p style="font-size:11px;margin-top:17px">If your pet seems seriously unwell, seek urgent veterinary help instead of using this tool.</p>';
 };
 type.addEventListener('change',render);pet.addEventListener('change',render);render();
}
const form=$('[data-appointment-form]');
if(form){
 const summary=$('[data-summary]'),status=$('[data-form-status]'),params=new URLSearchParams(location.search);
 const svc=String(params.get('service')||'');if(services[svc]){const choose=form.elements.namedItem('service');if(choose)choose.value=svc;}
 const petParam=params.get('pet');if(['Dog','Cat'].includes(petParam)){const input=form.elements.namedItem('pet_type');if(input)input.value=petParam;}
 const safe=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const state=()=>{const fd=new FormData(form);return {name:String(fd.get('name')||'').trim(),email:String(fd.get('email')||'').trim(),pet_type:String(fd.get('pet_type')||'').trim(),pet_name:String(fd.get('pet_name')||'').trim(),service:String(fd.get('service')||'').trim(),when:String(fd.get('when')||'').trim(),details:String(fd.get('details')||'').trim(),updates:!!fd.get('updates')}};
 const brief=s=>['KINDRED PET | WEBSITE CONCEPT ENQUIRY','','From: '+(s.name||'Not supplied'),'Reply email: '+(s.email||'Not supplied'),'Pet type: '+(s.pet_type||'Not chosen'),'Pet name: '+(s.pet_name||'Not supplied'),'Visit type: '+(services[s.service]?.title||'Not chosen'),'Preferred timing: '+(s.when||'Not chosen'),'General question: '+(s.details||'None'),'Contact preference: '+(s.updates?'Please reply by email':'No preference given'),'','This enquiry is for Oyeola Web to demonstrate a pet-care site. It does not reach a vet, provide medical advice or reserve an appointment.','Do not use this email for emergencies.'].join('\n');
 const render=()=>{const s=state();summary.innerHTML=[['Pet',s.pet_name||'Not added'],['Pet type',s.pet_type||'Not chosen'],['Visit',services[s.service]?.title||'Not chosen'],['When',s.when||'Not chosen']].map(([label,value])=>'<div class="line"><span>'+safe(label)+'</span><span>'+safe(value)+'</span></div>').join('')};
 form.addEventListener('input',render);form.addEventListener('change',render);render();
 $('[data-copy-brief]')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(brief(state()));status.textContent='Copied. You can paste the brief anywhere.'}catch{status.textContent='Copy is not available here. Use Download instead.'}});
 $('[data-download-brief]')?.addEventListener('click',()=>{const blob=new Blob([brief(state())],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='kindred-pet-concept-enquiry.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1800);status.textContent='The sample enquiry has been downloaded.'});
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
 const s=state();if(s.details.length>1000){status.textContent='Please shorten your question to 1,000 characters.';return}
 status.textContent='Your email app will open. No message is sent until you press Send there. This does not book a vet visit.';
 window.location.href='mailto:oyeolawebmaster@gmail.com?subject='+encodeURIComponent('Kindred Pet concept enquiry: '+(services[s.service]?.title||'General'))+'&body='+encodeURIComponent(brief(s));
 });
}
})();
