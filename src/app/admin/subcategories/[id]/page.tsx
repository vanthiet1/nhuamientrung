"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, FormActions, inputClass, textareaClass } from "@/components/admin/FormField";
import type { CategoryRecord, SubcategoryRecord } from "@/lib/cms/types";

export default function EditSubcategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<SubcategoryRecord | null>(null);
  const [cats, setCats] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/subcategories/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([sub, catList]) => {
      if (sub.error) setError(sub.error);
      else setItem(sub);
      if (Array.isArray(catList)) setCats(catList);
    });
  }, [id]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/subcategories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        slug: fd.get("slug"),
        description: fd.get("description"),
        categoryId: fd.get("categoryId"),
        sortOrder: Number(fd.get("sortOrder") || 0),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Lỗi lưu");
      setLoading(false);
      return;
    }
    router.push("/admin/subcategories");
    router.refresh();
  }

  if (!item && !error) return <p className="text-slate-500">Đang tải...</p>;
  if (!item) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">Sửa danh mục con</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Field label="Danh mục cha" required>
          <select name="categoryId" required className={inputClass} defaultValue={item.categoryId}>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tên" required>
          <input name="name" required defaultValue={item.name} className={inputClass} />
        </Field>
        <Field label="Slug">
          <input name="slug" defaultValue={item.slug} className={inputClass} />
        </Field>
        <Field label="Mô tả">
          <textarea name="description" defaultValue={item.description} className={textareaClass} rows={3} />
        </Field>
        <Field label="Thứ tự">
          <input name="sortOrder" type="number" defaultValue={item.sortOrder} className={inputClass} />
        </Field>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <FormActions cancelHref="/admin/subcategories" loading={loading} />
      </form>
    </div>
  );
}
