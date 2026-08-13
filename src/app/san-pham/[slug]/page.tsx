import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Eye } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import FaqAccordion from "@/components/FaqAccordion";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductViewTracker from "@/components/ProductViewTracker";
import NewsCard from "@/components/NewsCard";
import InternalLinks from "@/components/InternalLinks";
import Pagination from "@/components/Pagination";
import ProductContactBox from "@/components/ProductContactBox";
import ProductContent from "@/components/ProductContent";
import JsonLd from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";
import {
  loadCategories,
  loadNews,
  loadProductBySlug,
  loadProducts,
} from "@/lib/data/public";
import { getApprovedReviews } from "@/lib/cms/reviews";
import ProductTabs from "@/components/ProductTabs";
import ProductReviews from "@/components/ProductReviews";
import { company } from "@/lib/data/company";
import { productKeywords, siteUrl } from "@/lib/seo/keywords";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";
import { cleanRawContent } from "@/lib/cms/content-links";

export const dynamic = "force-dynamic";

const RELATED_PER_PAGE = 8;
const NEWS_PER_PAGE = 6;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sp?: string; np?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);

  if (!product) {
    return { title: "Không tìm thấy sản phẩm" };
  }

  const name = product.name;
  const description = product.description || `Sản phẩm bao bì ${company.shortName}`;
  const title = `${name} | Mua tại Đà Nẵng`;
  const keywords = productKeywords(name, product.sku || undefined);
  const url = `${siteUrl}/san-pham/${slug}`;
  const image = product.image || "/logo.png";

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

export default async function ProductPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const productPage = Math.max(1, parseInt(sp.sp || "1", 10) || 1);
  const newsPage = Math.max(1, parseInt(sp.np || "1", 10) || 1);

  const product = await loadProductBySlug(slug);
  if (!product) notFound();

  const categories = await loadCategories();
  const newsItems = await loadNews();

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
  const description = product.description 
    ? cleanRawContent(product.description, true)
    : "";
  const content = product.content || product.description;
  const coverImage = product.image || "";
  const sku = product.sku || "";

  // Breadcrumb: Trang chủ → Tên danh mục → SP
  const breadcrumbs: { label: string; href?: string }[] = [];

  const reviews = await getApprovedReviews(product.id);
  if (product.categoryId) {
    const cat = categories.find((c) => c.id === product.categoryId);
    if (cat) {
      if (product.subcategoryId && cat.children) {
        const sub = cat.children.find((s) => s.id === product.subcategoryId);
        if (sub) {
          breadcrumbs.push({
            label: sub.name,
            href: `/danh-muc/${sub.slug}`,
          });
        } else {
          breadcrumbs.push({
            label: cat.name,
            href: `/danh-muc/${cat.slug}`,
          });
        }
      } else {
        breadcrumbs.push({
          label: cat.name,
          href: `/danh-muc/${cat.slug}`,
        });
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

  const productFaqItems = [
    {
      question: `Sản phẩm ${product.name} này dùng để làm gì?`,
      answer: `Sản phẩm ${product.name} thường được ứng dụng rộng rãi trong việc đóng gói bao bì chuyên nghiệp. Nếu bạn cần bọc kín, tạo tính thẩm mỹ hoặc bảo vệ hàng hóa khỏi bụi bẩn, đây là lựa chọn tối ưu tại Bao Bì Thành Phát.`
    },
    {
      question: "Có an toàn khi bọc trực tiếp thực phẩm không?",
      answer: "Tùy thuộc vào vật liệu. Ví dụ màng co POF và màng ghép phức hợp được đánh giá rất an toàn khi dùng cho ngành thực phẩm, bánh kẹo. Liên hệ ngay Hotline của Thành Phát để được tư vấn chất liệu chuẩn Food Grade phù hợp nhất cho sản phẩm của bạn."
    },
    {
      question: `Công ty có hỗ trợ in logo thương hiệu lên ${product.name} không?`,
      answer: "Có! Bao Bì Thành Phát hỗ trợ in ấn logo, thông tin thương hiệu trực tiếp lên bề mặt vật liệu với công nghệ in ống đồng chất lượng cao, mực in sắc nét không phai, đáp ứng các tiêu chuẩn xuất khẩu."
    }
  ];

  return (
    <>
      <JsonLd data={jsonLdList} />
      <BreadcrumbBar items={breadcrumbs} />
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
              <CategorySidebar categories={categories} />
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
                      <div 
                        className="mt-4 rounded-xl border-l-4 border-brand-500 bg-brand-50/60 px-4 py-3 text-sm font-bold leading-relaxed text-slate-800 sm:text-[15px] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    )}
                  </>
                }
              >
                {content && content !== description && (
                  <div className="mt-8">
                    <ProductTabs 
                      reviewCount={reviews.length}
                      descriptionNode={
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <h2 className="text-base font-extrabold text-slate-900 sm:text-lg mb-4">
                            Mô tả chi tiết {title}
                          </h2>
                          <ProductContent content={content} />
                        </div>
                      }
                      reviewsNode={
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <ProductReviews productId={product.id} initialReviews={reviews} />
                        </div>
                      }
                    />
                  </div>
                )}

                <ProductContactBox />

                <div className="mt-8 flex flex-wrap gap-3">
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
                    href="/danh-muc"
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
                      isProduct={true}
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

      <section className="bg-slate-50 border-t border-slate-200">
        <FaqAccordion items={productFaqItems} title={`Câu hỏi thường gặp về ${product.name}`} />
      </section>
    </>
  );
}
