(async function captureFullPages(){
const fs=require('fs'),path=require('path'),sharp=require('sharp'),{chromium}=require('playwright');
const newSites=JSON.parse(fs.readFileSync('data/verified-industry-targets.json','utf8'));
const oldSites=JSON.parse(fs.readFileSync('data/verified-existing-results.json','utf8')).verified;
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const output=[],errors=[],pattern=/just a moment|robot challenge|access denied|captcha|verify you are human|page not found|connectyourdomain|website expired/i;
const destination=(site,kind)=>site.type==='industry'?`assets/industry-captures/${site.slug}/full-${kind}.webp`:`assets/portfolio/live-captures/${site.slug}/full-${kind==='desktop'?'home':kind}.webp`;
const jobs=[...newSites.map(x=>({...x,type:'industry',detailUrl:x.inside})),...oldSites.map(x=>({...x,type:'existing',detailUrl:x.inner}))];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function openAndLoad(page,url){
 const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:32000});
 await pause(1500);
 try{const b=page.getByRole('button',{name:/^(accept|accept all|accept cookies|agree|i agree|allow all|got it|okay)$/i}).first();if(await b.isVisible({timeout:600}))await b.click({timeout:1300})}catch{}
 const info=await page.evaluate(()=>({title:document.title,body:(document.body?.innerText||'').slice(0,2000),height:Math.max(document.documentElement.scrollHeight,document.body?.scrollHeight||0)}));
 if(response?.status()!==200||pattern.test(info.title)||pattern.test(info.body.slice(0,400))||info.body.length<100)throw Error(`Page blocked or unavailable: ${response?.status()} ${info.title}`);
 await page.evaluate(async()=>{try{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2000))])}catch{}});
 let height=Math.min(info.height,55000);
 for(let y=0;y<height;y+=Math.max(750,Math.round((page.viewportSize()?.height||850)*0.75))){
   await page.evaluate(scroll=>window.scrollTo(0,scroll),y);
   await pause(115);
 }
 await page.evaluate(()=>window.scrollTo(0,0));
 await pause(900);
 return info;
}
async function take(site,kind,url,width,height){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,locale:'en-US',ignoreHTTPSErrors:true,isMobile:width<500,hasTouch:width<500});
 try{
  const page=await context.newPage();
  const info=await openAndLoad(page,url);
  const raw=await page.screenshot({fullPage:true,type:'jpeg',quality:86,animations:'disabled',timeout:50000});
  const meta=await sharp(raw,{limitInputPixels:false}).metadata();
  if(meta.width<width-3||meta.height<height-5)throw Error('Full-page capture dimensions were smaller than viewport: '+meta.width+'x'+meta.height);
  const file=destination(site,kind);
  const webp=await sharp(raw,{limitInputPixels:false}).webp({quality:82,effort:4}).toBuffer();
  if(webp.length<4200)throw Error('Image unexpectedly small: '+webp.length);
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,webp);
  return {file,width:meta.width,height:meta.height,bytes:webp.length,title:info.title,source:url};
 }finally{await context.close();}
}
for(const site of jobs){
 const record={slug:site.slug,name:site.name||site.slug,type:site.type,screenshots:{}};
 for(const [kind,url,w,h] of [['desktop',site.url,1440,900],['mobile',site.url,390,844],...(site.detailUrl?[['detail',site.detailUrl,1440,900]]:[])]){
  try{const data=await take(site,kind,url,w,h);record.screenshots[kind]=data;console.log('CAPTURED',site.slug,kind,data.width+'x'+data.height,data.bytes);}
  catch(e){const reason=String(e).slice(0,260);record.screenshots[kind]={error:reason};errors.push({slug:site.slug,kind,reason});console.error('CAPTURE_FAILED',site.slug,kind,reason);}
 }
 output.push(record);
}
await browser.close();
fs.writeFileSync('data/portfolio-full-page-results.json',JSON.stringify({runDate:'2026-11-23',total:jobs.length,results:output,errors},null,2)+'\n');
console.log('COMPLETE',jobs.length,'records',errors.length,'image capture failures');
})().catch(e=>{console.error(e);process.exit(1)});
