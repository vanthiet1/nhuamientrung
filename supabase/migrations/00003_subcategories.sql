create table public.subcategories (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references public.categories(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.subcategories enable row level security;
create policy "Public users can read subcategories" on public.subcategories for select using (true);
create policy "Service role has full access to subcategories" on public.subcategories for all using (true) with check (true);
