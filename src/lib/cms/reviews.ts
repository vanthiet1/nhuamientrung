import { createClient } from "@/lib/supabase/server";
import type { ProductReviewRecord } from "./types";

export async function submitReview(data: Omit<ProductReviewRecord, "id" | "status" | "created_at" | "updated_at">) {
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
}
