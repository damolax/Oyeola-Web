import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ButtonLink } from '@/components/ButtonLink';
import { SectionHeading } from '@/components/SectionHeading';
import { prisma } from '@/lib/db';
import { parseJson } from '@/lib/json';
import { DynamicIcon } from '@/components/Icon';


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service) return {};
  return { title: service.seoTitle || service.title, description: service.seoDescription || service.summary };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug }, include: { relatedPortfolioItems: true, relatedTestimonials: true } });
  if (!service || !service.published) notFound();
  const included = parseJson<string[]>(service.includedJson, []);
  const process = parseJson<string[]>(service.processJson, []);
  const faqs = parseJson<{ question: string; answer: string }[]>(service.faqsJson, []);

  return (
    <PageShell>
      <section className="bg-ink py-24 text-paper">
        <div className="container-page grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-signal text-ink"><DynamicIcon name={service.icon} className="h-9 w-9" /></div>
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-signal">Service</p>
            <h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">{service.title}</h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-paper/72">{service.summary}</p>
            <div className="mt-9"><ButtonLink href={service.ctaLink}>{service.ctaLabel}</ButtonLink></div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-paper">
        <div className="container-page grid gap-5 md:grid-cols-3">
          <div className="rounded-[30px] border border-ink/10 bg-white/70 p-7"><h2 className="mb-4 text-2xl font-black">The problem</h2><p className="leading-8 text-slateText">{service.problem}</p></div>
          <div className="rounded-[30px] border border-ink/10 bg-white/70 p-7"><h2 className="mb-4 text-2xl font-black">What Oyeola does</h2><p className="leading-8 text-slateText">{service.whatWeDo}</p></div>
          <div className="rounded-[30px] border border-ink/10 bg-white/70 p-7"><h2 className="mb-4 text-2xl font-black">What you get</h2><p className="leading-8 text-slateText">{service.deliverable}</p></div>
        </div>
      </section>

      <section className="section-pad bg-sand/60">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Included" title="What is included in this service." />
            <div className="grid gap-3">{included.map((item) => <p key={item} className="rounded-[22px] bg-paper p-5 font-bold">{item}</p>)}</div>
          </div>
          <div>
            <SectionHeading eyebrow="Process" title="How the work is approached." />
            <div className="grid gap-3">{process.map((item, index) => <p key={item} className="rounded-[22px] bg-paper p-5 font-bold"><span className="mr-3 text-copper">0{index + 1}</span>{item}</p>)}</div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-paper">
        <div className="container-page grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading eyebrow="Best fit" title="When this service makes sense." body={service.bestFit || 'Best for stores that want a practical ecommerce conversion diagnosis before making bigger decisions.'} />
          <div className="grid gap-4">
            {faqs.map((item) => <details key={item.question} className="rounded-[24px] border border-ink/10 bg-white/70 p-5"><summary className="cursor-pointer text-lg font-black">{item.question}</summary><p className="mt-4 leading-7 text-slateText">{item.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="section-pad bg-ink text-paper">
        <div className="container-page text-center">
          <h2 className="text-balance text-4xl font-black tracking-[-0.05em] md:text-6xl">Need this kind of fix for your store?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-paper/70">Start with the review. It keeps the first step focused on diagnosis, priority, and the buyer journey before wider recommendations.</p>
          <div className="mt-8"><ButtonLink href="/contact">Request a Store Review</ButtonLink></div>
        </div>
      </section>
    </PageShell>
  );
}
