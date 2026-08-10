import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Eye } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductViewTracker from "@/components/ProductViewTracker";
import NewsCard from "@/components/NewsCard";
import InternalLinks from "@/components/InternalLinks";
import Pagination from "@/components/Pagination";
import ProductContactBox from "@/components/ProductContactBox";
import ProductContent from "@/components/ProductContent";
import SafeImage from "@/components/SafeImage";
import JsonLd from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";
import {
  loadAllCategorySlugs,
  loadCategories,
  loadCategoryLookup,
  loadNews,
  loadProductBySlug,
  loadProducts,
} from "@/lib/data/public";
import { company } from "@/lib/data/company";
import { productKeywords, siteUrl } from "@/lib/seo/keywords";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";

export const dynamic = "force-dynamic";

const LIST_PER_PAGE = 12;
const RELATED_PER_PAGE = 9;
const NEWS_PER_PAGE = 6;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sp?: string; np?: string; page?: string }>;
};

export async function generateStaticParams() {
  try {
    const [catSlugs, products] = await Promise.all([
      loadAllCategorySlugs(),
      loadProducts(),
    ]);
    const slugs = new Set([
      ...catSlugs,
      ...products.map((p) => p.slug),
    ]);
    return [...slugs].map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Ưu tiên danh mục / danh mục con hơn sản phẩm (tránh nhầm trang list)
  const found = await loadCategoryLookup(slug);
  const product = found ? null : await loadProductBySlug(slug);

  const name =
    found?.type === "category"
      ? found.category.name
      : found?.type === "subcategory"
        ? found.subcategory.name
        : product?.name || "Sản phẩm";

  const description =
    found?.type === "category"
      ? found.category.description
      : found?.type === "subcategory"
        ? found.subcategory.description
        : product?.description || `Sản phẩm bao bì ${company.shortName}`;

  const title = found
    ? `${name} | Danh mục bao bì Đà Nẵng`
    : `${name} | Mua tại Đà Nẵng`;
  const keywords = productKeywords(name, product?.sku || undefined);
  const url = `${siteUrl}/san-pham/${slug}`;
  const image = product?.image || "/logo.png";

  return {
    title,
    description: (description || "").slice(0, 160),
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: (description || "").slice(0, 160),
      url,
      type: "website",
      locale: "vi_VN",
      images: [{ url: image, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: (description || "").slice(0, 160),
      images: [image],
    },
  };
}

export default async function ProductOrCategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const listPage = Math.max(1, parseInt(sp.page || sp.sp || "1", 10) || 1);
  const productPage = Math.max(1, parseInt(sp.sp || "1", 10) || 1);
  const newsPage = Math.max(1, parseInt(sp.np || "1", 10) || 1);

  const categories = await loadCategories();
  const found = await loadCategoryLookup(slug);
  // Chỉ lấy product khi KHÔNG phải danh mục / danh mục con
  const product = found ? null : await loadProductBySlug(slug);
  const newsItems = await loadNews();

  if (!found && !product) notFound();

  const isListing =
    found?.type === "category" || found?.type === "subcategory";

  // ─── Trang DANH MỤC / DANH MỤC CON: grid sản phẩm ───
  if (isListing && found) {
    const isCategory = found.type === "category";
    const title = isCategory
      ? found.category.name
      : found.subcategory.name;
    const description = isCategory
      ? found.category.description
      : found.subcategory.description;

    const breadcrumbs: { label: string; href?: string }[] = [
      { label: "Sản phẩm", href: "/san-pham" },
    ];
    if (!isCategory && found.parent) {
      breadcrumbs.push({
        label: found.parent.name,
        href: `/san-pham/${found.parent.slug}`,
      });
    }
    breadcrumbs.push({ label: title });

    const listProducts = isCategory
      ? await loadProducts({ categoryId: found.category.id })
      : await loadProducts({ subcategoryId: found.subcategory.id });

    const total = listProducts.length;
    const totalPages = Math.max(1, Math.ceil(total / LIST_PER_PAGE));
    const safePage = Math.min(listPage, totalPages);
    const start = (safePage - 1) * LIST_PER_PAGE;
    const paged = listProducts.slice(start, start + LIST_PER_PAGE);

    const jsonLdList: Record<string, unknown>[] = [
      breadcrumbJsonLd([
        { name: "Trang chủ", url: siteUrl },
        { name: "Sản phẩm", url: `${siteUrl}/san-pham` },
        ...(found.type === "subcategory" && found.parent
          ? [
              {
                name: found.parent.name,
                url: `${siteUrl}/san-pham/${found.parent.slug}`,
              },
            ]
          : []),
        { name: title, url: `${siteUrl}/san-pham/${slug}` },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: title,
        numberOfItems: total,
        itemListElement: paged.map((p, i) => ({
          "@type": "ListItem",
          position: start + i + 1,
          name: p.name,
          url: `${siteUrl}/san-pham/${p.slug}`,
        })),
      },
    ];

    return (
      <>
        <JsonLd data={jsonLdList} />
        <PageBanner
          title={title}
          breadcrumbs={breadcrumbs}
          subtitle={description}
          wide
          asH1
        />

        <section className="section container-home">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="order-2 lg:order-1 lg:col-span-1">
              <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1 [scrollbar-width:thin]">
                <CategorySidebar categories={categories} activeSlug={slug} />
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-3">
              {description ? (
                <p className="mb-5 rounded-xl border-l-4 border-brand-500 bg-brand-50/60 px-4 py-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                  {description}
                </p>
              ) : null}

              <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  Sản phẩm trong {title}
                </h2>
                <p className="text-sm text-slate-500">
                  {total === 0
                    ? "0 sản phẩm"
                    : `Hiển thị ${start + 1}–${Math.min(start + LIST_PER_PAGE, total)} / ${total}`}
                  {totalPages > 1 && ` · Trang ${safePage}/${totalPages}`}
                </p>
              </div>

              {paged.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-slate-500">
                  Chưa có sản phẩm trong danh mục này.
                  <div className="mt-4">
                    <Link href="/san-pham" className="btn-outline !text-xs">
                      Xem tất cả sản phẩm
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {paged.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      category={{
                        slug: p.slug,
                        name: p.name,
                        description: p.description,
                        image: p.image,
                        sku: p.sku,
                      }}
                      index={start + i}
                    />
                  ))}
                </div>
              )}

              <Pagination
                page={safePage}
                totalPages={totalPages}
                basePath={`/san-pham/${slug}`}
                param="page"
              />
            </div>
          </div>
        </section>
      </>
    );
  }

  // ─── Trang CHI TIẾT SẢN PHẨM ───
  if (!product) notFound();

  let viewCount = product.views || 0;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("views").eq("id", product.id).single();
    if (data && typeof data.views === "number") {
      viewCount = data.views;
    }
  } catch (error) {
    console.error("Lỗi lấy view từ supabase:", error);
  }

  const title = product.name;
  const description = product.description;
  const content = product.content || product.description;
  const coverImage = product.image || "";
  const sku = product.sku || "";

  // Breadcrumb: Sản phẩm → (danh mục) → (danh mục con) → SP
  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "Sản phẩm", href: "/san-pham" },
  ];
  if (product.categoryId) {
    const cat = categories.find((c) => c.id === product.categoryId);
    if (cat) {
      breadcrumbs.push({
        label: cat.name,
        href: `/san-pham/${cat.slug}`,
      });
      if (product.subcategoryId && cat.children) {
        const sub = cat.children.find((s) => s.id === product.subcategoryId);
        if (sub) {
          breadcrumbs.push({
            label: sub.name,
            href: `/san-pham/${sub.slug}`,
          });
        }
      }
    }
  }
  breadcrumbs.push({ label: title });

  let relatedProducts = product.categoryId
    ? await loadProducts({ categoryId: product.categoryId })
    : await loadProducts();

  const sameTypeProducts = relatedProducts.filter((p) => p.slug !== slug);
  const productTotalPages = Math.max(
    1,
    Math.ceil(sameTypeProducts.length / RELATED_PER_PAGE)
  );
  const safeProductPage = Math.min(productPage, productTotalPages);
  const pagedProducts = sameTypeProducts.slice(
    (safeProductPage - 1) * RELATED_PER_PAGE,
    safeProductPage * RELATED_PER_PAGE
  );

  const newsTotalPages = Math.max(
    1,
    Math.ceil(newsItems.length / NEWS_PER_PAGE)
  );
  const safeNewsPage = Math.min(newsPage, newsTotalPages);
  const pagedNews = newsItems.slice(
    (safeNewsPage - 1) * NEWS_PER_PAGE,
    safeNewsPage * NEWS_PER_PAGE
  );

  const basePath = `/san-pham/${slug}`;

  const sidebarProducts = sameTypeProducts.slice(0, 6).map((p) => ({
    href: `/san-pham/${p.slug}`,
    title: p.name,
    subtitle: p.sku ? `Mã SP: ${p.sku}` : "Sản phẩm bao bì",
  }));
  const sidebarNews = newsItems.slice(0, 5).map((n) => ({
    href: `/tin-tuc/${n.slug}`,
    title: n.title,
    subtitle: n.date
      ? new Date(n.date).toLocaleDateString("vi-VN")
      : "Tin tức",
  }));

  const jsonLdList: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: "Trang chủ", url: siteUrl },
      { name: "Sản phẩm", url: `${siteUrl}/san-pham` },
      ...breadcrumbs
        .filter((b) => b.href)
        .map((b) => ({
          name: b.label,
          url: `${siteUrl}${b.href}`,
        })),
      { name: title, url: `${siteUrl}/san-pham/${slug}` },
    ]),
    productJsonLd({
      name: product.name,
      description: product.description,
      image: product.image,
      sku: product.sku,
      slug: product.slug,
      price: product.price,
    }),
  ];

  return (
    <>
      <JsonLd data={jsonLdList} />
      <PageBanner
        title={title}
        breadcrumbs={breadcrumbs}
        subtitle={description}
        wide
        asH1={false}
      />

      <section className="section container-home">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="order-2 lg:order-1 lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-28 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1 lg:pb-4 [scrollbar-width:thin]">
              <CategorySidebar categories={categories} activeSlug={slug} />
              {sidebarProducts.length > 0 && (
                <InternalLinks
                  title="Sản phẩm cùng loại"
                  items={[
                    ...sidebarProducts,
                    {
                      href: `${basePath}#san-pham-cung-loai`,
                      title: "Xem tất cả sản phẩm cùng loại",
                      subtitle: `${sameTypeProducts.length} sản phẩm`,
                    },
                  ]}
                />
              )}
              {sidebarNews.length > 0 && (
                <InternalLinks
                  title="Tin tức"
                  items={[
                    ...sidebarNews,
                    {
                      href: `${basePath}#tin-tuc`,
                      title: "Xem tất cả tin tức",
                      subtitle: `${newsItems.length} bài viết`,
                    },
                  ]}
                />
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8 lg:col-span-3">
            <article className="card overflow-hidden">
              <ProductGallery
                coverImage={coverImage}
                images={product.images || []}
                title={title}
                companyShortName={company.shortName}
                headerContent={
                  <>
                    <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                      {title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      {sku && (
                        <span className="font-semibold text-sky-600">
                          Mã SP: {sku}
                        </span>
                      )}
                      {product.price && (
                        <span className="font-semibold text-brand-700">
                          Giá: {product.price}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-medium text-slate-500">
                        <Eye className="h-4 w-4" />
                        {viewCount} lượt xem
                      </span>
                    </div>

                    {description && (
                      <p className="mt-4 rounded-xl border-l-4 border-brand-500 bg-brand-50/60 px-4 py-3 text-sm font-bold leading-relaxed text-slate-800 sm:text-[15px]">
                        {description}
                      </p>
                    )}
                  </>
                }
              >
                {content && content !== description && (
                  <div className="mt-6">
                    <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                      Mô tả chi tiết {title}
                    </h2>
                    <ProductContent content={content} />
                  </div>
                )}

                <ProductContactBox />

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/lien-he"
                    className="btn-primary"
                    aria-label={`Nhận báo giá cho ${title}`}
                  >
                    Nhận báo giá {title.slice(0, 28)}
                    {title.length > 28 ? "…" : ""}
                  </Link>
                  <a
                    href={`tel:${company.phoneRaw}`}
                    className="btn-outline"
                    aria-label={`Gọi hotline ${company.phone} tư vấn ${title}`}
                  >
                    <Phone className="h-4 w-4" />
                    Gọi tư vấn {company.phone}
                  </a>
                </div>

                <p className="mt-6 text-xs leading-relaxed text-slate-400">
                  {company.shortName} cung cấp <strong>{title}</strong>
                  {sku ? ` (mã ${sku})` : ""}, giải pháp{" "}
                  <strong>bao bì đóng gói Đà Nẵng</strong> — giao hàng toàn
                  quốc.{" "}
                  <Link
                    href="/san-pham"
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    Danh mục bao bì Thành Phát
                  </Link>{" "}
                  ·{" "}
                  <Link
                    href="/lien-he"
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    Form báo giá online
                  </Link>
                </p>
              </ProductGallery>
              <ProductViewTracker productId={product.id} />
            </article>

            {sameTypeProducts.length > 0 && (
              <div id="san-pham-cung-loai" className="scroll-mt-28">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Sản phẩm cùng loại
                  </h2>
                  <p className="text-sm text-slate-500">
                    {sameTypeProducts.length} sản phẩm
                    {productTotalPages > 1 &&
                      ` · Trang ${safeProductPage}/${productTotalPages}`}
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {pagedProducts.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      category={{
                        slug: p.slug,
                        name: p.name,
                        description: p.description,
                        image: p.image,
                        sku: p.sku,
                      }}
                      index={i}
                    />
                  ))}
                </div>
                <Pagination
                  page={safeProductPage}
                  totalPages={productTotalPages}
                  basePath={basePath}
                  param="sp"
                  extraParams={{
                    np: safeNewsPage > 1 ? safeNewsPage : undefined,
                  }}
                  hash="san-pham-cung-loai"
                />
              </div>
            )}

            {newsItems.length > 0 && (
              <div id="tin-tuc" className="scroll-mt-28">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Tin tức
                  </h2>
                  <p className="text-sm text-slate-500">
                    {newsItems.length} bài viết
                    {newsTotalPages > 1 &&
                      ` · Trang ${safeNewsPage}/${newsTotalPages}`}
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {pagedNews.map((n) => (
                    <NewsCard
                      key={n.slug}
                      item={{
                        slug: n.slug,
                        title: n.title,
                        excerpt: n.excerpt,
                        date: n.date,
                        image: n.image,
                      }}
                      featured
                    />
                  ))}
                </div>
                <Pagination
                  page={safeNewsPage}
                  totalPages={newsTotalPages}
                  basePath={basePath}
                  param="np"
                  extraParams={{
                    sp: safeProductPage > 1 ? safeProductPage : undefined,
                  }}
                  hash="tin-tuc"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
