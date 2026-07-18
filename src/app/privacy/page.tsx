import { PageShell } from '@/components/PageShell';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function PrivacyPage() {
  const page = await prisma.page.findUnique({ where: { slug: 'privacy' } });
  return <PageShell><section className="bg-ink py-24 text-paper"><div className="container-page max-w-4xl"><h1 className="text-5xl font-black tracking-[-0.05em]">{page?.title || 'Privacy Policy'}</h1></div></section><section className="section-pad bg-paper"><div className="container-page max-w-3xl rich-text"><p>{page?.body}</p></div></section></PageShell>;
}
