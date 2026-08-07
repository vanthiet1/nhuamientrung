"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Eye,
  EyeOff,
  Trash2,
  MessageSquareText,
  ExternalLink,
  Briefcase,
  FileText,
} from "lucide-react";
import type { ContactMessageRecord } from "@/lib/cms/types";
import { notifyContactsUpdated } from "@/components/admin/AdminShell";
import { useConfirm } from "@/components/admin/ConfirmDialog";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminContactsPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const [rows, setRows] = useState<ContactMessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "unread" | "read" | "contact" | "career"
  >("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/contacts");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = rows.filter((r) => {
    if (filter === "unread") return !r.isRead;
    if (filter === "read") return r.isRead;
    if (filter === "contact") return (r.type || "contact") === "contact";
    if (filter === "career") return r.type === "career";
    return true;
  });

  const unread = rows.filter((r) => !r.isRead).length;
  const careerCount = rows.filter((r) => r.type === "career").length;

  async function toggleRead(id: string, isRead: boolean) {
    const res = await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    if (res.ok) {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isRead } : r))
      );
      notifyContactsUpdated();
      router.refresh();
    }
  }

  async function remove(id: string) {
    const ok = await confirm({
      title: "Xóa yêu cầu liên hệ?",
      message: "Bạn chắc chắn muốn xóa yêu cầu này? Thao tác không thể hoàn tác.",
      confirmLabel: "Xóa",
      cancelLabel: "Hủy",
      variant: "danger",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "Xóa thất bại");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    notifyContactsUpdated();
    router.refresh();
  }

  return (
    <div className="min-w-0">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Yêu cầu liên hệ
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Đang tải..."
              : `${rows.length} yêu cầu${unread ? ` · ${unread} chưa đọc` : ""}${
                  careerCount ? ` · ${careerCount} CV` : ""
                }`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "all", label: "Tất cả" },
              { key: "unread", label: "Chưa đọc" },
              { key: "contact", label: "Liên hệ" },
              { key: "career", label: "Tuyển dụng" },
              { key: "read", label: "Đã đọc" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filter === f.key
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && !loading && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <MessageSquareText className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-semibold text-slate-700">
            {filter === "all"
              ? "Chưa có yêu cầu liên hệ"
              : filter === "unread"
                ? "Không có yêu cầu chưa đọc"
                : filter === "career"
                  ? "Chưa có CV tuyển dụng"
                  : filter === "contact"
                    ? "Chưa có yêu cầu liên hệ thường"
                    : "Không có yêu cầu đã đọc"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Form gửi từ trang{" "}
            <Link href="/lien-he" className="font-bold text-brand-600 hover:underline">
              Liên hệ
            </Link>{" "}
            sẽ hiện ở đây.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm transition sm:p-5 ${
              m.isRead
                ? "border-slate-200"
                : "border-sky-200 ring-1 ring-sky-100"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {!m.isRead && (
                    <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Mới
                    </span>
                  )}
                  {m.type === "career" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                      <Briefcase className="h-3 w-3" />
                      Tuyển dụng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      <MessageSquareText className="h-3 w-3" />
                      Liên hệ
                    </span>
                  )}
                  <h2 className="font-bold text-slate-900">
                    {m.subject ||
                      (m.type === "career"
                        ? "Ứng tuyển / Gửi CV"
                        : "Liên hệ từ website")}
                  </h2>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {m.name}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <a
                    href={`tel:${m.phone}`}
                    className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {m.phone}
                  </a>
                  {m.email && (
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center gap-1 hover:text-brand-600"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {m.email}
                    </a>
                  )}
                  <span>{formatDate(m.createdAt)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {m.content}
                </p>
                {m.type === "career" && m.cvUrl && (
                  <a
                    href={m.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-100"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {m.cvFileName || "Tải CV (PDF)"}
                  </a>
                )}
              </div>
              <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                <Link
                  href={`/admin/contacts/${m.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-300 hover:text-brand-600"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Chi tiết
                </Link>
                <button
                  type="button"
                  onClick={() => toggleRead(m.id, !m.isRead)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  title={m.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                >
                  {m.isRead ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  {m.isRead ? "Chưa đọc" : "Đã đọc"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-red-600 hover:border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
