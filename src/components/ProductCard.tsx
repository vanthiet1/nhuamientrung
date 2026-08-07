import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryTree } from "@/lib/cms/types";
import SafeImage from "@/components/SafeImage";

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
}: {
  category: CardItem;
  index?: number;
  /** lg = card to hơn (trang chủ) */
  size?: "md" | "lg";
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

  return (
    <Link href={`/san-pham/${category.slug}`} className="card-hover group block overflow-hidden">
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${theme.gradient} ${
          lg ? "h-52 sm:h-56 md:h-60" : "h-44 sm:h-48"
        }`}
      >
        {category.image ? (
          <SafeImage
            src={category.image}
            alt={`${category.name}${category.sku ? ` — mã ${category.sku}` : ""} — Bao Bì Thành Phát`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            fallbackClassName="bg-white"
            unoptimized
          />
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-8 border-white/40" />
              <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full border-4 border-white/30" />
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-brand-700 opacity-0 shadow transition group-hover:opacity-100">
          <ArrowUpRight className={lg ? "h-5 w-5" : "h-4 w-4"} />
        </span>
      </div>
      <div className={lg ? "p-5 sm:p-6" : "p-4 sm:p-5"}>
        <h3
          className={`font-bold text-slate-900 transition group-hover:text-brand-600 ${
            lg ? "text-base leading-snug sm:text-lg" : "text-sm sm:text-base"
          }`}
        >
          {category.name}
        </h3>
        {category.sku && (
          <p
            className={`mt-1 font-semibold text-sky-600 ${
              lg ? "text-xs sm:text-sm" : "text-[11px]"
            }`}
          >
            Mã SP: {category.sku}
          </p>
        )}
        <p
          className={`mt-2 line-clamp-2 leading-relaxed text-slate-500 ${
            lg ? "text-sm sm:text-[15px]" : "text-sm"
          }`}
        >
          {category.description}
        </p>
        <div className={`flex items-center justify-between gap-2 ${lg ? "mt-4" : "mt-3"}`}>
          {category.children && category.children.length > 0 ? (
            <span
              className={`rounded-full font-bold ${theme.soft} ${
                lg ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-[11px]"
              }`}
            >
              {category.children.length} danh mục con
            </span>
          ) : (
            <span
              className={`font-medium text-slate-400 ${
                lg ? "text-xs sm:text-sm" : "text-[11px]"
              }`}
            >
              Chi tiết sản phẩm
            </span>
          )}
          <span
            className={`font-bold text-brand-600 transition group-hover:text-sky-600 ${
              lg ? "text-sm sm:text-base" : "text-sm"
            }`}
          >
            Chi tiết {category.name.split(" ").slice(0, 3).join(" ")} →
          </span>
        </div>
      </div>
    </Link>
  );
}
