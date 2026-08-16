create table public.banners (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text not null,
  badge text not null,
  cta text not null,
  href text not null,
  image text not null,
  gradient text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.banners enable row level security;
create policy "Public users can read active banners" on public.banners for select using (is_active = true);
create policy "Service role has full access to banners" on public.banners for all using (true) with check (true);
