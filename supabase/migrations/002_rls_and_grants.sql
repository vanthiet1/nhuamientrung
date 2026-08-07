-- ============================================================
-- 002 — RLS policies + grants
-- Project: https://wlfdvgauofnyqsgizuop.supabase.co
-- ============================================================


alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.products enable row level security;
alter table public.news enable row level security;
alter table public.contact_messages enable row level security;
alter table public.careers enable row level security;

-- Drop policies if re-run
do $$ begin
  drop policy if exists "Public read categories" on public.categories;
  drop policy if exists "Public read subcategories" on public.subcategories;
  drop policy if exists "Public read products" on public.products;
  drop policy if exists "Public read news" on public.news;
  drop policy if exists "Public insert contact_messages" on public.contact_messages;
  drop policy if exists "Public read careers" on public.careers;
end $$;

create policy "Public read categories"
  on public.categories for select to anon, authenticated using (true);
create policy "Public read subcategories"
  on public.subcategories for select to anon, authenticated using (true);
create policy "Public read products"
  on public.products for select to anon, authenticated using (true);
create policy "Public read news"
  on public.news for select to anon, authenticated using (true);
create policy "Public insert contact_messages"
  on public.contact_messages for insert to anon, authenticated with check (true);
create policy "Public read careers"
  on public.careers for select to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.subcategories, public.products, public.news, public.careers to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
