"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CrudTable from "@/components/admin/CrudTable";
import type { CategoryRecord } from "@/lib/cms/types";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <CrudTable
      title="Danh mục"
      description={loading ? "Đang tải..." : `${rows.length} danh mục cha`}
      createHref="/admin/categories/new"
      createLabel="Thêm danh mục"
      rows={rows}
      columns={[
        {
          key: "name",
          header: "Tên",
          render: (r) => <span className="font-semibold text-slate-900">{r.name}</span>,
        },
        {
          key: "slug",
          header: "Slug",
          render: (r) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
              {r.slug}
            </code>
          ),
        },
        {
          key: "sort",
          header: "Thứ tự",
          render: (r) => r.sortOrder,
          className: "w-24",
        },
        {
          key: "desc",
          header: "Mô tả",
          render: (r) => (
            <span className="line-clamp-1 max-w-xs text-slate-500">{r.description}</span>
          ),
        },
      ]}
      onDelete={async (id) => {
        const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
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
