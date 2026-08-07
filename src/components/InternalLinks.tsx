import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";

export type InternalLinkItem = {
  href: string;
  title: string;
  subtitle?: string;
};

export default function InternalLinks({
  title = "Bài viết & sản phẩm liên quan",
  items,
}: {
  title?: string;
  items: InternalLinkItem[];
}) {
  if (!items.length) return null;

  return (
    <aside className="card p-5 sm:p-6" aria-label={title}>
      <div className="mb-4 flex items-center gap-2">
        <Link2 className="h-5 w-5 text-brand-600" />
        <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3 transition hover:border-brand-200 hover:bg-brand-50/50"
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-900 group-hover:text-brand-700 line-clamp-2">
                  {item.title}
                </span>
                {item.subtitle && (
                  <span className="mt-0.5 block text-xs text-slate-500 line-clamp-1">
                    {item.subtitle}
                  </span>
                )}
              </span>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-brand-600" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
