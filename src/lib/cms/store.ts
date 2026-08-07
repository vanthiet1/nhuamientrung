import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  CategoryRecord,
  SubcategoryRecord,
  ProductRecord,
  NewsRecord,
  CareerRecord,
  ContactMessageRecord,
  BannerRecord,
  CategoryTree,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  const full = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(full, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await ensureDir();
  const full = path.join(DATA_DIR, file);
  await fs.writeFile(full, JSON.stringify(data, null, 2), "utf8");
}

function slugify(input: string) {
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

function now() {
  return new Date().toISOString();
}

// ── Categories ──

export async function getCategories() {
  const list = await readJson<CategoryRecord[]>("categories.json", []);
  return list.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryById(id: string) {
  return (await getCategories()).find((c) => c.id === id) || null;
}

export async function createCategory(
  input: Partial<CategoryRecord> & { name: string }
) {
  const list = await getCategories();
  const slug = input.slug?.trim() || slugify(input.name);
  if (list.some((c) => c.slug === slug)) {
    throw new Error("Slug danh mục đã tồn tại");
  }
  const item: CategoryRecord = {
    id: randomUUID(),
    slug,
    name: input.name.trim(),
    description: (input.description || "").trim(),
    sortOrder: input.sortOrder ?? list.length,
    createdAt: now(),
    updatedAt: now(),
  };
  list.push(item);
  await writeJson("categories.json", list);
  return item;
}

export async function updateCategory(id: string, input: Partial<CategoryRecord>) {
  const list = await getCategories();
  const idx = list.findIndex((c) => c.id === id);
  if (idx < 0) throw new Error("Không tìm thấy danh mục");
  const slug = input.slug?.trim() || list[idx].slug;
  if (list.some((c) => c.slug === slug && c.id !== id)) {
    throw new Error("Slug danh mục đã tồn tại");
  }
  list[idx] = {
    ...list[idx],
    ...input,
    slug,
    name: input.name?.trim() ?? list[idx].name,
    description: input.description?.trim() ?? list[idx].description,
    updatedAt: now(),
  };
  await writeJson("categories.json", list);
  return list[idx];
}

export async function deleteCategory(id: string) {
  const list = await getCategories();
  const next = list.filter((c) => c.id !== id);
  if (next.length === list.length) throw new Error("Không tìm thấy danh mục");
  await writeJson("categories.json", next);

  const subs = await getSubcategories();
  await writeJson(
    "subcategories.json",
    subs.filter((s) => s.categoryId !== id)
  );

  const products = await getProducts();
  await writeJson(
    "products.json",
    products.filter((p) => p.categoryId !== id)
  );
}

// ── Subcategories ──

export async function getSubcategories() {
  const list = await readJson<SubcategoryRecord[]>("subcategories.json", []);
  return list.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getSubcategoryById(id: string) {
  return (await getSubcategories()).find((s) => s.id === id) || null;
}

export async function createSubcategory(
  input: Partial<SubcategoryRecord> & { name: string; categoryId: string }
) {
  const list = await getSubcategories();
  const cats = await getCategories();
  if (!cats.some((c) => c.id === input.categoryId)) {
    throw new Error("Danh mục cha không tồn tại");
  }
  const slug = input.slug?.trim() || slugify(input.name);
  if (list.some((s) => s.slug === slug)) {
    throw new Error("Slug danh mục con đã tồn tại");
  }
  const item: SubcategoryRecord = {
    id: randomUUID(),
    categoryId: input.categoryId,
    slug,
    name: input.name.trim(),
    description: (input.description || "").trim(),
    sortOrder:
      input.sortOrder ??
      list.filter((s) => s.categoryId === input.categoryId).length,
    createdAt: now(),
    updatedAt: now(),
  };
  list.push(item);
  await writeJson("subcategories.json", list);
  return item;
}

export async function updateSubcategory(
  id: string,
  input: Partial<SubcategoryRecord>
) {
  const list = await getSubcategories();
  const idx = list.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error("Không tìm thấy danh mục con");
  const slug = input.slug?.trim() || list[idx].slug;
  if (list.some((s) => s.slug === slug && s.id !== id)) {
    throw new Error("Slug danh mục con đã tồn tại");
  }
  if (input.categoryId) {
    const cats = await getCategories();
    if (!cats.some((c) => c.id === input.categoryId)) {
      throw new Error("Danh mục cha không tồn tại");
    }
  }
  list[idx] = {
    ...list[idx],
    ...input,
    slug,
    name: input.name?.trim() ?? list[idx].name,
    description: input.description?.trim() ?? list[idx].description,
    updatedAt: now(),
  };
  await writeJson("subcategories.json", list);
  return list[idx];
}

export async function deleteSubcategory(id: string) {
  const list = await getSubcategories();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) throw new Error("Không tìm thấy danh mục con");
  await writeJson("subcategories.json", next);

  const products = await getProducts();
  await writeJson(
    "products.json",
    products.map((p) =>
      p.subcategoryId === id ? { ...p, subcategoryId: null, updatedAt: now() } : p
    )
  );
}

// ── Products ──

export async function getProducts() {
  const list = await readJson<ProductRecord[]>("products.json", []);
  // normalize legacy rows missing sku
  return list
    .map((p) => ({
      ...p,
      sku: p.sku ?? "",
      image: p.image ?? "",
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProductById(id: string) {
  return (await getProducts()).find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug && p.isActive) || null;
}

export async function createProduct(
  input: Partial<ProductRecord> & { name: string; categoryId: string }
) {
  const list = await getProducts();
  const cats = await getCategories();
  if (!cats.some((c) => c.id === input.categoryId)) {
    throw new Error("Danh mục không tồn tại");
  }
  if (input.subcategoryId) {
    const subs = await getSubcategories();
    const sub = subs.find((s) => s.id === input.subcategoryId);
    if (!sub || sub.categoryId !== input.categoryId) {
      throw new Error("Danh mục con không hợp lệ");
    }
  }
  const slug = input.slug?.trim() || slugify(input.name);
  if (list.some((p) => p.slug === slug)) {
    throw new Error("Slug sản phẩm đã tồn tại");
  }
  const sku = (input.sku || "").trim();
  if (sku && list.some((p) => (p.sku || "").toLowerCase() === sku.toLowerCase())) {
    throw new Error("Mã sản phẩm đã tồn tại");
  }

  const item: ProductRecord = {
    id: randomUUID(),
    slug,
    name: input.name.trim(),
    description: (input.description || "").trim(),
    content: (input.content || input.description || "").trim(),
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId || null,
    image: input.image || "",
    sku,
    price: (input.price || "Liên hệ").trim(),
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? list.length,
    createdAt: now(),
    updatedAt: now(),
  };
  list.push(item);
  await writeJson("products.json", list);
  return item;
}

export async function updateProduct(id: string, input: Partial<ProductRecord>) {
  const list = await getProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx < 0) throw new Error("Không tìm thấy sản phẩm");
  const slug = input.slug?.trim() || list[idx].slug;
  if (list.some((p) => p.slug === slug && p.id !== id)) {
    throw new Error("Slug sản phẩm đã tồn tại");
  }
  const nextSku =
    input.sku !== undefined ? String(input.sku).trim() : list[idx].sku || "";
  if (
    nextSku &&
    list.some(
      (p) =>
        p.id !== id &&
        (p.sku || "").toLowerCase() === nextSku.toLowerCase()
    )
  ) {
    throw new Error("Mã sản phẩm đã tồn tại");
  }
  list[idx] = {
    ...list[idx],
    ...input,
    slug,
    name: input.name?.trim() ?? list[idx].name,
    description: input.description?.trim() ?? list[idx].description,
    content: input.content?.trim() ?? list[idx].content,
    sku: nextSku,
    image:
      input.image !== undefined ? String(input.image) : list[idx].image || "",
    subcategoryId:
      input.subcategoryId === undefined
        ? list[idx].subcategoryId
        : input.subcategoryId || null,
    updatedAt: now(),
  };
  await writeJson("products.json", list);
  return list[idx];
}

export async function deleteProduct(id: string) {
  const list = await getProducts();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) throw new Error("Không tìm thấy sản phẩm");
  await writeJson("products.json", next);
}

// ── News ──

export async function getNews(includeDraft = true) {
  const list = await readJson<NewsRecord[]>("news.json", []);
  const filtered = includeDraft ? list : list.filter((n) => n.isPublished);
  // Prefer sortOrder (listing scrape order) then date desc
  return filtered.sort((a, b) => {
    const so = (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999);
    if (so !== 0) return so;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getNewsById(id: string) {
  return (await getNews(true)).find((n) => n.id === id) || null;
}

export async function getNewsBySlug(slug: string) {
  return (
    (await getNews(true)).find((n) => n.slug === slug && n.isPublished) || null
  );
}

export async function createNews(
  input: Partial<NewsRecord> & { title: string }
) {
  const list = await getNews(true);
  const slug = input.slug?.trim() || slugify(input.title);
  if (list.some((n) => n.slug === slug)) {
    throw new Error("Slug tin tức đã tồn tại");
  }
  const item: NewsRecord = {
    id: randomUUID(),
    slug,
    title: input.title.trim(),
    excerpt: (input.excerpt || "").trim(),
    content: (input.content || "").trim(),
    date: input.date || now().slice(0, 10),
    image: input.image || "",
    isPublished: input.isPublished ?? true,
    sortOrder: input.sortOrder ?? list.length,
    createdAt: now(),
    updatedAt: now(),
  };
  list.push(item);
  await writeJson("news.json", list);
  return item;
}

export async function updateNews(id: string, input: Partial<NewsRecord>) {
  const list = await getNews(true);
  const idx = list.findIndex((n) => n.id === id);
  if (idx < 0) throw new Error("Không tìm thấy tin tức");
  const slug = input.slug?.trim() || list[idx].slug;
  if (list.some((n) => n.slug === slug && n.id !== id)) {
    throw new Error("Slug tin tức đã tồn tại");
  }
  list[idx] = {
    ...list[idx],
    ...input,
    slug,
    title: input.title?.trim() ?? list[idx].title,
    excerpt: input.excerpt?.trim() ?? list[idx].excerpt,
    content: input.content?.trim() ?? list[idx].content,
    updatedAt: now(),
  };
  await writeJson("news.json", list);
  return list[idx];
}

export async function deleteNews(id: string) {
  const list = await getNews(true);
  const next = list.filter((n) => n.id !== id);
  if (next.length === list.length) throw new Error("Không tìm thấy tin tức");
  await writeJson("news.json", next);
}

// ── Careers (Tuyển dụng) ──

export async function getCareers(includeInactive = true) {
  const list = await readJson<CareerRecord[]>("careers.json", []);
  const filtered = includeInactive ? list : list.filter((j) => j.isActive);
  return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCareerById(id: string) {
  return (await getCareers(true)).find((j) => j.id === id) || null;
}

export async function getCareerBySlug(slug: string) {
  return (
    (await getCareers(true)).find((j) => j.slug === slug && j.isActive) || null
  );
}

function parseRequirements(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((r) => String(r).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);
  }
  return [];
}

export async function createCareer(
  input: Partial<CareerRecord> & { title: string } & {
    requirements?: string[] | string;
  }
) {
  const list = await getCareers(true);
  const slug = input.slug?.trim() || slugify(input.title);
  if (list.some((j) => j.slug === slug)) {
    throw new Error("Slug tuyển dụng đã tồn tại");
  }
  const requirements = parseRequirements(input.requirements);
  const item: CareerRecord = {
    id: randomUUID(),
    slug,
    title: input.title.trim(),
    location: (input.location || "Đà Nẵng").trim(),
    type: (input.type || "Toàn thời gian").trim(),
    salary: (input.salary || "Thỏa thuận").trim(),
    description: (input.description || "").trim(),
    requirements,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? list.length,
    createdAt: now(),
    updatedAt: now(),
  };
  list.push(item);
  await writeJson("careers.json", list);
  return item;
}

export async function updateCareer(
  id: string,
  input: Partial<CareerRecord> & { requirements?: string[] | string }
) {
  const list = await getCareers(true);
  const idx = list.findIndex((j) => j.id === id);
  if (idx < 0) throw new Error("Không tìm thấy tin tuyển dụng");
  const slug = input.slug?.trim() || list[idx].slug;
  if (list.some((j) => j.slug === slug && j.id !== id)) {
    throw new Error("Slug tuyển dụng đã tồn tại");
  }
  let requirements = list[idx].requirements;
  if (input.requirements !== undefined) {
    requirements = parseRequirements(input.requirements);
  }
  list[idx] = {
    ...list[idx],
    ...input,
    slug,
    title: input.title?.trim() ?? list[idx].title,
    location: input.location?.trim() ?? list[idx].location,
    type: input.type?.trim() ?? list[idx].type,
    salary: input.salary?.trim() ?? list[idx].salary,
    description: input.description?.trim() ?? list[idx].description,
    requirements,
    updatedAt: now(),
  };
  await writeJson("careers.json", list);
  return list[idx];
}

export async function deleteCareer(id: string) {
  const list = await getCareers(true);
  const next = list.filter((j) => j.id !== id);
  if (next.length === list.length) throw new Error("Không tìm thấy tin tuyển dụng");
  await writeJson("careers.json", next);
}

// ── Contact messages ──

export async function getContactMessages() {
  const list = await readJson<ContactMessageRecord[]>("contact-messages.json", []);
  // normalize legacy rows without type
  return list
    .map((m) => ({
      ...m,
      type: m.type === "career" ? ("career" as const) : ("contact" as const),
      cvUrl: m.cvUrl || "",
      cvFileName: m.cvFileName || "",
    }))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getContactMessageById(id: string) {
  return (await getContactMessages()).find((m) => m.id === id) || null;
}

export async function createContactMessage(
  input: Omit<ContactMessageRecord, "id" | "createdAt" | "isRead"> & {
    isRead?: boolean;
    remoteId?: number | string | null;
  }
) {
  const list = await getContactMessages();
  const type = input.type === "career" ? "career" : "contact";
  const item: ContactMessageRecord = {
    id: randomUUID(),
    name: (input.name || "").trim(),
    phone: (input.phone || "").trim(),
    email: (input.email || "").trim(),
    subject: (input.subject || "").trim(),
    content: (input.content || "").trim(),
    type,
    cvUrl: (input.cvUrl || "").trim(),
    cvFileName: (input.cvFileName || "").trim(),
    isRead: input.isRead ?? false,
    createdAt: now(),
    remoteId: input.remoteId ?? null,
  };
  if (!item.name) throw new Error("Họ tên là bắt buộc");
  if (!item.phone) throw new Error("Số điện thoại là bắt buộc");
  if (!item.content) throw new Error("Nội dung là bắt buộc");
  if (type === "career" && !item.cvUrl) {
    throw new Error("Vui lòng đính kèm file CV (PDF)");
  }
  list.unshift(item);
  await writeJson("contact-messages.json", list);
  return item;
}

export async function updateContactMessage(
  id: string,
  input: Partial<Pick<ContactMessageRecord, "isRead" | "remoteId">>
) {
  const list = await getContactMessages();
  const idx = list.findIndex((m) => m.id === id);
  if (idx < 0) throw new Error("Không tìm thấy yêu cầu liên hệ");
  list[idx] = { ...list[idx], ...input };
  await writeJson("contact-messages.json", list);
  return list[idx];
}

export async function deleteContactMessage(id: string) {
  const list = await getContactMessages();
  const next = list.filter((m) => m.id !== id);
  if (next.length === list.length) throw new Error("Không tìm thấy yêu cầu liên hệ");
  await writeJson("contact-messages.json", next);
}

export async function countUnreadContactMessages() {
  const list = await getContactMessages();
  return list.filter((m) => !m.isRead).length;
}

// ── Hero banners ──

const DEFAULT_BANNERS: BannerRecord[] = [
  {
    id: "default-1",
    title: "Giải pháp bao bì chuyên nghiệp",
    subtitle:
      "Màng co PVC · PE · POF · PET · Màng phức hợp — chất lượng ổn định, giao hàng toàn quốc",
    badge: "Thành Phát Bao Bì",
    cta: "Xem sản phẩm",
    href: "/san-pham",
    image: "",
    gradient: "from-brand-800 via-brand-600 to-brand-500",
    isActive: true,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "default-2",
    title: "In màng co nhiệt logo thương hiệu",
    subtitle:
      "Nâng tầm nhận diện · Bảo vệ sản phẩm · Tăng giá trị trên kệ hàng",
    badge: "In ấn branding",
    cta: "Tư vấn ngay",
    href: "/lien-he",
    image: "",
    gradient: "from-brand-800 via-brand-600 to-sky-500",
    isActive: true,
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "default-3",
    title: "Cung cấp màng co số lượng lớn",
    subtitle:
      "Giá cạnh tranh · Tư vấn chọn loại màng · Hỗ trợ doanh nghiệp sản xuất",
    badge: "B2B wholesale",
    cta: "Liên hệ báo giá",
    href: "/lien-he",
    image: "",
    gradient: "from-teal-800 via-teal-600 to-emerald-500",
    isActive: true,
    sortOrder: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

export async function getBanners(includeInactive = true) {
  const list = await readJson<BannerRecord[]>("banners.json", DEFAULT_BANNERS);
  // seed file if empty
  if (!list.length) {
    await writeJson("banners.json", DEFAULT_BANNERS);
    return DEFAULT_BANNERS.filter((b) => includeInactive || b.isActive).sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  }
  const filtered = includeInactive ? list : list.filter((b) => b.isActive);
  return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getBannerById(id: string) {
  return (await getBanners(true)).find((b) => b.id === id) || null;
}

export async function createBanner(
  input: Partial<BannerRecord> & { title: string }
) {
  const list = await getBanners(true);
  const item: BannerRecord = {
    id: randomUUID(),
    title: input.title.trim(),
    subtitle: (input.subtitle || "").trim(),
    badge: (input.badge || "").trim(),
    cta: (input.cta || "Xem thêm").trim(),
    href: (input.href || "/san-pham").trim() || "/san-pham",
    image: (input.image || "").trim(),
    gradient:
      (input.gradient || "from-brand-800 via-brand-600 to-brand-500").trim(),
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? list.length,
    createdAt: now(),
    updatedAt: now(),
  };
  if (!item.title) throw new Error("Tiêu đề banner là bắt buộc");
  list.push(item);
  await writeJson("banners.json", list);
  return item;
}

export async function updateBanner(id: string, input: Partial<BannerRecord>) {
  const list = await getBanners(true);
  const idx = list.findIndex((b) => b.id === id);
  if (idx < 0) throw new Error("Không tìm thấy banner");
  list[idx] = {
    ...list[idx],
    ...input,
    title: input.title?.trim() ?? list[idx].title,
    subtitle: input.subtitle?.trim() ?? list[idx].subtitle,
    badge: input.badge?.trim() ?? list[idx].badge,
    cta: input.cta?.trim() ?? list[idx].cta,
    href: input.href?.trim() || list[idx].href,
    image: input.image !== undefined ? String(input.image).trim() : list[idx].image,
    gradient: input.gradient?.trim() || list[idx].gradient,
    updatedAt: now(),
  };
  if (!list[idx].title) throw new Error("Tiêu đề banner là bắt buộc");
  await writeJson("banners.json", list);
  return list[idx];
}

export async function deleteBanner(id: string) {
  const list = await getBanners(true);
  const next = list.filter((b) => b.id !== id);
  if (next.length === list.length) throw new Error("Không tìm thấy banner");
  await writeJson("banners.json", next);
}

// ── Public helpers ──

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

export { slugify };
