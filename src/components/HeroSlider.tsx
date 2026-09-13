"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BannerRecord } from "@/lib/cms/types";

const FALLBACK: Pick<
  BannerRecord,
  "title" | "subtitle" | "badge" | "cta" | "href" | "image" | "gradient"
>[] = [
  {
    title: "Giải pháp bao bì chuyên nghiệp Thành Phát",
    subtitle: "Màng co PVC · PE · POF · PET · Màng phức hợp — chất lượng ổn định, giao hàng toàn quốc",
    badge: "BAO BÌ THÀNH PHÁT",
    cta: "TƯ VẤN NGAY",
    href: "/danh-muc",
    image: "https://baobithanhphat.com/wp-content/uploads/2025/11/banner-baobi.png",
    gradient: "from-[#07163c] via-[#0b2158] to-[#040d27]",
  },
  {
    title: "In màng co nhiệt logo thương hiệu",
    subtitle: "Nâng tầm nhận diện - Bảo vệ sản phẩm - Tăng giá trị trên kệ hàng",
    badge: "IN ẤN BRANDING",
    cta: "TƯ VẤN NGAY",
    href: "/danh-muc",
    image: "https://baobithanhphat.com/wp-content/uploads/2021/12/in-mang-co-pvc.jpg",
    gradient: "from-[#07163c] via-[#0b2158] to-[#040d27]",
  },
  {
    title: "Màng xốp hơi & Băng keo công nghiệp giá xưởng",
    subtitle: "Chuyên sản xuất và phân phối màng xốp nổ chống sốc, băng keo đóng gói chất lượng cao",
    badge: "GIÁ TẬN XƯỞNG",
    cta: "BÁO GIÁ NHANH",
    href: "/lien-he",
    image: "https://baobithanhphat.com/wp-content/uploads/2021/11/cuon-mang-xop-hoi.jpg",
    gradient: "from-[#07163c] via-[#0b2158] to-[#040d27]",
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
  const slides = useMemo(() => {
    // 1. Lấy tất cả banner đang kích hoạt (isActive !== false), sắp xếp theo sortOrder
    const activeBanners = banners
      .filter((b) => b.isActive !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    if (activeBanners.length > 0) {
      return activeBanners;
    }

    // 2. Chỉ khi Database rỗng hoặc không có banner nào mới dùng mảng dự phòng FALLBACK
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

  const bgImage = slide.image || "https://baobithanhphat.com/wp-content/uploads/2025/11/banner-baobi.png";
  const hasImage = Boolean(bgImage) && !imgFailed;

  return (
    <section className="relative overflow-hidden bg-slate-900">
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
        className="relative w-full overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Link
          href={slide.href || "/danh-muc"}
          className="block relative w-full h-full"
          aria-label={slide.title || "Banner bao bì Thành Phát"}
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bgImage}
              alt={slide.title || "Banner bao bì Thành Phát"}
              // @ts-ignore
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              className="w-full h-auto max-h-[320px] sm:max-h-[380px] md:max-h-[420px] lg:max-h-[450px] xl:max-h-[480px] object-cover object-center transition-all duration-700 block"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full min-h-[320px] sm:min-h-[420px] bg-gradient-to-r from-brand-800 to-brand-600 flex items-center justify-center text-white font-bold text-xl">
              {slide.title}
            </div>
          )}
        </Link>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 sm:left-4 top-1/2 z-30 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/30 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm shadow-md"
              aria-label="Slide trước"
              suppressHydrationWarning
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 sm:right-4 top-1/2 z-30 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/30 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm shadow-md"
              aria-label="Slide sau"
              suppressHydrationWarning
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 justify-center">
              {slides.map((s, i) => (
                <button
                  key={s.id || i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`transition-all duration-300 ${
                    i === index
                      ? "w-8 h-2.5 bg-brand-500 rounded-full shadow-md shadow-brand-500/50"
                      : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80 rounded-full"
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

