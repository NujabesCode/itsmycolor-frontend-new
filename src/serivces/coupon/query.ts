'use client';

import { useQuery } from '@tanstack/react-query';
import { couponApi } from './request';
import { QUERY } from '@/configs/constant/query';

export const useGetMyCoupons = () => {
  return useQuery({
    queryKey: [QUERY.COUPON_LIST],
    queryFn: () => couponApi.getMyCoupons(),
  });
};
