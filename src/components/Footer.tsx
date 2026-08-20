"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { CategoryTree } from "@/lib/cms/types";
import { company } from "@/lib/data/company";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const ZaloIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.19 1.87 5.84L2.05 22l4.35-1.74A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm.89 14.5h-4.3c-.32 0-.59-.26-.59-.58v-.4c0-.21.11-.4.29-.5l3.24-4.22h-3.1c-.32 0-.58-.26-.58-.58v-.42c0-.32.26-.58.58-.58h4.15c.32 0 .59.26.59.58v.41c0 .2-.11.39-.29.49l-3.25 4.23h3.26c.32 0 .58.26.58.58v.41c0 .32-.26.58-.58.58z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.11V9.32a6.33 6.33 0 0 0-1-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.27 8.27 0 0 0 4.97 1.63V7.24a4.82 4.82 0 0 1-1.01-.55z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const DEFAULT_TOP_10_CATEGORIES = [
  { name: "Màng Co PVC", slug: "mang-co-pvc-2" },
  { name: "Màng Co POF", slug: "mang-co-pof" },
  { name: "Màng Co PE - Màng PE", slug: "mang-co-pe-mang-pe" },
  { name: "Màng Co PET", slug: "mang-co-pet" },
  { name: "Dịch Vụ In Màng Co", slug: "dich-vu-in-mang-co" },
  { name: "Xốp Bọc Hàng", slug: "mang-xop-hoi-xop-khi-xop-boc-hang" },
  { name: "Màng Xốp PE FOAM", slug: "mang-xop-pe-foam" },
  { name: "Màng Quấn Pallet", slug: "mang-quan-pallet" },
  { name: "Màng Co Lốc Chai", slug: "mang-co-loc-chai-nen-nuoc-yen" },
  { name: "Cuộn Màng Ép Ly", slug: "uncategorized" },
];

export default function Footer({
  categories = [],
}: {
  categories?: CategoryTree[];
}) {
  // Dynamically select top 10 categories with most products/subcategories
  const top10Categories = useMemo(() => {
    if (!categories || categories.length === 0) {
      return DEFAULT_TOP_10_CATEGORIES;
    }

    const sorted = [...categories].sort((a, b) => {
      const aCount = (a.children?.length || 0) + (a.slug ? 1 : 0);
      const bCount = (b.children?.length || 0) + (b.slug ? 1 : 0);
      return bCount - aCount;
    });

    const list = sorted.slice(0, 10).map((c) => ({
      name: c.name,
      slug: c.slug,
    }));

    // Fill up to 10 if fewer than 10 categories exist
    if (list.length < 10) {
      DEFAULT_TOP_10_CATEGORIES.forEach((def) => {
        if (list.length < 10 && !list.some((item) => item.slug === def.slug)) {
          list.push(def);
        }
      });
    }

    return list.slice(0, 10);
  }, [categories]);

  const left5Categories = top10Categories.slice(0, 5);
  const right5Categories = top10Categories.slice(5, 10);

  return (
    <footer className="mt-auto bg-[#051355] text-slate-200 text-sm">
      <div className="container-home py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Column 1: Company Information (md:col-span-5) */}
          <div className="space-y-4 md:col-span-5">
            <h3 className="text-base sm:text-lg font-extrabold uppercase text-white tracking-wide leading-snug">
              CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ BAO BÌ THÀNH PHÁT
            </h3>
            
            <div className="space-y-2 text-slate-200 leading-relaxed text-sm">
              <p>
                <span className="font-bold text-white">Email:</span>{" "}
                <a href="mailto:contact@baobithanhphat.com" className="hover:text-white transition-colors">
                  contact@baobithanhphat.com
                </a>
              </p>
              <p>
                <span className="font-bold text-white">Điện thoại:</span>{" "}
                <a href="tel:02363725379" className="hover:text-white transition-colors">
                  0236 3725379
                </a>
                <span className="mx-2 text-slate-400">|</span>
                <a href="tel:0935909747" className="hover:text-white transition-colors">
                  0935 909 747
                </a>
              </p>
              <p>
                <span className="font-bold text-white">Địa chỉ:</span> 12 Hà Đông 2, Phường Xuân Hà, Quận Thanh Khê, Thành phố Đà Nẵng
              </p>
            </div>

            {/* Ministry of Industry and Trade Badge Image */}
            <div className="pt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logoSaleNoti.png.webp"
                alt="Đã thông báo Bộ Công Thương"
                className="h-12 w-auto object-contain transition-transform hover:scale-105"
              />
            </div>
          </div>

          {/* Column 2: Top 10 Categories List (md:col-span-4) */}
          <div className="space-y-4 md:col-span-4">
            <h3 className="text-base sm:text-lg font-extrabold uppercase text-white tracking-wide">
              DANH MỤC:
            </h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm text-slate-300">
              {/* Left Sub-column (Top 1-5) */}
              <ul className="space-y-2.5">
                {left5Categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={cat.slug === "uncategorized" ? "/danh-muc" : `/danh-muc/${cat.slug}`}
                      className="hover:text-white transition-colors flex items-center gap-1.5 line-clamp-1"
                    >
                      <span className="text-sky-400 text-xs shrink-0">▸</span> {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Right Sub-column (Top 6-10) */}
              <ul className="space-y-2.5">
                {right5Categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={cat.slug === "uncategorized" ? "/danh-muc" : `/danh-muc/${cat.slug}`}
                      className="hover:text-white transition-colors flex items-center gap-1.5 line-clamp-1"
                    >
                      <span className="text-sky-400 text-xs shrink-0">▸</span> {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Social & Policies (md:col-span-3) */}
          <div className="space-y-6 md:col-span-3">
            {/* Circular Social Icons with Official Brand Hover Colors */}
            <div className="flex items-center gap-3">
              <a
                href={company.social.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white transition-all duration-300 hover:border-[#1877F2] hover:bg-[#1877F2] hover:shadow-lg hover:shadow-[#1877F2]/40 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4.5 w-4.5" />
              </a>

              <a
                href={`https://zalo.me/${company.phoneRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white transition-all duration-300 hover:border-[#0068FF] hover:bg-[#0068FF] hover:shadow-lg hover:shadow-[#0068FF]/40 hover:-translate-y-1"
                aria-label="Zalo"
              >
                <ZaloIcon className="h-4.5 w-4.5" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white transition-all duration-300 hover:border-[#E4405F] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:shadow-lg hover:shadow-[#E4405F]/40 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white transition-all duration-300 hover:border-black hover:bg-black hover:shadow-lg hover:shadow-black/40 hover:-translate-y-1"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4.5 w-4.5" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white transition-all duration-300 hover:border-[#FF0000] hover:bg-[#FF0000] hover:shadow-lg hover:shadow-[#FF0000]/40 hover:-translate-y-1"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-4.5 w-4.5" />
              </a>
            </div>

            {/* Policy Links */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href="/chinh-sach-ban-hang" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-slate-400">–</span> Chính sách bán hàng
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-thanh-toan" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-slate-400">–</span> Chính sách thanh toán
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-van-chuyen" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-slate-400">–</span> Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-slate-400">–</span> Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-black py-3.5 text-center text-xs text-slate-400 border-t border-white/10">
        <div className="container-home">
          <p>Copyright 2026 © Bao Bì Thành Phát</p>
        </div>
      </div>
    </footer>
  );
}
