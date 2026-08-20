"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { CategoryTree } from "@/lib/cms/types";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7.5v4H10V22h4v-8.5z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.582 6.186a2.64 2.64 0 00-1.859-1.874C18.083 3.875 12 3.875 12 3.875s-6.083 0-7.723.437a2.64 2.64 0 00-1.859 1.874C2 7.842 2 12 2 12s0 4.158.418 5.814a2.64 2.64 0 001.859 1.874c1.64.437 7.723.437 7.723.437s6.083 0 7.723-.437a2.64 2.64 0 001.859-1.874C22 16.158 22 12 22 12s0-4.158-.418-5.814zM9.814 15.148V8.852L15.394 12l-5.58 3.148z"/>
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
            {/* Circular Social Icons */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-all hover:bg-white hover:text-[#051355]"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-all hover:bg-white hover:text-[#051355]"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-all hover:bg-white hover:text-[#051355]"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-all hover:bg-white hover:text-[#051355]"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-4 w-4" />
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
