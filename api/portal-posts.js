import {getSql,viewer,isEditor,validOrigin,validSlug,sanitizeText,cleanContent,publicPost,audit} from './_portal.js';

export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');
 const action=String(req.query?.action||'list');
 if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
 if(req.method==='POST'&&!validOrigin(req))return res.status(403).json({error:'Cross-origin action refused'});
 let sql;
 try{sql=getSql()}catch{return res.status(503).json({error:'Publishing database not connected.'})}
 try{
  const user=await viewer(sql,req);
  if(!user)return res.status(401).json({error:'Please sign in to the editorial portal.'});
  const editor=isEditor(user);
  if(action==='list'&&req.method==='GET'){
   const rows=editor
    ? await sql`SELECT p.*,u.display_name author_name FROM portal_posts p JOIN portal_users u ON p.author_id=u.id ORDER BY p.updated_at DESC LIMIT 400`
    : await sql`SELECT p.*,u.display_name author_name FROM portal_posts p JOIN portal_users u ON p.author_id=u.id WHERE p.author_id=${user.id} ORDER BY p.updated_at DESC LIMIT 400`;
   return res.status(200).json({posts:rows.map(publicPost)});
  }
  if(action==='save'&&req.method==='POST'){
   const b=req.body||{};
   const title=sanitizeText(b.title,200), slug=String(b.slug||'').trim().toLowerCase();
   const excerpt=sanitizeText(b.excerpt,800);
   if(title.length<4||!validSlug(slug))return res.status(400).json({error:'A title (4+ characters) and valid URL slug are required.'});
   let content;
   try{content=cleanContent(b.content)}catch(e){return res.status(400).json({error:e.message})}
   if(JSON.stringify(content).length>300000)return res.status(413).json({error:'Article is too large.'});
   if(b.id){
    const found=await sql`SELECT * FROM portal_posts WHERE id=${b.id} LIMIT 1`;
    const post=found[0];
    if(!post)return res.status(404).json({error:'Article not found.'});
    if(!editor&&String(post.author_id)!==String(user.id))return res.status(403).json({error:'You can only edit your own articles.'});
    if(!['draft','revision_requested','rejected'].includes(post.status))
      return res.status(409).json({error:'This article is locked for review or already published.'});
    const updated=await sql`
     UPDATE portal_posts SET title=${title},slug=${slug},excerpt=${excerpt},
       content=${JSON.stringify(content)}::jsonb,status='draft',
       reviewer_id=NULL,review_message='',updated_at=now()
     WHERE id=${post.id} AND status IN ('draft','revision_requested','rejected') RETURNING *`;
    if(!updated.length)return res.status(409).json({error:'Article status changed. Refresh before saving.'});
    await sql`
      INSERT INTO portal_post_revisions(post_id,editor_id,title,excerpt,content)
      VALUES(${post.id},${user.id},${title},${excerpt},${JSON.stringify(content)}::jsonb)`;
    await audit(sql,user.id,'article_saved','post',post.id);
    return res.status(200).json({post:publicPost(updated[0])});
   }
   const inserted=await sql`
    INSERT INTO portal_posts(author_id,slug,title,excerpt,content)
    VALUES(${user.id},${slug},${title},${excerpt},${JSON.stringify(content)}::jsonb) RETURNING *`;
   await sql`INSERT INTO portal_post_revisions(post_id,editor_id,title,excerpt,content)
    VALUES(${inserted[0].id},${user.id},${title},${excerpt},${JSON.stringify(content)}::jsonb)`;
   await audit(sql,user.id,'article_created','post',inserted[0].id);
   return res.status(201).json({post:publicPost(inserted[0])});
  }
  if(action==='submit'&&req.method==='POST'){
   const found=await sql`SELECT * FROM portal_posts WHERE id=${req.body?.id} LIMIT 1`;
   const post=found[0];
   if(!post)return res.status(404).json({error:'Article not found.'});
   if(!editor&&String(post.author_id)!==String(user.id))return res.status(403).json({error:'Not your article.'});
   if(!['draft','revision_requested','rejected'].includes(post.status))return res.status(409).json({error:'Article cannot be submitted from its current status.'});
   if(!Array.isArray(post.content?.blocks)||!post.content.blocks.length)
    return res.status(400).json({error:'Add article content before submitting.'});
   const updated=await sql`
    UPDATE portal_posts SET status='in_review',review_message='',reviewer_id=NULL,updated_at=now()
    WHERE id=${post.id} AND status IN ('draft','revision_requested','rejected') RETURNING *`;
   if(!updated.length)return res.status(409).json({error:'Article changed. Refresh the page.'});
   await audit(sql,user.id,'article_submitted','post',post.id);
   return res.status(200).json({post:publicPost(updated[0])});
  }
  if(action==='review'&&req.method==='POST'){
   if(!editor)return res.status(403).json({error:'Editor permissions required.'});
   const decision=String(req.body?.decision||'');
   if(!['approved','revision_requested','rejected'].includes(decision))return res.status(400).json({error:'Invalid review decision.'});
   const message=sanitizeText(req.body?.message,2000);
   if(decision!=='approved'&&message.length<10)
    return res.status(400).json({error:'Provide an actionable review message of at least 10 characters.'});
   const changed=await sql`
    UPDATE portal_posts SET status=${decision},review_message=${message},
     reviewer_id=${user.id},updated_at=now()
    WHERE id=${req.body?.id} AND status='in_review' RETURNING *`;
   if(!changed.length)return res.status(409).json({error:'Article not in review or no longer available.'});
   await audit(sql,user.id,'article_'+decision,'post',changed[0].id,{message});
   return res.status(200).json({post:publicPost(changed[0])});
  }
  if(action==='publish'&&req.method==='POST'){
   if(!editor)return res.status(403).json({error:'Editor permissions required.'});
   const found=await sql`SELECT p.*,u.display_name author_name FROM portal_posts p JOIN portal_users u ON u.id=p.author_id WHERE p.id=${req.body?.id} LIMIT 1`;
   const post=found[0];
   if(!post||post.status!=='approved')return res.status(409).json({error:'Only approved articles can be published.'});
   const collision=await sql`SELECT id FROM cms_items WHERE item_type='blog' AND slug=${post.slug} LIMIT 1`;
   if(collision.length)return res.status(409).json({error:'This URL slug is already used by the public journal.'});
   const data={...post.content,excerpt:post.excerpt,author_name:post.author_name,
     seo_description:post.content?.seo_description||post.excerpt};
   const cms=await sql`
    INSERT INTO cms_items(item_type,slug,title,status,featured_home,sort_order,data)
    VALUES('blog',${post.slug},${post.title},'published',false,0,${JSON.stringify(data)}::jsonb)
    RETURNING id`;
   const updated=await sql`
    UPDATE portal_posts SET status='published',cms_item_id=${String(cms[0].id)},
      published_at=now(),updated_at=now() WHERE id=${post.id} AND status='approved' RETURNING *`;
   if(!updated.length)throw new Error('Published CMS entry but portal status did not update; reconcile before retry.');
   await audit(sql,user.id,'article_published','post',post.id,{slug:post.slug,cms_id:cms[0].id});
   return res.status(200).json({post:publicPost(updated[0]),url:'/blog/'+post.slug});
  }
  if(action==='revisions'&&req.method==='GET'){
   const id=String(req.query?.id||'');
   const found=await sql`SELECT id,author_id FROM portal_posts WHERE id=${id} LIMIT 1`;
   if(!found.length)return res.status(404).json({error:'Article not found.'});
   if(!editor&&String(found[0].author_id)!==String(user.id))return res.status(403).json({error:'Not your article.'});
   const rows=await sql`SELECT id,editor_id,title,excerpt,saved_at FROM portal_post_revisions WHERE post_id=${id} ORDER BY saved_at DESC LIMIT 60`;
   return res.status(200).json({revisions:rows});
  }
  return res.status(404).json({error:'Unknown article action.'});
 }catch(e){
  console.error('Editorial posts error:',e);
  if(e?.code==='23505')return res.status(409).json({error:'A post with that URL slug already exists.'});
  return res.status(500).json({error:'Could not complete that editorial action.'});
 }
}
