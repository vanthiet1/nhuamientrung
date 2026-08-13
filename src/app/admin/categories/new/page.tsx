"use client";

import toast from "react-hot-toast";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormActions, inputClass, textareaClass } from "@/components/admin/FormField";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        slug: fd.get("slug") || undefined,
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

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">Thêm danh mục</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Field label="Tên danh mục" required>
          <input name="name" required className={inputClass} placeholder="Màng co PVC" />
        </Field>
        <Field label="Slug" hint="Để trống sẽ tự tạo từ tên">
          <input name="slug" className={inputClass} placeholder="mang-co-pvc" />
        </Field>
        <Field label="Mô tả">
          <textarea name="description" className={textareaClass} rows={4} />
        </Field>
        <Field label="Thứ tự">
          <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
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
