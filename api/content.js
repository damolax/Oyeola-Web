const TYPES=new Set(['project','review','service','tool','skill','credential','demo','stat','setting']);
export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const type=String(req.query.type||'').trim();
  if(type && !TYPES.has(type)) return res.status(400).json({error:'Invalid content type'});
  const url=process.env.SUPABASE_URL || 'https://pnuyufllwzultgrgpotz.supabase.co';
  const key=process.env.SUPABASE_PUBLISHABLE_KEY;
  if(!key) return res.status(503).json({error:'CMS is not configured'});
  let endpoint=url+'/rest/v1/cms_content?published=eq.true&select=*&order=sort_order.asc,created_at.desc';
  if(type) endpoint += '&content_type=eq.'+encodeURIComponent(type);
  const r=await fetch(endpoint,{headers:{apikey:key,Authorization:'Bearer '+key}});
  if(!r.ok) return res.status(502).json({error:'Could not load content'});
  const data=await r.json();
  res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=300');
  return res.status(200).json({items:data});
}
