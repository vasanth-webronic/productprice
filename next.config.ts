import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/productprice",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
