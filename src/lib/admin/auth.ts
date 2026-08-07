import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "./auth-edge";

export { ADMIN_COOKIE };

const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-insecure-secret"
  );
}

function getCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin",
  };
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(username: string) {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = `${username}.${exp}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): {
  ok: boolean;
  username?: string;
} {
  if (!token) return { ok: false };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false };
  const [username, expStr, sig] = parts;
  const payload = `${username}.${expStr}`;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false };
  } catch {
    return { ok: false };
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return { ok: false };
  return { ok: true, username };
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

export function validateCredentials(username: string, password: string) {
  const creds = getCredentials();
  return (
    safeEqual(username, creds.username) && safeEqual(password, creds.password)
  );
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token).ok;
}

export function sessionCookieOptions(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}
