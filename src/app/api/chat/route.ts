import { NextResponse } from "next/server";
import {
  freeConsultantReply,
  loadCatalog,
  buildSystemPrompt,
} from "@/lib/ai/consultant-context";

export const runtime = "nodejs";

const MAX_HISTORY = 14;
const MAX_MSG_LEN = 2000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 40;

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

/**
 * ChatBot: ưu tiên xAI Grok (suy nghĩ theo từng câu hỏi).
 * Chỉ fallback rule khi không có key / hết credit / lỗi mạng.
 */
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
    const fallback = () => freeConsultantReply(lastUser.content, catalog);

    const apiKey = process.env.XAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({
        reply: fallback(),
        mode: "free",
        reason: "no_key",
      });
    }

    const model = process.env.XAI_MODEL?.trim() || "grok-4.5";
    const system = buildSystemPrompt(catalog);

    // Gửi full hội thoại + câu hỏi mới → model suy luận theo ngữ cảnh
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.65,
        max_tokens: 900,
        messages: [
          { role: "system", content: system },
          ...cleaned.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[chat] xAI", res.status, errText.slice(0, 400));
      let reason: "no_credits" | "ai_error" = "ai_error";
      if (
        res.status === 403 ||
        /credits|license|permission-denied/i.test(errText)
      ) {
        reason = "no_credits";
      }
      return NextResponse.json({
        reply: fallback(),
        mode: "free",
        reason,
      });
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({
        reply: fallback(),
        mode: "free",
        reason: "empty_ai",
      });
    }

    return NextResponse.json({
      reply,
      mode: "ai",
      model,
    });
  } catch (e) {
    console.error("[chat]", e);
    try {
      const catalog = await loadCatalog();
      const body = await request
        .clone()
        .json()
        .catch(() => ({ messages: [] }));
      const msgs = (body?.messages || []) as Msg[];
      const last = [...msgs]
        .reverse()
        .find((m) => m?.role === "user" && m.content);
      return NextResponse.json({
        reply: freeConsultantReply(
          String(last?.content || "xin chào"),
          catalog
        ),
        mode: "free",
        reason: "network",
      });
    } catch {
      return NextResponse.json(
        {
          error: "ChatBot tạm gián đoạn. Vui lòng gọi hotline hoặc Chat Zalo.",
        },
        { status: 500 }
      );
    }
  }
}
