import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Building2,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { company } from "@/lib/data/company";
import type { CategoryTree } from "@/lib/cms/types";
import BrandLogo from "@/components/BrandLogo";

export default function Footer({
  categories = [],
}: {
  categories?: CategoryTree[];
}) {
  return (
    <footer className="mt-auto bg-brand-900 text-slate-300">
      {/* CTA strip */}
      <div className="border-b border-white/10 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-300">
              Tư vấn miễn phí
            </p>
            <p className="mt-0.5 text-lg font-bold text-white sm:text-xl">
              Cần báo giá bao bì đóng gói?
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lien-he"
              className="btn-primary"
              aria-label="Gửi yêu cầu báo giá bao bì Thành Phát"
            >
              Nhận báo giá miễn phí
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              aria-label="Chat Zalo Bao Bì Thành Phát"
            >
              Chat Zalo tư vấn
            </a>
            <a
              href={`tel:${company.phoneRaw}`}
              className="btn-secondary"
              aria-label={`Gọi hotline ${company.phone}`}
            >
              Gọi {company.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container-page py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="mb-4">
              <BrandLogo href="/" variant="footer" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {company.description}
            </p>
            <a
              href={`tel:${company.phoneRaw}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/10 transition hover:bg-accent-500 hover:ring-accent-500"
            >
              <Phone className="h-4 w-4" />
              {company.phone}
            </a>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Liên kết
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/gioi-thieu", label: "Giới thiệu" },
                { href: "/san-pham", label: "Sản phẩm" },
                { href: "/tin-tuc", label: "Tin tức" },
                { href: "/tuyen-dung", label: "Tuyển dụng" },
                { href: "/lien-he", label: "Liên hệ" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-accent-400"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent-500/70" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Sản phẩm
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/san-pham/${cat.slug}`}
                    className="text-slate-400 transition hover:text-accent-400"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-2.5">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                <span>
                  <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Công ty
                  </span>
                  <span className="text-slate-200 leading-snug">{company.name}</span>
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-[9px] font-black text-accent-400">
                  MST
                </span>
                <span>
                  <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Mã số thuế
                  </span>
                  <span className="text-slate-200">{company.taxCode}</span>
                </span>
              </li>
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                <span>
                  <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Địa chỉ
                  </span>
                  <span className="text-slate-200 leading-snug">{company.address}</span>
                </span>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                <span>
                  <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Email
                  </span>
                  <a href={`mailto:${company.email}`} className="text-slate-200 hover:text-accent-400">
                    {company.email}
                  </a>
                </span>
              </li>
              <li className="flex gap-2.5">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                <span>
                  <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Số tài khoản
                  </span>
                  <span className="font-mono text-slate-200">{company.bankAccount}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{company.bankName}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-400">{company.shortName}</span>.{" "}
            Bản quyền đã được bảo hộ. Thiết kế bởi{" "}
            <a
              href="https://webcodeby.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition hover:text-accent-400"
            >
              WebCodeBy
            </a>
            .
          </p>
          <p>Đà Nẵng · Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}
