const TYPES=new Set(['project','review','service','tool','skill','credential','demo','stat','setting']);
const supabaseUrl=()=>process.env.SUPABASE_URL || 'https://pnuyufllwzultgrgpotz.supabase.co';
const serviceKey=()=>process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey=()=>process.env.SUPABASE_PUBLISHABLE_KEY || '';
function token(req){
  const h=String(req.headers.authorization||'');
  return h.startsWith('Bearer ')?h.slice(7):'';
}
async function authorize(req){
  const t=token(req); if(!t||!anonKey()) return null;
  const r=await fetch(supabaseUrl()+'/auth/v1/user',{headers:{apikey:anonKey(),Authorization:'Bearer '+t}});
  if(!r.ok) return null;
  const user=await r.json();
  const allowed=(process.env.OYEOLA_ADMIN_EMAIL||'').toLowerCase();
  if(allowed && String(user.email||'').toLowerCase()!==allowed) return null;
  return user;
}
function baseHeaders(extra={}){
  return {'Content-Type':'application/json',apikey:serviceKey(),Authorization:'Bearer '+serviceKey(),...extra};
}
export default async function handler(req,res){
  const user=await authorize(req);
  if(!user) return res.status(401).json({error:'Unauthorized'});
  if(!serviceKey()) return res.status(503).json({error:'Admin database key is not configured'});
  const base=supabaseUrl()+'/rest/v1/cms_content';
  if(req.method==='GET'){
    const type=String(req.query.type||'').trim();
    let endpoint=base+'?select=*&order=sort_order.asc,updated_at.desc';
    if(type){ if(!TYPES.has(type)) return res.status(400).json({error:'Invalid type'}); endpoint+='&content_type=eq.'+encodeURIComponent(type); }
    const r=await fetch(endpoint,{headers:baseHeaders()});
    const data=await r.json().catch(()=>[]);
    return r.ok?res.status(200).json({items:data}):res.status(502).json({error:data});
  }
  if(req.method==='POST'){
    const b=req.body||{};
    if(!TYPES.has(b.content_type)||!b.slug||!b.title) return res.status(400).json({error:'Type, slug and title are required'});
    const payload={content_type:b.content_type,slug:String(b.slug).trim(),title:String(b.title).trim(),excerpt:String(b.excerpt||'').trim(),data:b.data&&typeof b.data==='object'?b.data:{},published:!!b.published,featured_home:!!b.featured_home,sort_order:Number(b.sort_order)||0};
    const r=await fetch(base,{method:'POST',headers:baseHeaders({Prefer:'return=representation'}),body:JSON.stringify(payload)});
    const data=await r.json().catch(()=>[]);
    return r.ok?res.status(200).json({item:data[0]}):res.status(502).json({error:data});
  }
  if(req.method==='PUT'){
    const b=req.body||{}; if(!b.id) return res.status(400).json({error:'id required'});
    const payload={title:String(b.title||'').trim(),slug:String(b.slug||'').trim(),excerpt:String(b.excerpt||'').trim(),data:b.data&&typeof b.data==='object'?b.data:{},published:!!b.published,featured_home:!!b.featured_home,sort_order:Number(b.sort_order)||0};
    const r=await fetch(base+'?id=eq.'+encodeURIComponent(b.id),{method:'PATCH',headers:baseHeaders({Prefer:'return=representation'}),body:JSON.stringify(payload)});
    const data=await r.json().catch(()=>[]);
    return r.ok?res.status(200).json({item:data[0]}):res.status(502).json({error:data});
  }
  if(req.method==='DELETE'){
    const id=String(req.query.id||''); if(!id) return res.status(400).json({error:'id required'});
    const r=await fetch(base+'?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:baseHeaders({Prefer:'return=minimal'})});
    return r.ok?res.status(200).json({ok:true}):res.status(502).json({error:'Delete failed'});
  }
  return res.status(405).json({error:'Method not allowed'});
}
