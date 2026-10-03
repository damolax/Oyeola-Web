import { neon } from '@neondatabase/serverless';
import crypto from 'node:crypto';

export function getSql(){
  const url=process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if(!url) throw new Error('NEON_DATABASE_URL is not configured');
  return neon(url);
}
export function sha256(value){
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}
export function hashPassword(password){
  const salt=crypto.randomBytes(16).toString('hex');
  const iterations=180000;
  const hash=crypto.pbkdf2Sync(String(password),salt,iterations,32,'sha256').toString('hex');
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}
export function verifyPassword(password,stored){
  try{
    const [kind,it,salt,expected]=String(stored||'').split('$');
    if(kind!=='pbkdf2') return false;
    const actual=crypto.pbkdf2Sync(String(password),salt,Number(it),32,'sha256').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(actual,'hex'),Buffer.from(expected,'hex'));
  }catch{return false}
}
export function newToken(){return crypto.randomBytes(32).toString('base64url')}
export function bearer(req){
  const h=String(req.headers.authorization||'');
  return h.startsWith('Bearer ')?h.slice(7):'';
}
export async function authorizeAdmin(req){
  const token=bearer(req); if(!token) return null;
  const sql=getSql();
  const rows=await sql`select id, expires_at from cms_admin_sessions where token_hash=${sha256(token)} and expires_at>now() limit 1`;
  return rows[0]||null;
}
export function mapItem(row){
  const data=row.data||{};
  return {
    id:row.id,
    content_type:row.item_type,
    slug:row.slug,
    title:row.title,
    excerpt:data.excerpt||'',
    data,
    published:row.status==='published',
    featured_home:!!row.featured_home,
    sort_order:Number(row.sort_order)||0,
    created_at:row.created_at||null,
    updated_at:row.updated_at||null
  };
}
