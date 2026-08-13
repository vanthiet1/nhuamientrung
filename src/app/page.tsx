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
import HomeImageSlider from "@/components/HomeImageSlider";
import HomeCategoryProducts from "@/components/HomeCategoryProducts";
import HomeNewsScroll from "@/components/HomeNewsScroll";
import PartnersSlider from "@/components/PartnersSlider";
import CategorySidebar from "@/components/CategorySidebar";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
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

      {/* SEO Content / About Us */}
      <section className="bg-white py-14 sm:py-20">
        <div className="container-home">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Bao Bì Thành Phát <br className="hidden sm:block" />
                <span className="text-brand-600">Giải pháp màng co toàn diện</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Với kinh nghiệm nhiều năm trong lĩnh vực sản xuất và phân phối bao bì, chúng tôi tự hào là đối tác tin cậy của hàng ngàn doanh nghiệp tại <strong>Miền Trung - Tây Nguyên</strong>. Thành Phát chuyên cung cấp màng co PVC, POF, PE và các dịch vụ gia công in ấn chất lượng cao.
              </p>
              
              <ul className="mt-8 space-y-4">
                {[
                  {
                    title: "Chất lượng vượt trội",
                    desc: "Màng co có độ bền dai, tỷ lệ co nhiệt chuẩn xác giúp ôm sát và bảo vệ sản phẩm tuyệt đối."
                  },
                  {
                    title: "Xưởng sản xuất trực tiếp",
                    desc: "Không qua trung gian, mang đến mức giá sỉ tận gốc và chiết khấu hấp dẫn cho đơn hàng lớn."
                  },
                  {
                    title: "Hỗ trợ tận tâm & Tốc độ",
                    desc: "Tư vấn kỹ thuật tận nơi, giao hàng hỏa tốc nội thành Đà Nẵng và gửi chành xe toàn quốc."
                  }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <BadgeCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/gioi-thieu" className="btn-primary">
                  Tìm hiểu thêm về chúng tôi
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="relative lg:pl-12">
              <div className="mx-auto aspect-square max-w-md overflow-hidden rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-slate-900/5 lg:mr-0 lg:max-w-lg lg:aspect-[4/3]">
                <HomeImageSlider images={allProducts.map(p => p.image || "").filter(Boolean)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục + sidebar + sản phẩm + phân trang */}
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
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1 [scrollbar-width:thin]">
              <CategorySidebar categories={categories} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <HomeCategoryProducts groups={groups} page={page} />
          </div>
        </div>
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


      {/* Testimonials */}
      <section className="section bg-slate-50 border-t border-slate-200">
        <div className="container-home">
          <SectionHeading
            eyebrow="Đánh giá"
            title="Khách hàng nói về chúng tôi"
            description="Sự hài lòng của đối tác chính là thước đo thành công của Bao Bì Thành Phát"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Anh Hoàng",
                role: "Chủ xưởng sản xuất nước đóng chai",
                text: "Tôi đã nhập màng co lốc chai của Thành Phát hơn 2 năm nay. Chất lượng màng rất đồng đều, co ôm sát chai không bị nhăn móp. Đặc biệt giá cả luôn ổn định và giao hàng cực kỳ nhanh chóng khi tôi cần gấp.",
                rating: 5
              },
              {
                name: "Chị Ngọc",
                role: "Quản lý công ty mỹ phẩm",
                text: "Công ty hỗ trợ tư vấn và in ấn màng co POF rất nhiệt tình. Màng co trong suốt, mỏng nhưng rất dai, làm cho hộp mỹ phẩm của bên tôi trông cao cấp hẳn lên. Hỗ trợ gửi mẫu test tận nơi rất chu đáo.",
                rating: 5
              },
              {
                name: "Anh Tuấn",
                role: "Cửa hàng bách hóa tổng hợp",
                text: "Bên mình thường xuyên lấy túi zipper và băng keo trong số lượng lớn. Hàng của Thành Phát dùng rất bền, keo dính chắc. Điểm cộng lớn nhất là chính sách công nợ linh hoạt và hỗ trợ chành xe về tỉnh rất thuận tiện.",
                rating: 5
              }
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <svg key={idx} className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-slate-700 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-slate-100">
        <FaqAccordion
          title="Câu hỏi thường gặp về Bao Bì Thành Phát"
          items={[
            {
              question: "Bao bì Thành Phát hoạt động ở đâu và có giao hàng toàn quốc không?",
              answer: "Xưởng sản xuất và văn phòng chính của chúng tôi đặt tại Đà Nẵng. Chúng tôi hỗ trợ giao hàng toàn quốc (đặc biệt các tỉnh miền Trung - Tây Nguyên) với thời gian nhanh chóng, thông qua các chành xe và đơn vị vận chuyển uy tín."
            },
            {
              question: "Công ty có xưởng sản xuất trực tiếp không hay là thương mại?",
              answer: "Thành Phát tự hào sở hữu xưởng sản xuất và gia công trực tiếp không qua trung gian. Do đó, chúng tôi luôn đảm bảo mức giá cạnh tranh nhất và kiểm soát chặt chẽ chất lượng từng lô hàng màng co xuất xưởng."
            },
            {
              question: "Tôi có thể yêu cầu gửi mẫu dùng thử trước khi đặt số lượng lớn không?",
              answer: "Hoàn toàn được. Chúng tôi luôn khuyến khích khách hàng test mẫu màng co thực tế trên sản phẩm của mình để chọn được kích thước, độ dày và chất liệu phù hợp nhất. Liên hệ ngay Hotline để nhận mẫu miễn phí."
            },
            {
              question: "Thành Phát có cung cấp hóa đơn VAT không?",
              answer: "Có. Chúng tôi cung cấp đầy đủ hóa đơn chứng từ hợp lệ (Hóa đơn điện tử VAT) cho các doanh nghiệp, công ty, xưởng sản xuất theo đúng quy định của pháp luật."
            },
            {
              question: "Công ty có hỗ trợ máy khò nhiệt hoặc máy rút màng co không?",
              answer: "Bên cạnh việc cung cấp màng co, chúng tôi còn tư vấn kỹ thuật và hỗ trợ khách hàng tìm mua/sử dụng các loại máy khò màng co cầm tay, máy co màng tự động phù hợp với quy mô sản xuất của bạn."
            }
          ]}
        />
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500">
        <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-20" />
      </section>
    </>
  );
}
