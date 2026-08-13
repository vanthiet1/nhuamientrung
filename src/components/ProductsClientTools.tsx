"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState, useTransition, useEffect } from "react";

export default function ProductsClientTools({
  categories,
  total,
}: {
  categories: { name: string; slug: string; count: number }[];
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get("q") || "";
  const currentCat = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [q, setQ] = useState(currentQ);

  // Sync state when URL changes
  useEffect(() => {
    setQ(currentQ);
  }, [currentQ]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset page on filter change
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/tat-ca-san-pham?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q });
  };

  return (
    <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Mobile Category Dropdown (hidden on lg) */}
        <div className="w-full lg:hidden">
          <label htmlFor="mobile-cat" className="sr-only">
            Danh mục sản phẩm
          </label>
          <div className="relative">
            <select
              id="mobile-cat"
              value={currentCat}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Tất cả danh mục ({total})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <label htmlFor="search" className="sr-only">
            Tìm kiếm sản phẩm
          </label>
          <input
            id="search"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
          />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <button type="submit" className="hidden">Search</button>
        </form>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Sắp xếp:</span>
          </label>
          <div className="relative">
            <select
              id="sort"
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
      
      {isPending && (
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/3 animate-[slide_1.5s_ease-in-out_infinite] rounded-full bg-brand-500"></div>
        </div>
      )}
    </div>
  );
}
