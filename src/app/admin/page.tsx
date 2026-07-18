import Link from 'next/link';
import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  requireAdmin();
  const [totalLeads, newLeads, portfolioItems, testimonials, draftResources] = await Promise.all([
    prisma.lead.count(), prisma.lead.count({ where: { status: 'new' } }), prisma.portfolioItem.count(), prisma.testimonial.count(), prisma.resourcePost.count({ where: { published: false } })
  ]);
  const cards = [
    ['Total leads', totalLeads], ['New leads', newLeads], ['Portfolio items', portfolioItems], ['Testimonials', testimonials], ['Draft resources', draftResources]
  ];
  const links = [['Edit homepage', '/admin/homepage'], ['Manage services', '/admin/services'], ['Manage portfolio', '/admin/portfolio'], ['Manage testimonials', '/admin/testimonials'], ['Contact settings', '/admin/contact'], ['Brand settings', '/admin/settings']];
  return <AdminShell><AdminPageHeader title="Dashboard" body="Quick view of the editable website system and lead inbox." /><div className="grid gap-4 md:grid-cols-5">{cards.map(([label, value]) => <div key={label} className="rounded-[24px] bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#6b7280]">{label}</p><p className="mt-4 text-4xl font-black">{value}</p></div>)}</div><div className="mt-8 grid gap-4 md:grid-cols-3">{links.map(([label, href]) => <Link key={href} href={href} className="rounded-[24px] border border-black/10 bg-white p-5 font-black transition hover:-translate-y-1 hover:shadow-sm">{label}</Link>)}</div></AdminShell>;
}
