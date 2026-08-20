"use client";

import Link from "next/link";
import SafeImage from "@/components/SafeImage";

type CardItem = {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  sku?: string;
};

export default function ProductCard({
  category,
  isProduct = false,
}: {
  category: CardItem;
  index?: number;
  size?: "md" | "lg";
  isProduct?: boolean;
}) {
  const href = isProduct ? `/san-pham/${category.slug}` : `/danh-muc/${category.slug}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-none border border-slate-300 bg-white shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-600 hover:shadow-2xl hover:shadow-brand-900/20"
    >
      {/* Glossy Light Sweep / Shimmer Glint Effect on Hover */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <div className="absolute -left-[120%] top-0 h-full w-[80%] -skew-x-[25deg] bg-gradient-to-r from-transparent via-white/45 to-transparent transition-all duration-1000 ease-out group-hover:left-[150%]" />
      </div>

      {/* Top Image Area */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-white">
        {/* Subtle glass reflection specular overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/30 via-transparent to-black/10 opacity-70 transition-opacity duration-300 group-hover:opacity-40" />

        {category.image ? (
          <SafeImage
            src={category.image}
            alt={`${category.name} — Bao Bì Thành Phát`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            fallbackClassName="bg-white"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400 font-bold text-base">
            {category.name}
          </div>
        )}
      </div>

      {/* Glossy Metallic Blue Title Banner */}
      <div className="relative z-20 bg-gradient-to-r from-[#051a53] via-[#0e3baf] to-[#051a53] group-hover:from-[#08277a] group-hover:via-[#1349d6] group-hover:to-[#08277a] transition-all duration-500 py-3.5 px-4 text-center border-t border-white/30 shadow-inner">
        {/* Top edge glass reflection line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

        <h3 className="text-white font-extrabold text-sm sm:text-base md:text-lg uppercase tracking-wide drop-shadow-sm transition-transform duration-300 group-hover:scale-105">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
