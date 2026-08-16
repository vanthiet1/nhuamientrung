"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  Eye,
  EyeOff,
  Trash2,
  FileSpreadsheet,
  ExternalLink,
  FileText,
  Building2,
  MapPin,
} from "lucide-react";
import type { QuoteRequestRecord } from "@/lib/cms/types";
import { notifyQuotesUpdated } from "@/components/admin/AdminShell";
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

export default function AdminQuotesPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const [rows, setRows] = useState<QuoteRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/quotes");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
    const handleNewQuote = () => load();
    window.addEventListener("admin-new-quote", handleNewQuote);
    return () => window.removeEventListener("admin-new-quote", handleNewQuote);
  }, []);

  const filtered = rows.filter((r) => {
    if (filter === "unread") return !r.isRead;
    if (filter === "read") return r.isRead;
    return true;
  });

  const unreadCount = rows.filter((r) => !r.isRead).length;

  async function toggleRead(id: string, isRead: boolean) {
    const res = await fetch(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    if (res.ok) {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isRead } : r))
      );
      notifyQuotesUpdated();
      router.refresh();
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: status as any } : r))
      );
      toast.success("Đã cập nhật trạng thái");
    }
  }

  async function remove(id: string) {
    const ok = await confirm({
      title: "Xóa yêu cầu báo giá?",
      message: "Bạn chắc chắn muốn xóa yêu cầu này? Thao tác không thể hoàn tác.",
      confirmLabel: "Xóa",
      cancelLabel: "Hủy",
      variant: "danger",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/quotes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      toast.error(d.error || "Xóa thất bại");
      return;
    }
    toast.success("Xóa thành công!");
    setRows((prev) => prev.filter((r) => r.id !== id));
    notifyQuotesUpdated();
    router.refresh();
  }

  return (
    <div className="min-w-0">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Yêu cầu báo giá B2B
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Đang tải..."
              : `${rows.length} yêu cầu${unreadCount ? ` · ${unreadCount} chưa đọc` : ""}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "all", label: "Tất cả" },
              { key: "unread", label: "Chưa đọc" },
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
          <FileSpreadsheet className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-semibold text-slate-700">
            {filter === "all"
              ? "Chưa có yêu cầu báo giá"
              : filter === "unread"
                ? "Không có yêu cầu chưa đọc"
                : "Không có yêu cầu đã đọc"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Form gửi từ trang chủ sẽ hiện ở đây.
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                    <FileSpreadsheet className="h-3 w-3" />
                    {m.productType}
                  </span>
                  {m.status === 'quoted' && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                      Đã báo giá
                    </span>
                  )}
                  <h2 className="font-bold text-slate-900">
                    Yêu cầu báo giá {m.productType}
                  </h2>
                </div>
                
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {m.name} {m.companyName && <span className="font-normal text-slate-500">- {m.companyName}</span>}
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
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {m.deliveryDestination}
                  </span>
                  <span>{formatDate(m.createdAt)}</span>
                </div>

                <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
                  <div className="grid sm:grid-cols-2 gap-2 mb-2">
                    {m.industry && <div><strong>Ngành hàng:</strong> {m.industry}</div>}
                    <div><strong>Số lượng:</strong> {m.quantityExpected}</div>
                    {m.dimensions && <div><strong>Kích thước:</strong> {m.dimensions}</div>}
                    {m.material && <div><strong>Vật liệu:</strong> {m.material}</div>}
                    {m.printColors && <div><strong>Màu in:</strong> {m.printColors}</div>}
                    {m.deadline && <div><strong>Thời gian nhận:</strong> {m.deadline}</div>}
                  </div>
                  {m.details && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <strong>Yêu cầu thêm:</strong>
                      <p className="mt-1 text-slate-600 whitespace-pre-wrap">{m.details}</p>
                    </div>
                  )}
                </div>

                {m.referenceFileUrl && (
                  <div className="mt-3">
                    {m.referenceFileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <a href={m.referenceFileUrl} target="_blank" rel="noopener noreferrer" className="block w-fit">
                        <img src={m.referenceFileUrl} alt="File đính kèm" className="max-h-48 w-auto rounded-lg border border-slate-200 object-cover shadow-sm transition hover:opacity-90" />
                      </a>
                    ) : (
                      <a
                        href={m.referenceFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {m.referenceFileName || "Xem file đính kèm"}
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                <select
                  value={m.status || "pending"}
                  onChange={(e) => updateStatus(m.id, e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="contacted">Đã liên hệ</option>
                  <option value="quoted">Đã báo giá</option>
                  <option value="rejected">Từ chối</option>
                </select>
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
