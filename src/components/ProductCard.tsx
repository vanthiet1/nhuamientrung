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
      className="group relative flex flex-col justify-between overflow-hidden border border-slate-300 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#051a53] hover:shadow-xl"
    >
      {/* Top Image Area - Full Bleed / Occupies 100% Space */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-white">
        {category.image ? (
          <SafeImage
            src={category.image}
            alt={`${category.name} — Bao Bì Thành Phát`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fallbackClassName="bg-white"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400 font-bold text-base">
            {category.name}
          </div>
        )}
      </div>

      {/* Solid Dark Navy Bottom Title Banner */}
      <div className="bg-[#051a53] group-hover:bg-[#082c85] transition-colors py-3.5 px-4 text-center z-10">
        <h3 className="text-white font-extrabold text-sm sm:text-base md:text-lg uppercase tracking-wide">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
