"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, X } from "lucide-react";

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** danger = nút xác nhận đỏ (xóa); default = brand */
  variant?: "danger" | "default";
};

type Pending = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

type ConfirmFn = (options: ConfirmOptions | string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

function normalize(options: ConfirmOptions | string): ConfirmOptions {
  if (typeof options === "string") return { message: options };
  return options;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const titleId = useId();
  const descId = useId();
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    const opts = normalize(options);
    return new Promise<boolean>((resolve) => {
      setPending({ ...opts, resolve });
    });
  }, []);

  const close = useCallback(
    (result: boolean) => {
      setPending((cur) => {
        cur?.resolve(result);
        return null;
      });
    },
    []
  );

  useEffect(() => {
    if (!pending) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus primary action shortly after open
    const t = window.setTimeout(() => confirmBtnRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [pending, close]);

  const variant = pending?.variant || "danger";
  const confirmLabel = pending?.confirmLabel || (variant === "danger" ? "Xóa" : "Đồng ý");
  const cancelLabel = pending?.cancelLabel || "Hủy";
  const title =
    pending?.title ||
    (variant === "danger" ? "Xác nhận xóa" : "Xác nhận");

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {pending && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            aria-label="Đóng"
            onClick={() => close(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
          >
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <span
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  variant === "danger"
                    ? "bg-red-50 text-red-600"
                    : "bg-brand-50 text-brand-600"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2
                  id={titleId}
                  className="text-base font-extrabold text-slate-900 sm:text-lg"
                >
                  {title}
                </h2>
                <p
                  id={descId}
                  className="mt-1.5 text-sm leading-relaxed text-slate-600"
                >
                  {pending.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => close(false)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
              >
                {cancelLabel}
              </button>
              <button
                ref={confirmBtnRef}
                type="button"
                onClick={() => close(true)}
                className={`w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition sm:w-auto ${
                  variant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-brand-600 hover:bg-brand-700"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

/** Gọi modal xác nhận trong admin (cần bọc ConfirmProvider). */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    // Fallback browser confirm nếu ngoài provider (login page, etc.)
    return async (options) => {
      const opts = normalize(options);
      return window.confirm(opts.message);
    };
  }
  return ctx;
}
