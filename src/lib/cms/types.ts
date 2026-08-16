export type CategoryRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type SubcategoryRecord = {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  content: string;
  categoryId: string;
  subcategoryId: string | null;
  image: string;
  images?: string[];
  /** Mã sản phẩm (SKU) */
  sku: string;
  price?: string;
  views?: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type NewsRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CareerRecord = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/** Loại yêu cầu form liên hệ */
export type ContactRequestType = "contact" | "career";

/** Yêu cầu liên hệ từ form website */
export type ContactMessageRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  content: string;
  /** contact = liên hệ thường | career = gửi CV tuyển dụng */
  type: ContactRequestType;
  /** URL file CV (PDF) nếu type = career */
  cvUrl: string;
  cvFileName: string;
  isRead: boolean;
  createdAt: string;
  /** id từ Supabase nếu có */
  remoteId?: number | string | null;
};

/** Banner hero trang chủ */
export type BannerRecord = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  cta: string;
  href: string;
  /** Ảnh nền (upload Storage hoặc URL) */
  image: string;
  /** Tailwind gradient fallback khi không có ảnh */
  gradient: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/** Shape used by public site navigation (tree) */
export type CategoryTree = {
  slug: string;
  name: string;
  description: string;
  id?: string;
  children?: CategoryTree[];
};

export type ProductReviewRecord = {
  id: string;
  product_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  content: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

export type QuoteRequestRecord = {
  id: string;
  name: string;
  companyName: string | null;
  phone: string;
  email: string | null;
  productType: string;
  industry: string | null;
  quantityExpected: string;
  dimensions: string | null;
  material: string | null;
  printColors: string | null;
  deadline: string | null;
  deliveryDestination: string;
  details: string | null;
  referenceFileUrl: string | null;
  referenceFileName: string | null;
  status: "pending" | "contacted" | "quoted" | "rejected";
  isRead: boolean;
  createdAt: string;
};

