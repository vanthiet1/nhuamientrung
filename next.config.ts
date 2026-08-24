import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/danh-muc-sp/:path*",
        destination: "/danh-muc/:path*",
        permanent: true,
      },
      {
        source: "/news/:path*",
        destination: "/tin-tuc/:path*",
        permanent: true,
      },
      {
        source: "/news",
        destination: "/tin-tuc",
        permanent: true,
      },
      {
        source: "/category/:path*",
        destination: "/danh-muc",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
