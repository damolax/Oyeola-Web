import Link from 'next/link';
import type { ReactNode } from 'react';
import { logoutAction } from '@/app/admin/actions';

const nav = [
  ['Dashboard', '/admin'], ['Brand', '/admin/settings'], ['Homepage', '/admin/homepage'], ['Services', '/admin/services'], ['Portfolio', '/admin/portfolio'], ['Testimonials', '/admin/testimonials'], ['Resources', '/admin/resources'], ['Leads', '/admin/leads'], ['Contact', '/admin/contact'], ['Legal', '/admin/pages']
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-black/10 bg-white p-5 lg:block">
        <Link href="/admin" className="mb-8 flex items-center gap-3 text-xl font-black"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#111827] text-white">O</span>Oyeola Admin</Link>
        <nav className="grid gap-1">{nav.map(([label, href]) => <Link key={href} href={href} className="rounded-2xl px-4 py-3 text-sm font-bold text-[#4b5563] transition hover:bg-[#f3f4f6] hover:text-[#111827]">{label}</Link>)}</nav>
        <form action={logoutAction} className="absolute bottom-5 left-5 right-5"><button className="w-full rounded-2xl bg-[#111827] px-4 py-3 text-sm font-black text-white">Logout</button></form>
      </aside>
      <main className="lg:pl-72"><div className="container-page py-8">{children}</div></main>
    </div>
  );
}

export function AdminPageHeader({ title, body }: { title: string; body?: string }) {
  return <div className="mb-8"><p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#6b7280]">Private admin</p><h1 className="text-4xl font-black tracking-[-0.04em]">{title}</h1>{body && <p className="mt-3 max-w-2xl leading-7 text-[#6b7280]">{body}</p>}</div>;
}
