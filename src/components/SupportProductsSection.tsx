import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CategoryWithProducts } from "@/components/HomeCategoryProducts";

const TARGET_SLUGS = [
  "mang-xop-hoi-xop-khi-xop-boc-hang",
  "mang-xop-pe-foam",
  "mang-quan-pallet",
  "bang-keo-hang-de-vo",
];

const TARGET_TITLES = [
  "Xốp hơi",
  "Xốp PE Foam",
  "Màng PE quấn pallet",
  "Băng keo đóng gói",
];

export default function SupportProductsSection({ groups = [] }: { groups?: CategoryWithProducts[] }) {
  const supportProducts = TARGET_SLUGS.map((slug, i) => {
    const group = groups.find(g => g.category.slug === slug);
    const firstProduct = group?.products?.[0];
    const image = firstProduct?.image || "/images/placeholder.jpg";
    
    return {
      title: TARGET_TITLES[i],
      image,
      href: `/danh-muc/${slug}`
    };
  });

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="container-home">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-brand-500"></span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                Sản phẩm hỗ trợ
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Vật liệu đóng gói tại Miền Trung
            </h2>
          </div>
          <div className="text-sm leading-relaxed text-slate-500 md:max-w-sm">
            Nhóm hàng cồng kềnh được bố trí gọn hơn và xác nhận phạm vi giao theo số lượng, địa điểm thực tế.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {supportProducts.map((p, i) => (
            <Link
              key={i}
              href={p.href}
              className="group relative block h-[320px] sm:h-[400px] w-full overflow-hidden rounded-2xl"
            >
              {/* Background Image - will fallback to gray if not found */}
              <div 
                className="absolute inset-0 bg-slate-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${p.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111c33] via-[#111c33]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col p-6">
                <h3 className="mb-2 text-xl font-bold text-white transition-colors">
                  {p.title}
                </h3>
                <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-300 transition-colors group-hover:text-brand-300">
                  Ưu tiên Đà Nẵng & Miền Trung
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
