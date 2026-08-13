import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { cleanRawContent } from "@/lib/cms/content-links";

export type NewsCardItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
};

export default function NewsCard({
  item,
  featured = false,
}: {
  item: NewsCardItem;
  featured?: boolean;
}) {
  const date = new Date(item.date).toLocaleDateString("vi-VN");
  const hasImage = Boolean(item.image);

  if (featured) {
    return (
      <Link
        href={`/tin-tuc/${item.slug}`}
        className="card-hover group flex h-full flex-col overflow-hidden"
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 sm:h-52">
          {hasImage ? (
            <SafeImage
              src={item.image!}
              alt={`Ảnh bài viết: ${item.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized
              fallbackClassName="bg-slate-200/40"
            />
          ) : (
            <>
              <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-20" />
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full border-8 border-white/15" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          <p className="absolute inset-x-0 bottom-0 p-5 line-clamp-3 text-lg font-bold leading-snug text-white drop-shadow">
            {item.title}
          </p>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-600">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
          <h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-brand-600">
            {item.title}
          </h3>
          <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-500">
            {item.excerpt
              ? cleanRawContent(item.excerpt, false)
                  .replace(/<[^>]*>?/gm, "")
                  .replace(/&nbsp;/g, " ")
                  .replace(/&amp;/g, "&")
                  .replace(/rn/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
              : ""}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600 group-hover:text-accent-600">
            Đọc bài: {item.title.slice(0, 42)}
            {item.title.length > 42 ? "…" : ""}{" "}
            <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tin-tuc/${item.slug}`}
      className="card-hover group flex gap-3.5 p-3 sm:gap-4 sm:p-3.5"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 sm:h-28 sm:w-28">
        {hasImage ? (
          <SafeImage
            src={item.image!}
            alt={`Thumbnail tin: ${item.title}`}
            fill
            sizes="112px"
            className="object-cover transition duration-300 group-hover:scale-105"
            unoptimized
            fallbackClassName="bg-slate-200"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-2.5">
            <span className="line-clamp-4 text-center text-[10px] font-bold leading-tight text-white/85 sm:text-[11px]">
              {item.title}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-600">
          <Calendar className="h-3 w-3" />
          {date}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 transition group-hover:text-brand-600 sm:text-[15px]">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
          {item.excerpt
            ? cleanRawContent(item.excerpt, false)
                .replace(/<[^>]*>?/gm, "")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/rn/g, " ")
                .replace(/\s+/g, " ")
                .trim()
            : ""}
        </p>
      </div>
    </Link>
  );
}
