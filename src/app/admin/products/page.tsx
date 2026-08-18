"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowUpDown, Filter } from "lucide-react";
import CrudTable from "@/components/admin/CrudTable";
import type {
  CategoryRecord,
  ProductRecord,
  SubcategoryRecord,
} from "@/lib/cms/types";

function ProductThumb({ src, alt }: { src?: string; alt: string }) {
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

export default function AdminProductsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ProductRecord[]>([]);
  const [cats, setCats] = useState<CategoryRecord[]>([]);
  const [subs, setSubs] = useState<SubcategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting & Filtering State by Category
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc" | "none">("asc");

  async function load() {
    setLoading(true);
    const [r1, r2, r3] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
      fetch("/api/admin/subcategories"),
    ]);
    if (r1.ok) setRows(await r1.json());
    if (r2.ok) setCats(await r2.json());
    if (r3.ok) setSubs(await r3.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const catName = (id: string) => cats.find((c) => c.id === id)?.name || "—";
  const subName = (id: string | null) =>
    id ? subs.find((s) => s.id === id)?.name || "—" : "—";

  // Filter and Sort rows by Category
  const displayRows = useMemo(() => {
    let result = [...rows];

    // 1. Filter by category if selected
    if (selectedCatId !== "all") {
      result = result.filter((r) => r.categoryId === selectedCatId);
    }

    // 2. Sort by category name
    if (sortDir === "asc") {
      result.sort((a, b) =>
        catName(a.categoryId).localeCompare(catName(b.categoryId), "vi")
      );
    } else if (sortDir === "desc") {
      result.sort((a, b) =>
        catName(b.categoryId).localeCompare(catName(a.categoryId), "vi")
      );
    }

    return result;
  }, [rows, selectedCatId, sortDir, cats]);

  const toggleSort = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : prev === "desc" ? "none" : "asc"));
  };

  return (
    <div className="space-y-4">
      {/* Category Filter & Sort Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Lọc theo danh mục:
          </span>
          <select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
          >
            <option value="all">Tất cả danh mục ({rows.length})</option>
            {cats.map((c) => {
              const count = rows.filter((r) => r.categoryId === c.id).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count})
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="button"
          onClick={toggleSort}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
            sortDir !== "none"
              ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          Sắp xếp theo Danh mục:{" "}
          <span className="uppercase text-brand-600">
            {sortDir === "asc" ? "A → Z" : sortDir === "desc" ? "Z → A" : "Mặc định"}
          </span>
        </button>
      </div>

      <CrudTable
        title="Sản phẩm"
        description={
          loading
            ? "Đang tải..."
            : `${displayRows.length} / ${rows.length} sản phẩm`
        }
        createHref="/admin/products/new"
        createLabel="Thêm sản phẩm"
        basePath="/admin/products"
        rows={displayRows}
        columns={[
          {
            key: "image",
            header: "Ảnh",
            className: "w-16",
            hideOnMobile: true,
            render: (r) => <ProductThumb src={r.image} alt={r.name} />,
          },
          {
            key: "name",
            header: "Tên",
            render: (r) => (
              <div className="flex items-start gap-3">
                <span className="md:hidden">
                  <ProductThumb src={r.image} alt={r.name} />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 line-clamp-2">
                    {r.name}
                  </div>
                  <code className="text-[11px] text-slate-400 break-all">
                    {r.slug}
                  </code>
                </div>
              </div>
            ),
          },
          {
            key: "sku",
            header: "Mã SP",
            className: "w-28",
            render: (r) =>
              r.sku ? (
                <code className="rounded-md bg-sky-50 px-1.5 py-0.5 text-xs font-bold text-sky-700 ring-1 ring-sky-100">
                  {r.sku}
                </code>
              ) : (
                <span className="text-xs text-slate-400">—</span>
              ),
          },
          {
            key: "cat",
            header: "Danh mục",
            render: (r) => (
              <span className="text-xs font-semibold text-blue-700">
                {catName(r.categoryId)}
              </span>
            ),
          },
          {
            key: "sub",
            header: "Danh mục con",
            hideOnMobile: true,
            render: (r) => (
              <span className="text-xs text-slate-500">
                {subName(r.subcategoryId)}
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
          const res = await fetch(`/api/admin/products/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            const d = await res.json();
            toast.error(d.error || "Xóa thất bại");
            return;
          }
          toast.success("Xóa thành công!");
          await load();
          router.refresh();
        }}
      />
    </div>
  );
}
