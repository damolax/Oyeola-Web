import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { Card, Check, Field, Submit, TextArea } from '@/components/admin/AdminFields';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createTestimonialAction, deleteTestimonialAction, updateTestimonialAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function TestimonialsAdminPage() {
  requireAdmin();
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  return <AdminShell><AdminPageHeader title="Testimonials manager" body="Add, hide, feature, reorder, and edit testimonial proof without breaking the frontend layout." />
    <div className="grid gap-6">
      <Card><h2 className="mb-5 text-xl font-black">Add testimonial</h2><form action={createTestimonialAction} className="grid gap-4"><div className="grid gap-4 md:grid-cols-3"><Field label="Client name" name="clientName" /><Field label="Company/store" name="company" /><Field label="Role" name="role" /><Field label="Tag" name="tag" /><Field label="Rating" name="rating" type="number" /><Field label="Order" name="order" type="number" defaultValue={0} /></div><TextArea label="Quote" name="quote" /><div className="flex flex-wrap gap-4"><Check label="Visible" name="visible" defaultChecked /><Check label="Featured" name="featured" /><Check label="Show on homepage" name="showOnHome" /></div><Submit>Add testimonial</Submit></form></Card>
      {testimonials.map((t) => <Card key={t.id}><form action={updateTestimonialAction} className="grid gap-4"><input type="hidden" name="id" value={t.id} /><div className="grid gap-4 md:grid-cols-3"><Field label="Client name" name="clientName" defaultValue={t.clientName} /><Field label="Company/store" name="company" defaultValue={t.company} /><Field label="Role" name="role" defaultValue={t.role} /><Field label="Tag" name="tag" defaultValue={t.tag} /><Field label="Rating" name="rating" type="number" defaultValue={t.rating ?? ''} /><Field label="Order" name="order" type="number" defaultValue={t.order} /></div><TextArea label="Quote" name="quote" defaultValue={t.quote} /><div className="flex flex-wrap gap-4"><Check label="Visible" name="visible" defaultChecked={t.visible} /><Check label="Featured" name="featured" defaultChecked={t.featured} /><Check label="Show on homepage" name="showOnHome" defaultChecked={t.showOnHome} /></div><div className="flex gap-3"><Submit /><button formAction={deleteTestimonialAction} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white">Delete</button></div></form></Card>)}
    </div>
  </AdminShell>;
}
