import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import { loadCategories, loadProducts } from "@/lib/data/public";
import { company } from "@/lib/data/company";
import { primaryKeywords, siteUrl } from "@/lib/seo/keywords";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ProductsClientTools from "@/components/ProductsClientTools";
import { ArrowRight, ChevronRight, PackageSearch } from "lucide-react";

export const dynamic = "force-dynamic";

const PER_PAGE = 12; // Tăng lên 12 cho chẵn 3 cột hoặc 4 cột

type Props = {
  searchParams: Promise<{ page?: string; q?: string; category?: string; sort?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const baseTitle = "Tất cả sản phẩm bao bì đóng gói Đà Nẵng";
  const title = page > 1 ? `${baseTitle} · Trang ${page}` : baseTitle;
  const description =
    "Tổng hợp tất cả sản phẩm bao bì & shrink film PVC, PE, POF, PET tại Đà Nẵng. Xem đầy đủ sản phẩm và nhận báo giá nhanh.";
  const canonical =
    page > 1 ? `${siteUrl}/tat-ca-san-pham?page=${page}` : `${siteUrl}/tat-ca-san-pham`;

  return {
    title,
    description,
    keywords: [
      ...primaryKeywords,
      "sản phẩm bao bì",
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

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const q = (sp.q || "").toLowerCase();
  const catSlug = sp.category || "";
  const sort = sp.sort || "newest";

  const [categories, allProducts] = await Promise.all([
    loadCategories(),
    loadProducts(),
  ]);

  // Map to flat categories for Sidebar
  const catStats = categories.flatMap((c) => {
    const list = [{ name: c.name, slug: c.slug, count: 0 }];
    if (c.children) {
      c.children.forEach(child => list.push({ name: child.name, slug: child.slug, count: 0 }));
    }
    return list;
  });

  // Calculate counts
  allProducts.forEach(p => {
    const cat = catStats.find(c => c.slug === p.category_slug);
    if (cat) cat.count++;
  });

  const activeCategories = catStats.filter(c => c.count > 0).sort((a, b) => b.count - a.count);

  // Filter products
  let filtered = allProducts;
  if (catSlug) {
    filtered = filtered.filter(p => p.category_slug === catSlug);
  }
  if (q) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  // Sort products
  if (sort === "name_asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name_desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    // "newest" is default (usually they come ordered from DB by created_at desc)
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const paged = filtered.slice(start, start + PER_PAGE);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tất cả sản phẩm",
    numberOfItems: total,
    itemListElement: paged.map((p, i) => ({
      "@type": "ListItem",
      position: start + i + 1,
      name: p.name,
      url: `${siteUrl}/san-pham/${p.slug}`,
    })),
  };

  const breadcrumbs = [
    { label: "Tất cả sản phẩm", href: "/tat-ca-san-pham" },
  ];

  const faqItems = [
    {
      question: "Bao bì Thành Phát cung cấp những loại màng co nào?",
      answer: "Chúng tôi chuyên sản xuất và phân phối màng co PVC, PE, POF, PET các loại. Bao gồm màng co dạng cuộn, màng co cắt sẵn, màng co in logo, túi màng ghép phức hợp phù hợp cho nhiều ngành công nghiệp: thực phẩm, mỹ phẩm, đồ gia dụng, và đóng lốc chai nước."
    },
    {
      question: "Tôi có thể đặt hàng màng co theo kích thước yêu cầu không?",
      answer: "Hoàn toàn được! Bao Bì Thành Phát nhận gia công màng co cắt nhiệt, dập cong, cắt thẳng, bọc nắp chai theo đúng quy cách và kích thước sản phẩm của khách hàng."
    },
    {
      question: "Thời gian giao hàng ở Đà Nẵng và các tỉnh thành khác mất bao lâu?",
      answer: "Đối với khu vực nội thành Đà Nẵng, chúng tôi hỗ trợ giao hàng trong ngày. Đối với các tỉnh thành phố khác, thời gian giao hàng thường dao động từ 1 - 3 ngày tùy thuộc vào khoảng cách và số lượng đơn hàng."
    },
    {
      question: "Công ty có nhận in ấn logo lên màng co không?",
      answer: "Có, Thành Phát hỗ trợ thiết kế và in ấn logo, thương hiệu, thông tin sản phẩm trực tiếp lên màng co (in màng co nhiệt) với chất lượng sắc nét, màng co ôm sát sản phẩm không làm méo hình."
    }
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Trang chủ", url: siteUrl },
            { name: "Sản phẩm", url: `${siteUrl}/tat-ca-san-pham` },
          ]),
          itemListJsonLd,
        ]}
      />
      
      {/* Hero Section Redesign */}
      <section className="relative overflow-hidden bg-slate-900 pb-16 pt-20 lg:pb-24 lg:pt-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -left-[20%] top-0 h-96 w-96 rounded-full bg-brand-500/30 blur-[120px]"></div>
          <div className="absolute -right-[20%] bottom-0 h-96 w-96 rounded-full bg-sky-500/30 blur-[120px]"></div>
        </div>
        <div className="container-page relative z-10 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-sm font-semibold text-brand-300">
            <PackageSearch className="h-4 w-4" />
            Khám phá danh mục sản phẩm
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tất Cả Sản Phẩm
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Giải pháp bao bì màng co chất lượng cao tại Miền Trung - Tây Nguyên. Đa dạng mẫu mã, cắt sẵn theo yêu cầu, đáp ứng mọi nhu cầu đóng gói.
          </p>
        </div>
      </section>

      <BreadcrumbBar items={breadcrumbs} />

      <section className="section bg-slate-50">
        <div className="container-home">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            
            {/* Sidebar (Desktop) */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Danh mục sản phẩm</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/tat-ca-san-pham"
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                        !catSlug ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>Tất cả</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                        {allProducts.length}
                      </span>
                    </Link>
                  </li>
                  {activeCategories.map((c) => {
                    const isActive = catSlug === c.slug;
                    return (
                      <li key={c.slug}>
                        <Link
                          href={`/tat-ca-san-pham?category=${c.slug}`}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span className="truncate pr-2">{c.name}</span>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            isActive ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {c.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <ProductsClientTools categories={activeCategories} total={allProducts.length} />

              <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
                <p className="text-slate-600">
                  Hiển thị{" "}
                  <strong className="text-slate-900">
                    {total === 0
                      ? 0
                      : `${start + 1}–${Math.min(start + PER_PAGE, total)}`}
                  </strong>{" "}
                  / {total} sản phẩm
                </p>
              </div>

              {paged.length === 0 ? (
                <EmptyState
                  title="Không tìm thấy sản phẩm nào"
                  description="Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác."
                />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                basePath="/tat-ca-san-pham"
                param="page"
              />
            </div>

          </div>
        </div>
      </section>

      <section className="bg-white border-t border-slate-200">
        <FaqAccordion items={faqItems} title="Câu hỏi thường gặp về Bao Bì & Màng Co" />
      </section>
    </>
  );
}
