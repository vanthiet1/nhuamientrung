"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CrudTable from "@/components/admin/CrudTable";
import type { NewsRecord } from "@/lib/cms/types";

function NewsThumb({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-400 ring-1 ring-slate-200 sm:h-14 sm:w-14">
        N/A
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-slate-200 sm:h-14 sm:w-14"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function AdminNewsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/news");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <CrudTable
      title="Tin tức"
      description={loading ? "Đang tải..." : `${rows.length} bài viết`}
      createHref="/admin/news/new"
      createLabel="Thêm tin tức"
      basePath="/admin/news"
      rows={rows}
      columns={[
        {
          key: "image",
          header: "Ảnh",
          className: "w-16",
          hideOnMobile: true,
          render: (r) => <NewsThumb src={r.image} alt={r.title} />,
        },
        {
          key: "title",
          header: "Tiêu đề",
          render: (r) => (
            <div className="flex items-start gap-3">
              <span className="md:hidden">
                <NewsThumb src={r.image} alt={r.title} />
              </span>
              <div className="min-w-0">
                <div className="line-clamp-2 font-semibold text-slate-900">
                  {r.title}
                </div>
                <code className="break-all text-[11px] text-slate-400">
                  {r.slug}
                </code>
              </div>
            </div>
          ),
        },
        {
          key: "date",
          header: "Ngày",
          render: (r) => r.date,
          className: "w-32",
        },
        {
          key: "status",
          header: "Trạng thái",
          render: (r) =>
            r.isPublished ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                Xuất bản
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                Nháp
              </span>
            ),
        },
      ]}
      onDelete={async (id) => {
        const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const d = await res.json();
          alert(d.error || "Xóa thất bại");
          return;
        }
        await load();
        router.refresh();
      }}
    />
  );
}
