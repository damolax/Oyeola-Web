import crypto from 'node:crypto';
import { getSql, authorizeAdmin } from './_neon.js';
function pgJson(res,code,obj){return res.status(code).json(obj)}

function apiError(e){return String(e?.message||'Google integration error').slice(0,350)}

function cookieVal(req,name){const part=String(req.headers?.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='));return part?decodeURIComponent(part.slice(name.length+1)):''}

function getKey(){const v=process.env.GOOGLE_OAUTH_ENCRYPTION_KEY;if(!v||v.length<32)throw Error('GOOGLE_OAUTH_ENCRYPTION_KEY must be at least 32 characters');return crypto.createHash('sha256').update(v).digest()}

function seal(value){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',getKey(),iv);const bytes=Buffer.concat([cipher.update(String(value),'utf8'),cipher.final()]);return [iv.toString('base64url'),cipher.getAuthTag().toString('base64url'),bytes.toString('base64url')].join('.')}

function unseal(value){const [iv,tag,bytes]=String(value).split('.');const cipher=crypto.createDecipheriv('aes-256-gcm',getKey(),Buffer.from(iv,'base64url'));cipher.setAuthTag(Buffer.from(tag,'base64url'));return Buffer.concat([cipher.update(Buffer.from(bytes,'base64url')),cipher.final()]).toString('utf8')}

function settings(){return ['GOOGLE_OAUTH_CLIENT_ID','GOOGLE_OAUTH_CLIENT_SECRET','GOOGLE_OAUTH_ENCRYPTION_KEY'].filter(k=>!process.env[k]||(k==='GOOGLE_OAUTH_ENCRYPTION_KEY'&&process.env[k].length<32))}

async function tables(sql){
 await sql`create table if not exists cms_google_connections (
   id smallint primary key default 1 check (id=1),
   account_email text,
   refresh_token_ciphertext text not null,
   gsc_property text,
   ga4_property text,
   ga4_measurement_id text,
   connected_at timestamptz not null default now(),
   updated_at timestamptz not null default now()
 )`;
 await sql`create table if not exists cms_google_oauth_states(
   token_hash text primary key,
   expires_at timestamptz not null
 )`;
 await sql`create table if not exists cms_google_analytics_cache(
   cache_key text primary key,
   payload jsonb not null,
   created_at timestamptz not null default now()
 )`;
}

async function refreshAccess(refresh){
 const body=new URLSearchParams({client_id:process.env.GOOGLE_OAUTH_CLIENT_ID,client_secret:process.env.GOOGLE_OAUTH_CLIENT_SECRET,refresh_token:refresh,grant_type:'refresh_token'});
 const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});const obj=await r.json().catch(()=>({}));
 if(!r.ok||!obj.access_token)throw Error('Google authorization expired or was revoked. Reconnect your Google account.');
 return obj.access_token
}

async function googleGet(access,url){
 const r=await fetch(url,{headers:{Authorization:'Bearer '+access}});const j=await r.json().catch(()=>({}));
 if(!r.ok)throw Error(j.error?.message||`Google API request failed (${r.status})`);
 return j
}

async function googlePost(access,url,data){
 const r=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+access,'Content-Type':'application/json'},body:JSON.stringify(data)});const j=await r.json().catch(()=>({}));
 if(!r.ok)throw Error(j.error?.message||`Google reporting failed (${r.status})`);
 return j
}

function allProperties(x){
 const gs=(x.gsc.siteEntry||[]).filter(p=>/^(siteOwner|siteFullUser|siteRestrictedUser)$/.test(p.permissionLevel||'')).map(p=>({value:p.siteUrl,label:p.siteUrl,access:p.permissionLevel}));
 const ga=(x.ga.accountSummaries||[]).flatMap(a=>(a.propertySummaries||[]).map(p=>({value:p.property,label:p.displayName||p.property,account:a.displayName||''})));
 return {gsc:gs,ga4:ga}
}

function pathFromUrl(u){
 try{const parsed=new URL(u,'https://www.oyeolaonline.com');return parsed.pathname.replace(/\/+$/,'')||'/'}catch{return''}
}

async function reportData(sql,conn,days){
 const token=await refreshAccess(unseal(conn.refresh_token_ciphertext));
 const end=new Date(Date.now()-48*3600*1000),start=new Date(end.getTime()-days*86400000);const iso=d=>d.toISOString().slice(0,10);
 let gsc=[],ga4=[],errors=[],gscUpdatedThrough=iso(end);
 if(conn.gsc_property){
  try{
   const u='https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(conn.gsc_property)+'/searchAnalytics/query';
   const data=await googlePost(token,u,{startDate:iso(start),endDate:iso(end),dimensions:['page'],rowLimit:25000,dimensionFilterGroups:[{filters:[{dimension:'page',operator:'contains',expression:'/blog/'}]}]});
   gsc=data.rows||[];
  }catch(e){errors.push({source:'gsc',message:apiError(e)})}
 }
 if(conn.ga4_property){
  try{
   const name=conn.ga4_property;
   const data=await googlePost(token,'https://analyticsdata.googleapis.com/v1beta/'+encodeURIComponent(name).replace('%2F','/')+':runReport',{
    dateRanges:[{startDate:days+'daysAgo',endDate:'yesterday'}],dimensions:[{name:'pagePath'}],
    metrics:[{name:'screenPageViews'},{name:'activeUsers'},{name:'userEngagementDuration'},{name:'sessions'}],
    dimensionFilter:{filter:{fieldName:'pagePath',stringFilter:{matchType:'BEGINS_WITH',value:'/blog/'}}},limit:10000
   });
   ga4=data.rows||[];
  }catch(e){errors.push({source:'ga4',message:apiError(e)})}
 }
 const published=await sql`select slug,title,created_at from cms_items where item_type='blog' and status='published' order by created_at desc`;
 const map=new Map(published.map(p=>['/blog/'+p.slug,{path:'/blog/'+p.slug,title:p.title,createdAt:p.created_at,impressions:0,clicks:0,positionNumerator:0,views:0,visitors:0,engagementSeconds:0,sessions:0}]));
 for(const row of gsc){const path=pathFromUrl(row.keys?.[0]);const o=map.get(path);if(!o)continue;const imp=Number(row.impressions)||0;o.impressions+=imp;o.clicks+=Number(row.clicks)||0;o.positionNumerator+=(Number(row.position)||0)*imp}
 for(const row of ga4){const path=pathFromUrl(row.dimensionValues?.[0]?.value||'');const o=map.get(path);if(!o)continue;const m=row.metricValues||[];o.views+=Number(m[0]?.value)||0;o.visitors+=Number(m[1]?.value)||0;o.engagementSeconds+=Number(m[2]?.value)||0;o.sessions+=Number(m[3]?.value)||0}
 const articles=[...map.values()].map(({positionNumerator,engagementSeconds,...o})=>({...o,ctr:o.impressions?o.clicks/o.impressions:0,avgPosition:o.impressions?positionNumerator/o.impressions:null,avgEngagementSeconds:o.visitors?engagementSeconds/o.visitors:0}));
 const totals=articles.reduce((r,p)=>(r.impressions+=p.impressions,r.clicks+=p.clicks,r.views+=p.views,r.visitors+=p.visitors,r.sessions+=p.sessions,r),{impressions:0,clicks:0,views:0,visitors:0,sessions:0});
 totals.ctr=totals.impressions?totals.clicks/totals.impressions:0;
 return {days,articles,totals,gscUpdatedThrough,errors,properties:{gsc:conn.gsc_property,ga4:conn.ga4_property},generatedAt:new Date().toISOString()};
}
export default async function handler(req,res){
 const action=String(req.query.action||'status');
 const pending=settings();
 res.setHeader('Cache-Control','private, no-store');
 if(action==='callback'){
  const gerr=String(req.query.error||'');
  const state=String(req.query.state||''),cookie=cookieVal(req,'__Host-oyeola_google_state');
  res.setHeader('Set-Cookie','__Host-oyeola_google_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  const redirect=(result)=>res.writeHead(303,{Location:'https://www.oyeolaonline.com/portal/analytics?connection='+encodeURIComponent(result)}).end();
  if(gerr)return redirect('denied');
  if(pending.length||!state||!cookie||state.length>150||state!==cookie)return redirect('invalid');
  try{
   const sql=getSql();await tables(sql);
   const stateRows=await sql`delete from cms_google_oauth_states where token_hash=${crypto.createHash('sha256').update(state).digest('hex')} and expires_at>now() returning token_hash`;
   if(!stateRows.length)return redirect('expired');
   const body=new URLSearchParams({code:String(req.query.code||''),client_id:process.env.GOOGLE_OAUTH_CLIENT_ID,client_secret:process.env.GOOGLE_OAUTH_CLIENT_SECRET,redirect_uri:'https://www.oyeolaonline.com/api/portal-google?action=callback',grant_type:'authorization_code'});
   const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});const tok=await tr.json().catch(()=>({}));
   if(!tr.ok||!tok.refresh_token)return redirect('no-refresh-token');
   const person=await googleGet(tok.access_token,'https://www.googleapis.com/oauth2/v2/userinfo');
   await sql`insert into cms_google_connections(id,account_email,refresh_token_ciphertext,gsc_property,ga4_property,ga4_measurement_id)
      values(1,${String(person.email||'')},${seal(tok.refresh_token)},null,null,null)
      on conflict(id) do update set account_email=excluded.account_email,refresh_token_ciphertext=excluded.refresh_token_ciphertext,
      gsc_property=null,ga4_property=null,ga4_measurement_id=null,updated_at=now()`;
   await sql`delete from cms_google_analytics_cache`;
   return redirect('connected');
  }catch(e){console.error('Google OAuth callback error',e?.name);return redirect('failed')}
 }
 if(pending.length)return pgJson(res,503,{error:'Google OAuth configuration is incomplete.',missing:pending});
 let sql;
 try{sql=getSql();await tables(sql)}catch(e){return pgJson(res,503,{error:'Neon database connection needs configuration.',missing:['DATABASE_URL or NEON_DATABASE_URL']})}
 const admin=await authorizeAdmin(req);
 if(!admin)return pgJson(res,401,{error:'Owner sign-in required'});
 const rows=await sql`select * from cms_google_connections where id=1 limit 1`,conn=rows[0];
 if(action==='status'&&req.method==='GET')return pgJson(res,200,{connected:!!conn,email:conn?.account_email||null,gscProperty:conn?.gsc_property||null,ga4Property:conn?.ga4_property||null,measurementId:conn?.ga4_measurement_id||null});
 if(action==='connect'&&req.method==='POST'){
  const state=crypto.randomBytes(30).toString('base64url');
  await sql`insert into cms_google_oauth_states(token_hash,expires_at) values(${crypto.createHash('sha256').update(state).digest('hex')},now()+interval '10 minutes')`;
  res.setHeader('Set-Cookie','__Host-oyeola_google_state='+state+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600');
  const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  const fields={client_id:process.env.GOOGLE_OAUTH_CLIENT_ID,redirect_uri:'https://www.oyeolaonline.com/api/portal-google?action=callback',response_type:'code',access_type:'offline',prompt:'consent',state,scope:'openid email https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly'};
  Object.entries(fields).forEach(([k,v])=>url.searchParams.set(k,v));
  return pgJson(res,200,{authorizationUrl:url.toString()});
 }
 if(!conn)return pgJson(res,409,{error:'Connect a Google account before requesting analytics.'});
 if(action==='disconnect'&&req.method==='POST'){try{await fetch('https://oauth2.googleapis.com/revoke',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({token:unseal(conn.refresh_token_ciphertext)})})}catch{}await sql`delete from cms_google_connections where id=1`;await sql`delete from cms_google_analytics_cache`;return pgJson(res,200,{ok:true})}
 try{
  const token=await refreshAccess(unseal(conn.refresh_token_ciphertext));
  if(action==='properties'&&req.method==='GET'){
   const [a,b]=await Promise.all([googleGet(token,'https://www.googleapis.com/webmasters/v3/sites'),googleGet(token,'https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200')]);
   return pgJson(res,200,allProperties({gsc:a,ga:b}));
  }
  if(action==='select'&&req.method==='POST'){
   const gsc=String(req.body?.gscProperty||''),ga4=String(req.body?.ga4Property||'');
   const [a,b]=await Promise.all([googleGet(token,'https://www.googleapis.com/webmasters/v3/sites'),googleGet(token,'https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200')]);
   const available=allProperties({gsc:a,ga:b});
   if(gsc&&!available.gsc.some(p=>p.value===gsc))return pgJson(res,400,{error:'Search Console property is not available to this Google account'});
   if(ga4&&!available.ga4.some(p=>p.value===ga4))return pgJson(res,400,{error:'GA4 property is not available to this Google account'});
   let measurement='';
   if(ga4){
     const d=await googleGet(token,'https://analyticsadmin.googleapis.com/v1beta/'+ga4+'/dataStreams?pageSize=200');
     const stream=(d.dataStreams||[]).find(s=>s.type==='WEB_DATA_STREAM'&&/oyeolaonline\.com/i.test(s.webStreamData?.defaultUri||''));
     measurement=stream?.webStreamData?.measurementId||'';
   }
   await sql`update cms_google_connections set gsc_property=${gsc||null},ga4_property=${ga4||null},ga4_measurement_id=${measurement||null},updated_at=now() where id=1`;
   await sql`delete from cms_google_analytics_cache`;
   return pgJson(res,200,{ok:true,measurementId:measurement||null});
  }
  if(action==='report'&&req.method==='GET'){
   const days=[7,28,90].includes(Number(req.query.days))?Number(req.query.days):28;
   const key=crypto.createHash('sha256').update(days+'|'+(conn.gsc_property||'')+'|'+(conn.ga4_property||'')).digest('hex');
   const cached=await sql`select payload from cms_google_analytics_cache where cache_key=${key} and created_at>now()-interval '30 minutes' limit 1`;
   if(cached.length)return pgJson(res,200,{...cached[0].payload,cached:true});
   const payload=await reportData(sql,conn,days);
   await sql`insert into cms_google_analytics_cache(cache_key,payload) values(${key},${JSON.stringify(payload)}::jsonb) on conflict(cache_key) do update set payload=excluded.payload,created_at=now()`;
   return pgJson(res,200,payload)
  }
  return pgJson(res,405,{error:'Unsupported action'});
 }catch(e){return pgJson(res,502,{error:apiError(e)})}
}
