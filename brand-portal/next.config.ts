import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-e9e14046aed24aaf9fc42c0864d1822d.r2.dev",
      },
    ],
  },
};

export default nextConfig;
