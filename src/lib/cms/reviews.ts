import { createClient } from "@/lib/supabase/server";
import { getOrSetCache } from "@/lib/cache";
import { isSupabaseOnline, getOfflineDb, saveOfflineDb } from "@/lib/cms/store";
import type { ProductReviewRecord } from "./types";

export async function submitReview(data: Omit<ProductReviewRecord, "id" | "status" | "created_at" | "updated_at">) {
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    if (db) {
      db.reviews = db.reviews || [];
      db.reviews.unshift({
        id: "rev-" + Date.now(),
        ...data,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      saveOfflineDb(db);
    }
    return true;
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_reviews")
    .insert([{
      ...data,
      status: "pending"
    }]);

  if (error) {
    console.error("Lỗi submit review:", error);
    throw error;
  }
  return true;
}

export async function getApprovedReviews(productId: string): Promise<ProductReviewRecord[]> {
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    return (db?.reviews || []).filter(
      (r: any) => (r.productId === productId || r.product_id === productId) && r.status === "approved"
    );
  }
  return getOrSetCache(`cms:reviews:${productId}`, async () => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi lấy danh sách review:", error);
        return [];
      }
      return data || [];
    } catch {
      return [];
    }
  });
}

