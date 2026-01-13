'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/serivces/client';
import { Settlement, SettlementStatus } from '@/serivces/settlement/type';
import { IoDownloadOutline, IoCalendarOutline, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { adminApi } from '@/serivces/admin/request';

// Excel 다운로드 함수
const downloadExcel = (data: any[], filename: string) => {
  const headers = ['정산월', '브랜드명', '총 매출', '수수료율', '수수료', '지급금액', '상태', '생성일'];
  const csvContent = [
    headers.join(','),
    ...data.map((item) => [
      item.settlementMonth,
      item.brand?.name || '-',
      item.totalSales,
      `${item.commissionRate}%`,
      item.commissionAmount,
      item.actualSettlementAmount,
      item.status,
      new Date(item.createdAt).toLocaleDateString(),
    ].join(',')),
  ].join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdminSettlement() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const queryClient = useQueryClient();

  // FC-001: 기간 필터로 정산 내역 조회
  const { data: settlements, isLoading } = useQuery({
    queryKey: ['admin-settlements', startDate, endDate],
    queryFn: async () => {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await axiosInstance.get('/settlements', { params });
      return response.data;
    },
  });

  // FC-002: 정산 상세 조회
  const { data: settlementDetail } = useQuery({
    queryKey: ['settlement-detail', selectedSettlement?.id],
    queryFn: async () => {
      if (!selectedSettlement?.id) return null;
      const response = await axiosInstance.get(`/settlements/${selectedSettlement.id}`);
      return response.data;
    },
    enabled: !!selectedSettlement?.id,
  });

  // FC-003: 정산 확정 처리
  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.put(`/settlements/${id}/confirm`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settlements'] });
      queryClient.invalidateQueries({ queryKey: ['settlement-detail'] });
      alert('정산이 확정되었습니다. 상태가 "지급 예정"으로 변경되었습니다.');
    },
  });

  // FC-004: 지급 완료 처리
  const completePaymentMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.put(`/settlements/${id}/payment-complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settlements'] });
      queryClient.invalidateQueries({ queryKey: ['settlement-detail'] });
      alert('지급이 완료되었습니다. 상태가 "지급 완료"로 변경되었습니다.');
    },
  });

  // FC-005: Excel 다운로드
  const handleDownloadExcel = () => {
    if (!settlements || settlements.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }
    downloadExcel(settlements, `정산내역_${startDate || '전체'}_${endDate || '전체'}`);
  };

  const getStatusColor = (status: SettlementStatus) => {
    switch (status) {
      case SettlementStatus.PENDING:
        return 'text-yellow-600 bg-yellow-50';
      case SettlementStatus.PAYMENT_SCHEDULED:
        return 'text-blue-600 bg-blue-50';
      case SettlementStatus.COMPLETED:
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grey-98 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-grey-71">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-98 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-grey-20">정산 관리</h1>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 px-4 py-2 bg-azure-39 text-white rounded-lg hover:bg-azure-50 transition-colors"
        >
          <IoDownloadOutline size={20} />
          <span>Excel 다운로드</span>
        </button>
      </div>

      {/* FC-001: 기간 필터 */}
      <div className="bg-white-solid rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <IoCalendarOutline size={20} className="text-grey-46" />
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-grey-20 mb-1">시작 날짜</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-grey-20 mb-1">종료 날짜</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
              />
            </div>
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="mt-6 px-4 py-2 bg-grey-91 text-grey-20 rounded-lg hover:bg-grey-80 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 정산 리스트 */}
      <div className="bg-white-solid rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-91 bg-grey-98">
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">정산월</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">브랜드명</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-grey-20">총 매출</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-grey-20">수수료</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-grey-20">지급금액</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-grey-20">상태</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-grey-20">작업</th>
              </tr>
            </thead>
            <tbody>
              {settlements && settlements.length > 0 ? (
                settlements.map((settlement: Settlement) => (
                  <tr
                    key={settlement.id}
                    className="border-b border-grey-91 hover:bg-grey-98 cursor-pointer"
                    onClick={() => setSelectedSettlement(settlement)}
                  >
                    <td className="py-3 px-4 text-sm text-grey-20">{settlement.settlementMonth}</td>
                    <td className="py-3 px-4 text-sm text-grey-20">
                      {settlement.brand?.name || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-grey-20 text-right">
                      {settlement.totalSales.toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 text-sm text-grey-20 text-right">
                      {settlement.commissionAmount.toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 text-sm text-grey-20 text-right">
                      {settlement.actualSettlementAmount.toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(settlement.status)}`}>
                        {settlement.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {settlement.status === SettlementStatus.PENDING && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('정산을 확정하시겠습니까?')) {
                                confirmMutation.mutate(settlement.id);
                              }
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            확정
                          </button>
                        )}
                        {settlement.status === SettlementStatus.PAYMENT_SCHEDULED && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('지급을 완료 처리하시겠습니까?')) {
                                completePaymentMutation.mutate(settlement.id);
                              }
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            지급 완료
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSettlement(settlement);
                          }}
                          className="px-3 py-1 bg-grey-91 text-grey-20 rounded text-xs hover:bg-grey-80"
                        >
                          상세
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-grey-46">
                    조회된 정산 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FC-002: 정산 상세 모달 */}
      {selectedSettlement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-grey-20">정산 상세</h2>
              <button
                onClick={() => setSelectedSettlement(null)}
                className="text-grey-46 hover:text-grey-20"
              >
                <IoCloseCircle size={24} />
              </button>
            </div>

            {settlementDetail && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">정산월</label>
                    <div className="text-base text-grey-20">{settlementDetail.settlementMonth}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">브랜드명</label>
                    <div className="text-base text-grey-20">{settlementDetail.brand?.name || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">총 매출</label>
                    <div className="text-lg font-semibold text-grey-20">
                      {settlementDetail.totalSales.toLocaleString()}원
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">수수료율</label>
                    <div className="text-base text-grey-20">{settlementDetail.commissionRate}%</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">수수료</label>
                    <div className="text-lg font-semibold text-grey-20">
                      {settlementDetail.commissionAmount.toLocaleString()}원
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">지급금액</label>
                    <div className="text-lg font-semibold text-azure-39">
                      {settlementDetail.actualSettlementAmount.toLocaleString()}원
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">상태</label>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(settlementDetail.status)}`}>
                      {settlementDetail.status}
                    </span>
                  </div>
                  {settlementDetail.settledAt && (
                    <div>
                      <label className="block text-sm font-medium text-grey-46 mb-1">지급 완료일</label>
                      <div className="text-base text-grey-20">
                        {new Date(settlementDetail.settledAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* 금액 검증 */}
                <div className="mt-4 p-4 bg-grey-98 rounded-lg">
                  <div className="text-sm font-medium text-grey-20 mb-2">금액 계산 검증</div>
                  <div className="text-xs text-grey-71 space-y-1">
                    <div>
                      총 매출: {settlementDetail.totalSales.toLocaleString()}원
                    </div>
                    <div>
                      - 수수료 ({settlementDetail.commissionRate}%): {settlementDetail.commissionAmount.toLocaleString()}원
                    </div>
                    <div className="border-t border-grey-91 pt-1 mt-1">
                      = 지급금액: {settlementDetail.actualSettlementAmount.toLocaleString()}원
                    </div>
                    {settlementDetail.totalSales - settlementDetail.commissionAmount === settlementDetail.actualSettlementAmount ? (
                      <div className="text-green-600 mt-2 flex items-center gap-1">
                        <IoCheckmarkCircle size={16} />
                        <span>금액 계산이 정확합니다.</span>
                      </div>
                    ) : (
                      <div className="text-red-600 mt-2 flex items-center gap-1">
                        <IoCloseCircle size={16} />
                        <span>금액 계산에 오차가 있습니다.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}










