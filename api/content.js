import { getSql, mapItem } from './_neon.js';
const TYPES=new Set(['project','review','service','tool','skill','credential','demo','stat','setting']);

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
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
