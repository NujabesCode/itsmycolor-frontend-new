'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/serivces/client';

export default function AdminCommission() {
  const [defaultRate, setDefaultRate] = useState<number>(12);
  const queryClient = useQueryClient();

  // FC-006, FC-007, FC-008: 수수료 설정 조회
  const { data: commission, isLoading } = useQuery({
    queryKey: ['commission-settings'],
    queryFn: async () => {
      // 실제 API 엔드포인트로 변경 필요
      const response = await axiosInstance.get('/commissions/settings');
      return response.data;
    },
  });

  // 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (commission?.defaultRate) {
      setDefaultRate(commission.defaultRate);
    }
  }, [commission]);

  // 수수료 설정 저장
  const saveMutation = useMutation({
    mutationFn: async (rate: number) => {
      await axiosInstance.put('/commissions/settings', { defaultRate: rate });
    },
  });

  // mutation 성공 시 처리
  useEffect(() => {
    if (saveMutation.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['commission-settings'] });
      alert('수수료 설정이 저장되었습니다.');
    }
  }, [saveMutation.isSuccess, queryClient]);

  const handleSave = () => {
    if (defaultRate < 0 || defaultRate > 100) {
      alert('수수료율은 0% 이상 100% 이하여야 합니다.');
      return;
    }
    if (confirm(`기본 수수료율을 ${defaultRate}%로 설정하시겠습니까?`)) {
      saveMutation.mutate(defaultRate);
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
      <h1 className="text-2xl font-bold text-grey-20 mb-6">수수료 관리</h1>

      <div className="bg-white-solid rounded-xl shadow p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-grey-20 mb-4">기본 수수료 설정</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-grey-20 mb-2">
              기본 수수료율 (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={defaultRate}
              onChange={(e) => setDefaultRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
            />
            <p className="text-xs text-grey-71 mt-1">
              모든 브랜드에 적용되는 기본 수수료율을 설정합니다.
            </p>
          </div>

          <div className="pt-4 border-t border-grey-91">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-azure-39 text-white rounded-lg hover:bg-azure-50 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


