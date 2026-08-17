import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Globe,
  PhoneCall
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
            <h3 className="mb-6 text-lg font-bold text-white uppercase">Hỗ trợ</h3>
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
            <ul className="space-y-4 text-base">
              <li className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
                <span>
                  <span className="block text-slate-400">Điện thoại:</span>
                  <a href={`tel:${company.landlineRaw}`} className="text-white hover:text-brand-300">
                    {company.landline}
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

              <li className="flex gap-4">
                <PhoneCall className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
                <span>
                  <span className="block text-slate-400">Hotline:</span>
                  <a href="tel:0935909747" className="text-white hover:text-brand-300">
                    0935 909747
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <Globe className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
                <span>
                  <span className="block text-slate-400">Website:</span>
                  <a href="https://nhuamientrung.vn" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-300">
                    nhuamientrung.vn
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#111c33]">
        <div className="container-page flex flex-col items-center justify-center py-6 text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} {company.shortName}. Thiết kế bởi Webcodeby.
          </p>
        </div>
      </div>
    </footer>
  );
}
