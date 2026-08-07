# Supabase migrations — Bao Bì Thành Phát

Project: https://supabase.com/dashboard/project/wlfdvgauofnyqsgizuop

## Trạng thái hiện tại (đã chạy)

| Bảng | Số dòng | Ghi chú |
|------|--------:|---------|
| `categories` | 7 | OK |
| `subcategories` | 23 | OK |
| `products` | 103 | OK + ảnh |
| `news` | 6 | OK |
| `contact_messages` | 0+ | form liên hệ |
| `careers` | — | **Chưa tạo** → chạy `007_seed_careers.sql` |

## Cấu trúc file

### File tổng (giữ nguyên — chạy 1 lần)

| File | Mô tả |
|------|--------|
| **`schema_and_seed.sql`** | **ALL-IN-ONE**: tạo bảng + RLS + seed (đã chạy) |

### Tách theo từng bước (`migrations/`)

| # | File | Nội dung |
|---|------|----------|
| 001 | `migrations/001_create_tables.sql` | Tạo bảng + index |
| 002 | `migrations/002_rls_and_grants.sql` | RLS + GRANT |
| 003 | `migrations/003_seed_categories.sql` | Seed danh mục cha |
| 004 | `migrations/004_seed_subcategories.sql` | Seed danh mục con |
| 005 | `migrations/005_seed_products.sql` | Seed sản phẩm |
| 006 | `migrations/006_seed_news.sql` | Seed tin tức |
| 007 | `migrations/007_seed_careers.sql` | Bảng + seed tuyển dụng |

Bản copy ở thư mục `supabase/` (001–007) để mở nhanh.

### File phụ

- `007_careers_only.sql` — chỉ careers (nếu cần chạy riêng)
- `contact_messages.sql` — bản cũ (đã gộp vào 001)

## Cách chạy

### Lần đầu (đã xong nếu bạn đã Run file tổng)

```
schema_and_seed.sql
```

### Chỉ bổ sung tuyển dụng (còn thiếu)

1. SQL Editor → paste `007_seed_careers.sql` → **Run**

### Chạy từng file (môi trường mới)

Chạy **đúng thứ tự** 001 → 007.

## Seed lại từ JSON (API)

Sau khi bảng đã có:

```bash
node scripts/seed-supabase.mjs
```

Cần `SUPABASE_SERVICE_ROLE_KEY` trong `.env.local`.

## Kiểm tra nhanh

```sql
select 'categories' t, count(*) from categories
union all select 'subcategories', count(*) from subcategories
union all select 'products', count(*) from products
union all select 'news', count(*) from news
union all select 'careers', count(*) from careers;
```

## Chi tiết sản phẩm (đã scrape từ mangcopvc.vn)

Đã cập nhật **103** sản phẩm với:

- `name`, `sku`, `description`, `content` (mô tả đầy đủ từ tab “Thông tin sản phẩm”)
- `image` (ảnh chính)
- Local JSON thêm: `price`, `views`, `images[]` (gallery)

Tùy chọn thêm cột DB:

```sql
-- file: 008_products_detail_columns.sql
alter table public.products add column if not exists price text not null default 'Liên hệ';
alter table public.products add column if not exists views int;
alter table public.products add column if not exists images jsonb not null default '[]'::jsonb;
```
