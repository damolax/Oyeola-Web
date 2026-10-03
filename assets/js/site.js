(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const path = location.pathname.toLowerCase();
  const savedTheme = localStorage.getItem('oyeola-theme');
  const systemLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  let theme = savedTheme || (systemLight ? 'light' : 'dark');
  document.documentElement.dataset.theme = theme;
  const nested = /\/(services|case-studies)\//.test(path);
  const root = nested ? '../' : '';
  const isHome = path === '/' || /\/index(?:\.html)?$/.test(path);
  const active = isHome ? 'home'
    : path.includes('/case-studies/') || /\/work(?:\.html)?$/.test(path) ? 'work'
    : path.includes('/services/airtable') || path.includes('operations') ? 'operations'
    : path.includes('/services/') || path.includes('website') ? 'websites'
    : path.includes('digital-planners') || path.includes('planner-demo') ? 'planners'
    : path.includes('demos') ? 'demos'
    : path.includes('about') ? 'about' : '';

  const header = $('.site-header');
  if (header) {
    header.outerHTML = `<header class="site-header"><div class="container nav"><a class="brand brand-lockup" href="${root}index.html" aria-label="Oyeola Online home"><img data-theme-logo src="${root}assets/logos/${theme==='light'?'logo-horizontal-light.svg':'logo-horizontal-dark.svg'}" alt="Oyeola Online"></a><nav class="nav-links" aria-label="Primary navigation"><a class="${active === 'home' ? 'active' : ''}" href="${root}index.html">Home</a><a class="${active === 'websites' ? 'active' : ''}" href="${root}websites.html">Websites</a><a class="${active === 'operations' ? 'active' : ''}" href="${root}operations.html">Operations</a><a class="${active === 'planners' ? 'active' : ''}" href="${root}digital-planners.html">Planners</a><a class="${active === 'demos' ? 'active' : ''}" href="${root}demos.html">Demo Lab</a><a class="${active === 'work' ? 'active' : ''}" href="${root}work.html">Work</a><a class="${active === 'about' ? 'active' : ''}" href="${root}about.html">About</a><button class="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme"><span data-theme-icon>${theme==='light'?'☀':'◐'}</span></button><a class="btn small" href="${root}start-here.html">Let's Build</a></nav><button class="menu-btn" aria-label="Open navigation" aria-expanded="false">Menu</button></div></header>`;
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
    footer.outerHTML = `<footer class="footer"><div class="container"><div class="footer-grid"><div><a class="footer-logo" href="${root}index.html"><img src="${root}assets/logos/logo-horizontal-light.svg?v=20261003c" alt="Oyeola Online"></a><p>Websites, systems and digital products built to make the next step easier.</p></div><div><strong>Explore</strong><p><a href="${root}websites.html">Websites</a><br><a href="${root}operations.html">Operations</a><br><a href="${root}digital-planners.html">Planners</a><br><a href="${root}demos.html">Demo Lab</a></p></div><div><strong>Proof</strong><p><a href="${root}work.html">Work</a><br><a href="${root}testimonials.html">Testimonials</a><br><a href="${root}website-check.html">Website Check</a><br><a href="${root}operations-check.html">Operations Check</a></p></div><div><strong>Contact</strong><p><a href="mailto:oyeolawebmaster@gmail.com">Email</a><br><a href="https://www.linkedin.com/in/olalekan-oyekunle/" target="_blank" rel="noopener">LinkedIn</a><br><a href="${root}privacy.html">Privacy</a></p></div></div><div class="footer-bottom"><span>© 2026 Oyeola Online</span><span>Understand · decide · build.</span></div></div></footer>`;
  }

  const themeToggle = $('.theme-toggle');
  const applyTheme = next => {
    theme = next;
    document.documentElement.dataset.theme = next;
    localStorage.setItem('oyeola-theme', next);
    const logo = $('[data-theme-logo]');
    if (logo) logo.src = root + 'assets/logos/' + (next === 'light' ? 'logo-horizontal-light.svg' : 'logo-horizontal-dark.svg');
    const themeIcon = $('[data-theme-icon]');
    if (themeIcon) themeIcon.textContent = next === 'light' ? '☀' : '◐';
  };
  themeToggle?.addEventListener('click', () => applyTheme(theme === 'light' ? 'dark' : 'light'));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    document.body.classList.add('motion-ready');
    const revealSelectors = [
      '.section-head','.portfolio-intro','.proof-panel','.path','.step','.stat-item',
      '.work-card','.project-card','.compare > div','.copy','.media','.planner-proof',
      '.diagnostic','.finder','.form-intro','.case-block','.case-screen','.demo-stage',
      '.demo-card','.callout','.tool-list','.privacy-copy','.service-tile','.demo-lab-card',
      '.testimonial-card','.surface','.feature-card'
    ];
    const revealItems = [...document.querySelectorAll(revealSelectors.join(','))]
      .filter((el, index, items) => items.indexOf(el) === index)
      .filter(el => !el.closest('.hero,.page-hero,.service-hero,.case-hero'));

    revealItems.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${(index % 4) * 50}ms`);
      if (element.classList.contains('media') || element.classList.contains('case-screen')) {
        element.classList.add(index % 2 ? 'reveal-right' : 'reveal-left');
      }
    });

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
      : null;

    revealItems.forEach(element => observer ? observer.observe(element) : element.classList.add('is-visible'));
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('motion-loaded')));
  } else {
    document.body.classList.add('motion-loaded');
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
        title = 'Start with a website experience.';
        copy = 'Try a relevant industry demo first, then run the Website Check if you want a diagnosis of the current site.';
        href = 'demos.html';
        label = 'Open the Demo Lab';
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
      window.oyeolaTrack?.('start_here_recommendation', { area: state.area, outcome: state.outcome });
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
      capacity: ['Capacity view', '72%', 'planned utilization', '4', 'people near capacity', '2', 'open slots next month'],
      risk: ['Delivery risk', '5', 'due this week', '2', 'blocked items', '1', 'owner missing']
    };
    $$('[data-demo-view]', demo).forEach(button => button.addEventListener('click', () => {
      $$('[data-demo-view]', demo).forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const view = views[button.dataset.demoView];
      if (!view) return;
      $('[data-dash-title]', demo).textContent = view[0];
      for (let i = 1; i <= 3; i++) {
        $(`[data-metric="${i}"]`, demo).textContent = view[(i - 1) * 2 + 1];
        $(`[data-label="${i}"]`, demo).textContent = view[(i - 1) * 2 + 2];
      }
      window.oyeolaTrack?.('operations_demo_view', { view: button.dataset.demoView });
    }));
  }

  const workFilters = $$('[data-work-filter]');
  if (workFilters.length) {
    const cards = $$('.project-card');
    workFilters.forEach(button => button.addEventListener('click', () => {
      workFilters.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.workFilter;
      cards.forEach(card => {
        const haystack = (card.textContent || '').toLowerCase();
        card.hidden = filter !== 'all' && !haystack.includes(filter);
      });
    }));
  }

  window.oyeolaTrack = window.oyeolaTrack || ((eventName, detail = {}) => {
    window.dispatchEvent(new CustomEvent('oyeola:track', { detail: { eventName, ...detail } }));
  });

  $$('a[href],button').forEach(element => element.addEventListener('click', () => {
    const label = (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    if (/check|start|enquir|planner|demo|case study|contact|build|project/i.test(label)) {
      window.oyeolaTrack('conversion_click', { label, href: element.getAttribute('href') || '' });
    }
  }));

  const load = src => {
    const script = document.createElement('script');
    script.src = root + src;
    document.body.appendChild(script);
  };

  if (document.getElementById('website-check-form') || document.getElementById('operations-check')) load('assets/js/checks.js');
  if (document.querySelector('[data-demo-lab]')) load('assets/js/demo-lab.js');
})();