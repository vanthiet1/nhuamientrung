"use client";

import toast from "react-hot-toast";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormActions, inputClass, textareaClass } from "@/components/admin/FormField";
import type { CategoryRecord } from "@/lib/cms/types";

export default function NewSubcategoryPage() {
  const router = useRouter();
  const [cats, setCats] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setCats(d));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        slug: fd.get("slug") || undefined,
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
    toast.success("Đã lưu thành công!");
    router.push("/admin/subcategories");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">Thêm danh mục con</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Field label="Danh mục cha" required>
          <select name="categoryId" required className={inputClass} defaultValue="">
            <option value="" disabled>
              — Chọn danh mục —
            </option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tên danh mục con" required>
          <input name="name" required className={inputClass} />
        </Field>
        <Field label="Slug" hint="Để trống sẽ tự tạo">
          <input name="slug" className={inputClass} />
        </Field>
        <Field label="Mô tả">
          <textarea name="description" className={textareaClass} rows={3} />
        </Field>
        <Field label="Thứ tự">
          <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
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
