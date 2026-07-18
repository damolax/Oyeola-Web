import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { Card, Check, Field, Submit, TextArea } from '@/components/admin/AdminFields';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parseJson } from '@/lib/json';
import { updateSectionAction } from '../actions';

export const dynamic = 'force-dynamic';

function lines(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => typeof item === 'string' ? item : JSON.stringify(item)).join('\n');
  return '';
}

export default async function HomepageEditorPage() {
  requireAdmin();
  const sections = await prisma.section.findMany({ where: { pageSlug: 'home' }, orderBy: { order: 'asc' } });
  return <AdminShell><AdminPageHeader title="Homepage editor" body="Edit homepage sections. For card/step objects, use the advanced JSON box to preserve structured layouts." />
    <div className="grid gap-6">{sections.map((section) => { const data = parseJson<Record<string, unknown>>(section.contentJson, {}); return <Card key={section.id}><form action={updateSectionAction} className="grid gap-4"><input type="hidden" name="id" value={section.id} /><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#6b7280]">{section.key}</p><h2 className="mt-1 text-2xl font-black">{section.title}</h2></div><Check label="Visible" name="visible" defaultChecked={section.visible} /></div><div className="grid gap-4 md:grid-cols-2"><Field label="Title / heading" name="title" defaultValue={section.title} /><Field label="Order" name="order" type="number" defaultValue={section.order} /><Field label="Eyebrow" name="eyebrow" defaultValue={String(data.eyebrow || '')} /><Field label="Primary CTA label" name="primaryCtaLabel" defaultValue={String(data.primaryCtaLabel || '')} /><Field label="Primary CTA link" name="primaryCtaLink" defaultValue={String(data.primaryCtaLink || '')} /><Field label="Secondary CTA label" name="secondaryCtaLabel" defaultValue={String(data.secondaryCtaLabel || '')} /><Field label="Secondary CTA link" name="secondaryCtaLink" defaultValue={String(data.secondaryCtaLink || '')} /><Field label="CTA label" name="ctaLabel" defaultValue={String(data.ctaLabel || '')} /><Field label="CTA link" name="ctaLink" defaultValue={String(data.ctaLink || '')} /></div><TextArea label="Subheadline" name="subheadline" defaultValue={String(data.subheadline || '')} rows={3} /><TextArea label="Body" name="body" defaultValue={String(data.body || '')} rows={4} /><TextArea label="Bullets, one per line" name="bullets" defaultValue={lines(data.bullets)} rows={4} /><TextArea label="Simple cards, one per line" name="cards" defaultValue={lines(data.cards)} rows={4} /><TextArea label="Advanced content JSON" name="rawJson" defaultValue={section.contentJson} rows={8} help="Use this to edit framework cards, process steps, FAQ items, or any structured content." /><Submit /></form></Card>; })}</div>
  </AdminShell>;
}
