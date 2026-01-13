import { ProductFilter } from '@/components/admin-product/ProductFilter';
import { ProductListView } from '@/components/admin-product/ProductListView';
import { Suspense } from 'react';

export default function AdminProduct() {
  return (
    <div className="p-8 bg-grey-98 min-h-screen">
      {/* 상단 제목 및 설명 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-11 mb-1">상품 관리</h1>
        <p className="text-sm text-grey-46">
          등록된 상품을 관리하고 편집할 수 있습니다.
        </p>
      </div>

      {/* 필터 & 검색 */}
      <Suspense>
        <ProductFilter />

        <ProductListView />
      </Suspense>
    </div>
  );
}
