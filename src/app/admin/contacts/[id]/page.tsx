"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  Trash2,
  Eye,
  EyeOff,
  Briefcase,
  MessageSquareText,
  FileText,
  Download,
} from "lucide-react";
import type { ContactMessageRecord } from "@/lib/cms/types";
import { notifyContactsUpdated } from "@/components/admin/AdminShell";
import { useConfirm } from "@/components/admin/ConfirmDialog";

export default function AdminContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const confirm = useConfirm();
  const [item, setItem] = useState<ContactMessageRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/contacts/${id}`)
      .then((r) => r.json())
      .then(async (d) => {
        if (d.error) {
          setError(d.error);
          return;
        }
        setItem(d);
        // auto mark as read when open
        if (!d.isRead) {
          const res = await fetch(`/api/admin/contacts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true }),
          });
          if (res.ok) {
            const updated = await res.json();
            setItem(updated);
            notifyContactsUpdated();
          }
        }
      });
  }, [id]);

  async function toggleRead() {
    if (!item) return;
    setLoading(true);
    const res = await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !item.isRead }),
    });
    if (res.ok) {
      setItem(await res.json());
      notifyContactsUpdated();
    }
    setLoading(false);
  }

  async function remove() {
    const ok = await confirm({
      title: "Xóa yêu cầu liên hệ?",
      message: "Bạn chắc chắn muốn xóa yêu cầu này? Thao tác không thể hoàn tác.",
      confirmLabel: "Xóa",
      cancelLabel: "Hủy",
      variant: "danger",
    });
    if (!ok) return;
    setLoading(true);
    const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      toast.error(d.error || "Xóa thất bại");
      setLoading(false);
      return;
    }
    toast.success("Xóa thành công!");
    notifyContactsUpdated();
    router.push("/admin/contacts");
    router.refresh();
  }

  if (!item && !error) {
    return <p className="text-slate-500">Đang tải...</p>;
  }
  if (!item) {
    return <p className="text-red-600">{error}</p>;
  }

  const date = new Date(item.createdAt).toLocaleString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/contacts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className={`border-b border-slate-100 px-5 py-4 text-white sm:px-6 ${
            item.type === "career"
              ? "bg-gradient-to-r from-violet-700 to-violet-500"
              : "bg-gradient-to-r from-brand-600 to-brand-700"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {item.type === "career" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                <Briefcase className="h-3 w-3" />
                Tuyển dụng / CV
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                <MessageSquareText className="h-3 w-3" />
                Liên hệ
              </span>
            )}
            {!item.isRead ? (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                Chưa đọc
              </span>
            ) : (
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase">
                Đã đọc
              </span>
            )}
            <span className="text-xs text-white/80">{date}</span>
          </div>
          <h1 className="mt-2 text-xl font-extrabold sm:text-2xl">
            {item.subject ||
              (item.type === "career"
                ? "Ứng tuyển / Gửi CV"
                : "Liên hệ từ website")}
          </h1>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Người gửi
              </p>
              <p className="mt-1 font-bold text-slate-900">{item.name}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Điện thoại
              </p>
              <a
                href={`tel:${item.phone}`}
                className="mt-1 inline-flex items-center gap-1.5 font-bold text-brand-600 hover:underline"
              >
                <Phone className="h-4 w-4" />
                {item.phone}
              </a>
            </div>
            {item.email && (
              <div className="rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-100 sm:col-span-2">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <a
                  href={`mailto:${item.email}`}
                  className="mt-1 inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-brand-600"
                >
                  <Mail className="h-4 w-4" />
                  {item.email}
                </a>
              </div>
            )}
          </div>

          {item.type === "career" && item.cvUrl && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-violet-600">
                File CV
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <FileText className="h-10 w-10 text-violet-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">
                    {item.cvFileName || "CV.pdf"}
                  </p>
                  <p className="text-xs text-slate-500">Định dạng PDF</p>
                </div>
                <a
                  href={item.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
                >
                  <Download className="h-4 w-4" />
                  Tải / xem CV
                </a>
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {item.type === "career" ? "Giới thiệu / Nội dung" : "Nội dung"}
            </p>
            <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {item.content}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              disabled={loading}
              onClick={remove}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Xóa yêu cầu
            </button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={`tel:${item.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <Phone className="h-4 w-4" />
                Gọi điện
              </a>
              <button
                type="button"
                disabled={loading}
                onClick={toggleRead}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                {item.isRead ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {item.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
