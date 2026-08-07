import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/auth";

export async function assertAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const result = verifySessionToken(token);
  if (!result.ok) {
    return null;
  }
  return result;
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function withAdmin(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const admin = await assertAdmin();
  if (!admin) return jsonError("Unauthorized", 401);
  try {
    return await handler();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi máy chủ";
    return jsonError(msg, 400);
  }
}
