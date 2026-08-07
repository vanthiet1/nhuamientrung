import { NextResponse } from "next/server";
import {
  freeConsultantReply,
  loadCatalog,
} from "@/lib/ai/consultant-context";

export const runtime = "nodejs";

const MAX_HISTORY = 12;
const MAX_MSG_LEN = 1200;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;

const hits = new Map<string, { n: number; t: number }>();

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimit(ip: string): string | null {
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now - cur.t > RATE_WINDOW_MS) {
    hits.set(ip, { n: 1, t: now });
    return null;
  }
  cur.n += 1;
  if (cur.n > RATE_MAX) {
    return "Bạn gửi hơi nhanh. Vui lòng thử lại sau ít phút.";
  }
  return null;
}

type Msg = { role: "user" | "assistant" | "system"; content: string };

/** ChatBot tư vấn free — catalog + rule, không gọi xAI / LLM trả phí */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const messages = (body?.messages || []) as Msg[];
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Thiếu nội dung hội thoại" },
        { status: 400 }
      );
    }

    const ip = clientIp(request);
    const limited = rateLimit(ip);
    if (limited) {
      return NextResponse.json({ error: limited }, { status: 429 });
    }

    const cleaned = messages
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content.trim().slice(0, MAX_MSG_LEN),
      }))
      .filter((m) => m.content.length > 0)
      .slice(-MAX_HISTORY);

    const lastUser = [...cleaned].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      return NextResponse.json(
        { error: "Cần có tin nhắn từ khách" },
        { status: 400 }
      );
    }

    const catalog = await loadCatalog();
    const reply = freeConsultantReply(lastUser.content, catalog);

    return NextResponse.json({ reply, mode: "free" });
  } catch (e) {
    console.error("[chat]", e);
    return NextResponse.json(
      {
        error: "ChatBot tạm gián đoạn. Vui lòng gọi hotline hoặc Chat Zalo.",
      },
      { status: 500 }
    );
  }
}
