"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import JsonLd from "./JsonLd";
import { faqPageJsonLd } from "@/lib/seo/faq";

export type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({
  title = "Câu hỏi thường gặp (FAQ)",
  items,
}: {
  title?: string;
  items: FaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-4xl pt-8 pb-12">
      <JsonLd data={[faqPageJsonLd(items)]} />
      <h2 className="mb-6 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:px-6 sm:py-5"
              aria-expanded={openIndex === i}
            >
              <span className="pr-4 text-base sm:text-lg">{item.question}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 ${
                  openIndex === i ? "rotate-180 bg-brand-100 text-brand-600" : ""
                }`}
              >
                <ChevronDown className="h-5 w-5" />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 pb-5 pt-4 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pb-6 sm:text-base">
                  {item.answer.split('\n').map((line, li) => (
                    <span key={li}>
                      {line}
                      {li < item.answer.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
