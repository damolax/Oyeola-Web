import Link from 'next/link';
import { ArrowRight, CheckCircle2, Code2, CreditCard, Gauge, Mail, MousePointerClick, Palette, Plug, SearchCheck, ShieldCheck, Sparkles, Video } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { ButtonLink } from '@/components/ButtonLink';
import { FadeIn } from '@/components/Motion';
import { ContactForm } from '@/components/ContactForm';
import { prisma } from '@/lib/db';
import { getSettings } from '@/lib/site';

export const dynamic = 'force-dynamic';

async function getData() {
  const [services, portfolios, testimonials, settings] = await Promise.all([
    prisma.service.findMany({ where: { published: true }, orderBy: { order: 'asc' }, take: 8 }),
    prisma.portfolioItem.findMany({ where: { published: true, showOnHome: true }, orderBy: { updatedAt: 'desc' }, take: 6, include: { categories: true } }),
    prisma.testimonial.findMany({ where: { visible: true, showOnHome: true }, orderBy: { order: 'asc' }, take: 5 }),
    getSettings()
  ]);
  return { services, portfolios, testimonials, settings };
}

const serviceFallbacks = [
  { icon: Palette, title: 'Website Design', body: 'Structure, copy flow, and page layout that make your value obvious fast.' },
  { icon: Code2, title: 'Custom Development', body: 'Functional pages and features that support leads, bookings, sales, and trust.' },
  { icon: Plug, title: 'Plugin Integration', body: 'Connect the tools you already use so the website does more of the admin work.' },
  { icon: CreditCard, title: 'Payment Integration', body: 'Clear checkout paths that reduce friction when a visitor is ready to act.' },
  { icon: ShieldCheck, title: 'Security Optimization', body: 'Cleaner setup, safer forms, and better protection for business-critical pages.' },
  { icon: Gauge, title: 'Analytics Setup', body: 'Understand what people click, where they leave, and what needs improvement.' },
  { icon: SearchCheck, title: 'SEO & AEO', body: 'Pages structured to be understood by people, search engines, and answer engines.' },
  { icon: Video, title: 'Creative Support', body: 'Video, graphics, and visual assets that support the message instead of distracting from it.' }
];

const toolGroups = [
  { label: 'For e-commerce & retail', tools: ['Shopify', 'WooCommerce', 'Klaviyo', 'Stripe'] },
  { label: 'For service businesses', tools: ['WordPress', 'Webflow', 'Wix', 'Calendly'] },
  { label: 'For rapid launches', tools: ['Carrd', 'Framer', 'Squarespace', 'GoDaddy'] },
  { label: 'For strategy & tracking', tools: ['Figma', 'GA4', 'Search Console', 'Hotjar'] }
];

export default async function HomePage() {
  const { services, portfolios, testimonials, settings } = await getData();
  const founderPhoto = settings.founderPhotoUrl || 'https://oyeola-online.lovable.app/assets/hero-portrait-Cj8CyeQo.png';
  const logoUrl = settings.logoUrl || 'https://oyeola-online.lovable.app/assets/logo-DYZWDVSf.png';

  return (
    <PageShell>
      <section id="home" className="hero-grid relative overflow-hidden bg-[#07130f] text-paper">
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_20%_10%,rgba(56,217,150,.28),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(201,138,74,.22),transparent_30%),linear-gradient(180deg,rgba(255,255,255,.06),transparent_40%)]" />
        <div className="container-page relative grid min-h-[780px] items-center gap-12 py-24 lg:grid-cols-[1.02fr_0.98fr]">
          <FadeIn>
            <p className="mb-5 inline-flex rounded-full border border-paper/15 bg-paper/8 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-signal">Web design · conversion · strategy</p>
            <h1 className="max-w-4xl text-balance text-5xl font-black tracking-[-0.065em] md:text-7xl lg:text-8xl">Websites that convert visitors into clients.</h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-paper/74">Oyeola builds clear, structured websites that guide visitors exactly where they need to go — so the page explains the offer, builds trust, and makes the next step obvious.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#contact">Get a Website</ButtonLink>
              <ButtonLink href="#projects" variant="secondary" className="border-paper/15 bg-paper/8 text-paper hover:bg-paper/14">View My Work</ButtonLink>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="relative">
            <div className="relative rounded-[40px] border border-paper/12 bg-paper/10 p-4 shadow-[0_30px_120px_rgba(0,0,0,.35)] backdrop-blur">
              <div className="overflow-hidden rounded-[30px] bg-[#050807] text-paper">
                <div className="relative min-h-[560px] p-6">
                  <div className="absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-[#050807] via-[#050807]/80 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_15%,rgba(56,217,150,.28),transparent_32%),linear-gradient(135deg,#07130f,#0D1117_62%,#111827)]" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={founderPhoto}
                    alt="Olalekan Musodiq Oyekunle, founder of Oyeola"
                    className="absolute bottom-0 right-0 z-[2] h-[94%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_30px_80px_rgba(0,0,0,.55)]"
                  />
                  <div className="relative z-20 flex items-center justify-between">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoUrl} alt="Oyeola Online logo" className="h-10 w-auto rounded-xl bg-black/20 object-contain" />
                    <span className="h-3 w-3 rounded-full bg-signal shadow-[0_0_24px_rgba(56,217,150,.8)]" />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 z-20 max-w-sm rounded-[28px] border border-paper/10 bg-black/32 p-5 backdrop-blur-md">
                    <p className="text-sm font-bold text-signal">Conversion-first page structure</p>
                    <h2 className="mt-3 text-4xl font-black tracking-[-.05em]">Make the next step impossible to miss.</h2>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 border-t border-paper/10 bg-paper p-4 text-ink">
                  {['Clarity', 'Trust', 'Action'].map((item) => <div key={item} className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-center text-sm font-black">{item}</div>)}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-paper py-8">
        <div className="container-page grid gap-3 md:grid-cols-4">
          {['Structured pages', 'Clear customer path', 'Editable admin', 'Lead capture ready'].map((item) => (
            <div key={item} className="rounded-[22px] border border-ink/10 bg-white/70 p-5 text-sm font-black text-slateText shadow-sm">{item}</div>
          ))}
        </div>
      </section>

      <section id="problem" className="section-pad bg-paper">
        <div className="container-page grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <FadeIn>
            <p className="section-eyebrow">The problem</p>
            <h2 className="section-title">Most websites do not fail because of design. They fail because of structure.</h2>
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['The museum trap', 'The site looks fine, but a visitor cannot quickly tell what is in it for them.'],
              ['The maze', 'People scroll, think too hard, and leave because the next step is not obvious.'],
              ['The admin nightmare', 'You keep explaining the same things manually because the website is not doing the explaining.']
            ].map(([title, body], index) => (
              <FadeIn key={title} delay={index * 0.04} className="rounded-[30px] border border-ink/10 bg-white/75 p-6 shadow-sm">
                <MousePointerClick className="mb-7 h-7 w-7 text-signal" />
                <h3 className="mb-3 text-xl font-black tracking-[-.03em]">{title}</h3>
                <p className="leading-7 text-slateText">{body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className="section-pad bg-[#0D1117] text-paper">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_.9fr]">
          <FadeIn>
            <p className="section-eyebrow text-signal">The solution</p>
            <h2 className="section-title">I build websites with a clear purpose.</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/70">A good website is not a digital brochure. Every headline, section, button, proof point, and form should help the visitor understand the offer, trust the business, and take the next step without confusion.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Clear offer', 'Stronger trust', 'Cleaner action path', 'Less manual explaining'].map((item) => <span key={item} className="rounded-full border border-paper/12 bg-paper/8 px-4 py-2 text-sm font-bold text-paper/70">{item}</span>)}
            </div>
          </FadeIn>
          <FadeIn delay={0.08} className="rounded-[34px] border border-paper/10 bg-paper/8 p-6">
            <div className="rounded-[26px] bg-paper p-6 text-ink">
              <p className="text-xs font-black uppercase tracking-[.22em] text-copper">Page flow</p>
              <div className="mt-5 grid gap-3">
                {['Who this is for', 'What problem it solves', 'Why trust it', 'What happens next'].map((item, index) => <div key={item} className="flex items-center gap-4 rounded-2xl bg-ink/[0.04] p-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper text-xs font-black">0{index + 1}</span><span className="font-black">{item}</span></div>)}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="services" className="section-pad bg-sand/55">
        <div className="container-page">
          <div className="mb-10 max-w-3xl">
            <p className="section-eyebrow">Services</p>
            <h2 className="section-title">What I actually help you solve.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(services.length ? services : []).slice(0, 8).map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`} className="group rounded-[28px] border border-ink/10 bg-paper p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <Sparkles className="mb-8 h-7 w-7 text-signal" />
                <h3 className="text-xl font-black tracking-[-.03em]">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slateText">{service.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ink">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
            {!services.length && serviceFallbacks.map((service) => {
              const Icon = service.icon;
              return <div key={service.title} className="rounded-[28px] border border-ink/10 bg-paper p-6 shadow-sm"><Icon className="mb-8 h-7 w-7 text-signal" /><h3 className="text-xl font-black tracking-[-.03em]">{service.title}</h3><p className="mt-4 text-sm leading-7 text-slateText">{service.body}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section id="projects" className="section-pad bg-paper">
        <div className="container-page">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-eyebrow">Selected work</p>
              <h2 className="section-title">Recent projects and breakdowns.</h2>
            </div>
            <ButtonLink href="/portfolio" variant="secondary">View Full Portfolio</ButtonLink>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((item) => (
              <Link key={item.id} href={`/portfolio/${item.slug}`} className="group overflow-hidden rounded-[32px] border border-ink/10 bg-white/75 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <div className="aspect-[4/3] bg-[linear-gradient(135deg,#111827,#27342f_55%,#38D996)] p-5 text-paper">
                  <span className="rounded-full bg-paper/12 px-3 py-1 text-xs font-black uppercase tracking-[.14em]">{item.sampleLabel || 'Case'}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black tracking-[-.04em]">{item.title}</h3>
                  <p className="mt-4 leading-7 text-slateText">{item.problem}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ink">View case <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="stack" className="section-pad bg-[#07130f] text-paper">
        <div className="container-page">
          <p className="section-eyebrow text-signal">Stack</p>
          <h2 className="section-title">Platforms and tools I can work with.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {toolGroups.map((group) => <FadeIn key={group.label} className="rounded-[28px] border border-paper/10 bg-paper/7 p-6"><h3 className="mb-5 font-black">{group.label}</h3><div className="flex flex-wrap gap-2">{group.tools.map((tool) => <span key={tool} className="rounded-full bg-paper/10 px-3 py-2 text-sm text-paper/75">{tool}</span>)}</div></FadeIn>)}
          </div>
        </div>
      </section>

      <section id="process" className="section-pad bg-paper">
        <div className="container-page">
          <p className="section-eyebrow">Process</p>
          <h2 className="section-title">No confusion. Just a clear process.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              ['Understand', 'We diagnose your business, ideal customer, and the action your page needs to create.'],
              ['Design', 'We map a clear structure and write the copy flow that makes people click.'],
              ['Build', 'I construct a responsive, functional website while you focus on the business.'],
              ['Launch', 'You get the keys to a website that is ready to publish, edit, and use.']
            ].map(([title, body], index) => <FadeIn key={title} delay={index * 0.04} className="rounded-[30px] border border-ink/10 bg-white/70 p-6"><span className="text-5xl font-black tracking-[-.07em] text-ink/12">0{index + 1}</span><h3 className="mt-6 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-slateText">{body}</p></FadeIn>)}
          </div>
        </div>
      </section>

      <section id="reviews" className="section-pad bg-sand/55">
        <div className="container-page grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="section-eyebrow">Reviews</p>
            <h2 className="section-title">What clients say.</h2>
          </div>
          <div className="grid gap-4">
            {(testimonials.length ? testimonials : [
              { id: 'one', quote: 'He did not just design it, he made it make sense.', clientName: 'Client', company: 'Business owner' },
              { id: 'two', quote: 'Now people actually understand what I do.', clientName: 'Client', company: 'Service brand' },
              { id: 'three', quote: 'Clean, simple, and it works.', clientName: 'Client', company: 'Founder' }
            ]).map((item) => <FadeIn key={item.id} className="rounded-[28px] border border-ink/10 bg-paper p-6 shadow-sm"><p className="text-xl font-black leading-9 tracking-[-.02em]">“{item.quote}”</p><p className="mt-4 text-sm font-bold text-slateText">{item.clientName}{item.company ? ` · ${item.company}` : ''}</p></FadeIn>)}
          </div>
        </div>
      </section>

      <section id="about" className="section-pad bg-paper">
        <div className="container-page grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <FadeIn className="overflow-hidden rounded-[36px] bg-[#0D1117] p-4 text-paper shadow-soft">
            <div className="relative aspect-square overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#07130f,#0D1117_60%,#38D996)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={founderPhoto} alt="Olalekan Musodiq Oyekunle" className="absolute inset-x-0 bottom-0 mx-auto h-full w-auto object-contain object-bottom" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6"><h3 className="text-5xl font-black tracking-[-.06em]">Oyeola</h3></div>
            </div>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="section-eyebrow">About me</p>
            <h2 className="section-title">Websites that work, not just websites that look good.</h2>
            <p className="mt-6 text-lg leading-8 text-slateText">I design websites for businesses that want something clear, functional, and effective — not just something that looks good in a screenshot. The goal is simple: make it easy for a visitor to understand your business, trust your offer, and contact you.</p>
            <ul className="mt-8 grid gap-3 text-slateText">
              {['Clear structure before decoration.', 'Conversion-focused copy and page flow.', 'Admin-ready setup so you can edit the site later.'].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-signal" />{item}</li>)}
            </ul>
          </FadeIn>
        </div>
      </section>

      <section id="contact" className="section-pad bg-[#07130f] text-paper">
        <div className="container-page grid gap-10 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <p className="section-eyebrow text-signal">Contact</p>
            <h2 className="section-title">If your website is not helping your business, it is time to fix that.</h2>
            <p className="mt-6 text-lg leading-8 text-paper/70">Send the main thing you need: a new website, a redesign, a store review, a booking/payment setup, or a clearer contact path. The details will be stored in your private admin leads inbox.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}
