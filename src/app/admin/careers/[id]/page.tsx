"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Field,
  FormActions,
  inputClass,
  textareaClass,
} from "@/components/admin/FormField";
import type { CareerRecord } from "@/lib/cms/types";

export default function EditCareerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<CareerRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/careers/${id}`)
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
    const res = await fetch(`/api/admin/careers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        slug: fd.get("slug"),
        location: fd.get("location"),
        type: fd.get("type"),
        salary: fd.get("salary"),
        description: fd.get("description"),
        requirements: String(fd.get("requirements") || ""),
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
    router.push("/admin/careers");
    router.refresh();
  }

  if (!item && !error) return <p className="text-slate-500">Đang tải...</p>;
  if (!item) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">
        Sửa vị trí tuyển dụng
      </h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <Field label="Tên vị trí" required>
          <input
            name="title"
            required
            defaultValue={item.title}
            className={inputClass}
          />
        </Field>
        <Field label="Slug">
          <input name="slug" defaultValue={item.slug} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Địa điểm">
            <input
              name="location"
              defaultValue={item.location}
              className={inputClass}
            />
          </Field>
          <Field label="Hình thức">
            <input name="type" defaultValue={item.type} className={inputClass} />
          </Field>
        </div>
        <Field label="Mức lương">
          <input
            name="salary"
            defaultValue={item.salary}
            className={inputClass}
          />
        </Field>
        <Field label="Mô tả công việc">
          <textarea
            name="description"
            defaultValue={item.description}
            className={textareaClass}
            rows={4}
          />
        </Field>
        <Field label="Yêu cầu" hint="Mỗi dòng một yêu cầu">
          <textarea
            name="requirements"
            defaultValue={item.requirements.join("\n")}
            className={textareaClass}
            rows={5}
          />
        </Field>
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
                className="h-4 w-4 rounded border-slate-300 text-brand-600"
              />
              Đang tuyển (hiển thị website)
            </label>
          </div>
        </div>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <FormActions cancelHref="/admin/careers" loading={loading} />
      </form>
    </div>
  );
}
