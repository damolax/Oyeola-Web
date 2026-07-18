import Link from 'next/link';
import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { Card, Field, Submit, TextArea } from '@/components/admin/AdminFields';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { deleteLeadAction, updateLeadAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function LeadsAdminPage() {
  requireAdmin();
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  return <AdminShell><AdminPageHeader title="Leads inbox" body="Review submissions, update status, add internal notes, export CSV, or delete leads." />
    <div className="mb-5"><Link href="/admin/leads/export" className="rounded-2xl bg-[#111827] px-5 py-3 text-sm font-black text-white">Export CSV</Link></div>
    <div className="grid gap-5">{leads.map((lead) => <Card key={lead.id}><div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-black">{lead.name}</h2><span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-black text-[#3730a3]">{lead.status}</span></div><p className="mt-2 text-sm font-bold text-[#4b5563]"><a href={`mailto:${lead.email}`}>{lead.email}</a> · <a href={lead.websiteUrl} target="_blank">{lead.websiteUrl}</a></p><div className="mt-4 flex flex-wrap gap-3"><a className="rounded-2xl bg-[#111827] px-4 py-2 text-sm font-black text-white" href={`mailto:${lead.email}?subject=${encodeURIComponent('Re: Your Oyeola website request')}&body=${encodeURIComponent(`Hi ${lead.name},\n\nThanks for sending your request. I reviewed the details and wanted to ask a few questions before suggesting the next best step.\n\n`)}`}>Reply from your email app</a><a className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-black" href={lead.websiteUrl} target="_blank">Open website</a></div><div className="mt-5 grid gap-3 text-sm leading-7 text-[#4b5563]"><p><strong>Platform:</strong> {lead.platform}</p><p><strong>Wants reviewed:</strong> {lead.wantsReviewed}</p><p><strong>Traffic:</strong> {lead.monthlyTraffic || 'Not provided'}</p><p><strong>Main challenge:</strong> {lead.mainChallenge}</p><p><strong>Date:</strong> {lead.createdAt.toLocaleString()}</p></div></div><form action={updateLeadAction} className="grid gap-4"><input type="hidden" name="id" value={lead.id} /><label className="admin-label">Status<select name="status" defaultValue={lead.status} className="admin-input"><option value="new">new</option><option value="reviewed">reviewed</option><option value="replied">replied</option><option value="not a fit">not a fit</option></select></label><TextArea label="Internal notes" name="internalNotes" defaultValue={lead.internalNotes} /><div className="flex gap-3"><Submit /><button formAction={deleteLeadAction} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white">Delete</button></div></form></div></Card>)}</div>
  </AdminShell>;
}
