import {getSql,sha256,hashPassword,verifyPassword,newToken,safeUser,viewer,validOrigin,validEmail,sanitizeText,rateLimit,sessionCookie,audit} from './_portal.js';

const DAY=86400;
const ipOf=req=>String(req.headers['cf-connecting-ip']||req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
export default async function handler(req,res){
  res.setHeader('Cache-Control','private, no-store');
  const action=String(req.query?.action||'status');
  if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
  if(req.method==='POST'&&!validOrigin(req))return res.status(403).json({error:'Cross-origin action refused'});
  let sql;
  try {sql=getSql()} catch {return res.status(503).json({error:'The publishing database is not connected yet.'})}
  try{
    if(action==='status'&&req.method==='GET'){
      return res.status(200).json({user:safeUser(await viewer(sql,req))});
    }
    if(action==='register'&&req.method==='POST'){
      const email=String(req.body?.email||'').trim().toLowerCase();
      const name=sanitizeText(req.body?.display_name,120);
      const password=String(req.body?.password||'');
      if(!validEmail(email)||name.length<2||password.length<12||password.length>200)
        return res.status(400).json({error:'A valid email, name and password (12+ characters) are required.'});
      if(!await rateLimit(sql,'signup:'+ipOf(req),5,3600))
        return res.status(429).json({error:'Too many registration attempts. Try later.'});
      const existing=await sql`SELECT id FROM portal_users WHERE email=${email} LIMIT 1`;
      if(existing.length)return res.status(409).json({error:'Account already registered. Please sign in.'});
      const rows=await sql`
        INSERT INTO portal_users(email,display_name,password_hash,role,account_status)
        VALUES(${email},${name},${hashPassword(password)},'contributor','pending')
        RETURNING id`;
      await audit(sql,rows[0].id,'account_requested','user',rows[0].id);
      return res.status(201).json({ok:true,message:'Your application has been submitted for editorial approval.'});
    }
    if(action==='login'&&req.method==='POST'){
      const email=String(req.body?.email||'').trim().toLowerCase();
      const password=String(req.body?.password||'');
      if(!validEmail(email)||!password)return res.status(400).json({error:'Email and password required.'});
      if(!await rateLimit(sql,'signin:'+ipOf(req)+':'+email,12,900))
        return res.status(429).json({error:'Too many sign-in attempts. Try again later.'});
      let rows=await sql`SELECT * FROM portal_users WHERE email=${email} LIMIT 1`;
      let user=rows[0];
      if(!user || (user.role!=='owner' && user.account_status==='pending')){
        // One-time owner bridge: existing /admin owner must authenticate with
        // the actual legacy admin password. No setup key is exposed publicly.
        const old=await sql`SELECT auth_user_id,password_hash,setup_used FROM cms_admin_config WHERE id=1`;
        const owner=await sql`SELECT id FROM portal_users WHERE role='owner' LIMIT 1`;
        const cfg=old[0];
        if(!owner.length&&cfg?.setup_used&&String(cfg.auth_user_id||'').toLowerCase()===email&&
           cfg.password_hash&&verifyPassword(password,cfg.password_hash)){
          rows=await sql`
            INSERT INTO portal_users(email,display_name,password_hash,role,account_status)
            VALUES(${email},'Oyeola Owner',${hashPassword(password)},'owner','active')
            ON CONFLICT(email) DO UPDATE SET
              password_hash=EXCLUDED.password_hash,role='owner',account_status='active',
              updated_at=now() RETURNING *`;
          user=rows[0];
          await audit(sql,user.id,'owner_initialized','user',user.id);
        }
      }
      if(!user||!verifyPassword(password,user.password_hash))
        return res.status(401).json({error:'Invalid email or password.'});
      if(user.account_status!=='active')
        return res.status(403).json({error:user.account_status==='pending'
          ?'Your account is awaiting approval.':'Your account is not active.'});
      const token=newToken();
      await sql`INSERT INTO portal_sessions(token_hash,user_id,expires_at)
        VALUES(${sha256(token)},${user.id},now()+interval '14 days')`;
      sessionCookie(res,token,14*DAY);
      return res.status(200).json({user:safeUser(user)});
    }
    if(action==='logout'&&req.method==='POST'){
      const cookies=String(req.headers.cookie||'').split(';');
      const token=cookies.find(x=>x.trim().startsWith('portal_session='))?.split('=').slice(1).join('=');
      if(token)await sql`DELETE FROM portal_sessions WHERE token_hash=${sha256(decodeURIComponent(token))}`;
      sessionCookie(res,'',0);
      return res.status(200).json({ok:true});
    }
    return res.status(404).json({error:'Unknown portal action'});
  }catch(error){
    console.error('Editorial auth error:',error);
    return res.status(500).json({error:'Publishing portal is temporarily unavailable.'});
  }
}
