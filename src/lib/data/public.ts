import { cache } from "react";
import {
  findCategoryOrSub,
  getCategoryTree,
  getNews,
  getNewsBySlug,
  getProductBySlug,
  getProducts,
  getCategories,
  getSubcategories,
  getCareers,
  getCareerBySlug,
  getBanners,
} from "@/lib/cms/store";
import type { CategoryTree } from "@/lib/cms/types";

export type { CategoryTree as Category };

export const loadCategories = cache(async (): Promise<CategoryTree[]> => {
  return getCategoryTree();
});

export const loadCategoryLookup = cache(async (slug: string) => {
  return findCategoryOrSub(slug);
});

export const loadAllCategorySlugs = cache(async () => {
  const [cats, subs] = await Promise.all([getCategories(), getSubcategories()]);
  return [...cats.map((c) => c.slug), ...subs.map((s) => s.slug)];
});

export const loadProducts = cache(async (opts?: {
  categoryId?: string;
  subcategoryId?: string;
}) => {
  let list = (await getProducts()).filter((p) => p.isActive);
  if (opts?.categoryId) {
    list = list.filter((p) => p.categoryId === opts.categoryId);
  }
  if (opts?.subcategoryId) {
    list = list.filter((p) => p.subcategoryId === opts.subcategoryId);
  }
  return list;
});

export const loadProductBySlug = cache(async (slug: string) => {
  return getProductBySlug(slug);
});

export const loadNews = cache(async () => {
  return getNews(false);
});

export const loadNewsItem = cache(async (slug: string) => {
  return getNewsBySlug(slug);
});

export const loadAllNewsSlugs = cache(async () => {
  return (await getNews(false)).map((n) => n.slug);
});

export const loadCareers = cache(async () => {
  return getCareers(false);
});

export const loadCareerBySlug = cache(async (slug: string) => {
  return getCareerBySlug(slug);
});

/** Active hero banners for homepage */
export const loadBanners = cache(async () => {
  return getBanners(false);
});

