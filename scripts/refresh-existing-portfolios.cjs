(async function upgradeExisting(){
const fs=require('fs'),path=require('path'),sharp=require('sharp'),{chromium}=require('playwright');
const targets=JSON.parse(fs.readFileSync('data/verified-existing-targets.json','utf8'));
const passed=[],skipped=[];
const e=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const save=(name,data)=>{fs.mkdirSync(path.dirname(name),{recursive:true});fs.writeFileSync(name,data)};
const blocked=/just a moment|access denied|connectyourdomain|website expired|page not found|404 error|captcha|verify you are human|robot challenge/i;
const browser=await chromium.launch({headless:true});
const prefix='<!-- Verified portfolio screenshots start -->',suffix='<!-- Verified portfolio screenshots end -->';
async function navigate(page,url){
 const r=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForTimeout(1850);
 try{const cookie=page.getByRole('button',{name:/^(accept all|accept cookies|allow all|agree|got it|i agree|accept|okay|dismiss)$/i}).first();if(await cookie.isVisible({timeout:500}))await cookie.click({timeout:1200})}catch{}
 const s=await page.evaluate(()=>({title:document.title,body:(document.body?.innerText||'').slice(0,2400),links:[...document.querySelectorAll('a[href]')].filter(x=>x.offsetParent!==null&&x.innerText?.trim()).map(x=>({label:x.innerText.trim().slice(0,70),url:x.href})).slice(0,110)}));
 return {valid:r?.status()===200&&s.body.length>110&&!blocked.test(s.title)&&!blocked.test(s.body.slice(0,350)),code:r?.status(),url:page.url(),...s};
}
async function capture(page,dst,width){
 const jpg=await page.screenshot({type:'jpeg',quality:87,animations:'disabled',timeout:26000});
 const b=await sharp(jpg).resize({width,withoutEnlargement:true}).webp({quality:83,effort:4}).toBuffer();
 if(b.length<3400)throw Error('Image too small '+b.length);
 save(dst,b);return b.length;
}
function makeGallery(t,r){
 const base='../assets/portfolio/live-captures/'+t.slug+'/';
 let inside=r.inner?`<div class="ip-detail-screen"><div class="ip-section-heading"><p class="eyebrow">Another page worth exploring</p><h2>Inside the website.</h2><p>The interior page gives a closer view of the navigation and content that visitors meet after the homepage.</p></div><figure class="ip-image-frame"><img src="${base}detail.webp" alt="${e(t.name)} live interior page screenshot" loading="lazy" width="1440" height="920"><figcaption>Live interior page · <a href="${e(r.inner)}" target="_blank" rel="noopener noreferrer">Visit the page ↗</a></figcaption></figure></div>`:'';
 return `${prefix}<section class="section ip-existing-case-gallery" id="live-project-screenshots"><div class="container"><div class="ip-section-heading"><p class="eyebrow">Live website captures · November 2026</p><h2>The project, as visitors see it.</h2><p>These are genuine screenshots taken from the accessible public website. They show the responsive presentation and a practical view of the experience.</p></div>
<div class="ip-gallery-pair">
<figure class="ip-image-frame"><img src="${base}home.webp" width="1440" height="920" alt="${e(t.name)} homepage screenshot on desktop" loading="lazy"><figcaption>Desktop / live homepage</figcaption></figure>
<figure class="ip-image-frame ip-mobile-view"><img src="${base}mobile.webp" width="390" height="844" alt="${e(t.name)} homepage screenshot on mobile" loading="lazy"><figcaption>Mobile / live homepage</figcaption></figure>
</div>${inside}<p class="ip-gallery-note">Site images reflect the live site at capture time; no changes in performance, revenue or enquiries are inferred from these screenshots.</p>
<div class="ip-end-links"><a class="text-link" href="${e(t.url)}" target="_blank" rel="noopener noreferrer">Visit the live website ↗</a><a class="text-link" href="../work.html">Back to all projects ↗</a></div></div></section>${suffix}`;
}
function updateCase(t,r){
 let s=fs.readFileSync(t.casePath,'utf8');
 const index=s.indexOf(prefix);
 if(index!==-1){const last=s.indexOf(suffix,index);if(last<0)throw Error('Incomplete previous screenshot section '+t.casePath);s=s.slice(0,index)+s.slice(last+suffix.length)}
 if(!s.includes('industry-portfolio.css'))s=s.replace('</head>','<link rel="stylesheet" href="../assets/css/industry-portfolio.css?v=20261123b"></head>');
 s=s.replace('</main>',makeGallery(t,r)+'</main>');
 save(t.casePath,s);
}
function replaceWorkThumb(work,t){
 let searchFrom=0,found=0;
 const href=`href="${t.casePath}"`;
 while(searchFrom<work.length){
  const i=work.indexOf(href,searchFrom);
  if(i<0)break;
  const start=work.lastIndexOf('<a',i),end=work.indexOf('</a>',i)+4;
  searchFrom=i+href.length;
  if(start<0||end<=i)continue;
  const fragment=work.slice(start,end);
  if(!/portfolio-slide-image|featured-portfolio-media/.test(fragment)||!fragment.includes('<img'))continue;
  const imgsrc='assets/portfolio/live-captures/'+t.slug+'/home.webp';
  const after=fragment.replace(/(<img\b[^>]*?\bsrc=")[^"]*(")/i,(whole,a,b)=>a+imgsrc+b);
  if(after!==fragment){work=work.slice(0,start)+after+work.slice(end);searchFrom=start+after.length;found++;}
 }
 return {html:work,found};
}
let work=fs.readFileSync('work.html','utf8');
for(const t of targets){
let desktopContext;
try{
 desktopContext=await browser.newContext({viewport:{width:1440,height:920},locale:'en-US',deviceScaleFactor:1,ignoreHTTPSErrors:true});
 const page=await desktopContext.newPage(),home=await navigate(page,t.url);
 if(!home.valid){skipped.push({slug:t.slug,status:home.code,title:home.title});console.log('SKIP',t.slug,home.code,home.title);continue;}
 const dest='assets/portfolio/live-captures/'+t.slug+'/';
 await capture(page,dest+'home.webp',1440);
 const report={slug:t.slug,name:t.name,url:home.url,title:home.title,status:home.code,inner:null};
 const candidates=home.links.filter(x=>x.url.startsWith(new URL(t.url).origin)&&x.url!==home.url&&!x.url.includes('#'));
 const pattern=/shop|collections|products|services|program|about|booking|rooms|contact|gallery|treatments|care|packages|training|offerings|who we are|our work|experience|rentals|reservation|appointment/i;
 const secondary=candidates.find(x=>pattern.test(x.label))?.url||candidates.find(x=>pattern.test(x.url))?.url;
 if(secondary){try{const sub=await navigate(page,secondary);if(sub.valid&&sub.url!==home.url){await capture(page,dest+'detail.webp',1440);report.inner=sub.url;}}catch(err){console.log('INNER_FAIL',t.slug,String(err).slice(0,85))}}
 const mobileContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1,locale:'en-US',ignoreHTTPSErrors:true});
 try{const mobile=await mobileContext.newPage(),ms=await navigate(mobile,t.url);if(!ms.valid)throw Error('mobile not available '+ms.code);await capture(mobile,dest+'mobile.webp',390);}finally{await mobileContext.close();}
 updateCase(t,report);
 const changed=replaceWorkThumb(work,t);work=changed.html;
 report.workCardsUpdated=changed.found;
 passed.push(report);
 console.log('PASS',t.slug,'thumbs',changed.found,report.inner?'interior':'no-interior');
}catch(err){fs.rmSync('assets/portfolio/live-captures/'+t.slug,{recursive:true,force:true});skipped.push({slug:t.slug,error:String(err).slice(0,160)});console.log('FAIL',t.slug,String(err).slice(0,130));}
finally{if(desktopContext)await desktopContext.close();}
}
await browser.close();
save('work.html',work);
save('data/verified-existing-results.json',JSON.stringify({capturedOn:'2026-11-23',verified:passed,skipped},null,2)+'\n');
console.log('DONE',passed.length,'updated',skipped.length,'skipped');
})().catch(e=>{console.error(e);process.exit(1)});
