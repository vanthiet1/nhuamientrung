"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    <section className="relative overflow-hidden">
      <div
        className={`relative min-h-[420px] touch-pan-y bg-gradient-to-br sm:min-h-[500px] md:min-h-[540px] ${
          hasImage ? "from-slate-900 to-slate-800" : slide.gradient
        } transition-all duration-700`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
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
                ? "bg-gradient-to-r from-black/50 via-black/30 to-transparent"
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
                href={slide.href || "/danh-muc"}
                className="btn-primary !rounded-full bg-brand-700 hover:bg-brand-800"
                aria-label={slide.cta || "Tư vấn ngay"}
              >
                {slide.cta || "TƯ VẤN NGAY"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/lien-he"
                className="btn-secondary !text-white !rounded-full !border-white/30 hover:!bg-white/10"
                aria-label="Báo giá nhanh - Miễn phí"
              >
                BÁO GIÁ NHANH - MIỄN PHÍ
              </Link>
              <Link
                href="/lien-he"
                className="btn-secondary !text-white !rounded-full !border-white/30 hover:!bg-white/10"
                aria-label="Báo giá nhanh"
              >
                BÁO GIÁ NHANH
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
