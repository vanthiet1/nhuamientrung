create table public.product_reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  content text not null,
  rating integer not null default 5,
  status text not null default 'pending',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.product_reviews enable row level security;
create policy "Public users can insert reviews" on public.product_reviews for insert with check (true);
create policy "Public users can read approved reviews" on public.product_reviews for select using (status = 'approved');
create policy "Service role has full access to reviews" on public.product_reviews for all using (true) with check (true);
