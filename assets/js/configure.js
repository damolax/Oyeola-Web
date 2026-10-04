(() => {
  'use strict';

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const AUTO_KEY='oyeola-configure-autosave-v1';
  const SAVE_KEY='oyeola-configure-saved-v1';

  const DATA={
    types:{
      product:{label:'A Product',desc:'A physical or digital item with selectable specifications.',multiplier:.85,unit:'units',cta:'Buy This Configuration'},
      service:{label:'A Service',desc:'A service made from multiple components.',multiplier:.9,unit:'scope',cta:'Book Consultation'},
      package:{label:'A Package',desc:'A base plan with optional upgrades.',multiplier:.65,unit:'level',cta:'Choose This Package'},
      project:{label:'A Project',desc:'A custom scope based on size, complexity and requirements.',multiplier:1.15,unit:'scope',cta:'Request Final Quote'},
      space:{label:'A Space',desc:'A room, environment, layout or physical setup.',multiplier:1.05,unit:'capacity',cta:'Send For Review'},
      subscription:{label:'A Subscription',desc:'Features, usage and service levels.',multiplier:.55,unit:'users',cta:'Choose This Plan'},
      other:{label:'Something Else',desc:'Build a flexible example.',multiplier:1,unit:'capacity',cta:'Talk To A Specialist'}
    },
    bases:{
      essential:{label:'Essential',price:1500,capacity:25,maxFeatures:3,desc:'Focused starting point with the core structure and room for a few additions.',blocked:['advanced-performance','deep-customization'],support:'Standard'},
      enhanced:{label:'Enhanced',price:2500,capacity:50,maxFeatures:5,desc:'Balanced flexibility, broader feature support and more room to grow.',blocked:[],support:'Standard'},
      premium:{label:'Premium',price:3800,capacity:100,maxFeatures:8,desc:'Higher-capacity foundation with advanced options and premium treatment.',blocked:[],support:'Enhanced'},
      custom:{label:'Custom',price:3200,capacity:75,maxFeatures:8,desc:'A flexible base for unusual requirements and deeper configuration.',blocked:[],support:'Enhanced'}
    },
    scopes:[
      {id:1,label:'Small',detail:'Focused use',price:0,days:0,capacity:'25'},
      {id:2,label:'Medium',detail:'Growing use',price:600,days:2,capacity:'50'},
      {id:3,label:'Large',detail:'Higher demand',price:1400,days:4,capacity:'100'},
      {id:4,label:'Extended',detail:'Complex / high volume',price:2600,days:7,capacity:'200+'}
    ],
    qualities:{
      standard:{label:'Standard',price:0,days:0,desc:'Clear, practical and focused on the core requirement.'},
      refined:{label:'Refined',price:700,days:1,desc:'More polish, stronger finish and more detailed treatment.'},
      premium:{label:'Premium',price:1600,days:3,desc:'Highest visual or performance treatment in this demo.'}
    },
    features:{
      automation:{label:'Smart Automation',price:550,days:1,desc:'Reduce repetitive manual steps.',icon:'A'},
      'advanced-performance':{label:'Advanced Performance',price:750,days:2,desc:'Higher-performance setup for demanding use.',icon:'P',requires:{enhancement:'enhanced-support'},alternative:'reinforced-capacity'},
      integration:{label:'Live Integration',price:650,days:2,desc:'Connect the solution to another system or live data.',icon:'I',incompatible:['offline-mode'],alternative:'collaboration'},
      collaboration:{label:'Collaboration',price:400,days:1,desc:'Support shared work, review or approval.',icon:'C'},
      security:{label:'Enhanced Security',price:600,days:1,desc:'Add stronger control or access protection.',icon:'S'},
      'offline-mode':{label:'Offline Mode',price:450,days:2,desc:'Keep key functions usable without a live connection.',icon:'O',incompatible:['integration'],alternative:'security'},
      'deep-customization':{label:'Deep Customization',price:950,days:4,desc:'Allow more bespoke logic and structure.',icon:'D',incompatibleEnhancements:['rapid-launch'],alternative:'flexibility'},
      'reinforced-capacity':{label:'Reinforced Capacity',price:700,days:2,desc:'Strengthen the setup for higher volume or load.',icon:'R'},
      flexibility:{label:'Flexible Structure',price:500,days:1,desc:'Make the setup easier to adapt later.',icon:'F'}
    },
    enhancements:{
      'enhanced-support':{label:'Enhanced Support',price:550,days:0,desc:'Additional setup and maintenance assistance.',icon:'+'},
      'priority-setup':{label:'Priority Setup',price:450,days:-2,desc:'Prioritize implementation where the configuration allows it.',icon:'↑'},
      'premium-finish':{label:'Premium Finish',price:900,days:2,desc:'Upgrade the presentation or material treatment.',icon:'✦'},
      'advanced-analytics':{label:'Advanced Analytics',price:600,days:1,desc:'Add deeper measurement and reporting.',icon:'▦',requires:{feature:'integration'}},
      'rapid-launch':{label:'Rapid Launch',price:700,days:-3,desc:'Compress the standard timeline where possible.',icon:'⚡',incompatibleFeatures:['deep-customization'],alternative:'priority-setup'},
      'extra-capacity':{label:'Additional Capacity',price:500,days:1,desc:'Add reserve room beyond the selected scope.',icon:'+'},
      maintenance:{label:'Maintenance Plan',price:400,days:0,desc:'Add ongoing care after launch.',icon:'M'}
    },
    outcomes:[
      {id:'volume',label:'Handle higher volume',desc:'Capacity matters more.'},
      {id:'manual',label:'Reduce manual work',desc:'Automate repetitive steps.'},
      {id:'users',label:'Support more users',desc:'Collaboration and capacity matter.'},
      {id:'durability',label:'Improve durability',desc:'Choose a stronger, more resilient setup.'},
      {id:'flexibility',label:'Increase flexibility',desc:'Keep future changes easier.'},
      {id:'premium',label:'Look more premium',desc:'Prioritize finish and presentation.'},
      {id:'speed',label:'Work faster',desc:'Performance and timeline matter.'},
      {id:'maintain',label:'Be easier to maintain',desc:'Support and maintainability matter.'}
    ],
    steps:{
      product:['base','scope','requirements','features','quality','enhancements','review'],
      service:['base','requirements','scope','features','enhancements','quality','review'],
      package:['base','requirements','features','scope','quality','enhancements','review'],
      project:['requirements','base','scope','features','quality','enhancements','review'],
      space:['base','scope','quality','requirements','features','enhancements','review'],
      subscription:['base','scope','features','requirements','enhancements','quality','review'],
      other:['base','requirements','scope','features','quality','enhancements','review']
    },
    presets:{
      simple:{type:'package',mode:'manual',config:{base:'essential',scope:1,quality:'standard',features:['collaboration'],enhancements:[],requirements:['flexibility'],budget:3000,delivery:'standard',pricingMode:'price',name:'Essential Package'}},
      complex:{type:'project',mode:'manual',config:{base:'premium',scope:4,quality:'premium',features:['automation','advanced-performance','integration','collaboration','security','reinforced-capacity'],enhancements:['enhanced-support','advanced-analytics','extra-capacity','maintenance'],requirements:['volume','manual','users'],budget:10000,delivery:'standard',pricingMode:'price',name:'Premium Project Solution'},locked:['reinforced-capacity','enhanced-support']},
      auto:{type:'service',mode:'auto',config:{base:'enhanced',scope:3,quality:'refined',features:['automation','integration','flexibility'],enhancements:['enhanced-support'],requirements:['manual','flexibility'],budget:6000,delivery:'standard',pricingMode:'price',name:'Enhanced Service Solution'}}
    }
  };

  const freshConfig=()=>({base:null,scope:2,quality:'standard',features:[],enhancements:[],requirements:[],budget:null,delivery:'standard',pricingMode:'price',name:'Your Solution'});
  const state={
    type:null,mode:null,config:freshConfig(),step:0,steps:[],history:[],versions:[],locked:[],
    baseline:null,whatIf:null,lastImpact:'',started:false,invalidDemo:false
  };

  const els={
    types:$('[data-cfg-types]'),modeStep:$('[data-cfg-mode-step]'),entry:$('[data-cfg-entry]'),auto:$('[data-cfg-autobuild]'),
    outcomes:$('[data-cfg-outcomes]'),autoBudget:$('[data-cfg-auto-budget]'),autoPriority:$('[data-cfg-auto-priority]'),
    autoPreview:$('[data-cfg-auto-preview]'),builder:$('[data-cfg-builder]'),buildTitle:$('[data-cfg-build-title]'),
    stepLabel:$('[data-cfg-step-label]'),progress:$('[data-cfg-progress]'),stepKicker:$('[data-cfg-step-kicker]'),
    stepTitle:$('[data-cfg-step-title]'),stepHelp:$('[data-cfg-step-help]'),stepContent:$('[data-cfg-step-content]'),
    back:$('[data-cfg-back]'),next:$('[data-cfg-next]'),undo:$('[data-cfg-undo]'),saveState:$('[data-cfg-save-state]'),
    summary:$('[data-cfg-summary]'),summaryName:$('[data-cfg-summary-name]'),summaryBase:$('[data-cfg-summary-base]'),
    summaryScope:$('[data-cfg-summary-scope]'),summaryFeatures:$('[data-cfg-summary-features]'),summaryTimeline:$('[data-cfg-summary-timeline]'),
    valid:$('[data-cfg-valid]'),estimate:$('[data-cfg-estimate]'),added:$('[data-cfg-added]'),preview:$('[data-cfg-preview-core]'),
    budgetMini:$('[data-cfg-budget-mini]'),budgetUsage:$('[data-cfg-budget-usage]'),budgetBar:$('[data-cfg-budget-bar]'),
    budgetNote:$('[data-cfg-budget-note]'),mobileEstimate:$('[data-cfg-mobile-estimate]'),results:$('[data-cfg-results]'),
    finalName:$('[data-cfg-final-name]'),finalCopy:$('[data-cfg-final-copy]'),ref:$('[data-cfg-ref]'),health:$('[data-cfg-health]'),
    complete:$('[data-cfg-complete]'),completeStatus:$('[data-cfg-complete-status]'),completeBar:$('[data-cfg-complete-bar]'),
    completeList:$('[data-cfg-complete-list]'),healthGrid:$('[data-cfg-health-grid]'),beforeAfter:$('[data-cfg-before-after]'),
    recommendSection:$('[data-cfg-recommend-section]'),recommendations:$('[data-cfg-recommendations]'),
    whatIfCard:$('[data-cfg-whatif-card]'),versionList:$('[data-cfg-version-list]'),compareBtn:$('[data-cfg-compare]'),
    blueprint:$('[data-cfg-blueprint]'),blueprintStatus:$('[data-cfg-blueprint-status]'),returnBanner:$('[data-cfg-return]'),
    modal:$('[data-cfg-modal]'),modalKicker:$('[data-cfg-modal-kicker]'),modalTitle:$('[data-cfg-modal-title]'),modalBody:$('[data-cfg-modal-body]'),
    toast:$('[data-cfg-toast]'),leadResult:$('[data-cfg-lead-result]'),leadTimeline:$('[data-cfg-lead-timeline]')
  };

  function money(n){return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(Math.round(n||0))}
  function deep(v){return JSON.parse(JSON.stringify(v))}
  function currentType(){return DATA.types[state.type]||DATA.types.other}
  function currentBase(config=state.config){return DATA.bases[config.base]||null}
  function currentScope(config=state.config){return DATA.scopes.find(x=>x.id===Number(config.scope))||DATA.scopes[1]}
  function currentQuality(config=state.config){return DATA.qualities[config.quality]||DATA.qualities.standard}
  function feature(id){return DATA.features[id]}
  function enhancement(id){return DATA.enhancements[id]}
  function typeLabel(){return currentType().label.replace(/^A /,'').replace(/^Something Else$/,'Flexible Solution')}

  function renderTypes(){
    els.types.innerHTML='';
    Object.entries(DATA.types).forEach(([id,t])=>{
      const b=document.createElement('button');b.type='button';b.className='cfg-type-card'+(state.type===id?' selected':'');
      b.innerHTML='<strong>'+esc(t.label)+'</strong><span>'+esc(t.desc)+'</span>';
      b.addEventListener('click',()=>{state.type=id;state.mode=null;state.config=freshConfig();state.config.name='Your '+typeLabel();renderTypes();els.modeStep.hidden=false;els.modeStep.scrollIntoView({behavior:'smooth',block:'nearest'})});
      els.types.appendChild(b);
    });
  }

  function chooseMode(mode){
    if(!state.type)return;
    state.mode=mode;
    $$('[data-cfg-mode]').forEach(b=>b.classList.toggle('selected',b.dataset.cfgMode===mode));
    if(mode==='auto'){els.entry.hidden=true;els.auto.hidden=false;renderOutcomes();els.auto.scrollIntoView({behavior:'smooth',block:'start'})}
    else beginBuilder();
  }

  function renderOutcomes(){
    const selected=state.config.requirements||[];
    els.outcomes.innerHTML='';
    DATA.outcomes.forEach(o=>{
      const b=document.createElement('button');b.type='button';b.className=selected.includes(o.id)?'selected':'';
      b.innerHTML='<strong>'+esc(o.label)+'</strong><span>'+esc(o.desc)+'</span>';
      b.addEventListener('click',()=>{
        const arr=[...(state.config.requirements||[])],i=arr.indexOf(o.id);
        if(i>-1)arr.splice(i,1);else if(arr.length<4)arr.push(o.id);
        state.config.requirements=arr;renderOutcomes();
      });
      els.outcomes.appendChild(b);
    });
  }

  function generateStartingPoint(){
    const req=state.config.requirements||[];
    const budget=Number(els.autoBudget.value)||null;
    const priority=els.autoPriority.value;
    const c=freshConfig();c.requirements=[...req];c.budget=budget;
    c.base=req.includes('premium')?'premium':(budget&&budget<3200?'essential':'enhanced');
    c.scope=req.includes('volume')||req.includes('users')?3:2;
    c.quality=req.includes('premium')?'premium':'refined';
    if(req.includes('manual'))c.features.push('automation','integration');
    if(req.includes('volume'))c.features.push('reinforced-capacity','advanced-performance');
    if(req.includes('users'))c.features.push('collaboration');
    if(req.includes('durability'))c.features.push('security','reinforced-capacity');
    if(req.includes('flexibility'))c.features.push('flexibility','deep-customization');
    if(req.includes('speed'))c.features.push('advanced-performance');
    if(req.includes('maintain'))c.enhancements.push('maintenance','enhanced-support');
    if(priority==='speed')c.enhancements.push('rapid-launch');
    if(priority==='support')c.enhancements.push('enhanced-support');
    if(priority==='performance')c.features.push('advanced-performance');
    if(priority==='flexibility')c.features.push('flexibility');
    c.features=unique(c.features);c.enhancements=unique(c.enhancements);
    if(c.features.includes('advanced-performance')&&!c.enhancements.includes('enhanced-support'))c.enhancements.push('enhanced-support');
    if(c.enhancements.includes('rapid-launch')&&c.features.includes('deep-customization'))c.features=c.features.filter(x=>x!=='deep-customization');
    if(c.enhancements.includes('advanced-analytics')&&!c.features.includes('integration'))c.features.push('integration');
    if(c.base==='essential'){
      c.features=c.features.filter(id=>!DATA.bases.essential.blocked.includes(id)).slice(0,3);
    }
    c.name=(DATA.bases[c.base]?.label||'Custom')+' '+typeLabel();
    state.config=c;state.baseline=baselineFrom(c);state.locked=[];
    const m=metrics(c);
    els.autoPreview.innerHTML='<div class="cfg-generated"><p class="cfg-kicker">WE BUILT A STARTING POINT FOR YOU.</p><h4>'+esc(c.name)+'</h4><div class="cfg-generated-grid">'+[
      ['Base',DATA.bases[c.base].label],['Scope',currentScope(c).label],['Quality',currentQuality(c).label],['Features',String(c.features.length)],
      ['Estimated',money(m.total)],['Priority fit',autoFit(c,priority)+'%']
    ].map(([k,v])=>'<div><small>'+esc(k)+'</small><strong>'+esc(v)+'</strong></div>').join('')+'</div><div class="cfg-actions"><button class="cfg-btn" type="button" data-cfg-customize-generated>Customize This</button><button class="cfg-btn cfg-btn-ghost" type="button" data-cfg-manual-switch>Start From Scratch</button></div></div>';
    $('[data-cfg-customize-generated]',els.autoPreview)?.addEventListener('click',beginBuilder);
    $$('[data-cfg-manual-switch]',els.autoPreview).forEach(b=>b.addEventListener('click',()=>{state.config=freshConfig();state.config.name='Your '+typeLabel();state.mode='manual';beginBuilder()}));
  }

  function autoFit(c,priority){
    const m=metrics(c);let score=78;
    if(priority==='budget'&&c.budget)score+=m.total<=c.budget?16:2;
    if(priority==='performance'&&c.features.includes('advanced-performance'))score+=16;
    if(priority==='speed'&&c.enhancements.includes('rapid-launch'))score+=16;
    if(priority==='flexibility'&&(c.features.includes('flexibility')||c.features.includes('deep-customization')))score+=16;
    if(priority==='support'&&c.enhancements.includes('enhanced-support'))score+=16;
    return Math.min(97,score);
  }

  function beginBuilder(){
    state.started=true;state.steps=DATA.steps[state.type]||DATA.steps.other;state.step=Math.min(state.step,state.steps.length-1);
    if(!state.baseline)state.baseline=baselineFrom(state.config);
    els.entry.hidden=true;els.auto.hidden=true;els.builder.hidden=false;els.results.hidden=true;
    renderBuilder();els.builder.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function baselineFrom(c){
    const base=c.base||'essential';
    return{base,scope:1,quality:'standard',features:[],enhancements:[],requirements:[],budget:c.budget,delivery:'standard',pricingMode:'price',name:(DATA.bases[base]?.label||'Essential')+' '+typeLabel()};
  }

  function renderBuilder(){
    state.steps=DATA.steps[state.type]||DATA.steps.other;
    const stepId=state.steps[state.step],spec=stepSpec(stepId);
    els.buildTitle.textContent=state.config.name||'YOUR SOLUTION';
    els.stepLabel.textContent='Step '+(state.step+1)+' of '+state.steps.length;
    els.stepKicker.textContent='STEP '+(state.step+1);els.stepTitle.textContent=spec.title;els.stepHelp.textContent=spec.help;
    els.progress.style.width=Math.round((state.step/state.steps.length)*100)+'%';
    els.stepContent.innerHTML='';
    renderStep(stepId);
    els.back.disabled=state.step===0;els.next.textContent=state.step===state.steps.length-1?'See My Configuration':'Continue';
    els.undo.disabled=state.history.length===0;
    renderSummary();autoSave();
  }

  function stepSpec(id){
    return({
      base:{title:'Start With Your Base',help:'Choose the starting structure. Different customers can reasonably start in different places.'},
      scope:{title:scopeTitle(),help:'Size, quantity or scope affects capacity, estimate and timeline.'},
      requirements:{title:'What Must This Solution Do?',help:'Choose outcomes before features if that is easier. These guide recommendations and enhancements.'},
      features:{title:'Choose The Features That Matter',help:'Every selected feature changes price, timeline, compatibility or the live preview.'},
      quality:{title:'Choose Style / Quality / Performance',help:'Change the level of finish or performance. This affects both the estimate and timeline.'},
      enhancements:{title:'Add Enhancements',help:'Only add what creates useful value. Dependencies and conflicts are explained before they change your setup.'},
      review:{title:'Review Compatibility & Output',help:'Check the configuration, choose whether price should be shown, and finish the specification.'}
    })[id];
  }
  function scopeTitle(){
    if(state.type==='product')return'Define Quantity / Capacity';
    if(state.type==='subscription')return'Define Usage / Users';
    if(state.type==='space')return'Define Size / Capacity';
    return'Define Size / Quantity / Scope';
  }

  function renderStep(id){
    if(id==='base')renderBaseStep();
    if(id==='scope')renderScopeStep();
    if(id==='requirements')renderRequirementsStep();
    if(id==='features')renderFeaturesStep();
    if(id==='quality')renderQualityStep();
    if(id==='enhancements')renderEnhancementsStep();
    if(id==='review')renderReviewStep();
  }

  function renderBaseStep(){
    const grid=document.createElement('div');grid.className='cfg-option-grid';
    Object.entries(DATA.bases).forEach(([id,b])=>{
      const btn=document.createElement('button');btn.type='button';btn.className='cfg-option'+(state.config.base===id?' selected':'');
      const price=b.price*currentType().multiplier;
      btn.innerHTML='<strong>'+esc(b.label)+'</strong><span>'+esc(b.desc)+'</span><em>Starts '+money(price)+' · '+b.capacity+' base capacity</em>';
      btn.addEventListener('click',()=>selectBase(id));grid.appendChild(btn);
    });
    els.stepContent.appendChild(grid);
  }

  function selectBase(id){
    const previous=state.config.base;pushHistory();
    state.config.base=id;
    if(!state.config.name||/^Your /.test(state.config.name)||previous&&state.config.name.startsWith(DATA.bases[previous]?.label||''))state.config.name=DATA.bases[id].label+' '+typeLabel();
    const removed=normalizeAfterBaseChange();
    state.baseline=state.baseline||baselineFrom(state.config);
    state.lastImpact=(previous?'Base changed from '+DATA.bases[previous].label+' to ':'Base set to ')+DATA.bases[id].label+(removed.length?'. Removed '+removed.join(', ')+' because they are not supported by this base.':'.');
    toast(state.lastImpact);renderBuilder();
  }

  function normalizeAfterBaseChange(){
    const base=currentBase(),removed=[];
    if(!base)return removed;
    state.config.features=[...state.config.features].filter(id=>{
      const invalid=base.blocked.includes(id);if(invalid){removed.push(DATA.features[id].label);state.locked=state.locked.filter(x=>x!==id)}return !invalid;
    });
    while(state.config.features.length>base.maxFeatures){
      const idx=[...state.config.features].reverse().find(id=>!state.locked.includes(id));
      if(!idx)break;state.config.features=state.config.features.filter(x=>x!==idx);removed.push(DATA.features[idx].label);
    }
    state.config.enhancements=[...state.config.enhancements].filter(id=>{
      if(id==='premium-finish'&&state.config.base==='essential'){removed.push(DATA.enhancements[id].label);state.locked=state.locked.filter(x=>x!==id);return false}
      return true;
    });
    return removed;
  }

  function renderScopeStep(){
    const wrap=document.createElement('div');wrap.className='cfg-scope-control';
    const value=Number(state.config.scope||2),scope=currentScope();
    wrap.innerHTML='<div class="cfg-scope-value" data-cfg-scope-value>'+esc(scope.label+' · '+scope.capacity+' '+currentType().unit)+'</div><input type="range" min="1" max="4" step="1" value="'+value+'" aria-label="Configuration size or scope"><div class="cfg-scope-labels">'+DATA.scopes.map(s=>'<span>'+esc(s.label)+'</span>').join('')+'</div>';
    const input=$('input',wrap),display=$('[data-cfg-scope-value]',wrap);
    input.addEventListener('change',()=>changeScope(Number(input.value)));
    input.addEventListener('input',()=>{const s=DATA.scopes[Number(input.value)-1];display.textContent=s.label+' · '+s.capacity+' '+currentType().unit});
    const quick=document.createElement('div');quick.className='cfg-scope-quick';
    quick.innerHTML=DATA.scopes.map(s=>'<button type="button" class="'+(Number(state.config.scope)===s.id?'selected':'')+'" data-scope-quick="'+s.id+'"><strong>'+esc(s.label)+'</strong><span>'+esc(s.capacity+' '+currentType().unit)+'</span></button>').join('');
    $('[data-scope-quick]',quick).forEach(b=>b.addEventListener('click',()=>changeScope(Number(b.dataset.scopeQuick))));
    wrap.appendChild(quick);
    els.stepContent.appendChild(wrap);

    const budget=document.createElement('div');budget.className='cfg-budget-card';
    budget.innerHTML='<h4>My Target Budget <span style="color:var(--cfg-muted);font-size:11px;font-weight:400">optional</span></h4><p>Set a target. The system will show budget pressure and can suggest a valid lower-cost version without removing locked priorities.</p><div class="cfg-money-input"><span>£</span><input type="number" min="0" step="100" placeholder="5000" value="'+(state.config.budget||'')+'" data-cfg-budget-input></div>';
    $('[data-cfg-budget-input]',budget).addEventListener('change',e=>{pushHistory();state.config.budget=Number(e.target.value)||null;state.lastImpact=state.config.budget?'Budget target set to '+money(state.config.budget)+'.':'Budget target removed.';toast(state.lastImpact);renderBuilder()});
    els.stepContent.appendChild(budget);
  }

  function changeScope(next){
    const prev=currentScope();pushHistory();state.config.scope=next;
    if(next===4&&!state.config.features.includes('reinforced-capacity')){
      state.lastImpact='Scope increased to Extended. Reinforced Capacity is recommended for this level.';
    }else{
      const now=currentScope();const diff=metrics(state.config).total-metrics({...state.config,scope:prev.id}).total;
      state.lastImpact='Scope changed '+prev.label+' → '+now.label+'. Estimate '+signedMoney(diff)+'; timeline '+signedDays(now.days-prev.days)+'.';
    }
    toast(state.lastImpact);renderBuilder();
  }

  function renderRequirementsStep(){
    const grid=document.createElement('div');grid.className='cfg-outcome-grid';
    DATA.outcomes.forEach(o=>{
      const selected=state.config.requirements.includes(o.id),b=document.createElement('button');b.type='button';b.className=selected?'selected':'';
      b.innerHTML='<strong>'+esc(o.label)+'</strong><span>'+esc(o.desc)+'</span>';
      b.addEventListener('click',()=>{pushHistory();toggleArray(state.config.requirements,o.id);state.lastImpact=(selected?'Removed':'Added')+' requirement: '+o.label+'.';toast(state.lastImpact);renderBuilder()});
      grid.appendChild(b);
    });
    els.stepContent.appendChild(grid);
    const rec=recommendedFeaturesFromRequirements();
    if(rec.length){
      const box=document.createElement('div');box.className='cfg-impact';box.innerHTML='<strong>Relevant to your outcomes</strong><p>'+esc(rec.map(id=>DATA.features[id]?.label||DATA.enhancements[id]?.label||id).join(' · '))+' may be useful later. Nothing is added automatically.</p>';els.stepContent.appendChild(box);
    }
  }

  function recommendedFeaturesFromRequirements(){
    const out=[];
    state.config.requirements.forEach(r=>{
      if(r==='volume')out.push('reinforced-capacity');
      if(r==='manual')out.push('automation');
      if(r==='users')out.push('collaboration');
      if(r==='durability')out.push('security');
      if(r==='flexibility')out.push('flexibility');
      if(r==='premium')out.push('premium-finish');
      if(r==='speed')out.push('advanced-performance');
      if(r==='maintain')out.push('enhanced-support');
    });
    return unique(out).slice(0,4);
  }

  function renderFeaturesStep(){
    const list=document.createElement('div');list.className='cfg-feature-list';
    Object.entries(DATA.features).forEach(([id,f])=>{
      const selected=state.config.features.includes(id),base=currentBase();
      const blocked=base?.blocked.includes(id);
      const row=document.createElement('div');row.className='cfg-feature-row'+(blocked?' cfg-option-disabled':'');
      row.innerHTML='<div class="cfg-feature-main"><input class="cfg-feature-toggle" type="checkbox" '+(selected?'checked':'')+' '+(blocked?'disabled':'')+' aria-label="'+esc(f.label)+'"><div class="cfg-feature-copy"><strong>'+esc(f.label)+'</strong><span>'+esc(f.desc)+'</span><em>+'+money(f.price)+' · '+(f.days?('+'+f.days+' day'+(f.days>1?'s':'')):'no timeline change')+(blocked?' · unavailable on '+base.label:'')+'</em></div></div><button class="cfg-lock '+(state.locked.includes(id)?'locked':'')+'" type="button" '+(!selected?'disabled':'')+'>'+ (state.locked.includes(id)?'Must Keep ✓':'Must Keep') +'</button>';
      const check=$('input',row),lock=$('.cfg-lock',row);
      check.addEventListener('change',()=>toggleFeature(id,check.checked));
      lock.addEventListener('click',()=>toggleLock(id));
      list.appendChild(row);
    });
    els.stepContent.appendChild(list);
    if(currentScope().id===4&&!state.config.features.includes('reinforced-capacity')){
      const box=document.createElement('div');box.className='cfg-impact';box.innerHTML='<strong>Capacity recommendation</strong><p>Extended scope benefits from Reinforced Capacity. You can still continue without it in this demo, but configuration health will reflect the gap.</p>';els.stepContent.appendChild(box);
    }
  }

  function toggleFeature(id,on){
    const f=feature(id),base=currentBase();if(!f)return;
    if(on){
      if(base?.blocked.includes(id)){
        openModal('SMART ALTERNATIVE','This option needs a stronger base.','<div class="cfg-conflict"><p>'+esc(f.label)+' is not supported by '+esc(base.label)+'. The closest valid starting point is Enhanced.</p><div class="cfg-conflict-options"><button class="cfg-btn cfg-btn-small" type="button" data-action="upgrade-base">Switch to Enhanced</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="cancel">Keep '+esc(base.label)+'</button></div></div>');
        bindModalAction('upgrade-base',()=>{pushHistory();state.config.base='enhanced';state.config.features=unique([...state.config.features,id]);ensureDependenciesForFeature(id);closeModal();toast('Base upgraded to Enhanced so '+f.label+' can be used.');renderBuilder()});bindModalAction('cancel',closeModal);return;
      }
      const conflict=(f.incompatible||[]).find(x=>state.config.features.includes(x));
      if(conflict){showConflict('feature',id,'feature',conflict);return}
      const conflictEnh=(f.incompatibleEnhancements||[]).find(x=>state.config.enhancements.includes(x));
      if(conflictEnh){showConflict('feature',id,'enhancement',conflictEnh);return}
      if(f.requires){
        const missingFeature=f.requires.feature&&!state.config.features.includes(f.requires.feature);
        const missingEnh=f.requires.enhancement&&!state.config.enhancements.includes(f.requires.enhancement);
        if(missingFeature||missingEnh){
          const reqId=f.requires.feature||f.requires.enhancement,reqObj=f.requires.feature?feature(reqId):enhancement(reqId);
          openModal('REQUIRED RELATIONSHIP',f.label+' needs '+reqObj.label+'.','<div class="cfg-conflict"><p>This option depends on '+esc(reqObj.label)+'. Add the required feature automatically, or keep your current configuration unchanged.</p><div class="cfg-conflict-options"><button class="cfg-btn cfg-btn-small" type="button" data-action="add-required">Add Required Feature</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="cancel">Not Now</button></div></div>');
          bindModalAction('add-required',()=>{pushHistory();state.config.features=unique([...state.config.features,id]);if(f.requires.feature)state.config.features=unique([...state.config.features,f.requires.feature]);if(f.requires.enhancement)state.config.enhancements=unique([...state.config.enhancements,f.requires.enhancement]);closeModal();toast(f.label+' added with '+reqObj.label+'.');renderBuilder()});bindModalAction('cancel',closeModal);return;
        }
      }
      if(base&&state.config.features.length>=base.maxFeatures){
        toast(base.label+' supports up to '+base.maxFeatures+' selected features in this demo.');renderBuilder();return;
      }
      pushHistory();state.config.features=unique([...state.config.features,id]);state.lastImpact=f.label+' added. Estimate +'+money(f.price)+(f.days?' · timeline +'+f.days+' day'+(f.days>1?'s':''):'')+'.';toast(state.lastImpact);renderBuilder();
    }else{
      pushHistory();state.config.features=state.config.features.filter(x=>x!==id);state.locked=state.locked.filter(x=>x!==id);
      const removed=[];
      Object.entries(DATA.enhancements).forEach(([eid,e])=>{if(e.requires?.feature===id&&state.config.enhancements.includes(eid)){state.config.enhancements=state.config.enhancements.filter(x=>x!==eid);removed.push(e.label);state.locked=state.locked.filter(x=>x!==eid)}});
      state.lastImpact=f.label+' removed.'+(removed.length?' '+removed.join(', ')+' was also removed because its requirement no longer exists.':'');toast(state.lastImpact);renderBuilder();
    }
  }

  function ensureDependenciesForFeature(id){
    const f=feature(id);if(f?.requires?.feature)state.config.features=unique([...state.config.features,f.requires.feature]);if(f?.requires?.enhancement)state.config.enhancements=unique([...state.config.enhancements,f.requires.enhancement]);
  }

  function showConflict(newType,newId,oldType,oldId){
    const newObj=newType==='feature'?feature(newId):enhancement(newId),oldObj=oldType==='feature'?feature(oldId):enhancement(oldId);
    openModal('COMPATIBILITY CHECK','THESE TWO OPTIONS DON’T WORK TOGETHER.','<div class="cfg-conflict"><p>'+esc(newObj.label)+' conflicts with '+esc(oldObj.label)+'. Choose which matters more and the configurator will restore a valid setup.</p><div class="cfg-conflict-options"><button class="cfg-btn cfg-btn-small" type="button" data-action="keep-new">Keep '+esc(newObj.label)+'</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="keep-old">Keep '+esc(oldObj.label)+'</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="suggest">Suggest Alternative</button></div></div>');
    bindModalAction('keep-new',()=>{pushHistory();removeItem(oldType,oldId);addItem(newType,newId);closeModal();toast(oldObj.label+' removed to keep '+newObj.label+'.');renderBuilder()});
    bindModalAction('keep-old',()=>{closeModal();toast('Kept '+oldObj.label+'. No invalid change was applied.');renderBuilder()});
    bindModalAction('suggest',()=>{const alt=newObj.alternative;closeModal();if(alt){if(feature(alt))toggleFeature(alt,true);else if(enhancement(alt))toggleEnhancement(alt,true)}else toast('Closest alternative: keep '+oldObj.label+' and review another option.')});
  }

  function addItem(type,id){if(type==='feature')state.config.features=unique([...state.config.features,id]);else state.config.enhancements=unique([...state.config.enhancements,id])}
  function removeItem(type,id){if(type==='feature')state.config.features=state.config.features.filter(x=>x!==id);else state.config.enhancements=state.config.enhancements.filter(x=>x!==id);state.locked=state.locked.filter(x=>x!==id)}
  function toggleLock(id){pushHistory();toggleArray(state.locked,id);toast(state.locked.includes(id)?'Locked as Must Keep. Budget optimization will preserve it.':'Priority lock removed.');renderBuilder()}

  function renderQualityStep(){
    const grid=document.createElement('div');grid.className='cfg-option-grid';
    Object.entries(DATA.qualities).forEach(([id,q])=>{
      const b=document.createElement('button');b.type='button';b.className='cfg-option'+(state.config.quality===id?' selected':'');
      b.innerHTML='<strong>'+esc(q.label)+'</strong><span>'+esc(q.desc)+'</span><em>'+(q.price?('+'+money(q.price)):'Included')+(q.days?' · +'+q.days+' day'+(q.days>1?'s':''):'')+'</em>';
      b.addEventListener('click',()=>{const prev=currentQuality();pushHistory();state.config.quality=id;const next=DATA.qualities[id];state.lastImpact='Quality changed '+prev.label+' → '+next.label+'. Estimate '+signedMoney(next.price-prev.price)+'; timeline '+signedDays(next.days-prev.days)+'.';toast(state.lastImpact);renderBuilder()});grid.appendChild(b);
    });
    els.stepContent.appendChild(grid);
  }

  function renderEnhancementsStep(){
    const list=document.createElement('div');list.className='cfg-feature-list';
    Object.entries(DATA.enhancements).forEach(([id,e])=>{
      const selected=state.config.enhancements.includes(id),blocked=id==='premium-finish'&&state.config.base==='essential';
      const row=document.createElement('div');row.className='cfg-feature-row';
      row.innerHTML='<div class="cfg-feature-main"><input class="cfg-feature-toggle" type="checkbox" '+(selected?'checked':'')+' '+(blocked?'disabled':'')+' aria-label="'+esc(e.label)+'"><div class="cfg-feature-copy"><strong>'+esc(e.label)+'</strong><span>'+esc(e.desc)+'</span><em>+'+money(e.price)+' · '+(e.days===0?'no timeline change':(e.days>0?'+':'')+e.days+' days')+(blocked?' · requires Enhanced or higher':'')+'</em></div></div><button class="cfg-lock '+(state.locked.includes(id)?'locked':'')+'" type="button" '+(!selected?'disabled':'')+'>'+ (state.locked.includes(id)?'Must Keep ✓':'Must Keep') +'</button>';
      $('input',row).addEventListener('change',ev=>toggleEnhancement(id,ev.target.checked));$('.cfg-lock',row).addEventListener('click',()=>toggleLock(id));list.appendChild(row);
    });
    els.stepContent.appendChild(list);
    const delivery=document.createElement('div');delivery.className='cfg-budget-card';
    delivery.innerHTML='<h4>Delivery preference</h4><p>This is optional but can affect the suggested next step and timeline.</p><div class="cfg-option-grid">'+[['standard','Standard','Balanced timeline'],['priority','Priority','Faster where compatible'],['flexible','Flexible','Timing can move']].map(([id,l,d])=>'<button type="button" class="cfg-option '+(state.config.delivery===id?'selected':'')+'" data-delivery="'+id+'"><strong>'+l+'</strong><span>'+d+'</span></button>').join('')+'</div>';
    $$('[data-delivery]',delivery).forEach(b=>b.addEventListener('click',()=>{pushHistory();state.config.delivery=b.dataset.delivery;toast('Delivery preference updated to '+b.textContent.trim()+'.');renderBuilder()}));els.stepContent.appendChild(delivery);
  }

  function toggleEnhancement(id,on){
    const e=enhancement(id);if(!e)return;
    if(on){
      if(id==='premium-finish'&&state.config.base==='essential'){openModal('SMART ALTERNATIVE','Premium Finish needs a stronger base.','<div class="cfg-conflict"><p>Switch to Enhanced to unlock this enhancement, or keep the current Essential setup.</p><div class="cfg-conflict-options"><button class="cfg-btn cfg-btn-small" type="button" data-action="upgrade-base">Switch to Enhanced</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="cancel">Keep Essential</button></div></div>');bindModalAction('upgrade-base',()=>{pushHistory();state.config.base='enhanced';state.config.enhancements=unique([...state.config.enhancements,id]);closeModal();toast('Enhanced base selected and Premium Finish added.');renderBuilder()});bindModalAction('cancel',closeModal);return}
      const conflict=(e.incompatibleFeatures||[]).find(x=>state.config.features.includes(x));if(conflict){showConflict('enhancement',id,'feature',conflict);return}
      if(e.requires){
        const missingFeature=e.requires.feature&&!state.config.features.includes(e.requires.feature),missingEnh=e.requires.enhancement&&!state.config.enhancements.includes(e.requires.enhancement);
        if(missingFeature||missingEnh){
          const reqId=e.requires.feature||e.requires.enhancement,reqObj=e.requires.feature?feature(reqId):enhancement(reqId);
          openModal('REQUIRED RELATIONSHIP',e.label+' needs '+reqObj.label+'.','<div class="cfg-conflict"><p>Add the required option automatically so the configuration stays valid.</p><div class="cfg-conflict-options"><button class="cfg-btn cfg-btn-small" type="button" data-action="add-required">Add Required Feature</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="cancel">Not Now</button></div></div>');
          bindModalAction('add-required',()=>{pushHistory();state.config.enhancements=unique([...state.config.enhancements,id]);if(e.requires.feature)state.config.features=unique([...state.config.features,e.requires.feature]);if(e.requires.enhancement)state.config.enhancements=unique([...state.config.enhancements,e.requires.enhancement]);closeModal();toast(e.label+' added with '+reqObj.label+'.');renderBuilder()});bindModalAction('cancel',closeModal);return}
      }
      pushHistory();state.config.enhancements=unique([...state.config.enhancements,id]);state.lastImpact=e.label+' added. Estimate +'+money(e.price)+(e.days?' · timeline '+signedDays(e.days):'')+'.';toast(state.lastImpact);renderBuilder();
    }else{
      const requiredBy=Object.entries(DATA.features).find(([fid,f])=>f.requires?.enhancement===id&&state.config.features.includes(fid));
      if(requiredBy){openModal('DEPENDENCY','Keep '+e.label+' or remove '+requiredBy[1].label+' first.','<div class="cfg-conflict"><p>'+esc(requiredBy[1].label)+' currently depends on '+esc(e.label)+'.</p><div class="cfg-conflict-options"><button class="cfg-btn cfg-btn-small" type="button" data-action="remove-both">Remove Both</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="cancel">Keep Current Setup</button></div></div>');bindModalAction('remove-both',()=>{pushHistory();state.config.enhancements=state.config.enhancements.filter(x=>x!==id);state.config.features=state.config.features.filter(x=>x!==requiredBy[0]);state.locked=state.locked.filter(x=>x!==id&&x!==requiredBy[0]);closeModal();toast(e.label+' and '+requiredBy[1].label+' removed.');renderBuilder()});bindModalAction('cancel',closeModal);return}
      pushHistory();state.config.enhancements=state.config.enhancements.filter(x=>x!==id);state.locked=state.locked.filter(x=>x!==id);toast(e.label+' removed.');renderBuilder();
    }
  }

  function renderReviewStep(){
    const m=metrics(state.config),v=validate(state.config);
    const wrap=document.createElement('div');wrap.className='cfg-review-list';
    const rows=[['Configuration',state.config.name],['Type',DATA.types[state.type]?.label||'Flexible'],['Base',currentBase()?.label||'Not selected'],['Scope',currentScope().label],['Features',state.config.features.map(id=>feature(id)?.label).filter(Boolean).join(', ')||'None'],['Enhancements',state.config.enhancements.map(id=>enhancement(id)?.label).filter(Boolean).join(', ')||'None'],['Compatibility',v.valid?'Valid':v.issues.length+' issue(s)'],['Timeline',timelineLabel(m.days)]];
    wrap.innerHTML=rows.map(([k,val])=>'<div class="cfg-review-item"><span>'+esc(k)+'</span><strong>'+esc(val)+'</strong></div>').join('');
    els.stepContent.appendChild(wrap);

    const name=document.createElement('label');name.className='cfg-field';name.innerHTML='Configuration name<input type="text" maxlength="80" value="'+escAttr(state.config.name)+'" data-review-name>';
    $('input',name).addEventListener('change',e=>{pushHistory();state.config.name=e.target.value.trim()||'Your '+typeLabel();renderBuilder()});els.stepContent.appendChild(name);

    const mode=document.createElement('div');mode.className='cfg-budget-card';
    mode.innerHTML='<h4>Result display</h4><p>Not every business should publish pricing. The same engine can output an estimate or a quote-required scope.</p><div class="cfg-option-grid"><button type="button" class="cfg-option '+(state.config.pricingMode==='price'?'selected':'')+'" data-price-mode="price"><strong>Estimated Price</strong><span>Show a changing demonstration estimate.</span></button><button type="button" class="cfg-option '+(state.config.pricingMode==='quote'?'selected':'')+'" data-price-mode="quote"><strong>Quote Required</strong><span>Calculate scope, requirements and timeline without exposing price.</span></button></div>';
    $$('[data-price-mode]',mode).forEach(b=>b.addEventListener('click',()=>{pushHistory();state.config.pricingMode=b.dataset.priceMode;toast('Result output changed to '+(b.dataset.priceMode==='price'?'Estimated Price':'Quote Required')+'.');renderBuilder()}));els.stepContent.appendChild(mode);

    const breakdown=document.createElement('div');breakdown.className='cfg-budget-card';
    breakdown.innerHTML='<h4>Current breakdown</h4><div class="cfg-review-list">'+priceBreakdown(state.config).map(([k,val])=>'<div class="cfg-review-item"><span>'+esc(k)+'</span><strong>'+money(val)+'</strong></div>').join('')+'</div>';els.stepContent.appendChild(breakdown);
  }

  function metrics(c){
    const typeMult=currentType().multiplier,base=DATA.bases[c.base]||DATA.bases.essential,scope=currentScope(c),quality=currentQuality(c);
    const basePrice=base.price*typeMult,scopePrice=scope.price*typeMult,qualityPrice=quality.price*typeMult;
    const features=(c.features||[]).reduce((s,id)=>s+(feature(id)?.price||0)*typeMult,0);
    const enhancements=(c.enhancements||[]).reduce((s,id)=>s+(enhancement(id)?.price||0)*typeMult,0);
    const total=basePrice+scopePrice+qualityPrice+features+enhancements;
    let days=7+scope.days+quality.days+(c.features||[]).reduce((s,id)=>s+(feature(id)?.days||0),0)+(c.enhancements||[]).reduce((s,id)=>s+(enhancement(id)?.days||0),0);
    if(c.delivery==='priority')days-=2;if(c.delivery==='flexible')days+=2;days=Math.max(3,days);
    const baseOnly=basePrice;
    const complexityPoints=(c.features||[]).length+(c.enhancements||[]).length+scope.id+(quality===DATA.qualities.premium?2:0)+(c.base==='custom'?2:0);
    const complexity=complexityPoints>=12?'Advanced':complexityPoints>=7?'Standard':'Basic';
    return{basePrice,scopePrice,qualityPrice,features,enhancements,total,added:Math.max(0,total-baseOnly),days,complexity,capacity:Number(scope.capacity.replace('+',''))||200};
  }

  function priceBreakdown(c){
    const m=metrics(c),out=[[(currentBase(c)?.label||'Base')+' base',m.basePrice]];
    if(m.scopePrice)out.push([currentScope(c).label+' scope',m.scopePrice]);
    (c.features||[]).forEach(id=>out.push([feature(id).label,feature(id).price*currentType().multiplier]));
    if(m.qualityPrice)out.push([currentQuality(c).label+' quality',m.qualityPrice]);
    (c.enhancements||[]).forEach(id=>out.push([enhancement(id).label,enhancement(id).price*currentType().multiplier]));
    return out;
  }

  function validate(c){
    const issues=[],base=currentBase(c);
    if(!c.base)issues.push('Choose a base.');
    if(base){
      (c.features||[]).forEach(id=>{if(base.blocked.includes(id))issues.push(DATA.features[id].label+' is not supported by '+base.label+'.')});
      if((c.features||[]).length>base.maxFeatures)issues.push(base.label+' supports up to '+base.maxFeatures+' features in this demo.');
    }
    (c.features||[]).forEach(id=>{
      const f=feature(id);(f?.incompatible||[]).forEach(other=>{if(c.features.includes(other)&&id<other)issues.push(f.label+' conflicts with '+feature(other).label+'.')});
      (f?.incompatibleEnhancements||[]).forEach(other=>{if(c.enhancements.includes(other))issues.push(f.label+' conflicts with '+enhancement(other).label+'.')});
      if(f?.requires?.feature&&!c.features.includes(f.requires.feature))issues.push(f.label+' requires '+feature(f.requires.feature).label+'.');
      if(f?.requires?.enhancement&&!c.enhancements.includes(f.requires.enhancement))issues.push(f.label+' requires '+enhancement(f.requires.enhancement).label+'.');
    });
    (c.enhancements||[]).forEach(id=>{
      const e=enhancement(id);if(e?.requires?.feature&&!c.features.includes(e.requires.feature))issues.push(e.label+' requires '+feature(e.requires.feature).label+'.');
      if(e?.requires?.enhancement&&!c.enhancements.includes(e.requires.enhancement))issues.push(e.label+' requires '+enhancement(e.requires.enhancement).label+'.');
      (e?.incompatibleFeatures||[]).forEach(fid=>{if(c.features.includes(fid))issues.push(e.label+' conflicts with '+feature(fid).label+'.')});
    });
    if(c.scope===4&&!c.features.includes('reinforced-capacity'))issues.push('Extended scope is stronger with Reinforced Capacity.');
    return{valid:issues.length===0,issues};
  }

  function completeness(c){
    const checks=[
      ['Base selected',!!c.base],
      ['Capacity / scope chosen',!!c.scope],
      ['Features considered',(c.features||[]).length>0],
      ['Quality level selected',!!c.quality],
      ['Requirements identified',(c.requirements||[]).length>0],
      ['Delivery preference',!!c.delivery]
    ];
    const requiredWeight=[20,20,20,15,15,10];let score=0;checks.forEach((x,i)=>{if(x[1])score+=requiredWeight[i]});
    return{score,checks};
  }

  function health(c){
    const v=validate(c),m=metrics(c),comp=completeness(c);
    const compatibility=v.valid?100:Math.max(35,100-v.issues.length*22);
    let budget=100;if(c.budget){const ratio=m.total/c.budget;budget=ratio<=1?Math.max(78,100-Math.round((1-ratio)*15)):Math.max(25,100-Math.round((ratio-1)*110))}
    const requirements=comp.score;
    const performance=Math.min(100,58+(c.features||[]).length*7+(c.quality==='premium'?16:c.quality==='refined'?9:0)+(c.scope>=3?8:0));
    const complexity=m.complexity;
    const overall=Math.round(compatibility*.35+budget*.2+requirements*.25+performance*.2);
    return{overall,compatibility,budget,requirements,performance,complexity};
  }

  function renderSummary(){
    const c=state.config,m=metrics(c),v=validate(c),base=currentBase(c),scope=currentScope(c);
    els.summaryName.textContent=c.name||'Your Solution';els.summaryBase.textContent=base?.label||'Not selected';els.summaryScope.textContent=scope.label+' · '+scope.capacity+' '+currentType().unit;
    els.summaryFeatures.textContent=String((c.features||[]).length+(c.enhancements||[]).length);els.summaryTimeline.textContent=timelineLabel(m.days);
    els.valid.textContent=v.valid?'✓ Valid':(v.issues.length+' issue'+(v.issues.length===1?'':'s'));els.valid.className='cfg-valid '+(v.valid?'':v.issues.some(x=>/conflicts|requires|not supported/.test(x))?'bad':'warn');
    els.estimate.textContent=c.pricingMode==='quote'?'Quote Required':money(m.total);els.added.textContent=c.pricingMode==='quote'?(m.complexity+' complexity'):(money(m.added)+' added');els.mobileEstimate.textContent=c.pricingMode==='quote'?'Quote Required':money(m.total);
    els.preview.innerHTML=previewMarkup(c);els.preview.className='cfg-preview-core '+(c.quality==='premium'?'cfg-preview-premium ':'')+(c.scope>=3?'cfg-preview-large':'');
    renderBudget(m);renderPriceBreakdownInSummary(c);
  }

  function previewMarkup(c){
    const count=Math.min(5,(c.features||[]).length+(c.enhancements||[]).length),mods=[];
    const ids=[...(c.features||[]),...(c.enhancements||[])].slice(0,5);
    for(let i=0;i<count;i++){const obj=feature(ids[i])||enhancement(ids[i]);mods.push('<div class="cfg-preview-module" title="'+esc(obj?.label||'Module')+'">'+esc(obj?.icon||String(i+1))+'</div>')}
    return '<div class="cfg-preview-base"></div>'+mods.join('');
  }

  function renderPriceBreakdownInSummary(c){
    const box=$('.cfg-price-box',els.summary);if(!box)return;
    let list=$('.cfg-price-mini-list',box);
    if(!list){list=document.createElement('div');list.className='cfg-price-mini-list';list.style.cssText='display:grid;gap:5px;margin-top:12px;padding-top:10px;border-top:1px solid var(--cfg-line);font-size:9px';box.insertBefore(list,box.querySelector('p'))}
    const rows=priceBreakdown(c).slice(0,5);
    list.innerHTML=c.pricingMode==='quote'?'<span style="color:var(--cfg-muted)">Scope is still calculated internally for compatibility, complexity and timeline.</span>':rows.map(([k,v])=>'<div style="display:flex;justify-content:space-between;gap:12px"><span style="color:var(--cfg-muted)">'+esc(k)+'</span><strong>'+money(v)+'</strong></div>').join('');
  }

  function renderBudget(m){
    const b=state.config.budget;
    if(!b){els.budgetMini.hidden=true;return}
    els.budgetMini.hidden=false;const diff=m.total-b,ratio=Math.min(1.25,m.total/b),over=diff>0;
    els.budgetMini.classList.toggle('over',over);els.budgetUsage.textContent=money(m.total)+' of '+money(b);els.budgetBar.style.width=Math.min(100,ratio*100)+'%';
    if(over){const suggestion=budgetSuggestion();els.budgetNote.textContent=money(diff)+' above your target. '+(suggestion?suggestion:'Use Optimize This to explore a lower-cost valid version.')}
    else els.budgetNote.textContent=money(Math.abs(diff))+' remaining inside your target.';
  }

  function budgetSuggestion(){
    const candidates=[
      ...state.config.enhancements.filter(id=>!state.locked.includes(id)).map(id=>({label:'Remove '+enhancement(id).label,price:enhancement(id).price})),
      ...state.config.features.filter(id=>!state.locked.includes(id)).map(id=>({label:'Remove '+feature(id).label,price:feature(id).price}))
    ].sort((a,b)=>b.price-a.price);
    if(candidates[0])return 'Closest simple adjustment: '+candidates[0].label+'.';
    if(state.config.quality==='premium')return'Switch Premium quality to Refined.';
    return'Increase budget or review the selected base.';
  }

  function optimize(){
    if(!state.config.budget){toast('Set a target budget first.');return}
    const before=metrics(state.config).total;if(before<=state.config.budget){toast('This configuration is already inside your target budget.');return}
    const clone=deep(state.config),changes=[];
    const removeEnh=[...clone.enhancements].filter(id=>!state.locked.includes(id)).sort((a,b)=>(enhancement(b)?.price||0)-(enhancement(a)?.price||0));
    for(const id of removeEnh){
      if(metricsWith(clone).total<=clone.budget)break;
      const requiredByFeature=clone.features.some(fid=>feature(fid)?.requires?.enhancement===id);
      const requiredByEnhancement=clone.enhancements.some(eid=>eid!==id&&enhancement(eid)?.requires?.enhancement===id);
      if(requiredByFeature||requiredByEnhancement)continue;
      clone.enhancements=clone.enhancements.filter(x=>x!==id);changes.push('Remove '+enhancement(id).label)
    }
    const removeFeat=[...clone.features].filter(id=>!state.locked.includes(id)).sort((a,b)=>(feature(b)?.price||0)-(feature(a)?.price||0));
    for(const id of removeFeat){if(metricsWith(clone).total<=clone.budget)break;const requiredBy=clone.enhancements.some(eid=>enhancement(eid)?.requires?.feature===id);if(requiredBy)continue;clone.features=clone.features.filter(x=>x!==id);changes.push('Remove '+feature(id).label)}
    if(metricsWith(clone).total>clone.budget&&clone.quality==='premium'){clone.quality='refined';changes.push('Premium quality → Refined')}
    if(metricsWith(clone).total>clone.budget&&clone.quality==='refined'){clone.quality='standard';changes.push('Refined quality → Standard')}
    if(metricsWith(clone).total>clone.budget&&clone.scope>1){clone.scope=Math.max(1,clone.scope-1);changes.push('Reduce scope to '+currentScope(clone).label)}
    const after=metricsWith(clone).total;
    openModal('BUDGET OPTIMIZER','Keep priorities. Reduce budget pressure.','<div class="cfg-conflict"><p>Locked choices are protected. Suggested changes:</p><div class="cfg-modal-grid">'+(changes.length?changes.map((x,i)=>'<div><small>CHANGE '+(i+1)+'</small><strong>'+esc(x)+'</strong></div>').join(''):'<div><strong>No unlocked change can reach the target without changing a locked priority.</strong></div>')+'</div><div class="cfg-modal-grid"><div><small>CURRENT</small><strong>'+money(before)+'</strong></div><div><small>OPTIMIZED</small><strong>'+money(after)+'</strong></div></div><div class="cfg-conflict-options">'+(changes.length?'<button class="cfg-btn cfg-btn-small" type="button" data-action="apply-optimize">Apply Changes</button>':'')+'<button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="cancel">Keep My Version</button></div></div>');
    bindModalAction('apply-optimize',()=>{pushHistory();state.config=clone;closeModal();toast('Budget optimization applied. Locked priorities were preserved.');renderBuilder();if(!els.results.hidden)renderResults()});bindModalAction('cancel',closeModal);
  }

  function metricsWith(c){
    const saved=state.config;state.config=c;const m=metrics(c);state.config=saved;return m;
  }

  function nextStep(){
    if(!state.config.base&&state.steps[state.step]!=='requirements'){toast('Choose a base before continuing.');return}
    if(state.step<state.steps.length-1){state.step++;renderBuilder();return}
    finishConfiguration();
  }
  function prevStep(){if(state.step>0){state.step--;renderBuilder()}}

  function finishConfiguration(){
    const v=validate(state.config);
    if(v.issues.some(x=>/conflicts|requires|not supported/.test(x))){openModal('FINISH COMPATIBILITY','One decision still needs attention.','<div class="cfg-conflict"><p>'+v.issues.map(esc).join('<br>')+'</p><div class="cfg-conflict-options"><button class="cfg-btn cfg-btn-small" type="button" data-action="return-builder">Review Configuration</button></div></div>');bindModalAction('return-builder',()=>{closeModal();state.step=Math.max(0,state.steps.indexOf('features'));renderBuilder()});return}
    els.progress.style.width='100%';renderResults();els.results.hidden=false;els.results.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderResults(){
    const c=state.config,m=metrics(c),h=health(c),comp=completeness(c),v=validate(c),ref=referenceFor(c);
    els.finalName.textContent=c.name;els.ref.textContent=ref+' · fictional demo reference';els.finalCopy.textContent=finalCopy(c,m);
    els.health.textContent=h.overall+'%';els.complete.textContent=comp.score+'% complete';els.completeStatus.textContent=comp.score>=90?'Ready to act':comp.score>=75?'Ready to refine':'Needs a few decisions';els.completeBar.style.width=comp.score+'%';
    els.completeList.innerHTML=comp.checks.map(([label,done])=>'<li>'+(done?'✓':'○')+' '+esc(label)+'</li>').join('');
    els.healthGrid.innerHTML=[
      ['Compatibility',h.compatibility>=90?'Excellent':h.compatibility>=70?'Good':'Needs attention'],
      ['Budget Fit',h.budget>=90?'Excellent':h.budget>=70?'Good':'Over target'],
      ['Requirements',h.requirements>=85?'Complete':h.requirements>=65?'Good':'Incomplete'],
      ['Performance',h.performance>=85?'Strong':h.performance>=65?'Good':'Focused'],
      ['Complexity',h.complexity]
    ].map(([k,val])=>'<div class="cfg-health-row"><span>'+esc(k)+'</span><strong>'+esc(val)+'</strong></div>').join('');
    renderBeforeAfter();renderRecommendations();renderBlueprint();renderVersions();updateLeadFields();
    const next=$('[data-cfg-next-action]');next.textContent=nextActionLabel(c);next.onclick=showNextAction;
  }

  function finalCopy(c,m){
    const price=c.pricingMode==='quote'?'This version is configured for quote-required output.':'The current demonstration estimate is '+money(m.total)+'.';
    return (currentBase(c)?.label||'Configured')+' '+typeLabel().toLowerCase()+' with '+currentScope(c).label.toLowerCase()+' scope, '+(c.features||[]).length+' core feature'+((c.features||[]).length===1?'':'s')+' and '+(c.enhancements||[]).length+' enhancement'+((c.enhancements||[]).length===1?'':'s')+'. '+price+' Estimated timeline: '+timelineLabel(m.days)+'.';
  }

  function renderBeforeAfter(){
    const base=state.baseline||baselineFrom(state.config),now=state.config;
    els.beforeAfter.innerHTML=compareCard('Start Configuration',base)+compareCard('Current Configuration',now);
  }
  function compareCard(title,c){
    const m=metricsWith(c);
    const items=[['Features',(c.features||[]).length],['Capacity',currentScope(c).capacity+' '+currentType().unit],['Complexity',m.complexity],['Timeline',timelineLabel(m.days)],['Estimate',c.pricingMode==='quote'?'Quote Required':money(m.total)],['Support',supportLevel(c)],['Add-ons',(c.enhancements||[]).length]];
    return '<article class="cfg-compare-card"><h4>'+esc(title)+'</h4><div class="cfg-compare-grid">'+items.map(([k,v])=>'<div><small>'+esc(k)+'</small><strong>'+esc(String(v))+'</strong></div>').join('')+'</div></article>';
  }
  function supportLevel(c){return c.enhancements.includes('enhanced-support')||c.base==='premium'?'Enhanced':'Standard'}

  function recommendedEnhancements(){
    const c=state.config,out=[];
    if(c.features.length>=3&&!c.enhancements.includes('enhanced-support'))out.push(['enhanced-support','Your configuration includes several active components. Enhanced Support would add setup and maintenance assistance.']);
    if(c.scope>=3&&!c.enhancements.includes('extra-capacity'))out.push(['extra-capacity','Your selected scope is already high. Additional Capacity would add reserve room.']);
    if(c.features.includes('integration')&&!c.enhancements.includes('advanced-analytics'))out.push(['advanced-analytics','You already have Live Integration. Advanced Analytics can make more of the connected data.']);
    if(c.quality==='premium'&&!c.enhancements.includes('premium-finish')&&c.base!=='essential')out.push(['premium-finish','You selected Premium quality. Premium Finish keeps the presentation aligned with that level.']);
    if(c.delivery==='priority'&&!c.enhancements.includes('priority-setup')&&!c.features.includes('deep-customization'))out.push(['priority-setup','You prefer priority delivery. Priority Setup is the most relevant timing enhancement.']);
    return out.slice(0,2);
  }

  function renderRecommendations(){
    const rec=recommendedEnhancements();
    els.recommendSection.hidden=rec.length===0;
    if(!rec.length)return;
    els.recommendations.innerHTML=rec.map(([id,why])=>{const e=enhancement(id);return '<article class="cfg-recommend-card"><p class="cfg-kicker">WHY WE’RE SUGGESTING THIS</p><h4>'+esc(e.label)+'</h4><p>'+esc(why)+'</p><div class="cfg-actions"><button class="cfg-btn cfg-btn-small" type="button" data-recommend-add="'+id+'">Add</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-recommend-dismiss="'+id+'">Not Needed</button></div></article>'}).join('');
    $$('[data-recommend-add]',els.recommendations).forEach(b=>b.addEventListener('click',()=>{toggleEnhancement(b.dataset.recommendAdd,true);renderResults()}));
    $$('[data-recommend-dismiss]',els.recommendations).forEach(b=>b.addEventListener('click',()=>{b.closest('.cfg-recommend-card').remove();if(!els.recommendations.children.length)els.recommendSection.hidden=true}));
  }

  function healthDetails(){
    const h=health(state.config),v=validate(state.config);
    openModal('CONFIGURATION HEALTH',h.overall+'%','<div class="cfg-modal-grid">'+[
      ['Compatibility',h.compatibility+'%'],['Budget Fit',h.budget+'%'],['Requirements',h.requirements+'%'],['Performance',h.performance+'%'],['Complexity',h.complexity],['Current status',v.valid?'Valid':'Needs review']
    ].map(([k,val])=>'<div><small>'+esc(k)+'</small><strong>'+esc(String(val))+'</strong></div>').join('')+'</div>'+(v.issues.length?'<div class="cfg-impact" style="margin-top:14px"><strong>What still needs attention</strong><p>'+v.issues.map(esc).join('<br>')+'</p></div>':'<p class="cfg-inline-status success">All current dependency and compatibility rules are satisfied.</p>'));
  }

  function runWhatIf(key){
    const temp=deep(state.config),before=metrics(state.config);
    if(key==='capacity')temp.scope=Math.min(4,Math.max(3,temp.scope+1));
    if(key==='noextras')temp.enhancements=[];
    if(key==='premium')temp.quality='premium';
    if(key==='faster'){temp.delivery='priority';if(!temp.features.includes('deep-customization'))temp.enhancements=unique([...temp.enhancements,'rapid-launch'])}
    if(key==='lowerbudget')temp.budget=Math.max(500,Math.round(before.total*.78/100)*100);
    normalizeTemp(temp);
    const after=metricsWith(temp),vh=health(temp);
    state.whatIf={key,temp};
    $$('.cfg-whatif-grid button').forEach(b=>b.classList.toggle('active',b.dataset.cfgWhatif===key));
    els.whatIfCard.hidden=false;els.whatIfCard.innerHTML='<h4>'+esc(whatIfTitle(key))+'</h4><p>This is temporary until you apply it.</p><div class="cfg-whatif-impact"><span>Estimate '+signedMoney(after.total-before.total)+'</span><span>Timeline '+signedDays(after.days-before.days)+'</span><span>Health '+vh.overall+'%</span><span>Scope '+esc(currentScope(temp).label)+'</span></div><div class="cfg-actions"><button class="cfg-btn cfg-btn-small" type="button" data-cfg-apply-whatif>Apply Changes</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-cfg-return-version>Return To My Version</button></div>';
    $('[data-cfg-apply-whatif]',els.whatIfCard).addEventListener('click',()=>{pushHistory();state.config=temp;state.whatIf=null;els.whatIfCard.hidden=true;$$('.cfg-whatif-grid button').forEach(b=>b.classList.remove('active'));toast('What-if version applied to your configuration.');renderBuilder();renderResults()});
    $('[data-cfg-return-version]',els.whatIfCard).addEventListener('click',()=>{state.whatIf=null;els.whatIfCard.hidden=true;$$('.cfg-whatif-grid button').forEach(b=>b.classList.remove('active'));toast('Returned to your original version.')});
  }
  function normalizeTemp(c){
    if(c.enhancements.includes('advanced-analytics')&&!c.features.includes('integration'))c.enhancements=c.enhancements.filter(x=>x!=='advanced-analytics');
    if(c.enhancements.includes('rapid-launch')&&c.features.includes('deep-customization'))c.enhancements=c.enhancements.filter(x=>x!=='rapid-launch');
    if(c.features.includes('advanced-performance')&&!c.enhancements.includes('enhanced-support'))c.enhancements.push('enhanced-support');
  }
  function whatIfTitle(k){return({capacity:'What if I increase capacity?',noextras:'What if I remove all extras?',premium:'What if I choose premium quality?',faster:'What if I need it faster?',lowerbudget:'What if I reduce my budget?'})[k]}

  function saveVersion(){
    if(state.versions.length>=3){toast('This demo keeps up to three versions. Compare them before creating another.');return}
    const name='Version '+String.fromCharCode(65+state.versions.length);
    state.versions.push({name,config:deep(state.config),ref:referenceFor(state.config)});toast(name+' saved.');renderVersions();autoSave();
  }
  function duplicateVersion(){
    if(!state.versions.length)saveVersion();
    if(state.versions.length>=3){toast('Maximum three demo versions.');return}
    const name='Version '+String.fromCharCode(65+state.versions.length);
    state.versions.push({name,config:deep(state.config),ref:referenceFor(state.config)});state.config=deep(state.versions[state.versions.length-1].config);state.config.name=(state.config.name||'Your Solution')+' Copy';toast(name+' duplicated. Edit it without changing the earlier version.');renderVersions();renderBuilder();
  }
  function renderVersions(){
    els.versionList.innerHTML=state.versions.map((v,i)=>{const m=metricsWith(v.config);return '<article class="cfg-version-card"><strong>'+esc(v.name)+'</strong><span>'+esc(v.config.name)+'</span><span>'+(v.config.pricingMode==='quote'?'Quote Required':money(m.total))+' · '+timelineLabel(m.days)+'</span></article>'}).join('');
    els.compareBtn.disabled=state.versions.length<2;
  }
  function compareVersions(){
    if(state.versions.length<2)return;
    const headers=state.versions.map(v=>'<th>'+esc(v.name)+'</th>').join('');
    const attrs=[
      ['Price',v=>v.config.pricingMode==='quote'?'Quote Required':money(metricsWith(v.config).total)],
      ['Capacity',v=>currentScope(v.config).capacity+' '+currentType().unit],
      ['Features',v=>String(v.config.features.length)],
      ['Timeline',v=>timelineLabel(metricsWith(v.config).days)],
      ['Complexity',v=>metricsWith(v.config).complexity],
      ['Support',v=>supportLevel(v.config)],
      ['Compatibility',v=>validate(v.config).valid?'Valid':'Needs review'],
      ['Best For',v=>bestFor(v.config)]
    ];
    openModal('COMPARE CONFIGURATIONS','Version A vs. Version B'+(state.versions[2]?' vs. Version C':''),'<table class="cfg-compare-table"><thead><tr><th>Compare</th>'+headers+'</tr></thead><tbody>'+attrs.map(([k,fn])=>'<tr><td>'+esc(k)+'</td>'+state.versions.map(v=>'<td>'+esc(fn(v))+'</td>').join('')+'</tr>').join('')+'<tr><td>Final version</td>'+state.versions.map((v,i)=>'<td><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-version-final="'+i+'">Make This Final</button></td>').join('')+'</tr></tbody></table>');
    $$('[data-version-final]',els.modalBody).forEach(b=>b.addEventListener('click',()=>{pushHistory();state.config=deep(state.versions[Number(b.dataset.versionFinal)].config);closeModal();toast(state.versions[Number(b.dataset.versionFinal)].name+' is now your final version.');renderBuilder();renderResults()}));
  }
  function bestFor(c){if(c.scope>=3)return'Higher demand';if(c.quality==='premium')return'Premium finish';if(c.features.length<=2)return'Simple requirement';return'Balanced flexibility'}

  function renderBlueprint(){
    const c=state.config,m=metrics(c),v=validate(c),items=[
      ['What You Selected',(currentBase(c)?.label||'Base')+' · '+currentScope(c).label+' · '+currentQuality(c).label],
      ['Why It Fits',whyItFits(c)],
      ['Configuration Details',(c.features||[]).map(id=>feature(id).label).join(' · ')||'Core setup only'],
      ['Requirements',(c.requirements||[]).map(id=>DATA.outcomes.find(o=>o.id===id)?.label).filter(Boolean).join(' · ')||'Not specified'],
      ['Optional Enhancements',(c.enhancements||[]).map(id=>enhancement(id).label).join(' · ')||'None'],
      ['Price / Scope',c.pricingMode==='quote'?'Quote Required · '+m.complexity+' scope':money(m.total)+' demo estimate'],
      ['Timeline',timelineLabel(m.days)],
      ['Compatibility',v.valid?'Valid':'Needs review'],
      ['What Happens Next',nextActionLabel(c)]
    ];
    els.blueprint.innerHTML=items.map(([k,val])=>'<div class="cfg-blueprint-item"><small>'+esc(k)+'</small><strong>'+esc(val)+'</strong></div>').join('');
  }
  function whyItFits(c){
    const req=c.requirements||[];if(req.includes('volume'))return'Built around higher capacity and stronger support.';if(req.includes('manual'))return'Built to reduce repetitive work and improve handoffs.';if(req.includes('premium'))return'Built around a premium treatment and stronger finish.';if(req.includes('flexibility'))return'Built to stay adaptable as requirements change.';return'Built from the base, scope and priorities selected in this configuration.';
  }

  function nextActionLabel(c){
    if(c.pricingMode==='quote')return state.type==='service'?'Book Consultation':'Request Final Quote';
    if(state.type==='product'||state.type==='package'||state.type==='subscription')return currentType().cta;
    if(state.type==='service')return'Book Consultation';
    if(state.type==='space')return'Book Visit / Send For Review';
    if(c.features.includes('advanced-performance')||c.features.includes('integration'))return'Talk To A Specialist';
    return currentType().cta;
  }
  function showNextAction(){
    const label=nextActionLabel(state.config);
    openModal('CUSTOMER NEXT STEP',label,'<div class="cfg-conflict"><p>This is a public demonstration, so it does not create a real order or booking. On a live implementation, this configuration would now carry into the appropriate '+esc(label.toLowerCase())+' flow without asking the customer to repeat their selections.</p><div class="cfg-conflict-options"><button class="cfg-btn cfg-btn-small" type="button" data-action="discuss">Discuss This With Oyeola</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="cancel">Continue Demo</button></div></div>');bindModalAction('discuss',()=>{closeModal();$('.cfg-enquiry')?.scrollIntoView({behavior:'smooth'})});bindModalAction('cancel',closeModal);
  }

  function referenceFor(c){
    const s=[state.type,c.base,c.scope,c.quality,...(c.features||[]),...(c.enhancements||[])].join('|');let hash=0;for(let i=0;i<s.length;i++)hash=(hash*31+s.charCodeAt(i))>>>0;return'CFG-'+String(1000+(hash%9000));
  }

  function downloadConfiguration(){
    const text=configurationText(),blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=referenceFor(state.config)+'-oyeola-configuration.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);status('Configuration sheet downloaded.');
  }
  function configurationText(){
    const c=state.config,m=metrics(c),v=validate(c);
    return [
      'OYEOLA CONFIGURE - DEMO CONFIGURATION SHEET',
      referenceFor(c)+' (fictional demo reference)','',
      'Configuration: '+c.name,'Type: '+(DATA.types[state.type]?.label||'Flexible'),
      'Base: '+(currentBase(c)?.label||'Not selected'),'Scope: '+currentScope(c).label+' / '+currentScope(c).capacity+' '+currentType().unit,
      'Quality: '+currentQuality(c).label,'Features: '+((c.features||[]).map(id=>feature(id).label).join(', ')||'None'),
      'Enhancements: '+((c.enhancements||[]).map(id=>enhancement(id).label).join(', ')||'None'),
      'Locked priorities: '+(state.locked.map(id=>feature(id)?.label||enhancement(id)?.label).filter(Boolean).join(', ')||'None'),
      'Budget target: '+(c.budget?money(c.budget):'Not set'),'Estimate / Scope: '+(c.pricingMode==='quote'?'Quote Required':money(m.total)),
      'Estimated timeline: '+timelineLabel(m.days),'Compatibility: '+(v.valid?'Valid':'Needs review: '+v.issues.join('; ')),
      'Configuration health: '+health(c).overall+'%','Recommended next step: '+nextActionLabel(c),'',
      'Demo pricing and specifications only. A live implementation would use the business\'s actual products, rules, pricing, availability and data.'
    ].join('\n');
  }

  async function shareVersion(){
    const text=configurationText();
    try{await navigator.clipboard.writeText(text);status('Temporary demo summary copied. A live implementation could generate a shareable link or approval state.')}
    catch{status('Clipboard access is unavailable. Use Download Configuration instead.',true)}
  }
  function status(msg,error=false){els.blueprintStatus.textContent=msg;els.blueprintStatus.className='cfg-inline-status '+(error?'error':'success')}

  function emailBlueprint(e){
    e.preventDefault();const form=e.currentTarget,statusEl=$('[data-cfg-email-status]',form),email=form.elements.email.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){statusEl.textContent='Enter a valid email address.';statusEl.className='cfg-inline-status error';form.elements.email.focus();return}
    statusEl.textContent='Demo mode: a live implementation would now email this configuration to '+email+'. No account has been created.';statusEl.className='cfg-inline-status success';
  }

  function businessView(){
    if(!state.started){loadPreset('complex');}
    const c=state.config,m=metrics(c),v=validate(c),locked=state.locked.map(id=>feature(id)?.label||enhancement(id)?.label).filter(Boolean);
    const fields=[
      ['Reference',referenceFor(c)],['Configuration',c.name],['Budget Target',c.budget?money(c.budget):'Not set'],
      ['Estimated Configuration',c.pricingMode==='quote'?'Quote Required':money(m.total)],['Capacity',currentScope(c).capacity+' '+currentType().unit],
      ['Core Features',String(c.features.length)],['Enhancements',String(c.enhancements.length)],['Locked Priorities',locked.join(', ')||'None'],
      ['Timeline',timelineLabel(m.days)],['Compatibility',v.valid?'100% valid':'Needs review'],['Customer Intent',nextActionLabel(c)]
    ];
    openModal('BUSINESS VIEW','DEMO CONFIGURATION LEAD','<div class="cfg-modal-grid">'+fields.map(([k,val])=>'<div><small>'+esc(k)+'</small><strong>'+esc(String(val))+'</strong></div>').join('')+'</div><div class="cfg-business-callout" style="margin-top:18px"><p class="cfg-kicker">SAME PROSPECT. BETTER CONTEXT.</p><h3 style="font-size:28px">The business receives the exact configuration instead of “Hi, I’m interested.”</h3></div>');
  }

  function configLogic(){
    const rows=[
      ['Required relationships','Advanced Performance requires Enhanced Support. Advanced Analytics requires Live Integration.'],
      ['Incompatibilities','Live Integration conflicts with Offline Mode. Rapid Launch conflicts with Deep Customization.'],
      ['Base limits','Essential blocks some advanced features and limits feature count.'],
      ['Conditional visibility','Steps and recommendations adapt to configuration type, scope and requirements.'],
      ['Price modifiers','Base, scope, quality, features and enhancements all contribute deterministically.'],
      ['Timeline modifiers','Scope, quality, features, delivery preference and selected enhancements change timeline.'],
      ['Budget rules','Optimization removes only unlocked choices and preserves Must Keep priorities.'],
      ['Parent changes','A weaker base immediately removes downstream choices it can no longer support.']
    ];
    openModal('CONFIGURATION LOGIC','Centralized deterministic rules','<p class="cfg-inline-status">The same configuration produces the same price, compatibility, timeline and health. The engine can later be fed a different data model for a website, kitchen, pool, machine, service bundle, solar system, membership, renovation or another configurable offer.</p><div class="cfg-logic">'+rows.map(([k,v])=>'<div class="cfg-logic-row"><strong>'+esc(k)+'</strong><span>'+esc(v)+'</span></div>').join('')+'</div>');
  }

  function tryInvalid(){
    if(!state.started){state.type='product';state.mode='manual';state.config=freshConfig();state.config.base='enhanced';state.config.name='Break-Test Product';beginBuilder()}
    pushHistory();state.config.features=unique([...state.config.features,'integration','offline-mode']);state.invalidDemo=true;renderBuilder();
    openModal('TRY TO BREAK THE CONFIGURATION','THESE TWO OPTIONS DON’T WORK TOGETHER.','<div class="cfg-conflict"><p>Live Integration and Offline Mode intentionally conflict in this demo. The system identifies the invalid state and offers a path back to a valid configuration.</p><div class="cfg-conflict-options"><button class="cfg-btn cfg-btn-small" type="button" data-action="keep-integration">Keep Live Integration</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="keep-offline">Keep Offline Mode</button><button class="cfg-btn cfg-btn-small cfg-btn-ghost" type="button" data-action="suggest-alt">Suggest Alternative</button></div></div>');
    bindModalAction('keep-integration',()=>{state.config.features=state.config.features.filter(x=>x!=='offline-mode');state.invalidDemo=false;closeModal();toast('Invalid option removed. Configuration restored to valid.');renderBuilder()});
    bindModalAction('keep-offline',()=>{state.config.features=state.config.features.filter(x=>x!=='integration');state.config.enhancements=state.config.enhancements.filter(x=>x!=='advanced-analytics');state.invalidDemo=false;closeModal();toast('Live Integration removed. Configuration restored to valid.');renderBuilder()});
    bindModalAction('suggest-alt',()=>{state.config.features=state.config.features.filter(x=>x!=='offline-mode');state.config.features=unique([...state.config.features,'security']);state.invalidDemo=false;closeModal();toast('Closest alternative added: Enhanced Security.');renderBuilder()});
  }

  function loadPreset(key){
    const p=DATA.presets[key];if(!p)return;
    state.type=p.type;state.mode=p.mode;state.config=deep(p.config);state.locked=deep(p.locked||[]);state.baseline=baselineFrom(state.config);state.started=true;state.steps=DATA.steps[state.type];state.step=state.steps.length-1;state.history=[];state.versions=[];state.whatIf=null;
    renderTypes();els.modeStep.hidden=true;els.entry.hidden=true;els.auto.hidden=true;els.builder.hidden=false;renderBuilder();renderResults();els.results.hidden=false;closeTools();els.results.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function pushHistory(){state.history.push({config:deep(state.config),locked:deep(state.locked),step:state.step});if(state.history.length>30)state.history.shift()}
  function undo(){const prev=state.history.pop();if(!prev)return;state.config=prev.config;state.locked=prev.locked;state.step=Math.min(prev.step,state.steps.length-1);toast('Last change undone.');renderBuilder();if(!els.results.hidden)renderResults()}

  function autoSave(){
    if(!state.started)return;
    try{
      localStorage.setItem(AUTO_KEY,JSON.stringify({type:state.type,mode:state.mode,config:state.config,locked:state.locked,versions:state.versions,savedAt:Date.now()}));
      els.saveState.textContent='Changes saved';els.saveState.classList.add('active');setTimeout(()=>els.saveState.classList.remove('active'),700);
    }catch{els.saveState.textContent='Local save unavailable'}
  }
  function saveForLater(){
    try{localStorage.setItem(SAVE_KEY,JSON.stringify({type:state.type,mode:state.mode,config:state.config,locked:state.locked,versions:state.versions,savedAt:Date.now()}));status('Saved on this device.');els.returnBanner.hidden=true}
    catch{status('Local save is unavailable in this browser.',true)}
  }
  function availableSaved(){
    try{return JSON.parse(localStorage.getItem(SAVE_KEY)||localStorage.getItem(AUTO_KEY)||'null')}catch{return null}
  }
  function continueSaved(){
    const s=availableSaved();if(!s)return;state.type=s.type;state.mode=s.mode;state.config=s.config;state.locked=s.locked||[];state.versions=s.versions||[];state.started=true;state.steps=DATA.steps[state.type]||DATA.steps.other;state.step=Math.min(state.steps.length-1,Math.max(0,state.steps.indexOf('review')));state.baseline=baselineFrom(state.config);els.returnBanner.hidden=true;renderTypes();els.entry.hidden=true;els.auto.hidden=true;els.builder.hidden=false;renderBuilder();if(state.config.base){renderResults();els.results.hidden=false}els.builder.scrollIntoView({behavior:'smooth'})}
  function resetDemo(){
    const meaningful=state.started&&(state.config.base||state.config.features.length||state.config.enhancements.length||state.versions.length);
    if(meaningful&&!window.confirm('Start over? This will clear the current demo configuration and saved versions on this device.'))return;
    state.type=null;state.mode=null;state.config=freshConfig();state.step=0;state.steps=[];state.history=[];state.versions=[];state.locked=[];state.baseline=null;state.whatIf=null;state.started=false;state.invalidDemo=false;
    try{localStorage.removeItem(AUTO_KEY);localStorage.removeItem(SAVE_KEY)}catch{}
    els.entry.hidden=false;els.modeStep.hidden=true;els.auto.hidden=true;els.builder.hidden=true;els.results.hidden=true;els.returnBanner.hidden=true;els.whatIfCard.hidden=true;renderTypes();$('#live-demo')?.scrollIntoView({behavior:'smooth'});
  }

  function updateLeadFields(){
    const c=state.config,m=metrics(c);
    if(els.leadResult)els.leadResult.value=configurationText().replace(/\n/g,' | ').slice(0,3900);
    if(els.leadTimeline)els.leadTimeline.value=timelineLabel(m.days);
  }

  function openModal(kicker,title,html){
    lastFocus=document.activeElement;els.modalKicker.textContent=kicker;els.modalTitle.textContent=title;els.modalBody.innerHTML=html;els.modal.hidden=false;document.body.style.overflow='hidden';$('[data-cfg-modal-close]',els.modal)?.focus();
  }
  let lastFocus=null;
  function closeModal(){els.modal.hidden=true;document.body.style.overflow='';lastFocus?.focus?.()}
  function bindModalAction(action,fn){const b=$('[data-action="'+action+'"]',els.modalBody);if(b)b.addEventListener('click',fn,{once:true})}
  function trapModal(e){
    if(els.modal.hidden)return;if(e.key==='Escape'){closeModal();return}if(e.key!=='Tab')return;
    const f=$$('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])',els.modal).filter(x=>!x.disabled&&!x.hidden);if(!f.length)return;
    const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
  function toast(msg){
    els.toast.textContent=msg;els.toast.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{els.toast.hidden=true},3300)
  }

  function signedMoney(n){if(!n)return'£0';return(n>0?'+':'−')+money(Math.abs(n))}
  function signedDays(n){if(!n)return'no timeline change';return(n>0?'+':'−')+Math.abs(n)+' day'+(Math.abs(n)===1?'':'s')}
  function timelineLabel(days){if(days<=5)return'3–5 days';if(days<=8)return'1 week';if(days<=12)return'1–2 weeks';if(days<=18)return'2–3 weeks';return'3+ weeks'}
  function unique(arr){return[...new Set(arr)]}
  function toggleArray(arr,id){const i=arr.indexOf(id);if(i>-1)arr.splice(i,1);else arr.push(id)}
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function escAttr(v){return esc(v).replace(/\n/g,' ')}

  function setupNav(){
    const menu=$('[data-cfg-menu]'),nav=$('[data-cfg-nav]');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});$$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}))
  }
  function setupTools(){
    const panel=$('[data-cfg-tools-panel]'),toggle=$('[data-cfg-tools-toggle]');toggle?.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open))});$('[data-cfg-tools-close]')?.addEventListener('click',closeTools)
  }
  function closeTools(){const panel=$('[data-cfg-tools-panel]'),toggle=$('[data-cfg-tools-toggle]');if(panel)panel.hidden=true;if(toggle)toggle.setAttribute('aria-expanded','false')}

  renderTypes();setupNav();setupTools();
  const saved=availableSaved();if(saved)els.returnBanner.hidden=false;

  $$('[data-cfg-mode]').forEach(b=>b.addEventListener('click',()=>chooseMode(b.dataset.cfgMode)));
  $('[data-cfg-generate]')?.addEventListener('click',generateStartingPoint);
  $$('[data-cfg-manual-switch]').forEach(b=>b.addEventListener('click',()=>{state.mode='manual';state.config=freshConfig();state.config.name='Your '+typeLabel();beginBuilder()}));
  els.next?.addEventListener('click',nextStep);els.back?.addEventListener('click',prevStep);els.undo?.addEventListener('click',undo);
  $$('[data-cfg-reset]').forEach(b=>b.addEventListener('click',resetDemo));
  $('[data-cfg-optimize]')?.addEventListener('click',optimize);
  $$('[data-cfg-whatif]').forEach(b=>b.addEventListener('click',()=>runWhatIf(b.dataset.cfgWhatif)));
  $('[data-cfg-health-details]')?.addEventListener('click',healthDetails);
  $('[data-cfg-save-version]')?.addEventListener('click',saveVersion);$('[data-cfg-duplicate]')?.addEventListener('click',duplicateVersion);els.compareBtn?.addEventListener('click',compareVersions);
  $$('[data-cfg-download]').forEach(b=>b.addEventListener('click',downloadConfiguration));$('[data-cfg-share]')?.addEventListener('click',shareVersion);$('[data-cfg-save-later]')?.addEventListener('click',saveForLater);
  $('[data-cfg-email-form]')?.addEventListener('submit',emailBlueprint);$('[data-cfg-edit]')?.addEventListener('click',()=>els.builder.scrollIntoView({behavior:'smooth'}));
  $$('[data-cfg-business-view]').forEach(b=>b.addEventListener('click',businessView));$('[data-cfg-customer-view]')?.addEventListener('click',()=>{closeTools();(els.results.hidden?els.builder:els.results).scrollIntoView({behavior:'smooth'})});
  $('[data-cfg-logic]')?.addEventListener('click',configLogic);$('[data-cfg-invalid]')?.addEventListener('click',tryInvalid);$$('[data-cfg-preset]').forEach(b=>b.addEventListener('click',()=>loadPreset(b.dataset.cfgPreset)));
  $('[data-cfg-continue]')?.addEventListener('click',continueSaved);
  $$('[data-cfg-modal-close]').forEach(b=>b.addEventListener('click',closeModal));document.addEventListener('keydown',trapModal);
  $('[data-cfg-summary-open]')?.addEventListener('click',()=>els.summary.classList.add('open'));$('[data-cfg-summary-close]')?.addEventListener('click',()=>els.summary.classList.remove('open'));
  $$('[data-cfg-start-link]').forEach(a=>a.addEventListener('click',()=>{setTimeout(()=>{if(!state.started&&state.type)els.modeStep.scrollIntoView({behavior:'smooth'});},250)}));
  $('[data-cfg-final-build]')?.addEventListener('click',()=>{setTimeout(()=>{if(!state.started)$('#live-demo')?.scrollIntoView({behavior:'smooth'})},200)});

  window.OyeolaConfigure={
    data:DATA,
    metrics:(config,type='other')=>{const oldType=state.type;state.type=type;const out=metrics(config);state.type=oldType;return out},
    validate:(config,type='other')=>{const oldType=state.type;state.type=type;const out=validate(config);state.type=oldType;return out},
    state
  };
})();