create table public.news (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  published_at timestamp with time zone not null default now(),
  image text not null,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.news enable row level security;
create policy "Public users can read published news" on public.news for select using (is_published = true);
create policy "Service role has full access to news" on public.news for all using (true) with check (true);
