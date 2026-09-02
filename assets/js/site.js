(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const path = location.pathname.toLowerCase();
  const nested = /\/(services|case-studies)\//.test(path);
  const root = nested ? '../' : '';
  const active = path.includes('/case-studies/') || /\/work(?:\.html)?$/.test(path) ? 'work'
    : path.includes('/services/airtable') || path.includes('operations') ? 'operations'
    : path.includes('/services/') || path.includes('website') ? 'websites'
    : path.includes('digital-planners') || path.includes('planner-demo') ? 'planners'
    : path.includes('about') ? 'about' : '';

  const header = $('.site-header');
  if (header) {
    header.outerHTML = `<header class="site-header"><div class="container nav"><a class="brand brand-lockup" href="${root}index.html" aria-label="Oyeola Online home"><img src="${root}assets/logos/logo-horizontal-light.svg" alt="Oyeola Online"></a><nav class="nav-links" aria-label="Primary navigation"><a class="${active === 'websites' ? 'active' : ''}" href="${root}websites.html">Websites</a><a class="${active === 'operations' ? 'active' : ''}" href="${root}operations.html">Operations</a><a class="${active === 'planners' ? 'active' : ''}" href="${root}digital-planners.html">Digital Planners</a><a class="${active === 'work' ? 'active' : ''}" href="${root}work.html">Work</a><a class="${active === 'about' ? 'active' : ''}" href="${root}about.html">About</a><a class="btn small" href="${root}start-here.html">Start Here</a></nav><button class="menu-btn" aria-label="Open navigation" aria-expanded="false">Menu</button></div></header>`;
  }

  let icon = document.querySelector('link[rel="icon"]');
  if (!icon) {
    icon = document.createElement('link');
    icon.rel = 'icon';
    document.head.appendChild(icon);
  }
  icon.href = `${root}assets/logos/favicon.svg`;
  icon.type = 'image/svg+xml';

  const footer = $('footer.footer');
  if (footer) {
    footer.outerHTML = `<footer class="footer"><div class="container"><div class="footer-grid"><div><a class="footer-logo" href="${root}index.html"><img src="${root}assets/logos/logo-horizontal-light.svg" alt="Oyeola Online"></a><p>Websites that help customers act. Operations systems that reduce chasing. Digital planners built to be chosen and used.</p></div><div><strong>Services</strong><p><a href="${root}websites.html">Websites</a><br><a href="${root}operations.html">Operations Systems</a><br><a href="${root}digital-planners.html">Digital Planners</a></p></div><div><strong>Start</strong><p><a href="${root}website-check.html">Website Check</a><br><a href="${root}operations-check.html">Operations Check</a><br><a href="${root}demos.html">Working Demos</a></p></div><div><strong>Contact</strong><p><a href="${root}contact.html">Project enquiry</a><br><a href="mailto:oyeolawebmaster@gmail.com">Email backup</a><br><a href="${root}privacy.html">Privacy</a></p></div></div><div class="footer-bottom"><span>© 2026 Oyeola Online</span><span>Understand → decide → build.</span></div></div></footer>`;
  }

  const menu = $('.menu-btn');
  const nav = $('.nav-links');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-links a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }));
  }

  const finder = $('[data-finder]');
  if (finder) {
    const state = { area: '', outcome: '' };
    const result = $('[data-finder-result]', finder);
    const render = () => {
      if (!state.area || !state.outcome) {
        result.classList.add('hidden');
        return;
      }
      let title = '', copy = '', href = '', label = '';
      if (state.area === 'website') {
        title = 'Start with the Website Check.';
        copy = 'Find out whether the biggest issue is clarity, trust, conversion, discovery or technical foundation before you pay to redesign anything.';
        href = 'website-check.html';
        label = 'Check my website';
      } else if (state.area === 'operations') {
        title = 'Start with the Operations Check.';
        copy = 'Find where status, handoffs, reporting, capacity or reliance on memory is creating unnecessary coordination.';
        href = 'operations-check.html';
        label = 'Check my operations';
      } else {
        title = 'Inspect the planner sample first.';
        copy = 'See how a premium planner handles writing space, navigation and page structure, then decide what your own buyer needs.';
        href = 'planner-demo.html';
        label = 'See the planner sample';
      }
      result.innerHTML = `<p class="eyebrow">Recommended next step</p><h3>${title}</h3><p>${copy}</p><a class="btn small" href="${href}">${label}</a>`;
      result.classList.remove('hidden');
      window.oyeolaTrack('start_here_recommendation', { area: state.area, outcome: state.outcome });
    };
    $$('[data-choice]', finder).forEach(button => button.addEventListener('click', () => {
      const group = button.dataset.group;
      $$(`[data-group="${group}"]`, finder).forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      state[group] = button.dataset.choice;
      render();
    }));
  }

  const demo = $('[data-dashboard-demo]');
  if (demo) {
    const views = {
      overview: ['Operations overview', '14', 'active projects', '72%', 'team capacity', '3', 'items at risk'],
      pipeline: ['Sales → delivery handoff', '21', 'open opportunities', '6', 'ready to hand off', '2', 'missing owners'],
      capacity: ['Capacity view', '72%', 'planned utilization', '4', 'people near capacity', '2', 'open slots next month']
    };
    $$('[data-demo-view]', demo).forEach(button => button.addEventListener('click', () => {
      $$('[data-demo-view]', demo).forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const view = views[button.dataset.demoView];
      $('[data-dash-title]', demo).textContent = view[0];
      for (let i = 1; i <= 3; i++) {
        $(`[data-metric="${i}"]`, demo).textContent = view[(i - 1) * 2 + 1];
        $(`[data-label="${i}"]`, demo).textContent = view[(i - 1) * 2 + 2];
      }
      window.oyeolaTrack('operations_demo_view', { view: button.dataset.demoView });
    }));
  }

  window.oyeolaTrack = window.oyeolaTrack || ((eventName, detail = {}) => {
    window.dispatchEvent(new CustomEvent('oyeola:track', { detail: { eventName, ...detail } }));
  });

  $$('a[href],button').forEach(element => element.addEventListener('click', () => {
    const label = (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    if (/check|start|enquir|planner|demo|case study|contact/i.test(label)) {
      window.oyeolaTrack('conversion_click', { label, href: element.getAttribute('href') || '' });
    }
  }));

  const load = src => {
    const script = document.createElement('script');
    script.src = root + src;
    document.body.appendChild(script);
  };
  if (document.getElementById('website-check-form') || document.getElementById('operations-check')) {
    load('assets/js/checks.js');
  }
})();
