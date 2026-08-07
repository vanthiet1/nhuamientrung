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

export async function loadCategories(): Promise<CategoryTree[]> {
  return getCategoryTree();
}

export async function loadCategoryLookup(slug: string) {
  return findCategoryOrSub(slug);
}

export async function loadAllCategorySlugs() {
  const [cats, subs] = await Promise.all([getCategories(), getSubcategories()]);
  return [...cats.map((c) => c.slug), ...subs.map((s) => s.slug)];
}

export async function loadProducts(opts?: {
  categoryId?: string;
  subcategoryId?: string;
}) {
  let list = (await getProducts()).filter((p) => p.isActive);
  if (opts?.categoryId) {
    list = list.filter((p) => p.categoryId === opts.categoryId);
  }
  if (opts?.subcategoryId) {
    list = list.filter((p) => p.subcategoryId === opts.subcategoryId);
  }
  return list;
}

export async function loadProductBySlug(slug: string) {
  return getProductBySlug(slug);
}

export async function loadNews() {
  return getNews(false);
}

export async function loadNewsItem(slug: string) {
  return getNewsBySlug(slug);
}

export async function loadAllNewsSlugs() {
  return (await getNews(false)).map((n) => n.slug);
}

export async function loadCareers() {
  return getCareers(false);
}

export async function loadCareerBySlug(slug: string) {
  return getCareerBySlug(slug);
}

/** Active hero banners for homepage */
export async function loadBanners() {
  return getBanners(false);
}
