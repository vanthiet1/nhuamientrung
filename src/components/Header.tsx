"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { company } from "@/lib/data/company";
import type { CategoryTree } from "@/lib/cms/types";
import BrandLogo from "@/components/BrandLogo";
import HeaderSearch from "@/components/HeaderSearch";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/danh-muc", label: "Danh mục", hasDropdown: true },
  { href: "/tat-ca-san-pham", label: "Tất cả sản phẩm" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/tuyen-dung", label: "Tuyển dụng" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header({
  categories = [],
}: {
  categories?: CategoryTree[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [openParent, setOpenParent] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-brand-800 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-xs sm:text-sm">
          <p className="min-w-0 flex-1 truncate opacity-90">
            <span className="hidden sm:inline font-medium">{company.shortName}</span>
            <span className="sm:hidden font-medium">Thành Phát</span>
            <span className="mx-1.5 hidden opacity-40 sm:inline">|</span>
            <span className="hidden opacity-80 md:inline">
              Giải pháp bao bì chuyên nghiệp
            </span>
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${company.landlineRaw}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-semibold backdrop-blur transition hover:bg-sky-500 sm:px-3"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Hotline:</span> {company.landline}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-nav" : ""
        }`}
      >
        <div className="container-page flex items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3">
          <BrandLogo href="/" variant="header" priority />

          {/* Desktop menu */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setProductOpen(true)}
                  onMouseLeave={() => setProductOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`inline-flex items-center gap-1 rounded-full px-3 lg:px-4 py-2 text-[13px] font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                      isActive(link.href)
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        productOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  <div
                    className={`absolute left-1/2 top-full z-50 w-[min(94vw,880px)] -translate-x-[20%] xl:-translate-x-1/4 pt-3 transition-all duration-200 ${
                      productOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-hover">
                      <div className="border-b border-slate-100 bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-3.5 sm:px-6">
                        <p className="text-base font-bold uppercase tracking-wider text-white sm:text-lg">
                          Danh mục sản phẩm
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-5 p-6 sm:grid-cols-3">
                        {(() => {
                          const allLinks = categories.reduce((acc, cat) => {
                            acc.push({ name: cat.name, slug: cat.slug, isParent: true });
                            if (cat.children) {
                              cat.children.forEach(child => {
                                acc.push({ name: child.name, slug: child.slug, isParent: false });
                              });
                            }
                            return acc;
                          }, [] as { name: string; slug: string; isParent: boolean }[]);

                          return allLinks.map((link, idx) => {
                            const isActive = pathname === `/danh-muc/${link.slug}` || pathname.startsWith(`/danh-muc/${link.slug}/`);
                            return (
                              <Link
                                key={`${link.slug}-${idx}`}
                                href={`/danh-muc/${link.slug}`}
                                className={`block text-[14px] font-bold leading-snug transition-colors hover:text-brand-600 ${
                                  isActive ? "text-brand-600" : "text-slate-800"
                                }`}
                              >
                                {link.name}
                              </Link>
                            );
                          });
                        })()}
                      </div>
                      <div className="border-t border-slate-100 bg-slate-50 px-5 py-3.5 text-center">
                        <Link
                          href="/tat-ca-san-pham"
                          className="text-base font-bold text-accent-600 hover:underline"
                        >
                          Xem tất cả sản phẩm →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 lg:px-4 py-2 text-[13px] font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                    isActive(link.href)
                      ? "bg-sky-50 text-sky-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Search + language + báo giá (desktop) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <HeaderSearch variant="desktop" />
            <div className="hidden lg:block">
              <LanguageSwitcher compact variant="light" />
            </div>
            <Link
              href="/lien-he"
              className="btn-primary hidden lg:inline-flex !rounded-full bg-brand-800 hover:bg-brand-900"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem" }}
            >
              Báo giá
            </Link>

            {/* Mobile search toggle */}
            <button
              type="button"
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-50 lg:hidden"
              onClick={() => {
                setMobileSearchOpen((v) => !v);
                setMobileOpen(false);
              }}
              aria-label="Tìm kiếm"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-50 lg:hidden"
              onClick={() => {
                setMobileOpen((v) => !v);
                setMobileSearchOpen(false);
              }}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search panel */}
        {mobileSearchOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
            <HeaderSearch
              variant="mobile"
              onSubmitExtra={() => setMobileSearchOpen(false)}
            />
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="max-h-[min(80vh,640px)] overflow-y-auto border-t border-slate-100 bg-white lg:hidden">
            <div className="container-page space-y-3 py-3">
              <HeaderSearch
                variant="mobile"
                onSubmitExtra={() => setMobileOpen(false)}
              />
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Ngôn ngữ
                </span>
                <LanguageSwitcher variant="light" />
              </div>
            </div>
            <nav className="container-page flex flex-col gap-0.5 pb-32">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.href} className="rounded-xl">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-bold uppercase text-slate-800 hover:bg-slate-50"
                      onClick={() =>
                        setOpenParent(openParent === "products" ? null : "products")
                      }
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openParent === "products" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openParent === "products" && (
                      <div className="mb-2 ml-2 space-y-2 border-l-2 border-brand-200 pl-3">
                        <Link
                          href="/danh-muc"
                          className="block py-1.5 text-sm font-bold text-accent-600"
                        >
                          Tất cả sản phẩm
                        </Link>
                        {categories.map((cat) => {
                          const isCatActive = pathname === `/danh-muc/${cat.slug}` || pathname.startsWith(`/danh-muc/${cat.slug}/`);
                          return (
                            <div key={cat.slug}>
                              <Link
                                href={`/danh-muc/${cat.slug}`}
                                className={`block py-1 text-sm font-bold ${
                                  isCatActive ? "text-brand-600" : "text-brand-700"
                                }`}
                              >
                                {cat.name}
                              </Link>
                              {cat.children?.map((child) => {
                                const isChildActive = pathname === `/danh-muc/${child.slug}` || pathname.startsWith(`/danh-muc/${child.slug}/`);
                                return (
                                  <Link
                                    key={child.slug}
                                    href={`/danh-muc/${child.slug}`}
                                    className={`block py-0.5 pl-3 text-xs ${
                                      isChildActive ? "text-brand-600 font-semibold" : "text-slate-500"
                                    }`}
                                  >
                                    {child.name}
                                  </Link>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-3 py-3 text-sm font-bold uppercase ${
                      isActive(link.href)
                        ? "bg-accent-50 text-accent-600"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link href="/lien-he" className="btn-primary mt-4 w-full">
                Yêu cầu báo giá
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
