"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { NewsCardItem } from "@/components/NewsCard";
import { SafeImg } from "@/components/SafeImage";

const STEP_MS = 3200; // thời gian dừng mỗi item

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return iso;
  }
}

function NewsRow({ item }: { item: NewsCardItem }) {
  const hasImage = Boolean(item.image);
  return (
    <Link
      href={`/tin-tuc/${item.slug}`}
      data-news-item
      className="group flex shrink-0 gap-3.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-brand-200 hover:shadow-md sm:gap-4 sm:p-3.5"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-28">
        {hasImage ? (
          <SafeImg
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            fallbackClassName="bg-slate-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800 px-2 text-center text-[10px] font-bold text-white/90">
            Tin tức
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-600">
          <Calendar className="h-3 w-3" />
          {formatDate(item.date)}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 transition group-hover:text-brand-600 sm:text-[15px]">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {item.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function HomeNewsScroll({
  featured,
  items,
}: {
  featured: NewsCardItem;
  items: NewsCardItem[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const el = trackRef.current;
    if (!el) return;
    const nodes = el.querySelectorAll<HTMLElement>("[data-news-item]");
    if (!nodes.length) return;

    // Only use first half (original list) for index wrap math
    const count = items.length;
    if (count === 0) return;
    const i = ((index % count) + count) % count;
    const target = nodes[i];
    if (!target) return;

    const top = target.offsetTop - el.offsetTop;
    el.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
    indexRef.current = i;
  }, [items.length]);

  // Auto step: đúng 1 item / lần
  useEffect(() => {
    if (items.length === 0) return;

    // start at first item
    indexRef.current = 0;
    scrollToIndex(0, false);

    const id = window.setInterval(() => {
      if (paused) return;
      const next = indexRef.current + 1;
      if (next >= items.length) {
        // jump to start without smooth, then continue
        scrollToIndex(0, false);
      } else {
        scrollToIndex(next, true);
      }
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [items.length, paused, scrollToIndex]);

  const hasFeaturedImage = Boolean(featured.image);
  // Không nhân đôi list — scroll theo index item gốc cho chính xác
  const list = items;

  return (
    <div className="grid gap-5 lg:grid-cols-5 lg:gap-6">
      {/* Featured with image */}
      <div className="lg:col-span-2">
        <Link
          href={`/tin-tuc/${featured.slug}`}
          className="card-hover group flex h-full flex-col overflow-hidden"
        >
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 sm:h-60 lg:min-h-[280px] lg:flex-1">
            {hasFeaturedImage ? (
              <SafeImg
                src={featured.image}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                fallbackClassName="bg-transparent"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                <Calendar className="h-3 w-3" />
                {formatDate(featured.date)}
              </span>
              <p className="mt-2 line-clamp-3 text-lg font-bold leading-snug text-white drop-shadow sm:text-xl">
                {featured.title}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-500">
              {featured.excerpt}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600 group-hover:text-accent-600">
              Đọc bài nổi bật: {featured.title.slice(0, 36)}
              {featured.title.length > 36 ? "…" : ""}{" "}
              <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Vertical step scroll — 1 item mỗi lần */}
      <div className="relative lg:col-span-3">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-white to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-white to-transparent"
          aria-hidden
        />
        <div
          ref={trackRef}
          className="flex h-[420px] flex-col gap-3 overflow-y-auto overscroll-contain scroll-smooth pr-1 scrollbar-none sm:h-[480px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {list.map((item) => (
            <NewsRow key={item.slug} item={item} />
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Tự cuộn từng tin · Di chuột để tạm dừng
        </p>
      </div>
    </div>
  );
}
