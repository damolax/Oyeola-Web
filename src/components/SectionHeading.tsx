export function SectionHeading({ eyebrow, title, body, center = false }: { eyebrow?: string; title: string; body?: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto mb-12 max-w-3xl text-center' : 'mb-10 max-w-3xl'}>
      {eyebrow && <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-copper">{eyebrow}</p>}
      <h2 className="text-balance text-3xl font-black tracking-[-0.04em] text-ink md:text-5xl">{title}</h2>
      {body && <p className="mt-5 text-lg leading-8 text-slateText">{body}</p>}
    </div>
  );
}
