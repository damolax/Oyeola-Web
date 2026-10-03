(() => {
  const lab = document.querySelector('[data-demo-lab]');
  if (!lab) return;

  const demos = {
    wedding: {
      industry:'Wedding', category:'portal', title:'Wedding Guest Concierge',
      problem:'Turn repeated guest questions into one personalized wedding portal.',
      questions:[
        {q:'What kind of event are you planning?', options:['Single-day wedding','Wedding weekend','Multi-event celebration']},
        {q:'What do guests ask about most?', options:['RSVP and plus-ones','Hotels and transport','Meals and allergies','The event schedule']},
        {q:'What should happen after RSVP?', options:['Show a personal itinerary','Recommend accommodation','Collect meal choices','Send a complete guest summary']}
      ],
      result:(a)=>({title:'A personalized guest portal',copy:`For a ${a[0].toLowerCase()}, the site can collect ${a[1].toLowerCase()} details and then ${a[2].toLowerCase()}. Guests get one clear place for the information that normally creates repeated messages.`,chips:['RSVP logic','Guest itinerary','Travel info','Meal capture']})
    },
    ecommerce: {
      industry:'Ecommerce', category:'finder', title:'Guided Product Match + Bundle Builder',
      problem:'Help shoppers choose confidently instead of comparing similar products alone.',
      questions:[
        {q:'What are shoppers usually trying to decide?', options:['Which product fits me','Which size/version to choose','What to buy together','Whether the premium option is worth it']},
        {q:'What matters most in the recommendation?', options:['Use case','Budget','Features','Style or preference']},
        {q:'What should the result do?', options:['Recommend one best match','Compare the top 3','Build a bundle','Send the match to cart']}
      ],
      result:(a)=>({title:'A guided buying assistant',copy:`Ask a few short questions around ${a[1].toLowerCase()}, then ${a[2].toLowerCase()}. That reduces choice overload around “${a[0].toLowerCase()}”.`,chips:['Product finder','Comparison','Bundle logic','Cart handoff']})
    },
    travel: {
      industry:'Travel / Vacation', category:'builder', title:'Interactive Trip Builder',
      problem:'Turn travel inspiration into a realistic trip brief visitors can act on.',
      questions:[
        {q:'What kind of trip is the visitor imagining?', options:['Relaxing escape','Family vacation','Adventure trip','Luxury city break']},
        {q:'What should shape the plan most?', options:['Budget','Dates','Activities','Group size']},
        {q:'What should the website produce?', options:['A sample itinerary','A package recommendation','A planning checklist','A ready-to-send trip brief']}
      ],
      result:(a)=>({title:'A trip plan visitors can picture',copy:`A ${a[0].toLowerCase()} can be shaped around ${a[1].toLowerCase()} and finish with ${a[2].toLowerCase()}. The enquiry arrives with useful planning context instead of “How much is a trip?”.`,chips:['Trip style','Budget/date logic','Itinerary','Lead brief']})
    },
    realestate: {
      industry:'Real Estate', category:'finder', title:'Property Fit Finder',
      problem:'Help buyers define what actually fits before they open dozens of listings.',
      questions:[
        {q:'Who is the visitor?', options:['First-time buyer','Investor','Family moving','Renter upgrading']},
        {q:'What should be prioritized?', options:['Budget','Location','Space','Lifestyle']},
        {q:'What is the best next step?', options:['Show matching listings','Create a buyer profile','Book a viewing','Request hand-picked options']}
      ],
      result:(a)=>({title:'A better property discovery path',copy:`For a ${a[0].toLowerCase()}, prioritize ${a[1].toLowerCase()} and then ${a[2].toLowerCase()}. The site learns the buyer before asking them to search everything.`,chips:['Buyer profile','Property fit','Viewing path','Lead qualification']})
    },
    restaurant: {
      industry:'Restaurant / Hospitality', category:'booking', title:'Group Dining Planner',
      problem:'Make large-party bookings easier than a basic reservation form.',
      questions:[
        {q:'What is the occasion?', options:['Birthday','Corporate dinner','Wedding event','Casual group meal']},
        {q:'What needs to be handled?', options:['Dietary needs','Private space','Menu packages','Budget per guest']},
        {q:'What should the result show?', options:['Recommended package','Estimated spend','Available setup','Reservation request summary']}
      ],
      result:(a)=>({title:'A group booking concierge',copy:`For a ${a[0].toLowerCase()}, the website can capture ${a[1].toLowerCase()} and show a ${a[2].toLowerCase()} before the customer submits the booking request.`,chips:['Party details','Dietary capture','Package match','Reservation brief']})
    },
    beauty: {
      industry:'Beauty / Salon', category:'booking', title:'Service Match + Booking Prep',
      problem:'Help clients choose the right treatment before they reach the booking calendar.',
      questions:[
        {q:'What does the client know already?', options:['Exactly what I want','My goal, not the service','Only the problem','I need a consultation']},
        {q:'What should guide the match?', options:['Desired result','Hair/skin history','Budget','Time available']},
        {q:'How should the site finish?', options:['Recommend a service','Recommend a consultation','Show prep instructions','Open the right booking option']}
      ],
      result:(a)=>({title:'A service matcher before booking',copy:`If the client says “${a[0]}”, the site can use ${a[1].toLowerCase()} to ${a[2].toLowerCase()}. That makes the booking calendar the final step, not the first question.`,chips:['Service matching','Consultation logic','Prep notes','Booking handoff']})
    },
    healthcare: {
      industry:'Healthcare / Therapy', category:'navigator', title:'Service Navigator',
      problem:'Guide prospective clients to the right service category without asking them to diagnose themselves.',
      questions:[
        {q:'Who is seeking support?', options:['Adult','Child or teen','Couple / family','Not sure yet']},
        {q:'What practical preference matters?', options:['In person','Online','Flexible','Need help deciding']},
        {q:'What should the website clarify next?', options:['Service options','Appointment format','Payment path','What to prepare']}
      ],
      result:(a)=>({title:'A calm service navigation flow',copy:`The site can route a ${a[0].toLowerCase()} based on practical preferences such as ${a[1].toLowerCase()}, then explain ${a[2].toLowerCase()} without presenting a medical diagnosis.`,chips:['Service categories','Format preference','Payment info','Appointment prep']})
    },
    professional: {
      industry:'Professional Services', category:'builder', title:'Project Scope Builder',
      problem:'Turn vague enquiries into a usable project brief before the first reply.',
      questions:[
        {q:'What is the prospect trying to improve?', options:['Get more leads','Launch something new','Fix an existing system','Reduce manual work']},
        {q:'What is already in place?', options:['Nothing yet','A basic setup','A working setup that needs improvement','Several disconnected tools']},
        {q:'What should the result include?', options:['Recommended scope','Priority features','Timeline questions','A complete enquiry brief']}
      ],
      result:(a)=>({title:'A smarter project enquiry',copy:`For someone trying to ${a[0].toLowerCase()}, with ${a[1].toLowerCase()}, generate ${a[2].toLowerCase()}. You receive context you can actually quote from.`,chips:['Scope logic','Current-state audit','Priority list','Enquiry brief']})
    },
    homeservices: {
      industry:'Home Services', category:'estimator', title:'Job Triage + Quote Prep',
      problem:'Collect the details needed for a useful quote before dispatching staff.',
      questions:[
        {q:'What should be checked first?', options:['Service area','Job type','Urgency','Property type']},
        {q:'What information is usually missing?', options:['Photos','Measurements','Access details','Problem description']},
        {q:'What should the result do?', options:['Recommend next step','Show visit type','Prepare a quote request','Book an assessment']}
      ],
      result:(a)=>({title:'A better-qualified service request',copy:`Start with ${a[0].toLowerCase()}, collect ${a[1].toLowerCase()}, then ${a[2].toLowerCase()}. The business receives fewer incomplete “How much?” messages.`,chips:['Area check','Job details','Photo checklist','Assessment path']})
    },
    education: {
      industry:'Education / Coaching', category:'finder', title:'Program Fit Finder',
      problem:'Help visitors choose the right course, cohort or coaching path.',
      questions:[
        {q:'What does the learner want?', options:['Learn a new skill','Improve current ability','Get accountability','Prepare for a specific goal']},
        {q:'What is their current level?', options:['Beginner','Intermediate','Advanced','Not sure']},
        {q:'What should the result recommend?', options:['Course','Cohort','1:1 coaching','A learning path']}
      ],
      result:(a)=>({title:'A program recommendation that feels personal',copy:`A visitor who wants to ${a[0].toLowerCase()} at ${a[1].toLowerCase()} level can receive ${a[2].toLowerCase()} guidance instead of scanning every offer.`,chips:['Goal match','Level match','Format match','Enrollment CTA']})
    },
    saas: {
      industry:'SaaS / Software', category:'estimator', title:'ROI + Plan Recommendation',
      problem:'Show value and plan fit before the visitor needs a sales call.',
      questions:[
        {q:'What is the team size?', options:['1–5','6–20','21–100','100+']},
        {q:'What is the biggest current cost?', options:['Manual admin','Lost follow-up','Tool duplication','Slow reporting']},
        {q:'What should the calculator emphasize?', options:['Time saved','Cost avoided','Plan fit','Payback period']}
      ],
      result:(a)=>({title:'A value case tied to the visitor',copy:`For a ${a[0]} person team dealing with ${a[1].toLowerCase()}, the page can model ${a[2].toLowerCase()} and then recommend the appropriate plan or demo path.`,chips:['ROI model','Team size','Plan match','Demo CTA']})
    },
    nonprofit: {
      industry:'Nonprofit / Community', category:'impact', title:'Impact + Volunteer Match',
      problem:'Help supporters understand where their time or money creates the most value.',
      questions:[
        {q:'How does the visitor want to help?', options:['Donate','Volunteer','Attend an event','Share / advocate']},
        {q:'What matters to them?', options:['Youth','Education','Community support','A specific campaign']},
        {q:'What should the result provide?', options:['Impact explanation','Matching opportunity','Suggested contribution','Next available event']}
      ],
      result:(a)=>({title:'A supporter path built around intent',copy:`Someone who wants to ${a[0].toLowerCase()} around ${a[1].toLowerCase()} can immediately see a ${a[2].toLowerCase()}, making the website more useful than a generic Donate button.`,chips:['Interest match','Impact story','Opportunity match','Action CTA']})
    }
  };

  const cards = [...lab.querySelectorAll('[data-demo-key]')];
  const filters = [...lab.querySelectorAll('[data-demo-filter]')];
  const runner = lab.querySelector('[data-demo-runner]');
  const title = runner.querySelector('[data-runner-title]');
  const industry = runner.querySelector('[data-runner-industry]');
  const problem = runner.querySelector('[data-runner-problem]');
  const progress = runner.querySelector('[data-runner-progress]');
  const question = runner.querySelector('[data-runner-question]');
  const options = runner.querySelector('[data-runner-options]');
  const result = runner.querySelector('[data-runner-result]');
  const resultTitle = runner.querySelector('[data-result-title]');
  const resultCopy = runner.querySelector('[data-result-copy]');
  const resultChips = runner.querySelector('[data-result-chips]');
  const resultCta = runner.querySelector('[data-result-cta]');
  const restart = runner.querySelector('[data-demo-restart]');

  let currentKey = null;
  let step = 0;
  let answers = [];

  const showStep = () => {
    const demo = demos[currentKey];
    const item = demo.questions[step];
    result.classList.remove('show');
    question.hidden = false;
    options.hidden = false;
    question.textContent = item.q;
    options.innerHTML = '';
    progress.style.width = `${((step) / demo.questions.length) * 100}%`;
    item.options.forEach(label => {
      const button = document.createElement('button');
      button.className = 'demo-option';
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => {
        answers.push(label);
        step += 1;
        if (step >= demo.questions.length) showResult();
        else showStep();
      });
      options.appendChild(button);
    });
  };

  const showResult = () => {
    const demo = demos[currentKey];
    const data = demo.result(answers);
    question.hidden = true;
    options.hidden = true;
    progress.style.width = '100%';
    resultTitle.textContent = data.title;
    resultCopy.textContent = data.copy;
    resultChips.innerHTML = '';
    data.chips.forEach(chip => {
      const span = document.createElement('span');
      span.textContent = chip;
      resultChips.appendChild(span);
    });
    const params = new URLSearchParams({ demo: demo.title, result: data.title });
    resultCta.href = `contact.html?${params.toString()}`;
    result.classList.add('show');
    window.oyeolaTrack?.('demo_completed',{demo:currentKey,answers});
  };

  const openDemo = key => {
    if (!demos[key]) return;
    currentKey = key;
    step = 0;
    answers = [];
    const demo = demos[key];
    industry.textContent = demo.industry;
    title.textContent = demo.title;
    problem.textContent = demo.problem;
    runner.hidden = false;
    showStep();
    runner.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'start'});
    window.oyeolaTrack?.('demo_opened',{demo:key});
  };

  cards.forEach(card => {
    const button = card.querySelector('[data-demo-launch]');
    button?.addEventListener('click', () => openDemo(card.dataset.demoKey));
  });

  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.demoFilter;
    cards.forEach(card => {
      const demo = demos[card.dataset.demoKey];
      card.hidden = filter !== 'all' && demo.category !== filter;
    });
  }));

  restart?.addEventListener('click', () => currentKey && openDemo(currentKey));

  const requested = new URLSearchParams(location.search).get('demo');
  if (requested && demos[requested]) setTimeout(() => openDemo(requested), 80);
})();