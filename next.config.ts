import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Portfolio",
  assetPrefix: "/Portfolio",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/Portfolio",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
