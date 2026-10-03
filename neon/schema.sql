-- Oyeola Online Neon schema
-- Live production database: oyeola_web
-- Production branch: oyeola-web-production

create extension if not exists pgcrypto;

create table if not exists public.cms_items (
  id uuid primary key default gen_random_uuid(),
  item_type text not null,
  slug text not null,
  title text not null default '',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured_home boolean not null default false,
  sort_order integer not null default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(item_type, slug)
);

create or replace function public.touch_cms_item()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_items_touch on public.cms_items;
create trigger cms_items_touch
before update on public.cms_items
for each row execute function public.touch_cms_item();

create or replace view public.cms_public_items as
select id,item_type,slug,title,featured_home,sort_order,data,updated_at
from public.cms_items
where status='published';

create table if not exists public.cms_admin_config (
  id integer primary key default 1 check (id=1),
  setup_hash text not null,
  setup_used boolean not null default false,
  password_hash text,
  auth_user_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_admin_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

-- Neon Data API roles.
grant select on public.cms_public_items to anonymous;
grant select,insert,update,delete on public.cms_items to authenticated;
grant select on public.cms_public_items to authenticated;

-- Lead records are stored in cms_items with item_type='lead' and status='draft'.
-- They are therefore never exposed through cms_public_items.

-- Homepage proof stats.
insert into public.cms_items(item_type,slug,title,status,featured_home,sort_order,data)
values
('stat','website-projects','Website Design Projects','published',true,1,'{"value":150,"suffix":"+","label":"Website design projects completed","href":"/work.html"}'),
('stat','fiverr-reviews','Fiverr Reviews','published',true,2,'{"value":400,"suffix":"+","label":"Fiverr reviews","href":"/testimonials.html"}'),
('stat','projects-completed','Projects Completed','published',true,3,'{"value":500,"suffix":"+","label":"Projects completed","href":"/work.html"}'),
('stat','tools-platforms','Tools & Platforms','published',true,4,'{"value":10,"suffix":"+","label":"Tools & platforms","href":"/about.html#toolbox"}')
on conflict (item_type,slug) do update set
  title=excluded.title,
  status=excluded.status,
  featured_home=excluded.featured_home,
  sort_order=excluded.sort_order,
  data=excluded.data,
  updated_at=now();
