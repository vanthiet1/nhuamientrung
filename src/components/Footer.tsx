import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Globe,
  PhoneCall,
  Send
} from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7.5v4H10V22h4v-8.5z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.582 6.186a2.64 2.64 0 00-1.859-1.874C18.083 3.875 12 3.875 12 3.875s-6.083 0-7.723.437a2.64 2.64 0 00-1.859 1.874C2 7.842 2 12 2 12s0 4.158.418 5.814a2.64 2.64 0 001.859 1.874c1.64.437 7.723.437 7.723.437s6.083 0 7.723-.437a2.64 2.64 0 001.859-1.874C22 16.158 22 12 22 12s0-4.158-.418-5.814zM9.814 15.148V8.852L15.394 12l-5.58 3.148z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
import { company } from "@/lib/data/company";
import type { CategoryTree } from "@/lib/cms/types";
import BrandLogo from "@/components/BrandLogo";

export default function Footer({
  categories = [],
}: {
  categories?: CategoryTree[];
}) {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#1a2a4b] text-slate-300">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111c33]/50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />



      <div className="relative container-page py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Social */}
          <div>
            <div className="mb-6">
              <BrandLogo href="/" variant="footer" />
            </div>
            <p className="mb-8 text-sm leading-relaxed text-slate-400">
              {company.aboutBlurb || "Cung cấp giải pháp bao bì chuyên nghiệp, chất lượng cao với dịch vụ tận tâm."}
            </p>
            <div className="flex gap-3">
              <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:-translate-y-1 hover:bg-[#0068ff] hover:shadow-lg" title="Zalo">
                <span className="font-extrabold text-[12px] tracking-tight mt-0.5">Zalo</span>
              </a>
              <a href={`mailto:${company.email}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:-translate-y-1 hover:bg-sky-500 hover:shadow-lg" title="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white uppercase tracking-wider relative inline-block">
              Liên kết nhanh
              <span className="absolute -bottom-2 left-0 h-0.5 w-1/2 bg-brand-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-base">
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
                    className="group flex items-center gap-2 text-slate-400 transition-all hover:text-white hover:translate-x-1"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-brand-500 transition-transform group-hover:translate-x-1" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white uppercase tracking-wider relative inline-block">
              Hỗ trợ
              <span className="absolute -bottom-2 left-0 h-0.5 w-1/2 bg-brand-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-base">
              {[
                { href: "/danh-muc/mang-xop-hoi-xop-khi-xop-boc-hang", label: "Xốp hơi" },
                { href: "/danh-muc/mang-xop-pe-foam", label: "Xốp PE Foam" },
                { href: "/danh-muc/mang-quan-pallet", label: "Màng PE quấn pallet" },
                { href: "/danh-muc/bang-keo-hang-de-vo", label: "Băng keo" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-2 text-slate-400 transition-all hover:text-white hover:translate-x-1"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-brand-500 transition-transform group-hover:translate-x-1" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white uppercase tracking-wider relative inline-block">
              Thông tin liên hệ
              <span className="absolute -bottom-2 left-0 h-0.5 w-1/2 bg-brand-500 rounded-full"></span>
            </h3>
            <ul className="space-y-5 text-base">
              <li className="group flex gap-4 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-sm text-slate-400 mb-0.5">Điện thoại:</span>
                  <a href={`tel:${company.landlineRaw}`} className="text-white font-medium hover:text-brand-300 transition-colors">
                    {company.landline}
                  </a>
                </div>
              </li>
              <li className="group flex gap-4 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-sm text-slate-400 mb-0.5">Hotline:</span>
                  <a href={`tel:${company.phoneRaw}`} className="text-white font-medium hover:text-brand-300 transition-colors">
                    {company.hotline}
                  </a>
                </div>
              </li>
              <li className="group flex gap-4 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-sm text-slate-400 mb-0.5">Địa chỉ:</span>
                  <span className="text-white font-medium leading-snug">{company.address}</span>
                </div>
              </li>
              <li className="group flex gap-4 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-sm text-slate-400 mb-0.5">Email:</span>
                  <a href={`mailto:${company.email}`} className="text-white font-medium hover:text-brand-300 transition-colors">
                    {company.email}
                  </a>
                </div>
              </li>
              <li className="group flex gap-4 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-sm text-slate-400 mb-0.5">Website:</span>
                  <a href="https://nhuamientrung.vn" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-brand-300 transition-colors">
                    nhuamientrung.vn
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-[#111c33]/80 backdrop-blur-sm">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-sm text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} {company.shortName}. Tất cả quyền được bảo lưu.
          </p>
          <p>
            Thiết kế bởi <a href="#" className="font-bold text-white hover:text-brand-400 transition-colors">Webcodeby</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
