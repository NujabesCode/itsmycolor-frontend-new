'use client';

import { QUERY } from "@/configs/constant/query";
import { ROUTE } from "@/configs/constant/route";
import { brandApi } from "@/serivces/brand/request";
import { useGetUser } from "@/serivces/user/query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLikeBrand = (brandId: string) => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const [{ data: user }] = useGetUser();

  const isLiked = user?.brandLikes.some((like) => like.brandId === brandId);

  const handleLikeBrand = async () => {
    if (!user) {
      router.push(ROUTE.SIGNIN);
      return;
    }

    if (isLiked) {
      await brandApi.unlikeBrand(brandId);
    } else {
      await brandApi.likeBrand(brandId);
    }

    await queryClient.invalidateQueries({ queryKey: [QUERY.USER] });
    await queryClient.invalidateQueries({ queryKey: [QUERY.BRAND] });
  };

  return { isLiked, handleLikeBrand };
}; 