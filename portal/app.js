(()=>{'use strict';
const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugify=s=>String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const statusNames={draft:'Draft',in_review:'In review',revision_requested:'Revision requested',approved:'Approved',published:'Published',rejected:'Rejected'};
const reviewRoles=['owner','admin','editor'];
const managementRoles=['owner','admin'];
let user=null,posts=[],members=[],editing=null,blocks=[],currentPage='overview',titleManuallyEdited=false;
function setMsg(s,bad=false,auth=false){const el=$(auth?'#auth-message':'#global-message');el.textContent=s||'';el.className='message'+(auth?'':' toast')+(bad?' bad':'');}
async function api(path,opt={}){
 const response=await fetch(path,{credentials:'same-origin',cache:'no-store',...opt,headers:{'Content-Type':'application/json',...opt.headers}});
 const result=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(result.error||'Request failed. Try again.');
 return result;
}
const json=data=>({method:'POST',body:JSON.stringify(data)});
const canReview=()=>reviewRoles.includes(user?.role);
const canManage=()=>managementRoles.includes(user?.role);
function loginView(){user=null;$('#studio').hidden=true;$('#auth-view').hidden=false;$('#auth-message').textContent='';}
function authView(u){
 user=u;$('#auth-view').hidden=true;$('#studio').hidden=false;
 $('#user-name').textContent=u.display_name;
 $('#user-role').textContent=u.role.charAt(0).toUpperCase()+u.role.slice(1);
 $('#user-initial').textContent=u.display_name.slice(0,1).toUpperCase();
 $('#welcome-heading').textContent='Welcome back, '+u.display_name.split(' ')[0]+'.';
 $$('[data-review-only]').forEach(e=>e.hidden=!canReview());
 $$('[data-owner-only]').forEach(e=>e.hidden=!canManage());
}
function page(which){
 currentPage=which;
 $$('.page').forEach(x=>x.hidden=x.id!==which+'-page');
 $$('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.page===which));
 const names={overview:'Overview',articles:'All articles',reviews:'Review queue',contributors:'Contributors',editor:editing?'Edit article':'New article'};
 $('#page-heading').textContent=names[which]||'Content Studio';
 setMsg('');
 if(which==='overview')renderOverview();
 if(which==='articles')renderArticles();
 if(which==='reviews')renderReviews();
 if(which==='contributors')refreshUsers().catch(e=>setMsg(e.message,true));
}
function chip(status){return '<span class="status status-'+esc(status)+'">'+(statusNames[status]||esc(status))+'</span>'}
function line(p){
 return `<div class="row"><div class="row-icon">✧</div><div class="row-title"><strong>${esc(p.title)}</strong><small>By ${esc(p.author_name||user.display_name)} · ${esc(p.slug)} · Updated ${esc(new Date(p.updated_at).toLocaleDateString())}</small></div>${chip(p.status)}<button type="button" class="text-button" data-open="${esc(p.id)}">Open ↗</button></div>`;
}
function empty(label){return '<div class="empty"><span>✳</span><h3>'+esc(label)+'</h3><p>When there is something to show here, you will find it in this space.</p></div>'}
function renderOverview(){
 $('#stat-total').textContent=posts.length;
 $('#stat-draft').textContent=posts.filter(x=>['draft','revision_requested'].includes(x.status)).length;
 $('#stat-review').textContent=posts.filter(x=>x.status==='in_review').length;
 $('#stat-published').textContent=posts.filter(x=>x.status==='published').length;
 $('#recent-articles').innerHTML=posts.length?posts.slice(0,6).map(line).join(''):empty('Nothing published or drafted yet');
}
function renderArticles(){
 const q=$('#article-search').value.trim().toLowerCase(),s=$('#article-status').value;
 const selected=posts.filter(p=>(s==='all'||p.status===s)&&
   (p.title+' '+p.author_name+' '+p.slug).toLowerCase().includes(q));
 $('#article-list').innerHTML=selected.length?selected.map(line).join(''):empty('No articles match your filters');
}
function renderReviews(){
 if(!canReview())return page('overview');
 const q=posts.filter(p=>p.status==='in_review');
 $('#review-list').innerHTML=q.length?q.map(line).join(''):empty('Your review queue is clear');
}
async function refreshPosts(){
 const result=await api('/api/portal-posts?action=list');
 posts=result.posts||[];
 renderOverview();if(currentPage==='articles')renderArticles();if(currentPage==='reviews')renderReviews();
}
async function refreshUsers(){
 if(!canManage())return;
 const result=await api('/api/portal-users');members=result.users||[];
 const roles=user.role==='owner'?['contributor','author','editor','admin']:['contributor','author','editor'];
 const statuses=['pending','active','suspended','rejected'];
 const editable=members.filter(m=>m.role!=='owner'&&m.id!==user.id&&!(user.role==='admin'&&m.role==='admin'));
 $('#contributor-list').innerHTML=members.length?members.map(m=>{
   const canEdit=editable.some(x=>x.id===m.id);
   return `<div class="member-row"><div class="avatar">${esc(m.display_name.slice(0,1).toUpperCase())}</div><div class="member-name"><strong>${esc(m.display_name)}</strong><small>${esc(m.email)} · Joined ${esc(new Date(m.created_at).toLocaleDateString())}</small></div>
    ${canEdit?`<select aria-label="Role for ${esc(m.display_name)}" data-role="${esc(m.id)}">${roles.map(r=>'<option value="'+r+'"'+(r===m.role?' selected':'')+'>'+r+'</option>').join('')}</select><select aria-label="Account status for ${esc(m.display_name)}" data-status="${esc(m.id)}">${statuses.map(s=>'<option value="'+s+'"'+(s===m.account_status?' selected':'')+'>'+s+'</option>').join('')}</select><button class="outline" data-save-member="${esc(m.id)}">Save</button>`: '<span class="status">'+esc(m.role)+' · '+esc(m.account_status)+'</span>'}</div>`;
 }).join(''):empty('No team applications yet');
}
function makeBlock(type){return {type,text:'',level:2,items:[],ordered:false,url:'',alt:'',caption:''}}
function renderBlocks(){
 $('#block-list').innerHTML=blocks.map((b,i)=>{
   let field='';
   if(b.type==='divider')field='<div class="rule-demo"></div>';
   else if(b.type==='list')field=`<label>Items, one per line<textarea rows="5" data-field="items" data-i="${i}">${esc((b.items||[]).join('\n'))}</textarea></label><label class="inline"><input type="checkbox" data-field="ordered" data-i="${i}" ${b.ordered?'checked':''}> Numbered list</label>`;
   else if(b.type==='image')field=`<label>Image HTTPS URL<input data-field="url" data-i="${i}" type="url" value="${esc(b.url||'')}" placeholder="https://..."></label><label>Alternative text<input data-field="alt" data-i="${i}" value="${esc(b.alt||'')}"></label><label>Caption<input data-field="caption" data-i="${i}" value="${esc(b.caption||'')}"></label>`;
   else field=`<label>${b.type==='heading'?'Heading text':b.type==='quote'?'Pull quote':'Paragraph'}<textarea data-field="text" data-i="${i}" rows="${b.type==='paragraph'?6:3}" placeholder="Start writing...">${esc(b.text||'')}</textarea></label>`+
       (b.type==='heading'? `<label class="short-label">Heading size<select data-field="level" data-i="${i}"><option value="2" ${b.level===2?'selected':''}>H2</option><option value="3" ${b.level===3?'selected':''}>H3</option><option value="4" ${b.level===4?'selected':''}>H4</option></select></label>`:'');
   return `<div class="story-block"><div class="story-block-heading"><span>${String(i+1).padStart(2,'0')} · ${esc(b.type)}</span><button class="text-button" type="button" data-remove-block="${i}">Remove ×</button></div>${field}</div>`;
 }).join('')||'<p class="muted">Add a paragraph or another story block to start.</p>';
}
function openPost(p=null){
 editing=p||null;
 titleManuallyEdited=!!p;
 blocks=Array.isArray(p?.content?.blocks)?structuredClone(p.content.blocks):[makeBlock('paragraph')];
 $('#post-title').value=p?.title||'';
 $('#post-slug').value=p?.slug||'';
 $('#post-excerpt').value=p?.excerpt||'';
 $('#post-category').value=p?.content?.category||'';
 $('#post-tags').value=(p?.content?.tags||[]).join(', ');
 $('#post-cover').value=p?.content?.cover_url||'';
 $('#post-cover-alt').value=p?.content?.cover_alt||'';
 $('#post-seo-title').value=p?.content?.seo_title||'';
 $('#post-seo-description').value=p?.content?.seo_description||'';
 $('#editor-state').textContent=statusNames[p?.status]||'New draft';
 const locked=!!p&&!['draft','revision_requested','rejected'].includes(p.status);
 $$('#editor-form input, #editor-form textarea, #editor-form select').forEach(x=>x.disabled=locked);
 $('#save-draft').hidden=locked;
 $('#submit-review').hidden=locked;
 $('#add-block').disabled=locked;
 $('#block-type').disabled=locked;
 $('#publish-article').hidden=!(canReview()&&p?.status==='approved');
 $('#review-notice').hidden=!p?.review_message;
 $('#review-notice').textContent=p?.review_message||'';
 renderBlocks();
 $$('#editor-form [data-remove-block]').forEach(b=>b.hidden=locked);
 const old=$('#editor-review-actions');if(old)old.remove();
 if(canReview()&&p?.status==='in_review'){
  const el=document.createElement('div');el.id='editor-review-actions';el.className='review-actions';
  el.innerHTML='<button type="button" class="primary" data-review-decision="approved">Approve ✓</button><button type="button" class="outline" data-review-decision="revision_requested">Request changes</button><button type="button" class="danger" data-review-decision="rejected">Reject</button>';
  $('.editor-toolbar').append(el);
 }
 page('editor');
}
function collectPost(){
 const content={
   blocks:blocks.map(b=>({...b})),
   tags:$('#post-tags').value.split(',').map(x=>x.trim()).filter(Boolean),
   category:$('#post-category').value,cover_url:$('#post-cover').value.trim(),
   cover_alt:$('#post-cover-alt').value,seo_title:$('#post-seo-title').value,
   seo_description:$('#post-seo-description').value
 };
 return {id:editing?.id||undefined,title:$('#post-title').value.trim(),
   slug:$('#post-slug').value.trim(),excerpt:$('#post-excerpt').value.trim(),content};
}
async function savePost(){
 if(!$('#editor-form').reportValidity())throw Error('Please complete the required article fields.');
 const result=await api('/api/portal-posts?action=save',json(collectPost()));
 editing=result.post;await refreshPosts();return result.post;
}
async function submitPost(){
 if(!editing||editing.status==='draft') await savePost();
 const result=await api('/api/portal-posts?action=submit',json({id:editing.id}));
 setMsg('Article submitted to the editorial queue.');
 await refreshPosts();openPost(result.post);
}
async function reviewPost(decision){
 if(!editing)return;
 let message='';
 if(decision!=='approved'){
   message=window.prompt(decision==='rejected'?'Explain why this article was rejected:':'What should the writer revise?','')||'';
   if(message.length<10){setMsg('Give the author at least 10 characters of actionable feedback.',true);return}
 }
 const result=await api('/api/portal-posts?action=review',json({id:editing.id,decision,message}));
 await refreshPosts();openPost(result.post);setMsg('Editorial decision saved.');
}
async function publishPost(){
 if(!editing||!confirm('Publish this approved article to the public Oyeola Online journal?'))return;
 const result=await api('/api/portal-posts?action=publish',json({id:editing.id}));
 await refreshPosts();openPost(result.post);setMsg('Published! Public URL: '+result.url);
}
async function userSave(id){
 const role=$('[data-role="'+id+'"]').value,status=$('[data-status="'+id+'"]').value;
 await api('/api/portal-users',json({id,role,account_status:status}));
 setMsg('Contributor permissions updated.');await refreshUsers();
}
document.addEventListener('click',async ev=>{
 const t=ev.target.closest('button');if(!t)return;
 try {
 if(t.dataset.authTab){
  const reg=t.dataset.authTab==='register';
  $('#login-form').hidden=reg;$('#register-form').hidden=!reg;
  $$('[data-auth-tab]').forEach(x=>x.classList.toggle('active',x===t));setMsg('',false,true);
 }else if(t.dataset.page&&t.dataset.page!=='editor')page(t.dataset.page);
 else if(t.dataset.open){const p=posts.find(x=>x.id===t.dataset.open);if(p)openPost(p)}
 else if(t.id==='new-article'||t.id==='welcome-create')openPost();
 else if(t.id==='back-to-articles')page('articles');
 else if(t.id==='add-block'){blocks.push(makeBlock($('#block-type').value));renderBlocks()}
 else if(t.dataset.removeBlock){blocks.splice(Number(t.dataset.removeBlock),1);renderBlocks()}
 else if(t.id==='submit-review')await submitPost();
 else if(t.id==='publish-article')await publishPost();
 else if(t.dataset.reviewDecision)await reviewPost(t.dataset.reviewDecision);
 else if(t.dataset.saveMember)await userSave(t.dataset.saveMember);
 else if(t.id==='sign-out'){
  await api('/api/portal-auth?action=logout',json({}));loginView();
 }
 }catch(e){setMsg(e.message,true)}
});
$('#block-list').addEventListener('input',e=>{
 const el=e.target,i=Number(el.dataset.i),field=el.dataset.field;
 if(!field||!blocks[i])return;
 blocks[i][field]=field==='items'?el.value.split('\n'):field==='level'?Number(el.value):field==='ordered'?el.checked:el.value;
});
$('#block-list').addEventListener('change',e=>{
 const el=e.target,i=Number(el.dataset.i);
 if(el.dataset.field&&blocks[i])blocks[i][el.dataset.field]=el.dataset.field==='ordered'?el.checked:el.dataset.field==='level'?Number(el.value):el.value;
});
$('#post-title').addEventListener('input',e=>{
 if(!editing&&!titleManuallyEdited)$('#post-slug').value=slugify(e.target.value);
});
$('#post-slug').addEventListener('input',()=>{titleManuallyEdited=true});
$('#article-search').addEventListener('input',renderArticles);
$('#article-status').addEventListener('change',renderArticles);
$('#editor-form').addEventListener('submit',async e=>{
 e.preventDefault();try{const p=await savePost();openPost(p);setMsg('Draft saved.')}catch(e){setMsg(e.message,true)}
});
$('#login-form').addEventListener('submit',async e=>{
 e.preventDefault();
 const form=new FormData(e.target);
 try{
  const out=await api('/api/portal-auth?action=login',json({email:form.get('email'),password:form.get('password')}));
  authView(out.user);e.target.reset();await refreshPosts();page('overview');
 }catch(e){setMsg(e.message,true,true)}
});
$('#register-form').addEventListener('submit',async e=>{
 e.preventDefault();
 const form=new FormData(e.target);
 try{
  const out=await api('/api/portal-auth?action=register',json({email:form.get('email'),display_name:form.get('display_name'),password:form.get('password')}));
  e.target.reset();setMsg(out.message,false,true);
 }catch(e){setMsg(e.message,true,true)}
});
(async function boot(){
 try{
  const result=await api('/api/portal-auth?action=status');
  if(!result.user){loginView();return}
  authView(result.user);await refreshPosts();page('overview');
 }catch(e){loginView();setMsg(e.message,true,true)}
})();
})();