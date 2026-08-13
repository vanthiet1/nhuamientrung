"use client";

import { useEffect, useState } from "react";
import { Factory } from "lucide-react";

export default function HomeImageSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50">
        <Factory className="h-24 w-24 text-brand-200" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-white">
      {images.map((img, i) => (
        <div
          key={img + i}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={img}
            alt="Sản phẩm Bao Bì Thành Phát"
            className="max-h-[90%] max-w-[90%] object-contain drop-shadow-md transition-transform duration-[3000ms] ease-out"
            style={{ transform: i === index ? "scale(1.05)" : "scale(1)" }}
          />
        </div>
      ))}
    </div>
  );
}
