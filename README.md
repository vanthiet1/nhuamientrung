# Bao Bì Thành Phát

Website dịch vụ bao bì — **CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ BAO BÌ THÀNH PHÁT**

Stack: **Next.js 16** · **TypeScript** · **Tailwind CSS** · **Supabase**

## Chạy dự án

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Biến môi trường

File `.env.local` (đã cấu hình sẵn):

```
NEXT_PUBLIC_SUPABASE_URL=https://wlfdvgauofnyqsgizuop.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Admin CMS
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ThanhPhat@2026
ADMIN_SESSION_SECRET=baobi-thanhphat-session-secret-change-me-32chars
```

## Admin CMS

URL: [http://localhost:3000/admin](http://localhost:3000/admin)

| Trường | Giá trị mặc định |
|--------|------------------|
| Username | `admin` |
| Password | `ThanhPhat@2026` |

**Chức năng CRUD:**
- Danh mục cha
- Danh mục con
- Sản phẩm
- Tin tức

Dữ liệu lưu tại thư mục `data/*.json` (categories, subcategories, products, news).  
Website public đọc trực tiếp từ các file này.

## Supabase

- Client browser: `src/lib/supabase/client.ts`
- Client server: `src/lib/supabase/server.ts`
- Middleware refresh session: `src/middleware.ts` + `src/lib/supabase/middleware.ts`

### Form liên hệ (tùy chọn)

Chạy SQL trong Supabase SQL Editor:

```bash
# File: supabase/contact_messages.sql
```

## Trang

| Route | Mô tả |
|-------|--------|
| `/` | Trang chủ |
| `/gioi-thieu` | Giới thiệu |
| `/san-pham` | Danh mục sản phẩm (cha/con) |
| `/san-pham/[slug]` | Chi tiết danh mục |
| `/tin-tuc` | Tin tức |
| `/tin-tuc/[slug]` | Chi tiết bài viết |
| `/tuyen-dung` | Tuyển dụng |
| `/lien-he` | Liên hệ + form + bản đồ |

## Tính năng UI

- Menu dropdown danh mục cha / con
- Footer đầy đủ thông tin công ty
- Nút **Zalo** + **Hotline** nổi (floating)
- Slider trang chủ kiểu site bao bì

## Thông tin công ty

- **MST:** 0402203761  
- **Địa chỉ:** 12 Hà Đông 2, Phường Thanh Khê, TP. Đà Nẵng  
- **ĐT:** 0236 3725379  
- **Email:** contact@baobithanhphat.com  
- **STK:** 115002948432 — VietinBank CN Đà Nẵng  
# baobithanhphat
