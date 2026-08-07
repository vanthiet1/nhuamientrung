/**
 * Seed Supabase from data/*.json using SERVICE ROLE key.
 * Tables must already exist (run supabase/schema_and_seed.sql first,
 * or set DATABASE_URL to apply schema via psql/pg).
 *
 * Usage: node scripts/seed-supabase.mjs
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim();
    }
  }
}

loadEnv();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

if (!URL || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function rest(path, options = {}) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=minimal",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const err = new Error(
      `REST ${res.status} ${path}: ${typeof body === "object" ? JSON.stringify(body) : body}`
    );
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

async function tableExists(name) {
  try {
    await rest(`${name}?select=*&limit=1`);
    return true;
  } catch (e) {
    if (e.body?.code === "PGRST205") return false;
    // empty table still exists
    if (e.status === 200) return true;
    if (String(e.message).includes("PGRST205")) return false;
    // 200 with [] 
    return e.status !== 404;
  }
}

async function upsert(table, rows, onConflict = "id") {
  if (!rows.length) return;
  const chunk = 50;
  for (let i = 0; i < rows.length; i += chunk) {
    const part = rows.slice(i, i + chunk);
    await rest(`${table}?on_conflict=${onConflict}`, {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify(part),
    });
    console.log(`  ${table}: upserted ${Math.min(i + chunk, rows.length)}/${rows.length}`);
  }
}

function readJson(name) {
  return JSON.parse(readFileSync(resolve(root, "data", name), "utf8"));
}

async function main() {
  console.log("URL:", URL);
  const hasCategories = await tableExists("categories");
  console.log("Table categories exists:", hasCategories);

  if (!hasCategories) {
    console.error(`
❌ Bảng chưa tồn tại trên Supabase.

Secret key CHỈ dùng được cho API (insert/select) — KHÔNG chạy được CREATE TABLE.

Làm 1 trong 2 cách:

A) SQL Editor (nhanh nhất — 30 giây):
   1. Mở: https://supabase.com/dashboard/project/wlfdvgauofnyqsgizuop/sql/new
   2. Copy toàn bộ file: supabase/schema_and_seed.sql
   3. Paste → Run
   4. Chạy lại: node scripts/seed-supabase.mjs  (nếu cần seed lại)

B) Gửi Database password:
   Settings → Database → Database password
   (hoặc Connection string URI)
   rồi mình sẽ psql chạy schema giúp.
`);
    process.exit(2);
  }

  const categories = readJson("categories.json").map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description || "",
    image: c.image || "",
    sort_order: c.sortOrder ?? 0,
    is_active: true,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  }));

  const subcategories = readJson("subcategories.json").map((s) => ({
    id: s.id,
    category_id: s.categoryId,
    slug: s.slug,
    name: s.name,
    description: s.description || "",
    image: s.image || "",
    sort_order: s.sortOrder ?? 0,
    is_active: true,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  }));

  const products = readJson("products.json").map((p) => ({
    id: p.id,
    category_id: p.categoryId,
    subcategory_id: p.subcategoryId || null,
    slug: p.slug,
    name: p.name,
    description: p.description || "",
    content: p.content || "",
    sku: p.sku || "",
    image: p.image || "",
    source_url: p.source_url || p.sourceUrl || "",
    sort_order: p.sortOrder ?? 0,
    is_active: p.isActive !== false,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }));

  const news = readJson("news.json").map((n) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt || "",
    content: n.content || "",
    image: n.image || "",
    published_at: n.date,
    sort_order: n.sortOrder ?? 0,
    is_published: n.isPublished !== false,
    created_at: n.createdAt,
    updated_at: n.updatedAt,
  }));

  let careers = [];
  try {
    careers = readJson("careers.json").map((j) => ({
      id: j.id,
      slug: j.slug,
      title: j.title,
      location: j.location || "Đà Nẵng",
      type: j.type || "Toàn thời gian",
      salary: j.salary || "Thỏa thuận",
      description: j.description || "",
      requirements: j.requirements || [],
      sort_order: j.sortOrder ?? 0,
      is_active: j.isActive !== false,
      created_at: j.createdAt,
      updated_at: j.updatedAt,
    }));
  } catch {}

  console.log("Seeding...");
  await upsert("categories", categories);
  await upsert("subcategories", subcategories);
  await upsert("products", products);
  await upsert("news", news);
  if (careers.length && (await tableExists("careers"))) {
    // requirements as jsonb - send as array
    await upsert("careers", careers);
  }

  // verify counts
  for (const t of ["categories", "subcategories", "products", "news"]) {
    const rows = await rest(`${t}?select=id`, {
      headers: { Prefer: "count=exact" },
      prefer: "count=exact",
    });
    console.log(`✓ ${t}: sample ok`);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
