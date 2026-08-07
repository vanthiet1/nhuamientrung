"use client";

import { useEffect, useRef, useState } from "react";
import SafeImage from "@/components/SafeImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Partner } from "@/lib/data/partners";

export default function PartnersSlider({ partners }: { partners: Partner[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  // Scroll into view → play enter animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // keep observing so re-enter can re-trigger if left fully
        } else if (entry.intersectionRatio === 0) {
          setVisible(false);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollByDir = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.7, 400);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // Continuous horizontal auto-scroll when section is visible
  useEffect(() => {
    const el = trackRef.current;
    if (!el || partners.length === 0 || !visible) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!paused && el.scrollWidth > el.clientWidth + 8) {
        el.scrollLeft += (dt / 1000) * 42;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half - 1) {
          el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [partners.length, paused, visible]);

  if (partners.length === 0) return null;

  // Triple for seamless loop on wide screens
  const items = [...partners, ...partners, ...partners];

  return (
    <div
      ref={sectionRef}
      className={`partners-section relative transition-all duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0"
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        aria-label="Đối tác trước"
        onClick={() => {
          setPaused(true);
          scrollByDir(-1);
        }}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-md transition hover:border-brand-300 hover:text-brand-600 sm:-left-2"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto px-10 py-3 scrollbar-none sm:gap-5 sm:px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((p, i) => {
          const Tag = p.href ? "a" : "div";
          const linkProps = p.href
            ? {
                href: p.href,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {};
          // stagger only first set visually; delay capped
          const delay = Math.min((i % partners.length) * 70, 560);

          return (
            <Tag
              key={`${p.id}-${i}`}
              {...(linkProps as object)}
              title={p.name}
              className={`group flex h-24 w-[160px] shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm transition duration-500 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md sm:h-28 sm:w-[180px] ${
                visible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-8 scale-95 opacity-0"
              }`}
              style={{
                transitionDelay: visible ? `${delay}ms` : "0ms",
              }}
            >
              <div className="relative h-14 w-full sm:h-16">
                <SafeImage
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="180px"
                  className="object-contain opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                  unoptimized
                  fallbackClassName="bg-slate-50"
                />
              </div>
            </Tag>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Đối tác sau"
        onClick={() => {
          setPaused(true);
          scrollByDir(1);
        }}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-md transition hover:border-brand-300 hover:text-brand-600 sm:-right-2"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <p
        className={`mt-3 text-center text-[11px] text-slate-400 transition duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        Tự cuộn ngang · Di chuột để tạm dừng
      </p>
    </div>
  );
}
