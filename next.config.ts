import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/productprice",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://matpriskollen.se/api/:path*",
      },
    ];
  },
};

export default nextConfig;
