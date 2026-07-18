import Link from 'next/link';
import { getNavigation, getSettings } from '@/lib/site';
import { ButtonLink } from './ButtonLink';

export async function SiteHeader() {
  const [settings, nav] = await Promise.all([getSettings(), getNavigation()]);
  const navItems = nav.length ? nav : [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Process', href: '/#process' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Contact', href: '/#contact' }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
      <div className="container-page flex min-h-[74px] items-center justify-between gap-5">
        <Link href="/#home" className="flex items-center gap-3 font-black tracking-tight">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt={`${settings.brandName} logo`} className="h-9 w-auto rounded-xl" />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-paper">O</span>
          )}
          <span>{settings.brandName}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-bold text-slateText lg:flex">
          {navItems.map((item) => (
            <Link key={`${item.label}-${item.href}`} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <ButtonLink href="/#contact">Get a Website</ButtonLink>
        </div>
      </div>
    </header>
  );
}
