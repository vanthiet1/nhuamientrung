import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import type { CategoryTree } from "@/lib/cms/types";
import type { ProductRecord } from "@/lib/cms/types";

const CATEGORIES_PER_PAGE = 3;
const PRODUCTS_PER_CATEGORY = 8;

export type CategoryWithProducts = {
  category: CategoryTree;
  products: ProductRecord[];
};

export default function HomeCategoryProducts({
  groups,
  page,
}: {
  groups: CategoryWithProducts[];
  page: number;
}) {
  // Only categories that have products
  const withProducts = groups.filter((g) => g.products.length > 0);
  const totalPages = Math.max(
    1,
    Math.ceil(withProducts.length / CATEGORIES_PER_PAGE)
  );
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * CATEGORIES_PER_PAGE;
  const pageGroups = withProducts.slice(start, start + CATEGORIES_PER_PAGE);

  if (pageGroups.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
        Chưa có sản phẩm để hiển thị.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {pageGroups.map((group, gi) => {
        const items = group.products.slice(0, PRODUCTS_PER_CATEGORY);
        return (
          <div
            key={group.category.slug}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:p-8"
          >
            {/* Category title on top */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                  Danh mục
                </p>
                <h3 className="mt-1 text-xl font-extrabold text-brand-700 sm:text-2xl lg:text-[1.65rem]">
                  {group.category.name}
                </h3>
                {group.category.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                    {group.category.description
                      .replace(/<[^>]*>?/gm, "")
                      .replace(/&nbsp;/g, " ")
                      .replace(/&amp;/g, "&")
                      .trim()}
                  </p>
                )}
              </div>
              <Link
                href={`/danh-muc/${group.category.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:text-sky-600"
                aria-label={`Xem tất cả sản phẩm ${group.category.name}`}
              >
                Xem {group.category.name}
                <span className="text-slate-400 font-medium">
                  ({group.products.length})
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Products under category (3 cols khi có sidebar trang chủ) */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
                  index={gi * PRODUCTS_PER_CATEGORY + i}
                  isProduct={true}
                />
              ))}
            </div>

            {group.products.length > PRODUCTS_PER_CATEGORY && (
              <div className="mt-5 text-center">
                <Link
                  href={`/danh-muc/${group.category.slug}`}
                  className="btn-outline !text-xs"
                  aria-label={`Xem thêm sản phẩm trong ${group.category.name}`}
                >
                  +{group.products.length - PRODUCTS_PER_CATEGORY} sản phẩm{" "}
                  {group.category.name}
                </Link>
              </div>
            )}
          </div>
        );
      })}

      <Pagination
        page={current}
        totalPages={totalPages}
        basePath="/"
        hash="danh-muc-san-pham"
      />
    </div>
  );
}
