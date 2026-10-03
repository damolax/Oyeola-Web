export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  return res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || 'https://pnuyufllwzultgrgpotz.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
    adminEmail: process.env.OYEOLA_ADMIN_EMAIL || ''
  });
}
