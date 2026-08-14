import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
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
    <footer className="mt-auto bg-[#1a2a4b] text-slate-300">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Newsletter */}
          <div>
            <div className="mb-6">
              <BrandLogo href="/" variant="footer" />
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Cung cấp giải pháp bao bì chuyên nghiệp, chất lượng cao với dịch vụ tận tâm.
            </p>
            <div className="mb-6 flex gap-3">
              <a href={company.facebook || "#"} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-500" title="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-500" title="Zalo">
                <span className="font-extrabold text-[12px] tracking-tight mt-0.5">Zalo</span>
              </a>
              <a href="mailto:contact@baobithanhphat.com" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-500" title="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Liên kết nhanh</h3>
            <ul className="space-y-4 text-sm">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/danh-muc", label: "Danh mục" },
                { href: "/tat-ca-san-pham", label: "Tất cả sản phẩm" },
                { href: "/tin-tuc", label: "Tin tức" },
                { href: "/lien-he", label: "Liên hệ" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Công ty</h3>
            <ul className="space-y-4 text-sm">
              {[
                { href: "/gioi-thieu", label: "Giới thiệu" },
                { href: "#ban-lanh-dao", label: "Ban lãnh đạo" },
                { href: "/tuyen-dung", label: "Tuyển dụng" },
                { href: "#chinh-sach", label: "Chính sách pháp lý" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Thông tin liên hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
                <span>
                  <span className="block text-slate-400">Điện thoại:</span>
                  <a href={`tel:${company.phoneRaw}`} className="text-white hover:text-brand-300">
                    {company.phone}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
                <span>
                  <span className="block text-slate-400">Email:</span>
                  <a href={`mailto:${company.email}`} className="text-white hover:text-brand-300">
                    {company.email}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
                <span>
                  <span className="block text-slate-400">Địa chỉ:</span>
                  <span className="text-white">{company.address}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#111c33]">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-sm text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.shortName}. Đã đăng ký bản quyền.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-white">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
