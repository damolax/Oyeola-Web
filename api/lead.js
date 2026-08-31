const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pnuyufllwzultgrgpotz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Oyeola <hello@oyeola.com>';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'oyeolawebmaster@gmail.com';

const json=(res,status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body));};
const clean=(v,max=2000)=>String(v||'').trim().slice(0,max);
const validEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function saveLead(lead){
  if(!SUPABASE_KEY) return {ok:false,reason:'supabase_not_configured'};
  const r=await fetch(`${SUPABASE_URL}/rest/v1/oyeola_leads`,{
    method:'POST',
    headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`,'Prefer':'return=minimal'},
    body:JSON.stringify(lead)
  });
  if(!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return {ok:true};
}

async function sendEmail({to,subject,html}){
  if(!RESEND_API_KEY) return {ok:false,reason:'email_not_configured'};
  const r=await fetch('https://api.resend.com/emails',{
    method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${RESEND_API_KEY}`},
    body:JSON.stringify({from:FROM_EMAIL,to:[to],subject,html})
  });
  if(!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return {ok:true};
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST') return json(res,405,{ok:false,error:'Method not allowed'});
  try{
    const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    if(clean(b.company_website,200)) return json(res,200,{ok:true});
    const email=clean(b.email,320).toLowerCase();
    if(!validEmail(email)) return json(res,400,{ok:false,error:'Enter a valid email address.'});
    const source=clean(b.source,80)||'website';
    const interest=clean(b.interest,120);
    const pageUrl=clean(b.page_url,700);
    const lead={
      email,
      name:clean(b.name,120)||null,
      source,
      interest:interest||null,
      website_url:clean(b.website_url,700)||null,
      message:clean(b.message,3000)||null,
      page_url:pageUrl||null,
      created_at:new Date().toISOString()
    };

    const saved=await saveLead(lead);
    if(!saved.ok) return json(res,503,{ok:false,error:'Lead capture is not connected yet. Add the Supabase server key in Vercel.'});

    const planner=source==='planner-download';
    const userSubject=planner?'Your Oyeola planner preview and resources':'We received your Oyeola enquiry';
    const userHtml=planner
      ? `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><h2>Your planner preview is ready.</h2><p>Thanks for checking the Oyeola planner experience.</p><p><a href="https://oyeola-web.vercel.app/planner-preview.html">Open the interactive planner</a></p><p><a href="https://oyeola-web.vercel.app/planner-demo.html#downloads">Return to your unlocked resources</a></p><p>If you want a custom version for your shop, reply to this email with your shop link, target buyer and planner category.</p><p>Oyeola</p></div>`
      : `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><h2>Thanks — I have your enquiry.</h2><p>I will review the context you sent and reply with the clearest next step.</p><p>Oyeola</p></div>`;
    const mailed=await sendEmail({to:email,subject:userSubject,html:userHtml});
    const ownerHtml=`<div style="font-family:Arial,sans-serif;line-height:1.5"><h2>New Oyeola lead</h2><p><b>Source:</b> ${source}</p><p><b>Email:</b> ${email}</p><p><b>Name:</b> ${lead.name||'—'}</p><p><b>Interest:</b> ${interest||'—'}</p><p><b>Website:</b> ${lead.website_url||'—'}</p><p><b>Message:</b><br>${(lead.message||'—').replace(/</g,'&lt;')}</p></div>`;
    try{await sendEmail({to:OWNER_EMAIL,subject:`New Oyeola lead — ${source}`,html:ownerHtml});}catch{}

    return json(res,200,{ok:true,email_sent:mailed.ok,unlock:planner});
  }catch(err){
    console.error(err);
    return json(res,500,{ok:false,error:'Something went wrong. Please try again or email oyeolawebmaster@gmail.com.'});
  }
}
