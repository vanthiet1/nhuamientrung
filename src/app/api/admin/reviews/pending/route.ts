import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseOnline, getOfflineDb } from "@/lib/cms/store";

export async function GET() {
  try {
    if (!isSupabaseOnline()) {
      const db = getOfflineDb();
      const count = (db?.reviews || []).filter((r: any) => r.status === "pending").length;
      return NextResponse.json({ count });
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { count, error } = await supabase
      .from("product_reviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (error) throw error;
    return NextResponse.json({ count: count || 0 });
  } catch (error: any) {
    const db = getOfflineDb();
    const count = (db?.reviews || []).filter((r: any) => r.status === "pending").length;
    return NextResponse.json({ count });
  }
}
