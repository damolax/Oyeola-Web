export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  return res.status(200).json({
    backend:'neon',
    databaseConfigured:!!(process.env.DATABASE_URL||process.env.NEON_DATABASE_URL),
    storageConfigured:!!(process.env.NEON_STORAGE_ACCESS_KEY_ID&&process.env.NEON_STORAGE_SECRET_ACCESS_KEY),
    storageEndpoint:process.env.NEON_STORAGE_ENDPOINT || 'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech',
    storageBucket:process.env.NEON_STORAGE_BUCKET || 'oyeola-media'
  });
}
