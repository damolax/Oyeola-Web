import { getSql, sha256, hashPassword, verifyPassword, newToken, bearer } from './_neon.js';

export default async function handler(req,res){
  const action=String(req.query.action||req.body?.action||'status');
  let sql;
  try{sql=getSql()}catch(e){return res.status(503).json({error:e.message})}

  if(req.method==='GET' && action==='status'){
    const rows=await sql`select setup_used, password_hash is not null as has_password, auth_user_id from cms_admin_config where id=1`;
    const c=rows[0]||{};
    return res.status(200).json({backend:'neon',setupRequired:!c.setup_used||!c.has_password,adminEmail:c.auth_user_id||''});
  }

  if(req.method==='POST' && action==='setup'){
    const {setup_key,email,password}=req.body||{};
    if(!setup_key||!email||!password||String(password).length<10) return res.status(400).json({error:'Setup key, email and a password of at least 10 characters are required.'});
    const rows=await sql`select setup_hash, setup_used from cms_admin_config where id=1 for update`;
    const c=rows[0]; if(!c) return res.status(500).json({error:'Admin config missing'});
    if(c.setup_used) return res.status(409).json({error:'Admin setup has already been completed.'});
    if(sha256(setup_key)!==c.setup_hash) return res.status(401).json({error:'Invalid setup key.'});
    const passwordHash=hashPassword(password);
    await sql`update cms_admin_config set setup_used=true,password_hash=${passwordHash},auth_user_id=${String(email).toLowerCase()},updated_at=now() where id=1`;
    return res.status(200).json({ok:true});
  }

  if(req.method==='POST' && action==='login'){
    const {email,password}=req.body||{};
    const rows=await sql`select auth_user_id,password_hash,setup_used from cms_admin_config where id=1`;
    const c=rows[0]; if(!c?.setup_used||!c?.password_hash) return res.status(409).json({error:'Admin setup is not complete.'});
    if(String(email||'').toLowerCase()!==String(c.auth_user_id||'').toLowerCase()||!verifyPassword(password,c.password_hash)) return res.status(401).json({error:'Invalid email or password.'});
    await sql`delete from cms_admin_sessions where expires_at<=now()`;
    const token=newToken(),tokenHash=sha256(token);
    const expires=new Date(Date.now()+1000*60*60*24*14);
    await sql`insert into cms_admin_sessions(token_hash,expires_at) values(${tokenHash},${expires.toISOString()})`;
    return res.status(200).json({access_token:token,expires_at:expires.toISOString(),email:c.auth_user_id,backend:'neon'});
  }

  if(req.method==='GET' && action==='verify'){
    const token=bearer(req); if(!token) return res.status(401).json({error:'Unauthorized'});
    const rows=await sql`select s.expires_at,c.auth_user_id from cms_admin_sessions s cross join cms_admin_config c where s.token_hash=${sha256(token)} and s.expires_at>now() and c.id=1 limit 1`;
    if(!rows[0]) return res.status(401).json({error:'Unauthorized'});
    return res.status(200).json({ok:true,email:rows[0].auth_user_id,expires_at:rows[0].expires_at});
  }

  if(req.method==='POST' && action==='logout'){
    const token=bearer(req); if(token) await sql`delete from cms_admin_sessions where token_hash=${sha256(token)}`;
    return res.status(200).json({ok:true});
  }
  return res.status(405).json({error:'Unsupported action'});
}
