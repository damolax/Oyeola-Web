import { loginAction } from '../actions';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  if (getAdminSession()) redirect('/admin');
  return (
    <main className="grid min-h-screen place-items-center bg-[#0D1117] p-6 text-white">
      <form action={loginAction} className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/8 p-8 shadow-soft backdrop-blur">
        <div className="mb-8"><div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#38D996] text-xl font-black text-[#0D1117]">O</div><h1 className="text-3xl font-black tracking-[-0.04em]">Oyeola admin login</h1><p className="mt-3 leading-7 text-white/60">Use the admin password from your environment variables.</p></div>
        {searchParams?.error && <p className="mb-4 rounded-2xl bg-red-500/12 p-3 text-sm font-bold text-red-200">Incorrect password.</p>}
        <label className="grid gap-2 text-sm font-bold">Password<input name="password" type="password" className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-[#111827]" required /></label>
        <button className="mt-6 w-full rounded-2xl bg-[#38D996] px-5 py-3 text-sm font-black text-[#0D1117]">Login</button>
      </form>
    </main>
  );
}
