-- Run this SQL in Supabase SQL Editor to store contact form submissions.
-- Dashboard → SQL Editor → New query → Paste & Run

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text,
  subject text,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Allow anonymous inserts from the public contact form
create policy "Allow public insert contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Optional: only service role / authenticated admin can read
-- (no select policy for anon = public cannot read messages)
