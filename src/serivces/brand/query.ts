'use client';

import { useQuery } from '@tanstack/react-query';
import { brandApi } from './request';
import { QUERY } from '@/configs/constant/query';

export const useGetBrand = (id: string) => {
  return useQuery({
    queryKey: [QUERY.BRAND, id],
    queryFn: () => brandApi.getBrandById(id),
    enabled: !!id,
  });
}; 