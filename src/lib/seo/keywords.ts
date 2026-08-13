import { company } from "@/lib/data/company";

/** Primary SEO keywords — hạn chế lặp từ “màng” (tránh density tool flag) */
export const primaryKeywords = [
  "bao bì Đà Nẵng",
  "shrink film Đà Nẵng",
  "bao bì đóng gói",
  "cuộn màng ép ly",
  "màng ép ly trà sữa",
  "PVC shrink film",
  "PE shrink film",
  "POF film",
  "PET film",
  "in nhiệt bao bì",
  "in màng co nhiệt",
  "màng phức hợp",
  "Bao Bì Thành Phát",
] as const;

export const secondaryKeywords = [
  "đóng gói nước giải khát",
  "đóng lốc hàng hóa",
  "bao bì thực phẩm",
  "OPP BOPP",
  "in logo bao bì",
  "in ly nhựa Đà Nẵng",
  "tem nhãn co nhiệt",
  "bọc giỏ quà",
  "bao bì túi đựng gạo",
  "bao bì bánh kẹo",
  "báo giá bao bì",
  "băng keo đóng gói",
  "màng quấn pallet",
  "túi nilon",
  "gia công màng co",
  "dịch vụ đóng gói Đà Nẵng",
  "nhà cung cấp bao bì miền Trung",
] as const;

export const allKeywords = [...primaryKeywords, ...secondaryKeywords];

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://baobithanhphat.com";

export const defaultSeo = {
  title: `${company.shortName} | Bao bì đóng gói Đà Nẵng`,
  description: company.description,
  keywords: [...allKeywords],
  openGraph: {
    type: "website" as const,
    locale: "vi_VN",
    siteName: company.shortName,
    title: `${company.shortName} | Bao bì đóng gói Đà Nẵng`,
    description: company.description,
    images: [
      {
        url: "/logo.png",
        width: 327,
        height: 342,
        alt: `Logo ${company.shortName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: `${company.shortName} | Bao bì Đà Nẵng`,
    description: company.description,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export function productKeywords(name: string, sku?: string) {
  return [
    name,
    sku ? `mã ${sku}` : "",
    "bao bì",
    "shrink film",
    "Đà Nẵng",
    company.shortName,
    "báo giá bao bì",
  ].filter(Boolean);
}

export function newsKeywords(title: string) {
  return [
    title,
    "tin tức bao bì",
    company.shortName,
    "kiến thức đóng gói",
    "Đà Nẵng",
  ];
}
