(async function stitchOther(){
const {chromium}=require('playwright'),sharp=require('sharp'),fs=require('fs'),path=require('path');
const pages=[
 {slug:'park-lane-copenhagen',url:'https://parklanecph.com/en/',detail:'https://parklanecph.com/en/rooms/'},
 {slug:'roostiq-bar',url:'https://bar.roostiq.com/en/'}
];
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const pause=t=>new Promise(r=>setTimeout(r,t));
for(const site of pages){
 for(const [type,url,width,height] of [['desktop',site.url,1440,900],['mobile',site.url,390,844],...(site.detail?[['detail',site.detail,1440,900]]:[])]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,locale:'en-US',ignoreHTTPSErrors:true,isMobile:width<500,hasTouch:width<500});
 try{
 const p=await context.newPage();const r=await p.goto(url,{waitUntil:'domcontentloaded',timeout:34000});
 await pause(1700);
 const title=await p.title();
 if(r?.status()!==200||/robot challenge|just a moment|access denied|captcha|404/i.test(title))throw Error('Site unavailable '+r?.status()+' '+title);
 try{const b=p.getByRole('button',{name:/accept|agree|allow all|got it/i}).first();if(await b.isVisible({timeout:600}))await b.click({timeout:1200})}catch{}
 let full=await p.evaluate(()=>Math.max(document.body.scrollHeight,document.documentElement.scrollHeight));
 if(full<height)full=height;full=Math.min(full,28000);
 const frames=[],seen=new Set(),step=Math.round(height*.83);
 for(let y=0;y<full;y+=step){
   await p.evaluate(v=>window.scrollTo(0,v),Math.min(y,full-height));await pause(720);
   const yActual=await p.evaluate(()=>window.scrollY);if(seen.has(yActual))continue;seen.add(yActual);
   if(yActual>0&&frames.length===1)await p.addStyleTag({content:'header,[role="banner"]{visibility:hidden!important}'});
   const img=await p.screenshot({type:'jpeg',quality:91,animations:'disabled',timeout:30000});
   const meta=await sharp(img).metadata();
   if(meta.width!==width)throw Error('Viewport not correct '+meta.width);
   frames.push({input:img,left:0,top:Math.round(yActual)});
   if(yActual>=full-height-2)break;
 }
 const out=await sharp({create:{width,height:full,channels:3,background:'#ffffff'}}).composite(frames).webp({quality:84,effort:5}).toBuffer();
 const target=`assets/industry-captures/${site.slug}/full-${type}.webp`;
 const prior=fs.existsSync(target)?fs.statSync(target).size:0;
 if(out.length>prior*.6){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,out);console.log('IMPROVED',site.slug,type,frames.length,`${width}x${full}`,out.length,prior);}
 else console.log('RETAINED',site.slug,type,'stitched unexpectedly small',out.length,prior);
 }catch(e){console.log('SKIPPED',site.slug,type,String(e).slice(0,230))}
 finally{await context.close()}
 }
}
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
