import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import {
  loadAllCategorySlugs,
  loadCategories,
  loadCategoryLookup,
  loadProducts,
} from "@/lib/data/public";
import { company } from "@/lib/data/company";
import { productKeywords, siteUrl } from "@/lib/seo/keywords";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const dynamic = "force-dynamic";

const LIST_PER_PAGE = 8;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  try {
    const catSlugs = await loadAllCategorySlugs();
    return catSlugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await loadCategoryLookup(slug);

  if (!found) {
    return { title: "Không tìm thấy danh mục" };
  }

  const name =
    found.type === "category" ? found.category.name : found.subcategory.name;
  const description =
    found.type === "category"
      ? found.category.description
      : found.subcategory.description;

  const title = `${name} | Danh mục bao bì Đà Nẵng`;
  const keywords = productKeywords(name);
  const url = `${siteUrl}/danh-muc/${slug}`;

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: (description || "").slice(0, 160),
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const listPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const categories = await loadCategories();
  const found = await loadCategoryLookup(slug);

  if (!found) notFound();

  const isCategory = found.type === "category";
  const title = isCategory
    ? found.category.name
    : found.subcategory.name;
  let description = isCategory
    ? found.category.description
    : found.subcategory.description;

  if (description) {
    description = description
      .replace(/rnrn/g, "<br /><br />")
      .replace(/rn-/g, "<br />-")
      .replace(/rn([A-ZĐÀ-Ỹ])/g, "<br />$1")
      .replace(/rn$/, "")
      .replace(/rn/g, " ");
  }

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "Danh Mục", href: "/danh-muc" },
  ];
  if (!isCategory && found.parent) {
    breadcrumbs.push({
      label: found.parent.name,
      href: `/danh-muc/${found.parent.slug}`,
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
      { name: "Danh Mục", url: `${siteUrl}/danh-muc` },
      ...(found.type === "subcategory" && found.parent
        ? [
            {
              name: found.parent.name,
              url: `${siteUrl}/danh-muc/${found.parent.slug}`,
            },
          ]
        : []),
      { name: title, url: `${siteUrl}/danh-muc/${slug}` },
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
  
  const categoryFaqItems = [
    {
      question: `Ưu điểm nổi bật của các sản phẩm thuộc danh mục ${title} là gì?`,
      answer: `Các sản phẩm ${title} tại Bao Bì Thành Phát được sản xuất từ nguyên liệu nhựa nguyên sinh chất lượng cao, mang lại độ dai, độ bóng và khả năng bảo vệ hàng hóa tuyệt vời. Chúng tôi cam kết chất lượng đồng đều trên từng lô hàng, giúp quá trình đóng gói của bạn mượt mà và tối ưu nhất.`
    },
    {
      question: `Thành Phát có nhận sản xuất ${title} theo yêu cầu riêng không?`,
      answer: `Có, chúng tôi hỗ trợ tùy chỉnh kích thước, độ dày và quy cách đóng gói (dạng cuộn, dạng túi, cắt sẵn) của các loại ${title} sao cho vừa vặn nhất với sản phẩm của bạn. Đội ngũ kỹ thuật sẽ tư vấn miễn phí để giúp bạn chọn được quy cách tiết kiệm chi phí nhất.`
    },
    {
      question: "Nếu đặt mua số lượng lớn thì chính sách giá và vận chuyển như thế nào?",
      answer: "Với các đơn hàng số lượng lớn hoặc khách hàng doanh nghiệp thân thiết, Thành Phát luôn có mức chiết khấu cực kỳ ưu đãi, hỗ trợ công nợ dài hạn và miễn phí vận chuyển trong nội thành Đà Nẵng hoặc đến các chành xe."
    }
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
              <div
                className="mb-5 rounded-xl border-l-4 border-brand-500 bg-brand-50/60 px-4 py-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : null}

            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                Sản phẩm trong {title}
              </h2>
              <p className="text-sm text-slate-500">
                {total === 0
                  ? "0 sản phẩm"
                  : `Hiển thị ${start + 1}–${Math.min(
                      start + LIST_PER_PAGE,
                      total
                    )} / ${total}`}
                {totalPages > 1 && ` · Trang ${safePage}/${totalPages}`}
              </p>
            </div>

            {paged.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-slate-500">
                Chưa có sản phẩm trong danh mục này.
                <div className="mt-4">
                  <Link href="/danh-muc" className="btn-outline !text-xs">
                    Xem tất cả danh mục
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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
                    isProduct={true}
                  />
                ))}
              </div>
            )}

            <Pagination
              page={safePage}
              totalPages={totalPages}
              basePath={`/danh-muc/${slug}`}
              param="page"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border-t border-slate-200">
        <FaqAccordion items={categoryFaqItems} title={`Câu hỏi thường gặp về ${title}`} />
      </section>
    </>
  );
}
