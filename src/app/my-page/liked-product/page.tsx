'use client';

import { ProductView } from '@/components/shopping/ProductView';
import { ProductListItem } from '@/serivces/product/type';
import { useGetLikedProductList } from '@/serivces/product/query';
import { Pagination } from '@/components/common/Pagination';
import { useQueryString } from '@/hooks/common/useQueryString';

export default function LikedProduct() {
  const [page] = useQueryString<number>('page', 1);
  const { data, isLoading } = useGetLikedProductList(page);

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const lastPage = data?.lastPage ?? 1;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">찜한 상품</h1>
        <p className="text-gray-600">
          총{' '}
          <span className="font-semibold text-gray-900">
            {total}
          </span>
          개의 상품을 찜했습니다
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <p>로딩 중...</p>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product: ProductListItem) => (
            <ProductView key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            아직 찜한 상품이 없습니다
          </h3>
          <p className="text-gray-500 mb-6">마음에 드는 상품을 찜해보세요</p>
          <a
            href="/shopping"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            쇼핑하러 가기
          </a>
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && <Pagination lastPage={lastPage} />}
    </div>
  );
}
