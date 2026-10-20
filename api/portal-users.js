import {getSql,viewer,canManage,validOrigin,roles,safeUser,audit} from './_portal.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');
 if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
 if(req.method==='POST'&&!validOrigin(req))return res.status(403).json({error:'Cross-origin action refused'});
 let sql;try{sql=getSql()}catch{return res.status(503).json({error:'Publishing database not connected.'})}
 try{
  const user=await viewer(sql,req);
  if(!user)return res.status(401).json({error:'Please sign in.'});
  if(!canManage(user))return res.status(403).json({error:'Only administrators can manage contributors.'});
  if(req.method==='GET'){
   const rows=await sql`SELECT id,email,display_name,role,account_status,bio,created_at FROM portal_users ORDER BY CASE account_status WHEN 'pending' THEN 0 ELSE 1 END,created_at DESC LIMIT 400`;
   return res.status(200).json({users:rows.map(u=>({...safeUser(u),created_at:u.created_at}))});
  }
  const b=req.body||{}, id=String(b.id||''), role=String(b.role||''),
    status=String(b.account_status||'');
  if(!roles.includes(role)||!['pending','active','suspended','rejected'].includes(status))
   return res.status(400).json({error:'Invalid role or account status.'});
  const found=await sql`SELECT * FROM portal_users WHERE id=${id} LIMIT 1`;
  if(!found.length)return res.status(404).json({error:'User not found.'});
  const target=found[0];
  if(String(target.id)===String(user.id))return res.status(403).json({error:'You cannot change your own account permissions here.'});
  if(target.role==='owner'||role==='owner')return res.status(403).json({error:'Owner permissions cannot be transferred here.'});
  if(user.role==='admin'&&(target.role==='admin'||role==='admin'))
   return res.status(403).json({error:'Only the owner can manage administrators.'});
  const rows=await sql`UPDATE portal_users SET role=${role},account_status=${status},updated_at=now() WHERE id=${id} RETURNING *`;
  if(status!=='active')await sql`DELETE FROM portal_sessions WHERE user_id=${id}`;
  await audit(sql,user.id,'user_status_changed','user',id,{from:target.account_status,to:status,role});
  return res.status(200).json({user:safeUser(rows[0])});
 }catch(e){console.error('Editorial user management error',e);return res.status(500).json({error:'Unable to update contributor.'})}
}
