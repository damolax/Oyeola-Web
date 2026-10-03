const supabaseUrl=()=>process.env.SUPABASE_URL || 'https://pnuyufllwzultgrgpotz.supabase.co';
const serviceKey=()=>process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey=()=>process.env.SUPABASE_PUBLISHABLE_KEY || '';
function token(req){const h=String(req.headers.authorization||'');return h.startsWith('Bearer ')?h.slice(7):''}
async function authorize(req){
  const t=token(req); if(!t||!anonKey()) return null;
  const r=await fetch(supabaseUrl()+'/auth/v1/user',{headers:{apikey:anonKey(),Authorization:'Bearer '+t}});
  if(!r.ok) return null;
  const user=await r.json();
  const allowed=(process.env.OYEOLA_ADMIN_EMAIL||'').toLowerCase();
  if(allowed && String(user.email||'').toLowerCase()!==allowed) return null;
  return user;
}
function safeName(name='file'){
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(-100)||'file';
}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const user=await authorize(req); if(!user) return res.status(401).json({error:'Unauthorized'});
  if(!serviceKey()) return res.status(503).json({error:'Media upload is not configured'});
  const {name,type,data,folder='uploads'}=req.body||{};
  if(!name||!type||!data) return res.status(400).json({error:'Missing file data'});
  const base64=String(data).replace(/^data:[^;]+;base64,/,'');
  const buffer=Buffer.from(base64,'base64');
  if(buffer.length>8*1024*1024) return res.status(413).json({error:'File too large. Keep direct uploads under 8MB; use a video URL for large videos.'});
  const path=folder.replace(/[^a-z0-9/_-]+/gi,'-')+'/'+Date.now()+'-'+safeName(name);
  const r=await fetch(supabaseUrl()+'/storage/v1/object/oyeola-media/'+path,{method:'POST',headers:{Authorization:'Bearer '+serviceKey(),apikey:serviceKey(),'Content-Type':type,'x-upsert':'true'},body:buffer});
  if(!r.ok){const msg=await r.text();return res.status(502).json({error:'Upload failed: '+msg})}
  const publicUrl=supabaseUrl()+'/storage/v1/object/public/oyeola-media/'+path;
  return res.status(200).json({url:publicUrl,path});
}
