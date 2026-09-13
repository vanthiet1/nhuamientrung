import { createServiceClient } from "@/lib/supabase/admin";
import { getOrSetCache, clearCmsCache } from "@/lib/cache";
import fs from "fs";
import path from "path";

// Thời điểm Supabase reset chu kỳ gói cước (4 ngày kể từ 13/09/2026 -> 17/09/2026):
const SUPABASE_RESET_TIMESTAMP = new Date("2026-09-17T12:00:00.000Z").getTime();

export function isSupabaseOnline(): boolean {
  if (process.env.FORCE_SUPABASE_ONLINE === "true") return true;
  // Trong 4 ngày chờ Supabase reset hạn mức: dùng trực tiếp JSON offline để tránh lỗi 402 và tiết kiệm 100% băng thông
  if (Date.now() < SUPABASE_RESET_TIMESTAMP) {
    return false;
  }
  return true;
}

type OfflineDatabase = {
  categories: CategoryRecord[];
  subcategories: SubcategoryRecord[];
  products: ProductRecord[];
  news: NewsRecord[];
  banners: BannerRecord[];
  careers: CareerRecord[];
  contactMessages?: ContactMessageRecord[];
  quoteRequests?: QuoteRequestRecord[];
  reviews?: any[];
};

let cachedOfflineDb: OfflineDatabase | null = null;

export function getOfflineDb(): OfflineDatabase | null {
  if (cachedOfflineDb && process.env.NODE_ENV === "production") return cachedOfflineDb;
  try {
    const p = path.join(process.cwd(), "data/offline-database.json");
    if (fs.existsSync(p)) {
      cachedOfflineDb = JSON.parse(fs.readFileSync(p, "utf8")) as OfflineDatabase;
      return cachedOfflineDb;
    }
  } catch (e) {
    console.warn("Lỗi đọc data/offline-database.json:", e);
  }
  return null;
}

export function saveOfflineDb(db: OfflineDatabase) {
  try {
    const p = path.join(process.cwd(), "data/offline-database.json");
    fs.writeFileSync(p, JSON.stringify(db, null, 2), "utf8");
    cachedOfflineDb = db;
  } catch (e) {
    console.warn("Lỗi lưu data/offline-database.json:", e);
  }
}
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
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.categories || [];
  }

  return getOrSetCache("cms:categories:all", async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (error) {
      console.warn("[Supabase getCategories error]:", error.message || error);
      return offline?.categories || [];
    }
    return toCamel(data);
  });
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.categories.find((c) => c.id === id) || null;
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();
  if (error) {
    return offline?.categories.find((c) => c.id === id) || null;
  }
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
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.subcategories || [];
  }

  return getOrSetCache("cms:subcategories:all", async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('subcategories').select('*').order('sort_order', { ascending: true });
    if (error) {
      console.warn("[Supabase getSubcategories error]:", error.message || error);
      return offline?.subcategories || [];
    }
    return toCamel(data);
  });
}

export async function getSubcategoryById(id: string): Promise<SubcategoryRecord | null> {
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.subcategories.find((s) => s.id === id) || null;
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('subcategories').select('*').eq('id', id).maybeSingle();
  if (error) {
    return offline?.subcategories.find((s) => s.id === id) || null;
  }
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
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.products || [];
  }

  return getOrSetCache("cms:products:all", async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    if (error) {
      console.warn("[Supabase getProducts error]:", error.message || error);
      return offline?.products || [];
    }
    return toCamel(data);
  });
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.products.find((p) => p.id === id) || null;
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error) {
    return offline?.products.find((p) => p.id === id) || null;
  }
  return data ? toCamel(data) : null;
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.products.find((p) => p.slug === slug) || null;
  }

  return getOrSetCache(`cms:product:${slug}`, async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).maybeSingle();
    if (error) {
      console.warn(`[Supabase getProductBySlug(${slug}) error]:`, error.message || error);
      return offline?.products.find((p) => p.slug === slug) || null;
    }
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
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    const list = offline?.news || [];
    return includeDraft ? list : list.filter((n) => n.isPublished);
  }

  const cacheKey = includeDraft ? "cms:news:all" : "cms:news:published";
  return getOrSetCache(cacheKey, async () => {
    const supabase = createServiceClient();
    let query = supabase.from('news').select('*').order('sort_order', { ascending: true });
    if (!includeDraft) {
      query = query.eq('is_published', true);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("[Supabase getNews error]:", error.message || error);
      const list = offline?.news || [];
      return includeDraft ? list : list.filter((n) => n.isPublished);
    }
    return toCamel(data).map((n: any) => ({ ...n, date: n.publishedAt }));
  });
}

export async function getNewsById(id: string): Promise<NewsRecord | null> {
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.news.find((n) => n.id === id) || null;
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('news').select('*').eq('id', id).maybeSingle();
  if (error || !data) {
    return offline?.news.find((n) => n.id === id) || null;
  }
  const camel = toCamel(data);
  camel.date = camel.publishedAt;
  return camel;
}

export async function getNewsBySlug(slug: string): Promise<NewsRecord | null> {
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.news.find((n) => n.slug === slug) || null;
  }

  return getOrSetCache(`cms:news:${slug}`, async () => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('news').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
    if (error) {
      console.warn(`[Supabase getNewsBySlug(${slug}) error]:`, error.message || error);
      return offline?.news.find((n) => n.slug === slug) || null;
    }
    if (!data) return offline?.news.find((n) => n.slug === slug) || null;
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
    if (!isSupabaseOnline()) {
      const db = getOfflineDb();
      const list = (db?.careers || []) as CareerRecord[];
      return includeInactive ? list : list.filter(c => c.isActive);
    }
    const supabase = createServiceClient();
    let query = supabase.from('careers').select('*').order('sort_order', { ascending: true });
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("Careers table error", error.message);
      const db = getOfflineDb();
      const list = (db?.careers || []) as CareerRecord[];
      return includeInactive ? list : list.filter(c => c.isActive);
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
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    return (db?.careers || []).find(c => c.id === id) || null;
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('careers').select('*').eq('id', id).maybeSingle();
  if (error) {
    const db = getOfflineDb();
    return (db?.careers || []).find(c => c.id === id) || null;
  }
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
    if (!isSupabaseOnline()) {
      const db = getOfflineDb();
      return (db?.careers || []).find(c => c.slug === slug && c.isActive) || null;
    }
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('careers').select('*').eq('slug', slug).eq('is_active', true).maybeSingle();
    if (error) {
      const db = getOfflineDb();
      return (db?.careers || []).find(c => c.slug === slug && c.isActive) || null;
    }
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
  if (!isSupabaseOnline()) {
    return getOfflineDb()?.contactMessages || [];
  }
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn("Contact messages table error:", error.message);
      return getOfflineDb()?.contactMessages || [];
    }
    return toCamel(data);
  } catch {
    return getOfflineDb()?.contactMessages || [];
  }
}

export async function getContactMessageById(id: string): Promise<ContactMessageRecord | null> {
  if (!isSupabaseOnline()) {
    return getOfflineDb()?.contactMessages?.find(c => c.id === id) || null;
  }
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('contact_messages').select('*').eq('id', id).maybeSingle();
    if (error) return getOfflineDb()?.contactMessages?.find(c => c.id === id) || null;
    return data ? toCamel(data) : null;
  } catch {
    return getOfflineDb()?.contactMessages?.find(c => c.id === id) || null;
  }
}

export async function createContactMessage(
  input: Omit<ContactMessageRecord, "id" | "createdAt" | "isRead"> & {
    isRead?: boolean;
    remoteId?: number | string | null;
  }
) {
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    const newMsg: ContactMessageRecord = {
      id: "msg-" + Date.now(),
      name: input.name,
      email: input.email || "",
      phone: input.phone,
      subject: input.subject || "",
      content: input.content || "",
      type: input.type || "contact",
      cvUrl: input.cvUrl || "",
      cvFileName: input.cvFileName || "",
      isRead: input.isRead || false,
      createdAt: new Date().toISOString(),
      remoteId: input.remoteId || null,
    };
    if (db) {
      db.contactMessages = db.contactMessages || [];
      db.contactMessages.unshift(newMsg);
      saveOfflineDb(db);
    }
    return newMsg;
  }
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
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    if (db?.contactMessages) {
      const item = db.contactMessages.find(c => c.id === id);
      if (item) {
        Object.assign(item, input);
        saveOfflineDb(db);
        return item;
      }
    }
  }
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  const { data, error } = await supabase.from('contact_messages').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return toCamel(data);
}

export async function deleteContactMessage(id: string) {
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    if (db?.contactMessages) {
      db.contactMessages = db.contactMessages.filter(c => c.id !== id);
      saveOfflineDb(db);
      return;
    }
  }
  const supabase = createServiceClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function countUnreadContactMessages() {
  if (!isSupabaseOnline()) {
    return (getOfflineDb()?.contactMessages || []).filter(c => !c.isRead).length;
  }
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
    if (error) return (getOfflineDb()?.contactMessages || []).filter(c => !c.isRead).length;
    return count || 0;
  } catch {
    return (getOfflineDb()?.contactMessages || []).filter(c => !c.isRead).length;
  }
}

// ── Quote Requests ──
export async function getQuoteRequests(): Promise<QuoteRequestRecord[]> {
  if (!isSupabaseOnline()) {
    return getOfflineDb()?.quoteRequests || [];
  }
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn("Quote requests table error:", error.message);
      return getOfflineDb()?.quoteRequests || [];
    }
    return toCamel(data);
  } catch {
    return getOfflineDb()?.quoteRequests || [];
  }
}

export async function getQuoteRequestById(id: string): Promise<QuoteRequestRecord | null> {
  if (!isSupabaseOnline()) {
    return getOfflineDb()?.quoteRequests?.find(q => q.id === id) || null;
  }
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('quote_requests').select('*').eq('id', id).maybeSingle();
    if (error) return getOfflineDb()?.quoteRequests?.find(q => q.id === id) || null;
    return data ? toCamel(data) : null;
  } catch {
    return getOfflineDb()?.quoteRequests?.find(q => q.id === id) || null;
  }
}

export async function createQuoteRequest(
  input: Omit<QuoteRequestRecord, "id" | "createdAt" | "isRead" | "status"> & {
    isRead?: boolean;
    status?: string;
  }
) {
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    const newQuote: QuoteRequestRecord = {
      id: "quote-" + Date.now(),
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      companyName: input.companyName || null,
      productType: input.productType || "",
      industry: input.industry || null,
      quantityExpected: input.quantityExpected || "",
      dimensions: input.dimensions || null,
      material: input.material || null,
      printColors: input.printColors || null,
      deadline: input.deadline || null,
      deliveryDestination: input.deliveryDestination || "",
      details: input.details || null,
      referenceFileUrl: input.referenceFileUrl || null,
      referenceFileName: input.referenceFileName || null,
      status: (input.status as any) || "pending",
      isRead: input.isRead || false,
      createdAt: new Date().toISOString(),
    };
    if (db) {
      db.quoteRequests = db.quoteRequests || [];
      db.quoteRequests.unshift(newQuote);
      saveOfflineDb(db);
    }
    return newQuote;
  }
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
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    if (db?.quoteRequests) {
      const item = db.quoteRequests.find(q => q.id === id);
      if (item) {
        Object.assign(item, input);
        saveOfflineDb(db);
        return item;
      }
    }
  }
  const supabase = createServiceClient();
  const snakeInput = toSnake(input);
  const { data, error } = await supabase.from('quote_requests').update(snakeInput).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return toCamel(data);
}

export async function deleteQuoteRequest(id: string) {
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    if (db?.quoteRequests) {
      db.quoteRequests = db.quoteRequests.filter(q => q.id !== id);
      saveOfflineDb(db);
      return;
    }
  }
  const supabase = createServiceClient();
  const { error } = await supabase.from('quote_requests').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function countUnreadQuoteRequests() {
  if (!isSupabaseOnline()) {
    return (getOfflineDb()?.quoteRequests || []).filter(q => !q.isRead).length;
  }
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('is_read', false);
    if (error) return (getOfflineDb()?.quoteRequests || []).filter(q => !q.isRead).length;
    return count || 0;
  } catch {
    return (getOfflineDb()?.quoteRequests || []).filter(q => !q.isRead).length;
  }
}


// ── Banners ──
export async function getBanners(includeInactive = true): Promise<BannerRecord[]> {
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    const list = offline?.banners || [];
    return includeInactive ? list : list.filter((b) => b.isActive);
  }

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
      const list = offline?.banners || [];
      return includeInactive ? list : list.filter((b) => b.isActive);
    }
    return toCamel(data);
  });
}

export async function getBannerById(id: string): Promise<BannerRecord | null> {
  const offline = getOfflineDb();
  if (!isSupabaseOnline()) {
    return offline?.banners.find((b) => b.id === id) || null;
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('banners').select('*').eq('id', id).maybeSingle();
  if (error) {
    return offline?.banners.find((b) => b.id === id) || null;
  }
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
