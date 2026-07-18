import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { Card, Check, Field, Submit, TextArea } from '@/components/admin/AdminFields';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createPostAction, deletePostAction, updatePostAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ResourcesAdminPage() {
  requireAdmin();
  const posts = await prisma.resourcePost.findMany({ orderBy: { updatedAt: 'desc' } });
  return <AdminShell><AdminPageHeader title="Resources manager" body="Create resource posts for CRO, Shopify, email marketing, buyer psychology, retention, and traffic readiness." />
    <div className="grid gap-6">
      <Card><h2 className="mb-5 text-xl font-black">Add post</h2><form action={createPostAction} className="grid gap-4"><div className="grid gap-4 md:grid-cols-2"><Field label="Title" name="title" /><Field label="Slug" name="slug" /><Field label="Category" name="category" defaultValue="CRO" /><Field label="Featured image URL" name="featuredImage" /></div><TextArea label="Excerpt" name="excerpt" rows={3} /><TextArea label="Body" name="body" rows={8} /><Field label="SEO title" name="seoTitle" /><TextArea label="SEO description" name="seoDescription" rows={3} /><Check label="Published" name="published" /><Submit>Add post</Submit></form></Card>
      {posts.map((post) => <Card key={post.id}><form action={updatePostAction} className="grid gap-4"><input type="hidden" name="id" value={post.id} /><div className="flex items-start justify-between"><h2 className="text-xl font-black">{post.title}</h2><Check label="Published" name="published" defaultChecked={post.published} /></div><div className="grid gap-4 md:grid-cols-2"><Field label="Title" name="title" defaultValue={post.title} /><Field label="Slug" name="slug" defaultValue={post.slug} /><Field label="Category" name="category" defaultValue={post.category} /><Field label="Featured image URL" name="featuredImage" defaultValue={post.featuredImage} /></div><TextArea label="Excerpt" name="excerpt" defaultValue={post.excerpt} rows={3} /><TextArea label="Body" name="body" defaultValue={post.body} rows={8} /><Field label="SEO title" name="seoTitle" defaultValue={post.seoTitle} /><TextArea label="SEO description" name="seoDescription" defaultValue={post.seoDescription} rows={3} /><div className="flex gap-3"><Submit /><button formAction={deletePostAction} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white">Delete</button></div></form></Card>)}
    </div>
  </AdminShell>;
}
