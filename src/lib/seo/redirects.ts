import { type NextRequest } from "next/server";

/**
 * Exact mapping table for legacy indexed slugs (from old nhuamientrung.vn domain)
 * to current active URLs on the new site.
 */
const EXACT_SLUG_MAP: Record<string, string> = {
  // Product old slugs
  "xop-no-mang-co-nhat-chai-1": "/san-pham/in-mang-co-nhan-chai",
  "xop-mang-co-nhat-chai-1": "/san-pham/in-mang-co-nhan-chai",
  "xop-nhat-chai-1-chuyen-nhiet": "/san-pham/in-mang-chuyen-nhiet",
  "mang-co-bao-ve-go-tu-mat-mang-co-boc-hop-qua-da-nang":
    "/san-pham/mang-co-boc-gio-qua-tet-mang-co-boc-hop-qua-da-nang",
  "vi-nong-co-pvc": "/san-pham/mang-co-pvc-loc",
  "vi-nong-co-pvc-1": "/san-pham/mang-co-pvc-loc",
  "vi-nong-co-pvc-2": "/san-pham/mang-co-pvc-loc",
  "cuon-mang-xop-hoi-10m-xop-hoi-boc-hang-xop-bop-no-da-nang":
    "/san-pham/xop-bop-no-mang-xop-hoi-xop-khi-xop-goi-hang-da-nang",
  "bang-keo-duc-trong-97-108y": "/san-pham/bang-keo-duc-5cm-100-yard",
  "mang-co-ep-moc-nhom": "/danh-muc/mang-co-ep-moc-nhom",
  "mang-quan-pallet-5": "/san-pham/mang-quan-pallet",
  "cuon-mang-quan-pallet": "/san-pham/mang-quan-pallet",
  "mang-co-shirt-pet": "/san-pham/mang-co-pet",
  "mang-xop-khi-goi-hang-xop-bong-bong-da-nang":
    "/san-pham/mang-xop-khi-goi-hang-xop-bong-bong-da-nang",
  "xop-bong-bong-quang-nam":
    "/san-pham/mang-xop-khi-goi-hang-xop-bong-bong-da-nang",
  "mang-xop-khi-da-nang":
    "/san-pham/mang-xop-khi-goi-hang-xop-bong-bong-da-nang",
  "mang-co-pvc-quang-nam": "/danh-muc/mang-co-pvc",
  "mang-co-chuyen-nhiet-bang-keo-da-nang-giare-quang-nam":
    "/san-pham/in-mang-chuyen-nhiet",
  "xop-hoi-quang-nam":
    "/san-pham/xop-bop-no-mang-xop-hoi-xop-khi-xop-goi-hang-da-nang",
  "tui-xop-hoi-da-nang":
    "/san-pham/cuon-mang-xop-hoi-20cm-x-100m-xop-hoi-goi-hang-xop-hoi-boc-hang-xop-bop-no",
  "tui-mang-co-da-nang": "/san-pham/mang-co-ep",
  "tui-pe-da-nang": "/san-pham/mang-co-pe",
  "tui-zipper-hang-da-nang": "/san-pham/in-bao-bi-nhua",
  "mang-pe-vong-phukienmang-quangnam-danang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "xop-hoi-bao-hang-giare-hang-dinh-da-nang":
    "/san-pham/xop-bop-no-mang-xop-hoi-xop-khi-xop-goi-hang-da-nang",
  "xuat-khau-pallet-mang-pe-quangnam-danang-quangngai-cho-hang-xiet-hang-pac-danang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",

  // Category old slugs
  "mang-co-pe": "/san-pham/mang-co-pe",
  "mang-co": "/danh-muc/mang-co-pvc",
  "mang-co-pvc-chuyen-nhiet-giare-quangnam": "/danh-muc/mang-co-pvc",
  "mang-co-pvc-quang-nam-da-nang": "/danh-muc/mang-co-pvc",
  "mang-pe": "/danh-muc/mang-co-pe-mang-pe",
  "mang-pe-cho-hang-da-nang": "/danh-muc/mang-co-pe-mang-pe",
  "mang-co-pvc-nhat-nho-mang-co-tui-nhat-nhuamientrung-xong-nhuamientrung.vn":
    "/danh-muc/mang-co-pvc",
  "dich-vu-va-in-mang-co": "/danh-muc/dich-vu-in-mang-co",
  "dich-vu-in-mang-co": "/danh-muc/dich-vu-in-mang-co",
  "mang-co-pet": "/danh-muc/mang-co-pet",
  "mang-quan-pallet-2": "/san-pham/mang-quan-pallet",
  "bang-keo": "/danh-muc/bang-keo-trong",
  "mang-co-pvc-co-pe": "/danh-muc/mang-co-pvc",
  "in-tui-nylon": "/san-pham/in-bao-bi-nhua",
  "mang-co-pof": "/danh-muc/mang-co-pof",

  // Tag old slugs
  "mut-xop-pe-da-nang":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",
  "mang-xop-khi-quang-nam":
    "/san-pham/mang-xop-khi-goi-hang-xop-bong-bong-da-nang",
  "mang-xop-khi":
    "/san-pham/mang-xop-khi-goi-hang-xop-bong-bong-da-nang",
  "cuon-mang-xop-hoi-quang-nam":
    "/san-pham/xop-bop-no-mang-xop-hoi-xop-khi-xop-goi-hang-da-nang",
  "mang-xop-hoi-boc-hang-da-nang":
    "/san-pham/cuon-mang-xop-hoi-30cm-xop-hoi-boc-hang-xop-bop-no-da-nang",
  "xop-gam-chen-xop-giam-chan":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",
  "mang-co-pvc-loc": "/san-pham/mang-co-pvc-loc",
  "giau-khi-bong":
    "/san-pham/mang-xop-khi-goi-hang-xop-bong-bong-da-nang",
  "mut-xop-pe-foam":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",
  "cong-ty-nhat-mang-co-tui-nhat-nho-mang-co-tui-xiet-350":
    "/danh-muc/mang-co-pvc",
  "xop-no-bong-bong-duoc-san-xuat-tu-nguyen-lieu-hat-nhua-nguyen-sinh":
    "/san-pham/mang-xop-khi-goi-hang-xop-bong-bong-da-nang",
  "mang-xop-sheet":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",
  "xop-nhat-mang-co-boc-hang-mien-trung":
    "/san-pham/mang-co-boc-gio-qua-tet-mang-co-boc-hop-qua-da-nang",
  "choi-nhua-luan-lam-tu-gi": "/tin-tuc",
  "ban-mang-co-gio-qua-tet":
    "/san-pham/mang-co-boc-gio-qua-tet-mang-co-boc-hop-qua-da-nang",
  "mut-xop-chong-soc-feed":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",
  "mang-co-pe-loc": "/san-pham/mang-co-pe-loc",
  "tui-xop-khi":
    "/san-pham/xop-bop-no-mang-xop-hoi-xop-khi-xop-goi-hang-da-nang",
  "xop-giam-soc-goi-hang-xop-bop-no-xop-pe-foam-mien-trung":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",
  "mang-xop-hoi-goi-hangxop-bop-no-xop-pe-foam-mien-trung":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",
  "mang-xop-hoi-goi-hang-xop-bop-no-xop-pe-foam-mien-trung":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",

  // Additional legacy indexed slugs from old nhuamientrung.vn & phuanpe.com
  "tin-tuc-su-kien": "/tin-tuc",
  "tu-van-san-pham-mang-pe-quan-hang-hoa-tai-da-nang":
    "/tin-tuc/mang-pe-su-lua-chon-tot-nhat-cho-viec-bao-ve-hang-hoa",
  "tu-van-san-pham-mang-pe-quan-hang-hoa":
    "/tin-tuc/mang-pe-su-lua-chon-tot-nhat-cho-viec-bao-ve-hang-hoa",
  "mang-co-nhiet-pet": "/danh-muc/mang-co-pet",
  "mang-co-pet-2": "/danh-muc/mang-co-pet",
  "mang-co-nhiet-pvc": "/danh-muc/mang-co-pvc",
  "mang-co-nhiet-pe": "/danh-muc/mang-co-pe-mang-pe",
  "mang-co-nhiet-pof": "/danh-muc/mang-co-pof",
  "in-bao-bi-nhua-da-nang": "/san-pham/in-bao-bi-nhua",
  "mang-co-pe-da-nang": "/san-pham/mang-co-pe",
  "mang-co-da-nang": "/danh-muc/mang-co-pvc",
  "mang-co-pvc-da-nang": "/danh-muc/mang-co-pvc",
  "in-tui-mang-ghep-phuc-hop-tai-da-nang": "/san-pham/in-bao-bi-nhua",
  "mang-co-nhiet-tai-da-nang": "/danh-muc/mang-co-pvc",
  "dac-tinh-ky-thuat-cac-loai-nhua-pet-pe-pof-pvc": "/tin-tuc",
  "mang-co-gia-re-tai-da-nang-hotline-0935-909-747": "/danh-muc/mang-co-pvc",
  "dia-chi-cung-cap-mang-co-nhiet-tai-da-nang": "/danh-muc/mang-co-pvc",
  "top-1-cong-ty-in-mang-co-bao-bi-gia-re-uy-tin-nhat-da-nang":
    "/tin-tuc/top-1-cung-cap-mang-co-nhiet-chat-luong-da-nang",
  "mang-co-pe-gia-re-tai-da-nang-hotline-0935-909-747": "/san-pham/mang-co-pe",
  "dia-chi-ban-mang-co-pvc-pe-pof-gia-re-da-nang": "/danh-muc/mang-co-pvc",
  "mang-boc-thuc-pham-co-an-toan-khong-cach-chon-the-nao": "/tin-tuc",
  "in-mang-co-nhan-chai-da-nang": "/san-pham/in-mang-co-nhan-chai",
  "in-an-mang-ep-ly-tra-sua-da-nang":
    "/san-pham/in-cuon-mang-ep-ly-theo-yeu-cau",
  "in-tui-ni-long-bao-bi-gia-re": "/san-pham/in-bao-bi-nhua",
  "chai-nhua-pet-da-nang": "/danh-muc/mang-co-pet",
  "chai-nhua-gia-re-da-nang": "/danh-muc/phu-kien-nganh-nuoc-uong",
  "chai-nhua-pet-mau-chai-nhua-dep-giup-kinh-doanh-do-uong-hieu-qua":
    "/danh-muc/mang-co-pet",
  "dia-chi-ban-chai-nhua-pet-gia-re-chat-luong-nhat-tai-da-nang":
    "/danh-muc/mang-co-pet",
  "chai-nhua-pet-tra-sua-detox-tai-da-nang": "/danh-muc/mang-co-pet",
  "chai-nhua-pet-tai-da-nang-gia-re-ben-dep-uy-tin-chat-luong-so-1":
    "/danh-muc/mang-co-pet",
  "san-xuat-va-cung-cap-chai-nhua-pet-tai-khu-vuc-mien-trung-tay-nguyen":
    "/danh-muc/mang-co-pet",
  "chai-nhua-pet-la-gi-tai-sao-nen-su-dung-chai-nhua-pet":
    "/danh-muc/mang-co-pet",
  "dia-chi-cung-cap-mang-pe-chat-luong-gia-re-tai-da-nang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "ban-mang-co-pe-pvc-pof-gia-re-da-nang": "/danh-muc/mang-co-pvc",
  "in-nhan-chai-nhua": "/san-pham/in-mang-co-nhan-chai",
  "xop-boc-hang-da-nang":
    "/san-pham/xop-bop-no-mang-xop-hoi-xop-khi-xop-goi-hang-da-nang",
  "xop-hoi-boc-goi-hang-tai-da-nang":
    "/san-pham/xop-bop-no-mang-xop-hoi-xop-khi-xop-goi-hang-da-nang",
  "in-bao-bi-ca-phe-da-nang": "/san-pham/in-bao-bi-nhua",
  "mang-dan-mieng-ly-da-nang": "/san-pham/in-cuon-mang-ep-ly-theo-yeu-cau",
  "in-bao-bi-thuc-pham-da-nang": "/san-pham/in-bao-bi-nhua",
  "in-tem-nhan-decal-chai-lo": "/san-pham/in-mang-co-nhan-chai",
  "mang-co-gia-re-tai-hai-chau": "/danh-muc/mang-co-pvc",
  "mang-co-boc-loc-chai-nap-chai-hop-my-pham-da-nang": "/san-pham/mang-co-pvc-loc",
  "dia-chi-in-tem-nhan-dan-chai-gia-re-nhat-da-nang": "/san-pham/in-mang-co-nhan-chai",
  "mang-co-quang-nam": "/danh-muc/mang-co-pvc",
  "bang-bao-gia-mang-co": "/danh-muc/mang-co-pvc",
  "mua-ban-mang-pe-gia-re-tai-da-nang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "ban-mang-co-nhiet-gia-re-va-cac-loai-mang-co-nhiet-da-nang":
    "/danh-muc/mang-co-pvc",
  "in-mang-co-gia-re-tai-son-tra-da-nang": "/san-pham/in-mang-co-nhan-chai",
  "mang-xop-hoi-xop-bop-no-xop-khi-xop-goi-hang-da-nang":
    "/san-pham/xop-bop-no-mang-xop-hoi-xop-khi-xop-goi-hang-da-nang",
  "mua-ban-mang-pe-gia-re-chat-luong-tot-nhat-tai-da-nang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "bang-keo-dan-thung": "/danh-muc/bang-keo-trong",
  "mang-pe-lot-san":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-mau-xanh":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-quan-hang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-quan-may":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-quan-pallet":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-quan-pallet-da-nang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-san-xuat":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-shopee":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-stretch-film":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-tai-da-nang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-thuc-pham": "/danh-muc/mang-co-pe-mang-pe",
  "mang-pe-trai-san":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-trang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-quan-pe-gia-re":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-xop-hoi-da-nang":
    "/san-pham/xop-bop-no-mang-xop-hoi-xop-khi-xop-goi-hang-da-nang",
  "mang_co_cuon_pallet":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang_co_nhiet_da_nang": "/danh-muc/mang-co-pvc",
  "mang_co_pe_da_nang": "/san-pham/mang-co-pe",
  "mang_pe": "/danh-muc/mang-co-pe-mang-pe",
  "mang_pe_boc_hang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang_pe_gia_re":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mangcodanang": "/danh-muc/mang-co-pvc",
  "mangconhietdanang": "/danh-muc/mang-co-pvc",
  "may-thoi-mang-pe-3-lop": "/danh-muc/mang-co-pe-mang-pe",
  "san_xuat_mang_pe": "/danh-muc/mang-co-pe-mang-pe",
  "mang-co-pof-nguyen-lieu-cua-tuong-lai": "/danh-muc/mang-co-pof",
  "mang-co-quan-pallet-trong-cong-nghe-dong-goi": "/san-pham/mang-quan-pallet",
  "tat-tan-tat-ve-mang-co-nhiet": "/danh-muc/mang-co-pvc",
  "khong-phan-loai": "/tat-ca-san-pham",
  "uncategorized": "/tat-ca-san-pham",
  "dung-cu-quan-mang-pe-inox-cam-tay":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "in_mang_co_nap_chai": "/san-pham/in-mang-co-nhan-chai",
  "in_tem_nhan_chai": "/san-pham/in-mang-co-nhan-chai",
  "inmangcopvc": "/san-pham/in-mang-co-nhan-chai",
  "mang-boc-pe-la-gi": "/danh-muc/mang-co-pe-mang-pe",
  "mang-boc-pe-va-pvc": "/danh-muc/mang-co-pe-mang-pe",
  "mang-co-pe-re": "/san-pham/mang-co-pe",
  "mang-pe-4kg":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-bao-ve-be-mat":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-boc-do":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-boc-hang-da-nang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-boc-hang-hoa":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-boc-hang-mua-o-dau":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-boc-thuc-pham": "/danh-muc/mang-co-pe-mang-pe",
  "mang-pe-chong-tinh-dien":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-cong-nghiep":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-cuon":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-cuon-lon":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-day":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-dung-de-lam-gi": "/danh-muc/mang-co-pe-mang-pe",
  "mang-pe-den-gia-re":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-dong-goi":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-foam-dang-cuon":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",
  "mang-pe-foam-da-nang":
    "/san-pham/mang-xop-pe-foam-boc-hang-hoa-chat-luong-gia-re-da-nang",
  "mang-pe-gia-re":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-gia-re-tai-da-nang":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-gia-si":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
  "mang-pe-kho-2m":
    "/san-pham/mang-pe-quan-hang-hoa-mang-pe-quan-pallet-da-nang",
};

/**
 * Valid Category Slugs in the new site
 */
const VALID_CATEGORY_SLUGS = new Set([
  "dich-vu-in-mang-co",
  "mang-co-pvc",
  "in-bao-bi",
  "mang-co-loc-chai-nen-nuoc-yen",
  "mang-co-ep-moc-nhom",
  "mang-co-pof",
  "mang-co-pe-mang-pe",
  "mang-co-pet",
  "mang-quan-pallet",
  "mang-co-cuon-pvc-chuyen-dung-cho-in",
  "phu-kien-nganh-nuoc-uong",
  "mang-xop-hoi-tui-khi",
  "mang-xop-hoi-xop-khi-xop-boc-hang",
  "mang-xop-pe-foam",
  "bang-keo-trong",
  "bang-keo-duc",
  "bang-keo-hang-de-vo",
]);

/**
 * Evaluates incoming requests and returns target redirect URL string if redirect is needed,
 * or null if no redirect is necessary.
 * Guaranteed to NEVER return a redirect target matching the current URL (eliminates infinite loops).
 */
export function getSeoRedirect(request: NextRequest): URL | null {
  const nextUrl = request.nextUrl || new URL((request as any).url);
  const target = evaluateSeoRedirect(request, nextUrl);
  if (!target) return null;

  // STRICT GUARD: Never redirect if target destination is the exact same path and query!
  if (target.pathname === nextUrl.pathname && target.search === nextUrl.search) {
    return null;
  }

  return target;
}

function evaluateSeoRedirect(request: NextRequest, nextUrl: URL): URL | null {
  const url = new URL(nextUrl.href);
  let pathname = url.pathname;
  const searchParams = url.searchParams;
  let needsRedirect = false;

  // 1. Strip trailing .html extension if present
  if (pathname.endsWith(".html")) {
    pathname = pathname.slice(0, -5);
    needsRedirect = true;
  }

  // Strip trailing /feed
  if (pathname.endsWith("/feed")) {
    pathname = pathname.slice(0, -5);
    needsRedirect = true;
  }

  // Normalize multiple consecutive slashes & trailing slash (except root)
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
    needsRedirect = true;
  }

  // Strip trailing /feed again if slash was trailing before /feed/
  if (pathname.endsWith("/feed")) {
    pathname = pathname.slice(0, -5);
    needsRedirect = true;
  }

  // 1.5. Legacy WordPress pagination path handling (/page/N)
  const pageMatch = pathname.match(/^(.*)\/page\/(\d+)$/);
  if (pageMatch) {
    const rawBasePath = pageMatch[1] || "/";
    const pageNum = parseInt(pageMatch[2], 10);

    let targetPath = rawBasePath;
    if (
      rawBasePath === "/tin-tuc" ||
      rawBasePath === "/news" ||
      rawBasePath === "/category/tin-tuc"
    ) {
      targetPath = "/tin-tuc";
    } else if (rawBasePath === "/danh-muc" || rawBasePath === "/danh-muc-sp") {
      targetPath = "/danh-muc";
    } else if (rawBasePath === "/san-pham" || rawBasePath === "/tat-ca-san-pham") {
      targetPath = "/tat-ca-san-pham";
    } else if (rawBasePath.startsWith("/news/")) {
      const newsSlug = rawBasePath.replace(/^\/news\/?/, "");
      targetPath = EXACT_SLUG_MAP[newsSlug] || `/tin-tuc/${newsSlug}`;
    } else if (rawBasePath.startsWith("/danh-muc-sp/")) {
      const catSlug = rawBasePath.replace(/^\/danh-muc-sp\/?/, "").split("/")[0];
      targetPath =
        EXACT_SLUG_MAP[catSlug] ||
        (VALID_CATEGORY_SLUGS.has(catSlug) ? `/danh-muc/${catSlug}` : "/danh-muc");
    } else if (rawBasePath.startsWith("/category/")) {
      const catSlug = rawBasePath.replace(/^\/category\/?/, "").split("/")[0];
      if (catSlug === "tin-tuc") {
        targetPath = "/tin-tuc";
      } else {
        targetPath =
          EXACT_SLUG_MAP[catSlug] ||
          (VALID_CATEGORY_SLUGS.has(catSlug) ? `/danh-muc/${catSlug}` : "/danh-muc");
      }
    } else if (rawBasePath.startsWith("/tag/")) {
      const tagSlug =
        rawBasePath
          .replace(/^\/tag\/(sp-tag\/|danh-muc-sp\/)?/, "")
          .replace(/\/$/, "")
          .split("/")
          .pop() || "";
      targetPath =
        EXACT_SLUG_MAP[tagSlug] ||
        (VALID_CATEGORY_SLUGS.has(tagSlug)
          ? `/danh-muc/${tagSlug}`
          : tagSlug
          ? `/san-pham/${tagSlug}`
          : "/tat-ca-san-pham");
    }

    url.pathname = targetPath;
    if (pageNum > 1) {
      url.searchParams.set("page", String(pageNum));
    } else {
      url.searchParams.delete("page");
    }
    return url;
  }

  // 2. Handle old WordPress / WooCommerce query parameters
  // e.g. ?add-to-cart=349, ?p=1031, ?1Go4v4n4a7id7206, ?m3o-mang-co-ep-moc-nhom
  if (url.search) {
    // Check if query string contains product slug hints like ?m3o-mang-co-ep-moc-nhom
    const searchString = url.search.toLowerCase();
    for (const [oldSlug, targetPath] of Object.entries(EXACT_SLUG_MAP)) {
      if (searchString.includes(oldSlug)) {
        url.pathname = targetPath;
        url.search = "";
        return url;
      }
    }

    // Strip WooCommerce add-to-cart param
    if (searchParams.has("add-to-cart")) {
      searchParams.delete("add-to-cart");
      needsRedirect = true;
    }

    // Handle legacy query params attached to home page (e.g. ?1Go4v4n4a7id7206, ?p=1031)
    if (pathname === "/") {
      const keys = Array.from(searchParams.keys());
      const hasLegacyJunkParams = keys.some(
        (k) =>
          k.startsWith("1go") ||
          k.startsWith("ld-us") ||
          k.startsWith("m1o") ||
          k.startsWith("p1o") ||
          k.startsWith("715a") ||
          k.startsWith("f13a") ||
          k.startsWith("h1b") ||
          k.includes("7206") ||
          k === "p"
      );
      if (hasLegacyJunkParams) {
        // Clear junk query params on root to clean indexed Google URLs
        url.search = "";
        url.pathname = "/";
        return url;
      }
    }
  }

  // 3. Handle old path prefixes

  // Legacy news path: /news/* or /tin-tuc-su-kien/* -> /tin-tuc/*
  if (
    pathname === "/news" ||
    pathname.startsWith("/news/") ||
    pathname === "/tin-tuc-su-kien" ||
    pathname.startsWith("/tin-tuc-su-kien/")
  ) {
    const slug = pathname
      .replace(/^\/news\/?/, "")
      .replace(/^\/tin-tuc-su-kien\/?/, "");
    if (!slug || slug.startsWith("page/")) {
      url.pathname = "/tin-tuc";
    } else if (EXACT_SLUG_MAP[slug]) {
      url.pathname = EXACT_SLUG_MAP[slug];
    } else {
      url.pathname = `/tin-tuc/${slug}`;
    }
    url.search = "";
    return url;
  }

  // Legacy category path: /danh-muc-sp/* or nested /danh-muc/* -> /danh-muc/*
  if (
    pathname === "/danh-muc-sp" ||
    pathname.startsWith("/danh-muc-sp/") ||
    (pathname.startsWith("/danh-muc/") && pathname.split("/").filter(Boolean).length > 2)
  ) {
    const parts = pathname
      .replace(/^\/(danh-muc-sp|danh-muc)\/?/, "")
      .split("/")
      .filter(Boolean);
    const lastSlug = parts[parts.length - 1];
    if (!lastSlug) {
      url.pathname = "/danh-muc";
    } else if (EXACT_SLUG_MAP[lastSlug]) {
      url.pathname = EXACT_SLUG_MAP[lastSlug];
    } else if (VALID_CATEGORY_SLUGS.has(lastSlug)) {
      url.pathname = `/danh-muc/${lastSlug}`;
    } else {
      url.pathname = `/danh-muc`;
    }
    url.search = "";
    return url;
  }

  // Legacy WP category path: /category/* -> /tin-tuc or /danh-muc
  if (pathname.startsWith("/category")) {
    if (pathname === "/category/tin-tuc" || pathname.startsWith("/category/tin-tuc/")) {
      url.pathname = "/tin-tuc";
    } else {
      url.pathname = "/danh-muc";
    }
    url.search = "";
    return url;
  }

  // Legacy tag path: /tag/* -> /san-pham/* or /danh-muc/*
  if (pathname.startsWith("/tag")) {
    const cleanTagPath = pathname
      .replace(/^\/tag\/(sp-tag\/|danh-muc-sp\/)?/, "")
      .replace(/\/$/, "");
    const parts = cleanTagPath.split("/");
    const lastSlug = parts[parts.length - 1];

    if (EXACT_SLUG_MAP[lastSlug]) {
      url.pathname = EXACT_SLUG_MAP[lastSlug];
    } else if (VALID_CATEGORY_SLUGS.has(lastSlug)) {
      url.pathname = `/danh-muc/${lastSlug}`;
    } else if (lastSlug) {
      url.pathname = `/san-pham/${lastSlug}`;
    } else {
      url.pathname = "/tat-ca-san-pham";
    }
    url.search = "";
    return url;
  }

  // Legacy /hn-tu/* -> /
  if (pathname.startsWith("/hn-tu")) {
    url.pathname = "/";
    url.search = "";
    return url;
  }

  // 4. Exact slug match check for product / general paths
  // e.g. /san-pham/xop-no-mang-co-nhat-chai-1 -> /san-pham/in-mang-co-nhan-chai
  if (pathname.startsWith("/san-pham/")) {
    const currentSlug = pathname.replace("/san-pham/", "").replace(/\/$/, "");
    
    // Handle old date path like /san-pham/10/2021/01/007
    if (/^\d{2}\/\d{4}\/\d{2}/.test(currentSlug)) {
      url.pathname = "/tat-ca-san-pham";
      url.search = "";
      return url;
    }

    if (EXACT_SLUG_MAP[currentSlug]) {
      const target = EXACT_SLUG_MAP[currentSlug];
      if (target !== pathname) {
        url.pathname = target;
        url.search = "";
        return url;
      }
    }
  }

  // Direct exact slug match if raw slug without prefix matches dictionary
  const rawSlug = pathname.replace(/^\//, "");
  if (EXACT_SLUG_MAP[rawSlug]) {
    const target = EXACT_SLUG_MAP[rawSlug];
    if (target !== pathname) {
      url.pathname = target;
      url.search = "";
      return url;
    }
  }

  // If pathname was altered (e.g. stripped .html or trailing slash)
  if (needsRedirect) {
    url.pathname = pathname;
    return url;
  }

  return null;
}
