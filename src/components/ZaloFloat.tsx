"use client";

import { Phone } from "lucide-react";
import { company } from "@/lib/data/company";

function ZaloMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      <path
        fill="currentColor"
        d="M24.1 8.5C14.6 8.5 7 15.4 7 24c0 5.1 2.6 9.6 6.7 12.6-.3 1.1-1.1 3.8-1.2 4.4-.2.7.3.7.6.5 1.1-.7 3.5-2.3 4.1-2.7 2.2.7 4.5 1 6.9 1 9.5 0 17.1-6.9 17.1-15.5S33.6 8.5 24.1 8.5Z"
      />
      <path
        fill="#0068FF"
        d="M18.2 19.2h12.2c.5 0 .8.5.6 1L26.2 28h3.4c.6 0 1 .5 1 1.1v.6c0 .6-.4 1.1-1 1.1H17.6c-.5 0-.8-.5-.6-1L22 21.9h-3.8c-.6 0-1-.5-1-1.1v-.5c0-.6.4-1.1 1-1.1Z"
      />
    </svg>
  );
}

function PulseRings({ colorClass }: { colorClass: string }) {
  return (
    <>
      <span
        className={`pointer-events-none absolute inset-0 rounded-full ${colorClass} opacity-40 animate-contact-ring`}
        aria-hidden
      />
      <span
        className={`pointer-events-none absolute inset-0 rounded-full ${colorClass} opacity-30 animate-contact-ring [animation-delay:0.9s]`}
        aria-hidden
      />
    </>
  );
}

export default function ZaloFloat() {
  return (
    <div className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-[90] flex flex-col items-end gap-3 sm:bottom-7 sm:right-5">
      {/* Hotline — always visible + bounce */}
      <a
        href={`tel:${company.phoneRaw}`}
        className="pointer-events-auto group relative flex items-center justify-end animate-float-bounce"
        aria-label={`Gọi hotline ${company.phone}`}
        style={{ animationDelay: "0s" }}
      >
        <span className="mr-3 max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white/95 px-0 py-2 text-xs font-bold text-emerald-700 opacity-0 shadow-[0_8px_24px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/80 backdrop-blur transition-all duration-300 group-hover:max-w-[12rem] group-hover:px-3.5 group-hover:opacity-100 group-focus-visible:max-w-[12rem] group-focus-visible:px-3.5 group-focus-visible:opacity-100 sm:max-w-none sm:px-3.5 sm:opacity-100">
          Gọi {company.phone}
        </span>
        <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_10px_28px_rgba(16,185,129,0.45)] ring-4 ring-white transition duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_32px_rgba(16,185,129,0.55)] sm:h-14 sm:w-14">
          <PulseRings colorClass="bg-emerald-400" />
          <Phone className="relative h-[22px] w-[22px] drop-shadow-sm" strokeWidth={2.25} />
        </span>
      </a>

      {/* Zalo — always visible + bounce (staggered) */}
      <a
        href={company.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center justify-end animate-float-bounce"
        aria-label="Chat Zalo tư vấn"
        style={{ animationDelay: "0.35s" }}
      >
        <span className="mr-3 max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white/95 px-0 py-2 text-xs font-bold text-[#0068FF] opacity-0 shadow-[0_8px_24px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/80 backdrop-blur transition-all duration-300 group-hover:max-w-[12rem] group-hover:px-3.5 group-hover:opacity-100 group-focus-visible:max-w-[12rem] group-focus-visible:px-3.5 group-focus-visible:opacity-100 sm:max-w-none sm:px-3.5 sm:opacity-100">
          Chat Zalo ngay
        </span>
        <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#2f80ff] to-[#0068FF] text-white shadow-[0_10px_28px_rgba(0,104,255,0.45)] ring-4 ring-white transition duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_32px_rgba(0,104,255,0.55)] sm:h-14 sm:w-14">
          <PulseRings colorClass="bg-[#0068FF]" />
          <ZaloMark className="relative h-8 w-8 drop-shadow-sm" />
        </span>
      </a>
    </div>
  );
}
