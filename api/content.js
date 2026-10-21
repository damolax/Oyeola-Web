import { getSql, mapItem } from './_neon.js';
const TYPES=new Set(['project','review','service','tool','skill','credential','demo','stat','setting','blog']);

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  // Temporary no-secret production connectivity check; remove after verification.
  if(req.query.health==='1'){
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Robots-Tag','noindex, nofollow');
    const keys=['DATABASE_URL','NEON_DATABASE_URL','POSTGRES_URL_NON_POOLING','POSTGRES_PRISMA_URL'];
    const key=keys.find(k=>Boolean(process.env[k]))||null;
    const raw=key?String(process.env[key]):'';
    const startsPostgres=/^postgres(?:ql)?:\/\//i.test(raw);
    const hasWrappingQuotes=/^["']|["']$/.test(raw);
    const hasWhitespace=raw!==raw.trim();
    let parseable=false,neonHost=false;
    try{const u=new URL(raw);parseable=['postgres:','postgresql:'].includes(u.protocol)&&!!u.hostname&&!!u.username;neonHost=u.hostname.endsWith('.neon.tech')}catch{}
    try{
      const sql=getSql();
      const result=await sql`SELECT 1 AS ok`;
      return res.status(200).json({database:result?.[0]?.ok===1?'connected':'unexpected',selectedKey:key,startsPostgres,hasWrappingQuotes,hasWhitespace,parseable,neonHost});
    }catch(error){
      console.error('Content database diagnostic failed',error);
      return res.status(503).json({database:'failed',selectedKey:key,startsPostgres,hasWrappingQuotes,hasWhitespace,parseable,neonHost,errorClass:String(error?.constructor?.name||'Error').slice(0,50),errorCode:String(error?.code||'unknown').slice(0,40)});
    }
  }
  const type=String(req.query.type||'').trim();
  if(type && !TYPES.has(type)) return res.status(400).json({error:'Invalid content type'});
  try{
    const sql=getSql();
    const rows=type
      ? await sql`select * from cms_items where status='published' and item_type=${type} order by sort_order asc,updated_at desc`
      : await sql`select * from cms_items where status='published' order by item_type,sort_order asc,updated_at desc`;
    res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({items:rows.map(mapItem),backend:'neon'});
  }catch(error){
    console.error('Neon content read failed',error);
    return res.status(503).json({error:'Neon database is not configured on this deployment.'});
  }
}
