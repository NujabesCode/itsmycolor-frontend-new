'use client';

import dynamic from 'next/dynamic';
import { productApi } from '@/serivces/product/request';
import { useQuery } from '@tanstack/react-query';
import { QUERY } from '@/configs/constant/query';
import { useEffect } from 'react';

// dynamic import로 순환 참조 방지
const ProductView = dynamic(() => import('./ProductView').then(mod => ({ default: mod.ProductView })), { 
  ssr: false 
});

export const BestProductsSection = () => {
  const { data: productsData, error, isLoading } = useQuery({
    queryKey: [QUERY.PRODUCT_LIST, 'best', 1],
    queryFn: () => productApi.getProductList({
      page: 1,
      limit: 20,
      sort: 'sales',
    }),
    retry: 2,
    retryDelay: 1000,
  });
  
  // 에러 로깅
  useEffect(() => {
    if (error) {
      console.error('[BestProductsSection] API 에러:', error);
      console.error('[BestProductsSection] 에러 상세:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }, [error]);
  
  const bestProducts = productsData?.products?.slice(0, 5) || [];

  // 에러 발생 시 아무것도 렌더링하지 않음 (조용히 실패)
  if (error) {
    console.warn('[BestProductsSection] 에러로 인해 BEST 상품 섹션을 표시하지 않습니다.');
    return null;
  }

  // 로딩 중이거나 상품이 없으면 아무것도 렌더링하지 않음
  if (isLoading || bestProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
      {bestProducts.map((product) => (
        <ProductView key={product.id} product={product} />
      ))}
    </div>
  );
};

