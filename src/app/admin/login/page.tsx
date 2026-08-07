"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fd.get("username"),
          password: fd.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đăng nhập thất bại");
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Không thể kết nối máy chủ");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Tên đăng nhập
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="username"
              required
              autoComplete="username"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/15"
              placeholder="admin"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/15"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-sm font-bold uppercase tracking-wide text-white shadow hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4">
            <BrandLogo href={null} variant="login" priority className="mx-auto" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin CMS</h1>
          <p className="mt-1 text-sm text-slate-400">
            Bao Bì Thành Phát — quản trị nội dung
          </p>
        </div>

        <Suspense fallback={<div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">Đang tải...</div>}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-slate-500">
          Tài khoản cấu hình trong file{" "}
          <code className="text-slate-400">.env.local</code>
        </p>
      </div>
    </div>
  );
}
