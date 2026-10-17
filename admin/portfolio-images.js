(function portfolioImporter(){
 const projects=[
 ['arbequina-apartment','Arbéquina Apartment'],['local-legends-training','Local Legends Training'],['k-pet-supplies-and-more','K Pet Supplies & More'],['warranty-wizards-figma','Warranty Wizards'],['bambo-oladipo','Bambo Oladipo'],['bare-canvas-media','Bare Canvas Media'],['concierge-wellness','Concierge Wellness & Consulting'],['davinci-resolve-craftsman','DaVinci Resolve Craftsman'],['dr-akira','Dr. Akira'],['guestwork-property-management','Guestwork Property Management'],['latonya-speaks','Latonya Speaks'],['one-love-beauty','One Love Beauty'],['shop-ship-express-analytics','Shop & Ship Express Analytics'],['somatra-healing','Somatra Healing'],['three-nails-one-cross','3 Nails 1 Cross'],['vapourvend','VapourVend'],['zentravels','ZenTravels']];
 const $=q=>document.querySelector(q),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let session;try{session=JSON.parse(localStorage.getItem('oyeola_admin_session')||'null')}catch{}
 if(!session?.access_token){$('#original-upload-status').textContent='Please sign in at the Admin portal first.';$('#original-upload-button').disabled=true;return}
 const api=async(url,options={})=>{const res=await fetch(url,{...options,headers:{Authorization:'Bearer '+session.access_token,'Content-Type':'application/json',...options.headers}});const d=await res.json().catch(()=>({}));if(!res.ok)throw Error(d.error||'Request failed');return d};
 $('#original-project').innerHTML=projects.map(p=>'<option value="'+esc(p[0])+'">'+esc(p[1])+'</option>').join('');
 const filesEl=$('#original-file-input'),status=$('#original-upload-status'),button=$('#original-upload-button');
 const guessSlug=name=>{const x=name.toLowerCase();return projects.find(p=>x.includes(p[0])||x.includes(p[1].toLowerCase().replace(/[^a-z0-9]+/g,'-')))?.[0]||(x.includes('arbequina')?'arbequina-apartment':x.includes('local-legends')?'local-legends-training':x.includes('pet-supplies')||x.includes('come-back')?'k-pet-supplies-and-more':'')};
 filesEl.addEventListener('change',()=>{const files=[...filesEl.files];const guess=files.length?guessSlug(files[0].name):'';if(guess)$('#original-project').value=guess;const preview=$('#original-preview');preview.replaceChildren();files.forEach(f=>{const img=document.createElement('img');img.src=URL.createObjectURL(f);img.style.cssText='width:100%;height:160px;object-fit:contain;border:1px solid #34583a;border-radius:9px;background:#06120a';img.alt=f.name;img.onload=()=>URL.revokeObjectURL(img.src);preview.appendChild(img)});status.textContent=files.length+' unmodified original file(s) selected.'});
 const upload=async file=>{if(file.size>8*1024*1024)throw Error(file.name+' is over 8 MB');if(!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('Unsupported file: '+file.name);const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)});return (await api('/api/admin-upload',{method:'POST',body:JSON.stringify({name:file.name,type:file.type,data,folder:'portfolio/originals'})})).url};
 button.onclick=async()=>{
  const files=[...filesEl.files],slug=$('#original-project').value,project=projects.find(x=>x[0]===slug);if(!files.length)return status.textContent='Select at least one screenshot.';
  if(!confirm('Attach '+files.length+' ORIGINAL image(s) to '+project[1]+'? Existing screenshots will remain in the gallery.'))return;
  button.disabled=true;try{
   const existing=(await api('/api/admin-content?type=project')).items.find(x=>x.slug===slug);
   const urls=[];for(let i=0;i<files.length;i++){status.textContent='Uploading original '+(i+1)+' of '+files.length+' — '+files[i].name;urls.push(await upload(files[i]))}
   const data={...(existing?.data||{})},gallery=Array.isArray(data.gallery)?data.gallery.slice():[];
   urls.forEach((url,i)=>{if(!gallery.some(x=>x.url===url))gallery.push({url,caption:files[i].name,type:'image'})});data.gallery=gallery;
   if($('#original-featured').checked||!data.fullpage_image_url){data.hero_image_url=urls[0];data.fullpage_image_url=urls[0];data.thumbnail_url=urls[0];}
   data.case_study_url='/case-studies/'+slug;
   const payload={id:existing?.id,content_type:'project',title:existing?.title||project[1],slug,excerpt:existing?.excerpt||'Original project screenshots and case study.',published:true,featured_home:existing?.featured_home??true,sort_order:existing?.sort_order??0,data};
   await api('/api/admin-content',{method:existing?'PUT':'POST',body:JSON.stringify(payload)});
   status.textContent='Saved '+files.length+' original screenshot(s). The published portfolio updates automatically without a new deployment.';
  }catch(e){status.textContent='Upload not completed: '+e.message}finally{button.disabled=false}
 };
})();