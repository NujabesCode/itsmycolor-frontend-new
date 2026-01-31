import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterGuard } from '@/components/common/RouterGuard';
import { ProductRedirectHandler } from '@/components/common/ProductRedirectHandler';
import { Suspense } from 'react';
import { ProductStoreProvider } from '@/providers/ProductStoreProvider';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: 'It\'s my color - 잇츠마이컬러',
  description: '퍼스널 컬러 진단 및 스타일링 서비스',
  icons: {
    icon: [
      { url: '/image/itsmycolor-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/image/itsmycolor-logo.png',
    apple: '/image/itsmycolor-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 이미지 도메인에 미리 연결하여 로딩 속도 개선 */}
        <link rel="preconnect" href="https://itsmycolor-bucket.s3.ap-northeast-2.amazonaws.com" />
        <link rel="dns-prefetch" href="https://itsmycolor-bucket.s3.ap-northeast-2.amazonaws.com" />
        {/* API 서버에 미리 연결 */}
        <link rel="preconnect" href="http://43.201.54.58:3000" />
        <link rel="dns-prefetch" href="http://43.201.54.58:3000" />
      </head>
      <body className={`${notoSansKR.className} ${notoSansKR.variable}`} suppressHydrationWarning>
        <ReactQueryProvider>
          <ProductStoreProvider>
            <Suspense>
              <ProductRedirectHandler />
              <RouterGuard />
            </Suspense>

            <Header />
            {children}
            <Footer />
          </ProductStoreProvider>

          <ReactQueryDevtools />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
