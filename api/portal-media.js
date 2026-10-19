import {getSql,viewer,validOrigin,audit} from './_portal.js';

const MAX_BYTES=2*1024*1024;
const accepted=new Set(['image/png','image/jpeg','image/webp','image/gif']);
const isUuid=v=>/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v);
function matchesHeader(buf,mime){
  if(mime==='image/png')return buf.length>8&&buf.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'));
  if(mime==='image/jpeg')return buf.length>3&&buf[0]===255&&buf[1]===216&&buf[2]===255;
  if(mime==='image/webp')return buf.length>12&&buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP';
  if(mime==='image/gif')return buf.length>6&&['GIF87a','GIF89a'].includes(buf.toString('ascii',0,6));
  return false;
}
export default async function handler(req,res){
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Cache-Control','private, no-store');
  if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
  if(req.method==='POST'&&!validOrigin(req))return res.status(403).json({error:'Cross-origin upload refused'});
  let sql;
  try{sql=getSql()}catch{return res.status(503).json({error:'Publishing database is not connected.'})}
  try{
    if(req.method==='POST'){
      const user=await viewer(sql,req);
      if(!user)return res.status(401).json({error:'Sign in before uploading an image.'});
      const mime=String(req.body?.mime_type||'').trim();
      const data=String(req.body?.data_base64||'');
      const filename=String(req.body?.filename||'image').replace(/[<>/\\]/g,'').slice(0,140);
      if(!accepted.has(mime))return res.status(415).json({error:'Upload a PNG, JPEG, WebP or GIF image.'});
      if(data.length>Math.ceil(MAX_BYTES*4/3)+8||data.length<16||!/^[A-Za-z0-9+/]+={0,2}$/.test(data))return res.status(413).json({error:'Maximum image size is 2 MB.'});
      const file=Buffer.from(data,'base64');
      if(file.length>MAX_BYTES||!matchesHeader(file,mime))return res.status(400).json({error:'The image format is invalid or larger than 2 MB.'});
      const rows=await sql`INSERT INTO portal_media(uploader_id,filename,mime_type,data_base64,byte_length)
        VALUES(${user.id},${filename},${mime},${data},${file.length}) RETURNING id`;
      await audit(sql,user.id,'image_uploaded','media',rows[0].id,{filename,size:file.length});
      return res.status(201).json({url:'/api/portal-media?id='+rows[0].id,size:file.length,mime_type:mime});
    }
    const id=String(req.query?.id||'');
    if(!isUuid(id))return res.status(400).json({error:'Invalid image identifier'});
    const rows=await sql`SELECT * FROM portal_media WHERE id=${id} LIMIT 1`;
    if(!rows.length)return res.status(404).json({error:'Image not found'});
    const url='/api/portal-media?id='+id;
    const published=await sql`SELECT 1 FROM cms_items WHERE item_type='blog' AND status='published'
      AND (data->>'cover_url'=${url} OR EXISTS(
        SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(data->'blocks')='array' THEN data->'blocks' ELSE '[]'::jsonb END) block
        WHERE block->>'url'=${url})) LIMIT 1`;
    if(!published.length&&!await viewer(sql,req))return res.status(403).json({error:'This image is not public yet.'});
    res.setHeader('Content-Type',rows[0].mime_type);
    res.setHeader('Content-Disposition','inline; filename="editorial-image"');
    res.setHeader('Cache-Control',published.length?'public, max-age=600, s-maxage=600':'private, no-store');
    return res.status(200).end(Buffer.from(rows[0].data_base64,'base64'));
  }catch(error){
    console.error('Portal media error',error);
    return res.status(500).json({error:'Could not process this image.'});
  }
}
