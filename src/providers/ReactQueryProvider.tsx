"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        retry: (failureCount, error: any) => {
          // Mixed Content 에러나 CORS 에러는 재시도하지 않음
          if (error?.name === 'MixedContentError' || error?.name === 'NetworkError') {
            return false;
          }
          // 최대 3번 재시도
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // 지수 백오프
        refetchOnWindowFocus: false, // 창 포커스 시 자동 재요청 방지
        onError: (error: any) => {
          // 전역 에러 핸들링
          console.error('[React Query] 전역 쿼리 에러:', error);
          if (error?.name === 'MixedContentError') {
            console.error('[React Query] Mixed Content 문제: HTTPS 사이트에서 HTTP API 호출 불가');
          } else if (error?.name === 'NetworkError') {
            console.error('[React Query] 네트워크 에러: 연결 문제 또는 CORS 에러');
          }
        },
      },
      mutations: {
        retry: false, // mutation은 재시도하지 않음
        onError: (error: any) => {
          // 전역 mutation 에러 핸들링
          console.error('[React Query] 전역 mutation 에러:', error);
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
