import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import JsonLd from "@/components/JsonLd";
import { company } from "@/lib/data/company";
import { loadCategories } from "@/lib/data/public";
import { defaultSeo, siteUrl } from "@/lib/seo/keywords";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultSeo.title,
    template: `%s | ${company.shortName}`,
  },
  description: defaultSeo.description,
  keywords: defaultSeo.keywords,
  authors: [{ name: company.name }],
  creator: company.shortName,
  publisher: company.name,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/logo.png", type: "image/png", sizes: "327x342" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    ...defaultSeo.openGraph,
    url: siteUrl,
  },
  twitter: defaultSeo.twitter,
  robots: defaultSeo.robots,
  alternates: {
    canonical: siteUrl,
  },
  category: "business",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: Awaited<ReturnType<typeof loadCategories>> = [];
  try {
    categories = await loadCategories();
  } catch {
    categories = [];
  }

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteChrome categories={categories}>{children}</SiteChrome>
      </body>
    </html>
  );
}
