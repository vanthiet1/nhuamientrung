"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CrudTable from "@/components/admin/CrudTable";
import type { BannerRecord } from "@/lib/cms/types";

function BannerThumb({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-[10px] font-bold text-white ring-1 ring-slate-200">
        Gradient
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-12 w-20 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function AdminBannersPage() {
  const router = useRouter();
  const [rows, setRows] = useState<BannerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/banners");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <CrudTable
      title="Banner Hero"
      description={
        loading
          ? "Đang tải..."
          : `${rows.length} banner · hiển thị trên trang chủ`
      }
      createHref="/admin/banners/new"
      createLabel="Thêm banner"
      basePath="/admin/banners"
      rows={rows}
      columns={[
        {
          key: "image",
          header: "Ảnh",
          className: "w-24",
          hideOnMobile: true,
          render: (r) => <BannerThumb src={r.image} alt={r.title} />,
        },
        {
          key: "title",
          header: "Tiêu đề",
          render: (r) => (
            <div className="flex items-start gap-3">
              <span className="md:hidden">
                <BannerThumb src={r.image} alt={r.title} />
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 line-clamp-2">
                  {r.title}
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                  {r.subtitle}
                </p>
              </div>
            </div>
          ),
        },
        {
          key: "cta",
          header: "Nút CTA",
          hideOnMobile: true,
          render: (r) => (
            <span className="text-xs font-semibold text-slate-600">
              {r.cta || "—"}
            </span>
          ),
        },
        {
          key: "order",
          header: "Thứ tự",
          className: "w-20",
          render: (r) => (
            <span className="text-xs font-bold text-slate-500">
              {r.sortOrder}
            </span>
          ),
        },
        {
          key: "status",
          header: "Trạng thái",
          render: (r) =>
            r.isActive ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                Hiện
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                Ẩn
              </span>
            ),
        },
      ]}
      onDelete={async (id) => {
        const res = await fetch(`/api/admin/banners/${id}`, {
          method: "DELETE",
        });
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
