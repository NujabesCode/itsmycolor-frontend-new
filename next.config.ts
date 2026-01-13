import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "localhost",
      "boltlab-bucket.s3.ap-northeast-2.amazonaws.com",
      "itsmycolor-bucket.s3.ap-northeast-2.amazonaws.com",
      "cdn.fashn.ai",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.ap-northeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
