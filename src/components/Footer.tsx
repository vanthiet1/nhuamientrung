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
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Liên kết nhanh</h3>
            <ul className="space-y-4 text-sm">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/danh-muc", label: "Sản phẩm" },
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
