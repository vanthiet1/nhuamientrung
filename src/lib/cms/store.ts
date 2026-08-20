import { createServiceClient } from "@/lib/supabase/admin";
import { getOrSetCache, clearCmsCache } from "@/lib/cache";
import type {
  CategoryRecord,
  SubcategoryRecord,
  ProductRecord,
  NewsRecord,
  CareerRecord,
  ContactMessageRecord,
  BannerRecord,
  CategoryTree,
  QuoteRequestRecord,
} from "./types";

function toCamel(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      res[camelKey] = toCamel(obj[key]);
    }
    return res;
  }
  return obj;
}

function toSnake(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnake);
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      res[snakeKey] = toSnake(obj[key]);
    }
    return res;
  }
  return obj;
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Categories ──
export async function getCategories(): Promise<CategoryRecord[]> {
  return getOrSetCache("cms:categories:all", async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return toCamel(data);
  });
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toCamel(data) : null;
}

export async function createCategory(input: Partial<CategoryRecord> & { name: string }) {
  const supabase = createServiceClient();
  const slug = input.slug?.trim() || slugify(input.name);
  const snakeInput = toSnake({ ...input, slug, name: input.name.trim() });
  const { data, error } = await supabase.from('categories').insert(snakeInput).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function updateCategory(id: string, input: Partial<CategoryRecord>) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  snakeInput.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('categories').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function deleteCategory(id: string) {
  const supabase = createServiceClient();
  
  const { count: subCount } = await supabase.from('subcategories').select('*', { count: 'exact', head: true }).eq('category_id', id);
  if (subCount && subCount > 0) throw new Error('Không thể xóa danh mục này vì vẫn còn danh mục con.');

  const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category_id', id);
  if (prodCount && prodCount > 0) throw new Error('Không thể xóa danh mục này vì vẫn còn sản phẩm.');

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await clearCmsCache();
}

// ── Subcategories ──
export async function getSubcategories(): Promise<SubcategoryRecord[]> {
  return getOrSetCache("cms:subcategories:all", async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('subcategories').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return toCamel(data);
  });
}

export async function getSubcategoryById(id: string): Promise<SubcategoryRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('subcategories').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toCamel(data) : null;
}

export async function createSubcategory(input: Partial<SubcategoryRecord> & { name: string; categoryId: string }) {
  const supabase = createServiceClient();
  const slug = input.slug?.trim() || slugify(input.name);
  const snakeInput = toSnake({ ...input, slug, name: input.name.trim() });
  const { data, error } = await supabase.from('subcategories').insert(snakeInput).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function updateSubcategory(id: string, input: Partial<SubcategoryRecord>) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  snakeInput.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('subcategories').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function deleteSubcategory(id: string) {
  const supabase = createServiceClient();

  const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('subcategory_id', id);
  if (prodCount && prodCount > 0) throw new Error('Không thể xóa danh mục con này vì vẫn còn sản phẩm.');

  const { error } = await supabase.from('subcategories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await clearCmsCache();
}

// ── Products ──
export async function getProducts(): Promise<ProductRecord[]> {
  return getOrSetCache("cms:products:all", async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return toCamel(data);
  });
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toCamel(data) : null;
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  return getOrSetCache(`cms:product:${slug}`, async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).maybeSingle();
    if (error) throw error;
    return data ? toCamel(data) : null;
  });
}

export async function createProduct(input: Partial<ProductRecord> & { name: string; categoryId: string }) {
  const supabase = createServiceClient();
  const slug = input.slug?.trim() || slugify(input.name);
  const snakeInput = toSnake({ ...input, slug, name: input.name.trim() });
  const { data, error } = await supabase.from('products').insert(snakeInput).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function updateProduct(id: string, input: Partial<ProductRecord>) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  snakeInput.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('products').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function deleteProduct(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await clearCmsCache();
}

export async function incrementProductView(id: string, ip: string) {
  // Supabase implementation can use a dedicated views table or RPC
  // For simplicity, we just increment the views column
  const supabase = createServiceClient();
  const { data: product, error: fetchErr } = await supabase.from('products').select('views').eq('id', id).maybeSingle();
  if (fetchErr || !product) return false;
  
  const currentViews = product.views || 0;
  await supabase.from('products').update({ views: currentViews + 1 }).eq('id', id);
  return true;
}

// ── News ──
export async function getNews(includeDraft = true): Promise<NewsRecord[]> {
  const cacheKey = includeDraft ? "cms:news:all" : "cms:news:published";
  return getOrSetCache(cacheKey, async () => {
    const supabase = createServiceClient();
    let query = supabase.from('news').select('*').order('sort_order', { ascending: true });
    if (!includeDraft) {
      query = query.eq('is_published', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    return toCamel(data).map((n: any) => ({ ...n, date: n.publishedAt }));
  });
}

export async function getNewsById(id: string): Promise<NewsRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('news').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const camel = toCamel(data);
  camel.date = camel.publishedAt;
  return camel;
}

export async function getNewsBySlug(slug: string): Promise<NewsRecord | null> {
  return getOrSetCache(`cms:news:${slug}`, async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('news').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const camel = toCamel(data);
    camel.date = camel.publishedAt;
    return camel;
  });
}

export async function createNews(input: Partial<NewsRecord> & { title: string }) {
  const supabase = createServiceClient();
  const slug = input.slug?.trim() || slugify(input.title);
  const snakeInput = toSnake({ ...input, slug, title: input.title.trim() });
  if (snakeInput.date) {
    snakeInput.published_at = snakeInput.date;
    delete snakeInput.date;
  }
  const { data, error } = await supabase.from('news').insert(snakeInput).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  const camel = toCamel(data);
  camel.date = camel.publishedAt;
  return camel;
}

export async function updateNews(id: string, input: Partial<NewsRecord>) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  if (snakeInput.date) {
    snakeInput.published_at = snakeInput.date;
    delete snakeInput.date;
  }
  snakeInput.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('news').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  const camel = toCamel(data);
  camel.date = camel.publishedAt;
  return camel;
}

export async function deleteNews(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await clearCmsCache();
}

// ── Careers ──
export async function getCareers(includeInactive = true): Promise<CareerRecord[]> {
  const cacheKey = includeInactive ? "cms:careers:all" : "cms:careers:active";
  return getOrSetCache(cacheKey, async () => {
    const supabase = createServiceClient();
    let query = supabase.from('careers').select('*').order('sort_order', { ascending: true });
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("Careers table error", error.message);
      return [];
    }
    const result = toCamel(data);
    result.forEach((r: any) => {
      if (typeof r.requirements === 'string') {
        try {
          const parsed = JSON.parse(r.requirements);
          r.requirements = Array.isArray(parsed) ? parsed : [r.requirements];
        } catch {
          r.requirements = [r.requirements];
        }
      } else if (!Array.isArray(r.requirements)) {
        r.requirements = [];
      }
    });
    return result;
  });
}

export async function getCareerById(id: string): Promise<CareerRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('careers').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const result = toCamel(data);
  if (typeof result.requirements === 'string') {
    try {
      const parsed = JSON.parse(result.requirements);
      result.requirements = Array.isArray(parsed) ? parsed : [result.requirements];
    } catch {
      result.requirements = [result.requirements];
    }
  } else if (!Array.isArray(result.requirements)) {
    result.requirements = [];
  }
  return result;
}

export async function getCareerBySlug(slug: string): Promise<CareerRecord | null> {
  return getOrSetCache(`cms:career:${slug}`, async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('careers').select('*').eq('slug', slug).eq('is_active', true).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const result = toCamel(data);
    if (typeof result.requirements === 'string') {
      try {
        const parsed = JSON.parse(result.requirements);
        result.requirements = Array.isArray(parsed) ? parsed : [result.requirements];
      } catch {
        result.requirements = [result.requirements];
      }
    } else if (!Array.isArray(result.requirements)) {
      result.requirements = [];
    }
    return result;
  });
}

export async function createCareer(input: Partial<CareerRecord> & { title: string }) {
  const supabase = createServiceClient();
  const slug = input.slug?.trim() || slugify(input.title);
  const snakeInput = toSnake({ ...input, slug, title: input.title.trim() });
  const { data, error } = await supabase.from('careers').insert(snakeInput).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function updateCareer(id: string, input: Partial<CareerRecord>) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  snakeInput.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('careers').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function deleteCareer(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('careers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await clearCmsCache();
}

// ── Contact Messages ──
export async function getContactMessages(): Promise<ContactMessageRecord[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return toCamel(data);
}

export async function getContactMessageById(id: string): Promise<ContactMessageRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('contact_messages').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toCamel(data) : null;
}

export async function createContactMessage(
  input: Omit<ContactMessageRecord, "id" | "createdAt" | "isRead"> & {
    isRead?: boolean;
    remoteId?: number | string | null;
  }
) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  const { data, error } = await supabase.from('contact_messages').insert(snakeInput).select().single();
  if (error) throw new Error(error.message);
  return toCamel(data);
}

export async function updateContactMessage(
  id: string,
  input: Partial<Pick<ContactMessageRecord, "isRead" | "remoteId">>
) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  const { data, error } = await supabase.from('contact_messages').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return toCamel(data);
}

export async function deleteContactMessage(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function countUnreadContactMessages() {
  const supabase = createServiceClient();
  const { count, error } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
  if (error) throw error;
  return count || 0;
}

// ── Quote Requests ──
export async function getQuoteRequests(): Promise<QuoteRequestRecord[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return toCamel(data);
}

export async function getQuoteRequestById(id: string): Promise<QuoteRequestRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('quote_requests').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toCamel(data) : null;
}

export async function createQuoteRequest(
  input: Omit<QuoteRequestRecord, "id" | "createdAt" | "isRead" | "status"> & {
    isRead?: boolean;
    status?: string;
  }
) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  const { data, error } = await supabase.from('quote_requests').insert(snakeInput).select().single();
  if (error) throw new Error(error.message);
  return toCamel(data);
}

export async function updateQuoteRequest(
  id: string,
  input: Partial<Pick<QuoteRequestRecord, "isRead" | "status">>
) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  const { data, error } = await supabase.from('quote_requests').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return toCamel(data);
}

export async function deleteQuoteRequest(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('quote_requests').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function countUnreadQuoteRequests() {
  const supabase = createServiceClient();
  const { count, error } = await supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('is_read', false);
  if (error) throw error;
  return count || 0;
}


// ── Banners ──
export async function getBanners(includeInactive = true): Promise<BannerRecord[]> {
  const cacheKey = includeInactive ? "cms:banners:all" : "cms:banners:active";
  return getOrSetCache(cacheKey, async () => {
    const supabase = createServiceClient();
    let query = supabase.from('banners').select('*').order('sort_order', { ascending: true });
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("Banners table error", error.message);
      return [];
    }
    return toCamel(data);
  });
}

export async function getBannerById(id: string): Promise<BannerRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('banners').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toCamel(data) : null;
}

export async function createBanner(input: Partial<BannerRecord> & { title: string }) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  const { data, error } = await supabase.from('banners').insert(snakeInput).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function updateBanner(id: string, input: Partial<BannerRecord>) {
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  snakeInput.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('banners').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  await clearCmsCache();
  return toCamel(data);
}

export async function deleteBanner(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await clearCmsCache();
}

// ── Public Helpers ──
export async function getCategoryTree(): Promise<CategoryTree[]> {
  const cats = await getCategories();
  const subs = await getSubcategories();
  return cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    children: subs
      .filter((s) => s.categoryId === c.id)
      .map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        description: s.description,
      })),
  }));
}

export async function findCategoryOrSub(slug: string) {
  const cats = await getCategories();
  const subs = await getSubcategories();
  const cat = cats.find((c) => c.slug === slug);
  if (cat) {
    return {
      type: "category" as const,
      category: cat,
      children: subs.filter((s) => s.categoryId === cat.id),
    };
  }
  const sub = subs.find((s) => s.slug === slug);
  if (sub) {
    const parent = cats.find((c) => c.id === sub.categoryId) || null;
    return { type: "subcategory" as const, subcategory: sub, parent };
  }
  return null;
}
