(() => {
  'use strict';
  const root=document.querySelector('[data-industry-demo]');
  if(!root)return;

  const DEMOS={
    wedding:{industry:'Wedding',title:'Wedding Guest Concierge',problem:'Give guests one place for RSVP, travel, meals and the schedule.',questions:[
      ['What kind of event are you planning?',['Single-day wedding','Wedding weekend','Multi-event celebration']],
      ['What do guests ask about most?',['RSVP and plus-ones','Hotels and transport','Meals and allergies','The event schedule']],
      ['What should happen after RSVP?',['Show a personal itinerary','Recommend accommodation','Collect meal choices','Send a complete guest summary']]
    ],result:a=>({title:'A personalized guest portal',copy:`For a ${a[0].toLowerCase()}, the site can collect ${a[1].toLowerCase()} details and then ${a[2].toLowerCase()}. Guests get one clear place for the information that normally creates repeated messages.`,chips:['RSVP logic','Guest itinerary','Travel info','Meal capture']})},
    ecommerce:{industry:'Ecommerce',title:'Guided Product Match',problem:'Help shoppers choose confidently instead of comparing similar products alone.',questions:[
      ['What are shoppers usually trying to decide?',['Which product fits me','Which size/version to choose','What to buy together','Whether the premium option is worth it']],
      ['What matters most in the recommendation?',['Use case','Budget','Features','Style or preference']],
      ['What should the result do?',['Recommend one best match','Compare the top 3','Build a bundle','Send the match to cart']]
    ],result:a=>({title:'A guided buying assistant',copy:`Ask a few short questions around ${a[1].toLowerCase()}, then ${a[2].toLowerCase()}. That reduces choice overload around “${a[0].toLowerCase()}”.`,chips:['Product finder','Comparison','Bundle logic','Cart handoff']})},
    travel:{industry:'Travel / Vacation',title:'Interactive Trip Builder',problem:'Turn travel inspiration into a realistic trip brief visitors can act on.',questions:[
      ['What kind of trip is the visitor imagining?',['Relaxing escape','Family vacation','Adventure trip','Luxury city break']],
      ['What should shape the plan most?',['Budget','Dates','Activities','Group size']],
      ['What should the website produce?',['A sample itinerary','A package recommendation','A planning checklist','A ready-to-send trip brief']]
    ],result:a=>({title:'A trip plan visitors can picture',copy:`A ${a[0].toLowerCase()} can be shaped around ${a[1].toLowerCase()} and finish with ${a[2].toLowerCase()}. The enquiry arrives with useful planning context instead of “How much is a trip?”.`,chips:['Trip style','Budget/date logic','Itinerary','Lead brief']})},
    realestate:{industry:'Real Estate',title:'Property Fit Finder',problem:'Help buyers define what actually fits before they open dozens of listings.',questions:[
      ['Who is the visitor?',['First-time buyer','Investor','Family moving','Renter upgrading']],
      ['What should be prioritized?',['Budget','Location','Space','Lifestyle']],
      ['What is the best next step?',['Show matching listings','Create a buyer profile','Book a viewing','Request hand-picked options']]
    ],result:a=>({title:'A better property discovery path',copy:`For a ${a[0].toLowerCase()}, prioritize ${a[1].toLowerCase()} and then ${a[2].toLowerCase()}. The site learns the buyer before asking them to search everything.`,chips:['Buyer profile','Property fit','Viewing path','Lead qualification']})},
    hospitality:{industry:'Restaurant / Hospitality',title:'Group Dining Planner',problem:'Make large-party bookings easier than a basic reservation form.',questions:[
      ['What is the occasion?',['Birthday','Corporate dinner','Wedding event','Casual group meal']],
      ['What needs to be handled?',['Dietary needs','Private space','Menu packages','Budget per guest']],
      ['What should the result show?',['Recommended package','Estimated spend','Available setup','Reservation request summary']]
    ],result:a=>({title:'A group booking concierge',copy:`For a ${a[0].toLowerCase()}, the website can capture ${a[1].toLowerCase()} and show a ${a[2].toLowerCase()} before the customer submits the booking request.`,chips:['Party details','Dietary capture','Package match','Reservation brief']})},
    beauty:{industry:'Beauty / Salon',title:'Service Match + Booking Prep',problem:'Help clients choose the right treatment before they reach the booking calendar.',questions:[
      ['What does the client know already?',['Exactly what I want','My goal, not the service','Only the problem','I need a consultation']],
      ['What should guide the match?',['Desired result','Hair/skin history','Budget','Time available']],
      ['How should the site finish?',['Recommend a service','Recommend a consultation','Show prep instructions','Open the right booking option']]
    ],result:a=>({title:'A service matcher before booking',copy:`If the client says “${a[0]}”, the site can use ${a[1].toLowerCase()} to ${a[2].toLowerCase()}. That makes the booking calendar the final step, not the first question.`,chips:['Service matching','Consultation logic','Prep notes','Booking handoff']})},
    therapy:{industry:'Therapy / Healthcare',title:'Service Navigator',problem:'Guide prospective clients to the right service category without asking them to diagnose themselves.',questions:[
      ['Who is seeking support?',['Adult','Child or teen','Couple / family','Not sure yet']],
      ['What practical preference matters?',['In person','Online','Flexible','Need help deciding']],
      ['What should the website clarify next?',['Service options','Appointment format','Payment path','What to prepare']]
    ],result:a=>({title:'A calm service navigation flow',copy:`The site can route a ${a[0].toLowerCase()} based on practical preferences such as ${a[1].toLowerCase()}, then explain ${a[2].toLowerCase()} without presenting a medical diagnosis.`,chips:['Service categories','Format preference','Payment info','Appointment prep']})},
    professional:{industry:'Professional Services',title:'Project Scope Builder',problem:'Turn vague enquiries into a useful project brief before the first reply.',questions:[
      ['What is the prospect trying to improve?',['Get more leads','Launch something new','Fix an existing system','Reduce manual work']],
      ['What is already in place?',['Nothing yet','A basic setup','A working setup that needs improvement','Several disconnected tools']],
      ['What should the result include?',['Recommended scope','Priority features','Timeline questions','A complete enquiry brief']]
    ],result:a=>({title:'A smarter project enquiry',copy:`For someone trying to ${a[0].toLowerCase()}, with ${a[1].toLowerCase()}, generate ${a[2].toLowerCase()}. You receive context you can actually quote from.`,chips:['Scope logic','Current-state audit','Priority list','Enquiry brief']})},
    homeservices:{industry:'Home Services',title:'Job Triage + Quote Prep',problem:'Collect the details needed for a useful quote before dispatching staff.',questions:[
      ['What should be checked first?',['Service area','Job type','Urgency','Property type']],
      ['What information is usually missing?',['Photos','Measurements','Access details','Problem description']],
      ['What should the result do?',['Recommend next step','Show visit type','Prepare a quote request','Book an assessment']]
    ],result:a=>({title:'A better-qualified service request',copy:`Start with ${a[0].toLowerCase()}, collect ${a[1].toLowerCase()}, then ${a[2].toLowerCase()}. The business receives fewer incomplete “How much?” messages.`,chips:['Area check','Job details','Photo checklist','Assessment path']})},
    education:{industry:'Education / Coaching',title:'Program Fit Finder',problem:'Help visitors choose the right course, cohort or coaching path.',questions:[
      ['What does the learner want?',['Learn a new skill','Improve current ability','Get accountability','Prepare for a specific goal']],
      ['What is their current level?',['Beginner','Intermediate','Advanced','Not sure']],
      ['What should the result recommend?',['Course','Cohort','1:1 coaching','A learning path']]
    ],result:a=>({title:'A program recommendation that feels personal',copy:`A visitor who wants to ${a[0].toLowerCase()} at ${a[1].toLowerCase()} level can receive ${a[2].toLowerCase()} guidance instead of scanning every offer.`,chips:['Goal match','Level match','Format match','Enrollment CTA']})},
    saas:{industry:'SaaS / Software',title:'ROI + Plan Recommendation',problem:'Show value and plan fit before the visitor needs a sales call.',questions:[
      ['What is the team size?',['1–5','6–20','21–100','100+']],
      ['What is the biggest current cost?',['Manual admin','Lost follow-up','Tool duplication','Slow reporting']],
      ['What should the calculator emphasize?',['Time saved','Cost avoided','Plan fit','Payback period']]
    ],result:a=>({title:'A value case tied to the visitor',copy:`For a ${a[0]} person team dealing with ${a[1].toLowerCase()}, the page can model ${a[2].toLowerCase()} and then recommend the appropriate plan or demo path.`,chips:['ROI model','Team size','Plan match','Demo CTA']})},
    nonprofit:{industry:'Nonprofit / Community',title:'Impact + Volunteer Match',problem:'Help supporters understand where their time or money creates the most value.',questions:[
      ['How does the visitor want to help?',['Donate','Volunteer','Attend an event','Share / advocate']],
      ['What matters to them?',['Youth','Education','Community support','A specific campaign']],
      ['What should the result provide?',['Impact explanation','Matching opportunity','Suggested contribution','Next available event']]
    ],result:a=>({title:'A supporter path built around intent',copy:`Someone who wants to ${a[0].toLowerCase()} around ${a[1].toLowerCase()} can immediately see a ${a[2].toLowerCase()}, making the website more useful than a generic Donate button.`,chips:['Interest match','Impact story','Opportunity match','Action CTA']})}
  };

  const key=root.dataset.demoKey;
  const demo=DEMOS[key];
  if(!demo)return;

  const qWrap=root.querySelector('[data-demo-question-wrap]');
  const qText=root.querySelector('[data-demo-question]');
  const options=root.querySelector('[data-demo-options]');
  const progress=root.querySelector('[data-demo-progress]');
  const progressText=root.querySelector('[data-demo-progress-text]');
  const intro=root.querySelector('[data-demo-intro]');
  const result=root.querySelector('[data-demo-result]');
  const resultTitle=root.querySelector('[data-demo-result-title]');
  const resultCopy=root.querySelector('[data-demo-result-copy]');
  const chips=root.querySelector('[data-demo-result-chips]');
  const back=root.querySelector('[data-demo-back]');
  const restart=root.querySelector('[data-demo-restart]');
  const cta=root.querySelector('[data-demo-result-cta]');
  let step=0,answers=[];

  const start=()=>{intro.hidden=true;qWrap.hidden=false;result.hidden=true;step=0;answers=[];render();qWrap.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'})};

  const render=()=>{
    const item=demo.questions[step];
    qText.textContent=item[0];
    progress.style.width=(step/demo.questions.length*100)+'%';
    progressText.textContent='Question '+(step+1)+' of '+demo.questions.length;
    options.innerHTML='';
    item[1].forEach(label=>{
      const b=document.createElement('button');
      b.type='button';b.className='id-option';b.textContent=label;
      b.addEventListener('click',()=>{answers[step]=label;if(step<demo.questions.length-1){step++;render()}else showResult()});
      options.appendChild(b);
    });
    back.disabled=step===0;
  };

  const showResult=()=>{
    const r=demo.result(answers);
    qWrap.hidden=true;result.hidden=false;progress.style.width='100%';progressText.textContent='Complete';
    resultTitle.textContent=r.title;resultCopy.textContent=r.copy;chips.innerHTML=r.chips.map(x=>'<span>'+escapeHtml(x)+'</span>').join('');
    cta.href='contact.html?'+new URLSearchParams({demo:demo.title,result:r.title}).toString();
    result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
    window.oyeolaTrack?.('demo_completed',{demo:key,answers});
  };

  back.addEventListener('click',()=>{if(step>0){step--;answers=answers.slice(0,step);render()}});
  restart.addEventListener('click',start);
  root.querySelectorAll('[data-demo-start]').forEach(b=>b.addEventListener('click',start));
  window.oyeolaTrack?.('demo_page_view',{demo:key});

  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
})();