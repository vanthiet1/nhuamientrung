import type { Metadata } from "next";
import {
  Mail,
  MapPin,
  Phone,
  Building2,
  MessageCircle,
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import ContactForm from "@/components/ContactForm";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Liên hệ báo giá bao bì Đà Nẵng",
  description: `Liên hệ ${company.shortName}: hotline ${company.phone}, email ${company.email}. Tư vấn & báo giá bao bì đóng gói tại Đà Nẵng.`,
  keywords: [
    "liên hệ bao bì Đà Nẵng",
    "báo giá bao bì",
    "hotline Bao Bì Thành Phát",
    company.phone,
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://baobithanhphat.com"}/lien-he`,
  },
};

export default function ContactPage() {
  return (
    <>
      <PageBanner
        title="Liên hệ"
        breadcrumbs={[{ label: "Liên hệ" }]}
        subtitle="Tư vấn & báo giá nhanh — hỗ trợ tận tâm"
      />

      <section className="section container-page">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="space-y-4 lg:col-span-2">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Thông tin liên hệ
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Để lại thông tin hoặc gọi trực tiếp — chúng tôi sẵn sàng tư vấn
                và báo giá.
              </p>
            </div>

            <div className="card space-y-4 p-5 sm:p-6">
              {[
                {
                  icon: Building2,
                  label: "Tên công ty",
                  value: company.name,
                },

                {
                  icon: MapPin,
                  label: "Địa chỉ",
                  value: company.address,
                },
              ].map((row) => (
                <div key={row.label} className="flex gap-3">
                  {row.icon ? (
                    <row.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                  ) : (
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[9px] font-black text-accent-500">
                      {row.badge}
                    </span>
                  )}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      {row.label}
                    </div>
                    <div className="mt-0.5 text-sm leading-snug text-slate-800">
                      {row.value}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Điện thoại
                  </div>
                  <a
                    href={`tel:${company.phoneRaw}`}
                    className="mt-0.5 block text-sm font-bold text-brand-600 hover:text-accent-600"
                  >
                    {company.phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Email
                  </div>
                  <a
                    href={`mailto:${company.email}`}
                    className="mt-0.5 block text-sm text-brand-600 hover:text-accent-600"
                  >
                    {company.email}
                  </a>
                </div>
              </div>

            </div>

            <a
              href={company.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#0068ff] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-600 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5" />
              Chat Zalo ngay
            </a>
          </div>

          <div className="lg:col-span-3">
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl font-extrabold text-slate-900">
                Gửi yêu cầu liên hệ
              </h2>
              <p className="mt-1 mb-6 text-sm text-slate-500">
                Điền form bên dưới, chúng tôi sẽ phản hồi sớm nhất có thể.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>

      </section>

      {/* Full-width map */}
      <section className="w-full" aria-label="Bản đồ địa chỉ">
        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Bản đồ chỉ đường
              </h2>
              <p className="text-sm text-slate-500">{company.address}</p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=12+H%C3%A0+%C4%90%C3%B4ng+2%2C+Thanh+Kh%C3%AA%2C+%C4%90%C3%A0+N%E1%BA%B5ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-brand-600 hover:text-sky-600"
            >
              Mở Google Maps →
            </a>
          </div>
        </div>
        <div className="relative w-full">
          <iframe
            title="Bản đồ chỉ đường Bao Bì Thành Phát — 12 Hà Đông 2, Thanh Khê, Đà Nẵng"
            src="https://maps.google.com/maps?q=12%20H%C3%A0%20%C4%90%C3%B4ng%202%2C%20Thanh%20Kh%C3%AA%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="block h-[420px] w-full border-0 sm:h-[480px] md:h-[560px] lg:h-[620px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            /* SEO: iframe bản đồ có title + lazy; nội dung địa chỉ cũng có text phía trên */
          />
        </div>
      </section>
    </>
  );
}
