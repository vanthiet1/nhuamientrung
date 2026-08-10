"use client";

import { useEffect, useRef } from "react";
import { trackProductView } from "@/app/actions/views";

export default function ProductViewTracker({ productId }: { productId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      // Timeout helps avoid tracking bounce visits (e.g. users leaving instantly) or prefetching
      const timer = setTimeout(() => {
        trackProductView(productId).catch(console.error);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [productId]);

  return null;
}
