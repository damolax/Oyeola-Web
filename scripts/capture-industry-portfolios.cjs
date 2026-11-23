(async function main(){
const fs=require('fs'),path=require('path'),sharp=require('sharp'),{chromium}=require('playwright');
const projects=JSON.parse(fs.readFileSync('data/verified-industry-targets.json','utf8'));
const verified=[],skipped=[],stamp='23 November 2026';
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const save=(f,data)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,data)};
const img=(s,type)=>`assets/industry-captures/${s}/${type}.webp`;
const block=/just a moment|access denied|connectyourdomain|website expired|not found|404 error|captcha|verify you are human/i;
const browser=await chromium.launch({headless:true});
function shell(title,desc,body,nested=false,script=''){
  const rt=nested?'../':'';
  const u=nested?'industry-portfolios/':'';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | Oyeola Online</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="https://oyeolaonline.com/${u}${nested?esc(title.toLowerCase().replace(/[^a-z0-9]+/g,'-')):'industry-portfolios'}">
<link rel="icon" href="${rt}assets/logos/favicon.svg">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${rt}assets/css/styles.css?v=20261123">
<link rel="stylesheet" href="${rt}assets/css/industry-portfolio.css?v=20261123">
<script>try{document.documentElement.dataset.theme=localStorage.getItem('oyeola-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')}catch(e){document.documentElement.dataset.theme='dark'}</script>
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:site_name" content="Oyeola Online"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
</head><body><header class="site-header"></header><main>${body}</main>${script}<footer class="footer"></footer><script src="${rt}assets/js/site.js?v=20261123"></script></body></html>`;
}
async function load(page,url){
 const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:28000});
 await page.waitForTimeout(1600);
 try{const btn=page.getByRole('button',{name:/^(accept all|accept cookies|allow all|agree|got it|i agree|okay|dismiss|accept)$/i}).first();if(await btn.isVisible({timeout:600}))await btn.click({timeout:1200});}catch{}
 const meta=await page.evaluate(()=>({title:document.title,body:(document.body?.innerText||'').trim().slice(0,2500),links:[...document.querySelectorAll('a[href]')].filter(a=>a.offsetParent!==null&&a.innerText.trim()).map(a=>({href:a.href,text:a.innerText.trim().slice(0,60)})).slice(0,120),loadedImages:[...document.images].filter(x=>x.complete&&x.naturalWidth>30).length}));
 const valid=response?.status()===200&&meta.body.length>100&&!block.test(meta.title)&&!block.test(meta.body.slice(0,400));
 return {...meta,status:response?.status(),valid,url:page.url()};
}
async function screenshot(page,file,maxWidth){
 const b=await page.screenshot({type:'jpeg',quality:86,animations:'disabled',timeout:30000});
 const buf=await sharp(b).resize({width:maxWidth,withoutEnlargement:true}).webp({quality:82,effort:4}).toBuffer();
 if(buf.length<3200)throw Error('Screenshot appears blank: '+buf.length);
 save(file,buf);return buf.length;
}
function detailHTML(p,r){
const facts=`<span>${esc(p.category)}</span><span>Captured ${stamp}</span><span>Desktop &amp; mobile</span>`;
const imgs=`<div class="ip-gallery-pair">
<figure class="ip-image-frame"><img src="../${img(p.slug,'home')}" width="1440" height="920" alt="${esc(p.name)} desktop homepage screenshot" loading="eager"><figcaption>01 / Homepage on desktop</figcaption></figure>
<figure class="ip-image-frame ip-mobile-view"><img src="../${img(p.slug,'mobile')}" width="390" height="844" alt="${esc(p.name)} mobile website screenshot" loading="lazy"><figcaption>02 / Homepage on mobile</figcaption></figure></div>`;
const inner=r.inner?`<section class="ip-detail-screen"><div class="container"><div class="ip-section-heading"><p class="eyebrow">03 / Interior page</p><h2>Beyond the opening screen.</h2><p>${esc(p.insideNote)}</p></div><figure class="ip-image-frame"><img src="../${img(p.slug,'detail')}" alt="${esc(p.name)} interior website page screenshot" width="1440" height="920" loading="lazy"><figcaption>Live interior page · <a href="${esc(r.inside)}" target="_blank" rel="noopener noreferrer">Open original ↗</a></figcaption></figure></div></section>`:'';
const body=`<div class="ip-study"><section class="ip-study-hero"><div class="container">
<a class="ip-back" href="../industry-portfolios.html">← All industry studies</a><div class="ip-study-intro"><div><p class="eyebrow">${esc(p.category)} / Live website study</p>
<h1>${esc(p.headline)}</h1><p class="lead">${esc(p.lead)}</p>
<div class="ip-site-meta">${facts}</div><div class="ip-end-links"><a class="btn" href="#screenshots">View screenshots ↓</a><a class="text-link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Visit live website ↗</a></div></div>
<div><div class="ip-study-badge"><span>${esc(p.name)}</span></div><p class="ip-reference-notice">This is a review of a publicly accessible website, using genuine page captures. It does not claim project authorship, client affiliation, or unverified business outcomes.</p></div></div></div></section>
<section class="ip-study-gallery" id="screenshots"><div class="container"><div class="ip-section-heading"><p class="eyebrow">01 / Real page captures</p><h2>The experience on two screens.</h2><p>Both views were captured directly from the accessible live site and show its desktop and mobile presentation at the time of review.</p></div>${imgs}</div></section>
<section class="ip-story"><div class="container ip-story-grid"><div><p class="eyebrow">02 / Design observations</p><h2>The journey behind the visuals.</h2><p>${esc(p.focus)}</p></div><div class="ip-insights">${p.notes.map((n,i)=>`<div class="ip-insight"><span>${String(i+1).padStart(2,'0')}</span><div>${esc(n)}</div></div>`).join('')}</div></div></section>${inner}
<section class="section"><div class="container"><div class="ip-main-feature"><div><p class="eyebrow">Continue exploring</p><h2>See websites from other industries.</h2><p>Browse more verified live website references and learn from the differences in how visitors are guided.</p></div><a class="btn" href="../industry-portfolios.html">Browse industry gallery ↗</a></div></div></section>
</div>`;
return shell(p.name+' — '+p.category+' Website Study',p.lead,body,true).replace('href="https://oyeolaonline.com/industry-portfolios/'+esc((p.name+' — '+p.category+' Website Study').toLowerCase().replace(/[^a-z0-9]+/g,'-'))+'"','href="https://oyeolaonline.com/industry-portfolios/'+p.slug+'"');
}
for(const p of projects){
let context;
try{
context=await browser.newContext({viewport:{width:1440,height:920},deviceScaleFactor:1,locale:'en-US',ignoreHTTPSErrors:true});
const page=await context.newPage();
const home=await load(page,p.url);
if(!home.valid){skipped.push({slug:p.slug,status:home.status,reason:home.title||'not accessible'});console.log('SKIP',p.slug,home.status);continue;}
const folder=`assets/industry-captures/${p.slug}`;
await screenshot(page,`${folder}/home.webp`,1440);
const result={slug:p.slug,name:p.name,title:home.title,status:home.status,homeUrl:home.url,category:p.category,loadedImages:home.loadedImages,inside:null};
let inside=p.inside;
if(!inside){
const regex=p.slug==='rural-habitat'?/fincas|inmuebles|propiedades|buscar|venta/i:/carta|men[uú]|menu|concept|food|cocina|about/i;
inside=home.links.find(l=>regex.test(l.text)&&l.href.startsWith(new URL(p.url).origin)&&l.href!==home.url)?.href;
}
if(inside){try{const inner=await load(page,inside);if(inner.valid&&inner.url!==home.url){await screenshot(page,`${folder}/detail.webp`,1440);result.inside=inner.url;}}
catch(e){console.log('INNER_SKIP',p.slug,String(e).slice(0,110));}}
if(!result.inside&&p.slug==='roostiq-bar'){
try{await page.goto(p.url,{waitUntil:'domcontentloaded',timeout:22000});await page.evaluate(()=>window.scrollTo(0,850));await page.waitForTimeout(1100);await screenshot(page,`${folder}/detail.webp`,1440);result.inside=p.url;}catch(e){}
}
const mobContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1,locale:'en-US',ignoreHTTPSErrors:true});
try{const m=await mobContext.newPage();const b=await load(m,p.url);if(!b.valid)throw Error('mobile page inaccessible');await screenshot(m,`${folder}/mobile.webp`,390);}finally{await mobContext.close();}
verified.push({target:p,result});
save(`industry-portfolios/${p.slug}.html`,detailHTML(p,result));
console.log('VERIFIED',p.slug,home.title);
}catch(e){fs.rmSync(`assets/industry-captures/${p.slug}`,{recursive:true,force:true});fs.rmSync(`industry-portfolios/${p.slug}.html`,{force:true});skipped.push({slug:p.slug,reason:String(e).slice(0,160)});console.error('SKIP_ERROR',p.slug,String(e).slice(0,160));}
finally{if(context)await context.close();}
}
await browser.close();
if(verified.length){
const cats=[...new Set(verified.map(x=>x.target.category))];
const btn=['All industries',...cats].map((c,i)=>`<button type="button" class="ip-filter" data-ip-filter="${i===0?'all':esc(c)}" aria-pressed="${i===0?'true':'false'}">${esc(c)}</button>`).join('');
const cards=verified.map(({target:p})=>`<article class="ip-card" data-category="${esc(p.category)}"><a class="ip-card-media" href="industry-portfolios/${p.slug}.html"><img src="${img(p.slug,'home')}" alt="${esc(p.name)} live website screenshot" width="1440" height="920" loading="lazy"></a><div class="ip-card-copy"><p class="ip-card-category">${esc(p.category)}</p><h3>${esc(p.name)}</h3><p>${esc(p.lead)}</p><a class="ip-card-link" href="industry-portfolios/${p.slug}.html">Explore website study ↗</a></div></article>`).join('');
const galleryBody=`<div class="ip-gallery"><section class="ip-hero"><div class="container"><p class="breadcrumb">Oyeola / Work / Industry Studies</p><p class="eyebrow">Industry-based portfolio</p><h1>Good websites tell different stories.</h1><p class="lead">Explore authentic desktop and mobile screenshots from publicly accessible websites. Every study links to its live source.</p><div class="ip-hero-bottom"><a class="btn" href="#industry-gallery">Explore verified websites ↓</a><span class="ip-verification">${verified.length} verified live website${verified.length===1?'':'s'}</span></div></div></section>
<section class="ip-summary" id="industry-gallery"><div class="container"><div class="ip-summary-head"><div><p class="eyebrow">Live website studies</p><h2>Browse by industry.</h2></div><p>Observe real navigation, visual direction and customer experiences.</p></div><div class="ip-filter-bar" role="group" aria-label="Filter website studies">${btn}</div><div class="ip-grid">${cards}</div><p class="ip-gallery-note">These studies document external public websites. Inclusion does not imply Oyeola designed or owns them.</p></div></section></div>`;
const filterJS=`<script>(function(){const buttons=[...document.querySelectorAll('[data-ip-filter]')],cards=[...document.querySelectorAll('[data-category]')];buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));cards.forEach(c=>c.hidden=b.dataset.ipFilter!=='all'&&c.dataset.category!==b.dataset.ipFilter)}))})()</script>`;
save('industry-portfolios.html',shell('Industry Website Studies','Real websites across clinic, hotel, restaurant and property industries with verified live screenshots.',galleryBody,false,filterJS));
let work=fs.readFileSync('work.html','utf8');
const start='<!-- Verified industry gallery start -->',end='<!-- Verified industry gallery end -->';
if(work.includes(start)){const a=work.indexOf(start),b=work.indexOf(end,a);if(b>0)work=work.slice(0,a)+work.slice(b+end.length);}
if(!work.includes('industry-portfolio.css'))work=work.replace('</head>','<link rel="stylesheet" href="assets/css/industry-portfolio.css?v=20261123"></head>');
const previews=verified.slice(0,3).map(({target:p})=>`<a href="industry-portfolios/${p.slug}.html"><img src="${img(p.slug,'home')}" alt="${esc(p.name)} verified live website" loading="lazy"></a>`).join('');
const inject=`${start}<section class="section"><div class="container"><div class="ip-main-feature"><div><p class="eyebrow">Industry-based website studies</p><h2>Explore real websites, one industry at a time.</h2><p>A separate collection of verified public website references with authentic page screenshots and concise UX observations.</p></div><a class="btn" href="industry-portfolios.html">View industry gallery ↗</a></div><div class="ip-main-preview">${previews}</div><p class="ip-main-preview-note">External website studies are shown separately from Oyeola client case studies.</p></div></section>${end}`;
work=work.replace('</main>',inject+'</main>');save('work.html',work);
}
save('data/verified-industry-results.json',JSON.stringify({capturedOn:stamp,verified:verified.map(x=>x.result),rejected:skipped},null,2)+'\n');
console.log('FINAL: verified',verified.length,'skipped',skipped.length);
})().catch(e=>{console.error(e);process.exit(1)});
