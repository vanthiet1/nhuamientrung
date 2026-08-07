import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  ADMIN_COOKIE,
  verifySessionTokenEdge,
} from "@/lib/admin/auth-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const secret =
      process.env.ADMIN_SESSION_SECRET ||
      process.env.ADMIN_PASSWORD ||
      "dev-insecure-secret";
    const ok = await verifySessionTokenEdge(token, secret);

    if (!ok && !isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (ok && isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
      return NextResponse.next();
    }
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const secret =
      process.env.ADMIN_SESSION_SECRET ||
      process.env.ADMIN_PASSWORD ||
      "dev-insecure-secret";
    const ok = await verifySessionTokenEdge(token, secret);
    if (!ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
