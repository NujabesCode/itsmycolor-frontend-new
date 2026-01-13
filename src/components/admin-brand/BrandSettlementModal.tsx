'use client';

import React, { useState } from 'react';

import { Settlement } from '@/serivces/settlement/type';
import { adminApi } from '@/serivces/admin/request';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY } from '@/configs/constant/query';

interface BrandSettlementModalProps {
  settlementData: Settlement;
  onClose: () => void;
}

export const BrandSettlementModal = ({ settlementData, onClose }: BrandSettlementModalProps) => {
  const queryClient = useQueryClient();

  const [isLoading, setLoading] = useState(false);
  const onSubmit = async () => {
    try {
      setLoading(true);

      await adminApi.putSettlementComplete(settlementData.id);
      await queryClient.invalidateQueries({ queryKey: [QUERY.ADMIN_SETTLEMENT_LIST] });

      alert('정산 완료 처리되었습니다.');
      onClose();
    } catch {
      alert('정산 완료 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">정산 안내</h2>
          <p className="text-xl font-bold mb-4">{settlementData.brand.name}</p>

          <p className="text-gray-700 mb-4">정말로 정산 하시겠습니까?</p>

          <p className="text-gray-700">
            정산 시에,{' '}
            <span className="text-red-500 font-bold">
              수수료 12% ({settlementData.commissionAmount.toLocaleString()}원)
            </span>{' '}
            만큼 잇츠마이컬러에,{' '}
            <span className="text-blue-800 font-bold">
              90% ({settlementData.actualSettlementAmount.toLocaleString()}원)
            </span>
            은 브랜드에게 나누어집니다.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-8 rounded"
            onClick={onSubmit}
            disabled={isLoading}
          >
            확인
          </button>
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-8 rounded">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
