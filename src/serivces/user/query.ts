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
        queryFn: userApi.getUser,
      },
      {
        queryKey: [QUERY.COLOR_ANALYSIS],
        queryFn: colorAnalysisApi.getColorAnalysis,
      },
      {
        queryKey: [QUERY.BRAND],
        queryFn: brandApi.getBrand,
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });
};
