import Link from "next/link";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Xem tất cả →",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
      <div className="max-w-2xl">
        {eyebrow && (
          <p
            className={`mb-1.5 text-xs font-bold uppercase tracking-[0.18em] sm:text-sm ${
              light ? "text-accent-300" : "text-accent-600"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-2 text-sm leading-relaxed sm:text-base ${
              light ? "text-white/80" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={`text-sm font-bold transition-colors ${
            light
              ? "text-white hover:text-accent-200"
              : "text-brand-600 hover:text-accent-600"
          }`}
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
