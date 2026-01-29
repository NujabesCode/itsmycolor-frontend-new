import { QUERY } from "@/configs/constant/query";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "./request";
import { useQueryString } from "@/hooks/common/useQueryString";
import { CustomerType } from "./type";
import { BodyType, UserRole } from "../user/type";
import { ColorSeason } from "../color-analysis/type";
import { QnaType } from "../qna/type";
import { BrandStatus } from "../brand/type";
import { useState, useEffect } from "react";

export const useGetCustomerList = () => {
  const [customerType] = useQueryString<string>("customerType", "");
  const [bodyType] = useQueryString<string>("bodyType", "");
  const [colorSeason] = useQueryString<string>("colorSeason", "");
  const [searchTerm] = useQueryString<string>("searchTerm", "");

  // window.location.search에서 직접 page 값을 읽어서 항상 최신 값 사용
  const getPageFromUrl = () => {
    if (typeof window === 'undefined') return 1;
    try {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      if (pageParam) {
        const pageNum = parseInt(pageParam);
        if (!isNaN(pageNum) && pageNum >= 1) {
          return pageNum;
        }
      }
    } catch (e) {
      console.error('[useGetCustomerList] page 파싱 에러:', e);
    }
    return 1;
  };

  const [pageFromUrl, setPageFromUrl] = useState<number>(getPageFromUrl());
  
  // URL 변경 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkUrlChange = () => {
      const currentPage = getPageFromUrl();
      if (currentPage !== pageFromUrl) {
        console.log('[useGetCustomerList] page 변경 감지:', { old: pageFromUrl, new: currentPage });
        setPageFromUrl(currentPage);
      }
    };
    
    // 짧은 간격으로 URL 변경 확인
    const intervalId = setInterval(checkUrlChange, 50);
    
    // popstate 이벤트도 감지
    window.addEventListener('popstate', checkUrlChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('popstate', checkUrlChange);
    };
  }, [pageFromUrl]);

  const page = pageFromUrl;

  return useQuery({
    queryKey: [
      QUERY.ADMIN_CUSTOMER_LIST,
      customerType,
      bodyType,
      colorSeason,
      searchTerm,
      page,
    ],
    queryFn: () =>
      adminApi.getCustomerList({
        customerType: customerType ? (customerType as CustomerType) : undefined,
        bodyType: bodyType ? (bodyType as BodyType) : undefined,
        colorSeason: colorSeason ? (colorSeason as ColorSeason) : undefined,
        searchTerm: searchTerm || undefined,
        page: page ? page : undefined,
      }),
  });
};

export const useGetAccountList = () => {
  const [role] = useQueryString<string>("role", "");
  const [searchTerm] = useQueryString<string>("searchTerm", "");

  const [page] = useQueryString<number>("page", 1);

  return useQuery({
    queryKey: [QUERY.ADMIN_ACCOUNT_LIST, role, searchTerm, page],
    queryFn: () =>
      adminApi.getAccountList({
        role: role ? (role as UserRole) : undefined,
        searchTerm: searchTerm || undefined,
        page: page ? page : undefined,
      }),
  });
};

export const useGetBrandList = (status?: BrandStatus) => {
  return useQuery({
    queryKey: [QUERY.ADMIN_BRAND_LIST, status],
    queryFn: () => adminApi.getBrandList({ status }),
  });
};

export const useGetQnaList = () => {
  const [page] = useQueryString<number>("page", 1);
  const [type] = useQueryString<string>("type", "");

  return useQuery({
    queryKey: [QUERY.ADMIN_QNA_LIST, type, page],
    queryFn: () =>
      adminApi.getQnaList({
        type: type ? (type as QnaType) : undefined,
        page: page ? page : undefined,
      }),
  });
};

export const useGetProductList = () => {
  const [page] = useQueryString<number>("page", 1);
  const [sort] = useQueryString<string>("sort", "latest");
  const [bodyType] = useQueryString<string>("bodyType", "");
  const [search] = useQueryString<string>("search", "");

  return useQuery({
    queryKey: [QUERY.ADMIN_PRODUCT_LIST, page, sort, bodyType, search],
    queryFn: () =>
      adminApi.getProductList({
        page: page ? page : undefined,
        sort: sort as "latest" | "old",
        bodyType: bodyType ? (bodyType as BodyType) : undefined,
        search: search ? search : undefined,
      }),
  });
};

export const useGetSettlementList = (year: number, month: number) => {
  return useQuery({
    queryKey: [QUERY.ADMIN_SETTLEMENT_LIST, year, month],
    queryFn: () => adminApi.getSettlementList({ year, month }),
  });
};

export const useGetDashboard = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [QUERY.ADMIN_DASHBOARD, startDate, endDate],
    queryFn: () => adminApi.getDashboard(startDate, endDate),
  });
};

export const useGetBannerList = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY.ADMIN_BANNER_LIST, params],
    queryFn: () => adminApi.getBannerList(params),
  });
};

export const useGetBanner = (id: number) => {
  return useQuery({
    queryKey: [QUERY.ADMIN_BANNER, id],
    queryFn: () => adminApi.getBanner(id),
    enabled: !!id,
  });
};
