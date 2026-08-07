import Link from "next/link";
import {
  Phone,
  Shield,
  Truck,
  BadgeCheck,
  Factory,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import HomeCategoryProducts from "@/components/HomeCategoryProducts";
import HomeNewsScroll from "@/components/HomeNewsScroll";
import PartnersSlider from "@/components/PartnersSlider";
import SectionHeading from "@/components/ui/SectionHeading";
import { company } from "@/lib/data/company";
import { partners } from "@/lib/data/partners";
import {
  loadBanners,
  loadCategories,
  loadNews,
  loadProducts,
} from "@/lib/data/public";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [categories, newsItems, allProducts, banners] = await Promise.all([
    loadCategories(),
    loadNews(),
    loadProducts(),
    loadBanners(),
  ]);

  const groups = categories.map((category) => ({
    category,
    products: allProducts.filter((p) => p.categoryId === category.id),
  }));

  const featuredNews = newsItems[0];
  // enough items for vertical auto-scroll feed
  const scrollNews = newsItems.slice(1, 16);

  return (
    <>
      <HeroSlider banners={banners} />

      <section className="border-b border-slate-200/80 bg-white">
        <div className="container-home grid grid-cols-2 gap-3 py-7 md:grid-cols-4 md:gap-4">
          {[
            { icon: Factory, label: "Giải pháp bao bì", value: "Đa dạng" },
            { icon: BadgeCheck, label: "Chất lượng", value: "Ổn định" },
            { icon: Truck, label: "Giao hàng", value: "Toàn quốc" },
            { icon: Shield, label: "Tư vấn", value: "Tận tâm" },
          ].map((item) => (
            <div
              key={item.label}
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3.5 py-3.5 transition hover:border-brand-200 hover:bg-brand-50/50 sm:px-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-100 transition group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900">{item.value}</div>
                <div className="text-xs text-slate-500">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Danh mục + sản phẩm + phân trang */}
      <section
        id="danh-muc-san-pham"
        className="section container-home scroll-mt-28"
      >
        <SectionHeading
          eyebrow="Sản phẩm"
          title="Danh mục sản phẩm"
          description="Mỗi danh mục kèm sản phẩm tiêu biểu — xem tất cả hoặc chuyển trang"
          href="/san-pham"
          linkLabel="Xem toàn bộ danh mục bao bì →"
        />
        <HomeCategoryProducts groups={groups} page={page} />
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full border-[28px] border-white/[0.07]" />
          <div className="absolute inset-0 bg-grid-soft opacity-20" />
        </div>
        <div className="container-home relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-accent-300">
              <Sparkles className="h-4 w-4" />
              Giới thiệu về
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {company.shortName}
            </h2>
            <p className="mt-4 leading-relaxed text-white/90">
              <strong className="font-extrabold text-white">{company.shortName}</strong>{" "}
              chuyên{" "}
              <strong className="font-semibold text-white">
                bao bì đóng gói tại Đà Nẵng
              </strong>
              : shrink film PVC, PE, POF, PET, OPP-BOPP và film in nhiệt cho ngành
              nước giải khát, thực phẩm, dược phẩm, hóa mỹ phẩm.
            </p>
            <p className="mt-3 leading-relaxed text-white/75">
              {company.aboutBlurb}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/gioi-thieu"
                className="btn-primary"
                aria-label="Xem giới thiệu Bao Bì Thành Phát"
              >
                Giới thiệu công ty
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/lien-he"
                className="btn-secondary !text-white"
                aria-label="Gửi yêu cầu báo giá bao bì"
              >
                Nhận báo giá miễn phí
              </Link>
              <a
                href={`tel:${company.phoneRaw}`}
                className="btn-secondary !text-white"
                aria-label={`Gọi hotline ${company.phone}`}
              >
                <Phone className="h-4 w-4" />
                Gọi {company.phone}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { t: "PVC shrink film", d: "Trong suốt, co nhiệt tốt" },
              { t: "PE đóng lốc", d: "Bền chắc, chịu lực" },
              { t: "POF thực phẩm", d: "An toàn, dai mềm" },
              { t: "In logo bao bì", d: "Nhận diện thương hiệu" },
            ].map((box) => (
              <div
                key={box.t}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15 sm:p-5"
              >
                <div className="text-base font-bold sm:text-lg">{box.t}</div>
                <div className="mt-1 text-sm text-white/75">{box.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Đối tác — sau Giới thiệu */}
      <section className="border-b border-slate-100 bg-slate-50/80 py-12 sm:py-14">
        <div className="container-home">
          <SectionHeading
            eyebrow="Đồng hành"
            title="Đối tác"
            description="Những thương hiệu tin tưởng và đồng hành cùng Bao Bì Thành Phát"
          />
          <PartnersSlider partners={partners} />
        </div>
      </section>

      {featuredNews && (
        <section className="section container-home">
          <SectionHeading
            eyebrow="Cập nhật"
            title="Tin tức"
            description="Tin mới từ ngành màng co & bao bì — ảnh và tiêu đề cập nhật"
            href="/tin-tuc"
            linkLabel="Xem tất cả tin tức bao bì →"
          />
          <HomeNewsScroll
            featured={{
              slug: featuredNews.slug,
              title: featuredNews.title,
              excerpt: featuredNews.excerpt,
              date: featuredNews.date,
              image: featuredNews.image,
            }}
            items={scrollNews.map((n) => ({
              slug: n.slug,
              title: n.title,
              excerpt: n.excerpt,
              date: n.date,
              image: n.image,
            }))}
          />
        </section>
      )}

      <section className="relative overflow-hidden bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500">
        <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-20" />
      </section>
    </>
  );
}
