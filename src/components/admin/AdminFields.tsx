import type { ReactNode } from 'react';

export function Field({ label, name, defaultValue = '', type = 'text', help }: { label: string; name: string; defaultValue?: string | number | null; type?: string; help?: string }) {
  return <label className="admin-label">{label}{help && <span className="admin-help">{help}</span>}<input className="admin-input" name={name} type={type} defaultValue={defaultValue ?? ''} /></label>;
}

export function TextArea({ label, name, defaultValue = '', rows = 5, help }: { label: string; name: string; defaultValue?: string | null; rows?: number; help?: string }) {
  return <label className="admin-label">{label}{help && <span className="admin-help">{help}</span>}<textarea className="admin-input" name={name} rows={rows} defaultValue={defaultValue ?? ''} /></label>;
}

export function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return <label className="flex items-center gap-2 text-sm font-bold text-[#374151]"><input name={name} type="checkbox" defaultChecked={defaultChecked} /> {label}</label>;
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">{children}</div>;
}

export function Submit({ children = 'Save changes' }: { children?: ReactNode }) {
  return <button className="rounded-2xl bg-[#111827] px-5 py-3 text-sm font-black text-white">{children}</button>;
}
