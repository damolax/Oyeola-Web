import { getSql } from './_neon.js';
import sanitizeHtml from 'sanitize-html';
function esc(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}

function safeUrl(v){try{const u=new URL(String(v||''),'https://oyeolaonline.com');return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return''}}

function rich(v){return sanitizeHtml(String(v||''),{allowedTags:['strong','b','em','i','u','s','a','br','code'],allowedAttributes:{a:['href','title']},allowedSchemes:['https','http','mailto'],transformTags:{a:(tag,attrs)=>({tagName:'a',attribs:{...attrs,rel:'nofollow noopener noreferrer'}})}})}

function readTime(blocks){const txt=(blocks||[]).map(b=>[b.text,b.caption,...(b.items||[]),...(b.rows||[]).flat()].filter(x=>typeof x==='string').map(x=>x.replace(/<[^>]*>/g,' ')).join(' ')).join(' ');return Math.max(1,Math.ceil(txt.trim().split(/\s+/).filter(Boolean).length/220))}

function blockHtml(b){
 if(!b||typeof b!=='object')return '';
 const text=rich(b.text||''),cap=b.caption?'<figcaption>'+esc(b.caption)+'</figcaption>':'';
 if(b.type==='paragraph')return '<p>'+text+'</p>';
 if(b.type==='heading'){const n=[2,3,4].includes(Number(b.level))?Number(b.level):2;return '<h'+n+'>'+text+'</h'+n+'>'}
 if(b.type==='quote')return '<blockquote><p>'+text+'</p>'+cap+'</blockquote>';
 if(b.type==='callout')return '<aside class="blog-callout">'+text+'</aside>';
 if(b.type==='divider')return '<hr>';
 if(b.type==='list')return '<'+(b.ordered?'ol':'ul')+'>'+((b.items||[]).slice(0,100).map(i=>'<li>'+rich(i)+'</li>').join(''))+'</'+(b.ordered?'ol':'ul')+'>';
 if(b.type==='image'){const url=safeUrl(b.url);return url?'<figure><a href="'+esc(url)+'" data-blog-image><img loading="lazy" src="'+esc(url)+'" alt="'+esc(b.alt||b.caption||'Article image')+'"></a>'+cap+'</figure>':''}
 if(b.type==='gallery'){return '<div class="blog-gallery">'+(b.items||[]).slice(0,12).map(i=>{const u=safeUrl(i.url);return u?'<a href="'+esc(u)+'" data-blog-image><img loading="lazy" src="'+esc(u)+'" alt="'+esc(i.alt||'Gallery image')+'"></a>':''}).join('')+'</div>'}
 if(b.type==='table'){return '<div class="blog-table-wrap"><table>'+(b.rows||[]).slice(0,25).map((r,i)=>'<tr>'+r.slice(0,6).map(v=>'<'+(i?'td':'th')+'>'+rich(v)+'</'+(i?'td':'th')+'>').join('')+'</tr>').join('')+'</table></div>'}
 if(b.type==='button'){const u=safeUrl(b.url);return u?'<p><a class="btn" href="'+esc(u)+'" rel="noopener">'+esc(b.label||'Learn more')+' ↗</a></p>':''}
 if(b.type==='video'){let id='';try{const u=new URL(b.url);if(u.hostname==='youtu.be')id=u.pathname.slice(1);if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname))id=u.searchParams.get('v')||''}catch{}return /^[a-zA-Z0-9_-]{11}$/.test(id)?'<div class="blog-video"><iframe loading="lazy" title="Embedded video" allowfullscreen src="https://www.youtube-nocookie.com/embed/'+id+'"></iframe></div>':''}
 return '';
}
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 const slug=String(req.query.slug||'').toLowerCase();
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return res.status(404).send('Article not found');
 try{
   const sql=getSql();
   const rows=await sql`select * from cms_items where item_type='blog' and status='published' and slug=${slug} limit 1`;
   if(!rows.length)return res.status(404).send('Article not found');
   const post=rows[0],d=post.data||{},blocks=Array.isArray(d.blocks)?d.blocks:[],cover=safeUrl(d.cover_url),url='https://oyeolaonline.com/blog/'+slug,title=post.title+' | Oyeola Online',desc=String(d.seo_description||d.excerpt||'Insights from Oyeola Online').slice(0,200);
   const created=post.created_at?new Date(post.created_at).toISOString():'',updated=post.updated_at?new Date(post.updated_at).toISOString():'',count=readTime(blocks);
   const article='<article class="blog-article container"><a class="project-backlink" href="/blog">← All articles</a><div class="blog-article-heading"><p class="eyebrow">Oyeola Journal</p><h1>'+esc(post.title)+'</h1><p class="blog-summary">'+esc(d.excerpt||'')+'</p><p class="blog-date"><time class="blog-local-time" datetime="'+created+'">'+esc(new Date(created).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}))+'</time> · '+count+' min read</p></div>'+(cover?'<figure class="blog-cover"><img src="'+esc(cover)+'" alt="'+esc(d.cover_alt||post.title)+'"></figure>':'')+'<div class="blog-body">'+blocks.map(blockHtml).join('')+'</div><nav class="blog-back"><a class="btn secondary" href="/blog">← More articles</a><a class="text-link" href="/contact">Start a project ↗</a></nav></article>';
   const schema=JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description:desc,datePublished:created,dateModified:updated,mainEntityOfPage:url,image:cover||undefined,author:{'@type':'Organization',name:'Oyeola Online'},publisher:{'@type':'Organization',name:'Oyeola Online'}});
   const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(desc)+'"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="'+url+'"><meta property="og:type" content="article"><meta property="og:title" content="'+esc(post.title)+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:url" content="'+url+'">'+(cover?'<meta property="og:image" content="'+esc(cover)+'">':'')+'<link rel="icon" href="/assets/logos/favicon.svg"><link rel="stylesheet" href="/assets/css/styles.css"><link rel="stylesheet" href="/assets/css/blog.css"><script type="application/ld+json">'+schema.replace(/</g,'\\u003c')+'</script><script>try{document.documentElement.dataset.theme=localStorage.getItem("oyeola-theme")||"dark"}catch(e){}</script></head><body><header class="site-header"></header><main>'+article+'</main><section class="cta-band"><div class="container cta-inner"><div><p class="eyebrow">Have an idea?</p><h2>Let\'s build something useful.</h2></div><a class="btn" href="/contact">Tell me about it</a></div></section><footer class="footer"></footer><script src="/assets/js/site.js"></script><script src="/assets/js/blog.js"></script></body></html>';
   res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');return res.status(200).send(html);
 }catch(e){console.error('Blog page error',e);return res.status(503).send('The article is temporarily unavailable.')}
}
