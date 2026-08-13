"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeaderSearch({
  variant = "desktop",
  defaultValue = "",
  onSubmitExtra,
}: {
  variant?: "desktop" | "mobile";
  defaultValue?: string;
  onSubmitExtra?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const query = q.trim();
      if (query) {
        router.push(`/tim-kiem?q=${encodeURIComponent(query)}`);
      } else {
        router.push(`/tim-kiem`);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [q, router]);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const query = q.trim();
    if (query) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/tim-kiem`);
    }
    onSubmitExtra?.();
  }

  if (variant === "mobile") {
    return (
      <form onSubmit={submit} className="w-full">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm, tin tức..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
      </form>
    );
  }

  // Desktop: always visible full-width search in nav
  return (
    <form onSubmit={submit} className="hidden lg:block">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm sản phẩm, tin tức..."
          className="w-[11rem] rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15 xl:w-[14rem] 2xl:w-[16rem]"
        />
      </div>
    </form>
  );
}
