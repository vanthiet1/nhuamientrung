"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { BannerRecord } from "@/lib/cms/types";

const FALLBACK: Pick<
  BannerRecord,
  "title" | "subtitle" | "badge" | "cta" | "href" | "image" | "gradient"
>[] = [
  {
    title: "Giải pháp bao bì chuyên nghiệp",
    subtitle:
      "Màng co PVC · PE · POF · PET · Màng phức hợp — chất lượng ổn định, giao hàng toàn quốc",
    badge: "Thành Phát Bao Bì",
    cta: "Xem sản phẩm",
    href: "/san-pham",
    image: "",
    gradient: "from-brand-800 via-brand-600 to-brand-500",
  },
];

export default function HeroSlider({
  banners = [],
}: {
  banners?: BannerRecord[];
}) {
  const slides =
    banners.length > 0
      ? banners
      : FALLBACK.map((b, i) => ({
          ...b,
          id: `fb-${i}`,
          isActive: true,
          sortOrder: i,
          createdAt: "",
          updatedAt: "",
        }));

  const [index, setIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5600
    );
    return () => clearInterval(t);
  }, [slides.length]);

  const prev = () =>
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const slide = slides[index] || slides[0];

  // Reset error when slide changes
  useEffect(() => {
    setImgFailed(false);
  }, [slide?.id, slide?.image]);

  if (!slide) return null;

  const hasImage = Boolean(slide.image) && !imgFailed;

  return (
    <section className="relative overflow-hidden">
      <div
        className={`relative min-h-[420px] bg-gradient-to-br sm:min-h-[500px] md:min-h-[540px] ${
          hasImage ? "from-slate-900 to-slate-800" : slide.gradient
        } transition-all duration-700`}
      >
        {/* Background image */}
        {hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            onError={() => setImgFailed(true)}
          />
        )}

        {/* Patterns / overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {!hasImage && (
            <>
              <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[48px] border-white/10" />
              <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full border-[36px] border-white/[0.07]" />
              <div className="absolute right-[18%] top-[28%] h-28 w-28 rotate-45 rounded-2xl border-4 border-white/10" />
              <div className="absolute inset-0 bg-grid-soft opacity-30" />
            </>
          )}
          <div
            className={`absolute inset-0 ${
              hasImage
                ? "bg-gradient-to-r from-black/75 via-black/50 to-black/30"
                : "bg-gradient-to-t from-black/25 via-transparent to-black/10"
            }`}
          />
        </div>

        <div className="container-home relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[500px] md:min-h-[540px]">
          <div className="max-w-2xl">
            {slide.badge && (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white/95 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
                {slide.badge}
              </span>
            )}
            <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
                {slide.subtitle}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={slide.href || "/san-pham"}
                className="btn-primary"
                aria-label={slide.cta || "Xem danh mục sản phẩm bao bì"}
              >
                {slide.cta || "Xem sản phẩm bao bì"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/gioi-thieu"
                className="btn-secondary !text-white"
                aria-label="Giới thiệu Bao Bì Thành Phát"
              >
                Giới thiệu Thành Phát
              </Link>
              <Link
                href="/lien-he"
                className="btn-secondary !text-white"
                aria-label="Nhận báo giá bao bì miễn phí"
              >
                Nhận báo giá
              </Link>
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/25 p-2.5 text-white backdrop-blur transition hover:bg-black/45 sm:left-5"
              aria-label="Slide trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/25 p-2.5 text-white backdrop-blur transition hover:bg-black/45 sm:right-5"
              aria-label="Slide sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id || i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-9 bg-accent-400 shadow shadow-accent-400/40"
                      : "w-2.5 bg-white/45 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
