import { useQuery } from '@tanstack/react-query';
import { qnaApi } from './request';
import { QUERY } from '@/configs/constant/query';
import { useQueryString } from '@/hooks/common/useQueryString';
import { QnaStatus } from '../admin/type';
import { QnaType } from './type';

export const useGetQnaListByUser = () => {
  const [page] = useQueryString<number>('page', 1);
  const [status] = useQueryString<string>('status', '');
  const [type] = useQueryString<string>('type', '');

  return useQuery({
    queryKey: [QUERY.QNA_LIST_BY_USER, page, status, type],
    queryFn: () =>
      qnaApi.getQnaListByUser({
        page: page ? page : undefined,
        status: status ? (status as QnaStatus) : undefined,
        type: type ? (type as QnaType) : undefined,
      }),
  });
};

export const useGetQnaListByProduct = (productId: string) => {
  const [page] = useQueryString<number>('page', 1);

  return useQuery({
    queryKey: [QUERY.QNA_LIST_BY_PRODUCT, productId, page],
    queryFn: () => qnaApi.getQnaListByProduct(productId, page),
  });
};

export const useGetQnaListByBrand = (brandId: string) => {
  return useQuery({
    queryKey: [QUERY.QNA_LIST_BY_BRAND, brandId],
    queryFn: () => qnaApi.getQnaListByBrand(brandId),
    enabled: !!brandId,
  });
};
