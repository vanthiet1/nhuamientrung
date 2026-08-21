import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const envPath = resolve(root, ".env.local");
  const defaultEnvPath = resolve(root, ".env");
  
  const targetPaths = [envPath, defaultEnvPath];
  for (const targetPath of targetPaths) {
    if (!existsSync(targetPath)) continue;
    const content = readFileSync(targetPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const m = trimmed.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim();
      }
    }
  }
}

loadEnv();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!URL || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false },
});

async function updateBucketObjects(bucketName) {
  console.log(`\nScanning bucket: "${bucketName}"...`);

  async function listAllFiles(folder = "") {
    let allFiles = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const { data, error } = await supabase.storage.from(bucketName).list(folder, {
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) {
        console.error(`Error listing folder "${folder}":`, error.message);
        break;
      }

      if (!data || data.length === 0) break;

      for (const item of data) {
        const itemPath = folder ? `${folder}/${item.name}` : item.name;
        if (item.id === null || (!item.metadata && !item.updated_at)) {
          // Subfolder
          const subFiles = await listAllFiles(itemPath);
          allFiles = allFiles.concat(subFiles);
        } else {
          // File
          allFiles.push({ path: itemPath, ...item });
        }
      }

      if (data.length < limit) break;
      offset += limit;
    }

    return allFiles;
  }

  const files = await listAllFiles();
  console.log(`Found ${files.length} files in bucket "${bucketName}".`);

  let updatedCount = 0;
  for (const file of files) {
    try {
      // Download current object content
      const { data: fileData, error: downloadErr } = await supabase.storage
        .from(bucketName)
        .download(file.path);

      if (downloadErr) {
        console.error(`  - Skip ${file.path}: Download error - ${downloadErr.message}`);
        continue;
      }

      // Re-upload object with updated Cache-Control header
      const contentType = file.metadata?.mimetype || "application/octet-stream";
      const { error: updateErr } = await supabase.storage
        .from(bucketName)
        .upload(file.path, fileData, {
          cacheControl: "31536000",
          contentType,
          upsert: true,
        });

      if (updateErr) {
        console.error(`  - Failed ${file.path}: ${updateErr.message}`);
      } else {
        updatedCount++;
        if (updatedCount % 10 === 0 || updatedCount === files.length) {
          console.log(`  ✓ Updated ${updatedCount}/${files.length} files...`);
        }
      }
    } catch (e) {
      console.error(`  - Error processing ${file.path}:`, e.message || e);
    }
  }

  console.log(`Done bucket "${bucketName}": ${updatedCount} files updated with Cache-Control 31536000.`);
}

async function main() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Failed to list buckets:", error.message);
    process.exit(1);
  }

  console.log(`Buckets found: ${buckets.map((b) => b.name).join(", ")}`);
  for (const bucket of buckets) {
    await updateBucketObjects(bucket.name);
  }

  console.log("\nAll Storage buckets updated successfully!");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
