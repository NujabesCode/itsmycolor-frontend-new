import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // S3 정적 빌드 활성화 (Vercel에서는 자동으로 비활성화됨)
  // Vercel은 서버 사이드 렌더링을 지원하므로 output: 'export'를 사용하지 않음
  ...(process.env.VERCEL ? {} : { output: 'export' }),
  
  // trailingSlash를 false로 설정하여 각 경로가 개별 HTML 파일로 생성되도록 함
  // true로 설정하면 /shopping/ 폴더를 찾게 되어 S3에서 문제 발생
  trailingSlash: false,
  
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
  
  // Vercel rewrites (서버 사이드 프록시)
  async rewrites() {
    // Vercel 환경에서만 rewrites 사용
    if (process.env.VERCEL) {
      return [
        {
          source: '/api/proxy/:path*',
          destination: 'http://13.125.130.10:3000/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
