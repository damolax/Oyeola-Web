import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.resourcePost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt };
}

export default async function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.resourcePost.findUnique({ where: { slug: params.slug } });
  if (!post || !post.published) notFound();
  return (
    <PageShell>
      <article>
        <section className="bg-ink py-24 text-paper"><div className="container-page max-w-4xl"><p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-signal">{post.category}</p><h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">{post.title}</h1><p className="mt-7 text-xl leading-9 text-paper/72">{post.excerpt}</p></div></section>
        <section className="section-pad bg-paper"><div className="container-page max-w-3xl rich-text"><p>{post.body}</p></div></section>
      </article>
    </PageShell>
  );
}
