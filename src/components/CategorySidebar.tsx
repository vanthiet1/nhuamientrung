import Link from "next/link";
import { ChevronRight, FolderTree } from "lucide-react";
import type { CategoryTree } from "@/lib/cms/types";

export default function CategorySidebar({
  categories,
  activeSlug,
}: {
  categories: CategoryTree[];
  activeSlug?: string;
}) {
  return (
    <aside className="card overflow-hidden">
      <div className="flex items-center gap-2 bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-white">
        <FolderTree className="h-4 w-4 opacity-90" />
        Danh mục sản phẩm
      </div>
      <ul className="divide-y divide-slate-100">
        {categories.map((cat) => {
          const children = cat.children || [];
          const hasChildren = children.length > 0;
          const isActive =
            activeSlug === cat.slug ||
            children.some((c) => c.slug === activeSlug);

          return (
            <li
              key={cat.slug}
              className="group/cat relative"
            >
              <Link
                href={`/san-pham/${cat.slug}`}
                className={`flex items-center justify-between gap-2 px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-accent-50 text-accent-600"
                    : "text-slate-800 group-hover/cat:bg-slate-50 group-hover/cat:text-brand-600"
                }`}
              >
                <span className="min-w-0 leading-snug">{cat.name}</span>
                {hasChildren && (
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition duration-200 ${
                      isActive
                        ? "rotate-90 text-accent-500"
                        : "text-slate-300 group-hover/cat:rotate-90 group-hover/cat:text-brand-500 group-focus-within/cat:rotate-90"
                    }`}
                    aria-hidden
                  />
                )}
              </Link>

              {hasChildren && (
                <ul
                  className={`overflow-hidden border-t border-slate-50 bg-slate-50/90 transition-[max-height,opacity] duration-200 ease-out ${
                    isActive
                      ? "max-h-[480px] opacity-100"
                      : "max-h-0 opacity-0 group-hover/cat:max-h-[480px] group-hover/cat:opacity-100 group-focus-within/cat:max-h-[480px] group-focus-within/cat:opacity-100"
                  }`}
                >
                  {children.map((child) => {
                    const subActive = activeSlug === child.slug;
                    return (
                      <li key={child.slug}>
                        <Link
                          href={`/san-pham/${child.slug}`}
                          className={`block border-l-2 py-2 pl-6 pr-4 text-xs transition ${
                            subActive
                              ? "border-accent-500 bg-white font-bold text-accent-600"
                              : "border-transparent text-slate-600 hover:border-brand-300 hover:bg-white hover:text-brand-600"
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    );
                  })}
                  <li className="h-1.5" aria-hidden />
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
