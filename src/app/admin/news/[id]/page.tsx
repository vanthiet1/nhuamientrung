"use client";

import toast from "react-hot-toast";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, FormActions, inputClass, textareaClass } from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import type { NewsRecord } from "@/lib/cms/types";
import { cleanRawContent } from "@/lib/cms/content-links";

export default function EditNewsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<NewsRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/news/${id}`)
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
    const res = await fetch(`/api/admin/news/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        slug: fd.get("slug"),
        excerpt: fd.get("excerpt"),
        content: fd.get("content"),
        date: fd.get("date"),
        image: fd.get("image") || "",
        isPublished: fd.get("isPublished") === "on",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Lỗi lưu");
      setLoading(false);
      return;
    }
    toast.success("Đã lưu thành công!");
    router.push("/admin/news");
    router.refresh();
  }

  if (!item && !error) return <p className="text-slate-500">Đang tải...</p>;
  if (!item) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-4 text-xl font-extrabold text-slate-900 sm:mb-6 sm:text-2xl">
        Sửa tin tức
      </h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <Field label="Tiêu đề" required>
          <input name="title" required defaultValue={item.title} className={inputClass} />
        </Field>
        <Field label="Slug">
          <input name="slug" defaultValue={item.slug} className={inputClass} />
        </Field>
        <RichTextEditor
          name="excerpt"
          label="Mô tả ngắn"
          defaultValue={cleanRawContent(item.excerpt || "", false).replace(/<[^>]*>/g, "").trim()}
        />
        <RichTextEditor
          name="content"
          label="Nội dung"
          defaultValue={cleanRawContent(item.content || "", false)}
        />
        <Field label="Ngày đăng">
          <input name="date" type="date" defaultValue={item.date} className={inputClass} />
        </Field>
        <ImageUpload
          name="image"
          folder="news"
          label="Hình ảnh tin tức"
          hint="Upload ảnh lên Supabase Storage hoặc dán URL hình ảnh có sẵn"
          defaultValue={item.image || ""}
        />
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            name="isPublished"
            type="checkbox"
            defaultChecked={item.isPublished}
            className="h-4 w-4 rounded border-slate-300 text-sky-500"
          />
          Xuất bản
        </label>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <FormActions cancelHref="/admin/news" loading={loading} />
      </form>
    </div>
  );
}
