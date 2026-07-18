import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ContactForm } from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Oyeola to request a website, redesign, ecommerce review, or conversion-focused web project.'
};

export default function ContactPage() {
  return (
    <PageShell>
      <section className="bg-[#07130f] py-24 text-paper">
        <div className="container-page max-w-5xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-signal">Get a website</p>
          <h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">Send the project details and the first problem you want solved.</h1>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-paper/72">No pressure. Start with what you need: a new website, redesign, store review, booking setup, payment flow, or clearer contact path.</p>
        </div>
      </section>
      <section className="section-pad bg-paper">
        <div className="container-page grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[32px] border border-ink/10 bg-sand/60 p-7">
            <h2 className="mb-4 text-3xl font-black tracking-[-0.04em]">What helps?</h2>
            <ul className="space-y-4 leading-7 text-slateText"><li>Share your current site or business link.</li><li>Choose the platform if you know it.</li><li>Describe what the website should help you achieve.</li><li>Mention any timeline, traffic, or budget context if useful.</li></ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}
