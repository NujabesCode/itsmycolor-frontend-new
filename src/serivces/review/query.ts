"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "./request";
import { QUERY } from "@/configs/constant/query";
import { useQueryString } from "@/hooks/common/useQueryString";

export const useGetReviewListByProduct = (productId: string) => {
  const [page] = useQueryString<number>("page", 1);
  const [sort] = useQueryString<"latest" | "rating">("sort", "latest");

  return useQuery({
    queryKey: [QUERY.REVIEW_LIST_BY_PRODUCT, productId, page, sort],
    queryFn: () =>
      reviewApi.getReviewListByProductId({
        productId,
        page,
        sort,
      }),
  });
};
