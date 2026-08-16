create table public.careers (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  location text not null,
  type text not null,
  salary text not null,
  description text not null,
  requirements jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.careers enable row level security;
create policy "Public users can read active careers" on public.careers for select using (is_active = true);
create policy "Service role has full access to careers" on public.careers for all using (true) with check (true);
