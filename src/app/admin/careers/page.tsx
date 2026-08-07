"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CrudTable from "@/components/admin/CrudTable";
import type { CareerRecord } from "@/lib/cms/types";

export default function AdminCareersPage() {
  const router = useRouter();
  const [rows, setRows] = useState<CareerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/careers");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <CrudTable
      title="Tuyển dụng"
      description={
        loading ? "Đang tải..." : `${rows.length} vị trí tuyển dụng`
      }
      createHref="/admin/careers/new"
      createLabel="Thêm vị trí"
      rows={rows}
      columns={[
        {
          key: "title",
          header: "Vị trí",
          render: (r) => (
            <div>
              <div className="font-semibold text-slate-900">{r.title}</div>
              <code className="text-[11px] text-slate-400">{r.slug}</code>
            </div>
          ),
        },
        {
          key: "location",
          header: "Địa điểm",
          render: (r) => r.location,
        },
        {
          key: "type",
          header: "Hình thức",
          render: (r) => r.type,
        },
        {
          key: "salary",
          header: "Mức lương",
          render: (r) => (
            <span className="text-sm text-slate-600">{r.salary}</span>
          ),
        },
        {
          key: "status",
          header: "Trạng thái",
          render: (r) =>
            r.isActive ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                Đang tuyển
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                Ẩn
              </span>
            ),
        },
      ]}
      onDelete={async (id) => {
        const res = await fetch(`/api/admin/careers/${id}`, {
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
