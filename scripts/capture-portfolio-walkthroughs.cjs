// Run only on the isolated portfolio preview branch. Record genuine public website visits.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const data=JSON.parse(fs.readFileSync('data/portfolio-full-page-results.json','utf8'));
const targets=data.results.filter(x=>x.type==='existing'&&!(x.screenshots.mobile?.width>=320&&x.screenshots.mobile?.width<=500));
const block=/access denied|just a moment|captcha|verify you are human|website expired|page not found|connectyourdomain/i;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
let report=[];
for(const x of targets){
 let context,dir=fs.mkdtempSync(path.join(os.tmpdir(),'oyeola-tour-'));
 try{
  context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1,recordVideo:{dir,size:{width:1280,height:800}},ignoreHTTPSErrors:true,locale:'en-US'});
  const page=await context.newPage(),started=Date.now();
  const res=await page.goto(x.screenshots.desktop.source,{waitUntil:'domcontentloaded',timeout:35000});
  await sleep(2200);
  try{const b=page.getByRole('button',{name:/^(accept all|accept cookies|agree|allow all|accept|got it|dismiss)$/i}).first();if(await b.isVisible({timeout:700}))await b.click({timeout:1300})}catch{}
  await page.evaluate(async()=>{try{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2200))])}catch{}});
  const info=await page.evaluate(()=>({title:document.title,body:document.body?.innerText?.slice(0,1500)||'',height:Math.max(document.documentElement.scrollHeight,document.body?.scrollHeight||0),images:[...document.images].filter(i=>i.complete&&i.naturalWidth>30).length}));
  if(res?.status()!==200||info.body.length<100||block.test(info.title)||block.test(info.body.slice(0,450))||info.height<1000)throw Error('Page not suitable for recording');
  const skip=(Date.now()-started)/1000,video=page.video();
  await sleep(1200);
  await page.evaluate(async()=>{const h=Math.min(Math.max(0,document.documentElement.scrollHeight-innerHeight),Math.max(0,innerHeight*7));const t=performance.now();await new Promise(resolve=>{const run=now=>{const p=Math.min(1,(now-t)/12500);window.scrollTo(0,h*p);p<1?requestAnimationFrame(run):resolve()};requestAnimationFrame(run)})});
  await sleep(1200);await context.close();context=null;
  const src=await video.path(),folder='assets/portfolio/live-captures/'+x.slug,output=folder+'/walkthrough.mp4';
  const temp=path.join(dir,'final.mp4');
  execFileSync('ffmpeg',['-y','-loglevel','error','-ss',String(Math.max(0,skip-.15)),'-i',src,'-t','14','-an','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',temp],{timeout:90000});
  const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',temp],{encoding:'utf8'}).trim());
  if(!Number.isFinite(duration)||duration<8||fs.statSync(temp).size<25000)throw Error('Recording failed duration or size check');
  fs.copyFileSync(temp,output);
  const file='case-studies/'+x.slug+'.html';let html=fs.readFileSync(file,'utf8');
  const marker='<!-- Verified portfolio screenshots end -->';
  if(!html.includes(marker))throw Error('Missing case gallery marker');
  const section='<section class="pp-case-enhancement oy-walkthrough"><div class="container"><div class="pp-section-top"><div><p class="pp-eyebrow">WEBSITE WALKTHROUGH</p><h2>See the website in motion.</h2></div><p>A genuine recording of the public desktop website, captured after the page loaded.</p></div><video controls playsinline preload="none" poster="../'+folder+'/home.webp" aria-label="'+esc(x.name)+' website walkthrough"><source src="../'+output+'" type="video/mp4">Your browser does not support this video.</video></div></section>';
  html=html.replace(/<!-- OYEOLA WALKTHROUGH START -->[\s\S]*?<!-- OYEOLA WALKTHROUGH END -->/g,'');
  html=html.replace(marker,marker+'<!-- OYEOLA WALKTHROUGH START -->'+section+'<!-- OYEOLA WALKTHROUGH END -->');fs.writeFileSync(file,html);
  report.push({slug:x.slug,status:'recorded',file:output,durationSeconds:duration,bytes:fs.statSync(output).size,source:x.screenshots.desktop.source});
  console.log('RECORDED',x.slug,duration);
 }catch(e){report.push({slug:x.slug,status:'not-published',reason:String(e).slice(0,250)});console.log('SKIPPED',x.slug,String(e).slice(0,200));}
 finally{if(context)await context.close().catch(()=>{});fs.rmSync(dir,{recursive:true,force:true});}
}
await browser.close();
fs.writeFileSync('data/portfolio-walkthrough-results.json',JSON.stringify({recordedOn:new Date().toISOString(),report},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});