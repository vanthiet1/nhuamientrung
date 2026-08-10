-- ============================================================
-- Bao Bì Thành Phát — Schema + Seed từ mangcopvc.vn/san-pham
-- Scraped: 2026-08-07T04:45:24.660Z
-- Counts: 7 categories, 23 subcategories, 103 products
-- Chạy trong: Supabase Dashboard → SQL Editor → New query → Run
-- Project: https://wlfdvgauofnyqsgizuop.supabase.co
-- ============================================================

-- Drop old (safe re-run)
drop table if exists public.products cascade;
drop table if exists public.subcategories cascade;
drop table if exists public.categories cascade;
drop table if exists public.news cascade;
drop table if exists public.contact_messages cascade;

-- ── categories (danh mục cha) ──
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

-- ── subcategories (danh mục con) ──
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

-- ── products (sản phẩm) ──
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

-- ── news (tin tức) ──
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

-- ── contact_messages ──
create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text,
  subject text,
  content text not null,
  created_at timestamptz not null default now()
);

-- ── RLS ──
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.products enable row level security;
alter table public.news enable row level security;
alter table public.contact_messages enable row level security;

-- Public read (anon + authenticated)
create policy "Public read categories"
  on public.categories for select to anon, authenticated using (true);
create policy "Public read subcategories"
  on public.subcategories for select to anon, authenticated using (true);
create policy "Public read products"
  on public.products for select to anon, authenticated using (true);
create policy "Public read news"
  on public.news for select to anon, authenticated using (true);

-- Public insert contact form
create policy "Public insert contact_messages"
  on public.contact_messages for insert to anon, authenticated with check (true);

-- Grants for Data API
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.subcategories, public.products, public.news to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;

-- Tạo bảng banners
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  badge text not null default '',
  cta text not null default 'Xem thêm',
  href text not null default '/san-pham',
  image text not null default '',
  gradient text not null default 'from-brand-800 via-brand-600 to-brand-500',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tạo bảng careers
create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null default 'Đà Nẵng',
  type text not null default 'Toàn thời gian',
  salary text not null default 'Thỏa thuận',
  description text not null default '',
  requirements jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Thêm cột vào products
alter table public.products add column if not exists views int not null default 0;

-- BỔ SUNG: Thêm các cột còn thiếu cho bảng contact_messages để Admin có thể đếm số lượng tin nhắn chưa đọc
alter table public.contact_messages 
add column if not exists type text not null default 'contact',
add column if not exists cv_url text not null default '',
add column if not exists cv_file_name text not null default '',
add column if not exists is_read boolean not null default false;

-- Phân quyền cho phép đọc public
alter table public.banners enable row level security;
create policy "Public read banners" on public.banners for select to anon, authenticated using (true);
grant select on public.banners to anon, authenticated;

alter table public.careers enable row level security;
create policy "Public read careers" on public.careers for select to anon, authenticated using (true);
grant select on public.careers to anon, authenticated;
