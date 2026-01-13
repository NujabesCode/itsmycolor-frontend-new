import { BrandList } from '@/components/admin-brand/BrandList';
import { BrandSettlementList } from '@/components/admin-brand/BrandSettlementList';
import { QnaList } from '@/components/admin-brand/QnaList';
import { Suspense } from 'react';

export default function AdminBrand() {
  return (
    <div className="p-8 bg-grey-98 min-h-screen">
      {/* 상단 제목 및 설명 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-11 mb-1">브랜드 관리</h1>
        <p className="text-sm text-grey-46">
          브랜드 입점 관리, Q&A 처리, 정산 관리를 할 수 있습니다.
        </p>
      </div>

      <BrandList />

      <Suspense>
        <QnaList />
      </Suspense>

      <BrandSettlementList />
    </div>
  );
}
