import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  basePath = "/",
  param = "page",
  /** Keep other query params when changing page */
  extraParams,
  hash,
}: {
  page: number;
  totalPages: number;
  basePath?: string;
  param?: string;
  extraParams?: Record<string, string | number | undefined | null>;
  /** e.g. "san-pham-cung-loai" */
  hash?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    if (extraParams) {
      for (const [k, v] of Object.entries(extraParams)) {
        if (v === undefined || v === null || v === "" || k === param) continue;
        params.set(k, String(v));
      }
    }
    if (p > 1) params.set(param, String(p));
    const qs = params.toString();
    const path = qs ? `${basePath}?${qs}` : basePath;
    return hash ? `${path}#${hash}` : path;
  };

  const pages: (number | "…")[] = [];
  const window = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - window && i <= page + window)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <nav
      aria-label="Phân trang"
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
    >
      <Link
        href={href(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition ${
          page <= 1
            ? "pointer-events-none border-slate-100 text-slate-300"
            : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-600"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((p, idx) =>
        p === "…" ? (
          <span
            key={`e-${idx}`}
            className="inline-flex h-10 w-8 items-center justify-center text-slate-400"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition ${
              p === page
                ? "border-brand-600 bg-brand-600 text-white shadow"
                : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-600"
            }`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={href(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition ${
          page >= totalPages
            ? "pointer-events-none border-slate-100 text-slate-300"
            : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-600"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
