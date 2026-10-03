-- Oyeola CMS schema
-- Run this in the same Supabase project used by the site.
-- The public website can only read published content.
-- Admin writes are performed by server-side Vercel functions using SUPABASE_SERVICE_ROLE_KEY.

create table if not exists public.cms_content (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('project','review','service','tool','skill','credential','demo','stat','setting')),
  slug text not null,
  title text not null,
  excerpt text,
  data jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  featured_home boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(content_type, slug)
);

create index if not exists cms_content_type_idx on public.cms_content(content_type);
create index if not exists cms_content_published_idx on public.cms_content(published);
create index if not exists cms_content_featured_idx on public.cms_content(featured_home);

create or replace function public.set_cms_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_content_updated_at on public.cms_content;
create trigger cms_content_updated_at
before update on public.cms_content
for each row execute function public.set_cms_updated_at();

alter table public.cms_content enable row level security;

revoke all on table public.cms_content from anon, authenticated;
grant select on table public.cms_content to anon, authenticated;

drop policy if exists "public can read published cms content" on public.cms_content;
create policy "public can read published cms content"
on public.cms_content
for select
to anon, authenticated
using (published = true);

-- Seed the homepage proof statistics.
insert into public.cms_content (content_type, slug, title, excerpt, data, published, featured_home, sort_order)
values
('stat','website-projects','150+','Website design projects completed','{"value":150,"suffix":"+","label":"Website design projects completed","href":"/work.html"}',true,true,10),
('stat','fiverr-reviews','400+','Fiverr reviews','{"value":400,"suffix":"+","label":"Fiverr reviews","href":"/testimonials.html"}',true,true,20),
('stat','projects-completed','500+','Projects completed','{"value":500,"suffix":"+","label":"Projects completed","href":"/work.html"}',true,true,30),
('stat','tools-platforms','10+','Tools & platforms','{"value":10,"suffix":"+","label":"Tools & platforms","href":"/about.html#toolbox"}',true,true,40)
on conflict (content_type, slug) do nothing;

-- Helpful example project fields stored in data JSON:
-- {
--   "service":"websites",
--   "industry":"hospitality",
--   "platform":"Wix",
--   "year":"2026",
--   "live_url":"https://...",
--   "thumbnail_url":"https://...",
--   "hero_image_url":"https://...",
--   "fullpage_image_url":"https://...",
--   "video_url":"https://...",
--   "gallery":[{"url":"...","caption":"Homepage","type":"image"}],
--   "tools":["Wix","Figma"],
--   "skills":["UI/UX Design","Responsive Design"],
--   "story":{"goal":"...","challenge":"...","solution":"...","result":"..."},
--   "branding":{"logo_designed":false,"identity_designed":false},
--   "related_demo":"travel",
--   "testimonial_slug":"..."
-- };


-- Public media bucket for portfolio screenshots, logos, thumbnails and protected sample assets.
-- Large walkthrough videos should preferably use a video host/CDN and be linked by URL.
insert into storage.buckets (id, name, public, file_size_limit)
values ('oyeola-media','oyeola-media',true,10485760)
on conflict (id) do update set public=true, file_size_limit=10485760;
