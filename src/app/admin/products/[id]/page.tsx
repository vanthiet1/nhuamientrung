"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, FormActions, inputClass, textareaClass } from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import type {
  CategoryRecord,
  ProductRecord,
  SubcategoryRecord,
} from "@/lib/cms/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<ProductRecord | null>(null);
  const [cats, setCats] = useState<CategoryRecord[]>([]);
  const [subs, setSubs] = useState<SubcategoryRecord[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/subcategories").then((r) => r.json()),
    ]).then(([p, c, s]) => {
      if (p.error) setError(p.error);
      else {
        setItem(p);
        setCategoryId(p.categoryId);
      }
      if (Array.isArray(c)) setCats(c);
      if (Array.isArray(s)) setSubs(s);
    });
  }, [id]);

  const filteredSubs = useMemo(
    () => subs.filter((s) => s.categoryId === categoryId),
    [subs, categoryId]
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        slug: fd.get("slug"),
        sku: fd.get("sku") || "",
        description: fd.get("description"),
        content: fd.get("content"),
        categoryId: fd.get("categoryId"),
        subcategoryId: fd.get("subcategoryId") || null,
        image: fd.get("image") || "",
        isActive: fd.get("isActive") === "on",
        sortOrder: Number(fd.get("sortOrder") || 0),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Lỗi lưu");
      setLoading(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  if (!item && !error) return <p className="text-slate-500">Đang tải...</p>;
  if (!item) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-extrabold text-slate-900 sm:mb-6 sm:text-2xl">
        Sửa sản phẩm
      </h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <Field label="Tên sản phẩm" required>
          <input name="name" required defaultValue={item.name} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Mã sản phẩm (SKU)"
            hint="Ví dụ: PVC-08, MCI-PE001 — không trùng"
          >
            <input
              name="sku"
              defaultValue={item.sku || ""}
              className={inputClass}
              placeholder="VD: TP-PVC-001"
              autoComplete="off"
            />
          </Field>
          <Field label="Slug">
            <input name="slug" defaultValue={item.slug} className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Danh mục" required>
            <select
              name="categoryId"
              required
              className={inputClass}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Danh mục con">
            <select
              name="subcategoryId"
              className={inputClass}
              defaultValue={item.subcategoryId || ""}
              key={categoryId + (item.subcategoryId || "")}
            >
              <option value="">— Không —</option>
              {filteredSubs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Mô tả ngắn">
          <textarea
            name="description"
            defaultValue={item.description}
            className={textareaClass}
            rows={3}
          />
        </Field>
        <Field label="Nội dung chi tiết">
          <textarea
            name="content"
            defaultValue={item.content}
            className={textareaClass}
            rows={8}
          />
        </Field>
        <ImageUpload
          name="image"
          folder="catalog"
          label="Hình ảnh sản phẩm"
          defaultValue={item.image || ""}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Thứ tự">
            <input
              name="sortOrder"
              type="number"
              defaultValue={item.sortOrder}
              className={inputClass}
            />
          </Field>
          <div className="flex items-end pb-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={item.isActive}
                className="h-4 w-4 rounded border-slate-300 text-sky-500"
              />
              Hiển thị trên website
            </label>
          </div>
        </div>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <FormActions cancelHref="/admin/products" loading={loading} />
      </form>
    </div>
  );
}
