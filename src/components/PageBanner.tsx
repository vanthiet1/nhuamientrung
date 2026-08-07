type Crumb = { label: string; href?: string };

/** Ẩn mô tả rác từ scrape (hotline, v.v.) */
function sanitizeSubtitle(text?: string) {
  if (!text?.trim()) return undefined;
  const t = text.trim();
  if (/hot\s*line/i.test(t) && /\d{8,}/.test(t.replace(/\s/g, ""))) return undefined;
  if (/^hot\s*line/i.test(t)) return undefined;
  if (/0918\s*79\s*55\s*25/i.test(t) && t.length < 80) return undefined;
  if (t.length < 10) return undefined;
  return t;
}

export default function PageBanner({
  title,
  breadcrumbs: _breadcrumbs,
  subtitle,
  wide = false,
  /** Chỉ 1 H1/trang: tắt khi trang đã có H1 trong nội dung (chi tiết SP/tin) */
  asH1 = true,
}: {
  title: string;
  /** @deprecated Breadcrumb đã hiển thị dưới header — giữ prop để không gãy call site */
  breadcrumbs?: Crumb[];
  subtitle?: string;
  /** true = ~80% width (container-home), giống trang chủ / chi tiết SP */
  wide?: boolean;
  asH1?: boolean;
}) {
  const safeSubtitle = sanitizeSubtitle(subtitle);
  const TitleTag = asH1 ? "h1" : "p";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-white/10" />
        <div className="absolute -bottom-12 left-1/4 h-40 w-40 rounded-full border-[20px] border-white/[0.07]" />
        <div className="absolute inset-0 bg-grid-soft opacity-20" />
      </div>
      <div
        className={`relative py-8 sm:py-10 md:py-12 ${
          wide ? "container-home" : "container-page"
        }`}
      >
        <TitleTag className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          {title}
        </TitleTag>
        {safeSubtitle && (
          <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
            {safeSubtitle}
          </p>
        )}
      </div>
    </section>
  );
}
