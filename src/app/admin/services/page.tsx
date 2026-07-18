import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { Card, Check, Field, Submit, TextArea } from '@/components/admin/AdminFields';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parseJson } from '@/lib/json';
import { createServiceAction, deleteServiceAction, updateServiceAction } from '../actions';

export const dynamic = 'force-dynamic';

function toLines(value: string) { return parseJson<string[]>(value, []).join('\n'); }

export default async function ServicesAdminPage() {
  requireAdmin();
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  return <AdminShell><AdminPageHeader title="Services manager" body="Add, edit, publish, hide, reorder, and shape service detail pages." />
    <div className="grid gap-6">
      <Card><h2 className="mb-5 text-xl font-black">Add service</h2><form action={createServiceAction} className="grid gap-4"><div className="grid gap-4 md:grid-cols-2"><Field label="Title" name="title" /><Field label="Slug" name="slug" help="Optional. Leave blank to generate from title." /><Field label="Icon name" name="icon" defaultValue="ShoppingBag" /><Field label="Order" name="order" type="number" defaultValue={0} /></div><TextArea label="Summary" name="summary" rows={3} /><TextArea label="Problem it solves" name="problem" rows={3} /><TextArea label="What Oyeola does" name="whatWeDo" rows={3} /><TextArea label="Deliverable" name="deliverable" rows={3} /><TextArea label="Best-fit client" name="bestFit" rows={3} /><TextArea label="Included items, one per line" name="included" /><TextArea label="Process steps, one per line" name="process" /><Check label="Published" name="published" defaultChecked /><Submit>Add service</Submit></form></Card>
      {services.map((s) => <Card key={s.id}><form action={updateServiceAction} className="grid gap-4"><input type="hidden" name="id" value={s.id} /><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-black">{s.title}</h2><div className="flex gap-4"><Check label="Published" name="published" defaultChecked={s.published} /></div></div><div className="grid gap-4 md:grid-cols-2"><Field label="Title" name="title" defaultValue={s.title} /><Field label="Slug" name="slug" defaultValue={s.slug} /><Field label="Icon name" name="icon" defaultValue={s.icon} /><Field label="Image URL" name="imageUrl" defaultValue={s.imageUrl} /><Field label="Order" name="order" type="number" defaultValue={s.order} /><Field label="CTA label" name="ctaLabel" defaultValue={s.ctaLabel} /><Field label="CTA link" name="ctaLink" defaultValue={s.ctaLink} /><Field label="SEO title" name="seoTitle" defaultValue={s.seoTitle} /></div><TextArea label="Summary" name="summary" defaultValue={s.summary} rows={3} /><TextArea label="Problem" name="problem" defaultValue={s.problem} /><TextArea label="What Oyeola does" name="whatWeDo" defaultValue={s.whatWeDo} /><TextArea label="Deliverable" name="deliverable" defaultValue={s.deliverable} /><TextArea label="Best fit" name="bestFit" defaultValue={s.bestFit} /><TextArea label="Included items" name="included" defaultValue={toLines(s.includedJson)} /><TextArea label="Process steps" name="process" defaultValue={toLines(s.processJson)} /><TextArea label="SEO description" name="seoDescription" defaultValue={s.seoDescription} rows={3} /><div className="flex gap-3"><Submit /><button formAction={deleteServiceAction} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white">Delete</button></div></form></Card>)}
    </div>
  </AdminShell>;
}
