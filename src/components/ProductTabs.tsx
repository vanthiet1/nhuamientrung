"use client";

import { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";

export default function ProductTabs({
  descriptionNode,
  reviewsNode,
  reviewCount,
}: {
  descriptionNode: React.ReactNode;
  reviewsNode: React.ReactNode;
  reviewCount: number;
}) {
  const [activeTab, setActiveTab] = useState<"desc" | "reviews">("desc");

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("desc")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
            activeTab === "desc"
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="h-4 w-4" />
          Mô tả sản phẩm
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
            activeTab === "reviews"
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Đánh giá ({reviewCount})
        </button>
      </div>

      <div className="pt-2">
        {activeTab === "desc" && descriptionNode}
        {activeTab === "reviews" && reviewsNode}
      </div>
    </div>
  );
}
