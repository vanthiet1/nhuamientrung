"use client";

import { useEffect, useState } from "react";
import { Factory } from "lucide-react";

export default function HomeImageSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [validImages, setValidImages] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Shuffle images and pick a random starting list
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setValidImages(shuffled);
    setInitialized(true);
  }, [images]);

  useEffect(() => {
    if (!initialized || validImages.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % validImages.length);
    }, 2500);
    return () => clearInterval(id);
  }, [validImages.length, initialized]);

  const handleError = (imgUrl: string) => {
    setValidImages((prev) => {
      const next = prev.filter((url) => url !== imgUrl);
      if (index >= next.length && next.length > 0) {
        setIndex(0);
      }
      return next;
    });
  };

  if (!initialized) {
    return null; // or a skeleton
  }

  if (validImages.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50">
        <Factory className="h-24 w-24 text-brand-200" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-white">
      {validImages.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt="Sản phẩm Bao Bì Thành Phát"
            className="h-full w-full object-cover transition-transform duration-[3000ms] ease-out mix-blend-multiply"
            style={{ transform: i === index ? "scale(1.05)" : "scale(1)" }}
            onError={() => handleError(img)}
          />
        </div>
      ))}
    </div>
  );
}
