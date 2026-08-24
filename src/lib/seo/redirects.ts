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
  "mang-co-ep-moc-nhom": "/san-pham/mang-co-ep-moc-nhom",
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
 */
export function getSeoRedirect(request: NextRequest): URL | null {
  const nextUrl = request.nextUrl || new URL((request as any).url);
  const url = new URL(nextUrl.href);
  let pathname = url.pathname;
  const searchParams = url.searchParams;
  let needsRedirect = false;

  // 1. Strip trailing .html extension if present
  if (pathname.endsWith(".html")) {
    pathname = pathname.slice(0, -5);
    needsRedirect = true;
  }

  // Normalize multiple consecutive slashes & trailing slash (except root)
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
    needsRedirect = true;
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
      if (hasLegacyJunkParams || keys.length > 0) {
        // Clear all query params on root to clean indexed Google URLs
        url.search = "";
        url.pathname = "/";
        return url;
      }
    }
  }

  // 3. Handle old path prefixes

  // Legacy news path: /news/* -> /tin-tuc/*
  if (pathname === "/news" || pathname.startsWith("/news/")) {
    const slug = pathname.replace(/^\/news\/?/, "");
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

  // Legacy category path: /danh-muc-sp/* -> /danh-muc/*
  if (pathname === "/danh-muc-sp" || pathname.startsWith("/danh-muc-sp/")) {
    const rawSlug = pathname.replace(/^\/danh-muc-sp\/?/, "").split("/")[0];
    if (!rawSlug) {
      url.pathname = "/danh-muc";
    } else if (EXACT_SLUG_MAP[rawSlug]) {
      url.pathname = EXACT_SLUG_MAP[rawSlug];
    } else if (VALID_CATEGORY_SLUGS.has(rawSlug)) {
      url.pathname = `/danh-muc/${rawSlug}`;
    } else {
      url.pathname = `/danh-muc`;
    }
    url.search = "";
    return url;
  }

  // Legacy WP category path: /category/* -> /danh-muc
  if (pathname.startsWith("/category")) {
    url.pathname = "/danh-muc";
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
      url.pathname = EXACT_SLUG_MAP[currentSlug];
      url.search = "";
      return url;
    }
  }

  // Direct exact slug match if raw slug without prefix matches dictionary
  const rawSlug = pathname.replace(/^\//, "");
  if (EXACT_SLUG_MAP[rawSlug]) {
    url.pathname = EXACT_SLUG_MAP[rawSlug];
    url.search = "";
    return url;
  }

  // If pathname was altered (e.g. stripped .html or stripped add-to-cart param)
  if (needsRedirect) {
    url.pathname = pathname;
    return url;
  }

  return null;
}
