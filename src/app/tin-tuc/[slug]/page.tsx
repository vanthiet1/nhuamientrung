import type { Metadata } from "next";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import NewsCard from "@/components/NewsCard";
import InternalLinks from "@/components/InternalLinks";
import JsonLd from "@/components/JsonLd";
import {
  loadAllNewsSlugs,
  loadNews,
  loadNewsItem,
  loadProducts,
} from "@/lib/data/public";
import { newsKeywords, siteUrl } from "@/lib/seo/keywords";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { company } from "@/lib/data/company";
import {
  enhanceContentForDisplay,
  inlineToHtml,
} from "@/lib/cms/content-links";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await loadAllNewsSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await loadNewsItem(slug);
  if (!item) return { title: "Tin tức" };
  const url = `${siteUrl}/tin-tuc/${slug}`;
  return {
    title: item.title,
    description: item.excerpt.slice(0, 160),
    keywords: newsKeywords(item.title),
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description: item.excerpt.slice(0, 160),
      url,
      type: "article",
      locale: "vi_VN",
      images: [{ url: item.image || "/logo.png", alt: item.title }],
    },
  };
}

function renderContent(content: string) {
  if (!content) return null;

  // Pre-clean "rn" (carriage returns lost in scrape) from the raw string
  let cleanStr = content
    .replace(/>rn</g, '><')
    .replace(/>\s*rn\s*</g, '><')
    .replace(/>rn/g, '>')
    .replace(/rn</g, '<')
    .replace(/rnrn/g, '<br /><br />')
    .replace(/rn-/g, '<br />-')
    .replace(/rn([A-ZĐÀ-Ỹ])/g, '<br />$1')
    .replace(/rn /g, '<br /> ')
    .replace(/rn$/, '');

  // If content is already HTML (from RichTextEditor), render it directly
  const hasHtml = /<\/[a-z]+>|<[a-z]+\s*\/>/i.test(cleanStr) || /<[a-z]+[^>]*>/i.test(cleanStr);
  if (hasHtml) {
    return (
      <div 
        className="prose prose-slate max-w-none prose-img:rounded-xl prose-img:m-0 prose-a:text-brand-600 hover:prose-a:text-sky-600 [&>h2]:mt-6 [&>h2]:mb-2 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-slate-900"
        dangerouslySetInnerHTML={{ __html: cleanStr }}
      />
    );
  }

  // Fallback for plain text: revert <br /> back to \n for markdown processing
  cleanStr = cleanStr.replace(/<br \/>/g, '\n');

  // Auto-link plain "Xem thêm" + keep existing markdown links
  const enhanced = enhanceContentForDisplay(cleanStr);
  const blocks = enhanced.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    const plainHeading = block.replace(/\*\*/g, "").trim();
    if (
      block.startsWith("**") &&
      block.endsWith("**") &&
      !block.includes("\n")
    ) {
      return (
        <h2 key={i} className="mt-6 mb-2 text-lg font-bold text-slate-900">
          {plainHeading}
        </h2>
      );
    }
    if (block.includes("\n- ") || block.startsWith("- ")) {
      const lines = block.split("\n");
      const items = lines
        .filter((l) => l.trim().startsWith("- "))
        .map((l) => l.replace(/^-\s*/, "").trim());
      const intro = lines.find((l) => !l.trim().startsWith("- "));
      return (
        <div key={i}>
          {intro && (
            <p
              className="mb-2"
              dangerouslySetInnerHTML={{
                __html: inlineToHtml(intro),
              }}
            />
          )}
          <ul>
            {items.map((li, j) => (
              <li
                key={j}
                dangerouslySetInnerHTML={{ __html: inlineToHtml(li) }}
              />
            ))}
          </ul>
        </div>
      );
    }
    // single-line xem them / paragraph (may contain multiple lines)
    const paragraphs = block.split("\n").filter((l) => l.trim());
    if (paragraphs.length > 1) {
      return (
        <div key={i} className="space-y-3">
          {paragraphs.map((line, j) => (
            <p
              key={j}
              className={
                /Xem thêm/i.test(line)
                  ? "rounded-xl border border-brand-100 bg-brand-50/50 px-3.5 py-2.5 text-sm"
                  : undefined
              }
              dangerouslySetInnerHTML={{ __html: inlineToHtml(line) }}
            />
          ))}
        </div>
      );
    }
    return (
      <p
        key={i}
        className={
          /Xem thêm/i.test(block)
            ? "rounded-xl border border-brand-100 bg-brand-50/50 px-3.5 py-2.5 text-sm"
            : undefined
        }
        dangerouslySetInnerHTML={{
          __html: inlineToHtml(block),
        }}
      />
    );
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await loadNewsItem(slug);
  if (!item) notFound();

  const [all, products] = await Promise.all([loadNews(), loadProducts()]);
  const related = all.filter((n) => n.slug !== slug).slice(0, 4);
  const productLinks = products.slice(0, 6).map((p) => ({
    href: `/san-pham/${p.slug}`,
    title: p.name,
    subtitle: p.sku ? `Mã SP: ${p.sku}` : "Sản phẩm",
  }));

  const date = new Date(item.date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            title: item.title,
            description: item.excerpt,
            slug: item.slug,
            date: item.date,
            image: item.image,
          }),
          breadcrumbJsonLd([
            { name: "Trang chủ", url: siteUrl },
            { name: "Tin tức", url: `${siteUrl}/tin-tuc` },
            { name: item.title, url: `${siteUrl}/tin-tuc/${slug}` },
          ]),
        ]}
      />
      <PageBanner
        title={item.title}
        breadcrumbs={[
          { label: "Tin tức", href: "/tin-tuc" },
          { label: item.title },
        ]}
        asH1={false}
      />

      <section className="section container-page">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <article className="lg:col-span-2">
            <div className="card overflow-hidden p-0 sm:p-0">
              {item.image ? (
                <div className="relative aspect-[16/9] w-full bg-slate-100 sm:aspect-[2/1]">
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                    unoptimized
                    fallbackClassName="bg-slate-100"
                  />
                </div>
              ) : null}
              <div className="p-6 sm:p-8">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600">
                <Calendar className="h-4 w-4" />
                {date}
              </span>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {item.title}
              </h1>
              <p className="mt-4 rounded-xl border-l-4 border-brand-500 bg-brand-50/60 px-4 py-3 text-sm font-bold leading-relaxed text-slate-800">
                {item.excerpt}
              </p>
              <div className="article-content mt-6">
                {renderContent(item.content)}
              </div>
              <p className="mt-8 text-xs text-slate-400">
                Bài viết từ {company.shortName} — chuyên màng co, bao bì Đà
                Nẵng.{" "}
                <Link href="/san-pham" className="font-semibold text-brand-600 hover:underline">
                  Xem sản phẩm
                </Link>
              </p>
              <div className="mt-6 border-t border-slate-100 pt-6">
                <Link
                  href="/tin-tuc"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-sky-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại tin tức
                </Link>
              </div>
              </div>
            </div>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-lg font-extrabold text-slate-900">
              Tin liên quan
            </h2>
            <div className="space-y-3">
              {related.map((n) => (
                <NewsCard key={n.slug} item={n} />
              ))}
            </div>
            <InternalLinks
              title="Sản phẩm gợi ý"
              items={[
                ...productLinks,
                {
                  href: "/lien-he",
                  title: "Liên hệ báo giá",
                  subtitle: company.phone,
                },
              ]}
            />
          </aside>
        </div>
      </section>
    </>
  );
}
