import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
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
    console.error("Error fetching pending reviews count:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
