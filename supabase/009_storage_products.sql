-- ============================================================
-- 009 — Supabase Storage bucket for product / CMS images
-- Run in Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- Public bucket so website can load images via public URL
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'products',
  'products',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read (anyone can view uploaded images)
drop policy if exists "products_public_read" on storage.objects;
create policy "products_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'products');

-- Note: Admin uploads go through Next.js API with SERVICE_ROLE_KEY,
-- which bypasses storage RLS. No insert policy needed for anon.
