"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { CategoryTree } from "@/lib/cms/types";
import type { ProductRecord } from "@/lib/cms/types";

const PRODUCTS_PER_PAGE = 8;

export type CategoryWithProducts = {
  category: CategoryTree;
  products: ProductRecord[];
};

export default function HomeCategoryProducts({
  groups,
}: {
  groups: CategoryWithProducts[];
  page?: number;
}) {
  const withProducts = groups.filter((g) => g.products.length > 0);
  const [activeTab, setActiveTab] = useState(withProducts[0]?.category.id);
  const [currentPage, setCurrentPage] = useState(1);

  if (withProducts.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
        Chưa có sản phẩm để hiển thị.
      </p>
    );
  }

  const activeGroup =
    withProducts.find((g) => g.category.id === activeTab) || withProducts[0];
  
  const totalPages = Math.ceil(activeGroup.products.length / PRODUCTS_PER_PAGE);
  const items = activeGroup.products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="space-y-10">
      {/* Tabs */}
      <div className="flex w-full overflow-x-auto gap-3 pb-4 md:flex-wrap md:justify-center scrollbar-none">
        {withProducts.map((group) => {
          const isActive = group.category.id === activeTab;
          return (
            <button
              key={group.category.id}
              onClick={() => {
                setActiveTab(group.category.id);
                setCurrentPage(1);
              }}
              className={`shrink-0 rounded-full border px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold uppercase transition-all ${
                isActive
                  ? "border-[#1a2a4b] bg-[#1a2a4b] text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {group.category.name}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard
            size="lg"
            key={p.id}
            category={{
              slug: p.slug,
              name: p.name,
              description: p.description,
              image: p.image,
              sku: p.sku,
            }}
            index={i}
            isProduct={true}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Trang trước"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border font-semibold transition-colors ${
                  currentPage === p
                    ? "border-[#1a2a4b] bg-[#1a2a4b] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Trang sau"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
