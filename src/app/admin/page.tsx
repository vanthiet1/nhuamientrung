import Link from "next/link";
import {
  FolderTree,
  Layers,
  Package,
  Newspaper,
  Briefcase,
  MessageSquareText,
  ImageIcon,
  ArrowRight,
} from "lucide-react";
import {
  getCategories,
  getSubcategories,
  getProducts,
  getNews,
  getCareers,
  getContactMessages,
  countUnreadContactMessages,
  getBanners,
} from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [cats, subs, products, news, careers, contacts, unreadContacts, banners] =
    await Promise.all([
      getCategories(),
      getSubcategories(),
      getProducts(),
      getNews(true),
      getCareers(true),
      getContactMessages(),
      countUnreadContactMessages(),
      getBanners(true),
    ]);

  const cards = [
    {
      label: "Banner Hero",
      count: banners.length,
      href: "/admin/banners",
      icon: ImageIcon,
      color: "from-orange-500 to-rose-600",
    },
    {
      label: "Danh mục",
      count: cats.length,
      href: "/admin/categories",
      icon: FolderTree,
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "Danh mục con",
      count: subs.length,
      href: "/admin/subcategories",
      icon: Layers,
      color: "from-teal-500 to-teal-700",
    },
    {
      label: "Sản phẩm",
      count: products.length,
      href: "/admin/products",
      icon: Package,
      color: "from-sky-500 to-brand-600",
    },
    {
      label: "Tin tức",
      count: news.length,
      href: "/admin/news",
      icon: Newspaper,
      color: "from-violet-500 to-violet-700",
    },
    {
      label: "Tuyển dụng",
      count: careers.length,
      href: "/admin/careers",
      icon: Briefcase,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Liên hệ",
      count: contacts.length,
      href: "/admin/contacts",
      icon: MessageSquareText,
      color: "from-rose-500 to-rose-700",
      badge: unreadContacts > 0 ? `${unreadContacts} mới` : undefined,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Tổng quan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý danh mục, sản phẩm, tin tức, tuyển dụng và yêu cầu liên hệ
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`h-1.5 bg-gradient-to-r ${c.color}`} />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white`}
                >
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                  {"badge" in c && c.badge && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600 ring-1 ring-rose-100">
                      {c.badge}
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:text-sky-500" />
                </div>
              </div>
              <div className="mt-4 text-3xl font-extrabold text-slate-900">
                {c.count}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                {c.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {unreadContacts > 0 && (
        <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4">
          <p className="text-sm font-semibold text-sky-900">
            Có{" "}
            <strong>{unreadContacts}</strong> yêu cầu liên hệ chưa đọc.{" "}
            <Link
              href="/admin/contacts?filter=unread"
              className="font-bold text-brand-600 underline"
            >
              Xem ngay →
            </Link>
          </p>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Hướng dẫn nhanh</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>
            Tạo <strong>Danh mục</strong> cha (VD: Màng co PVC)
          </li>
          <li>
            Tạo <strong>Danh mục con</strong> thuộc danh mục cha
          </li>
          <li>
            Thêm <strong>Sản phẩm</strong> gán vào danh mục / danh mục con
          </li>
          <li>
            Đăng <strong>Tin tức</strong> hiển thị trên website
          </li>
          <li>
            Thêm vị trí <strong>Tuyển dụng</strong>
          </li>
          <li>
            Xem <strong>Yêu cầu liên hệ</strong> từ form trang Liên hệ
          </li>
        </ol>
      </div>
    </div>
  );
}
