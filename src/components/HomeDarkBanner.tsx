"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PhoneCall } from "lucide-react";
import type { BannerRecord } from "@/lib/cms/types";

type SlideItem = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
};

const DEFAULT_SLIDES_3_4_5: SlideItem[] = [
  {
    id: "slide-3",
    title: "BAO BÌ THÀNH PHÁT - GIẢI PHÁP MÀNG CO TOÀN DIỆN",
    subtitle:
      "Với kinh nghiệm nhiều năm trong lĩnh vực sản xuất và phân phối bao bì, chúng tôi tự hào là đối tác tin cậy của hàng ngàn doanh nghiệp tại Đà Nẵng. Thành Phát chuyên cung cấp màng co PVC, POF, PE và các dịch vụ gia công in ấn chất lượng cao.",
    cta: "Liên Hệ Ngay",
    href: "/lien-he",
    image: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-pe-quan-pallet.jpg",
  },
  {
    id: "slide-4",
    title: "MÀNG XỐP HƠI - BĂNG KEO CÔNG NGHIỆP",
    subtitle:
      "Chuyên sản xuất và phân phối màng xốp nổ chống sốc, xốp bọc hàng, băng keo đóng gói các loại chất lượng cao, giá tận xưởng tại Đà Nẵng và khu vực Miền Trung.",
    cta: "Liên Hệ Ngay",
    href: "/lien-he",
    image: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-xop-hoi-1.jpg",
  },
  {
    id: "slide-5",
    title: "MÀNG CO NHIỆT PVC - PE - POF CHẤT LƯỢNG CAO",
    subtitle:
      "Cung cấp màng co nhiệt chất lượng ổn định, độ dẻo dai cao, bám sát bề mặt sản phẩm giúp bảo vệ hàng hóa tối ưu khỏi bụi bẩn, ẩm mốc và va đập.",
    cta: "Liên Hệ Ngay",
    href: "/lien-he",
    image: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-co-nhiet-pe-1.jpg",
  },
];

const SWIPE_THRESHOLD = 48;
const SWIPE_AXIS_RATIO = 1.15;

export default function HomeDarkBanner({
  banners = [],
}: {
  banners?: BannerRecord[];
}) {
  const slides: SlideItem[] = useMemo(() => {
    // 1. Filter banners explicitly with sortOrder === 3 || 4 || 5
    const filtered = banners.filter(
      (b) => b.isActive !== false && (b.sortOrder === 3 || b.sortOrder === 4 || b.sortOrder === 5)
    );

    if (filtered.length > 0) {
      return filtered.map((b, i) => ({
        id: b.id || `banner-${b.sortOrder || i}`,
        title: b.title,
        subtitle: b.subtitle,
        cta: b.cta || "Liên Hệ Ngay",
        href: b.href || "/lien-he",
        image: b.image || "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-pe-quan-pallet.jpg",
      }));
    }

    // 2. Fallback: If DB banners array exists, pick 3rd, 4th, 5th items (index 2, 3, 4)
    if (banners.length >= 3) {
      const sliced = banners.slice(2, 5);
      if (sliced.length > 0) {
        return sliced.map((b, i) => ({
          id: b.id || `banner-${i}`,
          title: b.title,
          subtitle: b.subtitle,
          cta: b.cta || "Liên Hệ Ngay",
          href: b.href || "/lien-he",
          image: b.image || "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-pe-quan-pallet.jpg",
        }));
      }
    }

    // 3. Fallback default slides for thứ tự 3, 4, 5
    return DEFAULT_SLIDES_3_4_5;
  }, [banners]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [paused, slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY };
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    setPaused(false);
    if (!start) return;

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

  return (
    <section className="relative overflow-hidden bg-[#051355]">
      <div
        className="relative w-full min-h-[460px] sm:min-h-[480px] md:min-h-[520px] flex items-center py-12 sm:py-16 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => setPaused(false)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="container-home relative z-10 mx-auto px-6 sm:px-12 lg:px-16 w-full min-h-[380px] sm:min-h-[400px] md:min-h-[420px] flex items-center">
          {slides.map((slide, i) => {
            const isActive = i === index;
            return (
              <div
                key={slide.id}
                className={`absolute inset-x-6 sm:inset-x-12 lg:inset-x-16 transition-all duration-700 ease-in-out grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center ${
                  isActive
                    ? "opacity-100 z-10 pointer-events-auto translate-x-0"
                    : "opacity-0 z-0 pointer-events-none translate-x-6"
                }`}
              >
                {/* Left Product Image Side */}
                <div className="lg:col-span-5 flex justify-center items-center">
                  <div
                    className={`relative w-full max-w-[380px] lg:max-w-[430px] aspect-[4/3] flex items-center justify-center transition-all duration-700 delay-100 ease-out transform ${
                      isActive
                        ? "opacity-100 scale-100 translate-x-0"
                        : "opacity-0 scale-90 -translate-x-8"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain rounded-2xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-pe-quan-pallet.jpg";
                      }}
                    />
                  </div>
                </div>

                {/* Right Text Content Side */}
                <div className="lg:col-span-7 text-left text-white space-y-4 sm:space-y-6">
                  <h2
                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold uppercase tracking-wide leading-tight sm:leading-snug text-white transition-all duration-700 delay-150 ease-out transform ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                  >
                    {slide.title}
                  </h2>

                  <p
                    className={`text-sm sm:text-base md:text-lg text-slate-100/90 leading-relaxed max-w-2xl font-normal transition-all duration-700 delay-300 ease-out transform ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                  >
                    {slide.subtitle}
                  </p>

                  <div
                    className={`pt-2 sm:pt-4 transition-all duration-700 delay-500 ease-out transform ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                  >
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2.5 bg-white text-[#051355] hover:bg-slate-100 font-bold text-sm sm:text-base rounded-full px-6 sm:px-8 py-3 sm:py-3.5 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <PhoneCall className="h-4 w-4 sm:h-5 sm:w-5 text-[#051355] fill-current" />
                      <span>{slide.cta}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 sm:left-6 top-1/2 z-20 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/60 bg-black/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          aria-label="Slide trước"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-2 sm:right-6 top-1/2 z-20 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/60 bg-black/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          aria-label="Slide sau"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index
                  ? "bg-white scale-110 shadow-sm"
                  : "border-2 border-white/70 bg-transparent hover:bg-white/40"
              }`}
              aria-label={`Chuyển đến slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
