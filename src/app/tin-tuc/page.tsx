import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import NewsCard from "@/components/NewsCard";
import EmptyState from "@/components/EmptyState";
import { loadNews } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tin tức màng co & bao bì",
  description:
    "Tin tức màng co nhiệt, bao bì đóng gói, kiến thức packaging từ Bao Bì Thành Phát Đà Nẵng.",
  keywords: [
    "tin tức bao bì",
    "tin màng co nhiệt",
    "kiến thức đóng gói",
    "Bao Bì Thành Phát",
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://baobithanhphat.com"}/tin-tuc`,
  },
};

export default async function NewsPage() {
  const newsItems = await loadNews();
  const [featured, ...rest] = newsItems;

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
                {rest.slice(0, 4).map((item) => (
                  <NewsCard key={item.slug} item={item} />
                ))}
              </div>
            </div>

            {rest.length > 4 && (
              <div className="mt-12">
                <h2 className="mb-5 text-xl font-extrabold text-slate-900">
                  Bài viết khác
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.slice(4).map((item) => (
                    <NewsCard key={item.slug} item={item} featured />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
