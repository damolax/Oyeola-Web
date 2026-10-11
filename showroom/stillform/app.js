(()=>{'use strict';
const $=(q,root=document)=>root.querySelector(q),$$=(q,root=document)=>Array.from(root.querySelectorAll(q));
const classes={
'foundation':{name:'Reformer Foundations',level:'Beginner',duration:'50 min',focus:'Learn the basics',tag:'Start here',img:'31509827',desc:'A gentle first step into reformer Pilates. Learn the equipment, breathing and simple movements.',suits:'First visits, returning movers and anyone who wants to learn the basics.',take:['Move slowly with clear guidance.','Learn the reformer and springs.','Build confidence at your pace.']},
'flow':{name:'Everyday Flow',level:'All levels',duration:'50 min',focus:'Strength and balance',tag:'Move with ease',img:'31509829',desc:'A steady reformer class that mixes strength, control and smooth movement.',suits:'People looking for a balanced full-body session.',take:['Controlled full-body sequences.','Options to make moves easier or harder.','Time to focus on breathing.']},
'sculpt':{name:'Reformer Sculpt',level:'Experienced',duration:'50 min',focus:'Stronger movement',tag:'Find your strength',img:'31509835',desc:'A focused session for people comfortable with the reformer and ready for more resistance.',suits:'Movers who already know basic reformer technique.',take:['Stronger resistance options.','Controlled core and leg work.','Room to progress at your pace.']},
'restore':{name:'Slow & Restore',level:'All levels',duration:'45 min',focus:'Stretch and reset',tag:'A little more calm',img:'31509822',desc:'An unhurried practice with stretching, slower sequences and time to reconnect.',suits:'Beginners and anyone who prefers a lighter session.',take:['Slower movement.','Gentle stretching.','Space to breathe.']}
};
const sample=[
{day:'Monday',time:'07:00',id:'foundation'},{day:'Monday',time:'18:00',id:'flow'},
{day:'Tuesday',time:'08:30',id:'flow'},{day:'Tuesday',time:'17:30',id:'sculpt'},
{day:'Wednesday',time:'07:30',id:'foundation'},{day:'Wednesday',time:'18:30',id:'restore'},
{day:'Thursday',time:'08:30',id:'flow'},{day:'Thursday',time:'17:30',id:'sculpt'},
{day:'Friday',time:'07:00',id:'foundation'},{day:'Friday',time:'16:30',id:'restore'},
{day:'Saturday',time:'09:00',id:'foundation'},{day:'Saturday',time:'10:30',id:'flow'}
];
const photo=(id,w=1000)=>'https://images.pexels.com/photos/'+id+'/pexels-photo-'+id+'.jpeg?auto=compress&cs=tinysrgb&w='+w;
const menu=$('[data-nav]'),toggle=$('[data-menu]');
toggle?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰';document.body.classList.toggle('lock',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.classList.contains('open')){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');document.body.classList.remove('lock');toggle.focus()}});
$$('[data-class-cards]').forEach(grid=>{grid.innerHTML=Object.entries(classes).map(([id,c])=>'<article class="class-tile"><a class="media" href="class-'+id+'.html"><img loading="lazy" src="'+photo(c.img,800)+'" alt="Pilates reformer class inspiration"><span class="pill">'+c.level+' / '+c.duration+'</span></a><div class="inside"><p class="eyebrow">'+c.tag+'</p><h3 class="serif">'+c.name+'</h3><p>'+c.desc+'</p><div class="bottom"><a class="text-link" href="class-'+id+'.html">See class details ↗</a><a href="contact.html?class='+id+'" class="btn small">Enquire ↗</a></div></div></article>').join('')});
const sched=$('[data-schedule]');
if(sched){
 const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 const render=()=>{
 let day=$('[data-day]')?.value||'All days',level=$('[data-level]')?.value||'All levels',period=$('[data-period]')?.value||'Any time';
 let filtered=sample.filter(s=>{const c=classes[s.id];return(day==='All days'||day===s.day)&&(level==='All levels'||c.level===level||c.level==='All levels')&&(period==='Any time'||(period==='Morning'?Number(s.time.slice(0,2))<12:Number(s.time.slice(0,2))>=12))});
 sched.innerHTML=filtered.length?days.map(d=>{const items=filtered.filter(s=>s.day===d);return items.length?'<section><h2 class="day-heading">'+d+'</h2><div class="schedule-list">'+items.map(s=>{const c=classes[s.id];return '<article class="session"><time>'+s.time+'</time><div><strong>'+c.name+'</strong><small>'+c.level+' · '+c.duration+' · Sample session</small></div><a class="btn small" href="contact.html?class='+s.id+'&day='+encodeURIComponent(s.day)+'&time='+encodeURIComponent(s.time)+'">Enquire ↗</a></article>'}).join('')+'</div></section>':''}).join(''):'<div class="notice"><strong>No sample sessions match those filters.</strong>Try another level, day or time.</div>';
 const count=$('[data-session-count]');if(count)count.textContent=filtered.length+' sample sessions found';
 };
 $$('[data-day],[data-level],[data-period]').forEach(el=>el.addEventListener('change',render));render();
}
const finder=$('[data-finder]');
if(finder){
 const exp=$('[data-experience]'),feel=$('[data-feeling]'),answer=$('[data-finder-result]');
 const update=()=>{const e=exp.value,f=feel.value;let id=e==='new'?'foundation':f==='strength'?'sculpt':f==='gentle'?'restore':'flow';const c=classes[id];answer.innerHTML='<p class="eyebrow">A class worth exploring</p><h3 class="serif" style="font-size:36px;margin:13px 0">'+c.name+'</h3><p>'+c.desc+'</p><a class="btn small" href="class-'+id+'.html" style="margin-top:16px">See this class ↗</a>'};
 exp.addEventListener('change',update);feel.addEventListener('change',update);update();
}
const form=$('[data-enquiry]');if(form){
 const storageKey='stillform-demo-enquiry-v1',status=$('[data-status]'),summary=$('[data-summary]');
 const selected=new URLSearchParams(location.search);const classSel=form.elements.namedItem('class_choice');
 let given=selected.get('class'),day=selected.get('day'),time=selected.get('time');if(given&&classes[given])classSel.value=given;
 const preset=$('[data-session-preset]');if(preset&&(given||day||time)){preset.textContent='You chose: '+[classes[given]?.name||'Class',day,time].filter(Boolean).join(' · ');preset.hidden=false;}
 const current=()=>{const fd=new FormData(form);return{name:String(fd.get('name')||'').trim(),email:String(fd.get('email')||'').trim(),choice:String(fd.get('class_choice')||''),experience:String(fd.get('experience')||''),goal:String(fd.get('goal')||'').trim(),day:String(fd.get('preferred_day')||'').trim(),notes:String(fd.get('notes')||'').trim(),session:day&&time?day+' at '+time:''}};
 const label=x=>classes[x]?.name||'Not chosen';
 const brief=x=>'STILLFORM / CLASS ENQUIRY\n\nName: '+(x.name||'Not entered')+'\nEmail: '+(x.email||'Not entered')+'\nClass: '+label(x.choice)+'\nExperience: '+(x.experience||'Not chosen')+'\nMain goal: '+(x.goal||'Not entered')+'\nPreferred day: '+(x.day||'Not chosen')+'\nChosen sample slot: '+(x.session||'None')+'\nNotes: '+(x.notes||'None')+'\n\nFrom Stillform, an Oyeola Web portfolio concept. This is an enquiry only, not a confirmed class or live booking.';
 const esc=t=>String(t).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
 const update=()=>{const s=current();if(summary)summary.innerHTML=[['Class',label(s.choice)],['Experience',s.experience||'Not chosen'],['Best day',s.day||'Not chosen'],['Goal',s.goal||'Not added']].map(([a,b])=>'<div><dt>'+esc(a)+'</dt><dd>'+esc(b)+'</dd></div>').join('');try{sessionStorage.setItem(storageKey,JSON.stringify(s))}catch{}};
 form.addEventListener('input',update);form.addEventListener('change',update);update();
 $('[data-copy]')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(brief(current()));status.textContent='Copied! Paste your enquiry wherever you like.'}catch{status.textContent='Copy is unavailable. Use Download instead.'}});
 $('[data-download]')?.addEventListener('click',()=>{const file=new Blob([brief(current())],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download='stillform-class-enquiry.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1200);status.textContent='Your enquiry has been downloaded.'});
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const s=current();status.textContent='Your email app will open. You must press Send there; no class has been booked.';location.href='mailto:oyeolawebmaster@gmail.com?subject='+encodeURIComponent('Stillform concept enquiry: '+(label(s.choice)))+'&body='+encodeURIComponent(brief(s))});
}
})();
