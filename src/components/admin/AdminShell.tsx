"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Layers,
  Package,
  Newspaper,
  Briefcase,
  MessageSquareText,
  ImageIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { ConfirmProvider } from "@/components/admin/ConfirmDialog";

const nav = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/banners", label: "Banner Hero", icon: ImageIcon },
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/subcategories", label: "Danh mục con", icon: Layers },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/reviews", label: "Đánh giá", icon: Star },
  { href: "/admin/news", label: "Tin tức", icon: Newspaper },
  { href: "/admin/careers", label: "Tuyển dụng", icon: Briefcase },
  { href: "/admin/contacts", label: "Liên hệ", icon: MessageSquareText },
];

/** Poll interval for unread contact badge (ms) */
const UNREAD_POLL_MS = 5000;

export default function AdminShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/contacts/unread", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.count === "number") {
        setUnreadContacts(data.count);
      }
    } catch {
      /* ignore network blips */
    }
  }, []);

  const fetchPendingReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/reviews/pending", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.count === "number") {
        setPendingReviews(data.count);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Realtime-ish: poll + focus + custom event from contacts page
  useEffect(() => {
    fetchUnread();
    fetchPendingReviews();
    const id = window.setInterval(() => {
      fetchUnread();
      fetchPendingReviews();
    }, UNREAD_POLL_MS);

    const onFocus = () => {
      fetchUnread();
      fetchPendingReviews();
    };
    const onVis = () => {
      if (document.visibilityState === "visible") {
        fetchUnread();
        fetchPendingReviews();
      }
    };
    const onCustom = () => fetchUnread();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("admin-contacts-updated", onCustom);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("admin-contacts-updated", onCustom);
    };
  }, [fetchUnread]);

  // Refresh badge when navigating contacts
  useEffect(() => {
    if (pathname.startsWith("/admin/contacts")) {
      fetchUnread();
    }
    if (pathname.startsWith("/admin/reviews")) {
      fetchPendingReviews();
    }
  }, [pathname, fetchUnread, fetchPendingReviews]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const badge = (count: number, active: boolean) => {
    if (count <= 0) return null;
    const label = count > 99 ? "99+" : String(count);
    return (
      <span
        className={`ml-auto inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none ${
          active
            ? "bg-white text-red-600"
            : "bg-red-500 text-white shadow-sm shadow-red-500/40"
        }`}
      >
        {label}
      </span>
    );
  };

  const NavLinks = ({
    onNavigate,
    light = false,
  }: {
    onNavigate?: () => void;
    /** light = mobile drawer still dark bg, same styles */
    light?: boolean;
  }) => (
    <>
      {nav.map((item) => {
        const active = isActive(item.href, item.exact);
        const isContacts = item.href === "/admin/contacts";
        const isReviews = item.href === "/admin/reviews";
        
        const count = isContacts ? unreadContacts : isReviews ? pendingReviews : 0;
        const hasNotification = count > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              active
                ? "bg-brand-600 text-white"
                : light
                  ? "text-slate-300 hover:bg-white/5 hover:text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="relative shrink-0">
              <item.icon className="h-4 w-4" />
              {/* Dot on icon when collapsed feel / mobile compact */}
              {hasNotification && !active && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-900" />
              )}
            </span>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {hasNotification && badge(count, active)}
          </Link>
        );
      })}
    </>
  );

  return (
    <ConfirmProvider>
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-900 text-slate-200 lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="mb-3">
              <BrandLogo href="/admin" variant="admin" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
              CMS Admin
            </div>
            {username && (
              <div className="mt-2 text-xs text-slate-400">
                Xin chào, <span className="text-white">{username}</span>
              </div>
            )}
          </div>
          <nav className="flex-1 space-y-1 p-3">
            <NavLinks />
          </nav>
          <div className="space-y-1 border-t border-white/10 p-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              Xem website
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur sm:px-4 lg:hidden">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                className="relative shrink-0 rounded-lg border border-slate-200 p-2 text-slate-700"
                onClick={() => setOpen(true)}
                aria-label="Mở menu"
              >
                <Menu className="h-5 w-5" />
                {(unreadContacts > 0 || pendingReviews > 0) && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">
                    {(unreadContacts + pendingReviews) > 9 ? "9+" : (unreadContacts + pendingReviews)}
                  </span>
                )}
              </button>
              <BrandLogo href="/admin" variant="compact" />
              <div className="truncate text-xs font-bold uppercase text-sky-500">
                Admin
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pendingReviews > 0 && (
                <Link
                  href="/admin/reviews"
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-extrabold text-red-600 ring-1 ring-red-100"
                >
                  <Star className="h-3.5 w-3.5" />
                  {pendingReviews}
                </Link>
              )}
              {unreadContacts > 0 && (
                <Link
                  href="/admin/contacts"
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-extrabold text-red-600 ring-1 ring-red-100"
                >
                  <MessageSquareText className="h-3.5 w-3.5" />
                  {unreadContacts}
                </Link>
              )}
              <Link
                href="/"
                target="_blank"
                className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-600"
                aria-label="Xem website"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </header>

          {/* Mobile drawer */}
          {open && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
                aria-label="Đóng menu"
                onClick={() => setOpen(false)}
              />
              <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col bg-slate-900 text-slate-200 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                  <div>
                    <BrandLogo href="/admin" variant="admin" />
                    <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                      CMS Admin
                    </div>
                    {username && (
                      <div className="mt-1 text-xs text-slate-400">
                        {username}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-white/10 p-2 text-white"
                    onClick={() => setOpen(false)}
                    aria-label="Đóng"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                  <NavLinks onNavigate={() => setOpen(false)} light />
                </nav>
                <div className="space-y-1 border-t border-white/10 p-3">
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Xem website
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </aside>
            </div>
          )}

          <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
    </ConfirmProvider>
  );
}

/** Call after mark-read / delete so badge updates immediately */
export function notifyContactsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("admin-contacts-updated"));
  }
}
