"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const STEP_MS = 3200; // thời gian dừng mỗi item

type NewsItem = {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  image?: string;
};

export default function NewsTicker({ items }: { items: NewsItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const el = trackRef.current;
    if (!el) return;
    const nodes = el.querySelectorAll<HTMLElement>("[data-news-item]");
    if (!nodes.length) return;

    const count = items.length;
    if (count === 0) return;
    const i = ((index % count) + count) % count;
    const target = nodes[i];
    if (!target) return;

    const top = target.offsetTop - el.offsetTop;
    el.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
    indexRef.current = i;
  }, [items.length]);

  useEffect(() => {
    if (items.length === 0) return;
    indexRef.current = 0;
    scrollToIndex(0, false);

    const id = window.setInterval(() => {
      if (paused) return;
      const next = indexRef.current + 1;
      if (next >= items.length) {
        scrollToIndex(0, false);
      } else {
        scrollToIndex(next, true);
      }
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [items.length, paused, scrollToIndex]);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-slate-50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t from-slate-50 to-transparent"
        aria-hidden
      />
      <div
        ref={trackRef}
        className="flex h-[184px] flex-col gap-6 overflow-y-auto overscroll-contain scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {items.map((news) => (
          <Link
            key={news.slug}
            href={`/tin-tuc/${news.slug}`}
            data-news-item
            className="group flex gap-4 shrink-0"
          >
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              {news.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={news.image}
                  alt={news.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 line-clamp-2 transition group-hover:text-brand-600">
                {news.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(news.date).toLocaleDateString("vi-VN", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
