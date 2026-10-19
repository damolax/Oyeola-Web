import {getSql,sha256,hashPassword,verifyPassword,newToken} from './_neon.js';

export {getSql,sha256,hashPassword,verifyPassword,newToken};
export const roles=['contributor','author','editor','admin','owner'];
export const reviewRoles=['editor','admin','owner'];
export const managementRoles=['admin','owner'];
export const safeUser=u=>u?({
  id:u.id,email:u.email,display_name:u.display_name,
  role:u.role,account_status:u.account_status,bio:u.bio||''
}):null;
export const publicPost=p=>({
  id:p.id,author_id:p.author_id,author_name:p.author_name||'',
  reviewer_id:p.reviewer_id,title:p.title,slug:p.slug,excerpt:p.excerpt,
  content:p.content||{},status:p.status,review_message:p.review_message||'',
  created_at:p.created_at,updated_at:p.updated_at,published_at:p.published_at,deleted_at:p.deleted_at||null
});
export const hasRole=(u,allowed)=>u?.account_status==='active'&&allowed.includes(u.role);
export const isEditor=u=>hasRole(u,reviewRoles);
export const canManage=u=>hasRole(u,managementRoles);
export function validOrigin(req){
  const origin=req.headers.origin;
  if(!origin) return true; // CLI callers still require an authenticated cookie for writes
  try {return new URL(origin).hostname===String(req.headers['x-forwarded-host']||req.headers.host||'').split(':')[0]}
  catch {return false}
}
export function sessionCookie(res,token,maxAge){
  res.setHeader('Set-Cookie','portal_session='+encodeURIComponent(token||'')+
    '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+maxAge);
  res.setHeader('Cache-Control','private, no-store');
}
export async function viewer(sql,req){
  const cookies=String(req.headers.cookie||'').split(';');
  const part=cookies.find(c=>c.trim().startsWith('portal_session='));
  const token=part?.split('=').slice(1).join('=');
  if(!token) return null;
  const rows=await sql`
    SELECT u.* FROM portal_sessions s JOIN portal_users u ON u.id=s.user_id
    WHERE s.token_hash=${sha256(decodeURIComponent(token))} AND s.expires_at>now()
    LIMIT 1`;
  return rows[0]?.account_status==='active'?rows[0]:null;
}
export function sanitizeText(value,max=500){
  return String(value??'').trim().slice(0,max).replace(/[<>]/g,'');
}
export function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)&&email.length<255}
export function validSlug(slug){return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)&&slug.length<=160}
export function cleanContent(content){
  const c=content&&typeof content==='object'&&!Array.isArray(content)?content:{};
  const raw=Array.isArray(c.blocks)?c.blocks:[];
  if(raw.length>100) throw new Error('A maximum of 100 content blocks is supported.');
  const permitted=new Set(['paragraph','heading','quote','list','image','divider','table','related_article']);
  const blocks=raw.map(b=>{
    const type=String(b.type||'paragraph');
    if(!permitted.has(type))throw new Error('Unsupported content block.');
    const obj={type,text:sanitizeText(b.text,15000)};
    if(type==='heading') obj.level=[2,3,4].includes(Number(b.level))?Number(b.level):2;
    if(type==='image'){
      const url=String(b.url||'');
      if(url&&!/^https:\/\/[^\s]+$/i.test(url)&&!/^\/(?:api\/portal-media\?id=[a-f0-9-]{36}|assets\/blog\/[a-z0-9/_.-]+)$/i.test(url))throw new Error('Use an uploaded image or an HTTPS URL.');
      obj.url=url.slice(0,1500);obj.alt=sanitizeText(b.alt,250);obj.caption=sanitizeText(b.caption,400);
    }
    if(type==='list'){
      obj.ordered=!!b.ordered;
      obj.items=(Array.isArray(b.items)?b.items:[]).slice(0,100).map(s=>sanitizeText(s,1000));
    }
    if(type==='table')obj.rows=(Array.isArray(b.rows)?b.rows:[]).slice(0,30).map(row=>(Array.isArray(row)?row:[]).slice(0,8).map(cell=>sanitizeText(cell,1200)));
    if(type==='related_article'){
      obj.slug=String(b.slug||'').trim().toLowerCase();
      if(!validSlug(obj.slug))throw new Error('Choose a valid related article.');
      obj.text=sanitizeText(b.text||'Continue reading',200);
    }
    return obj;
  });
  const tags=(Array.isArray(c.tags)?c.tags:[]).slice(0,12).map(v=>sanitizeText(v,50)).filter(Boolean);
  return {blocks,tags,category:sanitizeText(c.category,80),
    cover_url:(/^https:\/\//i.test(c.cover_url||'')||/^\/(?:api\/portal-media\?id=[a-f0-9-]{36}|assets\/blog\/[a-z0-9/_.-]+)$/i.test(c.cover_url||''))?String(c.cover_url).slice(0,1500):'',
    cover_alt:sanitizeText(c.cover_alt,250),
    seo_title:sanitizeText(c.seo_title,160),
    seo_description:sanitizeText(c.seo_description,320)};
}
export async function rateLimit(sql,key,max,seconds){
  const hash=sha256(key);
  const rows=await sql`
    INSERT INTO portal_rate_limits(key_hash,hits,window_ends_at)
    VALUES(${hash},1,now()+(${seconds}*interval '1 second'))
    ON CONFLICT(key_hash) DO UPDATE SET
      hits=CASE WHEN portal_rate_limits.window_ends_at<now()
        THEN 1 ELSE portal_rate_limits.hits+1 END,
      window_ends_at=CASE WHEN portal_rate_limits.window_ends_at<now()
        THEN now()+(${seconds}*interval '1 second')
        ELSE portal_rate_limits.window_ends_at END
    RETURNING hits`;
  return rows[0].hits<=max;
}
export async function audit(sql,actor,event,subjectType,subjectId,details={}){
  await sql`INSERT INTO portal_activity(actor_id,event_type,subject_type,subject_id,details)
    VALUES(${actor||null},${event},${subjectType},${String(subjectId)},${JSON.stringify(details)}::jsonb)`;
}
