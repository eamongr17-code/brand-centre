import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  output: isProd ? "export" : undefined,
  basePath: isProd ? "/brand-centre" : "",
  assetPrefix: isProd ? "/brand-centre" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/brand-centre" : "",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-e9e14046aed24aaf9fc42c0864d1822d.r2.dev",
      },
    ],
  },
};

export default nextConfig;
