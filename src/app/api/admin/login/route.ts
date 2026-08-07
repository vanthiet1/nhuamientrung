import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  validateCredentials,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ tài khoản và mật khẩu" },
        { status: 400 }
      );
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { error: "Sai tên đăng nhập hoặc mật khẩu" },
        { status: 401 }
      );
    }

    const token = createSessionToken(username);
    const res = NextResponse.json({ ok: true, username });
    const opts = sessionCookieOptions(token);
    res.cookies.set(opts);
    return res;
  } catch {
    return NextResponse.json({ error: "Lỗi đăng nhập" }, { status: 500 });
  }
}
