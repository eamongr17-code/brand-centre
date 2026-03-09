import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  basePath: isProd ? "/brand-centre" : "",
  assetPrefix: isProd ? "/brand-centre" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/brand-centre" : "",
  },
};

export default nextConfig;
