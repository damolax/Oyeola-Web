(() => {

    const instagramIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="17.4" cy="6.7" r="1.15" fill="currentColor"/></svg>`;
    const linkedinIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="8" r="1.35" fill="currentColor"/><path d="M6.8 10.7h2.4v6.6H6.8zM11.1 10.7h2.3v.9c.7-.8 1.6-1.2 2.7-1.2 2.1 0 3.1 1.3 3.1 3.7v3.2h-2.4v-3c0-1.2-.4-1.8-1.4-1.8-1.1 0-1.8.8-1.8 2.1v2.7h-2.5z" fill="currentColor"/></svg>`;
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
    : path.includes('demos') || path.includes('demo-') || path.includes('smart-match') || path.includes('configure') || path.includes('planner-demo') || path.includes('/showroom/') ? 'showroom'
    : path.includes('/services/') || path.includes('services') || path.includes('website') || path.includes('operations') || path.includes('digital-planners') ? 'services'
    : path.includes('about') ? 'about' : '';
  const loaderStartedAt = performance.now();
  if (!document.querySelector('.site-loader')) {
    document.body.classList.add('site-loading');
    document.body.insertAdjacentHTML('afterbegin', `
      <div class="site-loader" role="status" aria-label="Loading Oyeola Online">
        <div class="site-loader-mark" aria-hidden="true">
          <svg viewBox="0 0 128 72" role="presentation">
            <defs>
              <linearGradient id="oyLoaderInfinityGradient" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stop-color="#08c83d"/>
                <stop offset=".52" stop-color="#20ef58"/>
                <stop offset="1" stop-color="#a4ff4f"/>
              </linearGradient>
            </defs>
            <path class="loader-infinity-ghost" pathLength="100" d="M9 37C9 20 28 12 42 27L64 50C78 65 101 59 101 36C101 16 79 10 65 26L43 50C29 65 9 58 9 37Z"/>
            <path class="loader-infinity-draw" pathLength="100" d="M9 37C9 20 28 12 42 27L64 50C78 65 101 59 101 36C101 16 79 10 65 26L43 50C29 65 9 58 9 37Z"/>
          </svg>
        </div>
      </div>
    `);
  }
  const siteLoader = document.querySelector('.site-loader');
  let loaderFinished = false;
  const finishSiteLoad = () => {
    if (loaderFinished || !siteLoader) return;
    loaderFinished = true;
    const minimumIntro = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 1150;
    const wait = Math.max(0, minimumIntro - (performance.now() - loaderStartedAt));
    window.setTimeout(() => {
      siteLoader.classList.add('is-loaded');
      document.body.classList.remove('site-loading');
      document.documentElement.classList.add('site-ready');
      window.setTimeout(() => siteLoader.remove(), 760);
    }, wait);
  };
  if (document.readyState === 'complete') finishSiteLoad();
  else window.addEventListener('load', finishSiteLoad, { once:true });
  window.setTimeout(finishSiteLoad, 9000);


  // Continuous four-word hero: text remains meaningful if JavaScript is unavailable.
  const changingWord = document.querySelector('[data-hero-words]');
  if (changingWord) {
    const words = ['Better.', 'Smarter.', 'Faster.', 'Simpler.'];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let wordIndex = 0;
    changingWord.textContent = words[0];
    window.setInterval(() => {
      if (reducedMotion.matches) {
        wordIndex = (wordIndex + 1) % words.length;
        changingWord.textContent = words[wordIndex];
        return;
      }
      changingWord.classList.add('is-switching');
      window.setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        changingWord.textContent = words[wordIndex];
        changingWord.classList.remove('is-switching');
      }, 260);
    }, 2800);
  }

  const pageMain = document.querySelector('main');

  // Search-friendly breadcrumb structured data for indexable public pages.
  const robotsMeta = document.querySelector('meta[name="robots"]')?.content?.toLowerCase() || '';
  const currentPath = location.pathname.replace(/\.html$/,'').replace(/\/$/,'') || '/';
  const isDemoChild = currentPath.startsWith('/showroom/') && currentPath !== '/showroom';
  if (currentPath !== '/' && !robotsMeta.includes('noindex') && !isDemoChild && !document.getElementById('oyeola-breadcrumb-schema')) {
    const pageLabel = (document.querySelector('h1')?.textContent || document.title.split('|')[0] || 'Page').replace(/\s+/g,' ').trim();
    const items = [{ '@type':'ListItem', position:1, name:'Oyeola Online', item:'https://oyeolaonline.com/' }];
    if (currentPath.startsWith('/services/')) {
      items.push({ '@type':'ListItem', position:2, name:'Services', item:'https://oyeolaonline.com/services' });
    } else if (currentPath.startsWith('/case-studies/')) {
      items.push({ '@type':'ListItem', position:2, name:'Work', item:'https://oyeolaonline.com/work' });
    }
    items.push({ '@type':'ListItem', position:items.length + 1, name:pageLabel, item:'https://oyeolaonline.com' + currentPath });
    const schema = document.createElement('script');
    schema.id = 'oyeola-breadcrumb-schema';
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({ '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:items });
    document.head.appendChild(schema);
  }
  if(pageMain && !pageMain.id)pageMain.id = 'main-content';
  if(pageMain && !document.querySelector('.skip-link'))document.body.insertAdjacentHTML('afterbegin','<a class="skip-link" href="#main-content">Skip to content</a>');

    const header = $('.site-header');
  if (header) {
    const brandMark = `<span class="brand-infinity" aria-hidden="true"><svg viewBox="0 0 128 72" role="presentation"><defs><linearGradient id="oyInfinityGradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#08c83d"/><stop offset=".52" stop-color="#20ef58"/><stop offset="1" stop-color="#a4ff4f"/></linearGradient></defs><path class="brand-infinity-base" pathLength="100" d="M9 37C9 20 28 12 42 27L64 50C78 65 101 59 101 36C101 16 79 10 65 26L43 50C29 65 9 58 9 37Z"/><path class="brand-infinity-flow" pathLength="100" d="M9 37C9 20 28 12 42 27L64 50C78 65 101 59 101 36C101 16 79 10 65 26L43 50C29 65 9 58 9 37Z"/></svg></span>`;
    header.outerHTML = `<header class="site-header studio-header">
      <div class="container studio-header-row">
        <a class="studio-brand" href="${root}index.html" aria-label="Oyeola Online home">
          ${brandMark}
          <span class="studio-brand-type"><strong>OYEOLA</strong><small>ONLINE</small></span>
        </a>
        <div class="studio-header-actions">
          <button class="theme-toggle" type="button" aria-label="Switch to ${theme==='light'?'dark':'light'} mode" title="Switch theme"><span data-theme-icon aria-hidden="true">${theme==='light'?'☀':'◐'}</span></button>
          <a class="studio-project-cta" href="${root}contact.html">Start a project <span class="studio-project-cta-icon" aria-hidden="true">↗</span></a>
          <button class="studio-menu-btn" type="button" aria-controls="studio-menu" aria-label="Open menu" aria-expanded="false">
            <span class="studio-menu-label">Menu</span>
            <span class="studio-menu-orb" aria-hidden="true"><span></span><span></span></span>
          </button>
        </div>
      </div>
    </header>
    <div class="studio-menu" id="studio-menu" aria-hidden="true" hidden>
      <div class="studio-menu-backdrop" data-menu-backdrop></div>
      <div class="studio-menu-panel" role="dialog" aria-modal="true" aria-label="Site menu">
        <div class="container studio-menu-inner">
          <div class="studio-menu-top">
            <span>Explore Oyeola Online</span>
            <button class="studio-menu-close" type="button" aria-label="Close menu">Close <span aria-hidden="true">×</span></button>
          </div>
          <nav class="studio-menu-nav" aria-label="Primary navigation">
            <a class="${active==='work'?'active':''}" href="${root}work.html"><span>01</span>Work</a>
            <a class="${active==='showroom'?'active':''}" href="${root}showroom/index.html"><span>02</span>Live websites</a>
            <a class="${active==='services'?'active':''}" href="${root}services.html"><span>03</span>Services</a>
            <a class="${active==='about'?'active':''}" href="${root}about.html"><span>04</span>About</a>
            <a href="${root}contact.html"><span>05</span>Contact</a>
          </nav>
          <div class="studio-menu-meta">
            <div><small>Services</small><a href="${root}websites.html">Website design</a><a href="${root}operations.html">Automation & systems</a><a href="${root}digital-planners.html">Digital planners</a></div>
            <div><small>Connect</small><a href="mailto:oyeolawebmaster@gmail.com">Email</a><a href="https://www.instagram.com/oyeola3168/" target="_blank" rel="me noopener noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/in/olalekan-oyekunle/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="${root}privacy.html">Privacy policy</a></div>
            <div class="studio-menu-cta"><small>Have a project?</small><a href="${root}contact.html">Let's build it <span aria-hidden="true">↗</span></a></div>
          </div>
        </div>
      </div>
    </div>`;
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
    footer.outerHTML = `<footer class="footer"><div class="container"><div class="footer-grid"><div><a class="footer-logo" href="${root}index.html"><img src="${root}assets/logos/logo-horizontal-light.svg" alt="Oyeola Online"></a><p>Thoughtful websites, useful systems, better digital experiences.</p><div class="footer-socials"><a class="social-icon-link" href="https://www.instagram.com/oyeola3168/" target="_blank" rel="me noopener noreferrer" aria-label="Oyeola on Instagram">${instagramIcon}</a><a class="social-icon-link" href="https://www.linkedin.com/in/olalekan-oyekunle/" target="_blank" rel="noopener noreferrer" aria-label="Oyekunle Olalekan on LinkedIn">${linkedinIcon}</a></div></div><div><strong>Explore</strong><p><a href="${root}work.html">Selected work</a><br><a href="${root}showroom/index.html">Live websites</a><br><a href="${root}about.html">About Oyeola Online</a></p></div><div><strong>Services</strong><p><a href="${root}websites.html">Website design</a><br><a href="${root}operations.html">Automation & systems</a><br><a href="${root}digital-planners.html">Digital planners</a></p></div><div><strong>Let's talk</strong><p><a href="${root}contact.html">Start a project</a><br><a href="mailto:oyeolawebmaster@gmail.com">oyeolawebmaster@gmail.com</a></p><a class="footer-privacy-link" href="${root}privacy.html">Privacy policy</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Oyeola Online</span><span>Designed for clarity.</span></div></div></footer>`;
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


  const replaceBrokenToolLogo = img => {
    if (!img || img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    const chip = img.closest('.tool-chip-visual');
    const label = chip?.querySelector(':scope > span:last-child')?.textContent?.trim() || img.alt.replace(/\s+logo$/i,'').trim() || 'Tool';
    const words = label.split(/\s+/).filter(Boolean);
    const monogram = (words.length > 1 ? words.slice(0,2).map(word => word[0]).join('') : label.slice(0,2)).toUpperCase();
    const fallback = document.createElement('span');
    fallback.className = 'tool-monogram tool-monogram-fallback';
    fallback.setAttribute('aria-hidden','true');
    fallback.textContent = monogram;
    img.replaceWith(fallback);
  };
  $$('.tool-chip-visual img').forEach(img => {
    img.addEventListener('error', () => replaceBrokenToolLogo(img), {once:true});
    if (img.complete && img.naturalWidth === 0) replaceBrokenToolLogo(img);
  });

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

  const menu = $('.studio-menu-btn');
  const menuPanel = $('.studio-menu');
  const menuClose = $('.studio-menu-close');
  const menuBackdrop = $('[data-menu-backdrop]');
  let menuHideTimer = 0;

  const setMenu = open => {
    if (!menu || !menuPanel) return;
    window.clearTimeout(menuHideTimer);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuPanel.setAttribute('aria-hidden', String(!open));

    if (open) {
      menuPanel.hidden = false;
      document.body.classList.add('studio-menu-open');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        menuPanel.classList.add('is-open');
        menuClose?.focus({preventScroll:true});
      }));
      return;
    }

    menuPanel.classList.remove('is-open');
    document.body.classList.remove('studio-menu-open');
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650;
    menuHideTimer = window.setTimeout(() => {
      if (menu.getAttribute('aria-expanded') === 'false') menuPanel.hidden = true;
    }, delay);
  };

  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  menuClose?.addEventListener('click', () => { setMenu(false); menu?.focus({preventScroll:true}); });
  menuBackdrop?.addEventListener('click', () => { setMenu(false); menu?.focus({preventScroll:true}); });
  $$('.studio-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus({preventScroll:true});
    }
  });

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


  const showroomCarousel = $('[data-showroom-carousel]');
  if (showroomCarousel) {
    const track = $('[data-showroom-track]', showroomCarousel);
    const prev = $('[data-showroom-prev]', showroomCarousel);
    const next = $('[data-showroom-next]', showroomCarousel);
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
    track?.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); track.scrollBy({left:step(),behavior:'smooth'}); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); track.scrollBy({left:-step(),behavior:'smooth'}); }
    });
    window.addEventListener('resize', update);
    requestAnimationFrame(update);
  }

  const portfolioTrack = $('[data-portfolio-track]');
  if (portfolioTrack) {
    const prev = $('[data-portfolio-prev]');
    const next = $('[data-portfolio-next]');
    const filters = $$('[data-portfolio-filter]');
    const count = $('[data-portfolio-count]');
    let activeFilter = 'all';

    const visibleCards = () => $$('.portfolio-slide', portfolioTrack).filter(card => !card.hidden);
    const step = () => {
      const card = visibleCards()[0];
      if (!card) return portfolioTrack.clientWidth * .9;
      const style = getComputedStyle(portfolioTrack);
      const gap = parseFloat(style.columnGap || style.gap || 0) || 0;
      return card.getBoundingClientRect().width + gap;
    };
    const update = () => {
      const max = Math.max(0, portfolioTrack.scrollWidth - portfolioTrack.clientWidth);
      if (prev) prev.disabled = portfolioTrack.scrollLeft <= 4;
      if (next) next.disabled = portfolioTrack.scrollLeft >= max - 4;
    };
    const applyFilter = key => {
      activeFilter = key || 'all';
      let shown = 0;
      $$('.portfolio-slide', portfolioTrack).forEach(card => {
        const show = activeFilter === 'all' || card.dataset.workCategory === activeFilter;
        card.hidden = !show;
        if (show) shown++;
      });
      filters.forEach(button => {
        const on = button.dataset.portfolioFilter === activeFilter;
        button.classList.toggle('active', on);
        button.setAttribute('aria-pressed', String(on));
      });
      if (count) count.textContent = shown + (shown === 1 ? ' project' : ' projects') + ' to explore';
      portfolioTrack.scrollTo({left:0,behavior:'smooth'});
      requestAnimationFrame(update);
    };
    prev?.addEventListener('click', () => { portfolioTrack.scrollBy({left:-step(),behavior:'smooth'}); window.setTimeout(update, 350); });
    next?.addEventListener('click', () => { portfolioTrack.scrollBy({left:step(),behavior:'smooth'}); window.setTimeout(update, 350); });
    portfolioTrack.addEventListener('scroll', update, {passive:true});
    filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.portfolioFilter)));
    window.addEventListener('resize', update);
    portfolioTrack.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); portfolioTrack.scrollBy({left:step(),behavior:'smooth'}); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); portfolioTrack.scrollBy({left:-step(),behavior:'smooth'}); }
    });
    applyFilter('all');
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