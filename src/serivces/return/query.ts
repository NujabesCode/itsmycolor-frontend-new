import { useQuery } from "@tanstack/react-query";
import { returnApi } from "./request";
import { QUERY } from "@/configs/constant/query";

export const useGetReturnListByBrand = (brandId: string) => {
  return useQuery({
    queryKey: [QUERY.RETURN_LIST_BY_BRAND, brandId],
    queryFn: () => returnApi.getReturnListByBrand(brandId),
    enabled: !!brandId,
  });
};
