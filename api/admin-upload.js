import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { authorizeAdmin } from './_neon.js';

function safeName(name='file'){return name.toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(-100)||'file'}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const session=await authorizeAdmin(req); if(!session) return res.status(401).json({error:'Unauthorized'});
  const accessKeyId=process.env.NEON_STORAGE_ACCESS_KEY_ID,secretAccessKey=process.env.NEON_STORAGE_SECRET_ACCESS_KEY;
  const endpoint=process.env.NEON_STORAGE_ENDPOINT||'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech';
  const bucket=process.env.NEON_STORAGE_BUCKET||'oyeola-media';
  if(!accessKeyId||!secretAccessKey) return res.status(503).json({error:'Neon Storage credentials are not configured on Vercel.'});
  const {name,type,data,folder='uploads'}=req.body||{}; if(!name||!type||!data) return res.status(400).json({error:'Missing file data'});
  const buffer=Buffer.from(String(data).replace(/^data:[^;]+;base64,/,''),'base64');
  if(buffer.length>8*1024*1024) return res.status(413).json({error:'File too large. Keep direct uploads under 8MB; use a video URL for large videos.'});
  const key=folder.replace(/[^a-z0-9/_-]+/gi,'-')+'/'+Date.now()+'-'+safeName(name);
  const s3=new S3Client({region:process.env.NEON_STORAGE_REGION||'us-east-2',endpoint,forcePathStyle:true,credentials:{accessKeyId,secretAccessKey}});
  await s3.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:buffer,ContentType:type}));
  return res.status(200).json({url:`${endpoint}/${bucket}/${key}`,path:key,backend:'neon'});
}
