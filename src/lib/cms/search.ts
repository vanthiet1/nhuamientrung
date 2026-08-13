import {
  getProducts,
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

  const [products] = await Promise.all([
    getProducts(),
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
        description: p.description,
        href: `/san-pham/${p.slug}`,
        image: p.image,
        _score: sc + 5,
      });
    }
  }

  hits.sort((a, b) => b._score - a._score);
  return hits.slice(0, limit).map(({ _score, ...rest }) => rest as SearchHit);
}
