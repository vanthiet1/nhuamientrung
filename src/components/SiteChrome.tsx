"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ZaloFloat from "@/components/ZaloFloat";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import { GoogleTranslateBootstrap } from "@/components/LanguageSwitcher";
import type { CategoryTree } from "@/lib/cms/types";

export default function SiteChrome({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: CategoryTree[];
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <GoogleTranslateBootstrap />
      <Header categories={categories} />
      <BreadcrumbBar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <ZaloFloat />
      <ChatWidget />
    </>
  );
}
