-- ============================================================
-- 010 — Ensure products.sku exists + optional uniqueness index
-- Run in Supabase SQL Editor if needed
-- ============================================================

alter table public.products
  add column if not exists sku text not null default '';

-- Unique when sku is not empty (allows many blank skus)
create unique index if not exists products_sku_unique_nonempty_idx
  on public.products (lower(sku))
  where sku <> '';

comment on column public.products.sku is 'Mã sản phẩm (SKU)';
