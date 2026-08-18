"use client";

import { ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { CategoryTree, ProductRecord } from "@/lib/cms/types";

export type CategoryWithProducts = {
  category: CategoryTree;
  products: ProductRecord[];
};

const FEATURED_4_AUXILIARY = [
  {
    id: "mang-xop-hoi-xop-khi-xop-boc-hang",
    name: "Màng Xốp Hơi",
    keyword: "boc-hang",
    slug: "mang-xop-hoi-xop-khi-xop-boc-hang",
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-xop-hoi-1.jpg",
  },
  {
    id: "mang-xop-pe-foam",
    name: "Màng Xốp PE FOAM",
    keyword: "pe-foam",
    slug: "mang-xop-pe-foam",
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-pe-quan-pallet.jpg",
  },
  {
    id: "bang-keo-trong",
    name: "Băng Keo Trong",
    keyword: "bang-keo-trong",
    slug: "bang-keo-trong",
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-co-pof-1.jpg",
  },
  {
    id: "bang-keo-duc",
    name: "Băng Keo Đục",
    keyword: "bang-keo-duc",
    slug: "bang-keo-duc",
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-co-nhiet-pe-1.jpg",
  },
];

export default function HomeAuxiliaryProducts({
  groups = [],
}: {
  groups: CategoryWithProducts[];
}) {
  const cards = FEATURED_4_AUXILIARY.map((catConfig, i) => {
    // 1. Search in matching category group
    const matchedGroup = groups.find(
      (g) =>
        g.category.slug.toLowerCase().includes(catConfig.id) ||
        g.category.name.toLowerCase().includes(catConfig.keyword)
    );

    const firstProduct = matchedGroup?.products?.[0];

    const image = firstProduct?.image || catConfig.fallbackImage;
    const slug = firstProduct?.slug || catConfig.slug;

    return {
      id: `${catConfig.id}-${i}`,
      name: catConfig.name,
      slug,
      image,
      index: i,
    };
  });

  return (
    <div className="space-y-8">
      {/* Perfectly Centered & Balanced Header Title with Flex Lines */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-8 w-full">
        <div className="h-[1px] flex-1 bg-slate-300" />
        <div className="flex items-center gap-2.5 px-5 sm:px-7 py-2 sm:py-2.5 bg-white border border-slate-300 text-[#051a53] font-black text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wide rounded-full shadow-sm shrink-0">
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-[#051a53] shrink-0" />
          <span>Màng Xốp Hơi | Màng PE FOAM | Băng Keo Trong | Băng Keo Đục</span>
        </div>
        <div className="h-[1px] flex-1 bg-slate-300" />
      </div>

      {/* 4 Product Cards in 1 Row (Categories 14, 15, 16, 17) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <ProductCard
            key={card.id}
            category={{
              slug: card.slug,
              name: card.name,
              image: card.image,
            }}
            index={card.index}
            isProduct={true}
          />
        ))}
      </div>
    </div>
  );
}
