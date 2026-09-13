import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseOnline, getOfflineDb } from "@/lib/cms/store";

export async function GET() {
  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    return NextResponse.json(db?.reviews || []);
  }
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*, products(name)")
      .order("created_at", { ascending: false });

    if (error) {
      const db = getOfflineDb();
      return NextResponse.json(db?.reviews || []);
    }

    return NextResponse.json(data);
  } catch {
    const db = getOfflineDb();
    return NextResponse.json(db?.reviews || []);
  }
}
