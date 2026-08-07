-- ============================================================
-- 001 — Create tables + indexes
-- Project: https://wlfdvgauofnyqsgizuop.supabase.co
-- ============================================================


-- Safe re-run
drop table if exists public.products cascade;
drop table if exists public.subcategories cascade;
drop table if exists public.categories cascade;
drop table if exists public.news cascade;
drop table if exists public.contact_messages cascade;
drop table if exists public.careers cascade;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  image text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text not null default '',
  image text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index subcategories_category_id_idx on public.subcategories(category_id);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  subcategory_id uuid references public.subcategories(id) on delete set null,
  slug text not null unique,
  name text not null,
  description text not null default '',
  content text not null default '',
  sku text not null default '',
  image text not null default '',
  source_url text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_id_idx on public.products(category_id);
create index products_subcategory_id_idx on public.products(subcategory_id);
create index products_is_active_idx on public.products(is_active);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  image text not null default '',
  published_at date not null default current_date,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text,
  subject text,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.careers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null default 'Đà Nẵng',
  type text not null default 'Toàn thời gian',
  salary text not null default 'Thỏa thuận',
  description text not null default '',
  requirements jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
