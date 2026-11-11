(function portalAnalytics(){
 'use strict';
 const $=q=>document.querySelector(q);
 const safe=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const show=(id,visible)=>{$(id).hidden=!visible};
 const say=(message,type='info')=>{$('#analytics-notice').textContent=message;$('#analytics-notice').dataset.kind=type;show('#analytics-notice',!!message)};
 const format=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0});
 const percent=n=>(Number(n||0)*100).toFixed(1)+'%';
 let session=null,connection=null,properties=null,rows=[];
 try{session=JSON.parse(localStorage.getItem('oyeola_admin_session')||'null')}catch{}
 if(!session?.access_token){
  say('Please sign in with your existing Oyeola Admin account to view private analytics. Sign in at /admin/, then return to /portal.','warning');
  const box=$('#connection-settings');box.hidden=false;box.innerHTML='<a href="/admin/" class="primary sign-in-link">Sign in to Oyeola Admin ↗</a>';return;
 }
 const api=async(action,options={})=>{
  const {params,...reqOptions}=options;const url=new URL('/api/portal-google',location.origin);url.searchParams.set('action',action);Object.entries(params||{}).forEach(([k,v])=>url.searchParams.set(k,String(v)));
  const r=await fetch(url,{...reqOptions,headers:{Authorization:'Bearer '+session.access_token,'Content-Type':'application/json',...options.headers},cache:'no-store'});
  const json=await r.json().catch(()=>({}));
  if(!r.ok){const more=json.missing?.length?(' Missing: '+json.missing.join(', ')):'';throw Error((json.error||'Request failed')+more)}
  return json
 };
 const fill=(sel,items,value)=>{sel.replaceChildren(new Option('Not selected',''));(items||[]).forEach(p=>sel.add(new Option(p.label+(p.account?' · '+p.account:''),p.value)));sel.value=items?.some(p=>p.value===value)?value:''};
 async function loadStatus(){
  try{
   connection=await api('status');
   show('#connection-settings',true);show('#disconnect-google',connection.connected);
   $('#connect-google').textContent=connection.connected?'Reconnect Google account ↗':'Connect Google account ↗';
   $('#google-connected-email').textContent=connection.email?'Connected: '+connection.email:'No Google account connected';
   if(!connection.connected){say('Connect a Google account with access to the Search Console and GA4 properties for oyeolaonline.com. No analytics data has been retrieved yet.','warning');show('#analytics-report',false);return;}
   say('Google account connected. Select the website’s Search Console and GA4 properties to see reports.','info');
   await loadProperties();await loadReport();
  }catch(e){show('#connection-settings',true);show('#analytics-report',false);say(e.message,'warning')}
 }
 async function loadProperties(){
  try{
   properties=await api('properties');
   fill($('#gsc-property'),properties.gsc,connection.gscProperty);fill($('#ga4-property'),properties.ga4,connection.ga4Property);
   $('#save-google-properties').disabled=false;
   if(!properties.gsc.some(p=>/oyeolaonline\.com/i.test(p.value))){$('#gsc-source-status').textContent='Main domain not found. Add and verify oyeolaonline.com in Google Search Console.'}
   else $('#gsc-source-status').textContent='Select the verified oyeolaonline.com domain or URL-prefix property.';
   if(!properties.ga4.length)$('#ga4-source-status').textContent='No GA4 property found. Create one or grant this Google account at least Viewer access.';
   else $('#ga4-source-status').textContent=connection.measurementId?'Web stream: '+connection.measurementId:'Choose the GA4 property tracking this website.';
  }catch(e){say('Connected, but Google could not list properties: '+e.message,'warning')}
 }
 async function loadReport(force=false){
  if(!connection?.gscProperty&&!connection?.ga4Property){show('#analytics-report',false);return}
  show('#analytics-report',true);
  $('#article-rows').innerHTML='<tr><td colspan="8">Loading real Google analytics data…</td></tr>';
  $('#report-period').textContent='Last '+$('#date-range').value+' days';
  try{
   const data=await api('report',{params:{days:$('#date-range').value}});
   rows=data.articles||[];
   const hasGsc=!!data.properties?.gsc&&!data.errors?.some(x=>x.source==='gsc');
   const hasGa=!!data.properties?.ga4&&!data.errors?.some(x=>x.source==='ga4');
   $('#kpi-impressions').textContent=hasGsc?format(data.totals?.impressions):'—';
   $('#kpi-clicks').textContent=hasGsc?format(data.totals?.clicks):'—';
   $('#kpi-views').textContent=hasGa?format(data.totals?.views):'—';
   $('#kpi-visitors').textContent=hasGa?format(data.totals?.visitors):'—';
   $('#article-rows').dataset.hasGsc=String(hasGsc);$('#article-rows').dataset.hasGa=String(hasGa);
   renderRows();
   const updated=new Date(data.generatedAt);
   $('#report-freshness').textContent='Updated '+(isNaN(+updated)?'recently':updated.toLocaleString())+(data.gscUpdatedThrough?' · Search data through '+data.gscUpdatedThrough:'')+' · Google data is cached for up to 30 minutes.';
   if(data.errors?.length)say('Some Google reports could not be loaded: '+data.errors.map(e=>e.source.toUpperCase()+': '+e.message).join('; '),'warning');
   else say('Google analytics connected. Showing reported metrics for your published blog articles.','success');
  }catch(e){say('Unable to load Google analytics: '+e.message,'warning');$('#article-rows').innerHTML='<tr><td colspan="8">Reports are unavailable right now.</td></tr>'}
 }
 function renderRows(){
  const q=$('#article-filter').value.trim().toLowerCase(),items=rows.filter(p=>!q||p.title.toLowerCase().includes(q)).sort((a,b)=>b.impressions-a.impressions||b.views-a.views);
  const g=$('#article-rows').dataset.hasGsc==='true',a=$('#article-rows').dataset.hasGa==='true';
  $('#article-rows').innerHTML=items.length?items.map(p=>'<tr><td><a href="'+safe(p.path)+'" target="_blank" rel="noopener">'+safe(p.title)+'</a><span class="post-path">'+safe(p.path)+'</span></td><td>'+ (g?format(p.impressions):'—')+'</td><td>'+(g?format(p.clicks):'—')+'</td><td>'+(g?percent(p.ctr):'—')+'</td><td>'+(g&&p.avgPosition!=null?Number(p.avgPosition).toFixed(1):'—')+'</td><td>'+(a?format(p.views):'—')+'</td><td>'+(a?format(p.visitors):'—')+'</td><td>'+(a?Math.round(p.avgEngagementSeconds)+'s':'—')+'</td></tr>').join(''):'<tr><td colspan="8">No published blog articles match this search.</td></tr>';
 }
 $('#connect-google').onclick=async()=>{
  try{say('Preparing secure Google authorization…');const r=await api('connect',{method:'POST',body:'{}'});if(!r.authorizationUrl?.startsWith('https://accounts.google.com/'))throw Error('Google authorization URL is invalid');location.assign(r.authorizationUrl)}catch(e){say(e.message,'warning')}
 };
 $('#disconnect-google').onclick=async()=>{if(!confirm('Disconnect Google Search Console and GA4 from the Oyeola portal? Reports will stop updating until reconnected.'))return;try{await api('disconnect',{method:'POST',body:'{}'});connection=null;await loadStatus()}catch(e){say(e.message,'warning')}};
 $('#save-google-properties').onclick=async()=>{
  const gscProperty=$('#gsc-property').value,ga4Property=$('#ga4-property').value;
  if(gscProperty&&!/oyeolaonline\.com/i.test(gscProperty)&&!confirm('This Search Console property does not appear to be oyeolaonline.com. Continue anyway?'))return;
  try{say('Saving Google properties…');await api('select',{method:'POST',body:JSON.stringify({gscProperty,ga4Property})});connection.gscProperty=gscProperty;connection.ga4Property=ga4Property;await loadStatus()}catch(e){say(e.message,'warning')}
 };
 $('#date-range').onchange=()=>loadReport();$('#refresh-report').onclick=()=>loadReport(true);$('#article-filter').oninput=renderRows;
 const state=new URL(location.href).searchParams.get('connection');if(state){history.replaceState(null,'',location.pathname);if(state!=='connected')say('Google account connection was not completed ('+state+').','warning')}
 loadStatus();
})();
