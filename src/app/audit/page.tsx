import { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { SectionHeading } from '@/components/SectionHeading';
import { ButtonLink } from '@/components/ButtonLink';
import { ContactForm } from '@/components/ContactForm';
import { FadeIn } from '@/components/Motion';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Ecommerce Revenue Leak Review',
  description: 'See exactly what Oyeola checks before recommending conversion fixes for an ecommerce store.'
};

const checks = ['Product page clarity', 'Offer strength', 'Buyer objections', 'Trust placement', 'Mobile experience', 'Cart friction', 'Checkout flow', 'Email capture', 'Abandoned cart and checkout recovery', 'Product-view and browse recovery', 'Post-purchase follow-up', 'Repeat purchase and retention', 'Traffic readiness'];
const deliverables = ['Buyer Journey Leak Map', 'Product Page Objection Review', 'Cart and Checkout Friction Notes', 'Trust Signal Gap Review', 'Email Capture and Follow-Up Gap Check', '30-Day Store Fix Priority Plan', 'Traffic Readiness Score'];

export default function AuditPage() {
  return (
    <PageShell>
      <section className="bg-ink py-24 text-paper">
        <div className="container-page max-w-5xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-signal">Arrived here after a message from Oyeola? This page shows exactly what gets reviewed before any recommendation is made.</p>
          <h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">The Ecommerce Revenue Leak Review.</h1>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-paper/72">A focused diagnostic for ecommerce stores that want to know where buyer intent is leaking before they spend more on traffic, redesigns, or scattered tools.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><ButtonLink href="#request">Request the Review</ButtonLink><ButtonLink href="#framework" variant="secondary">View Framework</ButtonLink></div>
        </div>
      </section>

      <section className="section-pad bg-paper">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="What it is" title="Not a roast. Not a sales pitch. A practical buyer-path diagnosis." body="The review checks what a first-time buyer sees, believes, hesitates over, and receives after leaving. The goal is to show which leaks are costing trust, clicks, carts, and repeat orders." />
          <div className="grid gap-4 md:grid-cols-2">
            {deliverables.map((item) => <FadeIn key={item} className="rounded-[24px] border border-ink/10 bg-white/70 p-5 font-black">{item}</FadeIn>)}
          </div>
        </div>
      </section>

      <section id="framework" className="section-pad bg-sand/60">
        <div className="container-page">
          <SectionHeading center eyebrow="Review categories" title="What gets checked inside the store." body="The review looks beyond surface design and focuses on the decisions a buyer has to make before trusting the store enough to buy." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {checks.map((item, index) => <div key={item} className="rounded-[24px] border border-ink/10 bg-paper p-5"><p className="mb-3 text-xs font-black text-copper">{String(index + 1).padStart(2, '0')}</p><h3 className="font-black">{item}</h3></div>)}
          </div>
        </div>
      </section>

      <section className="section-pad bg-paper">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {[
            ['Who it is for', 'Stores with products, visitors, or outreach interest, but unclear conversion gaps. Especially useful before spending harder on ads.'],
            ['What Oyeola will not do', 'No fake promises, no generic advice, no pressure funnel, and no pretending a beautiful page automatically converts.'],
            ['What you receive', 'A clear breakdown of leaks, doubts, missed follow-up opportunities, and what deserves attention first.']
          ].map(([title, body]) => <div key={title} className="rounded-[30px] border border-ink/10 bg-white/70 p-7"><h2 className="mb-4 text-2xl font-black tracking-[-0.03em]">{title}</h2><p className="leading-8 text-slateText">{body}</p></div>)}
        </div>
      </section>

      <section className="section-pad bg-ink text-paper">
        <div className="container-page">
          <SectionHeading eyebrow="Sample findings" title="The kind of leaks a review can surface." body="These are examples of diagnostic findings. They are not fake claims or guaranteed outcomes." />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['The proof appears after the buyer has already hesitated.', 'Move review snippets, guarantees, and usage proof closer to the decision point.'],
              ['The popup collects the email but does not create a buying path.', 'Build a welcome and recovery sequence that answers the buyer’s next question.'],
              ['The ad promise and product page headline do not match.', 'Align the post-click page with the intent that made the visitor click.']
            ].map(([title, body]) => <div key={title} className="rounded-[30px] border border-paper/10 bg-paper/7 p-6"><h3 className="text-xl font-black">{title}</h3><p className="mt-4 leading-7 text-paper/68">{body}</p></div>)}
          </div>
        </div>
      </section>

      <section id="request" className="section-pad bg-paper">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading eyebrow="Request" title="Send your store for review." body="Share the store link, platform, and the problem you want checked first. Oyeola will review the details and respond with the next best step if the store is a fit." />
          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}
