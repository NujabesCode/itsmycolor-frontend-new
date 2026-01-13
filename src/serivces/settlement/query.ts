'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementApi } from './request';
import { QUERY } from '@/configs/constant/query';

export const useGetSettlementListByBrand = (brandId: string) => {
  return useQuery({
    queryKey: [QUERY.SETTLEMENT_LIST_BY_BRAND, brandId],
    queryFn: () => settlementApi.getSettlementListByBrand(brandId),
    enabled: !!brandId,
  });
};
