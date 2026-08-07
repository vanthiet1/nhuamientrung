import type { Metadata } from "next";
import Link from "next/link";
import { Package, Newspaper, FolderTree, Layers, Search } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import HeaderSearch from "@/components/HeaderSearch";
import SafeImage from "@/components/SafeImage";
import { searchSite } from "@/lib/cms/search";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  return {
    title: q ? `Tìm kiếm: ${q}` : "Tìm kiếm",
    description:
      "Tìm sản phẩm, tin tức, danh mục bao bì màng co tại Bao Bì Thành Phát.",
    robots: { index: false, follow: true },
  };
}

const typeMeta = {
  product: { label: "Sản phẩm", icon: Package, color: "bg-sky-50 text-sky-700" },
  news: { label: "Tin tức", icon: Newspaper, color: "bg-violet-50 text-violet-700" },
  category: { label: "Danh mục", icon: FolderTree, color: "bg-emerald-50 text-emerald-700" },
  subcategory: { label: "Danh mục con", icon: Layers, color: "bg-amber-50 text-amber-700" },
} as const;

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const results = q ? await searchSite(q, 60) : [];

  const counts = {
    product: results.filter((r) => r.type === "product").length,
    news: results.filter((r) => r.type === "news").length,
    category: results.filter((r) => r.type === "category").length,
    subcategory: results.filter((r) => r.type === "subcategory").length,
  };

  return (
    <>
      <PageBanner
        title="Tìm kiếm"
        breadcrumbs={[{ label: "Tìm kiếm" }]}
        subtitle={
          q
            ? `Kết quả cho “${q}”`
            : "Tìm sản phẩm, tin tức, danh mục"
        }
      />

      <section className="section container-page">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <HeaderSearch variant="mobile" defaultValue={q} />
            {q && (
              <p className="mt-3 text-sm text-slate-500">
                Tìm thấy{" "}
                <strong className="text-slate-800">{results.length}</strong> kết
                quả
                {results.length > 0 && (
                  <span className="text-slate-400">
                    {" "}
                    · SP {counts.product} · Tin {counts.news} · DM{" "}
                    {counts.category + counts.subcategory}
                  </span>
                )}
              </p>
            )}
          </div>

          {!q && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <Search className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                Nhập từ khóa để tìm kiếm
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ví dụ: màng co PVC, POF, bao bì thực phẩm…
              </p>
            </div>
          )}

          {q && results.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <p className="font-semibold text-slate-800">
                Không có kết quả cho “{q}”
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Thử từ khóa ngắn hơn hoặc xem{" "}
                <Link href="/san-pham" className="font-bold text-brand-600 hover:underline">
                  sản phẩm
                </Link>
                .
              </p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="space-y-3">
              {results.map((hit) => {
                const meta = typeMeta[hit.type];
                const Icon = meta.icon;
                return (
                  <li key={`${hit.type}-${hit.id}`}>
                    <Link
                      href={hit.href}
                      className="card-hover group flex gap-3.5 p-3.5 sm:gap-4 sm:p-4"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-20">
                        {hit.image ? (
                          <SafeImage
                            src={hit.image}
                            alt={hit.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                            fallbackClassName="bg-slate-100"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <Icon className="h-7 w-7" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.color}`}
                        >
                          <Icon className="h-3 w-3" />
                          {meta.label}
                        </span>
                        <h2 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 transition group-hover:text-brand-600 sm:text-base">
                          {hit.title}
                        </h2>
                        {hit.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 sm:text-sm">
                            {hit.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
