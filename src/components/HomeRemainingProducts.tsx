"use client";

import { ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { CategoryTree, ProductRecord } from "@/lib/cms/types";

export type CategoryWithProducts = {
  category: CategoryTree;
  products: ProductRecord[];
};

const REMAINING_PRODUCTS_CONFIG = [
  {
    id: "in-bao-bi-nhua",
    name: "In Bao Bì Nhựa",
    slug: "in-bao-bi",
    keyword: "in-bao-bi",
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2022/03/in-mang-co-pvc.jpg",
  },
  {
    id: "mang-co-ao-binh-5gallons",
    name: "Màng Co Áo Bình 5 Gallons",
    slug: "mang-co-ao-binh-5gallons",
    keyword: "binh-5gallons",
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-co-pvc-1.jpg",
  },
  {
    id: "mang-pe-quan-pallet",
    name: "Màng PE Quấn Pallet",
    slug: "mang-quan-pallet",
    keyword: "pallet",
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-pe-quan-pallet.jpg",
  },
  {
    id: "phu-kien-nganh-nuoc-uong",
    name: "Phụ Kiện Nước Uống Đóng Chai",
    slug: "phu-kien-nganh-nuoc-uong",
    keyword: "phu-kien",
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2022/03/mang-co-nhiet-pe-1.jpg",
  },
];

export default function HomeRemainingProducts({
  groups = [],
}: {
  groups: CategoryWithProducts[];
}) {
  const cards = REMAINING_PRODUCTS_CONFIG.map((itemConfig, i) => {
    // Search across all groups for products
    let matched: ProductRecord | undefined;

    for (const g of groups) {
      matched = g.products.find(
        (p) =>
          p.image &&
          p.image.trim().length > 0 &&
          !p.image.includes("placeholder") &&
          (p.slug.toLowerCase().includes(itemConfig.keyword) ||
            p.name.toLowerCase().includes(itemConfig.keyword))
      );
      if (matched) break;
    }

    const name = itemConfig.name;
    const slug = matched?.slug || itemConfig.slug;
    const image = matched?.image || itemConfig.fallbackImage;

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
      {/* Perfectly Centered & Balanced Header Title reading 'SẢN PHẨM KHÁC' */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-8 w-full">
        <div className="h-[1px] flex-1 bg-slate-300" />
        <div className="flex items-center gap-2.5 px-6 sm:px-8 py-2 sm:py-2.5 bg-white border border-slate-300 text-[#051a53] font-black text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wide rounded-full shadow-sm shrink-0">
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-[#051a53] shrink-0" />
          <span>SẢN PHẨM KHÁC</span>
        </div>
        <div className="h-[1px] flex-1 bg-slate-300" />
      </div>

      {/* 4 Product Cards in 1 Row (100% Valid Images) */}
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
