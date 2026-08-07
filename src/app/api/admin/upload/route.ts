import { randomUUID } from "crypto";
import { withAdmin, jsonOk, jsonError } from "@/lib/cms/api-helpers";
import {
  PRODUCT_IMAGE_BUCKET,
  uploadToStorage,
} from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function extFromMime(mime: string, filename: string) {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (
    fromName &&
    ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(fromName)
  ) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  return map[mime] || "jpg";
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return jsonError("Form data không hợp lệ", 400);
    }

    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return jsonError("Chưa chọn file ảnh", 400);
    }

    if (!ALLOWED.has(file.type)) {
      return jsonError("Chỉ hỗ trợ ảnh JPEG, PNG, WebP, GIF, AVIF", 400);
    }

    if (file.size > MAX_BYTES) {
      return jsonError("Ảnh tối đa 5MB", 400);
    }

    const folder =
      String(form.get("folder") || "products")
        .replace(/[^a-z0-9/_-]/gi, "")
        .replace(/^\/+|\/+$/g, "") || "products";

    const ext = extFromMime(file.type, file.name || "");
    const path = `${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadToStorage({
      bucket: PRODUCT_IMAGE_BUCKET,
      path,
      body: buffer,
      contentType: file.type,
      upsert: false,
    });

    return jsonOk({
      url: result.publicUrl,
      path: result.path,
      bucket: PRODUCT_IMAGE_BUCKET,
    });
  });
}
