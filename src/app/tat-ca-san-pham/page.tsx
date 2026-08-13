import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
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

export const dynamic = "force-dynamic";

const PER_PAGE = 8;

type Props = {
  searchParams: Promise<{ page?: string }>;
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
    { label: "Sản phẩm", href: "/tat-ca-san-pham" },
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
      
      <BreadcrumbBar items={breadcrumbs} />
      
      <PageBanner
        title="Tất Cả Sản Phẩm"
        subtitle="Danh sách toàn bộ sản phẩm màng co & bao bì đóng gói"
        wide
      />

      <section className="bg-white pb-6 pt-10 sm:pb-8 sm:pt-12">
        <div className="container-page prose prose-slate max-w-4xl prose-headings:text-slate-900 prose-a:text-brand-600">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Giải pháp bao bì màng co chất lượng tại Đà Nẵng</h2>
          <p>
            Bao Bì Thành Phát tự hào là đơn vị hàng đầu tại khu vực Miền Trung - Tây Nguyên chuyên cung cấp các giải pháp đóng gói toàn diện. Danh mục sản phẩm đa dạng của chúng tôi bao gồm <strong>màng co PVC, PE, POF, PET</strong>, và các loại bao bì màng ghép phức hợp cao cấp.
          </p>
          <p>
            Dù bạn đang sản xuất nước đóng chai, chế biến thực phẩm, hay gia công mỹ phẩm, chúng tôi luôn có sản phẩm phù hợp. Với lợi thế <strong>xưởng sản xuất trực tiếp không qua trung gian</strong>, Bao Bì Thành Phát cam kết mang đến:
          </p>
          <ul>
            <li>Chất lượng màng co đồng đều, độ dẻo dai và khả năng chịu lực vượt trội.</li>
            <li>Chi phí tối ưu nhất cho cả khách mua lẻ và doanh nghiệp mua số lượng lớn.</li>
            <li>Hỗ trợ gia công cắt sẵn, ép cong, in ấn logo thương hiệu sắc nét.</li>
            <li>Giao hàng hỏa tốc nội thành Đà Nẵng và gửi chành xe toàn quốc.</li>
          </ul>
        </div>
      </section>

      <section className="section container-home">
        <div className="mx-auto w-full">
          <div>
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
                description="Danh sách sản phẩm đang được cập nhật."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paged.map((p, i) => {
                  // or they just mean a category label on the card? The card already has it inside `ProductCard` technically? No.
                  return (
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
                  );
                })}
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
      </section>

      <section className="bg-slate-50 border-t border-slate-200">
        <FaqAccordion items={faqItems} title="Câu hỏi thường gặp về Bao Bì & Màng Co" />
      </section>
    </>
  );
}
