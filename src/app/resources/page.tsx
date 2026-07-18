import Link from 'next/link';
import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Oyeola ecommerce conversion, CRO, Shopify, buyer psychology, retention, and traffic readiness insights.'
};

export default async function ResourcesPage() {
  const posts = await prisma.resourcePost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  const categories = [...new Set(posts.map((post) => post.category))];
  return (
    <PageShell>
      <section className="bg-ink py-24 text-paper"><div className="container-page max-w-5xl"><p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-signal">Resources</p><h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">Ecommerce thinking for stores that want fewer guesses.</h1><p className="mt-7 max-w-3xl text-xl leading-9 text-paper/72">Short, practical insights on CRO, Shopify, buyer psychology, retention, and traffic readiness.</p></div></section>
      <section className="section-pad bg-paper"><div className="container-page"><div className="mb-8 flex flex-wrap gap-2">{categories.map((cat) => <span key={cat} className="rounded-full bg-ink px-3 py-2 text-xs font-black text-paper">{cat}</span>)}</div><div className="grid gap-5 md:grid-cols-2">{posts.map((post) => <Link key={post.id} href={`/resources/${post.slug}`} className="rounded-[32px] border border-ink/10 bg-white/70 p-7 transition hover:-translate-y-1 hover:shadow-soft"><p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-copper">{post.category}</p><h2 className="text-3xl font-black tracking-[-0.04em]">{post.title}</h2><p className="mt-5 leading-8 text-slateText">{post.excerpt}</p></Link>)}</div></div></section>
    </PageShell>
  );
}
