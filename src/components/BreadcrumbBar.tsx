"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import type { CategoryTree } from "@/lib/cms/types";

const ROUTE_LABELS: Record<string, string> = {
  "gioi-thieu": "Giới thiệu",
  "san-pham": "Sản phẩm",
  "tat-ca-san-pham": "Tất cả sản phẩm",
  "danh-muc": "Danh Mục",
  "tin-tuc": "Tin tức",
  "tuyen-dung": "Tuyển dụng",
  "lien-he": "Liên hệ",
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

function findCategoryLabel(
  categories: CategoryTree[],
  slug: string
): { label: string; parent?: CategoryTree } | null {
  for (const cat of categories) {
    if (cat.slug === slug) {
      return { label: cat.name };
    }
    const child = cat.children?.find((c) => c.slug === slug);
    if (child) {
      return { label: child.name, parent: cat };
    }
  }
  return null;
}

function humanizeSlug(slug: string) {
  try {
    const decoded = decodeURIComponent(slug);
    return decoded
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return slug.replace(/-/g, " ");
  }
}

export function buildBreadcrumbs(
  pathname: string,
  categories: CategoryTree[] = []
): BreadcrumbItem[] {
  if (!pathname || pathname === "/") return [];

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const crumbs: BreadcrumbItem[] = [];
  let path = "";

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (!seg || seg.toLowerCase() === "index") continue;

    path += `/${seg}`;
    const isLast = i === segments.length - 1;

    // Static routes
    if (ROUTE_LABELS[seg]) {
      crumbs.push({
        label: ROUTE_LABELS[seg],
        href: isLast ? undefined : path,
      });
      continue;
    }

    // Product / category slug under /danh-muc/...
    if (segments[0] === "danh-muc" || segments[0] === "san-pham") {
      const found = findCategoryLabel(categories, seg);
      if (found) {
        // Insert parent category when viewing a child slug directly
        if (found.parent) {
          const parentPath = `/danh-muc/${found.parent.slug}`;
          const hasParent = crumbs.some(
            (c) => c.href === parentPath || c.label === found.parent!.name
          );
          if (!hasParent) {
            crumbs.push({
              label: found.parent.name,
              href: parentPath,
            });
          }
        }
        crumbs.push({
          label: found.label,
          href: isLast ? undefined : path,
        });
        continue;
      }
    }

    // News / other dynamic
    crumbs.push({
      label: humanizeSlug(seg),
      href: isLast ? undefined : path,
    });
  }

  return crumbs;
}

export default function BreadcrumbBar({
  categories = [],
  items,
}: {
  categories?: CategoryTree[];
  /** Optional override (server-provided labels) */
  items?: BreadcrumbItem[];
}) {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    // News detail has its own inline breadcrumb with proper Vietnamese title
    (!items && /^\/tin-tuc\/.+/.test(pathname))
  ) {
    return null;
  }

  const rawCrumbs = items && items.length > 0 ? items : buildBreadcrumbs(pathname, categories);
  const crumbs = rawCrumbs.filter(
    (c) => c.label && c.label.toLowerCase() !== "index" && c.label.toLowerCase() !== "trang chủ"
  );

  if (crumbs.length === 0) return null;

  return (
    <div className="border-b border-slate-200/80 bg-slate-50">
      <nav
        aria-label="Breadcrumb"
        className="container-page flex flex-wrap items-center gap-1.5 py-4 text-sm text-slate-500 sm:text-base"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-medium text-slate-600 transition hover:text-brand-600"
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>Trang chủ</span>
        </Link>

        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={`${c.label}-${i}`} className="inline-flex min-w-0 items-center gap-1.5">
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              {c.href && !isLast ? (
                <Link
                  href={c.href}
                  className="font-medium text-slate-600 transition hover:text-brand-600"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  className="font-semibold text-brand-700"
                  aria-current="page"
                >
                  {c.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
