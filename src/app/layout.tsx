import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
import './globals.css';
import { getSettings } from '@/lib/site';
import { parseJson } from '@/lib/json';
import type { CSSProperties, ReactNode } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.seoTitle,
      template: `%s | ${settings.brandName}`
    },
    description: settings.seoDescription,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: settings.ogImage ? [settings.ogImage] : []
    }
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  const nav = parseJson(settings.navigationJson, []);
  const style = {
    '--color-ink': settings.primaryColor,
    '--color-charcoal': settings.secondaryColor,
    '--color-paper': settings.backgroundColor,
    '--color-sand': settings.mutedColor,
    '--color-signal': settings.accentColor,
    '--color-copper': settings.copperColor,
    '--color-slate-text': settings.textColor,
    '--button-radius': settings.buttonRadius,
    fontFamily: settings.fontFamily ? `${settings.fontFamily}, Inter, ui-sans-serif, system-ui, sans-serif` : undefined
  } as CSSProperties;

  return (
    <html lang="en">
      <body style={style} data-nav-count={Array.isArray(nav) ? nav.length : 0}>{children}</body>
    </html>
  );
}
