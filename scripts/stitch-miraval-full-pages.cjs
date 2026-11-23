(async function stitchMiraval(){
const {chromium}=require('playwright'),sharp=require('sharp'),fs=require('fs'),path=require('path');
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const url='https://www.miravalresorts.com/';
for(const [kind,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,locale:'en-US',ignoreHTTPSErrors:true,isMobile:width<500,hasTouch:width<500});
 try{
  const page=await context.newPage();
  const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:32000});
  if(res?.status()!==200)throw Error('Source not accessible '+res?.status());
  await page.waitForTimeout(1600);
  try{const b=page.getByRole('button',{name:/accept all|accept cookies|allow all|agree|accept|got it/i}).first();if(await b.isVisible({timeout:600}))await b.click({timeout:1000})}catch{}
  let pageHeight=await page.evaluate(()=>Math.max(document.documentElement.scrollHeight,document.body.scrollHeight));
  if(pageHeight<height+100)throw Error('Page too short '+pageHeight);
  pageHeight=Math.min(pageHeight,20000);
  const step=Math.round(height*.85),frames=[],seen=new Set();
  for(let y=0;y<pageHeight;y+=step){
    const scroll=Math.max(0,Math.min(y,pageHeight-height));
    await page.evaluate(v=>window.scrollTo(0,v),scroll);
    await page.waitForTimeout(760);
    const actual=await page.evaluate(()=>window.scrollY);
    if(seen.has(actual))continue;
    seen.add(actual);
    if(actual>0&&frames.length===1){await page.addStyleTag({content:'header,[role="banner"]{visibility:hidden!important;pointer-events:none!important}'})}
    const jpg=await page.screenshot({type:'jpeg',quality:91,animations:'disabled',timeout:30000});
    const frame=await sharp(jpg,{limitInputPixels:false}).metadata();
    if(frame.width!==width)throw Error('Viewport screenshot wider than expected: '+frame.width);
    frames.push({input:jpg,top:Math.round(actual),left:0});
    console.log('FRAME',kind,frames.length,'at',actual,'total',pageHeight);
    if(actual>=pageHeight-height-2)break;
  }
  const final=await sharp({create:{width,height:pageHeight,channels:3,background:'#ffffff'},limitInputPixels:false}).composite(frames).webp({quality:85,effort:5}).toBuffer();
  const file=`assets/industry-captures/miraval-resorts/full-${kind}.webp`;
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,final);
  console.log('STITCHED',kind,width+'x'+pageHeight,final.length,'frames',frames.length);
 }finally{await context.close()}
}
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)})
