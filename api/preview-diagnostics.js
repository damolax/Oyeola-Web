// Temporary preview-only diagnostic for Vercel function startup and Neon reachability.
// Never return credentials, environment values, raw SQL errors or account data.
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex, nofollow');
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  const result={function:'running',database:'unchecked'};
  try{
    const {getSql}=await import('./_neon.js');
    const sql=getSql();
    const rows=await sql`SELECT 1 AS ok`;
    result.database=rows?.[0]?.ok===1?'connected':'unavailable';
  }catch(e){
    console.error('Preview database health check failed',e);
    result.database='unavailable';
  }
  return res.status(result.database==='connected'?200:503).json(result);
}
