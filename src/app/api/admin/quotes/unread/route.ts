import { NextResponse } from "next/server";
import { countUnreadQuoteRequests } from "@/lib/cms/store";

export const runtime = "nodejs";
// Force dynamic so it doesn't cache the count at build time
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await countUnreadQuoteRequests();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
