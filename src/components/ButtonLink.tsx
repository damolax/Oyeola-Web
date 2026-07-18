import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function ButtonLink({ href, children, variant = 'primary', className }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'dark'; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center rounded-button px-5 py-3 text-sm font-extrabold transition focus:outline-none focus:ring-4',
        variant === 'primary' && 'bg-signal text-ink shadow-soft hover:-translate-y-0.5 focus:ring-signal/20',
        variant === 'secondary' && 'border border-ink/15 bg-white/50 text-ink hover:bg-white focus:ring-ink/10',
        variant === 'dark' && 'bg-ink text-paper hover:-translate-y-0.5 focus:ring-ink/20',
        className
      )}
    >
      {children}
    </Link>
  );
}
