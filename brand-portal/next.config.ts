import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/brand-centre" : "",
  assetPrefix: isProd ? "/brand-centre" : "",
};

export default nextConfig;
