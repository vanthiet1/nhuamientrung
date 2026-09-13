import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  verifySessionTokenEdge,
} from "@/lib/admin/auth-edge";
import { getSeoRedirect } from "@/lib/seo/redirects";

// List of aggressive bots, scrapers, and automated script libraries
const BLOCKED_BOTS_REGEX =
  /bytespider|petalbot|ahrefsbot|semrushbot|mj12bot|dotbot|blexbot|dataforseobot|zoominfobot|amazonbot|claudebot|gptbot|ccbot|applebot-extended|yandexbot|baiduspider|sogou|seznambot|screaming frog|censys|shodan|python-requests|aiohttp|scrapy|httpclient|node-fetch|go-http-client|libwww-perl|curl|wget/i;

// Common automated vulnerability scan probe paths (legacy WordPress, PHP, env files)
const EXPLOIT_PROBE_REGEX =
  /^\/(wp-login\.php|xmlrpc\.php|wp-admin(?!\/login)|wp-includes|wp-content\/plugins|\.env|\.git|phpmyadmin|license\.txt|readme\.html)/i;

// In-memory Edge IP Rate Limiter (Sliding 10-second window: max 35 reqs / 10s per IP)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1") return false;
  const now = Date.now();
  const record = ipRequestCounts.get(ip);
  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + 10_000 });
    return false;
  }
  record.count += 1;
  return record.count > 35;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Block common exploit / vulnerability scan probes instantly with cached 404
  if (EXPLOIT_PROBE_REGEX.test(pathname)) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  }

  // 2. Block abusive scrapers, scripts, and requests missing User-Agent
  const userAgent = request.headers.get("user-agent") || "";
  if (!userAgent.trim() || BLOCKED_BOTS_REGEX.test(userAgent)) {
    return new NextResponse("Forbidden - Automated scraping is restricted", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // 3. Edge IP Rate Limiter to stop high-speed flooding (>35 reqs / 10 seconds)
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return new NextResponse("Too Many Requests - Rate limit exceeded", {
      status: 429,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "10",
      },
    });
  }

  // 4. Evaluate SEO legacy redirects with strict self-loop prevention
  const seoRedirectUrl = getSeoRedirect(request);
  if (
    seoRedirectUrl &&
    (seoRedirectUrl.pathname !== request.nextUrl.pathname ||
      seoRedirectUrl.search !== request.nextUrl.search)
  ) {
    return NextResponse.redirect(seoRedirectUrl, 301);
  }

  // 5. Admin dashboard route protection
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

  // 6. Admin API route protection
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

  // 7. Default next response (Supabase Auth is not used; avoiding wasteful getUser() network roundtrips)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|woff|woff2|ttf|eot|css|js|map)$).*)",
  ],
};
