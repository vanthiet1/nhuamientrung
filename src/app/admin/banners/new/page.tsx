"use client";

import toast from "react-hot-toast";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Field,
  FormActions,
  inputClass,
  textareaClass,
} from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";

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

export default function NewBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/banners", {
      method: "POST",
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

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-extrabold text-slate-900 sm:mb-6 sm:text-2xl">
        Thêm banner Hero
      </h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <Field label="Tiêu đề" required>
          <input
            name="title"
            required
            className={inputClass}
            placeholder="Giải pháp bao bì chuyên nghiệp"
          />
        </Field>
        <Field label="Mô tả ngắn">
          <textarea
            name="subtitle"
            className={textareaClass}
            rows={3}
            placeholder="Màng co PVC · PE · POF..."
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Badge (nhãn nhỏ)">
            <input
              name="badge"
              className={inputClass}
              placeholder="Thành Phát Bao Bì"
              defaultValue="Thành Phát Bao Bì"
            />
          </Field>
          <Field label="Nút CTA">
            <input
              name="cta"
              className={inputClass}
              placeholder="Xem sản phẩm"
              defaultValue="Xem sản phẩm"
            />
          </Field>
        </div>
        <Field label="Link nút CTA" hint="VD: /san-pham, /lien-he">
          <input
            name="href"
            className={inputClass}
            defaultValue="/san-pham"
            placeholder="/san-pham"
          />
        </Field>
        <ImageUpload
          name="image"
          folder="banners"
          label="Ảnh banner"
          hint="Upload ảnh nền hero (khuyến nghị 1920×800). Để trống sẽ dùng gradient."
        />
        <Field label="Gradient dự phòng" hint="Dùng khi không có ảnh nền">
          <select name="gradient" className={inputClass} defaultValue={GRADIENTS[0].value}>
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
              defaultValue={0}
              className={inputClass}
            />
          </Field>
          <div className="flex items-end pb-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked
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
