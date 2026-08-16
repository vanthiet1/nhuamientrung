create table public.quote_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  company_name text,
  phone text not null,
  email text,
  product_type text not null,
  industry text,
  quantity_expected text not null,
  dimensions text,
  material text,
  print_colors text,
  deadline text,
  delivery_destination text not null,
  details text,
  reference_file_url text,
  reference_file_name text,
  status text not null default 'pending',
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now()
);

alter table public.quote_requests enable row level security;
create policy "Public users can insert quote requests" on public.quote_requests for insert with check (true);
create policy "Service role has full access to quote requests" on public.quote_requests for all using (true) with check (true);
