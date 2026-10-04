(() => {
  const path = location.pathname.toLowerCase();
  if (!path.includes('/services/')) return;
  const slug = (path.split('/').pop() || '').replace('.html','');

  const generic = {
    website: [
      ['Understand','Clarify the offer, audience and the action the website should make easier.'],
      ['Structure','Organize pages and content around the customer journey, not internal business language.'],
      ['Design','Create a clear visual system with hierarchy, proof and responsive layouts.'],
      ['Build','Develop the pages, forms, booking, content and interactions the project actually needs.'],
      ['Test','Check mobile, links, forms, accessibility basics and the full customer path.']
    ],
    operations: [
      ['Map workflow','Follow the real work from request through ownership, delivery and follow-up.'],
      ['Model data','Structure records and relationships so the system reflects how the business works.'],
      ['Build views','Give each person the information they need without unnecessary complexity.'],
      ['Automate','Remove repetitive updates, reminders and handoffs where automation is reliable.'],
      ['Test','Run realistic scenarios and make sure ownership, exceptions and reporting remain clear.']
    ],
    analytics: [
      ['Define goals','Choose the actions that genuinely matter instead of tracking everything.'],
      ['Map events','Translate the customer journey into useful events and conversion points.'],
      ['Implement','Add the tracking using the right platform, tags and consent-aware setup.'],
      ['Validate','Test that events fire correctly and data is not duplicated or misleading.'],
      ['Report','Turn the data into a simple view that supports decisions instead of vanity metrics.']
    ]
  };

  const configs = {
    'wix-website-design': {name:'Wix Website Design', count:'150+', countLabel:'website design projects completed', process:generic.website, tools:['wix','figma','googleanalytics','googlesearchconsole'], demo:'../demo-beauty.html', projects:[
      ['One Love Beauty','../assets/portfolio/thumbs/one-love-beauty.jpg','../case-studies/one-love-beauty.html','Beauty · Booking'],
      ['Bare Canvas Media','../assets/portfolio/thumbs/bare-canvas-media.jpg','../case-studies/bare-canvas-media.html','Agency · Wix Studio'],
      ['ZenTravels','../assets/portfolio/thumbs/zentravels.jpg','../case-studies/zentravels.html','Travel']
    ]},
    'wix-studio-websites': {name:'Wix Studio', count:'150+', countLabel:'website design projects completed', process:generic.website, tools:['wixstudio','figma','googleanalytics','googlesearchconsole'], demo:'../demo-professional-services.html', projects:[
      ['Bare Canvas Media','../assets/portfolio/thumbs/bare-canvas-media.jpg','../case-studies/bare-canvas-media.html','Agency · Wix Studio'],
      ['One Love Beauty','../assets/portfolio/thumbs/one-love-beauty.jpg','../case-studies/one-love-beauty.html','Booking'],
      ['Latonya Speaks','../assets/portfolio/thumbs/latonya-speaks.jpg','../case-studies/latonya-speaks.html','Personal brand']
    ]},
    'wordpress-website-design': {name:'WordPress', count:'150+', countLabel:'website design projects completed', process:generic.website, tools:['wordpress','figma','woocommerce','googleanalytics','googlesearchconsole'], demo:'../demo-professional-services.html', projects:[
      ['Guestwork Property Management','../assets/portfolio/thumbs/guestwork-property-management.jpg','../case-studies/guestwork-property-management.html','Property'],
      ['Somatra Healing','../assets/portfolio/thumbs/somatra-healing.jpg','../case-studies/somatra-healing.html','Wellness'],
      ['DaVinci Resolve Craftsman','../assets/portfolio/thumbs/davinci-resolve-craftsman.jpg','../case-studies/davinci-resolve-craftsman.html','Creator']
    ]},
    'godaddy-website-design': {name:'GoDaddy Website Design', count:'150+', countLabel:'website design projects completed', process:generic.website, tools:['godaddy','figma','googleanalytics','googlesearchconsole'], demo:'../demo-home-services.html', projects:[
      ['Bambo Oladipo','../assets/portfolio/thumbs/bambo-oladipo.jpg','../case-studies/bambo-oladipo.html','Personal brand'],
      ['Latonya Speaks','../assets/portfolio/thumbs/latonya-speaks.jpg','../case-studies/latonya-speaks.html','Speaker'],
      ['Concierge Wellness','../assets/portfolio/thumbs/concierge-wellness.jpg','../case-studies/concierge-wellness.html','Wellness']
    ]},
    'booking-website': {name:'Booking Websites', count:'150+', countLabel:'website design projects completed', process:[
      ['Map service','Clarify what can be booked, who it is for and what customers need to know first.'],
      ['Match intent','Guide the visitor to the right service or appointment type before the calendar.'],
      ['Design flow','Reduce unnecessary steps between understanding the service and choosing a time.'],
      ['Integrate','Connect the appropriate booking, form, payment or calendar system.'],
      ['Test','Check confirmation, mobile behavior, edge cases and the full booking journey.']
    ], tools:['wix','wordpress','calendly','googlecalendar','figma'], demo:'../demo-beauty.html', projects:[
      ['One Love Beauty','../assets/portfolio/thumbs/one-love-beauty.jpg','../case-studies/one-love-beauty.html','Beauty · Booking'],
      ['Dr. Akira','../assets/portfolio/thumbs/dr-akira.jpg','../case-studies/dr-akira.html','Therapy · Booking'],
      ['Concierge Wellness','../assets/portfolio/thumbs/concierge-wellness.jpg','../case-studies/concierge-wellness.html','Wellness']
    ]},
    'ecommerce-website': {name:'Ecommerce Websites', count:'150+', countLabel:'website design projects completed', process:[
      ['Understand','Clarify products, buyers, purchase objections and what makes choosing difficult.'],
      ['Catalog','Organize collections, variants and product information so shoppers can browse logically.'],
      ['Design','Create product and collection pages around comparison, trust and decision-making.'],
      ['Build','Connect the store, cart, checkout and any useful recommendation or bundle logic.'],
      ['Optimize','Test mobile shopping, product discovery, tracking and the purchase journey.']
    ], tools:['shopify','woocommerce','wix','figma','googleanalytics'], demo:'../demo-ecommerce.html', projects:[
      ['3 Nails 1 Cross','../assets/portfolio/thumbs/three-nails-one-cross.jpg','../case-studies/three-nails-one-cross.html','Ecommerce'],
      ['VapourVend','../assets/portfolio/thumbs/vapourvend.jpg','../case-studies/vapourvend.html','Ecommerce'],
      ['ZenTravels','../assets/portfolio/thumbs/zentravels.jpg','../case-studies/zentravels.html','Travel']
    ]},
    'analytics-tracking': {name:'Analytics & Tracking', count:'10+', countLabel:'analytics and reporting tools used', process:generic.analytics, tools:['googleanalytics','googletagmanager','googlesearchconsole','looker','microsoftclarity'], demo:'../demo-saas.html', projects:[
      ['Shop & Ship Express Analytics','../assets/portfolio/thumbs/shop-ship-express-analytics.jpg','../case-studies/shop-ship-express-analytics.html','Analytics'],
      ['Guestwork Property Management','../assets/portfolio/thumbs/guestwork-property-management.jpg','../case-studies/guestwork-property-management.html','Website'],
      ['Bare Canvas Media','../assets/portfolio/thumbs/bare-canvas-media.jpg','../case-studies/bare-canvas-media.html','Website']
    ]},
    'website-growth-setup': {name:'Website Growth', count:'150+', countLabel:'website design projects completed', process:[
      ['Audit','Find where the current journey loses clarity, trust or momentum.'],
      ['Prioritize','Separate important fixes from changes that would only make the site busier.'],
      ['Improve','Update the pages, content, UX or tracking that affect the chosen goal.'],
      ['Measure','Watch the actions that show whether the change is helping.'],
      ['Iterate','Use evidence from real behavior to decide what should change next.']
    ], tools:['googleanalytics','googlesearchconsole','figma','microsoftclarity','googletagmanager'], demo:'../demo-professional-services.html', projects:[
      ['Bare Canvas Media','../assets/portfolio/thumbs/bare-canvas-media.jpg','../case-studies/bare-canvas-media.html','Agency'],
      ['One Love Beauty','../assets/portfolio/thumbs/one-love-beauty.jpg','../case-studies/one-love-beauty.html','Booking'],
      ['ZenTravels','../assets/portfolio/thumbs/zentravels.jpg','../case-studies/zentravels.html','Travel']
    ]},
    'airtable-systems': {name:'Airtable Systems', count:'10+', countLabel:'automation and operations tools used', process:generic.operations, tools:['airtable','n8n','pipedrive','zoho','googlesheets'], demo:'../operations-demo.html', projects:[]}
  };

  const cfg = configs[slug];
  if (!cfg) return;
  const hero = document.querySelector('.service-hero');
  if (!hero) return;

  const toolNames={wix:'Wix',wixstudio:'Wix Studio',figma:'Figma',googleanalytics:'Google Analytics',googlesearchconsole:'Search Console',wordpress:'WordPress',woocommerce:'WooCommerce',godaddy:'GoDaddy',calendly:'Calendly',googlecalendar:'Google Calendar',shopify:'Shopify',googletagmanager:'Tag Manager',looker:'Looker Studio',microsoftclarity:'Microsoft Clarity',airtable:'Airtable',n8n:'n8n',pipedrive:'Pipedrive',zoho:'Zoho',googlesheets:'Google Sheets'};
  const logoUrl = name => 'https://cdn.simpleicons.org/' + encodeURIComponent(name) + '/63F46D';

  const wrap = document.createElement('div');

  let html = '<section class="service-proof-strip"><div class="container"><div class="service-proof-inner">' +
    '<article><strong>'+cfg.count+'</strong><span>'+cfg.countLabel+'</span></article>' +
    '<article><strong>400+</strong><span>Fiverr reviews</span></article>' +
    '<article><strong>500+</strong><span>projects completed</span></article>' +
    '</div></div></section>';

  html += '<section class="section how-work-section"><div class="container">' +
    '<div class="how-work-intro"><div><p class="eyebrow">How I work</p><h2>A clear process from first question to final test.</h2></div>' +
    '<p>Each step has a job. The process changes with the project, but I do not skip the thinking that makes the final build useful.</p></div>' +
    '<div class="service-process-wide">' +
    cfg.process.map(function(step,i){return '<article><strong>0'+(i+1)+'</strong><h3>'+step[0]+'</h3><p>'+step[1]+'</p></article>';}).join('') +
    '</div></div></section>';

  html += '<section class="section soft"><div class="container"><div class="section-head"><div><p class="eyebrow">Tools</p><h2>The tools support the workflow.</h2>' +
    '<p>I choose the platform around the job rather than forcing every project into the same stack.</p></div></div>' +
    '<div class="logo-marquee"><div class="logo-track">' +
    cfg.tools.concat(cfg.tools).map(function(t){return '<span class="tool-logo"><img src="'+logoUrl(t)+'" alt="'+(toolNames[t]||t)+' logo"><span>'+(toolNames[t]||t)+'</span></span>';}).join('') +
    '</div></div></div></section>';

  if (cfg.projects.length) {
    html += '<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Selected work</p><h2>Projects related to this service.</h2>' +
      '<p>Open a project to see the challenge, decisions and finished work.</p></div></div><div class="service-related-work">' +
      cfg.projects.map(function(p){return '<article><a href="'+p[2]+'"><img src="'+p[1]+'" alt="'+p[0]+'"></a><div><span class="demo-tag">'+p[3]+'</span><h3>'+p[0]+'</h3><a class="text-link" href="'+p[2]+'">View project</a></div></article>';}).join('') +
      '</div></div></section>';
  }

  html += '<section class="section soft"><div class="container"><div class="surface"><div class="section-head"><div><p class="eyebrow">Related demo</p>' +
    '<h2>See one interaction on its own page.</h2><p>Use the feature first. Then decide whether something similar belongs in your own customer journey.</p></div></div>' +
    '<a class="btn" href="'+cfg.demo+'">Open related demo</a></div></div></section>';

  wrap.innerHTML = html;
  hero.insertAdjacentElement('afterend', wrap);
})();