import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    deviceSizes: [360, 390, 430, 640, 768, 1024, 1280, 1440],
    imageSizes: [48, 64, 96, 160, 240, 320],
    qualities: [45, 55, 65, 70, 75, 80],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mflnclkwchtkfaohmpwn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
