"use client";

import { useState } from "react";
import SafeImage from "@/components/SafeImage";

type ProductGalleryProps = {
  coverImage: string;
  images?: string[] | null;
  title: string;
  companyShortName: string;
  headerContent: React.ReactNode;
  children: React.ReactNode;
};

export default function ProductGallery({
  coverImage,
  images,
  title,
  companyShortName,
  headerContent,
  children,
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(coverImage);

  // Filter out empty images and ensure the cover image is always first if not in the list
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  
  // Create a unified gallery including the cover image if not already present
  const galleryImages = validImages.length > 0 
    ? (validImages.includes(coverImage) ? validImages : [coverImage, ...validImages])
    : (coverImage ? [coverImage] : []);

  return (
    <>
      <div className="relative flex min-h-[261px] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 sm:min-h-[325px] md:min-h-[421px]">
        {activeImage ? (
          <SafeImage
            src={activeImage}
            alt={`${title} - ${companyShortName}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-contain bg-white p-2 sm:p-3"
            fallbackClassName="bg-white"
            unoptimized
          />
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-20" />
            <p className="relative px-4 text-center text-2xl font-extrabold text-white sm:text-3xl">
              {title}
            </p>
          </>
        )}
      </div>
      <div className="p-6 sm:p-8">
        {headerContent}

        {galleryImages && galleryImages.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {galleryImages.slice(0, 8).map((img, imgIdx) => (
              <button
                key={img}
                onClick={() => setActiveImage(img)}
                type="button"
                aria-label={`Xem ảnh ${imgIdx + 1}`}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition-all ${
                  activeImage === img
                    ? "border-brand-500 ring-2 ring-brand-500/20 bg-white"
                    : "border-slate-200 bg-white hover:border-brand-300 opacity-70 hover:opacity-100"
                }`}
              >
                <SafeImage
                  src={img}
                  alt={`${title} — ảnh ${imgIdx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                  fallbackClassName="bg-slate-50"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}

        {children}
      </div>
    </>
  );
}
