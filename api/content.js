const TYPES=new Set(['project','review','service','tool','skill','credential','demo','stat','setting']);
const DATA_API=process.env.NEON_DATA_API_URL || 'https://ep-falling-queen-b57vnxc4.apirest.c-7.us-east-2.aws.neon.tech/oyeola_web/rest/v1';

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const type=String(req.query.type||'').trim();
  if(type && !TYPES.has(type)) return res.status(400).json({error:'Invalid content type'});
  let endpoint=DATA_API+'/cms_public_items?select=*&order=sort_order.asc,updated_at.desc';
  if(type) endpoint+='&item_type=eq.'+encodeURIComponent(type);
  try{
    const r=await fetch(endpoint,{headers:{Accept:'application/json'}});
    if(!r.ok) return res.status(502).json({error:'Could not load Neon content'});
    const rows=await r.json();
    const items=rows.map(row=>({
      id:row.id,content_type:row.item_type,slug:row.slug,title:row.title,
      excerpt:row.data?.excerpt||'',data:row.data||{},published:true,
      featured_home:!!row.featured_home,sort_order:Number(row.sort_order)||0,updated_at:row.updated_at
    }));
    res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({items,backend:'neon'});
  }catch(error){
    console.error('Neon Data API read failed',error);
    return res.status(502).json({error:'Could not load Neon content'});
  }
}
