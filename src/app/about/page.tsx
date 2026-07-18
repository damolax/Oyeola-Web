import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ButtonLink } from '@/components/ButtonLink';
import { getSettings } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn how Oyeola thinks about ecommerce buyer-journey leaks, store audits, and conversion strategy.'
};

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <PageShell>
      <section className="bg-ink py-24 text-paper"><div className="container-page grid gap-12 lg:grid-cols-[1fr_0.8fr]"><div><p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-signal">About Oyeola</p><h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">Most ecommerce advice starts too late.</h1><p className="mt-7 max-w-3xl text-xl leading-9 text-paper/72">It talks about ads, traffic, and scaling before asking whether the product page answers the buyer’s doubts, whether the offer is clear, and whether the store follows up when someone leaves.</p></div><div className="overflow-hidden rounded-[36px] border border-paper/10 bg-paper/8 p-4"><div className="relative aspect-square overflow-hidden rounded-[30px] bg-[#050807]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={settings.founderPhotoUrl || 'https://oyeola-online.lovable.app/assets/hero-portrait-Cj8CyeQo.png'} alt="Olalekan Musodiq Oyekunle" className="absolute inset-x-0 bottom-0 mx-auto h-full w-auto object-contain object-bottom" /></div></div></div></section>
      <section className="section-pad bg-paper"><div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-copper">Founder</p><h2 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">{settings.founderName}</h2></div><div className="space-y-6 text-lg leading-9 text-slateText"><p>Oyeola exists for store owners who do not want to guess why visitors are not buying. The work starts with the buying path: what the visitor understands, what they believe, where they hesitate, and what happens after they leave.</p><p>The approach is direct and diagnostic. A store can be attractive and still lose buyers because trust is weak, objections are unanswered, shipping expectations are unclear, email follow-up is thin, or the ad promise does not match the page.</p><p>Oyeola is not built to sound like a loud full-service agency. It is built to help ecommerce operators see the leaks that make traffic expensive and decisions confusing.</p></div></div></section>
      <section className="section-pad bg-sand/60"><div className="container-page grid gap-5 md:grid-cols-3">{[['Clarity before activity', 'Before recommending tactics, Oyeola checks whether the buyer can understand the offer and trust the store path.'], ['Proof where doubt appears', 'Testimonials, guarantees, reviews, and reassurance should support the buyer exactly when hesitation starts.'], ['Follow-up that respects intent', 'Email and SMS should not shout at everyone the same way. They should match the buyer moment and help the next decision.']].map(([title, body]) => <div key={title} className="rounded-[30px] border border-ink/10 bg-paper p-7"><h3 className="mb-4 text-2xl font-black">{title}</h3><p className="leading-8 text-slateText">{body}</p></div>)}</div></section>
      <section className="section-pad bg-ink text-paper"><div className="container-page text-center"><h2 className="text-balance text-4xl font-black tracking-[-0.05em] md:text-6xl">Want a sharper look at your store?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-paper/70">Start with a low-pressure review focused on the buyer journey, not generic marketing advice.</p><div className="mt-8"><ButtonLink href="/contact">Request a Store Review</ButtonLink></div></div></section>
    </PageShell>
  );
}
