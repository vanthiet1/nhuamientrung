import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const PRODUCT_IMAGE_BUCKET = "products";
export const DOCUMENTS_BUCKET = "documents";

function requireEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

/**
 * Service-role client — server only.
 * Realtime is not used; we still create the client for convenience where needed.
 * Prefer storage REST helpers below for uploads (no WebSocket requirement).
 */
export function createServiceClient(): SupabaseClient {
  const { url, key } = requireEnv();
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

type StorageError = { statusCode?: string; error?: string; message?: string };

async function storageFetch(path: string, init: RequestInit = {}) {
  const { url, key } = requireEnv();
  const res = await fetch(`${url}/storage/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      ...(init.headers || {}),
    },
  });
  return res;
}

/** Ensure public bucket exists (idempotent). */
export async function ensureStorageBucket(
  bucket = PRODUCT_IMAGE_BUCKET,
  options?: {
    public?: boolean;
    fileSizeLimit?: number;
    allowedMimeTypes?: string[];
  }
) {
  const listRes = await storageFetch("/bucket", { method: "GET" });
  if (listRes.ok) {
    const buckets = (await listRes.json()) as { name: string }[];
    if (Array.isArray(buckets) && buckets.some((b) => b.name === bucket)) {
      return;
    }
  }

  const createRes = await storageFetch("/bucket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: bucket,
      name: bucket,
      public: options?.public ?? true,
      file_size_limit: options?.fileSizeLimit ?? 5 * 1024 * 1024,
      allowed_mime_types: options?.allowedMimeTypes ?? [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
      ],
    }),
  });

  if (!createRes.ok) {
    const body = (await createRes.json().catch(() => ({}))) as StorageError;
    const msg = body.message || body.error || createRes.statusText;
    // already exists is fine
    if (!/exist|duplicate|already/i.test(msg)) {
      throw new Error(`Không tạo được bucket Storage: ${msg}`);
    }
  }
}

export async function uploadToStorage(opts: {
  bucket?: string;
  path: string;
  body: Buffer | ArrayBuffer | Blob;
  contentType: string;
  upsert?: boolean;
}): Promise<{ path: string; publicUrl: string }> {
  const bucket = opts.bucket || PRODUCT_IMAGE_BUCKET;
  const isDocs = bucket === DOCUMENTS_BUCKET;
  await ensureStorageBucket(bucket, {
    public: true,
    fileSizeLimit: isDocs ? 8 * 1024 * 1024 : 5 * 1024 * 1024,
    allowedMimeTypes: isDocs
      ? ["application/pdf", "application/x-pdf"]
      : undefined,
  });

  const encodedPath = opts.path
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");

  const res = await storageFetch(`/object/${bucket}/${encodedPath}`, {
    method: "POST",
    headers: {
      "Content-Type": opts.contentType,
      "x-upsert": opts.upsert ? "true" : "false",
      "cache-control": "3600",
    },
    body: opts.body as BodyInit,
  });

  if (!res.ok) {
    // retry after ensure (race)
    await ensureStorageBucket(bucket);
    const retry = await storageFetch(`/object/${bucket}/${encodedPath}`, {
      method: "POST",
      headers: {
        "Content-Type": opts.contentType,
        "x-upsert": opts.upsert ? "true" : "false",
        "cache-control": "3600",
      },
      body: opts.body as BodyInit,
    });
    if (!retry.ok) {
      const body = (await retry.json().catch(() => ({}))) as StorageError;
      throw new Error(
        `Upload thất bại: ${body.message || body.error || retry.statusText}`
      );
    }
  }

  return {
    path: opts.path,
    publicUrl: getPublicUrl(bucket, opts.path),
  };
}

export function getPublicUrl(bucket: string, path: string) {
  const { url } = requireEnv();
  const encodedPath = path
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  return `${url}/storage/v1/object/public/${bucket}/${encodedPath}`;
}
