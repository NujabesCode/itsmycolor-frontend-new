"use client";

import { QUERY } from "@/configs/constant/query";
import { useQueries } from "@tanstack/react-query";
import { userApi } from "./request";
import { colorAnalysisApi } from "../color-analysis/request";
import { brandApi } from "../brand/request";

export const useGetUser = () => {
  return useQueries({
    queries: [
      {
        queryKey: [QUERY.USER],
        queryFn: async () => {
          try {
            return await userApi.getUser();
          } catch (error: any) {
            // 401 에러는 정상 (로그인 안 된 상태)
            if (error?.response?.status === 401) {
              return null;
            }
            // 네트워크 에러는 조용히 처리 (백엔드 서버 연결 불가 시)
            if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error') || error?.message?.includes('ERR_CONNECTION_REFUSED')) {
              console.warn('[useGetUser] 네트워크 에러 - 백엔드 서버에 연결할 수 없습니다:', error?.message);
              return null;
            }
            console.error('[useGetUser] Failed to fetch user:', error);
            return null; // 에러 발생 시 null 반환하여 앱이 크래시하지 않도록 함
          }
        },
        retry: false,
      },
      {
        queryKey: [QUERY.COLOR_ANALYSIS],
        queryFn: async () => {
          try {
            return await colorAnalysisApi.getColorAnalysis();
          } catch (error: any) {
            // 401 에러는 정상 (로그인 안 된 상태)
            if (error?.response?.status === 401) {
              return null;
            }
            // 네트워크 에러는 조용히 처리
            if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error') || error?.message?.includes('ERR_CONNECTION_REFUSED')) {
              console.warn('[useGetUser] 네트워크 에러 - 컬러 분석 정보를 가져올 수 없습니다:', error?.message);
              return null;
            }
            console.error('[useGetUser] Failed to fetch color analysis:', error);
            return null;
          }
        },
        retry: false,
      },
      {
        queryKey: [QUERY.BRAND],
        queryFn: async () => {
          try {
            return await brandApi.getBrand();
          } catch (error: any) {
            // 401 에러는 정상 (로그인 안 된 상태)
            if (error?.response?.status === 401) {
              return null;
            }
            // 네트워크 에러는 조용히 처리
            if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error') || error?.message?.includes('ERR_CONNECTION_REFUSED')) {
              console.warn('[useGetUser] 네트워크 에러 - 브랜드 정보를 가져올 수 없습니다:', error?.message);
              return null;
            }
            console.error('[useGetUser] Failed to fetch brand:', error);
            return null;
          }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });
};
