export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  return res.status(200).json({
    backend:'neon',
    dataApiUrl:process.env.NEON_DATA_API_URL || 'https://ep-falling-queen-b57vnxc4.apirest.c-7.us-east-2.aws.neon.tech/oyeola_web/rest/v1',
    storageEndpoint:process.env.NEON_STORAGE_ENDPOINT || 'https://br-super-moon-b5rfh8yp.storage.c-7.us-east-2.aws.neon.tech',
    storageBucket:process.env.NEON_STORAGE_BUCKET || 'oyeola-media'
  });
}
