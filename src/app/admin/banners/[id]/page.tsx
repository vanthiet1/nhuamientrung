"use client";

import toast from "react-hot-toast";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Field,
  FormActions,
  inputClass,
  textareaClass,
} from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import type { BannerRecord } from "@/lib/cms/types";

const GRADIENTS = [
  {
    value: "from-brand-800 via-brand-600 to-brand-500",
    label: "Xanh brand",
  },
  {
    value: "from-brand-800 via-brand-600 to-sky-500",
    label: "Xanh → sky",
  },
  {
    value: "from-teal-800 via-teal-600 to-emerald-500",
    label: "Teal → emerald",
  },
  {
    value: "from-indigo-900 via-indigo-700 to-violet-500",
    label: "Indigo → violet",
  },
  {
    value: "from-slate-900 via-slate-700 to-brand-600",
    label: "Slate → brand",
  },
];

export default function EditBannerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<BannerRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/banners/${id}`)
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
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        subtitle: fd.get("subtitle"),
        badge: fd.get("badge"),
        cta: fd.get("cta"),
        href: fd.get("href"),
        image: fd.get("image") || "",
        gradient: fd.get("gradient"),
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
    toast.success("Đã lưu thành công!");
    router.push("/admin/banners");
    router.refresh();
  }

  if (!item && !error) return <p className="text-slate-500">Đang tải...</p>;
  if (!item) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-extrabold text-slate-900 sm:mb-6 sm:text-2xl">
        Sửa banner Hero
      </h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <Field label="Tiêu đề" required>
          <input
            name="title"
            required
            defaultValue={item.title}
            className={inputClass}
          />
        </Field>
        <Field label="Mô tả ngắn">
          <textarea
            name="subtitle"
            defaultValue={item.subtitle}
            className={textareaClass}
            rows={3}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Badge (nhãn nhỏ)">
            <input
              name="badge"
              defaultValue={item.badge}
              className={inputClass}
            />
          </Field>
          <Field label="Nút CTA">
            <input name="cta" defaultValue={item.cta} className={inputClass} />
          </Field>
        </div>
        <Field label="Link nút CTA">
          <input name="href" defaultValue={item.href} className={inputClass} />
        </Field>
        <ImageUpload
          name="image"
          folder="banners"
          label="Ảnh banner"
          hint="Upload ảnh nền hero. Để trống sẽ dùng gradient."
          defaultValue={item.image || ""}
        />
        <Field label="Gradient dự phòng">
          <select
            name="gradient"
            className={inputClass}
            defaultValue={item.gradient}
          >
            {GRADIENTS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
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
                className="h-4 w-4 rounded border-slate-300 text-sky-500"
              />
              Hiển thị trên trang chủ
            </label>
          </div>
        </div>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <FormActions cancelHref="/admin/banners" loading={loading} />
      </form>
    </div>
  );
}
