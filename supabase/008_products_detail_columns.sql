-- Chạy 1 lần trên SQL Editor để lưu thêm price / views / images
alter table public.products add column if not exists price text not null default 'Liên hệ';
alter table public.products add column if not exists views int;
alter table public.products add column if not exists images jsonb not null default '[]'::jsonb;
