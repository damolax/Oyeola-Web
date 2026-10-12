(()=>{
'use strict';
const BASE='/showroom/modu-atelier/';
const images={
  vale:'https://images.pexels.com/photos/12281854/pexels-photo-12281854.jpeg?auto=compress&cs=tinysrgb&w=1250',
  form:'https://images.pexels.com/photos/15867753/pexels-photo-15867753.jpeg?auto=compress&cs=tinysrgb&w=1250',
  noma:'https://images.pexels.com/photos/30650074/pexels-photo-30650074.jpeg?auto=compress&cs=tinysrgb&w=1250',
  mesa:'https://images.pexels.com/photos/13675292/pexels-photo-13675292.jpeg?auto=compress&cs=tinysrgb&w=1250',
  halo:'https://images.pexels.com/photos/37889620/pexels-photo-37889620.jpeg?auto=compress&cs=tinysrgb&w=1250',
  line:'https://images.pexels.com/photos/15867424/pexels-photo-15867424.jpeg?auto=compress&cs=tinysrgb&w=1250'
};
const products={
 vale:{name:'Vale Sofa',type:'Sofas',intro:'Quiet curves. Everyday comfort.',sizes:[170,190,210,230],depth:95,image:images.vale,category:'Sofas'},
 form:{name:'Forma Sectional',type:'Sectionals',intro:'A generous shape for living together.',sizes:[235,265,295,325],depth:160,image:images.form,category:'Sectionals'},
 noma:{name:'Noma Lounge',type:'Chairs',intro:'A softer place to land.',sizes:[75,85,95],depth:84,image:images.noma,category:'Chairs'},
 mesa:{name:'Mesa Console',type:'Tables',intro:'Simple surfaces. Beautiful details.',sizes:[110,130,150],depth:40,image:images.mesa,category:'Tables'},
 halo:{name:'Halo Armchair',type:'Chairs',intro:'An invitation to slow down.',sizes:[78,88,98],depth:90,image:images.halo,category:'Chairs'},
 line:{name:'Line Daybed',type:'Sofas',intro:'A different way to take your time.',sizes:[170,185,200],depth:83,image:images.line,category:'Sofas'}
};
const finishes=[
{name:'Oat Bouclé',color:'#DDD4C3'},
{name:'Sand Linen',color:'#BDA991'},
{name:'Warm Sienna',color:'#A46A51'},
{name:'Olive Woven',color:'#7D8871'},
{name:'Charcoal Weave',color:'#4C4A48'}
];
const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>Array.from(r.querySelectorAll(q));
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=(k,def)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??def}catch{return def}};
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const pUrl=id=>BASE+'piece-'+id+'.html';
const nameOf=id=>products[id]?.name||'Furniture piece';
const reading=()=>get('moduSaved',[]);
const selection=()=>{
const p=$('[data-piece]');if(!p)return null;const id=p.dataset.piece;
return{product:id,finish:$('[data-finish-name]')?.textContent||finishes[0].name,width:Number($('[data-width]')?.value)||products[id].sizes[0],leg:$('[data-leg]')?.value||'Light oak'};
};
const desc=s=>nameOf(s.product)+' · '+s.width+' cm · '+s.finish+' · '+s.leg+' feet';
function addSaved(s){
const saved=reading();const ref=JSON.stringify(s);
if(saved.some(x=>JSON.stringify(x)===ref))return false;
saved.unshift({...s,key:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)});
put('moduSaved',saved.slice(0,16));return true;
}
const toggle=$('[data-menu]'),nav=$('[data-nav]');
toggle?.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰'});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';toggle.focus()}});
const collection=$('[data-collection]');
if(collection){
let cat='all';
const cards=$$('[data-category]',collection),filterButtons=$$('[data-filter]'),search=$('[data-search]'),counter=$('[data-result-count]'),empty=$('[data-empty]');
const apply=()=>{const q=String(search?.value||'').trim().toLowerCase();let num=0;cards.forEach(card=>{const matches=(cat==='all'||card.dataset.category===cat)&&(!q||card.textContent.toLowerCase().includes(q));card.hidden=!matches;if(matches)num++});if(counter)counter.textContent=num+' '+(num===1?'piece':'pieces')+' to explore';if(empty)empty.hidden=num!==0};
filterButtons.forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.filter;filterButtons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));apply()}));search?.addEventListener('input',apply);apply();
}
const detail=$('[data-piece]');
if(detail){
const id=detail.dataset.piece,p=products[id],width=$('[data-width]'),finishName=$('[data-finish-name]'),finishButtons=$$('[data-swatch]'),selected=$('[data-selection-summary]'),status=$('[data-detail-status]');
const update=()=>{const s=selection();if(selected)selected.textContent=desc(s);const link=$('[data-design-inquiry]');if(link)link.href=BASE+'enquire.html?piece='+encodeURIComponent(id)+'&width='+s.width+'&finish='+encodeURIComponent(s.finish)+'&leg='+encodeURIComponent(s.leg)};
finishButtons.forEach(button=>button.addEventListener('click',()=>{finishButtons.forEach(x=>x.setAttribute('aria-pressed',String(x===button)));finishName.textContent=button.dataset.swatch;update()}));
width?.addEventListener('change',update);$('[data-leg]')?.addEventListener('change',update);update();
$('[data-save]')?.addEventListener('click',()=>{const added=addSaved(selection());status.textContent=added?'Saved to your shortlist.':'This design is already in your shortlist.'});
const fitButton=$('[data-fit-check]'),fitResult=$('[data-fit-result]');
fitButton?.addEventListener('click',()=>{const room=Number($('[data-room-width]')?.value),door=Number($('[data-door-width]')?.value),selectedWidth=Number(width?.value),depth=p.depth;
if(!(room>0&&door>0)){fitResult.hidden=false;fitResult.classList.add('warn');fitResult.textContent='Enter both room width and clear doorway width in centimetres.';return}
const roomGap=room-selectedWidth,doorGap=door-Math.min(depth,selectedWidth);
fitResult.hidden=false;fitResult.classList.toggle('warn',roomGap<60||doorGap<10);
fitResult.textContent=roomGap<60?'The selected width leaves less than 60 cm total free in the room. Review your room layout before ordering.':doorGap<10?'The doorway measurement looks tight compared with the piece’s approximate depth. Ask about packaging and delivery access before proceeding.':'The dimensions look worth exploring. You have '+roomGap+' cm of room width remaining. This is only a first comparison, not a delivery or fit guarantee; measure turns, stairs, halls and packaging too.';});
}
const swatchPicker=$('[data-swatch-picker]');
if(swatchPicker){
const selected=new Set(get('moduSwatches',[]));
$$('[data-swatch-select]',swatchPicker).forEach(btn=>{let name=btn.dataset.swatchSelect;btn.setAttribute('aria-pressed',String(selected.has(name)));btn.textContent=selected.has(name)?'Selected ✓':'Add to swatches';
btn.addEventListener('click',()=>{if(selected.has(name))selected.delete(name);else if(selected.size<4)selected.add(name);else{const err=$('[data-swatch-error]');err.textContent='Choose up to four finishes for one enquiry.';return}
btn.setAttribute('aria-pressed',String(selected.has(name)));btn.textContent=selected.has(name)?'Selected ✓':'Add to swatches';put('moduSwatches',[...selected]);const out=$('[data-swatch-count]');if(out)out.textContent=selected.size+' of 4 finishes selected';const err=$('[data-swatch-error]');if(err)err.textContent=''});
});
const n=$('[data-swatch-count]');if(n)n.textContent=selected.size+' of 4 finishes selected';$('[data-request-swatches]')?.addEventListener('click',()=>location.href=BASE+'enquire.html?request=swatches');
}
const savedPage=$('[data-saved]');
if(savedPage){
const render=()=>{const items=reading();savedPage.innerHTML=items.length?items.map(s=>'<article class="saved-item"><img src="'+products[s.product].image+'" alt="Illustrative interior photograph"><div><h3>'+escape(nameOf(s.product))+'</h3><p>'+escape(desc(s))+'</p><a class="btn small" href="'+pUrl(s.product)+'">Edit a piece ↗</a><button type="button" class="remove" data-remove="'+escape(s.key)+'">Remove</button></div></article>').join(''):'<div class="note"><strong>Your shortlist is empty.</strong>Explore the collection and save a design to see it here.</div>';$$('[data-remove]',savedPage).forEach(b=>b.addEventListener('click',()=>{put('moduSaved',reading().filter(s=>s.key!==b.dataset.remove));render()}));};render();
}
const form=$('[data-enquiry]');
if(form){
const summary=$('[data-brief-summary]'),status=$('[data-form-status]'),params=new URLSearchParams(location.search);
const choice=form.elements.namedItem('piece'),width=form.elements.namedItem('width'),finish=form.elements.namedItem('finish'),leg=form.elements.namedItem('leg');
if(products[params.get('piece')])choice.value=params.get('piece');
if(params.get('finish')&&finishes.some(x=>x.name===params.get('finish')))finish.value=params.get('finish');
if(params.get('leg')&&['Light oak','Dark walnut','Natural ash'].includes(params.get('leg')))leg.value=params.get('leg');
const changeWidths=()=>{const p=products[choice.value];const previous=String(width.value);width.innerHTML='<option value="">Not decided</option>'+(p?p.sizes.map(x=>'<option value="'+x+'">'+x+' cm</option>').join(''):'');if(p?.sizes.some(x=>String(x)===previous))width.value=previous;else if(p)width.value=String(p.sizes[0]);else width.value='';};
changeWidths();
if(params.get('width')&&products[choice.value]?.sizes.some(x=>String(x)===params.get('width')))width.value=params.get('width');
if(params.get('request')==='swatches')form.elements.namedItem('request_type').value='Finish sample enquiry';
const chosenSaved=reading(),choseSwatches=get('moduSwatches',[]);
if(chosenSaved.length&&choice.value==='') {choice.value=chosenSaved[0].product;changeWidths();width.value=String(chosenSaved[0].width);finish.value=chosenSaved[0].finish;leg.value=chosenSaved[0].leg;}
const read=()=>{const d=new FormData(form);return Object.fromEntries([...d.entries()].map(([k,v])=>[k,String(v).trim()]))};
const lines=s=>['MODU ATELIER | DESIGN ENQUIRY','Portfolio website concept','','Your name: '+(s.name||'Not provided'),'Email: '+(s.email||'Not provided'),'Location: '+(s.location||'Not given'),'Enquiry type: '+s.request_type,'Piece: '+(nameOf(s.piece)||'Undecided'),'Preferred width: '+(s.width?s.width+' cm':'Not decided'),'Finish: '+(s.finish||'Not decided'),'Feet: '+(s.leg||'Not decided'),'Selected finish samples: '+(choseSwatches.length?choseSwatches.join(', '):'None'),'Room details: '+(s.room||'Not supplied'),'Other details: '+(s.notes||'None'),'','This is an original Oyeola Online website concept. The enquiry reaches Oyeola Online rather than a physical furniture business. No quote, paid order or samples are automatically placed.'].join('\n');
const update=()=>{const s=read();if(!summary)return;summary.innerHTML=[['Interest',s.request_type],['Piece',s.piece?nameOf(s.piece):'Not decided'],['Width',s.width?s.width+' cm':'Not decided'],['Finish',s.finish||'Not decided'],['Samples',choseSwatches.length?choseSwatches.join(', '):'None']].map(([k,v])=>'<div><dt>'+escape(k)+'</dt><dd>'+escape(v)+'</dd></div>').join('');};
form.addEventListener('input',update);form.addEventListener('change',e=>{if(e.target===choice)changeWidths();update()});update();
$('[data-copy]')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(lines(read()));status.textContent='Design brief copied.'}catch{status.textContent='Copy is not supported in this browser; try the download option.'}});
$('[data-download]')?.addEventListener('click',()=>{const blob=new Blob([lines(read())],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='modu-furniture-design-brief.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);status.textContent='Design brief downloaded.'});
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const s=read();if(s.notes.length>1200){status.textContent='Please shorten your message to 1,200 characters.';return}status.textContent='Your email app should open. Press Send there to deliver the enquiry. This is not an order.';location.href='mailto:oyeolawebmaster@gmail.com?subject='+encodeURIComponent('Modu Atelier furniture concept enquiry: '+(s.piece?nameOf(s.piece):'General'))+'&body='+encodeURIComponent(lines(s));});
}
})();