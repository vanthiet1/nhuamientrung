import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryTree } from "@/lib/cms/types";
import SafeImage from "@/components/SafeImage";
import { cleanRawContent } from "@/lib/cms/content-links";

const themes = [
  { gradient: "from-brand-600 to-brand-800", soft: "bg-brand-50 text-brand-700" },
  { gradient: "from-teal-500 to-teal-800", soft: "bg-teal-50 text-teal-700" },
  { gradient: "from-sky-500 to-brand-700", soft: "bg-sky-50 text-brand-700" },
  { gradient: "from-indigo-500 to-indigo-800", soft: "bg-indigo-50 text-indigo-700" },
  { gradient: "from-cyan-500 to-cyan-800", soft: "bg-cyan-50 text-cyan-700" },
  { gradient: "from-rose-500 to-rose-800", soft: "bg-rose-50 text-rose-700" },
  { gradient: "from-emerald-500 to-emerald-800", soft: "bg-emerald-50 text-emerald-700" },
];

type CardItem = {
  slug: string;
  name: string;
  description: string;
  image?: string;
  sku?: string;
  children?: CategoryTree[];
};

export default function ProductCard({
  category,
  index = 0,
  size = "md",
  isProduct = false,
}: {
  category: CardItem;
  index?: number;
  /** lg = card to hơn (trang chủ) */
  size?: "md" | "lg";
  isProduct?: boolean;
}) {
  const theme = themes[index % themes.length];
  const lg = size === "lg";
  const initials = category.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
    
  const href = isProduct ? `/san-pham/${category.slug}` : `/danh-muc/${category.slug}`;

  return (
    <Link href={href} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-brand-500/50">
      <div
        className={`relative flex items-center justify-center overflow-hidden ${
          category.image ? "bg-slate-100" : `bg-gradient-to-br ${theme.gradient}`
        } ${
          lg ? "h-[213px] sm:h-[229px] md:h-[245px]" : "h-[181px] sm:h-[197px]"
        }`}
      >
        {category.image ? (
          <SafeImage
            src={category.image}
            alt={`${category.name}${category.sku ? ` — mã ${category.sku}` : ""} — Bao Bì Thành Phát`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-110"
            fallbackClassName="bg-white"
            unoptimized
          />
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-8 border-white/40 transition-transform duration-500 group-hover:scale-125" />
              <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full border-4 border-white/30 transition-transform duration-500 group-hover:scale-150" />
            </div>
            <span
              className={`relative font-black tracking-tight text-white/90 drop-shadow-sm ${
                lg ? "text-5xl" : "text-4xl"
              }`}
            >
              {initials}
            </span>
          </>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition duration-300 group-hover:opacity-40" />
        <span className="absolute right-3 top-3 rounded-full bg-white p-2 text-brand-600 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:shadow-brand-500/25">
          <ArrowUpRight className={lg ? "h-5 w-5" : "h-4 w-4"} />
        </span>
        
        {/* Overlay button on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex w-full items-center justify-center bg-[#395c8c]/95 py-3 px-4 text-sm font-bold text-white backdrop-blur">
            NHẬN BÁO GIÁ
          </div>
        </div>
      </div>
      <div className={lg ? "p-5 sm:p-6" : "p-4 sm:p-5"}>
        <h3
          className={`font-bold uppercase text-[#0a3f6b] ${
            lg ? "text-base leading-snug sm:text-lg" : "text-sm sm:text-base"
          }`}
        >
          {category.name}
        </h3>
        <p
          className={`mt-2 line-clamp-2 leading-relaxed text-slate-500 ${
            lg ? "text-sm sm:text-[15px]" : "text-sm"
          }`}
        >
          {category.description
            ? cleanRawContent(category.description, false)
                .replace(/<[^>]*>?/gm, "")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .trim()
            : ""}
        </p>
        <div className={`flex items-center gap-2 ${lg ? "mt-5" : "mt-4"}`}>
          {category.children && category.children.length > 0 ? (
            <span
              className={`rounded-full font-bold ${theme.soft} ${
                lg ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]"
              }`}
            >
              {category.children.length} danh mục con
            </span>
          ) : (
            <span className={`inline-flex items-center justify-center rounded-full bg-[#0a3f6b] px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:bg-[#072a48]`}>
              Nhận báo giá
            </span>
          )}
          <span
            className={`ml-auto font-bold text-[#0a3f6b] transition-colors hover:text-[#072a48] ${
              lg ? "text-sm sm:text-base" : "text-sm"
            }`}
          >
            Chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
}
