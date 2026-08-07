/**
 * Đẩy toàn bộ tin tức từ data/news.json lên Supabase (bảng public.news).
 *
 * Yêu cầu:
 *   - Bảng news đã tồn tại (chạy supabase/schema hoặc schema_and_seed.sql)
 *   - .env.local có NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   node scripts/seed-news-supabase.mjs
 *   node scripts/seed-news-supabase.mjs --dry-run
 *   node scripts/seed-news-supabase.mjs --chunk=20
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
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv();

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const chunkArg = args.find((a) => a.startsWith("--chunk="));
const CHUNK = Math.max(1, parseInt(chunkArg?.split("=")[1] || "25", 10) || 25);

const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  "";

if (!URL || !KEY) {
  console.error(
    "❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local"
  );
  process.exit(1);
}

function readNews() {
  const path = resolve(root, "data/news.json");
  if (!existsSync(path)) {
    console.error("❌ Không tìm thấy data/news.json");
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

function mapRow(n) {
  // published_at is date in schema
  let published = n.date || n.published_at || null;
  if (published && published.includes("T")) {
    published = published.slice(0, 10);
  }
  if (!published || !/^\d{4}-\d{2}-\d{2}$/.test(published)) {
    published = new Date().toISOString().slice(0, 10);
  }

  return {
    id: n.id,
    slug: n.slug,
    title: n.title || "",
    excerpt: n.excerpt || "",
    content: n.content || "",
    image: n.image || "",
    published_at: published,
    sort_order: Number(n.sortOrder ?? n.sort_order ?? 0),
    is_published: n.isPublished !== false && n.is_published !== false,
    created_at: n.createdAt || n.created_at || new Date().toISOString(),
    updated_at: n.updatedAt || n.updated_at || new Date().toISOString(),
  };
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
      `REST ${res.status} ${path}: ${
        typeof body === "object" ? JSON.stringify(body) : String(body).slice(0, 500)
      }`
    );
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return { body, headers: res.headers, status: res.status };
}

async function countNews() {
  const { headers } = await rest("news?select=id", {
    prefer: "count=exact",
    headers: {
      Prefer: "count=exact",
      "Range-Unit": "items",
      Range: "0-0",
    },
  });
  const cr = headers.get("content-range") || "";
  // e.g. 0-0/335
  const m = cr.match(/\/(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}

async function tableOk() {
  try {
    await rest("news?select=id&limit=1");
    return true;
  } catch (e) {
    if (String(e.message).includes("PGRST205") || e.status === 404) {
      return false;
    }
    // empty is fine
    if (e.status === 200 || e.status === 206) return true;
    // other errors still mean table might exist
    if (String(e.message).includes("permission")) return true;
    throw e;
  }
}

async function upsertChunk(rows) {
  await rest("news?on_conflict=id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: JSON.stringify(rows),
  });
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log(" Seed NEWS → Supabase");
  console.log("═══════════════════════════════════════");
  console.log("URL   :", URL);
  console.log("Chunk :", CHUNK);
  console.log("Mode  :", dryRun ? "DRY-RUN (không ghi DB)" : "UPSERT");

  const raw = readNews();
  if (!Array.isArray(raw) || raw.length === 0) {
    console.error("❌ news.json rỗng hoặc không hợp lệ");
    process.exit(1);
  }

  const rows = raw.map(mapRow);
  // validate unique ids/slugs
  const ids = new Set();
  const slugs = new Set();
  let skipped = 0;
  const clean = [];
  for (const r of rows) {
    if (!r.id || !r.slug || !r.title) {
      skipped++;
      continue;
    }
    if (ids.has(r.id) || slugs.has(r.slug)) {
      console.warn(`  ⚠ skip duplicate id/slug: ${r.slug}`);
      skipped++;
      continue;
    }
    ids.add(r.id);
    slugs.add(r.slug);
    clean.push(r);
  }

  console.log(`Local : ${raw.length} bài (valid ${clean.length}, skip ${skipped})`);
  console.log(
    `  · có ảnh   : ${clean.filter((r) => r.image).length}`
  );
  console.log(
    `  · published: ${clean.filter((r) => r.is_published).length}`
  );

  if (dryRun) {
    console.log("\n[DRY-RUN] Sample row:");
    console.log(
      JSON.stringify(
        {
          id: clean[0].id,
          slug: clean[0].slug,
          title: clean[0].title.slice(0, 60),
          image: (clean[0].image || "").slice(0, 70),
          published_at: clean[0].published_at,
          content_len: (clean[0].content || "").length,
        },
        null,
        2
      )
    );
    console.log("Done (no write).");
    return;
  }

  const exists = await tableOk();
  if (!exists) {
    console.error(`
❌ Bảng public.news chưa tồn tại.

→ Supabase Dashboard → SQL Editor → chạy:
   supabase/001_schema.sql  (hoặc schema_and_seed.sql)
rồi chạy lại script này.
`);
    process.exit(2);
  }

  const before = await countNews().catch(() => null);
  console.log(`DB trước: ${before ?? "?"} dòng\n`);

  console.log("Upserting...");
  let ok = 0;
  for (let i = 0; i < clean.length; i += CHUNK) {
    const part = clean.slice(i, i + CHUNK);
    try {
      await upsertChunk(part);
      ok += part.length;
      console.log(`  ✓ ${Math.min(i + CHUNK, clean.length)}/${clean.length}`);
    } catch (e) {
      console.error(`  ✗ chunk @${i}:`, e.message);
      // retry one-by-one to isolate bad row
      for (const row of part) {
        try {
          await upsertChunk([row]);
          ok++;
          console.log(`    · ok ${row.slug}`);
        } catch (e2) {
          console.error(`    · FAIL ${row.slug}: ${e2.message.slice(0, 200)}`);
        }
      }
    }
  }

  const after = await countNews().catch(() => null);
  console.log("\n═══════════════════════════════════════");
  console.log(`Upserted (attempted): ${ok}/${clean.length}`);
  console.log(`DB sau  : ${after ?? "?"} dòng`);
  if (after != null && after >= clean.length) {
    console.log("✅ Tin tức đã đẩy đủ lên Supabase.");
  } else if (after != null) {
    console.log(
      `⚠ DB có ${after} dòng, local ${clean.length} — kiểm tra slug/id conflict hoặc RLS.`
    );
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
