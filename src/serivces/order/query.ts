import { useQuery } from '@tanstack/react-query';
import { orderApi } from './request';
import { QUERY } from '@/configs/constant/query';
import { useState } from 'react';
import { useQueryString } from '@/hooks/common/useQueryString';
import { OrderStatus } from './type';

export const useGetOrder = (orderId: string) => {
  return useQuery({
    queryKey: [QUERY.ORDER, orderId],
    queryFn: () => orderApi.getOrder(orderId),
  });
};

export const useGetOrderList = () => {
  const [page] = useQueryString<number>('page', 1);
  const [status] = useQueryString<string>('status', '');
  const [search] = useQueryString<string>('search', '');
  const [period] = useQueryString<string>('period', '1m');

  const startDate = period
    ? new Date(
        new Date().setDate(
          new Date().getDate() -
            (period === '1m'
              ? 30
              : period === '3m'
              ? 90
              : period === '6m'
              ? 180
              : period === '1y'
              ? 365
              : 0)
        )
      )
    : undefined;
  const endDate = period ? new Date() : undefined;

  return useQuery({
    queryKey: [QUERY.ORDER_LIST, page, status, search, period],
    queryFn: () =>
      orderApi.getOrderList({
        page: page ? page : undefined,
        status: status ? (status as OrderStatus) : undefined,
        search: search ? search : undefined,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      }),
  });
};

export const useGetOrderListByBrand = (brandId: string) => {
  const [page] = useQueryString<number>('page', 1);
  const [statuses] = useQueryString<string[]>('statuses', [OrderStatus.CONFIRMED]);
  const [search] = useQueryString<string>('search', '');
  const [startDate] = useQueryString<string>('startDate', '');
  const [endDate] = useQueryString<string>('endDate', '');
  const [sortBy] = useQueryString<string>('sortBy', 'createdAt');
  const [sortOrder] = useQueryString<'ASC' | 'DESC'>('sortOrder', 'DESC');

  return useQuery({
    queryKey: [QUERY.ORDER_LIST_BY_BRAND, brandId, page, statuses, search, startDate, endDate, sortBy, sortOrder],
    queryFn: () => orderApi.getOrderListByBrand(brandId, {
      page,
      statuses: statuses.length > 0 ? statuses.map(status => status as OrderStatus) : undefined,
      search: search || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    }),
    enabled: !!brandId,
  });
};

export const useGetMonthlyOrderListByBrand = (brandId: string) => {
  const [year] = useQueryString<number>('year', new Date().getFullYear());
  const [month] = useQueryString<number>('month', new Date().getMonth() + 1);

  return useQuery({
    queryKey: [QUERY.MONTHLY_ORDER_LIST_BY_BRAND, brandId, year, month],
    queryFn: () =>
      orderApi.getMonthlyOrderListByBrand(brandId, {
        year,
        month,
      }),
    enabled: !!brandId,
  });
};

export const useGetThisMonthOrderListByBrand = (brandId: string) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  return useQuery({
    queryKey: [QUERY.MONTHLY_ORDER_LIST_BY_BRAND, brandId, year, month],
    queryFn: () =>
      orderApi.getMonthlyOrderListByBrand(brandId, {
        year,
        month,
      }),
    enabled: !!brandId,
  });
};

export const useGetTodayOrderListByBrand = (brandId: string) => {
  return useQuery({
    queryKey: [QUERY.TODAY_ORDER_LIST_BY_BRAND, brandId],
    queryFn: () => orderApi.getTodayOrderListByBrand(brandId),
    enabled: !!brandId,
  });
};
