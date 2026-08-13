const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataExportPath = path.join(__dirname, '../data_export.json');
const seedOutputPath = path.join(__dirname, '../supabase/seed.sql');

const data = JSON.parse(fs.readFileSync(dataExportPath, 'utf-8'));

let seedSQL = `-- ============================================================\n`;
seedSQL += `-- Seed Data: Generated from data_export.json\n`;
seedSQL += `-- ============================================================\n\n`;

// Helper for SQL strings
const escapeSql = (str) => {
    if (!str) return '""';
    return "'" + str.replace(/'/g, "''") + "'";
};

// UUID Mappings
const catUuidMap = {}; // old category ID -> new UUID
const subcatUuidMap = {}; // old subcategory ID -> new UUID

// 1. Process Product Categories & Subcategories
// In the old DB, categories have type="product". 
const productCats = data.categories.filter(c => c.type === 'product');

seedSQL += `-- ── SEED categories ──\n`;
let catInserts = [];
let subcatInserts = [];

productCats.forEach((cat, index) => {
    const uuid = crypto.randomUUID();
    catUuidMap[cat.id] = uuid;
    
    // Some slugs might be null, fallback to generated
    const slug = cat.slug ? cat.slug : `category-${cat.id}`;
    
    catInserts.push(`  ('${uuid}', ${escapeSql(slug)}, ${escapeSql(cat.name)}, '', '', ${index}, true, now(), now())`);
    
    // Process subcategories
    if (cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach((sub, subIndex) => {
            const subUuid = crypto.randomUUID();
            subcatUuidMap[sub.id] = subUuid;
            
            // Map old subcategory IDs to new sub UUIDs
            catUuidMap[sub.id] = uuid; // Some products might link directly to sub.id as category_id in old db. Wait, they might link to sub.id.
            
            const subSlug = sub.slug ? sub.slug : `subcategory-${sub.id}`;
            subcatInserts.push(`  ('${subUuid}', '${uuid}', ${escapeSql(subSlug)}, ${escapeSql(sub.name)}, '', '', ${subIndex}, true, now(), now())`);
        });
    }
});

if (catInserts.length > 0) {
    seedSQL += `insert into public.categories (id, slug, name, description, image, sort_order, is_active, created_at, updated_at) values\n`;
    seedSQL += catInserts.join(',\n') + ';\n\n';
}

if (subcatInserts.length > 0) {
    seedSQL += `-- ── SEED subcategories ──\n`;
    seedSQL += `insert into public.subcategories (id, category_id, slug, name, description, image, sort_order, is_active, created_at, updated_at) values\n`;
    seedSQL += subcatInserts.join(',\n') + ';\n\n';
}

// 2. Process Products
seedSQL += `-- ── SEED products ──\n`;
let productInserts = [];

data.products.forEach((prod, index) => {
    const uuid = crypto.randomUUID();
    const slug = prod.slug ? prod.slug : `product-${prod.id}`;
    const title = prod.title;
    const content = prod.description ? prod.description : '';
    const description = prod.description ? prod.description.substring(0, 150) : ''; // basic excerpt
    const price = prod.price !== null ? prod.price.toString() : 'Liên hệ';
    const image = prod.image_url ? prod.image_url : '';
    
    // Category mapping
    let catId = null;
    let subcatId = null;
    
    // Find the first category id that maps to our product cats
    for (const oldCatId of prod.category_ids) {
        if (subcatUuidMap[oldCatId]) {
            // It's a subcategory
            subcatId = subcatUuidMap[oldCatId];
            catId = catUuidMap[oldCatId]; // The parent category UUID we saved
        } else if (catUuidMap[oldCatId]) {
            // It's a top level category
            catId = catUuidMap[oldCatId];
        }
    }
    
    // If no category mapped, we need to pick a default or assign random. Let's just pick the first available cat if catId is null.
    if (!catId && productCats.length > 0) {
        catId = catUuidMap[productCats[0].id];
    }
    
    // Format: id, category_id, subcategory_id, slug, name, description, content, sku, image, price, views, images
    // Wait, the schema from migration 008 adds price, views, images. But 001 creates products.
    // Let's use the columns: (id, category_id, subcategory_id, slug, name, description, content, image, price, views, images, is_active)
    
    const catIdStr = catId ? `'${catId}'` : 'NULL';
    const subcatIdStr = subcatId ? `'${subcatId}'` : 'NULL';
    
    productInserts.push(`  ('${uuid}', ${catIdStr}, ${subcatIdStr}, ${escapeSql(slug)}, ${escapeSql(title)}, ${escapeSql(description)}, ${escapeSql(content)}, ${escapeSql(image)}, ${escapeSql(price)}, 0, '[]'::jsonb, true)`);
});

if (productInserts.length > 0) {
    seedSQL += `insert into public.products (id, category_id, subcategory_id, slug, name, description, content, image, price, views, images, is_active) values\n`;
    seedSQL += productInserts.join(',\n') + ';\n\n';
}

// 3. Process News
seedSQL += `-- ── SEED news ──\n`;
let newsInserts = [];

data.posts.forEach((post, index) => {
    const uuid = crypto.randomUUID();
    const slug = post.slug ? post.slug : `post-${post.id}`;
    const title = post.title;
    const content = post.content ? post.content : '';
    const excerpt = post.content ? post.content.substring(0, 150) : '';
    
    // The old image might not be in posts, but let's assume empty for now.
    
    // Columns: id, slug, title, excerpt, content, image, is_published
    newsInserts.push(`  ('${uuid}', ${escapeSql(slug)}, ${escapeSql(title)}, ${escapeSql(excerpt)}, ${escapeSql(content)}, '', true)`);
});

if (newsInserts.length > 0) {
    seedSQL += `insert into public.news (id, slug, title, excerpt, content, image, is_published) values\n`;
    seedSQL += newsInserts.join(',\n') + ';\n\n';
}

fs.writeFileSync(seedOutputPath, seedSQL);
console.log(`Successfully generated new supabase/seed.sql with real data!`);
