import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterGuard } from '@/components/common/RouterGuard';
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
      <body className={`${notoSansKR.className} ${notoSansKR.variable}`} suppressHydrationWarning>
        <ReactQueryProvider>
          <ProductStoreProvider>
            <Suspense>
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
