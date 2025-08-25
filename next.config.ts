import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_URL || "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_IMAGE_URL || "localhost",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
