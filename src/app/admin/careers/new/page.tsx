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
import { slugify } from "@/lib/slugify";

export default function NewCareerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  /** true when user edits slug manually — stop auto-fill */
  const [slugLocked, setSlugLocked] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/careers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        slug: (fd.get("slug") as string)?.trim() || undefined,
        location: fd.get("location"),
        type: fd.get("type"),
        salary: fd.get("salary"),
        description: fd.get("description"),
        requirements: String(fd.get("requirements") || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
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
    router.push("/admin/careers");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-extrabold text-slate-900 sm:mb-6 sm:text-2xl">
        Thêm vị trí tuyển dụng
      </h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <Field label="Tên vị trí" required>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              if (!slugLocked) setSlug(slugify(next));
            }}
            className={inputClass}
            placeholder="Nhân viên kinh doanh bao bì"
          />
        </Field>
        <Field
          label="Slug"
          hint={
            slugLocked
              ? "Bạn đã sửa slug thủ công — không còn tự điền"
              : "Tự tạo từ tên vị trí (có thể sửa tay)"
          }
        >
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugLocked(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
            placeholder="nhan-vien-kinh-doanh-bao-bi"
          />
          {slugLocked && (
            <button
              type="button"
              className="mt-1.5 text-xs font-semibold text-brand-600 hover:underline"
              onClick={() => {
                setSlugLocked(false);
                setSlug(slugify(title));
              }}
            >
              Bật lại tự điền từ tên
            </button>
          )}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Địa điểm">
            <input
              name="location"
              defaultValue="Đà Nẵng"
              className={inputClass}
            />
          </Field>
          <Field label="Hình thức">
            <input
              name="type"
              defaultValue="Toàn thời gian"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Mức lương">
          <input
            name="salary"
            defaultValue="Thỏa thuận"
            className={inputClass}
          />
        </Field>
        <Field label="Mô tả công việc">
          <textarea name="description" className={textareaClass} rows={4} />
        </Field>
        <Field label="Yêu cầu" hint="Mỗi dòng một yêu cầu">
          <textarea
            name="requirements"
            className={textareaClass}
            rows={5}
            placeholder={"Kinh nghiệm 1–2 năm\nKỹ năng giao tiếp tốt"}
          />
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
