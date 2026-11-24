// Verify local preview markup and responsive device layouts; no live-site changes.
const fs=require('node:fs'),{chromium}=require('playwright');
const records=JSON.parse(fs.readFileSync('data/portfolio-full-page-results.json','utf8')).results;
(async()=>{const browser=await chromium.launch({headless:true});let results=[];
for(const width of [1440,768,390,320]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 const paths=['work.html','industry-portfolios.html',...records.map(x=>(x.type==='industry'?'industry-portfolios/':'case-studies/')+x.slug+'.html')];
 for(const p of paths){
  try{const r=await page.goto('http://127.0.0.1:8098/'+p,{waitUntil:'domcontentloaded',timeout:15000});
  const result=await page.evaluate(async()=>{let images=[...document.querySelectorAll('[data-oy-device-mockup] img,.oy-selected-views img')];for(const i of images)i.loading='eager';await Promise.all(images.map(i=>i.decode().catch(()=>{})));return {mockups:document.querySelectorAll('[data-oy-device-mockup]').length,broken:images.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src')),overflow:document.documentElement.scrollWidth>innerWidth+3,invalidPhone:[...document.querySelectorAll('.oy-device-phone')].some(el=>{const r=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();return r.right>p.right+2||r.bottom>p.bottom+2||r.left<p.left-2||r.top<p.top-2})}});
  const pass=r?.status()===200&&result.mockups>0&&!result.broken.length&&!result.invalidPhone&&!result.overflow;
  results.push({page:p,width,pass,...result});}catch(e){results.push({page:p,width,pass:false,error:String(e).slice(0,200)})}
 }
 await page.close();
}
await browser.close();fs.writeFileSync('portfolio-qa.json',JSON.stringify(results,null,2));const bad=results.filter(r=>!r.pass);console.log('QA',results.length,'checks; failures',bad.length,JSON.stringify(bad.slice(0,15)));if(bad.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});