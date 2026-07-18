import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { Card, Check, Field, Submit, TextArea } from '@/components/admin/AdminFields';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createCategoryAction, createPortfolioAction, deletePortfolioAction, updatePortfolioStatusAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function PortfolioAdminPage() {
  requireAdmin();
  const [categories, items] = await Promise.all([
    prisma.portfolioCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.portfolioItem.findMany({ orderBy: { updatedAt: 'desc' }, include: { categories: true } })
  ]);
  return <AdminShell><AdminPageHeader title="Portfolio manager" body="Add unlimited portfolio categories and sample/client breakdowns. Choose which items appear on the homepage." />
    <div className="grid gap-6">
      <Card><h2 className="mb-5 text-xl font-black">Add category</h2><form action={createCategoryAction} className="grid gap-4 md:grid-cols-4"><Field label="Name" name="name" /><Field label="Slug" name="slug" /><Field label="Description" name="description" /><Field label="Order" name="order" type="number" defaultValue={0} /><Submit>Add category</Submit></form><div className="mt-4 flex flex-wrap gap-2">{categories.map((cat) => <span key={cat.id} className="rounded-full bg-[#111827] px-3 py-2 text-xs font-black text-white">{cat.name}</span>)}</div></Card>
      <Card><h2 className="mb-5 text-xl font-black">Add portfolio item</h2><form action={createPortfolioAction} className="grid gap-4"><div className="grid gap-4 md:grid-cols-2"><Field label="Title" name="title" /><Field label="Slug" name="slug" /><Field label="Store type / client type" name="clientType" /><Field label="Niche" name="niche" /><Field label="Sample label" name="sampleLabel" defaultValue="Sample Breakdown" /></div><div className="flex flex-wrap gap-4">{categories.map((cat) => <label key={cat.id} className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="categories" value={cat.id} />{cat.name}</label>)}</div><TextArea label="Initial problem" name="problem" /><TextArea label="What was reviewed" name="reviewed" /><TextArea label="Key findings, one per line" name="findings" /><TextArea label="Suggested fixes, one per line" name="fixes" /><TextArea label="Business impact explanation" name="impact" /><TextArea label="Tools/platforms, one per line" name="tools" rows={3} /><div className="flex gap-4"><Check label="Featured" name="featured" /><Check label="Show on homepage" name="showOnHome" /><Check label="Published" name="published" defaultChecked /></div><Submit>Add portfolio item</Submit></form></Card>
      <div className="grid gap-4">{items.map((item) => <Card key={item.id}><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h2 className="text-xl font-black">{item.title}</h2><p className="mt-2 text-sm text-[#6b7280]">{item.categories.map((cat) => cat.name).join(', ') || 'No category'}</p><p className="mt-3 max-w-3xl leading-7 text-[#4b5563]">{item.problem}</p></div><form action={updatePortfolioStatusAction} className="grid gap-2"><input type="hidden" name="id" value={item.id} /><Check label="Featured" name="featured" defaultChecked={item.featured} /><Check label="Show home" name="showOnHome" defaultChecked={item.showOnHome} /><Check label="Published" name="published" defaultChecked={item.published} /><Submit>Save status</Submit></form><form action={deletePortfolioAction}><input type="hidden" name="id" value={item.id} /><button className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white">Delete</button></form></div></Card>)}</div>
    </div>
  </AdminShell>;
}
