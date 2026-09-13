import Link from "next/link";
import {
  Phone,
  Shield,
  Truck,
  BadgeCheck,
  Factory,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Activity,
  Leaf,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import HomeImageSlider from "@/components/HomeImageSlider";
import HomeCategoryProducts from "@/components/HomeCategoryProducts";
import HomePrintingProducts from "@/components/HomePrintingProducts";
import HomeAuxiliaryProducts from "@/components/HomeAuxiliaryProducts";
import HomeRemainingProducts from "@/components/HomeRemainingProducts";
import HomeNewsScroll from "@/components/HomeNewsScroll";
import NewsTicker from "@/components/NewsTicker";
import PartnersSlider from "@/components/PartnersSlider";
import ProcessFlow from "@/components/ProcessFlow";
import QuoteForm from "@/components/QuoteForm";
import CategorySidebar from "@/components/CategorySidebar";
import SupportProductsSection from "@/components/SupportProductsSection";
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

export const revalidate = 3600;

type Props = {};

export default async function HomePage({}: Props) {

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

      {/* Premium Feature Highlights Section */}
      <section className="bg-gradient-to-b from-slate-100/80 via-white to-slate-50/50 border-b border-slate-200/80 py-10 sm:py-12">
        <div className="container-home">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (props: any) => <CheckCircle2 {...props} />,
                title: "Chất lượng vượt trội",
                subtitle: "Đảm bảo 100% tiêu chuẩn",
                badge: "✨ Quality",
                gradient: "from-brand-600 to-brand-800",
                glow: "shadow-brand-600/25",
              },
              {
                icon: (props: any) => (
                  <Factory {...props} />
                ),
                title: "Xưởng sản xuất trực tiếp",
                subtitle: "Giá gốc không qua trung gian",
                badge: "🏭 Direct Factory",
                gradient: "from-sky-600 to-brand-700",
                glow: "shadow-sky-600/25",
              },
              {
                icon: (props: any) => <Leaf {...props} />,
                title: "Hỗ trợ tận tâm & Tốc độ",
                subtitle: "Tư vấn báo giá 24/7",
                badge: "⚡ Fast Service",
                gradient: "from-emerald-600 to-teal-700",
                glow: "shadow-emerald-600/25",
              },
              {
                icon: (props: any) => <Truck {...props} />,
                title: "Giao hàng toàn quốc",
                subtitle: "Giao hàng tận nơi siêu tốc",
                badge: "🚛 Delivery",
                gradient: "from-brand-700 to-sky-700",
                glow: "shadow-brand-700/25",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative flex flex-1 items-center gap-4.5 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50/80 p-5 sm:p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-900/10 overflow-hidden"
              >
                {/* Glossy Glint Shimmer Sweep on Hover */}
                <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
                  <div className="absolute -left-[100%] top-0 h-full w-[70%] -skew-x-[25deg] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all duration-1000 group-hover:left-[150%]" />
                </div>

                {/* Top border glass highlight line */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon Box with Metallic Gradient & Glowing Shadow */}
                <div className={`flex h-13 w-13 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white ${item.glow} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <item.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                <div className="flex flex-col text-left min-w-0">
                  <div className="text-sm font-extrabold text-slate-800 transition-colors duration-300 group-hover:text-brand-700 sm:text-base leading-snug truncate">
                    {item.title}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors truncate">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Feature Highlights Section */}

      {/* Danh mục sản phẩm (Tabs) */}
      <section id="danh-muc-san-pham" className="py-14 sm:py-20 bg-slate-50">
        <div className="container-home space-y-16">
          <HomeCategoryProducts groups={groups} />
          <HomePrintingProducts groups={groups} />
          <HomeAuxiliaryProducts groups={groups} />
          <HomeRemainingProducts groups={groups} />

          {/* Nút Xem tất cả 50+ sản phẩm */}
          <div className="flex justify-center pt-2">
            <Link
              href="/tat-ca-san-pham"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-brand-700 via-brand-800 to-brand-900 hover:from-brand-600 hover:via-brand-700 hover:to-brand-800 text-white font-extrabold text-sm sm:text-base rounded-full shadow-lg shadow-brand-900/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>XEM TẤT CẢ 50+ SẢN PHẨM BAO BÌ THÀNH PHÁT</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <ProcessFlow />
      <QuoteForm />

      <section className="border-b border-slate-100 bg-white py-12 sm:py-16">
        <div className="container-home text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-10">
            Đối Tác Của Chúng Tôi
          </h2>
          <PartnersSlider partners={partners} />
        </div>
      </section>

      {/* Testimonials & News Grid */}
      <section className="section bg-slate-50 border-t border-slate-100 py-16">
        <div className="container-home">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-900">
                Khách hàng nói về chúng tôi
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    name: "Anh Hoàng",
                    role: "Chủ xưởng sản xuất nước đóng chai",
                    text: "Tôi đã nhập màng co lốc chai của Thành Phát hơn 2 năm nay. Chất lượng màng rất đồng đều, co ôm sát chai không bị nhăn móp.",
                    rating: 5
                  },
                  {
                    name: "Ngân Huyên",
                    role: "CEO của Room Thủy Lịch",
                    text: "Công ty hỗ trợ tư vấn và in ấn màng co POF rất nhiệt tình. Màng co trong suốt, mỏng nhưng rất dai, làm cho hộp mỹ phẩm của bên tôi trông cao cấp hẳn lên.",
                    rating: 5
                  }
                ].map((t, i) => (
                  <div key={i} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-1 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <svg key={idx} className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="flex-1 text-slate-600 leading-relaxed">"{t.text}"</p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[15px] font-bold tracking-wider text-brand-700">
                        {t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
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

            <div className="lg:col-span-1">
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-900">
                Tin tức
              </h2>
              <NewsTicker 
                items={[featuredNews, ...scrollNews].filter(Boolean).map(n => ({
                  slug: n.slug,
                  title: n.title,
                  excerpt: n.excerpt,
                  date: n.date,
                  image: n.image
                }))} 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-slate-100">
        <FaqAccordion
          title="CÂU HỎI THƯỜNG GẶP"
          items={[
            {
              question: "Các dịch vụ chính của Bao Bì Thành Phát là gì?",
              answer: "Chúng tôi chuyên sản xuất, gia công và in ấn các loại bao bì đóng gói như: màng co PVC, PE, POF, màng quấn Pallet, màng xốp hơi, băng keo công nghiệp... Phục vụ cho ngành nước giải khát, thực phẩm, dược phẩm và hóa mỹ phẩm."
            },
            {
              question: "Chính sách giá sỉ và đại lý của Thành Phát như thế nào?",
              answer: "Vì Thành Phát là xưởng sản xuất trực tiếp không qua trung gian, chúng tôi cam kết mức giá tận xưởng cực kỳ cạnh tranh. Khách hàng đặt số lượng lớn hoặc đăng ký làm đại lý sẽ được hưởng mức chiết khấu đặc biệt và ưu tiên tiến độ sản xuất."
            },
            {
              question: "Công ty có hỗ trợ thiết kế và in ấn màng co không?",
              answer: "Có! Chúng tôi hỗ trợ thiết kế mẫu mã bao bì miễn phí theo yêu cầu của khách hàng. Công nghệ in ống đồng tiên tiến giúp hình ảnh sắc nét, bền màu, đáp ứng mọi tiêu chuẩn khắt khe nhất."
            },
            {
              question: "Làm sao để đảm bảo chất lượng bao bì Thành Phát?",
              answer: "Mỗi lô hàng trước khi xuất xưởng đều phải qua quy trình kiểm tra chất lượng (QC) nghiêm ngặt: kiểm tra độ trong suốt, độ dai, khả năng co nhiệt và độ bám dính của mực in. Chúng tôi cam kết đổi trả 100% nếu sản phẩm có lỗi từ nhà sản xuất."
            },
            {
              question: "Thời gian giao hàng và chính sách vận chuyển ra sao?",
              answer: "Với các đơn hàng tiêu chuẩn, thời gian sản xuất và giao hàng từ 3-7 ngày làm việc. Chúng tôi giao hàng tận nơi tại Đà Nẵng và hỗ trợ gửi chành xe đi các tỉnh Miền Trung - Tây Nguyên nhanh chóng, an toàn."
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
