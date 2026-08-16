create table public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text not null,
  content text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  subcategory_id uuid references public.subcategories(id) on delete set null,
  image text not null,
  images jsonb,
  sku text not null,
  price text,
  views integer default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.products enable row level security;
create policy "Public users can read active products" on public.products for select using (is_active = true);
create policy "Service role has full access to products" on public.products for all using (true) with check (true);
