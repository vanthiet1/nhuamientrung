"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function trackProductView(productId: string) {
  try {
    const headersList = await headers();
    
    // Look for common IP headers
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    
    let ip = "unknown";
    if (forwardedFor) {
      ip = forwardedFor.split(",")[0].trim();
    } else if (realIp) {
      ip = realIp;
    } else {
      ip = "127.0.0.1";
    }

    if (ip !== "unknown") {
      const supabase = await createClient();
      // Gọi function trên Supabase
      const { error } = await supabase.rpc("increment_product_view", {
        p_id: productId,
        p_ip: ip
      });
      
      if (error) {
        console.error("Supabase RPC error:", error);
        return { success: false };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error tracking view:", error);
    return { success: false };
  }
}
