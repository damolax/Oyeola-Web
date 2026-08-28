(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const menuBtn = $('.menu-btn');
  const navLinks = $('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }
  const filterBtns = $$('[data-filter]');
  const workCards = $$('[data-category]');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workCards.forEach(card => card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none');
  }));
  const finder = $('[data-finder]');
  if (finder) {
    const state = { area: '', outcome: '' };
    const result = $('[data-finder-result]', finder);
    const render = () => {
      if (!state.area || !state.outcome) { result.classList.add('hidden'); return; }
      let title = '', copy = '', href = '';
      if (state.area === 'website') {
        title = state.outcome === 'more-action' ? 'Start with a Website Check.' : 'Start with the website journey.';
        copy = 'We will diagnose clarity, trust, conversion, discovery and foundation before deciding what should be kept, fixed, rebuilt or grown.';
        href = 'website-check.html';
      } else if (state.area === 'operations') {
        title = 'Start with an Operations Check.';
        copy = 'We will look at visibility, handoffs, reporting, capacity and workflow reliability before recommending any new software.';
        href = 'operations-check.html';
      } else {
        title = 'Start with the working planner sample.';
        copy = 'Experience the navigation and product quality first. If the direction fits your shop, the next step is a planner built around your audience and brand.';
        href = 'planner-demo.html';
      }
      result.innerHTML = `<p class="eyebrow">Recommended starting point</p><h3>${title}</h3><p>${copy}</p><a class="btn small" href="${href}">Continue</a>`;
      result.classList.remove('hidden');
    };
    $$('[data-choice]', finder).forEach(btn => btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      $$(`[data-group="${group}"]`, finder).forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); state[group] = btn.dataset.choice; render();
    }));
  }
  const demoStage = $('[data-dashboard-demo]');
  if (demoStage) {
    const views = {
      overview: {title:'Operations overview', metric1:'14', label1:'active projects', metric2:'72%', label2:'team capacity', metric3:'3', label3:'items at risk'},
      pipeline: {title:'Sales → delivery handoff', metric1:'21', label1:'open opportunities', metric2:'6', label2:'ready to hand off', metric3:'2', label3:'missing owners'},
      capacity: {title:'Capacity view', metric1:'72%', label1:'planned utilization', metric2:'4', label2:'people near capacity', metric3:'2', label3:'open slots next month'}
    };
    $$('[data-demo-view]', demoStage).forEach(btn => btn.addEventListener('click', () => {
      $$('[data-demo-view]', demoStage).forEach(b => b.classList.remove('active')); btn.classList.add('active');
      const v = views[btn.dataset.demoView]; $('[data-dash-title]', demoStage).textContent = v.title;
      ['1','2','3'].forEach(i => { $(`[data-metric="${i}"]`, demoStage).textContent = v[`metric${i}`]; $(`[data-label="${i}"]`, demoStage).textContent = v[`label${i}`]; });
    }));
  }
})();
(() => {
  const load = src => { const s=document.createElement('script'); s.src=src; document.body.appendChild(s); };
  if (document.getElementById('website-check-form') || document.getElementById('operations-check')) load('assets/js/checks.js');
  if (document.querySelector('[data-planner-app]')) load('assets/js/planner.js');
})();
