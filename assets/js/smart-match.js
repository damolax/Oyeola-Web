(() => {
  'use strict';

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORAGE_KEY='oyeola-smart-match-result-v1';

  const CONFIG={
    decisions:[
      {id:'service',label:'The right service',desc:'They are unsure which service fits their situation.'},
      {id:'product',label:'The right product',desc:'They need help choosing between products or configurations.'},
      {id:'package',label:'The right package',desc:'They need help comparing tiers, inclusions or plans.'},
      {id:'budget',label:'What they can afford',desc:'Budget strongly affects what they should choose.'},
      {id:'availability',label:'What is available',desc:'Date, stock, capacity, location or appointment availability matters.'},
      {id:'next',label:'What they should do next',desc:'They understand the problem but not the correct next step.'},
      {id:'specific',label:'Something more specific',desc:'Describe the decision in your own words.'}
    ],
    factorOptions:[
      'Price','Features','Suitability','Availability','Timeline','Location','Quality','Style','Capacity','Experience level','Technical requirements','Personal preference'
    ],
    pricingOptions:[
      {id:'fixed',label:'Fixed',desc:'The price is already known.'},
      {id:'package',label:'Package based',desc:'Price depends on the selected tier or plan.'},
      {id:'calculated',label:'Calculated from selections',desc:'Choices change the final price.'},
      {id:'quote',label:'Quote only',desc:'A team member usually needs context before pricing.'},
      {id:'variable',label:'Highly variable',desc:'Pricing changes considerably by customer or scope.'}
    ],
    conversions:[
      {id:'buy',label:'Buy',desc:'Move directly to checkout or purchase.'},
      {id:'book',label:'Book',desc:'Open the right booking path.'},
      {id:'quote',label:'Request quote',desc:'Send a qualified quote request.'},
      {id:'consult',label:'Schedule consultation',desc:'Book a conversation with strong context.'},
      {id:'visit',label:'Visit location',desc:'Guide them to the right place or branch.'},
      {id:'specialist',label:'Contact specialist',desc:'Route them to the right person.'},
      {id:'save',label:'Save result',desc:'Let them keep the recommendation.'},
      {id:'other',label:'Something else',desc:'Use a custom next action.'}
    ],
    recommendations:{
      comparison:{
        name:'Comparison Assistant',
        short:'Compare the right options without forcing customers to decode every difference.',
        best:'Customers already understand the options but need a clearer side-by-side decision.',
        effort:'Low',
        personalization:'Light to moderate',
        price:'Works well with visible fixed or tiered prices',
        availability:'Can show it, but it is not the core logic',
        lead:'Moderate',
        complexity:'Simple',
        cta:'Compare and choose'
      },
      matcher:{
        name:'Guided Service Matcher',
        short:'Ask only what matters, narrow the relevant options, then recommend the strongest fit.',
        best:'The right service changes according to the customer’s goal, circumstances or requirements.',
        effort:'Low',
        personalization:'High',
        price:'Can hand off to estimate or quote logic',
        availability:'Can be included as a rule',
        lead:'Strong',
        complexity:'Moderate',
        cta:'Book or enquire with context'
      },
      product:{
        name:'Product Recommendation Engine',
        short:'Turn a large or similar product range into a short personalized recommendation.',
        best:'Shoppers face many similar options and preference or use case affects the best choice.',
        effort:'Low',
        personalization:'Moderate to high',
        price:'Supports visible product pricing',
        availability:'Can respect stock',
        lead:'Strong for purchase intent',
        complexity:'Moderate',
        cta:'View or buy recommended product'
      },
      configurator:{
        name:'Interactive Configurator',
        short:'Let customers build the right configuration while the system manages compatible choices.',
        best:'The final solution depends on several technical, style or feature selections.',
        effort:'Medium',
        personalization:'Very high',
        price:'Strong for calculated pricing',
        availability:'Can validate configuration availability',
        lead:'Very strong',
        complexity:'Advanced',
        cta:'Build, estimate or request quote'
      },
      budget:{
        name:'Budget-Based Recommendation',
        short:'Use budget early to keep customers inside realistic options and reduce wasted enquiries.',
        best:'Affordability strongly changes what should be recommended.',
        effort:'Low',
        personalization:'Moderate',
        price:'Core part of the logic',
        availability:'Optional',
        lead:'Strong',
        complexity:'Moderate',
        cta:'See matched range or request estimate'
      },
      package:{
        name:'Smart Package Selector',
        short:'Clarify tier differences and recommend the package that best fits priorities.',
        best:'Customers compare tiers, inclusions, memberships or plans.',
        effort:'Low',
        personalization:'Moderate',
        price:'Excellent for package pricing',
        availability:'Usually secondary',
        lead:'Strong',
        complexity:'Simple to moderate',
        cta:'Choose a plan or package'
      },
      availability:{
        name:'Availability + Alternative Finder',
        short:'Match the preferred option, check what can actually be chosen, then surface the best alternative.',
        best:'Dates, stock, capacity, location or appointment slots can invalidate an otherwise good choice.',
        effort:'Low',
        personalization:'Moderate',
        price:'Can be layered in',
        availability:'Core part of the logic',
        lead:'Strong',
        complexity:'Moderate to advanced',
        cta:'Book available option'
      },
      consultation:{
        name:'Personalized Consultation Journey',
        short:'Qualify a complex need before the customer reaches a specialist.',
        best:'The decision requires expert guidance and the final conversion is a consultation or quote.',
        effort:'Medium',
        personalization:'Very high',
        price:'Ideal when pricing is quote-based',
        availability:'Can route to specialist calendars',
        lead:'Very strong',
        complexity:'Moderate',
        cta:'Schedule the right consultation'
      }
    },
    presets:{
      homebuilder:{
        business:'Custom Home Builder',
        description:'Customers struggle to determine which project type fits their needs and budget.',
        answers:{decision:'service',branch_service:['Project size','Their goal','Budget'],optionCount:4,factors:['Suitability','Price','Style'],complexity:4,personalization:4,pricing:'calculated',conversion:'consult',urgency:'normal',context:{business:'Custom home builder',websiteStatus:'yes',websiteUrl:'https://example.com'}}
      },
      software:{
        business:'Online Software',
        description:'Customers struggle to choose a subscription plan.',
        answers:{decision:'package',branch_package:['Features','Team size','Price'],optionCount:2,factors:['Features','Price','Capacity'],complexity:2,personalization:2,pricing:'package',conversion:'buy',context:{business:'Online software',websiteStatus:'yes',websiteUrl:'https://example.com'}}
      },
      professional:{
        business:'Professional Services Firm',
        description:'Customers do not know which service they need.',
        answers:{decision:'service',branch_service:['Their problem','Their goal','Several of these'],optionCount:3,factors:['Suitability','Experience level','Timeline'],complexity:4,personalization:4,pricing:'quote',conversion:'consult',urgency:'normal',context:{business:'Professional services firm',websiteStatus:'yes',websiteUrl:'https://example.com'}}
      },
      product:{
        business:'Product Company',
        description:'Customers face too many similar options.',
        answers:{decision:'product',branch_product:['Use case','Features','Personal preference'],optionCount:4,factors:['Features','Personal preference','Price'],complexity:3,personalization:3,pricing:'fixed',conversion:'buy',context:{business:'Product company',websiteStatus:'yes',websiteUrl:'https://example.com'}}
      }
    }
  };

  const QUESTIONS={
    decision:()=>({
      id:'decision',type:'cards',
      title:'WHAT DO YOUR CUSTOMERS USUALLY NEED HELP DECIDING?',
      help:'Focus on the decision, not the industry.',
      options:CONFIG.decisions.map(x=>({value:x.id,label:x.label,desc:x.desc}))
    }),
    branch_service:()=>({
      id:'branch_service',type:'multi',max:3,
      title:'What usually determines the right service?',
      help:'Choose up to three. The order you choose them becomes the priority order.',
      options:['Their goal','Their problem','Project size','Location','Experience level','Urgency','Budget','Several of these'].map(x=>({value:x,label:x}))
    }),
    branch_product:()=>({
      id:'branch_product',type:'multi',max:3,
      title:'What changes which product is best?',
      help:'Choose up to three signals a useful recommendation should understand.',
      options:['Use case','Features','Compatibility','Technical requirements','Style','Personal preference','Budget','Several of these'].map(x=>({value:x,label:x}))
    }),
    branch_package:()=>({
      id:'branch_package',type:'multi',max:3,
      title:'What are customers really comparing between packages?',
      help:'Choose the differences that actually affect the decision.',
      options:['Features','Inclusions','Team size','Usage level','Support','Commitment length','Price','Several of these'].map(x=>({value:x,label:x}))
    }),
    branch_budget:()=>({
      id:'branch_budget',type:'single',
      title:'How important is budget in the final decision?',
      help:'This determines whether the system should filter, estimate or simply explain price.',
      options:[
        {value:'primary',label:'Primary constraint',desc:'Anything outside the budget should disappear early.'},
        {value:'important',label:'Important but flexible',desc:'Price matters, but other factors can outweigh it.'},
        {value:'factor',label:'One factor among several',desc:'Budget belongs in the logic but should not dominate it.'},
        {value:'configuration',label:'Price depends on configuration',desc:'Selections determine what the customer will pay.'}
      ]
    }),
    branch_availability:()=>({
      id:'branch_availability',type:'multi',max:3,
      title:'What can make an otherwise good option unavailable?',
      help:'Choose up to three constraints the experience should respect.',
      options:['Date','Stock','Capacity','Location','Appointment slots','Specialist schedule','Eligibility','Several of these'].map(x=>({value:x,label:x}))
    }),
    branch_next:()=>({
      id:'branch_next',type:'single',
      title:'What do customers usually know when they arrive?',
      help:'The less they know, the more valuable guided diagnosis becomes.',
      options:[
        {value:'problem',label:'They know the problem',desc:'They can describe what is wrong, but not the solution.'},
        {value:'goal',label:'They know the goal',desc:'They know the outcome they want.'},
        {value:'symptoms',label:'They only know what is happening',desc:'They need help translating symptoms into a next step.'},
        {value:'little',label:'Very little',desc:'The website needs to help them define the decision first.'}
      ]
    }),
    branch_specific:()=>({
      id:'branch_specific',type:'text',
      title:'Describe the decision your customer is trying to make.',
      help:'One or two sentences is enough. This stays inside the demo on this device.',
      placeholder:'Example: They know they need to improve their home, but they are not sure which type of project should come first.'
    }),
    optionCount:()=>({
      id:'optionCount',type:'slider',
      title:'How many choices do customers normally face?',
      help:'More options increases the value of narrowing and ranking.',
      labels:['2–3','4–6','7–15','Too many to compare manually']
    }),
    factors:()=>({
      id:'factors',type:'multi',max:3,
      title:'What matters most in the decision?',
      help:'Choose up to three. First choice = highest priority.',
      options:CONFIG.factorOptions.map(x=>({value:x,label:x}))
    }),
    complexity:()=>({
      id:'complexity',type:'single',
      title:'How easy is it for customers to understand the differences?',
      help:'Think about the customer before they speak to your team.',
      options:[
        {value:1,label:'Very easy',desc:'The differences are obvious.'},
        {value:2,label:'Some explanation needed',desc:'A short comparison usually works.'},
        {value:3,label:'Usually confusing',desc:'Customers often need help.'},
        {value:4,label:'Requires expert guidance',desc:'A specialist usually needs to interpret the situation.'}
      ]
    }),
    personalization:()=>({
      id:'personalization',type:'single',
      title:'Does the best answer vary significantly between customers?',
      help:'This determines how personalized the recommendation should be.',
      options:[
        {value:1,label:'Almost never',desc:'Most people should choose the same thing.'},
        {value:2,label:'Sometimes',desc:'A few customer differences matter.'},
        {value:3,label:'Usually',desc:'The right answer changes often.'},
        {value:4,label:'Every customer is different',desc:'The recommendation must adapt deeply.'}
      ]
    }),
    pricing:()=>({
      id:'pricing',type:'single',
      title:'How does price behave?',
      help:'Price can be part of the recommendation without pretending an estimate is a guaranteed quote.',
      options:CONFIG.pricingOptions.map(x=>({value:x.id,label:x.label,desc:x.desc}))
    }),
    availabilityLevel:()=>({
      id:'availabilityLevel',type:'single',
      title:'How often can availability change the best answer?',
      help:'Availability can be a filter, a ranking factor or the core decision rule.',
      options:[
        {value:1,label:'Rarely',desc:'Availability is mostly stable.'},
        {value:2,label:'Sometimes',desc:'It affects a portion of customers.'},
        {value:3,label:'Often',desc:'The preferred option is frequently unavailable.'},
        {value:4,label:'Almost always',desc:'The system must check availability before recommending.'}
      ]
    }),
    urgency:()=>({
      id:'urgency',type:'single',
      title:'How quickly do customers usually need a useful answer?',
      help:'Urgency can change whether the website should route, estimate or escalate.',
      options:[
        {value:'low',label:'They can take their time',desc:'The decision is rarely urgent.'},
        {value:'normal',label:'Within a normal buying journey',desc:'They want clarity, but not emergency handling.'},
        {value:'high',label:'Often time-sensitive',desc:'The next step should be fast and obvious.'}
      ]
    }),
    conversion:()=>({
      id:'conversion',type:'single',
      title:'What should happen after the recommendation?',
      help:'The match is only useful if it moves the customer to the right next action.',
      options:CONFIG.conversions.map(x=>({value:x.id,label:x.label,desc:x.desc}))
    }),
    context:()=>({
      id:'context',type:'context',
      title:'Want to make the result even more specific?',
      help:'Optional. Use your own language. No giant industry list.',
    })
  };

  const state={answers:{},sequence:[],step:0,result:null,baseResult:null,whatIfKey:null,started:false};
  const els={
    engine:$('[data-sm-engine]'),startPanel:$('[data-sm-start-panel]'),questionWrap:$('[data-sm-question-wrap]'),
    qIndex:$('[data-sm-question-index]'),qTitle:$('[data-sm-question-title]'),qHelp:$('[data-sm-question-help]'),
    answerArea:$('[data-sm-answer-area]'),back:$('[data-sm-back]'),next:$('[data-sm-next]'),
    progress:$('[data-sm-progress]'),progressLabel:$('[data-sm-progress-label]'),analysis:$('[data-sm-analysis]'),
    analysisCopy:$('[data-sm-analysis-copy]'),results:$('[data-sm-results]'),resultName:$('[data-sm-result-name]'),
    resultSummary:$('[data-sm-result-summary]'),score:$('[data-sm-score]'),why:$('[data-sm-why]'),
    whySummary:$('[data-sm-why-summary]'),complexity:$('[data-sm-complexity]'),complexityCopy:$('[data-sm-complexity-copy]'),
    journey:$('[data-sm-journey]'),altName:$('[data-sm-alt-name]'),altScore:$('[data-sm-alt-score]'),altCopy:$('[data-sm-alt-copy]'),
    readinessScore:$('[data-sm-readiness-score]'),readinessBar:$('[data-sm-readiness-bar]'),readinessList:$('[data-sm-readiness-list]'),
    blueprint:$('[data-sm-blueprint]'),saveNote:$('[data-sm-save-note]'),whatIfStatus:$('[data-sm-whatif-status]'),
    returnBanner:$('[data-sm-return]'),modal:$('[data-sm-modal]'),modalTitle:$('[data-sm-modal-title]'),
    modalKicker:$('[data-sm-modal-kicker]'),modalBody:$('[data-sm-modal-body]'),leadSummary:$('[data-sm-lead-summary]'),
    leadResult:$('[data-sm-lead-result]'),leadUrl:$('[data-sm-lead-url]')
  };

  function getDecision(){return state.answers.decision}
  function buildSequence(){
    const seq=['decision'];
    const d=getDecision();
    if(d) seq.push('branch_'+d);
    if(d) seq.push('optionCount','factors','complexity','personalization','pricing');
    const factorAvailability=Array.isArray(state.answers.factors)&&state.answers.factors.includes('Availability');
    if(d==='availability'||factorAvailability) seq.push('availabilityLevel');
    if(['service','availability','next','specific'].includes(d)) seq.push('urgency');
    if(d) seq.push('conversion','context');
    state.sequence=seq;
    return seq;
  }
  function pruneAnswers(oldSeq,newSeq){
    oldSeq.filter(id=>!newSeq.includes(id)).forEach(id=>delete state.answers[id]);
  }
  function question(){return QUESTIONS[state.sequence[state.step]]?.()}
  function answerFor(id){return state.answers[id]}

  function start(){
    state.started=true;
    const old=state.sequence.slice();
    buildSequence();pruneAnswers(old,state.sequence);
    state.step=0;
    els.startPanel.hidden=true;els.questionWrap.hidden=false;els.analysis.hidden=true;
    renderQuestion();
    $('#live-demo')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderQuestion(){
    buildSequence();
    const q=question(); if(!q)return;
    els.qIndex.textContent='Your Match • '+(state.step+1)+' of '+state.sequence.length;
    els.progressLabel.textContent=(state.step+1)+' of '+state.sequence.length;
    els.progress.style.width=Math.round((state.step/state.sequence.length)*100)+'%';
    els.qTitle.textContent=q.title;els.qHelp.textContent=q.help||'';
    els.answerArea.innerHTML='';
    if(q.type==='cards'||q.type==='single') renderSingle(q);
    if(q.type==='multi') renderMulti(q);
    if(q.type==='slider') renderSlider(q);
    if(q.type==='text') renderText(q);
    if(q.type==='context') renderContext(q);
    els.back.disabled=state.step===0;
    updateNextState(q);
  }

  function renderSingle(q){
    const grid=document.createElement('div');grid.className='sm-answer-grid';
    const current=answerFor(q.id);
    q.options.forEach(o=>{
      const b=document.createElement('button');b.type='button';b.className='sm-choice'+(String(current)===String(o.value)?' selected':'');
      b.dataset.value=o.value;b.setAttribute('aria-pressed',String(String(current)===String(o.value)));
      b.innerHTML='<strong>'+escapeHtml(o.label)+'</strong>'+(o.desc?'<span>'+escapeHtml(o.desc)+'</span>':'');
      b.addEventListener('click',()=>{
        const oldSeq=state.sequence.slice();
        state.answers[q.id]=o.value;
        buildSequence();pruneAnswers(oldSeq,state.sequence);
        renderQuestion();
      });
      grid.appendChild(b);
    });
    els.answerArea.appendChild(grid);
  }

  function renderMulti(q){
    const wrap=document.createElement('div');wrap.className='sm-chip-grid';
    const selected=Array.isArray(answerFor(q.id))?[...answerFor(q.id)]:[];
    q.options.forEach(o=>{
      const idx=selected.indexOf(o.value),b=document.createElement('button');
      b.type='button';b.className='sm-chip'+(idx>-1?' selected':'');b.setAttribute('aria-pressed',String(idx>-1));
      b.innerHTML=escapeHtml(o.label)+(idx>-1?'<em>'+(idx+1)+'</em>':'');
      b.addEventListener('click',()=>{
        let arr=Array.isArray(state.answers[q.id])?[...state.answers[q.id]]:[];
        const i=arr.indexOf(o.value);
        if(i>-1) arr.splice(i,1); else if(arr.length<q.max) arr.push(o.value);
        state.answers[q.id]=arr;
        const oldSeq=state.sequence.slice();buildSequence();pruneAnswers(oldSeq,state.sequence);renderQuestion();
      });
      wrap.appendChild(b);
    });
    els.answerArea.appendChild(wrap);
    const note=document.createElement('p');note.className='sm-rank-note';note.textContent='Choose up to '+q.max+'. Numbers show priority order.';els.answerArea.appendChild(note);
  }

  function renderSlider(q){
    const value=Number(answerFor(q.id)||2);
    if(!answerFor(q.id))state.answers[q.id]=value;
    const wrap=document.createElement('div');wrap.className='sm-slider-wrap';
    wrap.innerHTML='<div class="sm-slider-value" data-slider-value>'+q.labels[value-1]+'</div><input type="range" min="1" max="4" step="1" value="'+value+'" aria-label="'+escapeHtml(q.title)+'"><div class="sm-slider-labels">'+q.labels.map(x=>'<span>'+escapeHtml(x)+'</span>').join('')+'</div>';
    const input=$('input',wrap),display=$('[data-slider-value]',wrap);
    input.addEventListener('input',()=>{state.answers[q.id]=Number(input.value);display.textContent=q.labels[Number(input.value)-1];updateNextState(q)});
    els.answerArea.appendChild(wrap);
  }

  function renderText(q){
    const wrap=document.createElement('div');wrap.className='sm-field-stack';
    const current=answerFor(q.id)||'';
    wrap.innerHTML='<label>Describe it<textarea rows="4" maxlength="500" placeholder="'+escapeHtml(q.placeholder||'')+'">'+escapeHtml(current)+'</textarea></label>';
    const ta=$('textarea',wrap);ta.addEventListener('input',()=>{state.answers[q.id]=ta.value.trim();updateNextState(q)});
    els.answerArea.appendChild(wrap);
  }

  function renderContext(q){
    const current=typeof answerFor(q.id)==='object'&&answerFor(q.id)?{...answerFor(q.id)}:{business:'',websiteStatus:'',websiteUrl:''};
    state.answers[q.id]=current;
    const wrap=document.createElement('div');wrap.className='sm-field-stack';
    wrap.innerHTML='<label>What does your business do? <span>optional</span><input data-context-business maxlength="160" placeholder="Pool construction, accounting firm, luxury travel, custom furniture..." value="'+escapeAttr(current.business||'')+'"></label><div><label style="margin-bottom:8px">Do you already have a website? <span>optional</span></label><div class="sm-inline-options" data-context-status></div></div><label data-context-url-wrap '+(current.websiteStatus==='yes'?'':'hidden')+'>Website URL <span>optional</span><input data-context-url type="url" placeholder="https://" value="'+escapeAttr(current.websiteUrl||'')+'"></label>';
    const statuses=[['yes','Yes'],['no','No'],['rebuild','Being rebuilt']];
    const statusHost=$('[data-context-status]',wrap);
    statuses.forEach(([value,label])=>{
      const b=document.createElement('button');b.type='button';b.className='sm-choice'+(current.websiteStatus===value?' selected':'');b.innerHTML='<strong>'+label+'</strong>';
      b.addEventListener('click',()=>{current.websiteStatus=value;if(value!=='yes')current.websiteUrl='';state.answers[q.id]=current;renderContextReplace(q,current)});
      statusHost.appendChild(b);
    });
    $('[data-context-business]',wrap).addEventListener('input',e=>{current.business=e.target.value.trim();state.answers[q.id]=current});
    const url=$('[data-context-url]',wrap);if(url)url.addEventListener('input',e=>{current.websiteUrl=e.target.value.trim();state.answers[q.id]=current});
    els.answerArea.appendChild(wrap);
  }
  function renderContextReplace(q,current){state.answers[q.id]=current;renderQuestion()}

  function updateNextState(q){
    const a=answerFor(q.id);
    let valid=true;
    if(q.type==='cards'||q.type==='single') valid=a!==undefined&&a!==null&&a!=='';
    if(q.type==='multi') valid=Array.isArray(a)&&a.length>0;
    if(q.type==='text') valid=String(a||'').trim().length>=5;
    if(q.type==='context') valid=true;
    if(q.type==='slider') valid=Number(a)>=1;
    els.next.disabled=!valid;
    els.next.textContent=state.step===state.sequence.length-1?'Build My Recommendation':'Continue';
  }

  function next(){
    const q=question();if(!q||els.next.disabled)return;
    if(state.step<state.sequence.length-1){state.step++;renderQuestion();return}
    runAnalysis();
  }
  function back(){if(state.step>0){state.step--;renderQuestion()}}

  function featureModel(answers){
    const decision=answers.decision;
    const options=Number(answers.optionCount||2);
    const complexity=Number(answers.complexity||2);
    const personalization=Number(answers.personalization||2);
    const factors=Array.isArray(answers.factors)?answers.factors:[];
    const pricingMap={fixed:.1,package:.45,calculated:.8,quote:.9,variable:1};
    const priceVar=pricingMap[answers.pricing]??.45;
    const availabilityBase=Number(answers.availabilityLevel||1)/4;
    const availability=Math.min(1,availabilityBase+(decision==='availability'?.35:0)+(factors.includes('Availability')?.2:0));
    const budgetBranch=answers.branch_budget;
    const budget=Math.min(1,(decision==='budget'?.45:0)+(factors.includes('Price')?.3:0)+(['primary','important','configuration'].includes(budgetBranch)?.25:0)+(priceVar>.7?.12:0));
    const comparison=Math.min(1,(options/4)*.45+(complexity/4)*.55);
    const technical=factors.includes('Technical requirements')?1:(Array.isArray(answers.branch_product)&&answers.branch_product.includes('Technical requirements')?.8:0);
    const preference=factors.includes('Personal preference')||factors.includes('Style')?.9:0;
    const consultation=['consult','quote','specialist'].includes(answers.conversion)?1:0;
    const directBuy=answers.conversion==='buy'?1:0;
    return{decision,options,complexity,personalization,factors,priceVar,availability,budget,comparison,technical,preference,consultation,directBuy,conversion:answers.conversion,urgency:answers.urgency||'normal'};
  }

  function recommendationScores(answers){
    const f=featureModel(answers);
    const d=id=>f.decision===id?1:0;
    const p=f.personalization/4,c=f.complexity/4,o=f.options/4;
    const scores={
      comparison:.15+d('package')*.16+(1-p)*.16+(1-f.priceVar)*.08+(1-c)*.17+o*.12+(f.directBuy*.12)+(f.comparison*.12),
      matcher:.14+d('service')*.26+d('next')*.18+d('specific')*.12+p*.22+c*.12+f.consultation*.08+o*.08,
      product:.13+d('product')*.34+o*.17+p*.12+f.preference*.12+f.directBuy*.08+f.comparison*.08,
      configurator:.08+d('product')*.17+f.technical*.22+f.priceVar*.2+o*.15+p*.12+c*.06,
      budget:.08+d('budget')*.32+f.budget*.3+f.priceVar*.2+o*.05+c*.05,
      package:.1+d('package')*.4+(answers.pricing==='package'?.2:0)+(1-p)*.08+f.directBuy*.09+f.comparison*.08,
      availability:.07+d('availability')*.42+f.availability*.31+(f.urgency==='high'?.1:0)+o*.05,
      consultation:.08+d('next')*.13+d('service')*.08+p*.18+c*.2+f.consultation*.25+f.priceVar*.08
    };
    return Object.entries(scores).map(([id,raw])=>({id,raw,score:Math.max(55,Math.min(98,Math.round(55+raw*43)))})).sort((a,b)=>b.score-a.score);
  }

  function calculate(answers){
    const ranking=recommendationScores(answers);
    const primary={...ranking[0],...CONFIG.recommendations[ranking[0].id]};
    const alternative={...ranking[1],...CONFIG.recommendations[ranking[1].id]};
    const f=featureModel(answers);
    let displayName=primary.name;
    if(primary.id==='matcher'&&['budget','configurator'].includes(alternative.id)&&primary.score-alternative.score<=8)displayName='Guided Matcher + Estimate Builder';
    if(primary.id==='availability'&&alternative.id==='matcher'&&primary.score-alternative.score<=8)displayName='Availability + Guided Matcher';
    if(primary.id==='product'&&alternative.id==='comparison'&&primary.score-alternative.score<=7)displayName='Recommendation Engine + Comparison';
    const why=whyReasons(answers,f,primary.id);
    const journey=journeyFor(primary.id,answers);
    const complexity=implementationComplexity(f,primary.id);
    const readiness=readinessFor(answers);
    return{primary,alternative,ranking,features:f,displayName,why,journey,complexity,readiness};
  }

  function whyReasons(a,f,id){
    const out=[];
    const decisionLabel=CONFIG.decisions.find(x=>x.id===a.decision)?.label||'a customer decision';
    if(a.decision==='service')out.push('Customers do not always know which service fits their situation.');
    else if(a.decision==='product')out.push('Customers need help narrowing products before they can confidently choose.');
    else if(a.decision==='package')out.push('Customers are comparing tiers or packages rather than one obvious option.');
    else if(a.decision==='budget')out.push('Budget changes which choices should stay in the customer journey.');
    else if(a.decision==='availability')out.push('Availability can invalidate an otherwise strong option.');
    else out.push('Customers understand part of the problem but still need help choosing the next step.');
    if(f.personalization>=.75)out.push('The best answer changes significantly from one customer to another.');
    else if(f.personalization>=.5)out.push('Customer circumstances matter enough to justify personalized guidance.');
    if(f.complexity>=.75)out.push('The differences usually require explanation or expert guidance.');
    else if(f.comparison>=.6)out.push('Customers face enough choice that manual comparison creates unnecessary effort.');
    if(f.budget>=.55)out.push('Price matters enough to appear earlier in the decision, not only at the end.');
    if(f.availability>=.55)out.push('The recommendation should respect real availability, capacity or timing.');
    if(f.consultation)out.push('A qualified consultation or quote is the ideal conversion after the recommendation.');
    if(f.directBuy)out.push('The journey can move a confident customer directly toward purchase.');
    return out.slice(0,5);
  }

  function journeyFor(id,a){
    const end=conversionLabel(a.conversion);
    const maps={
      comparison:['Visitor lands','Chooses what matters','Compares shortlisted options','Sees the clearest difference',end],
      matcher:['Visitor lands','Chooses their goal','Answers relevant questions','Receives best-fit recommendation','Understands why it fits',end],
      product:['Visitor lands','Shares use case','Adds preferences','Receives product match','Compares best alternatives',end],
      configurator:['Visitor starts configuration','Chooses compatible options','Sees selections update','Receives configured solution','Reviews indicative price or scope',end],
      budget:['Visitor shares goal','Sets realistic budget context','System removes poor fits','Receives matched range','Sees stronger alternative',end],
      package:['Visitor shares needs','Ranks priorities','System compares packages','Receives best-fit tier','Sees why it beats alternatives',end],
      availability:['Visitor shares preference','Adds date / location / capacity','System checks availability','Shows best available match','Offers closest alternative',end],
      consultation:['Visitor explains need','System asks qualifying questions','Complexity is clarified','Right consultation path is chosen','Structured brief is prepared',end]
    };
    return maps[id]||maps.matcher;
  }

  function conversionLabel(id){
    return({buy:'Buy recommended option',book:'Open the right booking',quote:'Request qualified quote',consult:'Book consultation',visit:'Plan location visit',specialist:'Reach the right specialist',save:'Save the result',other:'Take the right next step'})[id]||'Take the next step';
  }

  function implementationComplexity(f,id){
    let n=1+(f.complexity>=.65?1:0)+(f.priceVar>=.75?1:0)+(f.availability>=.6?1:0)+(['configurator','availability'].includes(id)?1:0);
    if(n<=1)return{label:'Simple',copy:'Mostly structured questions, transparent rules and a focused result.'};
    if(n<=3)return{label:'Moderate',copy:'Requires branching questions, recommendation rules, result generation and enquiry integration.'};
    return{label:'Advanced',copy:'Likely needs deeper data, pricing or availability integration in addition to adaptive recommendation logic.'};
  }

  function readinessFor(a){
    const checks=[
      ['Main customer decision identified',!!a.decision],
      ['Conversion goal identified',!!a.conversion],
      ['Decision factors identified',Array.isArray(a.factors)&&a.factors.length>0],
      ['Pricing behaviour identified',!!a.pricing],
      ['Exact recommendation rules needed',false],
      ['Real business data needed',false]
    ];
    const known=checks.filter(x=>x[1]).length;
    const context=a.context||{};
    let score=58+known*7+(context.business?6:0)+(context.websiteStatus?4:0);
    score=Math.min(88,score);
    return{score,checks};
  }

  async function runAnalysis(){
    els.questionWrap.hidden=true;els.analysis.hidden=false;els.progress.style.width='100%';els.progressLabel.textContent='Analysing';
    const lines=['Understanding your customer journey...','Mapping decision points...','Evaluating personalization...','Finding the strongest experience...','Building your recommendation...'];
    for(const line of lines){els.analysisCopy.textContent=line;await wait(430)}
    state.baseResult=calculate(state.answers);state.result=state.baseResult;state.whatIfKey=null;
    renderResult();
    els.analysis.hidden=true;els.questionWrap.hidden=false;
    els.results.hidden=false;
    $('#results')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderResult(){
    const r=state.result;if(!r)return;
    els.resultName.textContent=r.displayName;
    els.resultSummary.textContent=resultSummary(r,state.answers);
    els.score.textContent=r.primary.score+'%';
    els.why.innerHTML=r.why.map(x=>'<li>'+escapeHtml(x)+'</li>').join('');
    els.whySummary.textContent=whySummary(r.primary.id,state.answers);
    els.complexity.textContent=r.complexity.label;els.complexityCopy.textContent=r.complexity.copy;
    els.journey.innerHTML=r.journey.map((x,i)=>'<div class="sm-journey-step"><small>STEP '+(i+1)+'</small><strong>'+escapeHtml(x)+'</strong></div>').join('');
    els.altName.textContent=r.alternative.name;els.altScore.textContent=r.alternative.score+'% fit';els.altCopy.textContent=r.alternative.short;
    els.readinessScore.textContent=r.readiness.score+'%';els.readinessBar.style.width=r.readiness.score+'%';
    els.readinessList.innerHTML=r.readiness.checks.map(([label,done])=>'<li>'+(done?'✓':'○')+' '+escapeHtml(label)+'</li>').join('');
    renderBlueprint(r);updateLeadFields(r);
    $$('.sm-whatif-grid button').forEach(b=>b.classList.toggle('active',b.dataset.smWhatif===state.whatIfKey));
    updateAdaptiveCTA(r);
  }

  function resultSummary(r,a){
    const f=r.features;
    const parts=[];
    if(a.decision==='service')parts.push('Your customers are trying to identify the right service');
    else if(a.decision==='product')parts.push('Your customers are choosing between products');
    else if(a.decision==='package')parts.push('Your customers are comparing packages or plans');
    else if(a.decision==='budget')parts.push('Budget strongly shapes the decision');
    else if(a.decision==='availability')parts.push('The best option depends on what is actually available');
    else parts.push('Your customers need help deciding the correct next step');
    if(f.personalization>=.75)parts.push('the best answer varies considerably by customer');
    if(f.priceVar>=.75)parts.push('price depends on selections or scope');
    if(f.availability>=.55)parts.push('availability can change the recommendation');
    return parts.join(', ')+'. '+r.primary.short;
  }

  function whySummary(id,a){
    const map={
      matcher:'A guided recommendation system can handle the early decision-making before a member of your team becomes involved.',
      product:'A product recommendation engine can reduce choice overload and move stronger purchase intent toward the right item.',
      configurator:'A configurator can turn a complicated specification process into a controlled sequence of compatible choices.',
      budget:'A budget-led journey can keep customers inside realistic options before they invest time in the wrong path.',
      package:'A package selector can make tier differences clearer and recommend the most appropriate level without a sales call.',
      availability:'An availability-aware matcher can avoid dead ends by recommending what can actually be chosen now and offering alternatives.',
      consultation:'A personalized consultation journey can qualify the situation before your team joins the conversation.',
      comparison:'A comparison assistant can remove ambiguity when the customer already understands the choices but struggles to compare them.'
    };
    return map[id]||map.matcher;
  }

  function renderBlueprint(r){
    const a=state.answers,c=a.context||{};
    const recQuestions=recommendedQuestions(r.primary.id,a);
    const data=[
      ['Business context',c.business||'Not provided'],
      ['Customer decision problem',CONFIG.decisions.find(x=>x.id===a.decision)?.label||'Not defined'],
      ['Primary recommendation',r.displayName],
      ['Match score',r.primary.score+'%'],
      ['Recommended questions',recQuestions.join(' · ')],
      ['Suggested result format',resultFormat(r.primary.id)],
      ['Recommended CTA',conversionLabel(a.conversion)],
      ['Suggested lead information','Goal · priorities · recommendation · budget context · timing · next action'],
      ['Potential automation',automationFor(r.primary.id,a)],
      ['Alternative approach',r.alternative.name+' ('+r.alternative.score+'%)']
    ];
    els.blueprint.innerHTML=data.map(([k,v])=>'<div class="sm-blueprint-item"><small>'+escapeHtml(k)+'</small><strong>'+escapeHtml(v)+'</strong></div>').join('');
  }

  function recommendedQuestions(id,a){
    const base=['Customer goal','Top decision factors'];
    if(a.pricing!=='fixed')base.push('Budget / pricing context');
    if(id==='availability')base.push('Date / stock / capacity');
    if(id==='configurator')base.push('Technical compatibility');
    if(['matcher','consultation'].includes(id))base.push('Current situation');
    return base.slice(0,4);
  }
  function resultFormat(id){
    return({
      comparison:'Side-by-side shortlist with highlighted differences',
      matcher:'One best-fit recommendation + explanation + alternative',
      product:'Recommended product + reasons + comparison',
      configurator:'Configured solution + selections + indicative scope',
      budget:'Best-fit range + budget explanation + alternative',
      package:'Recommended tier + inclusion comparison',
      availability:'Best available option + closest alternatives',
      consultation:'Recommended consultation path + structured brief'
    })[id]||'Recommendation + explanation';
  }
  function automationFor(id,a){
    if(a.conversion==='book'||a.conversion==='consult')return'Pass the result into the correct booking or consultation flow';
    if(a.conversion==='quote')return'Create a structured quote brief and route it to the right owner';
    if(a.conversion==='buy')return'Carry recommendation into product / checkout context';
    if(id==='availability')return'Check live availability and surface the closest alternative';
    return'Save the structured result and notify the appropriate team';
  }

  function updateLeadFields(r){
    const a=state.answers,c=a.context||{};
    const summary=[
      'Decision: '+(CONFIG.decisions.find(x=>x.id===a.decision)?.label||a.decision),
      'Options: '+optionLabel(a.optionCount),
      'Factors: '+((a.factors||[]).join(', ')||'Not specified'),
      'Complexity: '+complexityLabel(a.complexity),
      'Personalization: '+personalizationLabel(a.personalization),
      'Pricing: '+pricingLabel(a.pricing),
      'Conversion: '+conversionLabel(a.conversion),
      'Recommendation: '+r.displayName+' '+r.primary.score+'%',
      'Alternative: '+r.alternative.name+' '+r.alternative.score+'%',
      'Business: '+(c.business||'Not provided'),
      'Website status: '+(c.websiteStatus||'Not provided')
    ].join(' | ');
    if(els.leadSummary)els.leadSummary.value=summary;
    if(els.leadResult)els.leadResult.value='Discuss implementation of '+r.displayName+' for this customer journey.';
    if(els.leadUrl)els.leadUrl.value=c.websiteUrl||'';
  }

  function updateAdaptiveCTA(r){
    const c=state.answers.context||{};
    let label='Explore This For My Website';
    if(c.websiteStatus==='no')label='Build My Website Around This';
    else if(r.features.complexity>=.75)label='Plan My Customer Journey';
    else if(state.answers.conversion==='consult')label='See The Consultation Flow';
    $$('[data-sm-final-cta]').forEach(x=>x.textContent=label.toUpperCase());
  }

  function applyWhatIf(key){
    if(!state.baseResult)return;
    if(state.whatIfKey===key){state.whatIfKey=null;state.result=state.baseResult;els.whatIfStatus.textContent='Returned to your original answers.';renderResult();return}
    const clone=JSON.parse(JSON.stringify(state.answers));
    if(key==='moreOptions')clone.optionCount=4;
    if(key==='budget'){clone.decision='budget';clone.branch_budget='primary';clone.factors=uniqueTop(['Price',...(clone.factors||[])],3);clone.pricing=clone.pricing==='fixed'?'calculated':clone.pricing}
    if(key==='buyNow')clone.conversion='buy';
    if(key==='availability'){clone.decision='availability';clone.branch_availability=['Date','Capacity'];clone.availabilityLevel=4;clone.factors=uniqueTop(['Availability',...(clone.factors||[])],3)}
    if(key==='personal')clone.personalization=4;
    state.whatIfKey=key;state.result=calculate(clone);
    els.whatIfStatus.textContent='Recalculated: '+state.result.displayName+' at '+state.result.primary.score+'% fit.';
    renderResult();
  }

  function saveResult(){
    if(!state.result){start();return}
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify({answers:state.answers,savedAt:Date.now()}));
      els.saveNote.textContent='Saved on this device.';
      els.returnBanner.hidden=true;
    }catch{els.saveNote.textContent='Local save is unavailable in this browser.'}
  }
  function loadSaved(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return null;
      const saved=JSON.parse(raw);if(!saved?.answers)return null;
      return saved;
    }catch{return null}
  }
  function continueSaved(){
    const saved=loadSaved();if(!saved)return;
    state.answers=saved.answers;buildSequence();state.started=true;state.baseResult=calculate(state.answers);state.result=state.baseResult;state.step=Math.max(0,state.sequence.length-1);
    els.startPanel.hidden=true;els.questionWrap.hidden=false;renderQuestion();renderResult();els.results.hidden=false;els.returnBanner.hidden=true;
    $('#results')?.scrollIntoView({behavior:'smooth'});
  }
  function resetDemo(){
    state.answers={};state.sequence=[];state.step=0;state.result=null;state.baseResult=null;state.whatIfKey=null;state.started=false;
    try{localStorage.removeItem(STORAGE_KEY)}catch{}
    els.results.hidden=true;els.analysis.hidden=true;els.questionWrap.hidden=true;els.startPanel.hidden=false;els.progress.style.width='0';els.progressLabel.textContent='Ready to begin';
    els.saveNote.textContent='';els.whatIfStatus.textContent='Choose a scenario to recalculate the match.';
    $$('.sm-whatif-grid button').forEach(b=>b.classList.remove('active'));
    els.returnBanner.hidden=true;
    $('#live-demo')?.scrollIntoView({behavior:'smooth'});
  }

  function loadPreset(key){
    const p=CONFIG.presets[key];if(!p)return;
    state.answers=JSON.parse(JSON.stringify(p.answers));buildSequence();state.step=state.sequence.length-1;state.started=true;
    state.baseResult=calculate(state.answers);state.result=state.baseResult;state.whatIfKey=null;
    els.startPanel.hidden=true;els.questionWrap.hidden=false;renderQuestion();renderResult();els.results.hidden=false;
    closeTools();$('#results')?.scrollIntoView({behavior:'smooth'});
  }

  function openCustomerPreview(){
    if(!state.result){start();return}
    const id=state.result.primary.id;
    const variants={
      matcher:[['1','What do you need help with?',['Option A','Option B','Option C']],['2','What matters most right now?',['Speed','Fit','Budget']],['Result','Recommended For You',['Best-fit option','Why it fits','Alternative']]],
      product:[['1','What will you use it for?',['Everyday','Professional','Special requirement']],['2','Which matters most?',['Features','Price','Preference']],['Result','Your Product Match',['Best match','Compare top 3','Add to cart']]],
      configurator:[['1','Choose the starting setup',['Base A','Base B','Base C']],['2','Add what matters',['Feature','Style','Capacity']],['Result','Your Configuration',['Compatible setup','Indicative range','Request quote']]],
      budget:[['1','What are you trying to achieve?',['Goal A','Goal B','Goal C']],['2','Which range feels realistic?',['Entry','Mid-range','Premium']],['Result','Best Fit In Range',['Recommended option','Why','Alternative']]],
      package:[['1','What do you need most?',['Core features','More capacity','More support']],['2','How will you use it?',['Light','Regular','Intensive']],['Result','Recommended Package',['Best tier','Inclusions','Upgrade path']]],
      availability:[['1','What are you looking for?',['Option A','Option B','Option C']],['2','When / where?',['Preferred date','Location','Flexible']],['Result','Best Available Match',['Available option','Closest alternative','Book']]],
      consultation:[['1','What are you trying to solve?',['Problem A','Problem B','Not sure']],['2','What has already been tried?',['Nothing','Some work','Complex setup']],['Result','Recommended Consultation',['Right specialist path','Brief prepared','Book']]],
      comparison:[['1','What are you comparing?',['Option A','Option B','Option C']],['2','What matters most?',['Price','Features','Ease']],['Result','Best Comparison',['Top difference','Best fit','Choose']]]
    };
    const steps=variants[id]||variants.matcher;
    openModal('CUSTOMER EXPERIENCE','A miniature version of the journey', '<p class="sm-panel-note">Example structure — your live version would use your real services, rules, pricing and content.</p><div class="sm-preview-flow">'+steps.map(([n,q,opts])=>'<div class="sm-preview-step"><small>'+escapeHtml(n)+'</small><h3>'+escapeHtml(q)+'</h3><div class="sm-preview-options">'+opts.map(x=>'<span>'+escapeHtml(x)+'</span>').join('')+'</div></div>').join('')+'</div>');
  }

  function openLeadPreview(){
    if(!state.result){start();return}
    const a=state.answers,c=a.context||{},r=state.result;
    const fields=[
      ['Business',c.business||'Example business'],
      ['Website',c.websiteUrl||({yes:'Existing website',no:'No website yet',rebuild:'Being rebuilt'}[c.websiteStatus]||'Not provided')],
      ['Customer decision',CONFIG.decisions.find(x=>x.id===a.decision)?.label||a.decision],
      ['Options',optionLabel(a.optionCount)],
      ['Decision difficulty',complexityLabel(a.complexity)],
      ['Main factors',(a.factors||[]).join(', ')||'Not provided'],
      ['Pricing',pricingLabel(a.pricing)],
      ['Desired conversion',conversionLabel(a.conversion)],
      ['Recommended system',r.displayName],
      ['Match',r.primary.score+'%'],
      ['Priority',r.primary.score>=90?'High-fit opportunity':r.primary.score>=80?'Strong-fit opportunity':'Qualified opportunity']
    ];
    openModal('BUSINESS VIEW','SMART MATCH LEAD','<div class="sm-modal-lead">'+fields.map(([k,v])=>'<div><small>'+escapeHtml(k)+'</small><strong>'+escapeHtml(String(v))+'</strong></div>').join('')+'</div><div class="sm-parallel" style="margin-top:18px"><p class="sm-kicker">THE PARALLEL</p><h3 style="font-size:28px">Your own business could receive this level of structured context from customers before your team replies.</h3></div>');
  }

  function openComparison(){
    if(!state.result)return;
    const p=state.result.primary,a=state.result.alternative;
    const rows=[
      ['Best when',p.best,a.best],['Customer effort',p.effort,a.effort],['Personalization',p.personalization,a.personalization],
      ['Price handling',p.price,a.price],['Availability handling',p.availability,a.availability],['Lead quality',p.lead,a.lead],
      ['Implementation complexity',p.complexity,a.complexity],['Best conversion action',p.cta,a.cta]
    ];
    openModal('COMPARE APPROACHES',p.name+' vs. '+a.name,'<table class="sm-comparison-table"><thead><tr><th>Compare</th><th>'+escapeHtml(p.name)+'</th><th>'+escapeHtml(a.name)+'</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+escapeHtml(r[0])+'</td><td>'+escapeHtml(r[1])+'</td><td>'+escapeHtml(r[2])+'</td></tr>').join('')+'</tbody></table>');
  }

  function openMatchDetails(){
    if(!state.result)return;
    const f=state.result.features;
    const detail=[
      ['Personalization',strength(f.personalization/4)],
      ['Decision complexity',strength(f.complexity/4)],
      ['Pricing logic',strength(f.priceVar)],
      ['Availability',strength(f.availability)],
      ['Lead qualification',strength(Math.min(1,(f.complexity/4+f.personalization/4+f.consultation)/2.5))]
    ];
    openModal('VIEW MATCH DETAILS',state.result.primary.score+'% fit','<p class="sm-panel-note">The score measures how strongly this recommendation aligns with the decision complexity, number of options, personalization, price behaviour, availability and desired conversion in your answers. It is deterministic, not random.</p><div class="sm-logic" style="margin-top:16px">'+detail.map(([k,v])=>'<div class="sm-logic-row"><strong>'+escapeHtml(k)+'</strong><span>'+escapeHtml(v)+'</span></div>').join('')+'</div>');
  }

  function openLogic(){
    const rows=[
      ['Decision complexity','How much explanation or expert guidance customers need.'],
      ['Number of options','How much manual comparison the visitor would otherwise face.'],
      ['Personalization','How much the best answer changes from customer to customer.'],
      ['Pricing variability','Whether price is fixed, tiered, calculated or quote-based.'],
      ['Availability dependency','Whether dates, stock, capacity, location or appointments can change the answer.'],
      ['Desired conversion','What the recommendation should move the customer toward.']
    ];
    openModal('MATCHING LOGIC','Transparent rule-based matching','<p class="sm-panel-note">This public demo does not use random recommendations. The same answers produce the same result. The recommendation engine is separate from the presentation so the rules and content can be replaced for future service, product, package, property, course, plan, specialist or travel matching systems.</p><div class="sm-logic" style="margin-top:16px">'+rows.map(([k,v])=>'<div class="sm-logic-row"><strong>'+escapeHtml(k)+'</strong><span>'+escapeHtml(v)+'</span></div>').join('')+'</div>');
  }

  let lastFocus=null;
  function openModal(kicker,title,html){
    lastFocus=document.activeElement;els.modalKicker.textContent=kicker;els.modalTitle.textContent=title;els.modalBody.innerHTML=html;els.modal.hidden=false;document.body.style.overflow='hidden';
    const close=$('[data-sm-modal-close]',els.modal);close?.focus();
  }
  function closeModal(){els.modal.hidden=true;document.body.style.overflow='';lastFocus?.focus?.()}
  function trapModal(e){
    if(els.modal.hidden)return;
    if(e.key==='Escape'){closeModal();return}
    if(e.key!=='Tab')return;
    const f=$$('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])',els.modal).filter(x=>!x.disabled&&!x.hidden);
    if(!f.length)return;const first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }

  function copyBlueprint(){
    if(!state.result)return;
    const text=blueprintText();
    navigator.clipboard?.writeText(text).then(()=>{els.saveNote.textContent='Blueprint copied to clipboard.'}).catch(()=>{els.saveNote.textContent='Copy is unavailable. Use Print / Save PDF instead.'});
  }
  function blueprintText(){
    const items=$$('.sm-blueprint-item',els.blueprint).map(x=>x.textContent.trim().replace(/\s+/g,' '));
    return 'OYEOLA SMART MATCH BLUEPRINT\n\n'+items.join('\n')+'\n\nDemo recommendation, not a project quotation.';
  }

  function emailBlueprint(e){
    e.preventDefault();
    const form=e.currentTarget,status=$('[data-sm-email-status]',form),email=form.elements.email.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){status.textContent='Enter a valid email address.';status.className='sm-form-status error';form.elements.email.focus();return}
    status.textContent='Demo mode: on a live implementation, this blueprint would now be delivered to '+email+'. No account has been created.';
    status.className='sm-form-status success';
  }

  function optionLabel(v){return({1:'2–3',2:'4–6',3:'7–15',4:'Too many to compare manually'})[Number(v)]||'Not provided'}
  function complexityLabel(v){return({1:'Very easy',2:'Some explanation needed',3:'Usually confusing',4:'Requires expert guidance'})[Number(v)]||'Not provided'}
  function personalizationLabel(v){return({1:'Almost never',2:'Sometimes',3:'Usually',4:'Every customer is different'})[Number(v)]||'Not provided'}
  function pricingLabel(v){return CONFIG.pricingOptions.find(x=>x.id===v)?.label||'Not provided'}
  function strength(n){return n>=.8?'Very strong fit':n>=.6?'Strong fit':n>=.4?'Moderate fit':n>=.2?'Low relevance':'Very low relevance'}
  function uniqueTop(arr,max){return[...new Set(arr)].slice(0,max)}
  function wait(ms){return new Promise(r=>setTimeout(r,ms))}
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function escapeAttr(v){return escapeHtml(v).replace(/\n/g,' ')}

  function setupNav(){
    const menu=$('[data-sm-menu]'),nav=$('[data-sm-navlinks]');
    menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
    $$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
  }
  function setupTools(){
    const tools=$('[data-sm-tools]'),panel=$('[data-sm-tools-panel]'),toggle=$('[data-sm-tools-toggle]');
    const open=()=>{panel.hidden=false;toggle.setAttribute('aria-expanded','true')};
    window.closeTools=()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false')};
    toggle?.addEventListener('click',()=>panel.hidden?open():closeTools());
    $('[data-sm-tools-close]')?.addEventListener('click',closeTools);
  }
  function closeTools(){
    const panel=$('[data-sm-tools-panel]'),toggle=$('[data-sm-tools-toggle]');if(panel)panel.hidden=true;if(toggle)toggle.setAttribute('aria-expanded','false');
  }

  function runSelfTests(){
    const scenarios=[
      ['few-simple',{decision:'package',optionCount:1,factors:['Features'],complexity:1,personalization:1,pricing:'fixed',conversion:'buy'},['comparison','package']],
      ['many-services',{decision:'service',optionCount:4,factors:['Suitability','Timeline'],complexity:4,personalization:4,pricing:'quote',conversion:'consult'},['matcher','consultation']],
      ['custom-product',{decision:'product',optionCount:4,factors:['Technical requirements','Features'],complexity:3,personalization:4,pricing:'calculated',conversion:'quote'},['configurator','product']],
      ['price-variable',{decision:'budget',branch_budget:'primary',optionCount:3,factors:['Price','Suitability'],complexity:3,personalization:3,pricing:'variable',conversion:'quote'},['budget']],
      ['availability-critical',{decision:'availability',optionCount:2,factors:['Availability','Location'],complexity:2,personalization:2,pricing:'fixed',availabilityLevel:4,conversion:'book',urgency:'high'},['availability']],
      ['complex-b2b',{decision:'next',optionCount:3,factors:['Technical requirements','Suitability'],complexity:4,personalization:4,pricing:'quote',conversion:'consult',urgency:'normal'},['consultation','matcher']],
      ['tiered-packages',{decision:'package',optionCount:2,factors:['Features','Price'],complexity:2,personalization:2,pricing:'package',conversion:'buy'},['package','comparison']],
      ['many-products',{decision:'product',optionCount:4,factors:['Personal preference','Features'],complexity:3,personalization:3,pricing:'fixed',conversion:'buy'},['product']]
    ];
    return scenarios.map(([name,answers,expected])=>{const got=calculate(answers).primary.id;return{name,got,expected,pass:expected.includes(got)}});
  }

  $('[data-sm-begin]')?.addEventListener('click',start);
  $$('[data-sm-start]').forEach(x=>x.addEventListener('click',()=>{if(!state.started)setTimeout(start,250)}));
  els.next?.addEventListener('click',next);els.back?.addEventListener('click',back);
  $$('[data-sm-reset]').forEach(x=>x.addEventListener('click',resetDemo));
  $$('[data-sm-save]').forEach(x=>x.addEventListener('click',saveResult));
  $$('[data-sm-preview-customer]').forEach(x=>x.addEventListener('click',openCustomerPreview));
  $$('[data-sm-view-lead]').forEach(x=>x.addEventListener('click',openLeadPreview));
  $('[data-sm-compare]')?.addEventListener('click',openComparison);
  $('[data-sm-match-details]')?.addEventListener('click',openMatchDetails);
  $('[data-sm-view-logic]')?.addEventListener('click',openLogic);
  $$('[data-sm-modal-close]').forEach(x=>x.addEventListener('click',closeModal));
  document.addEventListener('keydown',trapModal);
  $$('[data-sm-whatif]').forEach(x=>x.addEventListener('click',()=>applyWhatIf(x.dataset.smWhatif)));
  $$('[data-sm-preset]').forEach(x=>x.addEventListener('click',()=>loadPreset(x.dataset.smPreset)));
  $('[data-sm-test-another]')?.addEventListener('click',resetDemo);
  $('[data-sm-copy-blueprint]')?.addEventListener('click',copyBlueprint);
  $('[data-sm-print-blueprint]')?.addEventListener('click',()=>window.print());
  $('[data-sm-email-form]')?.addEventListener('submit',emailBlueprint);
  $('[data-sm-continue-saved]')?.addEventListener('click',continueSaved);
  $('[data-sm-start-again]')?.addEventListener('click',resetDemo);
  setupNav();setupTools();

  const saved=loadSaved();if(saved)els.returnBanner.hidden=false;
  window.OyeolaSmartMatch={calculate,runSelfTests,config:CONFIG};
  window.OyeolaSmartMatchTests=runSelfTests();
})();