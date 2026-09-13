"use client";

import { ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { CategoryTree, ProductRecord } from "@/lib/cms/types";

export type CategoryWithProducts = {
  category: CategoryTree;
  products: ProductRecord[];
};

const FEATURED_4_ITEMS = [
  {
    id: "mang-co-pe",
    name: "Màng Co PE",
    keyword: "pe",
    itemOffset: 0,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/mang-co-pe.jpg",
  },
  {
    id: "mang-co-pof",
    name: "Màng Co POF",
    keyword: "pof",
    itemOffset: 0,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/mang-co-pof.jpg",
  },
  {
    id: "mang-co-pvc",
    name: "Màng Co PVC",
    keyword: "pvc",
    itemOffset: 0,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/mang-co-pvc.jpg",
  },
  {
    id: "mang-co-pet",
    name: "Màng Co PET",
    keyword: "pet",
    itemOffset: 0,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-co-nhiet.jpg",
  },
];

export default function HomeCategoryProducts({
  groups = [],
}: {
  groups: CategoryWithProducts[];
  page?: number;
}) {
  const cards = FEATURED_4_ITEMS.map((itemConfig, i) => {
    // Search matching products for this keyword
    const matchingProducts: ProductRecord[] = [];

    // 1. Check matching category group
    const matchedGroup = groups.find(
      (g) =>
        g.category.slug.toLowerCase().includes(itemConfig.keyword) ||
        g.category.name.toLowerCase().includes(itemConfig.keyword)
    );

    if (matchedGroup?.products) {
      matchingProducts.push(...matchedGroup.products);
    }

    // 2. Search across all groups if needed
    groups.forEach((g) => {
      g.products.forEach((p) => {
        if (
          (p.name.toLowerCase().includes(itemConfig.keyword) ||
            p.slug.toLowerCase().includes(itemConfig.keyword)) &&
          !matchingProducts.some((existing) => existing.id === p.id)
        ) {
          matchingProducts.push(p);
        }
      });
    });

    const targetProduct = matchingProducts[itemConfig.itemOffset] || matchingProducts[0];

    const name = itemConfig.name;
    const slug = targetProduct?.slug || itemConfig.id;
    const image = targetProduct?.image || itemConfig.fallbackImage;

    return {
      id: `${itemConfig.id}-${i}`,
      name,
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
          <span>Màng Co PE | Màng Co POF | Màng Co PVC | Màng Co PET</span>
        </div>
        <div className="h-[1px] flex-1 bg-slate-300" />
      </div>

      {/* 4 Product Cards in 1 Row (Màng Co PE, Màng Co POF, Màng Co PVC, Màng Co PET - thứ tự 9) */}
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
