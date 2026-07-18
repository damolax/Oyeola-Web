import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { SectionHeading } from '@/components/SectionHeading';
import { prisma } from '@/lib/db';
import { DynamicIcon } from '@/components/Icon';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Ecommerce audit, product page conversion, email lifecycle, abandoned cart, and traffic readiness services from Oyeola.'
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { published: true }, orderBy: { order: 'asc' } });
  return (
    <PageShell>
      <section className="bg-ink py-24 text-paper">
        <div className="container-page max-w-5xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-signal">Services after diagnosis</p>
          <h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">Fix the parts of the store journey that stop buyers from moving forward.</h1>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-paper/72">Oyeola’s services are built around the practical parts of ecommerce conversion: product-page clarity, objections, trust, checkout friction, follow-up, and traffic readiness.</p>
        </div>
      </section>
      <section className="section-pad bg-paper">
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`} className="group rounded-[32px] border border-ink/10 bg-white/70 p-7 transition hover:-translate-y-1 hover:shadow-soft">
              <DynamicIcon name={service.icon} className="mb-8 h-8 w-8 text-copper" />
              <h2 className="text-2xl font-black tracking-[-0.03em]">{service.title}</h2>
              <p className="mt-4 leading-7 text-slateText">{service.summary}</p>
              <div className="mt-7 space-y-4 rounded-[24px] bg-ink/[0.04] p-5">
                <p><strong>Problem:</strong> <span className="text-slateText">{service.problem}</span></p>
                <p><strong>Deliverable:</strong> <span className="text-slateText">{service.deliverable}</span></p>
              </div>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-ink">View service <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
