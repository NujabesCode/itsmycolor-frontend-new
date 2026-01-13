'use client';

import { useGetCustomerList } from '@/serivces/admin/query';
import { formatDate } from '@/utils/date';
import { Customer } from '@/serivces/admin/type';

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

export const CustomerDetailModal = ({
  customer,
  onClose,
}: CustomerDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-grey-91">
          <h3 className="text-lg font-semibold text-grey-33">고객 상세 정보</h3>
          <button
            onClick={onClose}
            className="text-grey-47 hover:text-grey-33 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <div className="text-lg font-bold text-grey-33">
                {customer.name}
              </div>
              {customer.isVip && (
                <span className="inline-block px-2 py-1 text-xs rounded bg-orange-90 text-orange-20 font-semibold mt-1">
                  VIP 고객
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-grey-95">
              <span className="font-medium text-grey-47">연락처</span>
              <span className="text-grey-33">{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex justify-between py-2 border-b border-grey-95">
                <span className="font-medium text-grey-47">이메일</span>
                <span className="text-grey-33">{customer.email}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-grey-95">
              <span className="font-medium text-grey-47">체형 타입</span>
              <span className="text-grey-33">{customer.bodyType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-grey-95">
              <span className="font-medium text-grey-47">퍼스널 컬러</span>
              <span className="text-grey-33">{customer.colorSeason}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-grey-95">
              <span className="font-medium text-grey-47">최근 방문일</span>
              <span className="text-grey-33">
                {formatDate(customer.lastVisitDate ?? '')}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium text-grey-47">누적 구매액</span>
              <span className="text-grey-33 font-semibold">
                ₩{customer.purchaseInfo?.totalAmount?.toLocaleString() ?? '0'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t border-grey-91">
          <button
            onClick={onClose}
            className="px-4 py-2 text-grey-47 bg-grey-96 rounded-md hover:bg-grey-91 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
