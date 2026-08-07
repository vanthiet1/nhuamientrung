-- Add detail fields to products (run in SQL Editor if not exists)
alter table public.products add column if not exists price text not null default 'Liên hệ';
alter table public.products add column if not exists views int;
alter table public.products add column if not exists images jsonb not null default '[]'::jsonb;
