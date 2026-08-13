const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../supabase/migrations');
const seedFile = path.join(__dirname, '../supabase/seed.sql');

const filesToMerge = [
    '003_seed_categories.sql',
    '004_seed_subcategories.sql',
    '005_seed_products.sql',
    '006_seed_news.sql',
    '007_seed_careers.sql'
];

let seedContent = '-- ============================================================\n';
seedContent += '-- Seed Data: Merged from migrations 003 to 007\n';
seedContent += '-- ============================================================\n\n';

for (const file of filesToMerge) {
    const filePath = path.join(migrationsDir, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        seedContent += `-- --- Content from ${file} ---\n`;
        seedContent += content + '\n\n';
    } else {
        console.warn(`Warning: ${file} not found.`);
    }
}

// Write to seed.sql (append or overwrite). We'll overwrite or create new.
let existingSeedContent = '';
if (fs.existsSync(seedFile)) {
    existingSeedContent = fs.readFileSync(seedFile, 'utf-8');
}

fs.writeFileSync(seedFile, existingSeedContent + '\n' + seedContent);
console.log('Successfully merged seed files into supabase/seed.sql');

// Delete the old files
for (const file of filesToMerge) {
    const filePath = path.join(migrationsDir, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted ${file}`);
    }
}

// Rename 008 to 003
const oldFile = path.join(migrationsDir, '008_products_detail_columns.sql');
const newFile = path.join(migrationsDir, '003_products_detail_columns.sql');
if (fs.existsSync(oldFile)) {
    fs.renameSync(oldFile, newFile);
    console.log('Renamed 008_products_detail_columns.sql to 003_products_detail_columns.sql');
}
