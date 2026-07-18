import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import type { ReactNode } from 'react';

export async function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
