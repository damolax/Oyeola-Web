import Link from 'next/link';
import { getNavigation, getSettings } from '@/lib/site';
import { parseJson } from '@/lib/json';

export async function SiteFooter() {
  const [settings, nav] = await Promise.all([getSettings(), getNavigation()]);
  const socials = parseJson<{ label: string; href: string }[]>(settings.socialLinksJson, []);
  return (
    <footer className="border-t border-ink/10 bg-ink text-paper">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3 text-xl font-black">
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoUrl} alt={`${settings.brandName} logo`} className="h-10 w-auto rounded-xl bg-black/20 object-contain" />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-signal text-ink">O</span>
            )}
            {settings.brandName}
          </div>
          <p className="max-w-xl text-sm leading-7 text-paper/70">{settings.footerText}</p>
        </div>
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-paper/40">Pages</p>
          <div className="grid gap-2 text-sm text-paper/74">
            {nav.map((item) => <Link key={item.href} href={item.href} className="hover:text-paper">{item.label}</Link>)}
            <Link href="/privacy" className="hover:text-paper">Privacy</Link>
            <Link href="/terms" className="hover:text-paper">Terms</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-paper/40">Connect</p>
          <div className="grid gap-2 text-sm text-paper/74">
            {socials.map((item) => <Link key={item.label} href={item.href} className="hover:text-paper">{item.label}</Link>)}
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/50">© {new Date().getFullYear()} {settings.brandName}. Built for practical ecommerce diagnosis.</div>
    </footer>
  );
}
