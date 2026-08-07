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
            ? `absolute inset-0 ${fallbackClassName}`
            : `block h-full w-full min-h-[2.5rem] min-w-[2.5rem] ${fallbackClassName}`
        }
        aria-hidden
        role="presentation"
      />
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
        className={`${className} ${fallbackClassName}`.trim()}
        aria-hidden
        role="presentation"
      />
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
