(function ga4Tracking(){
 const consentKey='oyeola-analytics-consent';
 let measurement='';
 const $=s=>document.querySelector(s);
 const remember=v=>{try{localStorage.setItem(consentKey,v)}catch{}};
 const recalled=()=>{try{return localStorage.getItem(consentKey)}catch{return null}};
 const loadTag=()=>{
  if(!/^G-[A-Z0-9]{6,18}$/.test(measurement)||document.querySelector('[data-oyeola-gtag]'))return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments)};
  window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());window.gtag('config',measurement,{send_page_view:true});
  const script=document.createElement('script');script.async=true;script.dataset.oyeolaGtag='';script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(measurement);document.head.appendChild(script);
 };
 const dismiss=()=>{$('#oyeola-consent-banner')?.remove()};
 const choose=(value)=>{remember(value);dismiss();if(value==='granted')loadTag()};
 const showBanner=()=>{
  if($('#oyeola-consent-banner'))return;
  const host=document.createElement('section');host.id='oyeola-consent-banner';host.className='oy-consent-banner';host.setAttribute('role','dialog');host.setAttribute('aria-label','Optional analytics cookies');
  host.innerHTML='<div class="oy-consent-copy"><strong>Help us improve Oyeola Online</strong><p>May we use optional Google Analytics cookies to understand page visits and improve our content? You can say no. <a href="/privacy">Privacy details</a></p></div><div class="oy-consent-actions"><button type="button" data-deny>Not now</button><button type="button" data-allow>Allow analytics</button></div>';
  host.querySelector('[data-deny]').onclick=()=>choose('denied');
  host.querySelector('[data-allow]').onclick=()=>choose('granted');
  document.body.appendChild(host);
 };
 document.addEventListener('click',e=>{const link=e.target.closest('[data-cookie-preferences]');if(!link)return;e.preventDefault();showBanner()});
 fetch('/api/public-analytics-config',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(o=>{
  if(!o?.enabled||!/^G-[A-Z0-9]{6,18}$/.test(o.measurementId||''))return;
  measurement=o.measurementId;
  const choice=recalled();
  if(choice==='granted')loadTag();else if(choice!=='denied')showBanner();
 }).catch(()=>{});
})();
