import { getProducts, getCategories } from "@/lib/cms/store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getProducts();
    const categories = await getCategories();
    return NextResponse.json({ products, categories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e), stack: e.stack }, { status: 500 });
  }
}
