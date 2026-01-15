import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // S3 배포를 위한 정적 빌드 설정 (필요시 주석 해제)
  // output: 'export',
  
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
    // S3 배포 시 unoptimized: true로 변경 필요
    unoptimized: false,
  },
  
  // 환경 변수 설정 (빌드 시점에 주입)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://13.125.130.10:3000',
  },
};

export default nextConfig;
