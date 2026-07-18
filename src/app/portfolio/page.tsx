import Link from 'next/link';
import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio and Sample Breakdowns',
  description: 'Explore Oyeola portfolio items and sample ecommerce audit breakdowns grouped by category.'
};

export default async function PortfolioPage({ searchParams }: { searchParams?: { category?: string } }) {
  const categories = await prisma.portfolioCategory.findMany({ orderBy: { order: 'asc' } });
  const category = searchParams?.category ? await prisma.portfolioCategory.findUnique({ where: { slug: searchParams.category } }) : null;
  const items = await prisma.portfolioItem.findMany({
    where: { published: true, ...(category ? { categories: { some: { id: category.id } } } : {}) },
    orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
    include: { categories: true }
  });
  return (
    <PageShell>
      <section className="bg-ink py-24 text-paper"><div className="container-page max-w-5xl"><p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-signal">Proof of thinking</p><h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">Portfolio and sample audit breakdowns.</h1><p className="mt-7 max-w-3xl text-xl leading-9 text-paper/72">No fake inflated revenue claims. When real client details are not supplied, examples are labelled as sample breakdowns and written to teach how Oyeola thinks.</p></div></section>
      <section className="section-pad bg-paper"><div className="container-page">
        <div className="mb-10 flex flex-wrap gap-3"><Link href="/portfolio" className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-black">All</Link>{categories.map((cat) => <Link key={cat.id} href={`/portfolio?category=${cat.slug}`} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-black">{cat.name}</Link>)}</div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <Link key={item.id} href={`/portfolio/${item.slug}`} className="rounded-[32px] border border-ink/10 bg-white/70 p-7 transition hover:-translate-y-1 hover:shadow-soft"><p className="mb-4 inline-flex rounded-full bg-copper/15 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-copper">{item.sampleLabel}</p><h2 className="text-2xl font-black tracking-[-0.03em]">{item.title}</h2><p className="mt-4 text-sm font-bold text-slateText">{item.clientType}{item.niche ? ` · ${item.niche}` : ''}</p><p className="mt-5 leading-7 text-slateText">{item.problem}</p></Link>)}
        </div>
      </div></section>
    </PageShell>
  );
}
