import {
  getCategories,
  getNews,
  getProducts,
  getSubcategories,
} from "@/lib/cms/store";

export type SearchHit = {
  type: "product" | "news" | "category" | "subcategory";
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  image?: string;
};

function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d");
}

function score(query: string, fields: string[]) {
  const q = norm(query);
  if (!q) return 0;
  const tokens = q.split(/\s+/).filter(Boolean);
  let s = 0;
  const hay = fields.map(norm).join(" | ");
  if (hay.includes(q)) s += 50;
  for (const t of tokens) {
    if (hay.includes(t)) s += 10;
  }
  // title-ish first field boost
  const title = norm(fields[0] || "");
  if (title.startsWith(q)) s += 30;
  if (title.includes(q)) s += 15;
  return s;
}

export async function searchSite(query: string, limit = 40): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q || q.length < 1) return [];

  const [products, news, categories, subcategories] = await Promise.all([
    getProducts(),
    getNews(false),
    getCategories(),
    getSubcategories(),
  ]);

  const hits: (SearchHit & { _score: number })[] = [];

  for (const p of products.filter((x) => x.isActive)) {
    const sc = score(q, [p.name, p.slug, p.description, p.content, p.sku || ""]);
    if (sc > 0) {
      hits.push({
        type: "product",
        id: p.id,
        slug: p.slug,
        title: p.name,
        description: p.description || p.sku || "",
        href: `/san-pham/${p.slug}`,
        image: p.image,
        _score: sc + 5, // slight product boost
      });
    }
  }

  for (const n of news) {
    const sc = score(q, [n.title, n.slug, n.excerpt, n.content]);
    if (sc > 0) {
      hits.push({
        type: "news",
        id: n.id,
        slug: n.slug,
        title: n.title,
        description: n.excerpt,
        href: `/tin-tuc/${n.slug}`,
        image: n.image,
        _score: sc,
      });
    }
  }

  for (const c of categories) {
    const sc = score(q, [c.name, c.slug, c.description]);
    if (sc > 0) {
      hits.push({
        type: "category",
        id: c.id,
        slug: c.slug,
        title: c.name,
        description: c.description,
        href: `/danh-muc/${c.slug}`,
        _score: sc + 2,
      });
    }
  }

  for (const s of subcategories) {
    const sc = score(q, [s.name, s.slug, s.description]);
    if (sc > 0) {
      hits.push({
        type: "subcategory",
        id: s.id,
        slug: s.slug,
        title: s.name,
        description: s.description,
        href: `/danh-muc/${s.slug}`,
        _score: sc + 1,
      });
    }
  }

  hits.sort((a, b) => b._score - a._score);
  return hits.slice(0, limit).map(({ _score, ...rest }) => rest);
}
