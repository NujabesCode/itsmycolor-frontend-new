'use client';

import { QUERY } from "@/configs/constant/query";
import { ROUTE } from "@/configs/constant/route";
import { productApi } from "@/serivces/product/request";
import { useGetUser } from "@/serivces/user/query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLikeProduct = (productId: string) => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const [{ data: user }] = useGetUser();

  const isLiked = user?.productLikes.some((likes) => likes.productId === productId);

  const handleLikeProduct = async () => {
    if (!user) {
      router.push(ROUTE.SIGNIN);
      return;
    }

    if (isLiked) {
      await productApi.unlikeProduct(productId);
    } else {
      await productApi.likeProduct(productId);
    }

    await queryClient.invalidateQueries({ queryKey: [QUERY.USER] });
  };


  return { isLiked, handleLikeProduct, user };
};