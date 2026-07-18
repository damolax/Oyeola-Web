import { PageShell } from '@/components/PageShell';
import { ButtonLink } from '@/components/ButtonLink';
import { getSettings } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function ThankYouPage() {
  const settings = await getSettings();
  return (
    <PageShell>
      <section className="min-h-[72vh] bg-ink py-24 text-paper"><div className="container-page max-w-3xl"><p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-signal">Request received</p><h1 className="text-balance text-5xl font-black tracking-[-0.06em] md:text-7xl">Thank you.</h1><p className="mt-7 text-xl leading-9 text-paper/72">{settings.thankYouMessage}</p><div className="mt-9"><ButtonLink href="/">Back to Home</ButtonLink></div></div></section>
    </PageShell>
  );
}
