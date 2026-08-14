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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-4xl pt-8 pb-16">
      <JsonLd data={[faqPageJsonLd(items)]} />
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold uppercase text-slate-900 sm:text-3xl">
          {title}
        </h2>
        <div className="mx-auto mt-4 h-0.5 w-16 bg-[#395c8c]"></div>
      </div>
      <div className="space-y-0">
        {items.map((item, i) => (
          <div
            key={i}
            className={`border-b border-slate-200 bg-white transition-all ${
              i === 0 ? "border-t" : ""
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between py-4 text-left font-bold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:py-5"
              aria-expanded={openIndex === i}
            >
              <span className="pr-4 text-base sm:text-lg">{item.question}</span>
              <span
                className={`flex shrink-0 items-center justify-center text-slate-500 transition-transform duration-300 ${
                  openIndex === i ? "rotate-180 text-[#395c8c]" : ""
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
                <div className="pb-5 pt-1 text-sm leading-relaxed text-slate-600 sm:pb-6 sm:text-base">
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
