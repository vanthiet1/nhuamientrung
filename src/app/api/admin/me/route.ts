import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/auth";
import { jsonError, jsonOk } from "@/lib/cms/api-helpers";

export async function GET() {
  const store = await cookies();
  const result = verifySessionToken(store.get(ADMIN_COOKIE)?.value);
  if (!result.ok) return jsonError("Unauthorized", 401);
  return jsonOk({ username: result.username });
}
