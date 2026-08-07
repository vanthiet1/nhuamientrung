"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Send,
  X,
  Loader2,
  Minimize2,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { company } from "@/lib/data/company";

function ZaloMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      <path
        fill="currentColor"
        d="M24.1 8.5C14.6 8.5 7 15.4 7 24c0 5.1 2.6 9.6 6.7 12.6-.3 1.1-1.1 3.8-1.2 4.4-.2.7.3.7.6.5 1.1-.7 3.5-2.3 4.1-2.7 2.2.7 4.5 1 6.9 1 9.5 0 17.1-6.9 17.1-15.5S33.6 8.5 24.1 8.5Z"
      />
      <path
        fill="#fff"
        d="M18.2 19.2h12.2c.5 0 .8.5.6 1L26.2 28h3.4c.6 0 1 .5 1 1.1v.6c0 .6-.4 1.1-1 1.1H17.6c-.5 0-.8-.5-.6-1L22 21.9h-3.8c-.6 0-1-.5-1-1.1v-.5c0-.6.4-1.1 1-1.1Z"
      />
    </svg>
  );
}

type ChatLine = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const QUICK = [
  "Tôi cần báo giá bao bì",
  "Nên chọn PVC, PE hay POF?",
  "Giao hàng Đà Nẵng mất bao lâu?",
] as const;

const WELCOME: ChatLine = {
  id: "welcome",
  role: "assistant",
  content: `Xin chào! Mình là **ChatBot AI tư vấn** của ${company.shortName}. Hỏi PVC/PE/POF, sản phẩm, giao hàng hoặc báo giá — phản hồi ngay. Cần người thật: gọi ${company.phone} hoặc Chat Zalo.`,
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatLine[]>([WELCOME]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTip, setShowTip] = useState(true);
  const [modeLabel, setModeLabel] = useState("Đang kết nối AI…");
  const [isRealAi, setIsRealAi] = useState<boolean | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    setShowTip(false);
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    // focus input when open
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open, messages, loading]);

  async function sendMessage(raw: string) {
    const content = raw.trim();
    if (!content || loading) return;

    setError("");
    const userLine: ChatLine = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
    };
    const next = [...messages, userLine];
    setMessages(next);
    setText("");
    setLoading(true);

    try {
      const payload = next
        .filter((m) => m.id !== "welcome" || next.length === 2)
        .map((m) => ({ role: m.role, content: m.content }));

      // Always send full conversation for context (cap on server)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({
            role: m.role,
            content: m.content.replace(/\*\*/g, ""),
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "ChatBot tạm gián đoạn.");
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: `Xin lỗi, mình chưa trả lời được. Bạn gọi ${company.phone} hoặc Chat Zalo giúp nhé.`,
          },
        ]);
        return;
      }

      if (data.mode === "ai") {
        setIsRealAi(true);
        setModeLabel("Grok AI · đang suy luận");
      } else {
        setIsRealAi(false);
        // Hết credit / chưa nạp → rule local (không phải LLM)
        if (data.reason === "no_credits") {
          setModeLabel("AI chờ credit xAI");
        } else if (data.reason === "no_key") {
          setModeLabel("Chưa cấu hình AI key");
        } else {
          setModeLabel("Tư vấn nhanh (dự phòng)");
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: String(
            data.reply || "Mình chưa rõ ý bạn, bạn nói thêm được không?"
          ),
        },
      ]);
      void payload;
    } catch {
      setError("Không kết nối được máy chủ chat.");
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: `Kết nối gián đoạn. Gọi hotline ${company.phone} hoặc mở Zalo để được hỗ trợ ngay.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(text);
  }

  function renderInline(s: string, keyPrefix: string): ReactNode[] {
    // [label](/path) then **bold**
    const linkParts = s.split(/(\[[^\]]+\]\([^)]+\))/g);
    return linkParts.map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, href] = link;
        const internal = href.startsWith("/");
        if (internal) {
          return (
            <Link
              key={`${keyPrefix}-l${i}`}
              href={href}
              className="font-bold text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          );
        }
        return (
          <a
            key={`${keyPrefix}-l${i}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-600 underline"
          >
            {label}
          </a>
        );
      }
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((b, j) => {
        if (b.startsWith("**") && b.endsWith("**")) {
          return (
            <strong key={`${keyPrefix}-b${i}-${j}`} className="font-bold">
              {b.slice(2, -2)}
            </strong>
          );
        }
        return <span key={`${keyPrefix}-t${i}-${j}`}>{b}</span>;
      });
    });
  }

  function renderText(s: string) {
    const lines = s.split("\n");
    return lines.map((line, li) => (
      <span key={`ln-${li}`}>
        {li > 0 && <br />}
        {renderInline(line, `ln${li}`)}
      </span>
    ));
  }

  return (
    // Chatbox nằm phía trên nút Gọi + Zalo (thêm, không thay thế)
    <div className="pointer-events-none fixed bottom-[max(calc(1.25rem+8.75rem),calc(env(safe-area-inset-bottom)+8.75rem))] right-[max(0.75rem,env(safe-area-inset-right))] z-[100] flex flex-col items-end gap-3 sm:bottom-[calc(1.75rem+9.25rem)] sm:right-5">
      {open && (
        <div
          className="pointer-events-auto flex w-[min(100vw-1.5rem,23rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.22)]"
          role="dialog"
          aria-label="ChatBot AI tư vấn"
        >
          <div className="flex items-start gap-3 bg-gradient-to-r from-violet-700 via-brand-600 to-sky-600 px-4 py-3.5 text-white">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/25">
              <Bot className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-extrabold leading-tight">
                ChatBot tư vấn miễn phí
                <Sparkles className="h-3.5 w-3.5 text-amber-200" />
              </p>
              <p className="mt-0.5 text-[11px] text-white/85">
                {company.shortName} · {modeLabel}
              </p>
              <p
                className={`mt-1 flex items-center gap-1.5 text-[11px] font-semibold ${
                  isRealAi === false ? "text-amber-200" : "text-emerald-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 animate-pulse rounded-full ${
                    isRealAi === false ? "bg-amber-300" : "bg-emerald-300"
                  }`}
                />
                {isRealAi === false
                  ? "AI thật chưa sẵn sàng (xAI chưa có credit)"
                  : isRealAi
                    ? "AI đang trả lời theo câu hỏi của bạn"
                    : "Sẵn sàng chat"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
              aria-label="Thu nhỏ chat"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2.5">
            <a
              href={company.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0068FF] px-2 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0058db]"
            >
              <ZaloMark className="h-4 w-4" />
              Chat Zalo
            </a>
            <a
              href={`tel:${company.phoneRaw}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Phone className="h-3.5 w-3.5" />
              Gọi {company.phone}
            </a>
          </div>

          <div
            ref={listRef}
            className="flex max-h-[min(46vh,320px)] min-h-[200px] flex-col gap-2.5 overflow-y-auto bg-slate-50/80 px-3 py-3"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "rounded-br-md bg-brand-600 text-white"
                      : "rounded-bl-md border border-slate-100 bg-white text-slate-700"
                  }`}
                >
                  {renderText(m.content)}
                </div>
                {m.role === "user" && (
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <User className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-600" />
                AI đang suy nghĩ theo câu hỏi của bạn…
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-white px-3 py-2">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                disabled={loading}
                onClick={() => void sendMessage(q)}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-2 border-t border-slate-100 bg-white p-3"
          >
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage(text);
                  }
                }}
                placeholder="Hỏi AI: loại màng, quy cách, giao hàng…"
                rows={2}
                maxLength={1200}
                className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="inline-flex h-auto w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow transition hover:bg-violet-700 disabled:opacity-50"
                aria-label="Gửi tin nhắn cho AI"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            {error && (
              <p className="text-[11px] font-medium text-red-600">{error}</p>
            )}
          </form>
        </div>
      )}

      <div className="pointer-events-auto relative flex items-end gap-2">
        {showTip && !open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mb-1 max-w-[12rem] rounded-2xl rounded-br-md border border-violet-100 bg-white px-3 py-2 text-left text-[12px] font-semibold leading-snug text-slate-700 shadow-lg animate-float-soft sm:max-w-[14rem]"
          >
            🤖 ChatBot tư vấn miễn phí
            <span className="mt-0.5 block text-[11px] font-medium text-slate-500">
              PVC / PE / POF · Báo giá · Giao hàng — free
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-brand-700 text-white shadow-[0_10px_28px_rgba(109,40,217,0.45)] ring-4 ring-white transition hover:scale-105 animate-float-bounce sm:h-[60px] sm:w-[60px]"
          aria-label={open ? "Đóng ChatBot AI" : "Mở ChatBot AI tư vấn"}
          aria-expanded={open}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-violet-400 opacity-40 animate-contact-ring"
            aria-hidden
          />
          {open ? (
            <X className="relative h-6 w-6" strokeWidth={2.25} />
          ) : (
            <Bot className="relative h-6 w-6" strokeWidth={2.25} />
          )}
          {!open && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-0.5 text-[8px] font-black text-slate-900 ring-2 ring-white">
              AI
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
