import { company } from "@/lib/data/company";
import { siteUrl } from "./keywords";

export function organizationJsonLd() {
  // Chỉ URL thật — placeholder facebook.com/ youtube.com/ sẽ bị bỏ
  const sameAs = [company.zaloUrl].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: company.name,
    alternateName: company.shortName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    email: company.email,
    telephone: company.phone,
    taxID: company.taxCode,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Hà Đông 2",
      addressLocality: "Thanh Khê",
      addressRegion: "Đà Nẵng",
      postalCode: "550000",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 16.0678,
      longitude: 108.183,
    },
    areaServed: {
      "@type": "Country",
      name: "Vietnam",
    },
    sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: company.phone,
        contactType: "sales",
        areaServed: "VN",
        availableLanguage: ["Vietnamese"],
      },
      {
        "@type": "ContactPoint",
        telephone: company.hotline,
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["Vietnamese"],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.shortName,
    url: siteUrl,
    inLanguage: "vi-VN",
    publisher: {
      "@type": "Organization",
      name: company.name,
      logo: `${siteUrl}/logo.png`,
    },
  };
}

export function productJsonLd(p: {
  name: string;
  description: string;
  image?: string;
  sku?: string;
  slug: string;
  price?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.sku || undefined,
    image: p.image || `${siteUrl}/logo.png`,
    url: `${siteUrl}/san-pham/${p.slug}`,
    brand: {
      "@type": "Brand",
      name: company.shortName,
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/san-pham/${p.slug}`,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: company.name,
      },
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  slug: string;
  date?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: a.image || `${siteUrl}/logo.png`,
    datePublished: a.date,
    author: {
      "@type": "Organization",
      name: company.name,
    },
    publisher: {
      "@type": "Organization",
      name: company.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: `${siteUrl}/tin-tuc/${a.slug}`,
  };
}
