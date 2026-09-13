"use client";

import { ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { CategoryTree, ProductRecord } from "@/lib/cms/types";

export type CategoryWithProducts = {
  category: CategoryTree;
  products: ProductRecord[];
};

const PRINTING_8_ITEMS = [
  // 2 Products for Category 0: In Màng Ép Ly Nhựa
  {
    id: "in-mang-ep-ly-1",
    name: "Cuộn màng ép ly trơn",
    slug: "cuon-mang-ep-ly-tron",
    keyword: "tron",
    catIndex: 0,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/in-mang-co-nhan-chai-nuoc-suoi.jpg",
  },
  {
    id: "in-mang-ep-ly-2",
    name: "In cuộn màng ép ly theo yêu cầu",
    slug: "in-cuon-mang-ep-ly-theo-yeu-cau",
    keyword: "yeu-cau",
    catIndex: 0,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/bao-bi-mang-ghep-1-1.jpg",
  },

  // 6 Products for Category 1: Dịch Vụ In Màng Co
  {
    id: "in-mang-co-pvc",
    name: "In Màng Co PVC",
    slug: "in-mang-co-pvc",
    keyword: "pvc",
    catIndex: 1,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/in-mang-co-pvc.jpg",
  },
  {
    id: "in-mang-co-nhan-chai",
    name: "In Màng Co Nhãn Chai",
    slug: "in-mang-co-nhan-chai",
    keyword: "nhan-chai",
    catIndex: 1,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/in-mang-co-nhan-chai-1-2.jpg",
  },
  {
    id: "in-mang-chuyen-nhiet",
    name: "In Màng Chuyển Nhiệt",
    slug: "in-mang-chuyen-nhiet",
    keyword: "chuyen-nhiet",
    catIndex: 1,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/in-mang-co-nhan-chai-3.jpg",
  },
  {
    id: "mang-co-pvc-in-cuon",
    name: "Màng Co PVC In Dạng Cuộn",
    slug: "mang-co-pvc-in-dang-cuon",
    keyword: "cuon",
    catIndex: 1,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/mang-co-pvc.jpg",
  },
  {
    id: "mang-co-in-pof",
    name: "Màng Co In Chất Liệu POF",
    slug: "mang-co-in-chat-lieu-pof",
    keyword: "pof",
    catIndex: 1,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/mang-co-pof.jpg",
  },
  {
    id: "mang-co-in-pe",
    name: "Màng Co In Chất Liệu PE",
    slug: "mang-co-in-chat-lieu-pe",
    keyword: "pe",
    catIndex: 1,
    fallbackImage: "https://baobithanhphat.com/wp-content/uploads/2021/12/mang-co-pe.jpg",
  },
];

export default function HomePrintingProducts({
  groups = [],
}: {
  groups: CategoryWithProducts[];
}) {
  // Extract products belonging to Category 0 (In Màng Ép Ly Nhựa) and Category 1 (Dịch Vụ In Màng Co)
  const cat0Products: ProductRecord[] = [];
  const cat1Products: ProductRecord[] = [];

  groups.forEach((g) => {
    const isCat0 =
      g.category.slug.toLowerCase().includes("uncategorized") ||
      g.category.name.toLowerCase().includes("ép ly") ||
      g.category.name.toLowerCase().includes("in màng ép ly");

    const isCat1 =
      g.category.slug.toLowerCase().includes("dich-vu-in-mang-co") ||
      g.category.name.toLowerCase().includes("dịch vụ in màng co") ||
      g.category.name.toLowerCase().includes("in màng co");

    if (isCat0) cat0Products.push(...g.products);
    if (isCat1) cat1Products.push(...g.products);
  });

  let cat0Count = 0;
  let cat1Count = 0;

  const displayItems = PRINTING_8_ITEMS.map((itemConfig, i) => {
    let matched: ProductRecord | undefined;

    if (itemConfig.catIndex === 0) {
      matched = cat0Products[cat0Count] || cat0Products.find((p) => p.name.toLowerCase().includes(itemConfig.keyword));
      cat0Count++;
    } else {
      matched = cat1Products[cat1Count] || cat1Products.find((p) => p.name.toLowerCase().includes(itemConfig.keyword));
      cat1Count++;
    }

    return {
      id: `${itemConfig.id}-${i}`,
      name: matched?.name || itemConfig.name,
      slug: matched?.slug || itemConfig.slug,
      image: matched?.image || itemConfig.fallbackImage,
      index: i,
    };
  });

  return (
    <div className="space-y-8">
      {/* Perfectly Centered & Balanced Header Title with Flex Lines for Category 0 & 1 */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-8 w-full">
        <div className="h-[1px] flex-1 bg-slate-300" />
        <div className="flex items-center gap-2.5 px-5 sm:px-7 py-2 sm:py-2.5 bg-white border border-slate-300 text-[#051a53] font-black text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wide rounded-full shadow-sm shrink-0">
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-[#051a53] shrink-0" />
          <span>In Màng Ép Ly Nhựa | Dịch Vụ In Màng Co</span>
        </div>
        <div className="h-[1px] flex-1 bg-slate-300" />
      </div>

      {/* 8 Product Cards Grid (2 Products for Category 0 + 6 Products for Category 1) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayItems.map((item) => (
          <ProductCard
            key={item.id}
            category={{
              slug: item.slug,
              name: item.name,
              image: item.image,
            }}
            index={item.index}
            isProduct={true}
          />
        ))}
      </div>
    </div>
  );
}
