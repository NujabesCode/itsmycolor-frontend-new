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
            console.error('[useGetUser] Failed to fetch user:', error);
            throw error;
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
