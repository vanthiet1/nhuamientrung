import { Redis } from "@upstash/redis";

/**
 * Khởi tạo Upstash Redis Client từ biến môi trường.
 * Hỗ trợ các tên biến môi trường:
 * - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 * - KV_REST_API_URL / KV_REST_API_TOKEN (Vercel KV)
 */
function getRedisClient(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    return new Redis({
      url,
      token,
      cache: "default",
    });
  } catch (err) {
    console.warn("[Redis] Khởi tạo Redis client thất bại:", err);
    return null;
  }
}

export const redis = getRedisClient();
