"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    href: "/danh-muc",
    image: "",
    gradient: "from-brand-800 via-brand-600 to-brand-500",
  },
];

/** Min horizontal distance (px) to count as a swipe */
const SWIPE_THRESHOLD = 48;
/** Ignore if vertical movement is dominant (page scroll) */
const SWIPE_AXIS_RATIO = 1.15;

export default function HeroSlider({
  banners = [],
}: {
  banners?: BannerRecord[];
}) {
  // Only display banners with sortOrder 0, 1, 2
  const slides = useMemo(() => {
    // 1. Explicitly filter banners with sortOrder 0, 1, 2
    const filtered = banners.filter(
      (b) => b.isActive !== false && (b.sortOrder === 0 || b.sortOrder === 1 || b.sortOrder === 2)
    );

    if (filtered.length > 0) {
      return filtered;
    }

    // 2. Fallback: If DB banners array exists, pick first 3 items (index 0, 1, 2)
    if (banners.length > 0) {
      return banners.slice(0, 3);
    }

    // 3. Fallback default banner
    return FALLBACK.map((b, i) => ({
      ...b,
      id: `fb-${i}`,
      isActive: true,
      sortOrder: i,
      createdAt: "",
      updatedAt: "",
    }));
  }, [banners]);

  const [index, setIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5600
    );
    return () => clearInterval(t);
  }, [slides.length, paused]);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length]
  );
  const slide = slides[index] || slides[0];

  // Reset error when slide changes
  useEffect(() => {
    setImgFailed(false);
  }, [slide?.id, slide?.image]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (slides.length <= 1) return;
    const t = e.touches[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    setPaused(false);
    if (!start || slides.length <= 1) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Prefer horizontal swipe; ignore mostly-vertical scrolls
    if (absX < SWIPE_THRESHOLD) return;
    if (absY > absX * SWIPE_AXIS_RATIO) return;

    if (dx < 0) next();
    else prev();
  };

  const onTouchCancel = () => {
    touchStart.current = null;
    setPaused(false);
  };

  if (!slide) return null;

  const hasImage = Boolean(slide.image) && !imgFailed;

  return (
    <section className="relative overflow-hidden bg-[#061539]">
      {/* LCP Image Preload for Google PageSpeed Optimization */}
      {slides[0]?.image && (
        <link
          rel="preload"
          as="image"
          href={slides[0].image}
          // @ts-ignore
          fetchPriority="high"
        />
      )}
      <div
        className="relative w-full min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center py-12 sm:py-16 touch-pan-y bg-gradient-to-br from-[#061539] via-[#0b225c] to-[#040e29]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Subtle grid background pattern */}
        <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-15" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />

        <div className="container-home relative z-10 mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Information Side */}
            <div className="lg:col-span-6 xl:col-span-6 text-left space-y-5 sm:space-y-6">
              {slide.badge && (
                <span className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400" />
                  {slide.badge}
                </span>
              )}

              <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.65rem] drop-shadow-sm">
                {slide.title}
              </h1>

              {slide.subtitle && (
                <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-xl font-normal">
                  {slide.subtitle}
                </p>
              )}

              {/* Feature Highlights */}
              <div className="flex flex-wrap gap-2.5 pt-1 text-xs sm:text-sm text-slate-200">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                  ⚡ Hàng có sẵn · Giá tận xưởng
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                  🛡️ Chất lượng ổn định
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                  🚚 Giao hàng toàn quốc
                </span>
              </div>

              {/* Call to Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  href={slide.href || "/danh-muc"}
                  className="inline-flex items-center gap-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm sm:text-base rounded-full px-6 sm:px-7 py-3 transition-all duration-300 shadow-lg shadow-brand-600/30 hover:shadow-xl hover:-translate-y-0.5"
                  aria-label={slide.cta || "Tư vấn ngay"}
                >
                  <span>{slide.cta || "TƯ VẤN NGAY"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/lien-he"
                  className="btn-glossy-shimmer !text-xs sm:!text-sm !px-5 sm:!px-6 !py-3"
                  aria-label="Báo giá nhanh"
                >
                  BÁO GIÁ NHANH
                </Link>
              </div>

              <div className="text-xs sm:text-sm text-slate-300/80 pt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Hotline tư vấn nhanh: <strong className="text-white font-bold">0935 909 747</strong> - <strong className="text-white font-bold">0935 583 513</strong>
              </div>
            </div>

            {/* Right Banner Image Side */}
            <div className="lg:col-span-6 xl:col-span-6 flex justify-center items-center w-full">
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/9.5] lg:aspect-[16/9.5] rounded-3xl p-2 sm:p-3 bg-slate-900/60 border border-white/15 shadow-2xl backdrop-blur-md group hover:border-brand-400/40 transition-all duration-500 flex items-center justify-center overflow-hidden">
                {/* Glow Backdrop Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 to-accent-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500 pointer-events-none" />

                {hasImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.image}
                    alt={slide.title}
                    // @ts-ignore
                    fetchPriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding={index === 0 ? "sync" : "async"}
                    className="relative z-10 w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center text-white/80">
                    <span className="text-4xl mb-3">📦</span>
                    <p className="font-bold text-lg">{slide.title}</p>
                    <p className="text-sm opacity-80 mt-1">{slide.subtitle}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 sm:left-6 top-1/2 z-20 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 bg-black/20 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
              aria-label="Slide trước"
              suppressHydrationWarning
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 sm:right-6 top-1/2 z-20 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 bg-black/20 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
              aria-label="Slide sau"
              suppressHydrationWarning
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 min-h-[10px] justify-center">
              {slides.map((s, i) => (
                <button
                  key={s.id || i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-white shadow-md shadow-white/40"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Chuyển đến slide ${i + 1}`}
                  suppressHydrationWarning
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
