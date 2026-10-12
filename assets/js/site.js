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
    : path.includes('/case-studies/') || /\/work(?:\.html)?$/.test(path) || /\/project(?:\.html)?$/.test(path) ? 'work'
    : path.includes('demos') || path.includes('demo-') || path.includes('smart-match') || path.includes('configure') || path.includes('planner-demo') ? 'demos'
    : path.includes('/showroom/') ? 'showroom'
    : path.includes('/services/') || path.includes('services') || path.includes('website') || path.includes('operations') || path.includes('digital-planners') ? 'services'
    : path.includes('about') ? 'about' : '';
  const pageMain = document.querySelector('main');
  if(pageMain && !pageMain.id)pageMain.id = 'main-content';
  if(pageMain && !document.querySelector('.skip-link'))document.body.insertAdjacentHTML('afterbegin','<a class="skip-link" href="#main-content">Skip to content</a>');

    const header = $('.site-header');
  if (header) {
    header.outerHTML = `<header class="site-header"><div class="container nav"><a class="brand brand-lockup" href="${root}index.html" aria-label="Oyeola Online home"><img data-theme-logo src="${root}assets/logos/${theme==='light'?'logo-horizontal-light.svg':'logo-horizontal-dark.svg'}" alt="Oyeola Online"></a><nav class="nav-links" id="primary-nav" aria-label="Primary navigation"><a class="${active==='work'?'active':''}" href="${root}work.html">Work</a><a class="${active==='showroom'?'active':''}" href="${root}showroom/index.html">Live websites</a><details class="nav-services ${active==='services'?'is-active':''}"><summary>Services <span aria-hidden="true">⌄</span></summary><div class="nav-services-menu"><a href="${root}services.html">All services</a><a href="${root}websites.html">Website design</a><a href="${root}operations.html">Automation & systems</a><a href="${root}digital-planners.html">Digital planners</a></div></details><a class="${active==='about'?'active':''}" href="${root}about.html">About</a><button class="theme-toggle" type="button" aria-label="Switch to ${theme==='light'?'dark':'light'} mode" title="Switch theme"><span data-theme-icon aria-hidden="true">${theme==='light'?'☀':'◐'}</span></button><a class="btn small nav-cta" href="${root}contact.html">Start a project ↗</a></nav><button class="menu-btn" type="button" aria-controls="primary-nav" aria-label="Open navigation" aria-expanded="false">Menu</button></div></header>`;
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
    footer.outerHTML = `<footer class="footer"><div class="container"><div class="footer-grid"><div><a class="footer-logo" href="${root}index.html"><img src="${root}assets/logos/logo-horizontal-light.svg" alt="Oyeola Online"></a><p>Thoughtful websites, useful systems, better digital experiences.</p></div><div><strong>Explore</strong><p><a href="${root}work.html">Selected work</a><br><a href="${root}showroom/index.html">Live websites</a><br><a href="${root}about.html">About Oyeola Online</a></p></div><div><strong>Services</strong><p><a href="${root}websites.html">Website design</a><br><a href="${root}operations.html">Automation & systems</a><br><a href="${root}digital-planners.html">Digital planners</a></p></div><div><strong>Let's talk</strong><p><a href="${root}contact.html">Start a project</a><br><a href="mailto:oyeolawebmaster@gmail.com">Email</a><br><a href="https://www.instagram.com/oyeola3168/" target="_blank" rel="me noopener noreferrer">Instagram @oyeola3168 ↗</a><br><a href="https://www.linkedin.com/in/olalekan-oyekunle/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Oyeola Online</span><span><a href="${root}privacy.html">Privacy</a> · Designed for clarity.</span></div></div></footer>`;
  }

  const themeToggle = $('.theme-toggle');
  const applyTheme = next => {
    theme = next;
    document.documentElement.dataset.theme = next;
    localStorage.setItem('oyeola-theme', next);
    const logo = $('[data-theme-logo]');
    if (logo) logo.src = root + 'assets/logos/' + (next === 'light' ? 'logo-horizontal-light.svg' : 'logo-horizontal-dark.svg');
    const toggle = $('.theme-toggle');
    if(toggle)toggle.setAttribute('aria-label','Switch to '+(next==='light'?'dark':'light')+' mode');
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
        copy = 'Explore my website work, then tell me what you want to improve.';
        href = 'work.html';
        label = 'See my work';
      } else if (state.area === 'operations') {
        title = 'Make your day-to-day work easier.';
        copy = 'Find where status, handoffs, reporting, capacity or reliance on memory is creating unnecessary coordination.';
        href = 'contact.html';
        label = 'Discuss your workflow';
      } else {
        title = 'See my digital planner projects first.';
        copy = 'See how the planner is designed, then tell me what you need.';
        href = 'digital-planners.html';
        label = 'See planner work';
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


  const enhanceMobileCardRail = grid => {
    if (!grid || grid.dataset.mobileRailReady === 'true' || grid.children.length < 2) return;
    grid.dataset.mobileRailReady = 'true';

    const rail = document.createElement('div');
    rail.className = 'mobile-card-rail';
    const parent = grid.parentNode;
    parent.insertBefore(rail, grid);
    rail.appendChild(grid);

    const controls = document.createElement('div');
    controls.className = 'mobile-card-rail-controls';
    controls.innerHTML = '<button type="button" class="mobile-card-rail-btn mobile-card-rail-prev" aria-label="Previous item">←</button><button type="button" class="mobile-card-rail-btn mobile-card-rail-next" aria-label="Next item">→</button>';
    rail.appendChild(controls);

    const prev = $('.mobile-card-rail-prev', controls);
    const next = $('.mobile-card-rail-next', controls);
    const cardWidth = () => {
      const first = grid.firstElementChild;
      if (!first) return grid.clientWidth;
      const gap = parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap || 0) || 0;
      return first.getBoundingClientRect().width + gap;
    };
    const update = () => {
      const isMobile = window.matchMedia('(max-width: 820px)').matches;
      controls.hidden = !isMobile;
      if (!isMobile) return;
      const max = Math.max(0, grid.scrollWidth - grid.clientWidth);
      prev.disabled = grid.scrollLeft <= 4;
      next.disabled = grid.scrollLeft >= max - 4;
    };

    prev.addEventListener('click', () => grid.scrollBy({left:-cardWidth(),behavior:'smooth'}));
    next.addEventListener('click', () => grid.scrollBy({left:cardWidth(),behavior:'smooth'}));
    grid.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    requestAnimationFrame(update);
  };

  document.querySelectorAll('.feature-grid, .service-grid, .capability-strip').forEach(enhanceMobileCardRail);

  const workCarousel = $('[data-home-work-carousel]');
  if (workCarousel) {
    const track = $('[data-home-work-track]', workCarousel);
    const prev = $('[data-home-work-prev]', workCarousel);
    const next = $('[data-home-work-next]', workCarousel);
    const step = () => {
      const first = track?.firstElementChild;
      if (!first || !track) return 320;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0) || 0;
      return first.getBoundingClientRect().width + gap;
    };
    const update = () => {
      if (!track) return;
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max - 4;
    };
    prev?.addEventListener('click', () => track.scrollBy({left:-step(),behavior:'smooth'}));
    next?.addEventListener('click', () => track.scrollBy({left:step(),behavior:'smooth'}));
    track?.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    requestAnimationFrame(update);
  }

  document.querySelectorAll('.project-card').forEach(card => {
    const preview = $('.browser-mockup', card);
    const link = $('.text-link[href]', card);
    if (!preview || !link || preview.tagName === 'A' || preview.dataset.projectLinked) return;
    preview.dataset.projectLinked = 'true';
    preview.setAttribute('role','link');
    preview.setAttribute('tabindex','0');
    preview.style.cursor = 'pointer';
    const go = () => { location.href = link.href; };
    preview.addEventListener('click', go);
    preview.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(); }
    });
  });

  // One stable event handler also handles CMS cards injected after page load.
  const workFilters = $$('[data-work-filter]');
  const workGrid = $('[data-cms-projects]');
  if (workFilters.length && workGrid) {
    let currentFilter = 'all';
    const categoryOf = card => {
      if (card.dataset.workCategory) return card.dataset.workCategory;
      const text = (card.textContent || '').toLowerCase();
      return /planner|hyperlinked pdf|digital product|ebook/.test(text) ? 'products'
        : /analytics|automation|operations system|dashboard/.test(text) ? 'systems' : 'websites';
    };
    const applyFilter = () => {
      const cards = $$('.project-card', workGrid);
      let visible = 0;
      for (const card of cards) {
        const show = currentFilter === 'all' || categoryOf(card) === currentFilter;
        card.hidden = !show;
        if (show) visible++;
      }
      const count = $('#work-count');
      if (count) count.textContent = visible + (visible === 1 ? ' project' : ' projects');
    };
    workFilters.forEach(button => button.addEventListener('click', () => {
      currentFilter = button.dataset.workFilter || 'all';
      workFilters.forEach(b => { b.classList.toggle('active', b===button); b.setAttribute('aria-pressed', String(b===button)); });
      applyFilter();
    }));
    new MutationObserver(mutations => { if (mutations.some(m => m.type === 'childList')) applyFilter(); })
      .observe(workGrid, {childList:true});
    applyFilter();
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
  load('assets/js/refinement.js');
})();