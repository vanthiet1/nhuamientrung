"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Search } from "lucide-react";
import {
  DEFAULT_LANG,
  WORLD_LANGUAGES,
  findLanguage,
  searchLanguages,
} from "@/lib/languages";

const STORAGE_KEY = "site_lang";

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

function setCookie(name: string, value: string, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`;
  document.cookie = `${name}=;path=/;domain=${window.location.hostname};max-age=0;SameSite=Lax`;
  // also clear on parent domain variants google translate sometimes sets
  const host = window.location.hostname;
  const parts = host.split(".");
  if (parts.length > 2) {
    const parent = parts.slice(-2).join(".");
    document.cookie = `${name}=;path=/;domain=.${parent};max-age=0`;
  }
}

function detectLangFromCookie(): string {
  const raw = readCookie("googtrans");
  // formats: /vi/en or /auto/en
  if (raw) {
    const parts = raw.split("/").filter(Boolean);
    if (parts.length >= 2) return parts[parts.length - 1];
  }
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

function applyGoogleLang(lang: string) {
  if (lang === DEFAULT_LANG) {
    clearCookie("googtrans");
    clearCookie("googtrans");
    try {
      localStorage.setItem(STORAGE_KEY, DEFAULT_LANG);
    } catch {
      /* ignore */
    }
    // reset translate combo if present
    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement | null;
    if (select) {
      select.value = DEFAULT_LANG;
      select.dispatchEvent(new Event("change"));
    }
    window.location.reload();
    return;
  }

  setCookie("googtrans", `/${DEFAULT_LANG}/${lang}`);
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }

  const select = document.querySelector(
    ".goog-te-combo"
  ) as HTMLSelectElement | null;
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
    // sometimes need double fire after options load
    setTimeout(() => {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }, 300);
  } else {
    window.location.reload();
  }
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          opts: Record<string, unknown>,
          id: string
        ) => void;
      };
    };
  }
}

export function GoogleTranslateBootstrap() {
  useEffect(() => {
    // hidden element for Google Translate widget
    if (!document.getElementById("google_translate_element")) {
      const el = document.createElement("div");
      el.id = "google_translate_element";
      el.className = "google-translate-root";
      document.body.appendChild(el);
    }

    window.googleTranslateElementInit = () => {
      try {
        if (!window.google?.translate?.TranslateElement) return;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: DEFAULT_LANG,
            includedLanguages: WORLD_LANGUAGES.map((l) => l.code).join(","),
            autoDisplay: false,
            multilanguagePage: true,
          },
          "google_translate_element"
        );

        // re-apply saved lang after widget ready
        const saved = detectLangFromCookie();
        if (saved && saved !== DEFAULT_LANG) {
          setTimeout(() => {
            const select = document.querySelector(
              ".goog-te-combo"
            ) as HTMLSelectElement | null;
            if (select && select.value !== saved) {
              select.value = saved;
              select.dispatchEvent(new Event("change"));
            }
          }, 500);
        }
      } catch {
        /* ignore */
      }
    };

    const existing = document.getElementById("google-translate-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }
  }, []);

  return null;
}

export default function LanguageSwitcher({
  compact = false,
  className = "",
  variant = "dark",
}: {
  compact?: boolean;
  className?: string;
  /** dark = top bar (white text); light = on white background */
  variant?: "dark" | "light";
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState(DEFAULT_LANG);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrent(detectLangFromCookie());
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  const filtered = useMemo(() => searchLanguages(query), [query]);
  const currentLang = findLanguage(current);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur transition ${
          compact ? "" : "sm:px-3 sm:py-1.5 sm:text-sm"
        } ${
          variant === "light"
            ? "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Chọn ngôn ngữ"
      >
        <Globe className="h-3.5 w-3.5 shrink-0 opacity-90" />
        <span className="max-w-[7rem] truncate">
          {currentLang.native || currentLang.name}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 opacity-80 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[80] mt-2 w-[min(92vw,16rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl">
          <div className="border-b border-slate-100 px-3 py-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm ngôn ngữ..."
                suppressHydrationWarning
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
          <ul
            role="listbox"
            className="max-h-72 overflow-y-auto overscroll-contain py-1"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-slate-400">
                Không tìm thấy
              </li>
            )}
            {filtered.map((lang) => {
              const active = lang.code === current;
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    suppressHydrationWarning
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setCurrent(lang.code);
                      setOpen(false);
                      applyGoogleLang(lang.code);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-brand-50 ${
                      active ? "bg-brand-50 font-bold text-brand-700" : "text-slate-800"
                    }`}
                  >
                    <span className="truncate">{lang.native || lang.name}</span>
                    {active && (
                      <Check className="h-4 w-4 shrink-0 text-brand-600" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
