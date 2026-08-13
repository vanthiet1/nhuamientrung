import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/CategorySidebar";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import JsonLd from "@/components/JsonLd";
import { loadCategories, loadProducts } from "@/lib/data/public";
import { company } from "@/lib/data/company";
import { primaryKeywords, siteUrl } from "@/lib/seo/keywords";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 3600;

const PER_PAGE = 8;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const baseTitle = "Danh mục sản phẩm bao bì đóng gói Đà Nẵng";
  const title = page > 1 ? `${baseTitle} · Trang ${page}` : baseTitle;
  const description =
    "Danh mục bao bì & shrink film PVC, PE, POF, PET, OPP-BOPP tại Đà Nẵng. Xem đầy đủ sản phẩm và nhận báo giá nhanh.";
  const canonical =
    page > 1 ? `${siteUrl}/danh-muc?page=${page}` : `${siteUrl}/danh-muc`;

  return {
    title,
    description,
    keywords: [
      ...primaryKeywords,
      "danh mục sản phẩm bao bì",
      "báo giá màng co",
      "tất cả sản phẩm bao bì",
    ],
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${company.shortName}`,
      description,
      url: canonical,
      type: "website",
      locale: "vi_VN",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoriesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [categories, products] = await Promise.all([
    loadCategories(),
    loadProducts(),
  ]);

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const paged = products.slice(start, start + PER_PAGE);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Danh mục sản phẩm bao bì – màng co nhiệt",
    numberOfItems: total,
    itemListElement: paged.map((p, i) => ({
      "@type": "ListItem",
      position: start + i + 1,
      name: p.name,
      url: `${siteUrl}/san-pham/${p.slug}`,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Trang chủ", url: siteUrl },
            { name: "Danh mục", url: `${siteUrl}/danh-muc` },
          ]),
          itemListJsonLd,
        ]}
      />
      <PageBanner
        title="Danh Mục"
        breadcrumbs={[{ label: "Danh Mục" }]}
        subtitle="Toàn bộ màng co nhiệt & bao bì đóng gói — báo giá nhanh tại Đà Nẵng"
        wide
      />

      <section className="section container-home">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="order-2 lg:order-1 lg:col-span-1">
            <CategorySidebar categories={categories} />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <p className="text-slate-600">
                Hiển thị{" "}
                <strong className="text-slate-900">
                  {total === 0
                    ? 0
                    : `${start + 1}–${Math.min(start + PER_PAGE, total)}`}
                </strong>{" "}
                / {total} sản phẩm
                {totalPages > 1 && (
                  <span className="text-slate-400">
                    {" "}
                    · Trang {safePage}/{totalPages}
                  </span>
                )}
              </p>
            </div>

            {paged.length === 0 ? (
              <EmptyState
                title="Chưa có sản phẩm"
                description="Danh mục sản phẩm đang được cập nhật. Vui lòng quay lại sau hoặc liên hệ để được tư vấn."
              />
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
                    isProduct={true}
                  />
                ))}
              </div>
            )}

            <Pagination
              page={safePage}
              totalPages={totalPages}
              basePath="/danh-muc"
              param="page"
            />
          </div>
        </div>
      </section>
    </>
  );
}
