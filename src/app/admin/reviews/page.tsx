"use client";

import { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Clock } from "lucide-react";
import toast from "react-hot-toast";

type AdminReview = {
  id: string;
  product_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  content: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  products: { name: string } | null;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    const loadingToast = toast.loading("Đang cập nhật...");
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r))
      );
      toast.success("Đã cập nhật trạng thái", { id: loadingToast });
    } catch (error) {
      toast.error("Lỗi cập nhật", { id: loadingToast });
    }
  }

  async function deleteReview(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này vĩnh viễn?")) return;
    
    const loadingToast = toast.loading("Đang xóa...");
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Đã xóa đánh giá", { id: loadingToast });
    } catch (error) {
      toast.error("Lỗi khi xóa", { id: loadingToast });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý đánh giá</h1>
          <p className="text-sm text-slate-500">
            Phê duyệt và quản lý các đánh giá sản phẩm từ khách hàng
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <tr>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Sản phẩm</th>
                <th className="p-4">Đánh giá</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Chưa có đánh giá nào.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-4 align-top">
                      <p className="font-bold text-slate-900">{r.name}</p>
                      {r.phone && <p className="text-xs text-slate-500 mt-0.5">{r.phone}</p>}
                      {r.email && <p className="text-xs text-slate-500 mt-0.5">{r.email}</p>}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(r.created_at).toLocaleDateString("vi-VN")}
                      </p>
                    </td>
                    <td className="p-4 align-top max-w-[200px]">
                      <p className="font-semibold text-brand-700 truncate" title={r.products?.name}>
                        {r.products?.name || "Sản phẩm không tồn tại"}
                      </p>
                    </td>
                    <td className="p-4 align-top max-w-xs">
                      <div className="flex gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < r.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="line-clamp-3 text-xs leading-relaxed" title={r.content}>
                        {r.content}
                      </p>
                    </td>
                    <td className="p-4 align-top">
                      {r.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                          <Clock className="h-3 w-3" /> Chờ duyệt
                        </span>
                      )}
                      {r.status === "approved" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle className="h-3 w-3" /> Đã duyệt
                        </span>
                      )}
                      {r.status === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                          <XCircle className="h-3 w-3" /> Bị ẩn
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-top text-right space-y-2">
                      <div className="flex flex-col items-end gap-2">
                        {r.status !== "approved" && (
                          <button
                            onClick={() => updateStatus(r.id, "approved")}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            Duyệt hiển thị
                          </button>
                        )}
                        {r.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(r.id, "rejected")}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                          >
                            Từ chối/Ẩn
                          </button>
                        )}
                        <button
                          onClick={() => deleteReview(r.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600"
                        >
                          <Trash2 className="h-3 w-3" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
