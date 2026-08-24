import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import NewsCard from "@/components/NewsCard";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { loadNews } from "@/lib/data/public";

export const revalidate = 3600;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://baobithanhphat.com";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const baseTitle = "Tin tức màng co & bao bì";
  const title = page > 1 ? `${baseTitle} · Trang ${page}` : baseTitle;
  const description =
    "Tin tức màng co nhiệt, bao bì đóng gói, kiến thức packaging từ Bao Bì Thành Phát Đà Nẵng.";
  const canonical = page > 1 ? `${siteUrl}/tin-tuc?page=${page}` : `${siteUrl}/tin-tuc`;

  return {
    title,
    description,
    keywords: [
      "tin tức bao bì",
      "tin màng co nhiệt",
      "kiến thức đóng gói",
      "Bao Bì Thành Phát",
    ],
    alternates: { canonical },
    openGraph: {
      title,
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

const PER_PAGE = 8;

export default async function NewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const newsItems = await loadNews();
  const [featured, ...rest] = newsItems;

  const topNews = rest.slice(0, 4);
  const otherNews = rest.slice(4);

  const total = otherNews.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, Math.max(1, totalPages));
  const start = (safePage - 1) * PER_PAGE;
  const pagedOtherNews = otherNews.slice(start, start + PER_PAGE);

  return (
    <>
      <PageBanner
        title="Tin tức"
        breadcrumbs={[{ label: "Tin tức" }]}
        subtitle="Kiến thức màng co, bao bì và xu hướng đóng gói"
      />

      <section className="section container-page">
        {!featured ? (
          <EmptyState type="news" />
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-5 lg:gap-6">
              <div className="lg:col-span-2">
                <NewsCard item={featured} featured />
              </div>
              <div className="flex flex-col gap-3 lg:col-span-3">
                {topNews.map((item) => (
                  <NewsCard key={item.slug} item={item} />
                ))}
              </div>
            </div>

            {otherNews.length > 0 && (
              <div className="mt-12" id="bai-viet-khac">
                <h2 className="mb-5 text-xl font-extrabold text-slate-900">
                  Bài viết khác
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {pagedOtherNews.map((item) => (
                    <NewsCard key={item.slug} item={item} featured />
                  ))}
                </div>
                
                <div className="mt-8">
                  <Pagination 
                    page={safePage} 
                    totalPages={totalPages} 
                    basePath="/tin-tuc" 
                    param="page" 
                    hash="bai-viet-khac" 
                  />
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
