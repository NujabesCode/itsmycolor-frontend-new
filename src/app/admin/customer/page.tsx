import { CustomerFilter } from '@/components/admin-customer/CustomerFilter';
import { CustomerList } from '@/components/admin-customer/CustomerList';
import { Suspense } from 'react';

export default function AdminCustomer() {
  return (
    <div className="p-8 bg-grey-98 min-h-screen">
      {/* 상단 제목 및 설명 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-11 mb-1">고객 관리</h1>
        <p className="text-sm text-grey-46">
          고객 정보를 조회하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 필터 & 검색 */}
      <Suspense>
        <CustomerFilter />

        <CustomerList />
      </Suspense>
    </div>
  );
}
