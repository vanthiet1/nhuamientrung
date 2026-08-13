"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

function hasSrc(src: ImageProps["src"] | null | undefined): src is ImageProps["src"] {
  if (src == null) return false;
  if (typeof src === "string") return src.trim().length > 0;
  return true;
}

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: ImageProps["src"] | null;
  alt: string;
  /** Nền khi không có ảnh / load lỗi */
  fallbackClassName?: string;
};

/**
 * next/image an toàn: URL rỗng hoặc load lỗi → nền trống (không icon broken).
 */
export default function SafeImage({
  src,
  alt,
  className,
  fallbackClassName = "bg-slate-100",
  fill,
  onError,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const ok = hasSrc(src) && !failed;

  if (!ok) {
    return (
      <div
        className={
          fill
            ? `absolute inset-0 flex items-center justify-center border border-dashed border-slate-200 ${fallbackClassName}`
            : `flex items-center justify-center h-full w-full min-h-[4rem] min-w-[4rem] border border-dashed border-slate-200 ${fallbackClassName}`
        }
        aria-hidden
        role="presentation"
      >
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
}

type SafeImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackClassName?: string;
};

/**
 * <img> an toàn: URL rỗng hoặc lỗi → nền trống.
 */
export function SafeImg({
  src,
  alt = "",
  className = "",
  fallbackClassName = "bg-slate-100",
  onError,
  ...rest
}: SafeImgProps) {
  const [failed, setFailed] = useState(false);
  const raw = typeof src === "string" ? src.trim() : "";
  const ok = Boolean(raw) && !failed;

  if (!ok) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-slate-200 ${className} ${fallbackClassName}`.trim()}
        aria-hidden
        role="presentation"
      >
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={raw}
      alt={alt}
      className={className}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
}
