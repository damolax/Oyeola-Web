import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ButtonLink } from '@/components/ButtonLink';
import { SectionHeading } from '@/components/SectionHeading';
import { prisma } from '@/lib/db';
import { parseJson } from '@/lib/json';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await prisma.portfolioItem.findUnique({ where: { slug: params.slug } });
  if (!item) return {};
  return { title: item.seoTitle || item.title, description: item.seoDescription || item.problem };
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const item = await prisma.portfolioItem.findUnique({ where: { slug: params.slug }, include: { categories: true } });
  if (!item || !item.published) notFound();
  const findings = parseJson<string[]>(item.findingsJson, []);
  const fixes = parseJson<string[]>(item.fixesJson, []);
  const tools = parseJson<string[]>(item.toolsJson, []);
  return (
    <PageShell>
      <section className="bg-ink py-24 text-paper"><div className="container-page max-w-5xl"><p className="mb-4 inline-flex rounded-full bg-copper/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-copper">{item.sampleLabel}</p><h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">{item.title}</h1><p className="mt-7 max-w-3xl text-xl leading-9 text-paper/72">{item.clientType}{item.niche ? ` · ${item.niche}` : ''}</p></div></section>
      <section className="section-pad bg-paper"><div className="container-page grid gap-5 md:grid-cols-2"><div className="rounded-[30px] border border-ink/10 bg-white/70 p-7"><h2 className="mb-4 text-2xl font-black">Initial problem</h2><p className="leading-8 text-slateText">{item.problem}</p></div><div className="rounded-[30px] border border-ink/10 bg-white/70 p-7"><h2 className="mb-4 text-2xl font-black">What was reviewed</h2><p className="leading-8 text-slateText">{item.reviewed}</p></div></div></section>
      <section className="section-pad bg-sand/60"><div className="container-page grid gap-10 lg:grid-cols-2"><div><SectionHeading eyebrow="Diagnostic findings" title="Key leaks found." /><div className="grid gap-3">{findings.map((text) => <p key={text} className="rounded-[22px] bg-paper p-5 font-bold leading-7">{text}</p>)}</div></div><div><SectionHeading eyebrow="Recommended improvements" title="Suggested fixes." /><div className="grid gap-3">{fixes.map((text) => <p key={text} className="rounded-[22px] bg-paper p-5 font-bold leading-7">{text}</p>)}</div></div></div></section>
      <section className="section-pad bg-paper"><div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"><SectionHeading eyebrow="Business impact explanation" title="Why these fixes matter." body={item.impact} /><div className="rounded-[30px] border border-ink/10 bg-white/70 p-7"><h2 className="mb-5 text-2xl font-black">Tools and platforms</h2><div className="flex flex-wrap gap-2">{tools.map((tool) => <span key={tool} className="rounded-full bg-ink px-3 py-2 text-xs font-black text-paper">{tool}</span>)}</div></div></div></section>
      <section className="section-pad bg-ink text-paper"><div className="container-page text-center"><h2 className="text-balance text-4xl font-black tracking-[-0.05em] md:text-6xl">Want a similar review for your store?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-paper/70">Send your store and the main issue you want reviewed first. The first step is diagnosis, not pressure.</p><div className="mt-8"><ButtonLink href="/contact">Request a Similar Review</ButtonLink></div></div></section>
    </PageShell>
  );
}
