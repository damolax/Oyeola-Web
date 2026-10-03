import { getSql, authorizeAdmin, mapItem } from './_neon.js';
const TYPES=new Set(['project','review','service','tool','skill','credential','demo','stat','setting','lead']);

export default async function handler(req,res){
  let sql;
  try{sql=getSql()}catch(e){return res.status(503).json({error:e.message})}
  const session=await authorizeAdmin(req); if(!session) return res.status(401).json({error:'Unauthorized'});

  if(req.method==='GET'){
    const type=String(req.query.type||'').trim();
    if(type && !TYPES.has(type)) return res.status(400).json({error:'Invalid type'});
    const rows=type
      ? await sql`select * from cms_items where item_type=${type} order by sort_order asc,updated_at desc`
      : await sql`select * from cms_items order by item_type,sort_order asc,updated_at desc`;
    return res.status(200).json({items:rows.map(mapItem),backend:'neon'});
  }

  if(req.method==='POST'){
    const b=req.body||{}; if(!TYPES.has(b.content_type)||!b.slug||!b.title) return res.status(400).json({error:'Type, slug and title are required'});
    const data={...(b.data&&typeof b.data==='object'?b.data:{}),excerpt:String(b.excerpt||'').trim()};
    const status=b.published?'published':'draft';
    try{
      const rows=await sql`insert into cms_items(item_type,slug,title,status,featured_home,sort_order,data) values(${b.content_type},${String(b.slug).trim()},${String(b.title).trim()},${status},${!!b.featured_home},${Number(b.sort_order)||0},${JSON.stringify(data)}::jsonb) returning *`;
      return res.status(200).json({item:mapItem(rows[0])});
    }catch(e){return res.status(409).json({error:e.message})}
  }

  if(req.method==='PUT'){
    const b=req.body||{}; if(!b.id) return res.status(400).json({error:'id required'});
    const data={...(b.data&&typeof b.data==='object'?b.data:{}),excerpt:String(b.excerpt||'').trim()};
    const status=b.published?'published':'draft';
    const rows=await sql`update cms_items set title=${String(b.title||'').trim()},slug=${String(b.slug||'').trim()},status=${status},featured_home=${!!b.featured_home},sort_order=${Number(b.sort_order)||0},data=${JSON.stringify(data)}::jsonb,updated_at=now() where id=${b.id}::uuid returning *`;
    if(!rows[0]) return res.status(404).json({error:'Item not found'});
    return res.status(200).json({item:mapItem(rows[0])});
  }

  if(req.method==='DELETE'){
    const id=String(req.query.id||''); if(!id) return res.status(400).json({error:'id required'});
    await sql`delete from cms_items where id=${id}::uuid`;
    return res.status(200).json({ok:true});
  }
  return res.status(405).json({error:'Method not allowed'});
}
