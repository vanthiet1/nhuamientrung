import { redis } from "./redis";

const DEFAULT_TTL = 3600; // 1 hour

/**
 * Đọc dữ liệu từ Redis Cache. Nếu chưa có hoặc Redis không sẵn sàng,
 * sẽ gọi hàm `fetcher()`, lưu kết quả vào Redis rồi trả về.
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL
): Promise<T> {
  if (!redis) {
    return fetcher();
  }

  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  } catch (error) {
    console.warn(`[Redis Cache] Lỗi đọc key "${key}":`, error);
  }

  // Fetch từ DB/Supabase
  const freshData = await fetcher();

  if (redis && freshData !== undefined) {
    try {
      await redis.set(key, freshData, { ex: ttlSeconds });
    } catch (error) {
      console.warn(`[Redis Cache] Lỗi lưu key "${key}":`, error);
    }
  }

  return freshData;
}

/**
 * Xóa danh sách cache key cụ thể
 */
export async function delCacheKeys(...keys: string[]): Promise<void> {
  if (!redis || keys.length === 0) return;
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
  if (!redis) return;

  try {
    // 1. Tìm các key có tiền tố cms:
    const keys = await redis.keys("cms:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn("[Redis Cache] Lỗi xóa cms:* cache:", error);
  }
}
