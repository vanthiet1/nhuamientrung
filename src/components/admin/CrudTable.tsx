"use client";

import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useConfirm } from "@/components/admin/ConfirmDialog";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  /** Hide this column on mobile card meta (still in desktop table) */
  hideOnMobile?: boolean;
};

export default function CrudTable<T extends { id: string }>({
  title,
  description,
  createHref,
  createLabel = "Thêm mới",
  columns,
  rows,
  onDelete,
  emptyText = "Chưa có dữ liệu",
  basePath,
  deleteMessage = "Bạn chắc chắn muốn xóa mục này? Thao tác không thể hoàn tác.",
}: {
  title: string;
  description?: string;
  createHref: string;
  createLabel?: string;
  columns: Column<T>[];
  rows: T[];
  onDelete?: (id: string) => Promise<void> | void;
  emptyText?: string;
  /** Override edit path base, default = createHref without /new */
  basePath?: string;
  deleteMessage?: string;
}) {
  const confirm = useConfirm();
  const editBase = basePath || createHref.replace(/\/new$/, "");

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: "Xác nhận xóa",
      message: deleteMessage,
      confirmLabel: "Xóa",
      cancelLabel: "Hủy",
      variant: "danger",
    });
    if (!ok) return;
    await onDelete?.(id);
  }

  return (
    <div className="min-w-0">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        <Link
          href={createHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-brand-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          {createLabel}
        </Link>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {rows.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-400 shadow-sm">
            {emptyText}
          </div>
        )}
        {rows.map((row) => {
          const mobileCols = columns.filter((c) => !c.hideOnMobile);
          const primary = mobileCols[0] || columns[0];
          const rest = mobileCols.slice(1);
          return (
            <div
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{primary?.render(row)}</div>
                  {rest.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      {rest.map((c) => (
                        <div key={c.key} className="text-xs text-slate-500">
                          <span className="mr-1 font-semibold uppercase tracking-wide text-slate-400">
                            {c.header}:
                          </span>
                          <span className="inline-block align-middle">
                            {c.render(row)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <Link
                    href={`${editBase}/${row.id}`}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-brand-300 hover:text-brand-600"
                    title="Sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  {onDelete && (
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-red-300 hover:text-red-600"
                      title="Xóa"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={`px-4 py-3 ${c.className || ""}`}>
                    {c.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    {emptyText}
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 ${c.className || ""}`}
                    >
                      {c.render(row)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`${editBase}/${row.id}`}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-brand-300 hover:text-brand-600"
                        title="Sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      {onDelete && (
                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-red-300 hover:text-red-600"
                          title="Xóa"
                          onClick={() => handleDelete(row.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
