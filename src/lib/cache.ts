import { redis } from "./redis";

const DEFAULT_TTL = 3600; // 1 hour
const MEMORY_TTL = 180; // 3 minutes in-memory cache to reduce Redis REST API roundtrips

type MemoryCacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const memoryCache = new Map<string, MemoryCacheEntry<any>>();

/**
 * Đọc dữ liệu từ In-Memory Cache -> Redis Cache -> Fetcher (Supabase DB).
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL
): Promise<T> {
  const now = Date.now();

  // 1. Tần RAM Server (0ms latency)
  const memCached = memoryCache.get(key);
  if (memCached && memCached.expiresAt > now) {
    return memCached.data as T;
  }

  // 2. Tần Redis Cache (Upstash REST API)
  if (redis) {
    try {
      const cached = await redis.get<T>(key);
      if (cached !== null && cached !== undefined) {
        // Lưu vào RAM ngắn hạn để các request tiếp theo lấy tức thì
        memoryCache.set(key, {
          data: cached,
          expiresAt: now + Math.min(ttlSeconds, MEMORY_TTL) * 1000,
        });
        return cached;
      }
    } catch (error) {
      console.warn(`[Redis Cache] Lỗi đọc key "${key}":`, error);
    }
  }

  // 3. Fetch từ DB/Supabase
  const freshData = await fetcher();

  if (freshData !== undefined) {
    // Lưu vào RAM
    memoryCache.set(key, {
      data: freshData,
      expiresAt: now + Math.min(ttlSeconds, MEMORY_TTL) * 1000,
    });

    // Lưu vào Redis
    if (redis) {
      try {
        await redis.set(key, freshData, { ex: ttlSeconds });
      } catch (error) {
        console.warn(`[Redis Cache] Lỗi lưu key "${key}":`, error);
      }
    }
  }

  return freshData;
}

/**
 * Xóa danh sách cache key cụ thể (cả RAM & Redis)
 */
export async function delCacheKeys(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  for (const k of keys) {
    memoryCache.delete(k);
  }

  if (!redis) return;
  try {
    await redis.del(...keys);
  } catch (error) {
    console.warn("[Redis Cache] Lỗi xóa key:", error);
  }
}

/**
 * Xóa toàn bộ cache thuộc CMS (Banners, Products, Categories, News, Careers)
 */
export async function clearCmsCache(): Promise<void> {
  // Clear RAM
  memoryCache.clear();

  if (!redis) return;
  try {
    // Tìm và xóa các key có tiền tố cms:
    const keys = await redis.keys("cms:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn("[Redis Cache] Lỗi xóa cms:* cache:", error);
  }
}

