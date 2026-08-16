create table public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  subject text not null,
  content text not null,
  type text not null default 'contact',
  cv_url text,
  cv_file_name text,
  is_read boolean not null default false,
  remote_id text,
  created_at timestamp with time zone not null default now()
);

alter table public.contact_messages enable row level security;
create policy "Public users can insert contact messages" on public.contact_messages for insert with check (true);
create policy "Service role has full access to contact messages" on public.contact_messages for all using (true) with check (true);
