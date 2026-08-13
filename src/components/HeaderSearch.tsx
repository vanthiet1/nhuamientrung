"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";

type SearchHit = {
  type: "product" | "news" | "category" | "subcategory";
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  image?: string;
};

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
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const initialRender = useRef(true);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const query = q.trim();
    if (!query) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Lỗi tìm kiếm", err);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce

    return () => clearTimeout(handler);
  }, [q]);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    if (results.length > 0) {
      // Navigate to the first result if form is submitted
      router.push(results[0].href);
      setIsOpen(false);
      onSubmitExtra?.();
    }
  }

  const SearchDropdown = () => (
    <div className={`absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl transition-all duration-200 ${isOpen && q.trim() ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}`}>
      {loading ? (
        <div className="flex items-center justify-center p-6 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
          {results.map((r, i) => (
            <Link
              key={i}
              href={r.href}
              onClick={() => {
                setIsOpen(false);
                onSubmitExtra?.();
              }}
              className="flex items-center gap-3 border-b border-slate-100 p-3 hover:bg-slate-50 transition-colors last:border-0"
            >
              {r.image && (
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 relative">
                  <SafeImage src={r.image} alt={r.title} fill className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800 group-hover:text-brand-600">
                  {r.title}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {r.type === 'product' ? 'Sản phẩm' : r.type === 'news' ? 'Tin tức' : 'Danh mục'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-slate-500">
          Không tìm thấy kết quả nào.
        </div>
      )}
    </div>
  );

  if (variant === "mobile") {
    return (
      <form onSubmit={submit} className="w-full relative" ref={wrapperRef}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => {
              if (q.trim()) setIsOpen(true);
            }}
            placeholder="Tìm sản phẩm, tin tức..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
        <SearchDropdown />
      </form>
    );
  }

  // Desktop: always visible full-width search in nav
  return (
    <form onSubmit={submit} className="hidden lg:block relative" ref={wrapperRef}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => {
            if (q.trim()) setIsOpen(true);
          }}
          placeholder="Tìm sản phẩm, tin tức..."
          className="w-[11rem] rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15 xl:w-[14rem] 2xl:w-[16rem]"
        />
      </div>
      <SearchDropdown />
    </form>
  );
}
