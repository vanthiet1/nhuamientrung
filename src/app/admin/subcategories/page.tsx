"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CrudTable from "@/components/admin/CrudTable";
import type { CategoryRecord, SubcategoryRecord } from "@/lib/cms/types";

export default function AdminSubcategoriesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<SubcategoryRecord[]>([]);
  const [cats, setCats] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [r1, r2] = await Promise.all([
      fetch("/api/admin/subcategories"),
      fetch("/api/admin/categories"),
    ]);
    if (r1.ok) setRows(await r1.json());
    if (r2.ok) setCats(await r2.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const catName = (id: string) => cats.find((c) => c.id === id)?.name || "—";

  return (
    <CrudTable
      title="Danh mục con"
      description={loading ? "Đang tải..." : `${rows.length} danh mục con`}
      createHref="/admin/subcategories/new"
      createLabel="Thêm danh mục con"
      rows={rows}
      columns={[
        {
          key: "name",
          header: "Tên",
          render: (r) => <span className="font-semibold text-slate-900">{r.name}</span>,
        },
        {
          key: "parent",
          header: "Danh mục cha",
          render: (r) => (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {catName(r.categoryId)}
            </span>
          ),
        },
        {
          key: "slug",
          header: "Slug",
          render: (r) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{r.slug}</code>
          ),
        },
        {
          key: "sort",
          header: "Thứ tự",
          render: (r) => r.sortOrder,
          className: "w-24",
        },
      ]}
      onDelete={async (id) => {
        const res = await fetch(`/api/admin/subcategories/${id}`, { method: "DELETE" });
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
