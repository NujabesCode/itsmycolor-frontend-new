'use client';

import { productApi } from '@/serivces/product/request';
import { useQuery } from '@tanstack/react-query';
import { QUERY } from '@/configs/constant/query';
import { ProductView } from './ProductView';

export const BestProductsSection = () => {
  const { data: productsData } = useQuery({
    queryKey: [QUERY.PRODUCT_LIST, 'best', 1],
    queryFn: () => productApi.getProductList({
      page: 1,
      limit: 20,
      sort: 'sales',
    }),
  });
  
  const bestProducts = productsData?.products?.slice(0, 5) || [];

  if (bestProducts.length === 0) {
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

