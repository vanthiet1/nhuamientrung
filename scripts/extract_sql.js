const fs = require('fs');
const path = require('path');

const SQL_FILE = path.join(__dirname, '../nhuamientrun_condensed.sql');
const OUTPUT_FILE = path.join(__dirname, '../data_export.json');

function parseSqlFile() {
    const sqlContent = fs.readFileSync(SQL_FILE, 'utf-8');
    
    // Split by INSERT INTO `
    const parts = sqlContent.split("INSERT INTO `");
    
    let allData = {
        categories: [],
        products: [],
        posts: [],
        product_categories: [],
        post_categories: []
    };
    
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        
        // Find table name
        const endOfTableName = part.indexOf("`");
        if (endOfTableName === -1) continue;
        const tableName = part.substring(0, endOfTableName);
        
        if (!allData[tableName]) continue; // We don't care about this table
        
        // Find VALUES
        const valuesIndex = part.indexOf("VALUES");
        if (valuesIndex === -1) continue;
        
        // We start parsing after VALUES
        const valuesStr = part.substring(valuesIndex + 6).trim();
        
        let inString = false;
        let escape = false;
        let currentRow = [];
        let currentValue = "";
        let inRow = false;
        
        // We parse until we hit a semicolon that is NOT inside a string.
        for (let j = 0; j < valuesStr.length; j++) {
            let char = valuesStr[j];
            
            if (escape) {
                currentValue += char;
                escape = false;
                continue;
            }
            
            if (char === '\\') {
                escape = true;
                // Keep the backslash in the parsed value if we want to preserve escapes, or ignore it.
                // currentValue += char; 
                continue;
            }
            
            if (char === "'" && !inString) {
                inString = true;
                continue;
            } else if (char === "'" && inString) {
                if (j + 1 < valuesStr.length && valuesStr[j+1] === "'") {
                    currentValue += "'";
                    j++; // skip next
                    continue;
                } else {
                    inString = false;
                    continue;
                }
            }
            
            if (!inString) {
                if (char === ';') {
                    break; // End of INSERT statement
                }
                
                if (char === '(' && !inRow) {
                    inRow = true;
                    currentRow = [];
                    currentValue = "";
                    continue;
                } else if (char === ')' && inRow) {
                    inRow = false;
                    currentRow.push(currentValue.trim());
                    allData[tableName].push(currentRow);
                    currentValue = "";
                    continue;
                } else if (char === ',' && inRow) {
                    currentRow.push(currentValue.trim());
                    currentValue = "";
                    continue;
                }
            }
            
            if (inRow) {
                currentValue += char;
            }
        }
    }
    
    return allData;
}

function processData() {
    console.log("Reading and parsing SQL file...");
    const rawData = parseSqlFile();
    
    console.log(`Found ${rawData.categories.length} categories, ${rawData.products.length} products, ${rawData.posts.length} posts.`);
    console.log(`Found ${rawData.product_categories.length} product_category links, ${rawData.post_categories.length} post_category links.`);
    
    const categoriesMap = new Map();
    const categories = [];
    
    rawData.categories.forEach(row => {
        const cat = {
            id: parseInt(row[0]),
            name: row[1],
            slug: row[2] === 'NULL' ? null : row[2],
            type: row[3],
            parent_id: row[4] === 'NULL' ? null : parseInt(row[4]),
            subcategories: []
        };
        categoriesMap.set(cat.id, cat);
        categories.push(cat);
    });
    
    const nestedCategories = [];
    categories.forEach(cat => {
        if (cat.parent_id && categoriesMap.has(cat.parent_id)) {
            categoriesMap.get(cat.parent_id).subcategories.push(cat);
        } else {
            nestedCategories.push(cat);
        }
    });
    
    const productCategoriesMap = new Map();
    rawData.product_categories.forEach(row => {
        const productId = parseInt(row[0]);
        const categoryId = parseInt(row[1]);
        if (!productCategoriesMap.has(productId)) {
            productCategoriesMap.set(productId, []);
        }
        productCategoriesMap.get(productId).push(categoryId);
    });
    
    const products = rawData.products.map(row => {
        const id = parseInt(row[0]);
        const catIds = productCategoriesMap.get(id) || [];
        const catNames = catIds.map(cid => categoriesMap.has(cid) ? categoriesMap.get(cid).name : 'Unknown');
        
        return {
            id: id,
            title: row[1],
            slug: row[2] === 'NULL' ? null : row[2],
            description: row[3] === 'NULL' ? null : row[3],
            price: row[4] === 'NULL' ? null : parseFloat(row[4]),
            image_url: row[5] === 'NULL' ? null : row[5],
            created_at: row[6] === 'NULL' ? null : row[6],
            category_ids: catIds,
            category_names: catNames
        };
    });
    
    const postCategoriesMap = new Map();
    rawData.post_categories.forEach(row => {
        const postId = parseInt(row[0]);
        const categoryId = parseInt(row[1]);
        if (!postCategoriesMap.has(postId)) {
            postCategoriesMap.set(postId, []);
        }
        postCategoriesMap.get(postId).push(categoryId);
    });
    
    const posts = rawData.posts.map(row => {
        const id = parseInt(row[0]);
        const catIds = postCategoriesMap.get(id) || [];
        const catNames = catIds.map(cid => categoriesMap.has(cid) ? categoriesMap.get(cid).name : 'Unknown');
        
        return {
            id: id,
            title: row[1],
            slug: row[2] === 'NULL' ? null : row[2],
            content: row[3] === 'NULL' ? null : row[3],
            created_at: row[4] === 'NULL' ? null : row[4],
            category_ids: catIds,
            category_names: catNames
        };
    });
    
    const finalData = {
        categories: nestedCategories,
        products: products,
        posts: posts
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
    console.log(`Successfully exported data to ${OUTPUT_FILE}`);
}

processData();
