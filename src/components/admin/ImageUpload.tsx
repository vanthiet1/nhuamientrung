"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { Field, inputClass } from "@/components/admin/FormField";

type ImageUploadProps = {
  name?: string;
  label?: string;
  defaultValue?: string;
  folder?: string;
  hint?: string;
};

export default function ImageUpload({
  name = "image",
  label = "Hình ảnh",
  defaultValue = "",
  folder = "products",
  hint = "Upload lên Supabase Storage hoặc dán URL ảnh có sẵn",
}: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload thất bại");
      }
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void uploadFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  return (
    <Field label={label} hint={hint}>
      <input type="hidden" name={name} value={url} />

      <div className="space-y-3">
        {/* Preview + dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition ${
            dragOver
              ? "border-brand-500 bg-brand-50"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          {url ? (
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Preview"
                className="h-full w-full object-contain bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector("[data-img-empty]")) {
                    const empty = document.createElement("div");
                    empty.dataset.imgEmpty = "1";
                    empty.className =
                      "absolute inset-0 flex items-center justify-center bg-slate-100 text-xs font-semibold text-slate-400";
                    empty.textContent = "Ảnh không tải được";
                    parent.insertBefore(empty, parent.firstChild);
                  }
                }}
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow hover:bg-white"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Đổi ảnh
                </button>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setUrl("");
                    setError("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/95 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Xóa
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-center sm:py-12"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <ImagePlus className="h-6 w-6" />
                )}
              </span>
              <span className="text-sm font-bold text-slate-800">
                {uploading ? "Đang tải lên Supabase..." : "Kéo thả hoặc chọn ảnh"}
              </span>
              <span className="text-xs text-slate-500">
                JPEG, PNG, WebP, GIF · tối đa 5MB
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Đang upload..." : "Upload ảnh lên Storage"}
          </button>
          <span className="text-center text-xs text-slate-400 sm:text-left">
            hoặc dán URL bên dưới
          </span>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            URL hình ảnh
          </label>
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value.trimStart());
                setError("");
              }}
              placeholder="https://... (dán link ảnh)"
              className={`${inputClass} pl-10`}
              inputMode="url"
              autoComplete="off"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={onFileChange}
        />
      </div>
    </Field>
  );
}
