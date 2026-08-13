"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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

  return (
    <CrudTable
      title="Sản phẩm"
      description={loading ? "Đang tải..." : `${rows.length} sản phẩm`}
      createHref="/admin/products/new"
      createLabel="Thêm sản phẩm"
      basePath="/admin/products"
      rows={rows}
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
  );
}
