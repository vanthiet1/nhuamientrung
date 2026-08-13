"use client";

import toast from "react-hot-toast";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, FormActions, inputClass, textareaClass } from "@/components/admin/FormField";
import type { CategoryRecord } from "@/lib/cms/types";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<CategoryRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/categories/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setItem(d);
      });
  }, [id]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        slug: fd.get("slug"),
        description: fd.get("description"),
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
    router.push("/admin/categories");
    router.refresh();
  }

  if (!item && !error) {
    return <p className="text-slate-500">Đang tải...</p>;
  }

  if (!item) {
    return <p className="text-red-600">{error || "Không tìm thấy"}</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">Sửa danh mục</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Field label="Tên danh mục" required>
          <input name="name" required defaultValue={item.name} className={inputClass} />
        </Field>
        <Field label="Slug">
          <input name="slug" defaultValue={item.slug} className={inputClass} />
        </Field>
        <Field label="Mô tả">
          <textarea name="description" defaultValue={item.description} className={textareaClass} rows={4} />
        </Field>
        <Field label="Thứ tự">
          <input name="sortOrder" type="number" defaultValue={item.sortOrder} className={inputClass} />
        </Field>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <FormActions cancelHref="/admin/categories" loading={loading} />
      </form>
    </div>
  );
}
