import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { Card, Check, Field, Submit, TextArea } from '@/components/admin/AdminFields';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { updateLegalPageAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function LegalPagesAdmin() {
  requireAdmin();
  const pages = await prisma.page.findMany({ where: { slug: { in: ['privacy', 'terms'] } }, orderBy: { slug: 'asc' } });
  return <AdminShell><AdminPageHeader title="Legal pages" body="Edit the simple privacy policy and terms pages from the admin." /><div className="grid gap-6">{pages.map((page) => <Card key={page.id}><form action={updateLegalPageAction} className="grid gap-4"><input type="hidden" name="slug" value={page.slug} /><div className="flex items-start justify-between"><h2 className="text-xl font-black">/{page.slug}</h2><Check label="Published" name="published" defaultChecked={page.published} /></div><Field label="Title" name="title" defaultValue={page.title} /><TextArea label="Body" name="body" defaultValue={page.body} rows={8} /><Field label="SEO title" name="seoTitle" defaultValue={page.seoTitle} /><TextArea label="SEO description" name="seoDescription" defaultValue={page.seoDescription} rows={3} /><Submit /></form></Card>)}</div></AdminShell>;
}
