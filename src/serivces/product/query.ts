"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "./request";
import { QUERY } from "@/configs/constant/query";
import { useQueryString } from "@/hooks/common/useQueryString";
import { ColorSeason } from "../color-analysis/type";
import { StyleCategory } from "./type";
import { BodyType } from "../user/type";

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: [QUERY.PRODUCT, id],
    queryFn: () => productApi.getProduct(id),
  });
};

export const useGetFitProductList = (bodyType?: BodyType, colorSeason?: ColorSeason) => {
  return useQuery({
    queryKey: [QUERY.PRODUCT_LIST_FIT, bodyType, colorSeason],
    queryFn: () => productApi.getProductList({
      page: 1,
      bodyType,
      colorSeasons: colorSeason ? [colorSeason] : undefined,
    }),
  });
};


export const useGetProductList = (page: number) => {
  const [colorSeasons] = useQueryString<string[]>("colorSeasons", []);
  const [styleCategories] = useQueryString<string[]>("styleCategories", []);
  const [bodyType] = useQueryString<string>("bodyType", "");
  const [search] = useQueryString<string>("search", "");
  const [clothingCategory] = useQueryString<string>("clothingCategory", "");
  const [sort] = useQueryString<string>("sort", "latest");

  return useQuery({
    queryKey: [
      QUERY.PRODUCT_LIST,
      page,
      colorSeasons,
      styleCategories,
      bodyType,
      search,
      clothingCategory,
      sort,
    ],
    queryFn: async () => {
      console.log('[useGetProductList] API 호출 시작:', {
        page,
        colorSeasons,
        styleCategories,
        bodyType,
        search,
        clothingCategory,
        sort,
      });
      try {
        const result = await productApi.getProductList({
          page,
          sort: sort || "latest",
          colorSeasons:
            colorSeasons.length > 0
              ? (colorSeasons as ColorSeason[])
              : undefined,
          styleCategories:
            styleCategories.length > 0
              ? (styleCategories as StyleCategory[])
              : undefined,
          bodyType: bodyType ? (bodyType as BodyType) : undefined,
          search: search ? search : undefined,
          clothingCategory: clothingCategory ? clothingCategory : undefined,
        });
        console.log('[useGetProductList] API 호출 성공:', {
          productsCount: result.products?.length || 0,
          lastPage: result.lastPage,
        });
        return result;
      } catch (error) {
        console.error('[useGetProductList] API 호출 실패:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetProductListMyType = (bodyType?: BodyType) => {
  return useQuery({
    queryKey: [QUERY.PRODUCT_LIST_MY_TYPE, bodyType],
    queryFn: () => productApi.getProductListMyType({ bodyType }),
    enabled: !!bodyType,
  });
};

export const useGetProductListByBrand = (brandId: string) => {
  const [page] = useQueryString<number>("page", 1);

  return useQuery({
    queryKey: [QUERY.PRODUCT_LIST_BY_BRAND, brandId, page],
    queryFn: () => productApi.getProductListByBrand(brandId, { page }),
    enabled: !!brandId,
  });
};

// 찜한 상품 리스트 조회
export const useGetLikedProductList = (page: number) => {
  return useQuery({
    queryKey: [QUERY.PRODUCT_LIKED_LIST, page],
    queryFn: () => productApi.getLikedProductList({ page }),
  });
};

// 메인 페이지 상품 조회
export const useGetMainProducts = () => {
  return useQuery({
    queryKey: [QUERY.PRODUCT_MAIN],
    queryFn: () => productApi.getMainProducts(),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// 상품 삭제 mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productApi.deleteProduct(productId),
    onSuccess: () => {
      // 삭제 후 상품 리스트 관련 쿼리들 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY.PRODUCT_LIST_BY_BRAND],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY.PRODUCT_LIST],
      });
    },
  });
};
