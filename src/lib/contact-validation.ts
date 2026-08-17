/** Validate phone (VN) + anti-spam helpers for contact form */

/** Strip spaces, dots, dashes, parentheses */
export function normalizePhone(raw: string): string {
  let p = (raw || "").trim().replace(/[\s.\-()]/g, "");
  // 84xxxxxxxxx → +84...
  if (/^84\d{8,10}$/.test(p)) p = `+${p}`;
  // +8409... → +849...
  if (p.startsWith("+840")) p = `+84${p.slice(4)}`;
  return p;
}

/**
 * Vietnam mobile / landline:
 * - Mobile: 03x/05x/07x/08x/09x + 7 digits (10 total with 0)
 * - Landline: 02x… (10–11 digits with 0)
 * - +84 form accepted
 */
export function isValidVietnamPhone(raw: string): boolean {
  const p = normalizePhone(raw);
  if (!p) return false;

  // Mobile: 0[35789]xxxxxxxx
  const mobile0 = /^0(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
  // +84 mobile without leading 0
  const mobile84 = /^\+84(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
  // Landline 02x
  const land0 = /^02\d{8,9}$/;
  const land84 = /^\+842\d{8,9}$/;

  return mobile0.test(p) || mobile84.test(p) || land0.test(p) || land84.test(p);
}

export function phoneErrorMessage(raw: string): string | null {
  const p = (raw || "").trim();
  if (!p) return "Vui lòng nhập số điện thoại";
  const digits = p.replace(/\D/g, "");
  if (digits.length < 9) return "Số điện thoại quá ngắn";
  if (digits.length > 12) return "Số điện thoại quá dài";
  if (!isValidVietnamPhone(p)) {
    return "Số điện thoại không đúng định dạng VN (VD: 0901234567 hoặc 0935909747)";
  }
  return null;
}

export function formatPhoneDisplay(raw: string): string {
  const p = normalizePhone(raw);
  if (p.startsWith("+84")) {
    return `0${p.slice(3)}`;
  }
  return p;
}

const URL_RE = /https?:\/\/|www\.|bit\.ly|t\.me\//gi;

export function isSpammyContent(input: {
  name: string;
  email?: string;
  subject?: string;
  content: string;
}): string | null {
  const { name, email, subject, content } = input;

  if (name.length > 80) return "Họ tên quá dài";
  if (content.length < 5) return "Nội dung quá ngắn";
  if (content.length > 5000) return "Nội dung quá dài (tối đa 5000 ký tự)";
  if ((subject || "").length > 200) return "Chủ đề quá dài";

  // Too many links = spam
  const blob = `${name} ${email || ""} ${subject || ""} ${content}`;
  const urls = blob.match(URL_RE) || [];
  if (urls.length >= 3) return "Nội dung có quá nhiều liên kết";

  // Homoglyph / random char spam
  if (/[А-Яа-яЁё]{4,}/.test(blob) && !/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(name)) {
    // Cyrillic-heavy without Vietnamese name is often spam
    if (urls.length >= 1) return "Yêu cầu không hợp lệ";
  }

  // Repeated characters
  if (/(.)\1{8,}/.test(content)) return "Nội dung không hợp lệ";

  return null;
}

// ── Simple in-memory rate limit (per server instance) ──

type Bucket = { count: number; resetAt: number };

const ipBuckets = new Map<string, Bucket>();
const phoneBuckets = new Map<string, Bucket>();

function hit(
  map: Map<string, Bucket>,
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const b = map.get(key);
  if (!b || now > b.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}

/** Cleanup old buckets occasionally */
function prune(map: Map<string, Bucket>) {
  if (map.size < 500) return;
  const now = Date.now();
  for (const [k, v] of map) {
    if (now > v.resetAt) map.delete(k);
  }
}

/**
 * @returns error message if limited, else null
 */
export function checkRateLimit(ip: string, phone: string): string | null {
  prune(ipBuckets);
  prune(phoneBuckets);

  // 5 requests / IP / 15 phút
  if (!hit(ipBuckets, ip || "unknown", 5, 15 * 60 * 1000)) {
    return "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.";
  }
  // 3 requests / phone / 1 giờ
  const p = formatPhoneDisplay(phone);
  if (!hit(phoneBuckets, p, 3, 60 * 60 * 1000)) {
    return "Số điện thoại này đã gửi quá nhiều lần. Vui lòng thử lại sau.";
  }
  return null;
}

/** Minimum ms between form open and submit (anti-bot) */
export const MIN_FORM_MS = 2500;
