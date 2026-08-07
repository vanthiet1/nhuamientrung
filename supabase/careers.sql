-- Tuyển dụng — chạy trong SQL Editor (tùy chọn, sau schema_and_seed.sql)

create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null default 'Đà Nẵng',
  type text not null default 'Toàn thời gian',
  salary text not null default 'Thỏa thuận',
  description text not null default '',
  requirements jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.careers enable row level security;

drop policy if exists "Public read careers" on public.careers;
create policy "Public read careers"
  on public.careers for select to anon, authenticated using (true);

grant select on public.careers to anon, authenticated;
