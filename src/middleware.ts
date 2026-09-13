import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  verifySessionTokenEdge,
} from "@/lib/admin/auth-edge";
import { getSeoRedirect } from "@/lib/seo/redirects";

// List of aggressive bots and scrapers that exhaust server resources
const BLOCKED_BOTS_REGEX =
  /bytespider|petalbot|ahrefsbot|semrushbot|mj12bot|dotbot|blexbot|dataforseobot|zoominfobot|amazonbot|claudebot|gptbot|ccbot|applebot-extended/i;

export async function middleware(request: NextRequest) {
  // 1. Block abusive bots/scrapers early at Edge before any compute
  const userAgent = request.headers.get("user-agent") || "";
  if (BLOCKED_BOTS_REGEX.test(userAgent)) {
    return new NextResponse("Forbidden - Automated scraping is restricted", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // 2. Evaluate SEO legacy redirects with strict self-loop prevention
  const seoRedirectUrl = getSeoRedirect(request);
  if (
    seoRedirectUrl &&
    (seoRedirectUrl.pathname !== request.nextUrl.pathname ||
      seoRedirectUrl.search !== request.nextUrl.search)
  ) {
    return NextResponse.redirect(seoRedirectUrl, 301);
  }

  const { pathname } = request.nextUrl;

  // 3. Admin dashboard route protection
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

  // 4. Admin API route protection
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

  // 5. Default next response (Supabase Auth is not used; avoiding wasteful getUser() network roundtrips)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|woff|woff2|ttf|eot|css|js|map)$).*)",
  ],
};
