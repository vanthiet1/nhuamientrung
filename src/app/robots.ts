import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/keywords";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/admin"],
      },
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "DotBot",
          "MJ12bot",
          "PetalBot",
          "BLEXBot",
          "Baiduspider",
          "Bytespider",
          "YandexBot"
        ],
        disallow: ["/"],
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
