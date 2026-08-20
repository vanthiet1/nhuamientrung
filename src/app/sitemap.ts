import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/keywords";
import {
  loadAllCategorySlugs,
  loadAllNewsSlugs,
  loadProducts,
} from "@/lib/data/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/gioi-thieu`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tat-ca-san-pham`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/tin-tuc`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/tuyen-dung`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/lien-he`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/chinh-sach-ban-hang`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/chinh-sach-thanh-toan`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/chinh-sach-van-chuyen`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/chinh-sach-bao-mat`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let categoryUrls: MetadataRoute.Sitemap = [];
  let productUrls: MetadataRoute.Sitemap = [];
  let newsUrls: MetadataRoute.Sitemap = [];

  try {
    const [catSlugs, products, newsSlugs] = await Promise.all([
      loadAllCategorySlugs(),
      loadProducts(),
      loadAllNewsSlugs(),
    ]);

    categoryUrls = catSlugs.map((slug) => ({
      url: `${siteUrl}/danh-muc/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    productUrls = products.map((p) => ({
      url: `${siteUrl}/san-pham/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

    // de-dupe product vs category same slug
    const catSet = new Set(catSlugs);
    productUrls = productUrls.filter((u) => {
      const slug = u.url.split("/").pop() || "";
      return !catSet.has(slug);
    });

    newsUrls = newsSlugs.map((slug) => ({
      url: `${siteUrl}/tin-tuc/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));
  } catch {
    // keep static only
  }

  return [...staticPages, ...categoryUrls, ...productUrls, ...newsUrls];
}
