import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function j(value: unknown) {
  return JSON.stringify(value, null, 2);
}

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 'settings' },
    update: {},
    create: {
      id: 'settings',
      brandName: 'Oyeola',
      founderName: 'Olalekan Musodiq Oyekunle',
      tagline: 'Websites that convert visitors into clients.',
      navigationJson: j([
        { label: 'Home', href: '/#home' },
        { label: 'About', href: '/#about' },
        { label: 'Services', href: '/#services' },
        { label: 'Projects', href: '/#projects' },
        { label: 'Process', href: '/#process' },
        { label: 'Reviews', href: '/#reviews' },
        { label: 'Contact', href: '/#contact' }
      ]),
      logoUrl: 'https://oyeola-online.lovable.app/assets/logo-DYZWDVSf.png',
      faviconUrl: 'https://oyeola-online.lovable.app/assets/logo-DYZWDVSf.png',
      founderPhotoUrl: 'https://oyeola-online.lovable.app/assets/hero-portrait-Cj8CyeQo.png',
      ogImage: 'https://oyeola-online.lovable.app/assets/hero-portrait-Cj8CyeQo.png',
      footerText: 'Oyeola builds clear, structured websites that help visitors understand your offer, trust your business, and contact you.',
      contactRecipientEmail: 'elicitors.online@gmail.com',
      socialLinksJson: j([
        { label: 'WhatsApp', href: 'https://wa.link/' },
        { label: 'Instagram', href: '#' },
        { label: 'LinkedIn', href: '#' },
        { label: 'Email', href: 'mailto:elicitors.online@gmail.com' }
      ])
    }
  });

  const nav = [
    ['Home', '/#home'], ['About', '/#about'], ['Services', '/#services'], ['Projects', '/#projects'], ['Process', '/#process'], ['Reviews', '/#reviews'], ['Contact', '/#contact']
  ];
  for (let index = 0; index < nav.length; index += 1) {
    const item = nav[index];
    await prisma.navigationItem.upsert({
      where: { id: `nav-${index}` },
      update: { label: item[0], href: item[1], order: index, visible: true },
      create: { id: `nav-${index}`, label: item[0], href: item[1], order: index, visible: true }
    });
  }

  const sections = [
    {
      key: 'hero', order: 1, title: 'Find the leaks stopping your ecommerce store from turning visitors into buyers.',
      content: {
        eyebrow: 'Ecommerce conversion diagnosis for stores that want clearer answers before more traffic',
        subheadline: 'Oyeola reviews your store like a buyer, then maps the product-page gaps, trust issues, cart friction, and follow-up opportunities that may be costing you sales.',
        primaryCtaLabel: 'Request a Store Review', primaryCtaLink: '/contact', secondaryCtaLabel: 'See What Gets Reviewed', secondaryCtaLink: '/audit'
      }
    },
    {
      key: 'problem', order: 2, title: 'More traffic is not always the first fix.',
      content: {
        body: 'A store can have good products, clean visuals, and paid traffic running every day while still losing buyers at the moments that matter. Sometimes the product page does not answer the right doubts. Sometimes the offer is not clear enough. Sometimes the cart creates friction. Sometimes the store collects emails but never turns interest into follow-up. Oyeola starts by finding those leaks before recommending what to fix, automate, or promote.',
        bullets: ['Paid visitors landing on pages that do not make the offer obvious enough.', 'Reviews and guarantees placed too far away from the buyer’s hesitation point.', 'Email capture that collects addresses but does not build a buying path afterward.']
      }
    },
    {
      key: 'review', order: 3, title: 'The Ecommerce Revenue Leak Review',
      content: {
        body: 'This is a focused diagnostic review of the parts of your store that influence buying decisions. It looks at how visitors understand your offer, whether they trust the page, where they may hesitate, and what happens after they leave without buying.',
        cards: ['Product-page clarity', 'Buyer objection gaps', 'Offer and pricing friction', 'Trust signal placement', 'Cart and checkout friction', 'Email capture and recovery flows', 'Repeat purchase opportunities']
      }
    },
    {
      key: 'framework', order: 4, title: 'The buyer-journey leak framework',
      content: {
        cards: [
          { title: 'Understand', body: 'Can a visitor quickly understand what the product is, who it is for, and why it is worth caring about?' },
          { title: 'Believe', body: 'Does the page give enough proof, context, and reassurance at the exact moment doubt appears?' },
          { title: 'Act', body: 'Is the path from product interest to checkout clear, mobile-friendly, and low-friction?' },
          { title: 'Return', body: 'If a visitor leaves, does the store have useful follow-up that brings intent back instead of losing it completely?' }
        ]
      }
    },
    {
      key: 'founder', order: 8, title: 'Built for store owners who want clearer answers before spending more.',
      content: {
        body: 'I am Olalekan Musodiq Oyekunle, the ecommerce marketer behind Oyeola. My work focuses on diagnosing the buying path before guessing at solutions. That means looking beyond surface design and asking the harder questions: what does the buyer need to believe, where does confidence drop, and what follow-up is missing after they leave?',
        bullets: ['Practical store diagnosis before strategy theatre.', 'Conversion copy, offer clarity, email recovery, and buyer journey thinking in one view.', 'Recommendations built around what the buyer sees, doubts, clicks, and ignores.']
      }
    },
    {
      key: 'process', order: 10, title: 'A simple plan that keeps the first step clear.',
      content: {
        steps: [
          { title: 'Send your store for review', body: 'Share the store URL, platform, and the main problem you want checked first.' },
          { title: 'Get the leak breakdown', body: 'Oyeola maps the visible gaps in clarity, trust, friction, and follow-up.' },
          { title: 'Fix the priority path first', body: 'You see what deserves attention now, what can wait, and what should stop wasting effort.' }
        ]
      }
    },
    {
      key: 'faq', order: 11, title: 'Questions store owners usually ask first',
      content: {
        items: [
          { question: 'Is this only for Shopify stores?', answer: 'Shopify is a strong fit, but the review can also help ecommerce stores on WooCommerce, BigCommerce, custom storefronts, and other platforms.' },
          { question: 'Will you guarantee more revenue?', answer: 'No. The review does not promise guaranteed sales. It gives a practical diagnosis of visible leaks and the highest-priority fixes that may improve the buyer journey.' },
          { question: 'Do I need ads running first?', answer: 'No. In fact, the review is useful before pushing more traffic because it checks whether the store can handle buyer intent properly.' }
        ]
      }
    },
    {
      key: 'final-cta', order: 12, title: 'Want to know what your store may be leaking?',
      content: {
        body: 'Send your store for a practical review. You will get a clearer view of the conversion gaps, buyer doubts, and follow-up opportunities worth fixing first.',
        ctaLabel: 'Request a Revenue Leak Review', ctaLink: '/contact'
      }
    }
  ];

  for (const section of sections) {
    await prisma.section.upsert({
      where: { pageSlug_key: { pageSlug: 'home', key: section.key } },
      update: { title: section.title, contentJson: j(section.content), order: section.order, visible: true },
      create: { pageSlug: 'home', key: section.key, title: section.title, contentJson: j(section.content), order: section.order, visible: true }
    });
  }

  const services = [
    {
      title: 'Ecommerce Store Audit and CRO Roadmap', slug: 'ecommerce-store-audit-cro-roadmap', icon: 'SearchCheck', order: 1,
      summary: 'A practical review of the store path, from product page clarity to checkout friction and follow-up gaps.',
      problem: 'The store is getting visitors, but the owner does not know why more of them are not buying.',
      whatWeDo: 'Oyeola reviews product pages, buyer objections, trust signals, cart path, offer clarity, and follow-up systems to create a prioritized fix plan.',
      deliverable: 'A clear roadmap showing what to fix first, why it matters, and how each fix supports conversion.',
      bestFit: 'Best for stores that already have products and traffic, but need clarity on the highest-impact conversion fixes.',
      included: ['Product page objection review', 'Cart and checkout friction notes', 'Trust placement review', '30-day fix priority plan'],
      process: ['Review the store like a first-time buyer', 'Map the moments where confidence drops', 'Prioritize fixes by buyer impact and implementation effort'],
      faqs: [{ question: 'Is this a design audit?', answer: 'It includes design where design affects buyer decisions, but the main focus is conversion clarity, trust, friction, and follow-up.' }]
    },
    {
      title: 'Product Page Conversion Improvement', slug: 'product-page-conversion-improvement', icon: 'PanelTop', order: 2,
      summary: 'Restructure product pages around buyer motivation, doubts, benefits, proof, and CTA clarity.',
      problem: 'The page shows the product, but it does not fully sell the decision.',
      whatWeDo: 'Oyeola improves structure, messaging, objection handling, benefits, trust placement, comparison logic, and CTA clarity.',
      deliverable: 'A stronger product-page blueprint built around the buyer’s doubts and buying motivation.',
      bestFit: 'Best for products that get views but weak add-to-cart behavior or low buyer confidence.',
      included: ['Above-the-fold clarity', 'Benefit hierarchy', 'Objection handling', 'Proof placement', 'CTA and offer structure'],
      process: ['Clarify the decision the buyer is making', 'Identify unanswered doubts', 'Restructure sections so proof appears where hesitation happens'],
      faqs: [{ question: 'Do you rewrite the product copy?', answer: 'The service can include copy direction, wireframe structure, and section-level messaging depending on the scope.' }]
    },
    {
      title: 'Email and SMS Lifecycle Flows', slug: 'email-sms-lifecycle-flows', icon: 'Mails', order: 3,
      summary: 'Plan welcome, abandoned cart, browse recovery, post-purchase, winback, and repeat purchase paths.',
      problem: 'Visitors and customers are not being followed up with properly.',
      whatWeDo: 'Oyeola plans or builds flows for welcome, abandoned cart, abandoned checkout, browse recovery, post-purchase, winback, and repeat purchase.',
      deliverable: 'A practical retention and recovery system designed to bring more value from the traffic the store already receives.',
      bestFit: 'Best for stores collecting emails or getting abandoned carts but lacking a useful follow-up system.',
      included: ['Welcome flow plan', 'Abandoned cart and checkout logic', 'Browse recovery', 'Post-purchase and repeat purchase touchpoints'],
      process: ['Map where people leave', 'Match email intent to the buyer moment', 'Build clear messages that answer objections and bring people back'],
      faqs: [{ question: 'Is this only Klaviyo?', answer: 'Klaviyo is a common fit, but the strategy can be adapted to other email and SMS platforms.' }]
    },
    {
      title: 'Paid Traffic Readiness Review', slug: 'paid-traffic-readiness-review', icon: 'Gauge', order: 4,
      summary: 'Check whether your store is ready to receive more traffic before spending more on campaigns.',
      problem: 'Ads may be sending visitors to a store that is not ready to convert them.',
      whatWeDo: 'Oyeola checks whether the landing page, offer, product journey, trust signals, mobile experience, and follow-up systems are ready before more traffic is pushed.',
      deliverable: 'A readiness review showing what should be fixed before scaling campaigns.',
      bestFit: 'Best for stores planning ads or already spending on traffic without enough confidence in the post-click journey.',
      included: ['Landing page readiness', 'Offer clarity check', 'Mobile path review', 'Follow-up gap check', 'Traffic readiness score'],
      process: ['Review the traffic destination', 'Score the buying path', 'Separate traffic problems from conversion problems'],
      faqs: [{ question: 'Will you manage ads?', answer: 'This review focuses on readiness. It helps decide whether ads should be pushed, paused, or supported by conversion fixes first.' }]
    },
    {
      title: 'Abandoned Cart and Checkout Recovery', slug: 'abandoned-cart-checkout-recovery', icon: 'ShoppingCart', order: 5,
      summary: 'Improve the path that brings high-intent shoppers back after they hesitate, leave, or abandon checkout.',
      problem: 'Shoppers are showing purchase intent, but the store is not recovering enough of that intent after they leave.',
      whatWeDo: 'Oyeola reviews cart friction, checkout hesitation points, recovery email/SMS timing, message logic, incentive use, and trust gaps.',
      deliverable: 'A cleaner cart recovery plan with better objection handling and less generic follow-up.',
      bestFit: 'Best for stores with add-to-cart activity, abandoned checkouts, or traffic that almost buys but does not complete purchase.',
      included: ['Cart friction notes', 'Checkout recovery message map', 'Trust and urgency guidance', 'Offer and incentive review'],
      process: ['Spot friction before checkout', 'Map abandoned cart intent', 'Create recovery messages that help the buyer decide'],
      faqs: [{ question: 'Do you always recommend discounts?', answer: 'No. Discounts are only one lever. Sometimes clarity, proof, timing, or reassurance matter more.' }]
    },
    {
      title: '30-Day Ecommerce Growth Plan', slug: '30-day-ecommerce-growth-plan', icon: 'CalendarCheck', order: 6,
      summary: 'Turn a diagnosis into a focused 30-day action plan that is clear enough to execute.',
      problem: 'The owner has too many possible fixes and no clear order of priority.',
      whatWeDo: 'Oyeola translates store findings into a practical plan covering quick wins, deeper fixes, content, lifecycle improvements, and tracking needs.',
      deliverable: 'A 30-day plan that shows what to fix now, what to test next, and what to measure.',
      bestFit: 'Best after an audit or when a store needs a grounded execution plan instead of scattered advice.',
      included: ['Priority matrix', 'Weekly action plan', 'Owner/team checklist', 'Measurement guidance'],
      process: ['Group findings by buyer impact', 'Sequence fixes into weeks', 'Define what good execution should look like'],
      faqs: [{ question: 'Is this a replacement for a full marketing plan?', answer: 'It is a focused execution plan for the conversion and buyer-journey fixes that should happen first.' }]
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        summary: service.summary,
        problem: service.problem,
        whatWeDo: service.whatWeDo,
        deliverable: service.deliverable,
        bestFit: service.bestFit,
        icon: service.icon,
        order: service.order,
        includedJson: j(service.included),
        processJson: j(service.process),
        faqsJson: j(service.faqs),
        published: true
      },
      create: {
        title: service.title,
        slug: service.slug,
        summary: service.summary,
        problem: service.problem,
        whatWeDo: service.whatWeDo,
        deliverable: service.deliverable,
        bestFit: service.bestFit,
        icon: service.icon,
        order: service.order,
        includedJson: j(service.included),
        processJson: j(service.process),
        faqsJson: j(service.faqs),
        published: true
      }
    });
  }

  const categories = [
    ['Store audits', 'store-audits', 'Full-store diagnostic reviews that map leaks across product pages, cart, and follow-up.'],
    ['Product page reviews', 'product-page-reviews', 'Breakdowns focused on product-page clarity, buyer confidence, and objection handling.'],
    ['Email flow strategy', 'email-flow-strategy', 'Lifecycle and recovery flow planning for ecommerce stores.'],
    ['Traffic readiness', 'traffic-readiness', 'Reviews that check whether a store is ready before pushing more paid traffic.']
  ];
  for (let index = 0; index < categories.length; index += 1) {
    const cat = categories[index];
    await prisma.portfolioCategory.upsert({
      where: { slug: cat[1] },
      update: { name: cat[0], description: cat[2], order: index },
      create: { name: cat[0], slug: cat[1], description: cat[2], order: index }
    });
  }

  const catStore = await prisma.portfolioCategory.findUnique({ where: { slug: 'store-audits' } });
  const catProduct = await prisma.portfolioCategory.findUnique({ where: { slug: 'product-page-reviews' } });
  const catEmail = await prisma.portfolioCategory.findUnique({ where: { slug: 'email-flow-strategy' } });
  const catTraffic = await prisma.portfolioCategory.findUnique({ where: { slug: 'traffic-readiness' } });

  const portfolios = [
    {
      title: 'Sample Breakdown: Product Page Losing Buyer Confidence', slug: 'sample-product-page-losing-buyer-confidence', clientType: 'Premium skincare store', niche: 'Beauty and personal care', featured: true, showOnHome: true,
      problem: 'The page looked polished, but it asked buyers to believe too much without enough proof, comparison, or reassurance close to the CTA.',
      reviewed: 'Above-the-fold copy, benefit hierarchy, ingredient explanation, review placement, CTA path, mobile scroll depth, guarantee visibility.',
      findings: ['The first screen focused on product aesthetics but did not make the core transformation obvious.', 'Reviews were present, but not near the points where price and usage doubts would appear.', 'The guarantee sat in the footer instead of supporting the purchase decision.'],
      fixes: ['Rewrite the hero to state who the product is for and what problem it solves.', 'Move review snippets and usage proof closer to the CTA and ingredient sections.', 'Add a short objection-handling block before the add-to-cart decision.'],
      impact: 'The recommended changes matter because they help a first-time buyer understand, believe, and act without searching through the page for reassurance.',
      tools: ['Shopify', 'Product page CRO', 'Buyer objection mapping'], categories: [catProduct?.id]
    },
    {
      title: 'Sample Breakdown: Store Collecting Emails Without a Follow-Up Path', slug: 'sample-store-collecting-emails-without-follow-up-path', clientType: 'Home decor ecommerce store', niche: 'Home and lifestyle', featured: true, showOnHome: true,
      problem: 'The store had a visible popup, but the subscriber journey stopped after the first discount message.',
      reviewed: 'Popup promise, welcome email, product education, abandoned cart path, browse recovery, post-purchase follow-up, winback opportunities.',
      findings: ['The popup collected interest without setting a clear reason to open future emails.', 'The welcome sequence did not teach the buyer how to choose the right product.', 'Browse intent was not followed up after visitors looked at category pages.'],
      fixes: ['Create a welcome path that starts with the buyer’s room or use case, not just the discount.', 'Add product education and trust emails before asking for another purchase.', 'Introduce browse recovery for high-intent product and category views.'],
      impact: 'The fixes would help the store turn captured email addresses into a real buying journey instead of a one-message discount attempt.',
      tools: ['Klaviyo', 'Email strategy', 'Retention planning'], categories: [catEmail?.id]
    },
    {
      title: 'Sample Breakdown: Paid Traffic Sent to a Weak Buying Journey', slug: 'sample-paid-traffic-weak-buying-journey', clientType: 'Fitness accessory brand', niche: 'Fitness and wellness', featured: true, showOnHome: true,
      problem: 'Ads were driving interest, but the landing path did not match the buyer promise from the ad.',
      reviewed: 'Ad-to-page message match, mobile landing experience, offer clarity, trust proof, product comparison, cart path, recovery flows.',
      findings: ['The page headline did not continue the promise that made the ad interesting.', 'Mobile shoppers had to scroll too far before seeing proof or product differentiation.', 'Recovery emails treated all abandoned carts the same even when the product intent differed.'],
      fixes: ['Align the landing hero with the ad promise and buyer use case.', 'Move product proof, comparison, and social reassurance higher on mobile.', 'Segment cart recovery by product interest and hesitation type.'],
      impact: 'The recommendation separates traffic issues from conversion issues so ad spend is not pushed into a path that cannot carry buyer intent.',
      tools: ['Meta ads readiness', 'Landing page CRO', 'Lifecycle recovery'], categories: [catTraffic?.id, catStore?.id]
    },
    {
      title: 'Sample Breakdown: Cart Friction Hiding in a Clean Store', slug: 'sample-cart-friction-hiding-clean-store', clientType: 'Specialty food store', niche: 'Food and beverage', featured: false, showOnHome: false,
      problem: 'The storefront looked simple, but the cart introduced small uncertainties that made the checkout feel less safe.',
      reviewed: 'Cart language, shipping expectations, trust cues, discount field behavior, checkout handoff, abandoned checkout follow-up.',
      findings: ['Shipping timing was not clear until late in the decision path.', 'The cart had no short reassurance around returns, product handling, or secure checkout.', 'The abandoned checkout message repeated the cart contents without resolving the hesitation.'],
      fixes: ['Add concise shipping and handling reassurance inside the cart.', 'Use a clearer checkout CTA with trust microcopy.', 'Rewrite abandoned checkout follow-up around the likely buyer concern.'],
      impact: 'Cart improvements matter because high-intent buyers need fewer unanswered questions, not more distractions.',
      tools: ['Shopify cart review', 'Checkout friction', 'Email recovery'], categories: [catStore?.id]
    }
  ];

  for (const item of portfolios) {
    await prisma.portfolioItem.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        clientType: item.clientType,
        niche: item.niche,
        problem: item.problem,
        reviewed: item.reviewed,
        findingsJson: j(item.findings),
        fixesJson: j(item.fixes),
        impact: item.impact,
        toolsJson: j(item.tools),
        featured: item.featured,
        showOnHome: item.showOnHome,
        published: true,
        categories: { set: item.categories.filter(Boolean).map((id) => ({ id: id! })) }
      },
      create: {
        title: item.title,
        slug: item.slug,
        clientType: item.clientType,
        niche: item.niche,
        problem: item.problem,
        reviewed: item.reviewed,
        findingsJson: j(item.findings),
        fixesJson: j(item.fixes),
        impact: item.impact,
        toolsJson: j(item.tools),
        featured: item.featured,
        showOnHome: item.showOnHome,
        published: true,
        categories: { connect: item.categories.filter(Boolean).map((id) => ({ id: id! })) }
      }
    });
  }

  const testimonials = [
    {
      clientName: 'Sample Client', company: 'Independent Shopify Brand', role: 'Founder', tag: 'Store audit', featured: true, showOnHome: true, order: 1,
      quote: 'The review was useful because it did not just say the site needed better design. It showed exactly where a buyer would start doubting the product and what to fix first.'
    },
    {
      clientName: 'Sample Client', company: 'Lifestyle Store', role: 'Marketing lead', tag: 'Email flows', featured: true, showOnHome: true, order: 2,
      quote: 'The strongest part was the follow-up map. It made clear that our popup was collecting emails, but the buyer journey after signup was too thin.'
    },
    {
      clientName: 'Sample Client', company: 'Niche Ecommerce Store', role: 'Owner', tag: 'Traffic readiness', featured: false, showOnHome: false, order: 3,
      quote: 'Before spending more on ads, the review helped us see the parts of the page that were not carrying the promise from our campaigns.'
    }
  ];
  for (const item of testimonials) {
    await prisma.testimonial.create({ data: item });
  }

  const posts = [
    {
      title: 'Why more traffic can make an ecommerce problem more expensive',
      slug: 'why-more-traffic-can-make-ecommerce-problem-more-expensive',
      category: 'Paid traffic readiness',
      excerpt: 'Traffic is useful only when the page can carry buyer intent. Here is how to tell whether the store path should be fixed before ads are pushed harder.',
      body: 'More traffic does not automatically expose a store to more buyers. Sometimes it exposes more people to the same unanswered doubts. Before a store spends harder, the page needs to make the offer clear, show proof where hesitation happens, reduce cart friction, and follow up when visitors leave. A traffic readiness review separates the traffic problem from the conversion problem so the owner knows what to fix first.',
      published: true
    },
    {
      title: 'The product page questions buyers rarely say out loud',
      slug: 'product-page-questions-buyers-rarely-say-out-loud',
      category: 'CRO',
      excerpt: 'A buyer may not ask questions directly, but the page still needs to answer them before confidence drops.',
      body: 'A good product page does more than describe the product. It answers what the product does, who it is for, why it is different, whether it is worth the price, what happens if it does not work, and why the buyer should trust the store. When those answers are missing or buried, the page can look clean while still leaking intent.',
      published: true
    }
  ];
  for (const post of posts) {
    await prisma.resourcePost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post
    });
  }

  await prisma.page.upsert({
    where: { slug: 'privacy' },
    update: {},
    create: {
      title: 'Privacy Policy',
      slug: 'privacy',
      body: 'Oyeola collects the information you submit through the contact and review request forms, including your name, email address, store URL, platform, and the challenge you describe. This information is used to review your request, respond to you, and manage leads inside the private admin area. Oyeola does not sell submitted lead information. Email provider and analytics tools may process data only for website operation, communication, and performance measurement.'
    }
  });
  await prisma.page.upsert({
    where: { slug: 'terms' },
    update: {},
    create: {
      title: 'Terms',
      slug: 'terms',
      body: 'The information on this website is for general ecommerce strategy and conversion guidance. Requesting a review does not create a guarantee of revenue, sales, or business results. Any recommendations provided by Oyeola are based on visible website information, supplied context, and practical buyer-journey analysis.'
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
