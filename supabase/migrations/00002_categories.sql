create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.categories enable row level security;
create policy "Public users can read categories" on public.categories for select using (true);
create policy "Service role has full access to categories" on public.categories for all using (true) with check (true);
