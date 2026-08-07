import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import NewsCard from "@/components/NewsCard";
import InternalLinks from "@/components/InternalLinks";
import Pagination from "@/components/Pagination";
import ProductContactBox from "@/components/ProductContactBox";
import ProductContent from "@/components/ProductContent";
import SafeImage from "@/components/SafeImage";
import JsonLd from "@/components/JsonLd";
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

const RELATED_PER_PAGE = 9;
const NEWS_PER_PAGE = 6;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sp?: string; np?: string }>;
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
  const product = await loadProductBySlug(slug);
  const found = await loadCategoryLookup(slug);

  const name =
    product?.name ||
    (found?.type === "category"
      ? found.category.name
      : found?.type === "subcategory"
        ? found.subcategory.name
        : "Sản phẩm");
  const description =
    product?.description ||
    (found?.type === "category"
      ? found.category.description
      : found?.type === "subcategory"
        ? found.subcategory.description
        : `Sản phẩm bao bì ${company.shortName}`);

  const title = `${name} | Mua tại Đà Nẵng`;
  const keywords = productKeywords(name, product?.sku);
  const url = `${siteUrl}/san-pham/${slug}`;
  const image = product?.image || "/logo.png";

  return {
    title,
    description: description.slice(0, 160),
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url,
      type: "website",
      locale: "vi_VN",
      images: [{ url: image, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
      images: [image],
    },
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const productPage = Math.max(1, parseInt(sp.sp || "1", 10) || 1);
  const newsPage = Math.max(1, parseInt(sp.np || "1", 10) || 1);

  const categories = await loadCategories();
  const found = await loadCategoryLookup(slug);
  const product = await loadProductBySlug(slug);
  const newsItems = await loadNews();

  if (!found && !product) notFound();

  let title = "";
  let description = "";
  let content = "";
  let coverImage = "";
  let sku = "";
  let breadcrumbs: { label: string; href?: string }[] = [];
  let relatedProducts: Awaited<ReturnType<typeof loadProducts>> = [];

  if (found?.type === "category") {
    title = found.category.name;
    description = found.category.description;
    content = description;
    breadcrumbs = [
      { label: "Sản phẩm", href: "/san-pham" },
      { label: title },
    ];
    relatedProducts = await loadProducts({ categoryId: found.category.id });
    coverImage = relatedProducts.find((p) => p.image)?.image || "";
  } else if (found?.type === "subcategory") {
    title = found.subcategory.name;
    description = found.subcategory.description;
    content = description;
    breadcrumbs = [
      { label: "Sản phẩm", href: "/san-pham" },
      ...(found.parent
        ? [{ label: found.parent.name, href: `/san-pham/${found.parent.slug}` }]
        : []),
      { label: title },
    ];
    relatedProducts = await loadProducts({
      subcategoryId: found.subcategory.id,
    });
    coverImage = relatedProducts.find((p) => p.image)?.image || "";
  } else if (product) {
    title = product.name;
    description = product.description;
    content = product.content || product.description;
    coverImage = product.image || "";
    sku = product.sku || "";
    breadcrumbs = [
      { label: "Sản phẩm", href: "/san-pham" },
      { label: title },
    ];
    if (product.categoryId) {
      relatedProducts = await loadProducts({ categoryId: product.categoryId });
    }
  }

  if (product) {
    title = product.name;
    description = product.description;
    content = product.content || product.description;
    coverImage = product.image || coverImage;
    sku = product.sku || sku;
    if (!relatedProducts.length && product.categoryId) {
      relatedProducts = await loadProducts({ categoryId: product.categoryId });
    }
  }

  // If still no related, take from all products
  if (!relatedProducts.length) {
    relatedProducts = await loadProducts();
  }

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

  // Sidebar: short previews (separate products / news)
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
  ];

  if (product) {
    jsonLdList.push(
      productJsonLd({
        name: product.name,
        description: product.description,
        image: product.image,
        sku: product.sku,
        slug: product.slug,
        price: product.price,
      })
    );
  }

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
          {/* Cột trái: sticky + cuộn nội bộ (danh mục + SP cùng loại + tin) */}
          <div className="lg:col-span-1">
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

          <div className="space-y-8 lg:col-span-3">
            <article className="card overflow-hidden">
              <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 sm:min-h-80 md:min-h-[26rem]">
                {coverImage ? (
                  <SafeImage
                    src={coverImage}
                    alt={`${title} - ${company.shortName}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    className="object-contain bg-white p-2 sm:p-3"
                    fallbackClassName="bg-white"
                    unoptimized
                  />
                ) : (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-20" />
                    <p className="relative px-4 text-center text-2xl font-extrabold text-white sm:text-3xl">
                      {title}
                    </p>
                  </>
                )}
              </div>
              <div className="p-6 sm:p-8">
                {/* Duy nhất 1 H1 trên trang chi tiết sản phẩm */}
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  {sku && (
                    <span className="font-semibold text-sky-600">
                      Mã SP: {sku}
                    </span>
                  )}
                  {product?.price && (
                    <span className="font-semibold text-brand-700">
                      Giá: {product.price}
                    </span>
                  )}
                  {product?.views != null && (
                    <span className="text-slate-400">
                      Lượt xem: {product.views.toLocaleString("vi-VN")}
                    </span>
                  )}
                </div>

                {/* Description — bold for SEO emphasis */}
                {description && (
                  <p className="mt-4 rounded-xl border-l-4 border-brand-500 bg-brand-50/60 px-4 py-3 text-sm font-bold leading-relaxed text-slate-800 sm:text-[15px]">
                    {description}
                  </p>
                )}

                {product?.images && product.images.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {product.images.slice(0, 8).map((img, imgIdx) => (
                      <div
                        key={img}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white"
                      >
                        <SafeImage
                          src={img}
                          alt={`${title} — ảnh ${imgIdx + 1}`}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                          fallbackClassName="bg-slate-50"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Full content — tables auto from pipe layout */}
                {content && content !== description && (
                  <div className="mt-6">
                    <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                      Mô tả chi tiết {title}
                    </h2>
                    <ProductContent content={content} />
                  </div>
                )}

                {/* Thông tin liên hệ công ty (thay mẫu đối thủ) */}
                {(description || (content && content !== description) || product) && (
                  <ProductContactBox />
                )}

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

                {/* SEO context — tránh lặp từ “màng” */}
                <p className="mt-6 text-xs leading-relaxed text-slate-400">
                  {company.shortName} cung cấp <strong>{title}</strong>
                  {sku ? ` (mã ${sku})` : ""}, giải pháp{" "}
                  <strong>bao bì đóng gói Đà Nẵng</strong> — giao hàng toàn quốc.{" "}
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
              </div>
            </article>

            {/* Sản phẩm cùng loại — full + pagination */}
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
                  extraParams={{ np: safeNewsPage > 1 ? safeNewsPage : undefined }}
                  hash="san-pham-cung-loai"
                />
              </div>
            )}

            {/* Tin tức — full + pagination (tách riêng) */}
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
                  extraParams={{ sp: safeProductPage > 1 ? safeProductPage : undefined }}
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
