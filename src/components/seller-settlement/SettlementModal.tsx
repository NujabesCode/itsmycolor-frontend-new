"use client";

import { QUERY } from "@/configs/constant/query";
import { useQueryString } from "@/hooks/common/useQueryString";
import { settlementApi } from "@/serivces/settlement/request";
import { useGetUser } from "@/serivces/user/query";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

interface SettlementModalProps {
  totalAmount: number;
  onClose: () => void;
}

export const SettlementModal = ({
  totalAmount,
  onClose,
}: SettlementModalProps) => {
  const queryClient = useQueryClient();

  const [, , { data: brand }] = useGetUser();
  const brandId = brand?.id;

  const [year] = useQueryString<number>("year", new Date().getFullYear());
  const [month] = useQueryString<number>("month", new Date().getMonth() + 1);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const [isLoading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!bankName || !accountNumber || !accountHolder) {
      alert("은행명, 계좌번호, 예금주명을 모두 입력해주세요.");
      return;
    }

    if (!brandId) {
      alert("브랜드 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);

      await settlementApi.createSettlement(brandId, {
        settlementMonth: `${year}-${month.toString().padStart(2, "0")}`,
        totalSales: totalAmount,
        commissionRate: 12,
        commissionAmount: totalAmount * 0.12,
        actualSettlementAmount: totalAmount * 0.88,
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY.SETTLEMENT_LIST_BY_BRAND],
      });

      alert(
        "잇츠마이컬러 관리자에게 정산 요청을 완료했습니다. 정산 처리 완료시, 최근 정산 내역에 실시간 변경 반영됩니다."
      );
      onClose();
    } catch {
      alert("정산 요청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center mb-6 mt-2">
          <div className="bg-blue-600 p-2 rounded mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-blue-700">정산요청</h2>
        </div>

        {/* Settlement Month */}
        <div className="mb-6">
          <label className="block text-lg mb-2">정산 월</label>
          <div className="bg-gray-400/20 rounded-lg p-3">
            {year}년 {month}월
          </div>
        </div>

        {/* Financial Information */}
        <div className="mb-6">
          <div className="flex justify-between py-3 border-b">
            <span className="text-lg">총 매출</span>
            <span className="text-lg font-semibold text-blue-600">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-lg">수수료 (12%)</span>
            <span className="text-lg font-semibold text-amber-500">
              {(totalAmount * 0.12).toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-lg">실정산금액</span>
            <span className="text-lg font-semibold text-green-600">
              {(totalAmount * 0.88).toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Bank Account */}
        <div className="mb-6">
          <label className="block text-lg mb-2">정산 입금 계좌</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-lg mb-3"
            placeholder="은행명"
          />
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-lg mb-3"
            placeholder="계좌번호"
          />
        </div>

        {/* Depositor Name */}
        <div className="mb-8">
          <label className="block text-lg mb-2">예금주명</label>
          <input
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-lg"
            placeholder="예금주명"
          />
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center"
          onClick={onSubmit}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-lg font-medium">정산요청</span>
        </button>
      </div>
    </div>
  );
};
