import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseOnline, getOfflineDb, saveOfflineDb } from "@/lib/cms/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  }

  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    if (db?.reviews) {
      const item = db.reviews.find((r: any) => r.id === id);
      if (item) {
        item.status = status;
        saveOfflineDb(db);
        return NextResponse.json({ success: true });
      }
    }
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error } = await supabase
      .from("product_reviews")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating review status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseOnline()) {
    const db = getOfflineDb();
    if (db?.reviews) {
      db.reviews = db.reviews.filter((r: any) => r.id !== id);
      saveOfflineDb(db);
      return NextResponse.json({ success: true });
    }
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting review:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
