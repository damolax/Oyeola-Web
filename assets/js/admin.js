import { createClient, BetterAuthVanillaAdapter } from 'https://esm.sh/@neondatabase/neon-js?bundle';

const AUTH_URL='https://ep-falling-queen-b57vnxc4.neonauth.c-7.us-east-2.aws.neon.tech/author_scout_bot/auth';
const DATA_URL='https://ep-falling-queen-b57vnxc4.apirest.c-7.us-east-2.aws.neon.tech/oyeola_web/rest/v1';
const MEDIA_URL='https://br-super-moon-b5rfh8yp-oymedia.compute.c-7.us-east-2.aws.neon.tech';

const neon=createClient({
  auth:{adapter:BetterAuthVanillaAdapter(),url:AUTH_URL,allowAnonymous:true},
  dataApi:{url:DATA_URL}
});

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const authScreen=$('#auth-screen'), app=$('#admin-app'), loginForm=$('#login-form'), setupForm=$('#setup-form');
const authStatus=$('#auth-status'), contentView=$('#content-view'), dashView=$('#dashboard-view');
const itemList=$('#item-list'), editor=$('#item-editor'), emptyEditor=$('#empty-editor'), typeFields=$('#type-fields');
const state={view:'dashboard',items:[],current:null,setupClaimed:null};

const TYPE_LABELS={
  project:'Projects',review:'Reviews',service:'Services',tool:'Tools',skill:'Skills',
  demo:'Demos',credential:'Credentials',stat:'Homepage Stats',setting:'Settings'
};

function setStatus(el,msg,type=''){el.textContent=msg||'';el.className='status '+type}
function val(name){return editor.elements[name]?.value??''}
function checked(name){return !!editor.elements[name]?.checked}
function csv(value){return String(value||'').split(/[\n,]/).map(x=>x.trim()).filter(Boolean)}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function slugify(v=''){return String(v).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function dataOf(item){return item?.data&&typeof item.data==='object'?structuredClone(item.data):{}}
function responseError(res){return res?.error?.message||res?.error||res?.message||''}

async function setupStatus(){
  const {data,error}=await neon.rpc('cms_admin_setup_status');
  if(error) throw error;
  return !!(Array.isArray(data)?data[0]?.claimed:data?.claimed);
}
async function isAdmin(){
  const {data,error}=await neon.rpc('cms_admin_me');
  if(error) return false;
  const d=Array.isArray(data)?data[0]:data;
  return !!d?.ok;
}
async function boot(){
  try{
    state.setupClaimed=await setupStatus();
    const session=await neon.auth.getSession();
    const hasSession=!!(session?.data?.user||session?.user||session?.data?.session);
    if(hasSession && state.setupClaimed && await isAdmin()) return openApp();
    showAuth();
  }catch(e){
    console.error(e);showAuth();
    setStatus(authStatus,'Could not reach the CMS backend. Refresh and try again.','error');
  }
}
function showAuth(){
  authScreen.hidden=false;app.hidden=true;
  setupForm.hidden=!!state.setupClaimed;
  loginForm.hidden=!state.setupClaimed;
  $('#auth-title').textContent=state.setupClaimed?'Welcome back':'Set up Oyeola Admin';
  $('#auth-copy').textContent=state.setupClaimed
    ?'Sign in to manage the Oyeola website.'
    :'Create the one private admin account. You will need the one-time setup code.';
}
async function openApp(){
  authScreen.hidden=true;app.hidden=false;
  await loadDashboard();
}

setupForm.addEventListener('submit',async e=>{
  e.preventDefault();setStatus(authStatus,'Creating your account…');
  const password=$('#setup-password').value;
  if(password!==$('#setup-confirm').value) return setStatus(authStatus,'Passwords do not match.','error');
  try{
    const signup=await neon.auth.signUp.email({
      email:$('#setup-email').value.trim(),
      password,
      name:$('#setup-name').value.trim()||'Oyeola Admin'
    });
    if(signup?.error) throw new Error(responseError(signup));
    const claim=await neon.rpc('cms_claim_admin',{p_code:$('#setup-code').value.trim()});
    if(claim.error) throw claim.error;
    const c=Array.isArray(claim.data)?claim.data[0]:claim.data;
    if(!c?.ok) throw new Error(c?.error||'Could not claim admin access.');
    state.setupClaimed=true;
    setStatus(authStatus,'Admin account created.','success');
    await openApp();
  }catch(e){console.error(e);setStatus(authStatus,e.message||'Setup failed.','error')}
});

loginForm.addEventListener('submit',async e=>{
  e.preventDefault();setStatus(authStatus,'Signing in…');
  try{
    const res=await neon.auth.signIn.email({email:$('#login-email').value.trim(),password:$('#login-password').value});
    if(res?.error) throw new Error(responseError(res));
    if(!(await isAdmin())){await neon.auth.signOut();throw new Error('This account is not the Oyeola admin.')}
    setStatus(authStatus,'','');
    await openApp();
  }catch(e){console.error(e);setStatus(authStatus,e.message||'Sign-in failed.','error')}
});
$('#logout-btn').addEventListener('click',async()=>{await neon.auth.signOut();location.reload()});

async function loadDashboard(){
  state.view='dashboard';dashView.hidden=false;contentView.hidden=true;$('#new-item-btn').hidden=true;
  $('#view-eyebrow').textContent='Oyeola CMS';$('#view-title').textContent='Dashboard';
  $$('#admin-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view==='dashboard'));
  const {data,error}=await neon.rpc('cms_admin_dashboard');
  if(error){console.error(error);return}
  const d=Array.isArray(data)?data[0]:data;
  const counts=d?.counts||{};
  const metrics=[
    ['Projects',counts.project||0],['Reviews',counts.review||0],['Published',d?.published||0],['Drafts',d?.drafts||0],
    ['Services',counts.service||0],['Tools',counts.tool||0],['Demos',counts.demo||0],['Featured',d?.featured||0]
  ];
  $('#admin-metrics').innerHTML=metrics.map(([k,v])=>'<article class="metric-card"><strong>'+esc(v)+'</strong><span>'+esc(k)+'</span></article>').join('');
}

async function setView(view){
  if(view==='dashboard') return loadDashboard();
  state.view=view;dashView.hidden=true;contentView.hidden=false;$('#new-item-btn').hidden=false;
  $('#view-eyebrow').textContent='Content manager';$('#view-title').textContent=TYPE_LABELS[view]||view;
  $$('#admin-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  state.current=null;editor.hidden=true;emptyEditor.hidden=false;
  await loadItems();
}
$$('#admin-nav button').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$$('[data-quick]').forEach(b=>b.addEventListener('click',async()=>{await setView(b.dataset.quick);newItem()}));
$('#refresh-btn').addEventListener('click',()=>state.view==='dashboard'?loadDashboard():loadItems());
$('#new-item-btn').addEventListener('click',newItem);
$('#item-search').addEventListener('input',renderList);
$('#status-filter').addEventListener('change',renderList);

async function loadItems(){
  $('#save-state').textContent='Loading…';
  const {data,error}=await neon.rpc('cms_admin_list_items',{p_type:state.view});
  $('#save-state').textContent='';
  if(error){console.error(error);itemList.innerHTML='<p class="muted" style="padding:16px">Could not load content.</p>';return}
  state.items=Array.isArray(data)?data:[];
  renderList();
  if(state.current){
    const fresh=state.items.find(x=>x.id===state.current.id);
    if(fresh) openItem(fresh);
  }
}
function renderList(){
  const q=$('#item-search').value.toLowerCase(), status=$('#status-filter').value;
  const rows=state.items.filter(x=>(!q||(x.title+' '+x.slug).toLowerCase().includes(q))&&(!status||x.status===status));
  itemList.innerHTML=rows.length?rows.map(x=>`<button class="item-row ${state.current?.id===x.id?'active':''}" data-id="${x.id}"><strong>${esc(x.title||'(Untitled)')}</strong><span class="status-pill ${esc(x.status)}">${esc(x.status)}</span><small><span>/${esc(x.slug)}</span><span>${x.featured_home?'★ Home':''}</span></small></button>`).join(''):'<p class="muted" style="padding:16px">No items yet.</p>';
  $$('.item-row',itemList).forEach(b=>b.addEventListener('click',()=>openItem(state.items.find(x=>x.id===b.dataset.id))));
}
function newItem(){
  openItem({id:'',item_type:state.view,title:'',slug:'',status:'draft',featured_home:false,sort_order:(state.items.at(-1)?.sort_order||0)+1,data:{}});
}
function openItem(item){
  state.current=structuredClone(item);editor.hidden=false;emptyEditor.hidden=true;renderList();
  editor.elements.title.value=item.title||'';editor.elements.slug.value=item.slug||'';
  editor.elements.status.value=item.status||'draft';editor.elements.sort_order.value=item.sort_order||0;
  editor.elements.featured_home.checked=!!item.featured_home;
  $('#editor-type-label').textContent=(TYPE_LABELS[item.item_type]||item.item_type).replace(/s$/,'');
  $('#editor-heading').textContent=item.id?'Edit '+(item.title||'item'):'Add '+(TYPE_LABELS[item.item_type]||item.item_type).replace(/s$/,'');
  $('#advanced-json').value=JSON.stringify(dataOf(item),null,2);
  renderTypeFields();
  const preview=$('#preview-link');
  preview.hidden=true;
  if(item.item_type==='project'&&item.slug){preview.href='project.html?slug='+encodeURIComponent(item.slug);preview.hidden=false}
  if(item.item_type==='service'&&item.slug){
    const top=['websites','operations','digital-planners'].includes(item.slug)?item.slug+'.html':'services/'+item.slug+'.html';
    preview.href=top;preview.hidden=false;
  }
}

function field(label,name,value='',type='text',help=''){
  return `<label>${esc(label)}<input data-dfield="${esc(name)}" type="${type}" value="${esc(value??'')}">${help?'<span class="help">'+esc(help)+'</span>':''}</label>`;
}
function area(label,name,value='',help=''){
  return `<label>${esc(label)}<textarea data-dfield="${esc(name)}" rows="4">${esc(value??'')}</textarea>${help?'<span class="help">'+esc(help)+'</span>':''}</label>`;
}
function selectField(label,name,value,opts){
  return `<label>${esc(label)}<select data-dfield="${esc(name)}">${opts.map(o=>`<option value="${esc(o)}" ${String(o)===String(value)?'selected':''}>${esc(o)}</option>`).join('')}</select></label>`;
}
function boolField(label,name,value){
  return `<label class="check-row"><input data-dfield="${esc(name)}" type="checkbox" ${value?'checked':''}> ${esc(label)}</label>`;
}
function renderTypeFields(){
  const t=state.current.item_type,d=dataOf(state.current);
  let html='';
  if(t==='project'){
    html=`<div class="form-section"><h3>Project basics</h3><div class="form-grid two">
      ${field('Industry','industry',d.industry)}${field('Platform','platform',d.platform)}
      ${field('Year','year',d.year)}${field('Live website','live_url',d.live_url,'url')}
    </div>${area('Short summary','summary',d.summary)}
    <div class="form-grid two">${field('Service slugs','service_slugs',(d.service_slugs||[]).join(', '),'text','Example: websites, wix-website-design')}${field('Related demo slug','related_demo_slug',d.related_demo_slug)}</div></div>
    <div class="form-section"><h3>Project story</h3>
      ${area('Client goal','client_goal',d.client_goal)}${area('Challenge','challenge',d.challenge)}
      ${area('Solution / what I built','solution',d.solution)}${area('Full project story','story',d.story)}
      ${area('Branding contribution','branding_scope',d.branding_scope)}
      ${boolField('I designed the logo','logo_designed',d.logo_designed)}
    </div>
    <div class="form-section"><h3>Skills, tools & deliverables</h3><div class="form-grid two">
      ${field('Services provided','services_provided',(d.services_provided||[]).join(', '))}
      ${field('Skills used','skills',(d.skills||[]).join(', '))}
      ${field('Tools used','tools',(d.tools||[]).join(', '))}
      ${field('Project testimonial slug','testimonial_slug',d.testimonial_slug)}
    </div></div>
    <div class="form-section"><h3>Primary media</h3><div class="form-grid two">
      ${field('Thumbnail URL','thumbnail_url',d.thumbnail_url,'url')}
      ${field('Cover image URL','cover_url',d.cover_url,'url')}
      ${field('Full-page scroll image URL','full_page_url',d.full_page_url,'url')}
      ${field('Main video URL','video_url',d.video_url,'url')}
    </div>${mediaManager(d.media||[])}</div>`;
  }else if(t==='review'){
    html=`<div class="form-section"><h3>Review</h3>${area('Main quote','quote',d.quote)}
      ${area('Additional review text','body',d.body)}
      <div class="form-grid two">${field('Client / project label','client_label',d.client_label)}${field('Project slug','project_slug',d.project_slug)}
      ${field('Source','source',d.source||'Fiverr')}${field('Rating','rating',d.rating||5,'number')}</div></div>`;
  }else if(t==='service'){
    html=`<div class="form-section"><h3>Service presentation</h3>
      <div class="form-grid two">${field('Eyebrow','eyebrow',d.eyebrow)}${field('Completed count','completed_count',d.completed_count,'number')}
      ${field('Count suffix','count_suffix',d.count_suffix||'+')}${field('Count label','count_label',d.count_label)}</div>
      ${field('Headline','headline',d.headline)}${area('Introduction','intro',d.intro)}
      <div class="form-grid two">${field('Process steps','process',(d.process||[]).join(', '))}${field('Tool slugs','tools',(d.tools||[]).join(', '))}
      ${field('Demo slug','demo_slug',d.demo_slug)}${field('CTA label','cta_label',d.cta_label)}</div>
    </div>`;
  }else if(t==='tool'){
    html=`<div class="form-section"><h3>Tool</h3><div class="form-grid two">${field('Category','category',d.category)}${field('Website','website_url',d.website_url,'url')}
      ${field('Logo URL','logo_url',d.logo_url,'url')}${selectField('Logo style','style',d.style||'mono',['mono','green','original'])}</div></div>`;
  }else if(t==='skill'){
    html=`<div class="form-section"><h3>Skill</h3><div class="form-grid two">${field('Category','category',d.category)}${field('Years / level label','level',d.level)}</div>${area('Description','description',d.description)}</div>`;
  }else if(t==='demo'){
    html=`<div class="form-section"><h3>Demo</h3><div class="form-grid two">${field('Industry','industry',d.industry)}${selectField('Demo state','demo_status',d.status||'active',['active','coming-soon','hidden'])}</div>${area('Summary','summary',d.summary)}${field('Related project slugs','project_slugs',(d.project_slugs||[]).join(', '))}</div>`;
  }else if(t==='credential'){
    html=`<div class="form-section"><h3>Credential / education</h3><div class="form-grid two">${selectField('Type','type',d.type||'Course',['Education','Program','Scholarship','Certificate','Course'])}${field('Date label','date_label',d.date_label)}
      ${field('Logo URL','logo_url',d.logo_url,'url')}${field('Credential / school URL','credential_url',d.credential_url,'url')}</div>${area('Description','description',d.description)}</div>`;
  }else if(t==='stat'){
    html=`<div class="form-section"><h3>Homepage statistic</h3><div class="form-grid two">${field('Number','value',d.value,'number')}${field('Suffix','suffix',d.suffix||'+')}
      ${field('Label','label',d.label)}${field('Link','link_url',d.link_url)}</div></div>`;
  }else if(t==='setting'){
    html=`<div class="form-section"><h3>Global website settings</h3><div class="form-grid two">${field('Contact email','email',d.email,'email')}${field('LinkedIn URL','linkedin',d.linkedin,'url')}</div>
      ${field('Footer tagline','footer_tagline',d.footer_tagline)}${selectField('Default theme','theme_default',d.theme_default||'system',['system','dark','light'])}</div>`;
  }
  typeFields.innerHTML=html;
  bindMedia();
}
function mediaManager(media){
  return `<div class="media-upload" data-media-manager>
    <div class="media-upload-row"><label>Upload image, video or PDF<input type="file" data-media-file accept="image/*,video/*,application/pdf"></label><button type="button" class="secondary" data-media-upload>Upload</button></div>
    <div class="upload-progress"><span></span></div>
    <div class="media-list">${media.map((m,i)=>mediaRow(m,i)).join('')}</div>
  </div>`;
}
function mediaRow(m,i){
  const isImage=(m.type||'').startsWith('image');
  return `<div class="media-row" data-media-index="${i}">
    ${isImage?'<img class="media-thumb" src="'+esc(m.url)+'" alt="">':'<div class="media-thumb" style="display:grid;place-items:center">▶</div>'}
    <div class="media-meta"><strong>${esc(m.caption||m.url||'Media')}</strong><small>${esc(m.type||'file')}</small></div>
    <div class="media-actions"><button type="button" data-move="-1">↑</button><button type="button" data-move="1">↓</button><button type="button" data-remove>Remove</button></div>
  </div>`;
}
function bindMedia(){
  const mgr=$('[data-media-manager]',typeFields);if(!mgr)return;
  $('[data-media-upload]',mgr)?.addEventListener('click',async()=>{
    const file=$('[data-media-file]',mgr).files[0];if(!file)return;
    const button=$('[data-media-upload]',mgr),bar=$('.upload-progress',mgr),fill=$('.upload-progress span',mgr);
    button.disabled=true;button.textContent='Uploading…';bar.style.display='block';fill.style.width='35%';
    try{
      const token=await neon.auth.getJWTToken?.();
      if(!token) throw new Error('Your admin session expired. Sign in again.');
      const res=await fetch(MEDIA_URL+'/upload',{
        method:'POST',headers:{Authorization:'Bearer '+token,'x-file-name':file.name,'x-file-type':file.type||'application/octet-stream'},body:file
      });
      fill.style.width='85%';
      const out=await res.json().catch(()=>({}));
      if(!res.ok||!out.ok) throw new Error(out.error||'Upload failed.');
      const d=dataOf(state.current),arr=Array.isArray(d.media)?d.media:[];
      arr.push({url:out.url,type:file.type||'file',caption:file.name,key:out.key});
      d.media=arr;state.current.data=d;$('#advanced-json').value=JSON.stringify(d,null,2);renderTypeFields();fill.style.width='100%';
    }catch(e){alert(e.message||'Upload failed.')}
    finally{button.disabled=false;button.textContent='Upload'}
  });
  $$('.media-row',mgr).forEach(row=>{
    const idx=Number(row.dataset.mediaIndex);
    $('[data-remove]',row).addEventListener('click',()=>mutateMedia(idx,'remove'));
    $$('[data-move]',row).forEach(b=>b.addEventListener('click',()=>mutateMedia(idx,Number(b.dataset.move))));
  });
}
function mutateMedia(idx,action){
  const d=dataOf(state.current),arr=Array.isArray(d.media)?d.media:[];
  if(action==='remove')arr.splice(idx,1);else{
    const j=idx+action;if(j<0||j>=arr.length)return;[arr[idx],arr[j]]=[arr[j],arr[idx]];
  }
  d.media=arr;state.current.data=d;$('#advanced-json').value=JSON.stringify(d,null,2);renderTypeFields();
}
function readVisualData(){
  let d={};
  try{d=JSON.parse($('#advanced-json').value||'{}')}catch{}
  $$('[data-dfield]',typeFields).forEach(el=>{
    const key=el.dataset.dfield;
    if(el.type==='checkbox') d[key]=el.checked;
    else if(['service_slugs','services_provided','skills','tools','process','project_slugs'].includes(key)) d[key]=csv(el.value);
    else if(['completed_count','rating','value'].includes(key)) d[key]=el.value===''?null:Number(el.value);
    else d[key]=el.value;
  });
  // Preserve live media mutations.
  if(state.current?.data?.media) d.media=state.current.data.media;
  return d;
}

editor.addEventListener('submit',async e=>{
  e.preventDefault();if(!state.current)return;
  $('#save-state').textContent='Saving…';
  const item={
    id:state.current.id||null,item_type:state.current.item_type,title:val('title').trim(),
    slug:val('slug').trim()||slugify(val('title')),status:val('status'),
    featured_home:checked('featured_home'),sort_order:Number(val('sort_order')||0),data:readVisualData()
  };
  try{
    const {data,error}=await neon.rpc('cms_admin_save_item',{p_item:item});
    if(error) throw error;
    const saved=Array.isArray(data)?data[0]:data;
    state.current=saved;$('#save-state').textContent='Saved';
    await loadItems();setTimeout(()=>$('#save-state').textContent='',1800);
  }catch(e){console.error(e);$('#save-state').textContent='Save failed';alert(e.message||'Could not save.')}
});
$('#delete-item-btn').addEventListener('click',async()=>{
  if(!state.current?.id)return newItem();
  if(!confirm('Delete this item permanently?'))return;
  const {error}=await neon.rpc('cms_admin_delete_item',{p_id:state.current.id});
  if(error)return alert(error.message||'Delete failed.');
  state.current=null;editor.hidden=true;emptyEditor.hidden=false;await loadItems();
});

editor.elements.title.addEventListener('input',()=>{if(!state.current?.id&&!editor.elements.slug.value)editor.elements.slug.value=slugify(editor.elements.title.value)});

boot();