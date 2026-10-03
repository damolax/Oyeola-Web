(() => {
  const path=location.pathname.toLowerCase();
  if(!path.includes('/services/')) return;
  const slug=(path.split('/').pop()||'').replace('.html','');
  const config={
    'wix-website-design':{name:'Wix Website Design',count:'150+',countLabel:'website design projects completed',process:['Discover','Structure','Design','Build','Test'],tools:['wix','figma','googleanalytics','googlesearchconsole'],demo:'beauty',projects:[
      ['One Love Beauty','../assets/portfolio/thumbs/one-love-beauty.jpg','../case-studies/one-love-beauty.html','Beauty · Booking'],
      ['Bare Canvas Media','../assets/portfolio/thumbs/bare-canvas-media.jpg','../case-studies/bare-canvas-media.html','Agency · Wix Studio'],
      ['ZenTravels','../assets/portfolio/thumbs/zentravels.jpg','../case-studies/zentravels.html','Travel']
    ]},
    'wix-studio-websites':{name:'Wix Studio',count:'150+',countLabel:'website design projects completed',process:['Discover','Wireframe','Design','Build','Responsive QA'],tools:['wixstudio','figma','googleanalytics','googlesearchconsole'],demo:'professional',projects:[
      ['Bare Canvas Media','../assets/portfolio/thumbs/bare-canvas-media.jpg','../case-studies/bare-canvas-media.html','Agency · Wix Studio'],
      ['One Love Beauty','../assets/portfolio/thumbs/one-love-beauty.jpg','../case-studies/one-love-beauty.html','Booking'],
      ['Latonya Speaks','../assets/portfolio/thumbs/latonya-speaks.jpg','../case-studies/latonya-speaks.html','Personal brand']
    ]},
    'wordpress-website-design':{name:'WordPress',count:'150+',countLabel:'website design projects completed',process:['Discover','Architecture','Design','Build','Optimize'],tools:['wordpress','figma','woocommerce','googleanalytics','googlesearchconsole'],demo:'professional',projects:[
      ['Guestwork Property Management','../assets/portfolio/thumbs/guestwork-property-management.jpg','../case-studies/guestwork-property-management.html','Property'],
      ['Somatra Healing','../assets/portfolio/thumbs/somatra-healing.jpg','../case-studies/somatra-healing.html','Wellness'],
      ['DaVinci Resolve Craftsman','../assets/portfolio/thumbs/davinci-resolve-craftsman.jpg','../case-studies/davinci-resolve-craftsman.html','Creator']
    ]},
    'godaddy-website-design':{name:'GoDaddy Website Design',count:'150+',countLabel:'website design projects completed',process:['Discover','Plan','Design','Build','Launch'],tools:['godaddy','figma','googleanalytics','googlesearchconsole'],demo:'homeservices',projects:[
      ['Bambo Oladipo','../assets/portfolio/thumbs/bambo-oladipo.jpg','../case-studies/bambo-oladipo.html','Personal brand'],
      ['Latonya Speaks','../assets/portfolio/thumbs/latonya-speaks.jpg','../case-studies/latonya-speaks.html','Speaker'],
      ['Concierge Wellness','../assets/portfolio/thumbs/concierge-wellness.jpg','../case-studies/concierge-wellness.html','Wellness']
    ]},
    'booking-website':{name:'Booking Websites',count:'150+',countLabel:'website design projects completed',process:['Map service','Match intent','Design booking flow','Integrate','Test'],tools:['wix','wordpress','calendly','googlecalendar','figma'],demo:'beauty',projects:[
      ['One Love Beauty','../assets/portfolio/thumbs/one-love-beauty.jpg','../case-studies/one-love-beauty.html','Beauty · Booking'],
      ['Dr. Akira','../assets/portfolio/thumbs/dr-akira.jpg','../case-studies/dr-akira.html','Therapy · Booking'],
      ['Concierge Wellness','../assets/portfolio/thumbs/concierge-wellness.jpg','../case-studies/concierge-wellness.html','Wellness']
    ]},
    'ecommerce-website':{name:'Ecommerce Websites',count:'150+',countLabel:'website design projects completed',process:['Discover','Catalog structure','Design','Build','Optimize'],tools:['shopify','woocommerce','wix','figma','googleanalytics'],demo:'ecommerce',projects:[
      ['3 Nails 1 Cross','../assets/portfolio/thumbs/three-nails-one-cross.jpg','../case-studies/three-nails-one-cross.html','Ecommerce'],
      ['VapourVend','../assets/portfolio/thumbs/vapourvend.jpg','../case-studies/vapourvend.html','Ecommerce'],
      ['ZenTravels','../assets/portfolio/thumbs/zentravels.jpg','../case-studies/zentravels.html','Travel']
    ]},
    'analytics-tracking':{name:'Analytics & Tracking',count:'10+',countLabel:'tools & platforms used',process:['Define goals','Map events','Implement','Validate','Report'],tools:['googleanalytics','googletagmanager','googlesearchconsole','looker','microsoftclarity'],demo:'saas',projects:[
      ['Shop & Ship Express Analytics','../assets/portfolio/thumbs/shop-ship-express-analytics.jpg','../case-studies/shop-ship-express-analytics.html','Analytics'],
      ['Guestwork Property Management','../assets/portfolio/thumbs/guestwork-property-management.jpg','../case-studies/guestwork-property-management.html','Website'],
      ['Bare Canvas Media','../assets/portfolio/thumbs/bare-canvas-media.jpg','../case-studies/bare-canvas-media.html','Website']
    ]},
    'website-growth-setup':{name:'Website Growth',count:'150+',countLabel:'website design projects completed',process:['Audit','Prioritize','Improve','Measure','Iterate'],tools:['googleanalytics','googlesearchconsole','figma','microsoftclarity','googletagmanager'],demo:'professional',projects:[
      ['Bare Canvas Media','../assets/portfolio/thumbs/bare-canvas-media.jpg','../case-studies/bare-canvas-media.html','Agency'],
      ['One Love Beauty','../assets/portfolio/thumbs/one-love-beauty.jpg','../case-studies/one-love-beauty.html','Booking'],
      ['ZenTravels','../assets/portfolio/thumbs/zentravels.jpg','../case-studies/zentravels.html','Travel']
    ]},
    'airtable-systems':{name:'Airtable Systems',count:'10+',countLabel:'automation & operations tools',process:['Map workflow','Model data','Build views','Automate','Test'],tools:['airtable','n8n','pipedrive','zoho','googlesheets'],demo:'professional',projects:[]}
  };
  const cfg=config[slug]; if(!cfg) return;
  const hero=document.querySelector('.service-hero'); if(!hero) return;
  const logoUrl=name=>'https://cdn.simpleicons.org/'+encodeURIComponent(name)+'/63F46D';
  const toolNames={wix:'Wix',wixstudio:'Wix Studio',figma:'Figma',googleanalytics:'Google Analytics',googlesearchconsole:'Search Console',wordpress:'WordPress',woocommerce:'WooCommerce',godaddy:'GoDaddy',calendly:'Calendly',googlecalendar:'Google Calendar',shopify:'Shopify',googletagmanager:'Tag Manager',looker:'Looker Studio',microsoftclarity:'Microsoft Clarity',airtable:'Airtable',n8n:'n8n',pipedrive:'Pipedrive',zoho:'Zoho',googlesheets:'Google Sheets'};
  const section=document.createElement('div');
  section.innerHTML=`
    <section class="service-proof-strip"><div class="container"><div class="service-proof-inner"><article><strong>${cfg.count}</strong><span>${cfg.countLabel}</span></article><article><strong>400+</strong><span>Fiverr reviews</span></article><article><strong>500+</strong><span>projects completed</span></article></div></div></section>
    <section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Process</p><h2>How I approach ${cfg.name.toLowerCase()}.</h2></div></div><div class="service-process">${cfg.process.map((x,i)=>`<article><strong>0${i+1}</strong><h3>${x}</h3></article>`).join('')}</div></div></section>
    <section class="section soft"><div class="container"><div class="section-head"><div><p class="eyebrow">Tools</p><h2>The tools support the workflow.</h2></div></div><div class="logo-marquee"><div class="logo-track">${[...cfg.tools,...cfg.tools].map(t=>`<span class="tool-logo"><img src="${logoUrl(t)}" alt=""><span>${toolNames[t]||t}</span></span>`).join('')}</div></div></div></section>
    ${cfg.projects.length?`<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Selected work</p><h2>Projects related to this service.</h2></div></div><div class="service-related-work">${cfg.projects.map(p=>`<article><img src="${p[1]}" alt="${p[0]}"><div><span class="demo-tag">${p[3]}</span><h3>${p[0]}</h3><a class="text-link" href="${p[2]}">View project</a></div></article>`).join('')}</div></div></section>`:''}
    <section class="section soft"><div class="container"><div class="surface"><div class="section-head"><div><p class="eyebrow">Try it</p><h2>See the kind of interaction I can build.</h2></div></div><a class="btn" href="../demos.html?demo=${cfg.demo}">Launch related demo</a></div></div></section>`;
  hero.insertAdjacentElement('afterend',section);
})();