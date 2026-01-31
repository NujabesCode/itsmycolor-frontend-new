import { useQuery } from "@tanstack/react-query";
import { bannerApi } from "./request";
import { QUERY } from "@/configs/constant/query";

export const useGetPublicBanners = () => {
  return useQuery({
    queryKey: [QUERY.PUBLIC_BANNERS],
    queryFn: () => bannerApi.getPublicBanners(),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};
