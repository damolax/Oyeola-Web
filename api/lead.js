import { getSql } from './_neon.js';
import crypto from 'node:crypto';
const allowedTypes=new Set(['contact','website-check','operations-check','planner-download','start-here']);
const fallbackEmail='oyeolawebmaster@gmail.com';
const clean=(v,max=2000)=>String(v??'').trim().slice(0,max);

async function deliverByEmail(payload){
  const response=await fetch(`https://formsubmit.co/ajax/${fallbackEmail}`,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({
    _subject:`Oyeola ${payload.type} enquiry from ${payload.name||payload.email}`,_template:'table',_captcha:'false',
    name:payload.name,email:payload.email,service_type:payload.service_type,business_url:payload.business_url,problem:payload.problem,desired_result:payload.desired_result,timeline:payload.timeline,source_page:payload.source_page,score:payload.score??'',result_label:payload.result_label,details:JSON.stringify(payload.details||{}),submitted_at:payload.created_at
  })});
  if(!response.ok) throw new Error('FormSubmit fallback failed');
}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const body=req.body||{}; if(clean(body.company_fax,100)) return res.status(200).json({ok:true});
  const type=clean(body.type,50),email=clean(body.email,320).toLowerCase();
  if(!allowedTypes.has(type)||!email||!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({error:'Please provide a valid email and enquiry type.'});
  const payload={type,name:clean(body.name,160),email,service_type:clean(body.service_type,120),business_url:clean(body.business_url,1000),problem:clean(body.problem,4000),desired_result:clean(body.desired_result,4000),timeline:clean(body.timeline,200),source_page:clean(body.source_page,500),score:Number.isFinite(Number(body.score))?Number(body.score):null,result_label:clean(body.result_label,120),details:body.details&&typeof body.details==='object'?body.details:{},created_at:new Date().toISOString()};
  let capture='';
  try{
    const sql=getSql(),slug='lead-'+Date.now()+'-'+crypto.randomBytes(5).toString('hex');
    await sql`insert into cms_items(item_type,slug,title,status,featured_home,sort_order,data) values('lead',${slug},${'Lead: '+(payload.name||payload.email)},'draft',false,0,${JSON.stringify({...payload,excerpt:payload.problem||payload.desired_result||payload.email})}::jsonb)`;
    capture='neon';
  }catch(error){console.error('Neon lead insert failed',error)}
  if(!capture){
    try{await deliverByEmail(payload);capture='email'}catch(error){return res.status(502).json({error:'Your enquiry could not be delivered automatically. Please email Oyeola directly.'})}
  }
  if(process.env.RESEND_API_KEY&&process.env.OYEOLA_FROM_EMAIL){
    const resources=type==='planner-download'?'<p>Your planner sample is unlocked on the page you submitted.</p>':'<p>Your enquiry has been received.</p>';
    fetch('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.RESEND_API_KEY}`},body:JSON.stringify({from:process.env.OYEOLA_FROM_EMAIL,to:[email],subject:type==='planner-download'?'Your Oyeola planner sample':'Oyeola received your enquiry',html:`<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>Thanks${payload.name?', '+payload.name:''}.</h2>${resources}</div>`})}).catch(()=>{});
  }
  return res.status(200).json({ok:true,capture});
}
