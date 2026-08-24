import type { Metadata } from "next";
import Link from "next/link";
import { Target, Eye, HeartHandshake, Award } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Giới thiệu công ty bao bì Đà Nẵng",
  description: `Giới thiệu ${company.name} — chuyên màng co nhiệt, bao bì đóng gói tại Đà Nẵng. MST ${company.taxCode}.`,
  keywords: [
    "giới thiệu Bao Bì Thành Phát",
    "công ty bao bì Đà Nẵng",
    "màng co nhiệt Đà Nẵng",
    company.shortName,
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nhuamientrung.vn"}/gioi-thieu`,
  },
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="Giới thiệu"
        breadcrumbs={[{ label: "Giới thiệu" }]}
        subtitle="Đối tác bao bì tin cậy tại Đà Nẵng và toàn quốc"
      />

      <section className="section container-page">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-6 lg:col-span-2">
            <div className="card p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-brand-700">
                {company.name}
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate-600">
                <p>
                  Chúng tôi là đơn vị chuyên cung cấp các giải pháp bao bì và màng
                  co nhiệt tại Đà Nẵng, phục vụ doanh nghiệp sản xuất, kinh doanh
                  trong ngành nước giải khát, thực phẩm, dược phẩm, hóa mỹ phẩm,
                  nông sản và nhiều lĩnh vực khác trên toàn quốc.
                </p>
                <p>
                  Với định hướng đồng hành cùng khách hàng, {company.shortName}{" "}
                  không chỉ cung cấp sản phẩm mà còn tư vấn giải pháp đóng gói phù
                  hợp: từ lựa chọn chất liệu màng co PVC, PE, POF, PET đến in ấn
                  logo thương hiệu và bao bì màng phức hợp theo yêu cầu.
                </p>
                <p>
                  Chúng tôi cam kết chất lượng ổn định, tiến độ giao hàng đúng hẹn
                  và mức giá cạnh tranh, giúp doanh nghiệp tối ưu chi phí đóng gói
                  đồng thời nâng cao giá trị thẩm mỹ sản phẩm.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Target,
                  title: "Sứ mệnh",
                  text: "Mang đến giải pháp bao bì chất lượng, tối ưu chi phí và hỗ trợ doanh nghiệp phát triển bền vững.",
                },
                {
                  icon: Eye,
                  title: "Tầm nhìn",
                  text: "Trở thành đối tác bao bì tin cậy tại miền Trung và mở rộng phủ sóng toàn quốc.",
                },
                {
                  icon: HeartHandshake,
                  title: "Giá trị cốt lõi",
                  text: "Uy tín – Chất lượng – Tận tâm – Đồng hành lâu dài cùng khách hàng.",
                },
                {
                  icon: Award,
                  title: "Cam kết",
                  text: "Sản phẩm đúng quy cách, tư vấn chuyên môn và dịch vụ sau bán hàng chu đáo.",
                },
              ].map((item) => (
                <div key={item.title} className="card-hover p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="card p-6 sm:p-8">
              <h3 className="text-lg font-extrabold text-slate-900">
                Lĩnh vực hoạt động
              </h3>
              <ul className="mt-4 grid gap-2.5 text-sm text-slate-600 sm:grid-cols-2">
                {[
                  "Màng co PVC, PE, POF, PET",
                  "Màng OPP – BOPP",
                  "Màng co in nhiệt logo",
                  "Bao bì màng phức hợp",
                  "Tư vấn giải pháp đóng gói",
                  "Cung cấp số lượng lớn / sỉ",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="card p-5 sm:p-6">
              <h3 className="font-extrabold text-brand-700">Thông tin công ty</h3>
              <dl className="mt-4 space-y-3.5 text-sm">
                {[
                  { label: "Tên công ty", value: company.name },

                  { label: "Địa chỉ", value: company.address },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      {row.label}
                    </dt>
                    <dd className="mt-0.5 leading-snug text-slate-800">{row.value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Điện thoại
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`tel:${company.phoneRaw}`}
                      className="font-bold text-brand-600 hover:text-accent-600"
                    >
                      {company.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Email
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${company.email}`}
                      className="text-brand-600 hover:text-accent-600"
                    >
                      {company.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 p-6 text-white shadow-card">
              <h3 className="text-lg font-extrabold">Cần tư vấn sản phẩm?</h3>
              <p className="mt-2 text-sm text-white/90">
                Đội ngũ {company.shortName} sẵn sàng hỗ trợ báo giá nhanh.
              </p>
              <Link
                href="/lien-he"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-accent-600 transition hover:bg-slate-50"
              >
                Liên hệ ngay
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
