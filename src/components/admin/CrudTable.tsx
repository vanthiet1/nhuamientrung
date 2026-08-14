"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
  searchKey,
  pageSize = 10,
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
  searchKey?: (row: T) => string;
  pageSize?: number;
}) {
  const confirm = useConfirm();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const editBase = basePath || createHref.replace(/\/new$/, "");

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((row) => {
      if (searchKey) return searchKey(row).toLowerCase().includes(q);
      return Object.values(row).some(
        (val) =>
          val &&
          (typeof val === "string" || typeof val === "number") &&
          String(val).toLowerCase().includes(q)
      );
    });
  }, [rows, searchQuery, searchKey]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage, pageSize]);

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
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 sm:w-64"
            />
          </div>
          <Link
            href={createHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-brand-700 sm:w-auto sm:py-2.5"
          >
            <Plus className="h-4 w-4" />
            {createLabel}
          </Link>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {paginatedRows.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-400 shadow-sm">
            {emptyText}
          </div>
        )}
        {paginatedRows.map((row) => {
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
              {paginatedRows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    {emptyText}
                  </td>
                </tr>
              )}
              {paginatedRows.map((row) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row">
          <div className="text-sm text-slate-500">
            Hiển thị <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-semibold text-slate-700">{Math.min(currentPage * pageSize, filteredRows.length)}</span> trong tổng <span className="font-semibold text-slate-700">{filteredRows.length}</span> mục
          </div>
          <nav aria-label="Phân trang" className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition ${
                currentPage === 1
                  ? "pointer-events-none border-slate-100 text-slate-300"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 5) return true;
                if (currentPage <= 3) return p <= 5;
                if (currentPage >= totalPages - 2) return p >= totalPages - 4;
                return p >= currentPage - 1 && p <= currentPage + 1;
              })
              .map((p, index, array) => (
                <React.Fragment key={p}>
                  {index > 0 && p - array[index - 1] > 1 && (
                    <span className="inline-flex h-9 w-6 items-center justify-center text-slate-400">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => setCurrentPage(p)}
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-sm font-bold transition ${
                      currentPage === p
                        ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-600"
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition ${
                currentPage === totalPages
                  ? "pointer-events-none border-slate-100 text-slate-300"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
