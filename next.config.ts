import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "supermx1.github.io",
        port: "",
        pathname: "/nigerian-banks-api/**",
      },
    ],
  },
};

export default nextConfig;
