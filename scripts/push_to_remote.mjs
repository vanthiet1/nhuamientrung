import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(process.cwd(), '.env.local');
console.log('Loading .env.local from:', envPath);
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
        if (!line || line.startsWith('#')) continue;
        const index = line.indexOf('=');
        if (index > 0) {
            const key = line.substring(0, index).trim();
            const value = line.substring(index + 1).trim();
            process.env[key] = value;
        }
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

async function clearTable(tableName) {
    console.log(`Clearing table: ${tableName}...`);
    const { error } = await supabase
        .from(tableName)
        .delete()
        .not('id', 'is', null);
        
    if (error) {
        console.error(`Error clearing ${tableName}:`, error);
        throw error;
    }
}

async function insertData(tableName, data) {
    if (!data || data.length === 0) return;
    console.log(`Inserting ${data.length} records into ${tableName}...`);
    
    // Batch inserts
    const chunkSize = 50;
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const { error } = await supabase.from(tableName).insert(chunk);
        if (error) {
            console.error(`Error inserting into ${tableName}:`, error);
            throw error;
        }
    }
}

async function main() {
    try {
        console.log("Reading data_export.json...");
        const dataExportPath = path.join(__dirname, '../data_export.json');
        const data = JSON.parse(fs.readFileSync(dataExportPath, 'utf-8'));
        
        // Clear tables in reverse order of foreign keys
        await clearTable('products');
        await clearTable('subcategories');
        await clearTable('categories');
        await clearTable('news');
        
        // Prepare mapping
        const catUuidMap = {}; 
        const subcatUuidMap = {};
        
        const productCats = data.categories.filter(c => c.type === 'product');
        
        const insertCategories = [];
        const insertSubcats = [];
        const insertProducts = [];
        const insertNews = [];
        
        // 1. Categories
        productCats.forEach((cat, index) => {
            const uuid = crypto.randomUUID();
            catUuidMap[cat.id] = uuid;
            
            insertCategories.push({
                id: uuid,
                slug: cat.slug || `category-${cat.id}`,
                name: cat.name,
                description: '',
                image: '',
                sort_order: index,
                is_active: true
            });
            
            if (cat.subcategories && cat.subcategories.length > 0) {
                cat.subcategories.forEach((sub, subIndex) => {
                    const subUuid = crypto.randomUUID();
                    subcatUuidMap[sub.id] = subUuid;
                    catUuidMap[sub.id] = uuid;
                    
                    insertSubcats.push({
                        id: subUuid,
                        category_id: uuid,
                        slug: sub.slug || `subcategory-${sub.id}`,
                        name: sub.name,
                        description: '',
                        image: '',
                        sort_order: subIndex,
                        is_active: true
                    });
                });
            }
        });
        
        // 2. Products
        data.products.forEach((prod, index) => {
            const uuid = crypto.randomUUID();
            let catId = null;
            let subcatId = null;
            
            for (const oldCatId of prod.category_ids) {
                if (subcatUuidMap[oldCatId]) {
                    subcatId = subcatUuidMap[oldCatId];
                    catId = catUuidMap[oldCatId];
                } else if (catUuidMap[oldCatId]) {
                    catId = catUuidMap[oldCatId];
                }
            }
            
            if (!catId && productCats.length > 0) {
                catId = catUuidMap[productCats[0].id];
            }
            
            insertProducts.push({
                id: uuid,
                category_id: catId,
                subcategory_id: subcatId,
                slug: prod.slug || `product-${prod.id}`,
                name: prod.title,
                description: prod.description ? prod.description.substring(0, 150) : '',
                content: prod.description || '',
                sku: '',
                image: prod.image_url || '',
                price: prod.price !== null ? prod.price.toString() : 'Liên hệ',
                views: 0,
                images: [],
                source_url: '',
                sort_order: index,
                is_active: true
            });
        });
        
        // 3. News
        data.posts.forEach((post, index) => {
            const uuid = crypto.randomUUID();
            
            insertNews.push({
                id: uuid,
                slug: post.slug || `post-${post.id}`,
                title: post.title,
                excerpt: post.content ? post.content.substring(0, 150) : '',
                content: post.content || '',
                image: '',
                published_at: new Date().toISOString().split('T')[0],
                sort_order: index,
                is_published: true
            });
        });
        
        // Insert in order
        await insertData('categories', insertCategories);
        await insertData('subcategories', insertSubcats);
        await insertData('products', insertProducts);
        await insertData('news', insertNews);
        
        console.log("Migration completed successfully!");
        
    } catch (e) {
        console.error("Migration failed:", e);
        process.exit(1);
    }
}

main();
