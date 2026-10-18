import { getSql } from './_neon.js';
export default async function publicConfig(req,res){
 if(req.method!=='GET')return res.status(405).end();
 res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=1800');
 try{
  const sql=getSql(),r=await sql`select ga4_measurement_id from cms_google_connections where id=1 limit 1`;
  const id=String(r[0]?.ga4_measurement_id||'');
  return res.status(200).json({enabled:/^G-[A-Z0-9]{6,18}$/.test(id),measurementId:/^G-[A-Z0-9]{6,18}$/.test(id)?id:null});
 }catch{return res.status(200).json({enabled:false,measurementId:null})}
}
