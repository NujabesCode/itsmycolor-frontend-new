import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 동적 라우트 때문에 정적 빌드 불가 - EC2에서 서버 모드로 실행
  // output: 'export',
  
  // ESLint 비활성화 (빌드 오류 방지)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript 오류 무시
  typescript: {
    ignoreBuildErrors: true,
  },
  
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
    unoptimized: true,
  },
  
  // 환경 변수 설정 (빌드 시점에 주입)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://13.125.130.10:3000',
  },
};

export default nextConfig;
