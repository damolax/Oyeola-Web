(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const TYPES={project:'Portfolio',review:'Reviews',service:'Services',tool:'Tools',skill:'Skills',credential:'Credentials',demo:'Demos',stat:'Homepage Stats',setting:'Settings',lead:'Leads'};
  let config=null,session=null,currentType=null,items=[];
  const stateKey='oyeola_admin_session';

  const fields={
    project:[
      ['service','Service','text'],['industry','Industry','text'],['platform','Platform','text'],['year','Year','text'],
      ['live_url','Live website URL','url'],['thumbnail_url','Thumbnail URL','url'],['hero_image_url','Hero image URL','url'],
      ['fullpage_image_url','Full-page screenshot URL','url'],['video_url','Video URL','url'],
      ['tools','Tools (comma separated)','text'],['skills','Skills (comma separated)','text'],
      ['goal','Client goal','textarea'],['challenge','Challenge','textarea'],['solution','What I built','textarea'],['result','Improved journey / result','textarea'],
      ['related_demo','Related demo slug','text'],['testimonial_slug','Testimonial slug','text'],['logo_designed','I designed the logo','checkbox'],['identity_designed','I designed branding','checkbox']
    ],
    review:[['rating','Rating','number'],['source','Source','text'],['project_slug','Project slug','text'],['service','Service','text'],['reviewer_label','Reviewer / buyer label','text'],['full_review','Full review','textarea']],
    service:[['hero_heading','Hero heading','text'],['hero_copy','Hero copy','textarea'],['completed_count','Projects completed count','number'],['process','Process steps (comma separated)','text'],['tools','Tool slugs/names (comma separated)','text'],['portfolio_filter','Portfolio filter','text'],['demo_slug','Demo slug','text'],['cta_label','CTA label','text']],
    tool:[['logo_url','Logo URL','url'],['category','Category','text'],['website_url','Website URL','url'],['monochrome','Use monochrome treatment','checkbox']],
    skill:[['category','Category','text']],
    credential:[['organization','Organization','text'],['date_label','Date / range','text'],['credential_url','Credential URL','url'],['logo_url','Logo URL','url'],['credential_type','Type','text']],
    demo:[['industry','Industry','text'],['service','Service','text'],['thumbnail_url','Thumbnail URL','url'],['launch_url','Launch URL','url'],['related_projects','Related project slugs (comma separated)','text']],
    stat:[['value','Number','number'],['suffix','Suffix','text'],['label','Label','text'],['href','Link','text']],
    setting:[['value','Value','text']],
    lead:[['name','Name','text'],['email','Email','email'],['service_type','Service type','text'],['business_url','Business URL','url'],['problem','Problem','textarea'],['desired_result','Desired result','textarea'],['timeline','Timeline','text'],['source_page','Source page','text']]
  };

  async function api(path,opts={}){
    const headers={'Content-Type':'application/json',...(opts.headers||{})};
    if(session?.access_token) headers.Authorization='Bearer '+session.access_token;
    const r=await fetch(path,{...opts,headers});
    const data=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(data.error?.message||data.error||'Request failed');
    return data;
  }

  async function loadConfig(){
    config=await api('/api/config');
    const status=await api('/api/admin-auth?action=status');
    config.setupRequired=!!status.setupRequired;
    config.adminEmail=status.adminEmail||'';
  }
  function saveSession(s){session=s;localStorage.setItem(stateKey,JSON.stringify(s));}
  function restoreSession(){try{session=JSON.parse(localStorage.getItem(stateKey)||'null')}catch{session=null}}
  function clearSession(){session=null;localStorage.removeItem(stateKey)}

  async function login(email,password){
    const data=await api('/api/admin-auth?action=login',{method:'POST',body:JSON.stringify({email,password})});
    saveSession(data); return data;
  }

  async function verify(){
    if(!session?.access_token) return false;
    try{
      const user=await api('/api/admin-auth?action=verify');
      $('#admin-user').textContent=user.email||'Admin'; return true;
    }catch{return false}
  }

  async function setupAdmin(setup_key,email,password){
    return api('/api/admin-auth?action=setup',{method:'POST',body:JSON.stringify({setup_key,email,password})});
  }

  function renderSetupForm(){
    const form=$('#login-form');
    form.innerHTML=`<label>One-time setup key<input id="setup-key" type="password" required autocomplete="off"></label><label>Admin email<input id="login-email" type="email" required autocomplete="email" value="${config.adminEmail||''}"></label><label>Create password<input id="login-password" type="password" required minlength="10" autocomplete="new-password"></label><button type="submit">Create admin login</button><p id="login-status"></p>`;
  }

  function showApp(ok){
    $('#login-view').hidden=ok; $('#app-view').hidden=!ok; $('#logout-btn').hidden=!ok;
    if(ok) showDashboard();
  }

  async function refreshAll(){
    const data=await api('/api/admin-content');
    items=data.items||[];
    renderDashboard();
    if(currentType) renderList();
  }

  function renderDashboard(){
    const count=t=>items.filter(i=>i.content_type===t).length;
    $('#count-project').textContent=count('project'); $('#count-review').textContent=count('review'); $('#count-service').textContent=count('service'); $('#count-tool').textContent=count('tool');
    $('#count-published').textContent=items.filter(i=>i.published).length; $('#count-featured').textContent=items.filter(i=>i.featured_home).length; if($('#count-lead')) $('#count-lead').textContent=count('lead');
  }

  function showDashboard(){
    currentType=null; $('#section-title').textContent='Dashboard'; $('#dashboard-view').hidden=false; $('#content-view').hidden=true; $('#new-item-btn').hidden=true;
    $$('#admin-nav button').forEach(b=>b.classList.toggle('active',b.dataset.section==='dashboard'));
  }

  function showType(type){
    currentType=type; $('#section-title').textContent=TYPES[type]||type; $('#dashboard-view').hidden=true; $('#content-view').hidden=false; $('#new-item-btn').hidden=type==='lead';
    $$('#admin-nav button').forEach(b=>b.classList.toggle('active',b.dataset.section===type)); renderList();
  }

  function renderList(){
    const q=$('#content-search').value.toLowerCase(), filter=$('#content-status-filter').value;
    let rows=items.filter(i=>i.content_type===currentType);
    if(q) rows=rows.filter(i=>(i.title+' '+i.slug+' '+(i.excerpt||'')).toLowerCase().includes(q));
    if(filter==='published') rows=rows.filter(i=>i.published); if(filter==='draft') rows=rows.filter(i=>!i.published); if(filter==='featured') rows=rows.filter(i=>i.featured_home);
    $('#content-list').innerHTML=rows.length?rows.map(i=>`<article class="content-card"><div><h3>${escapeHtml(i.title)}</h3><p>/${escapeHtml(i.slug)} · updated ${new Date(i.updated_at).toLocaleDateString()}</p><div class="status-row"><span class="badge ${i.published?'':'draft'}">${i.published?'Published':'Draft'}</span>${i.featured_home?'<span class="badge">Homepage</span>':''}</div></div><button data-edit="${i.id}">Edit</button></article>`).join(''):'<div class="empty">No items yet.</div>';
    $$('[data-edit]').forEach(b=>b.onclick=()=>openEditor(items.find(i=>i.id===b.dataset.edit)));
  }

  const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const slugify=s=>String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function buildDynamic(type,data={}){
    const wrap=$('#dynamic-fields'); wrap.innerHTML='';
    (fields[type]||[]).forEach(([key,label,kind])=>{
      const l=document.createElement('label'); if(kind==='textarea') l.classList.add('full'); l.textContent=label;
      let el;
      if(kind==='textarea'){el=document.createElement('textarea');el.rows=3}else if(kind==='checkbox'){el=document.createElement('input');el.type='checkbox';el.checked=!!data[key]}else{el=document.createElement('input');el.type=kind;el.value=data[key]??''}
      el.dataset.field=key; l.appendChild(el); wrap.appendChild(l);
    });
  }

  function openEditor(item=null,type=currentType){
    const t=item?.content_type||type; $('#editor-modal').hidden=false; $('#edit-id').value=item?.id||''; $('#edit-type').value=t; $('#editor-eyebrow').textContent=TYPES[t]||t; $('#editor-title').textContent=item?'Edit '+item.title:'Add '+(TYPES[t]||t);
    $('#edit-title').value=item?.title||''; $('#edit-slug').value=item?.slug||''; $('#edit-excerpt').value=item?.excerpt||''; $('#edit-order').value=item?.sort_order||0; $('#edit-published').checked=!!item?.published; $('#edit-featured').checked=!!item?.featured_home;
    buildDynamic(t,item?.data||{}); $('#edit-json').value=JSON.stringify(item?.data||{},null,2); $('#media-upload-box').style.display=t==='project'?'block':'none'; $('#delete-item-btn').hidden=!item; $('#editor-status').textContent='';
  }

  function collectData(){
    let data={}; try{data=JSON.parse($('#edit-json').value||'{}')}catch{throw new Error('Advanced JSON is invalid')}
    $$('[data-field]').forEach(el=>{
      let v=el.type==='checkbox'?el.checked:el.value.trim();
      if(el.type==='number'&&v!=='') v=Number(v);
      if(['tools','skills','process','related_projects'].includes(el.dataset.field)) v=String(v).split(',').map(x=>x.trim()).filter(Boolean);
      if(el.dataset.field==='goal'||el.dataset.field==='challenge'||el.dataset.field==='solution'||el.dataset.field==='result'){
        data.story=data.story||{}; data.story[el.dataset.field]=v; return;
      }
      if(el.dataset.field==='logo_designed'||el.dataset.field==='identity_designed'){
        data.branding=data.branding||{}; data.branding[el.dataset.field]=v; return;
      }
      data[el.dataset.field]=v;
    });
    return data;
  }

  async function uploadSelectedFile(){
    const file=$('#upload-file').files?.[0]; if(!file) throw new Error('Choose a file first');
    $('#upload-status').textContent='Preparing upload…';
    const reader=new FileReader();
    const data=await new Promise((resolve,reject)=>{reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)});
    $('#upload-status').textContent='Uploading…';
    const result=await api('/api/admin-upload',{method:'POST',body:JSON.stringify({name:file.name,type:file.type||'application/octet-stream',data,folder:'portfolio'})});
    const target=$('#upload-target').value;
    if(target==='gallery'){
      let j={}; try{j=JSON.parse($('#edit-json').value||'{}')}catch{}
      j.gallery=Array.isArray(j.gallery)?j.gallery:[];
      j.gallery.push({url:result.url,caption:file.name,type:'image'});
      $('#edit-json').value=JSON.stringify(j,null,2);
    }else{
      const input=$(`[data-field="${target}"]`);
      if(input) input.value=result.url;
      let j={}; try{j=JSON.parse($('#edit-json').value||'{}')}catch{}
      j[target]=result.url; $('#edit-json').value=JSON.stringify(j,null,2);
    }
    $('#upload-status').textContent='Uploaded';
  }

  async function saveEditor(e){
    e.preventDefault(); const id=$('#edit-id').value, type=$('#edit-type').value; const title=$('#edit-title').value.trim(); const slug=$('#edit-slug').value.trim()||slugify(title);
    $('#edit-slug').value=slug;
    const payload={id,content_type:type,title,slug,excerpt:$('#edit-excerpt').value.trim(),sort_order:Number($('#edit-order').value)||0,published:$('#edit-published').checked,featured_home:$('#edit-featured').checked,data:collectData()};
    $('#editor-status').textContent='Saving…';
    await api('/api/admin-content',{method:id?'PUT':'POST',body:JSON.stringify(payload)}); $('#editor-status').textContent='Saved'; await refreshAll(); setTimeout(()=>$('#editor-modal').hidden=true,250);
  }

  async function deleteItem(){
    const id=$('#edit-id').value;if(!id||!confirm('Delete this item permanently?')) return;
    await api('/api/admin-content?id='+encodeURIComponent(id),{method:'DELETE'}); $('#editor-modal').hidden=true; await refreshAll();
  }

  $('#login-form').addEventListener('submit',async e=>{
    e.preventDefault(); const status=$('#login-status'); status.textContent=config.setupRequired?'Creating admin login…':'Signing in…';
    try{
      if(config.setupRequired){
        await setupAdmin($('#setup-key').value,$('#login-email').value,$('#login-password').value);
        config.setupRequired=false; status.textContent='Admin login created. Signing in…';
      }
      await login($('#login-email').value,$('#login-password').value);
      const ok=await verify(); if(!ok) throw new Error('Could not verify admin session');
      showApp(true); await refreshAll();
    }catch(err){clearSession();status.textContent=err.message}
  });
  $('#logout-btn').onclick=async()=>{try{await api('/api/admin-auth?action=logout',{method:'POST'})}catch{} clearSession();location.reload()};
  $$('#admin-nav button').forEach(b=>b.onclick=()=>b.dataset.section==='dashboard'?showDashboard():showType(b.dataset.section));
  $$('[data-quick]').forEach(b=>b.onclick=()=>{showType(b.dataset.quick);openEditor(null,b.dataset.quick)});
  $('#new-item-btn').onclick=()=>openEditor();
  $('#editor-close').onclick=$('#cancel-item-btn').onclick=()=>$('#editor-modal').hidden=true;
  $('#editor-form').addEventListener('submit',e=>saveEditor(e).catch(err=>$('#editor-status').textContent=err.message));
  $('#delete-item-btn').onclick=()=>deleteItem().catch(err=>$('#editor-status').textContent=err.message);
  $('#upload-file-btn').addEventListener('click',()=>uploadSelectedFile().catch(err=>$('#upload-status').textContent=err.message));
  $('#edit-title').addEventListener('input',()=>{if(!$('#edit-id').value&&!$('#edit-slug').dataset.touched)$('#edit-slug').value=slugify($('#edit-title').value)});
  $('#edit-slug').addEventListener('input',()=>$('#edit-slug').dataset.touched='1');
  $('#content-search').addEventListener('input',renderList); $('#content-status-filter').addEventListener('change',renderList);

  (async()=>{try{
    await loadConfig(); restoreSession();
    if(config.setupRequired) renderSetupForm();
    const ok=await verify(); showApp(ok); if(ok) await refreshAll();
  }catch(err){$('#login-status').textContent=err.message}})();
})();