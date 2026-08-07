"use client";

import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/admin/ConfirmDialog";

export default function FormActions({
  cancelHref,
  loading,
  submitLabel = "Lưu",
  confirmCancel = true,
}: {
  cancelHref: string;
  loading?: boolean;
  submitLabel?: string;
  /** Hiện modal khi bấm Hủy (mặc định bật) */
  confirmCancel?: boolean;
}) {
  const router = useRouter();
  const confirm = useConfirm();

  async function onCancel() {
    if (confirmCancel) {
      const ok = await confirm({
        title: "Hủy thao tác?",
        message:
          "Bạn có chắc muốn hủy? Các thay đổi chưa lưu sẽ không được giữ lại.",
        confirmLabel: "Hủy bỏ",
        cancelLabel: "Tiếp tục sửa",
        variant: "default",
      });
      if (!ok) return;
    }
    router.push(cancelHref);
  }

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:flex-wrap">
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Đang lưu..." : submitLabel}
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => void onCancel()}
        className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 sm:w-auto"
      >
        Hủy
      </button>
    </div>
  );
}
