import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mangcopvc.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "phuanpe.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "nhuadanang.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nhuadanang.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nhuamientrung.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wlfdvgauofnyqsgizuop.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "baobithanhphat.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
