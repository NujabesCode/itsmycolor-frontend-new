"use client";

import React, { useState } from "react";

import { useGetMonthlyOrderListByBrand } from "@/serivces/order/query";
import { useGetUser } from "@/serivces/user/query";
import { useQueryString } from "@/hooks/common/useQueryString";
import { SettlementModal } from "@/components/seller-settlement/SettlementModal";
import { useGetSettlementListByBrand } from "@/serivces/settlement/query";
import { SettlementListView } from "@/components/seller-settlement/SettlementListView";
import { IoWallet, IoCalendar } from "react-icons/io5";

export default function SellerSettlement() {
  const [, , { data: brand }] = useGetUser();
  const { data: orderList } = useGetMonthlyOrderListByBrand(brand?.id ?? "");
  const { data: settlementList } = useGetSettlementListByBrand(brand?.id ?? "");

  const [year, setYear] = useQueryString<number>(
    "year",
    new Date().getFullYear()
  );
  const [month, setMonth] = useQueryString<number>(
    "month",
    new Date().getMonth() + 1
  );

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [isOpenSettlementModal, setOpenSettlementModal] = useState(false);
  const totalAmount =
    orderList?.reduce((acc, curr) => acc + curr.totalAmount, 0) ?? 0;

  const isDoneSettlement = settlementList?.some((settlement) => {
    const [targetYear, targetMonth] = settlement.settlementMonth.split("-");
    return year === Number(targetYear) && month === Number(targetMonth);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">정산 관리</h1>
            <p className="text-sm text-gray-500 mt-1">
              월별 매출 및 정산 현황
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <IoCalendar className="text-gray-400" />
              <input
                type="month"
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                value={`${year}-${month.toString().padStart(2, "0")}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-");
                  const prevParam = setYear(Number(year));
                  setMonth(Number(month), prevParam);
                }}
              />
            </div>
            <button
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors"
              onClick={() => {
                if (isDoneSettlement) {
                  alert("해당 월은 이미 정산 요청이 완료되었습니다.");
                  return;
                }

                if (
                  year > currentYear ||
                  (year === currentYear && month > currentMonth)
                ) {
                  alert(
                    `${currentYear}년 ${currentMonth}월 기준, 지난 월만 정산 요청이 가능합니다.`
                  );
                  return;
                }

                if (year === currentYear && month == currentMonth) {
                  alert("당월 정산 요청은 익월에 가능합니다.");
                  return;
                }

                if (totalAmount === 0) {
                  alert("정산 요청 금액이 없습니다.");
                  return;
                }

                setOpenSettlementModal(true);
              }}
            >
              정산 요청
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 정산 요약 카드 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <IoWallet className="text-2xl text-gray-700" />
            <h2 className="text-lg font-medium text-gray-900">
              {year}년 {month}월 정산 요약
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">총 매출</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalAmount.toLocaleString()}원
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-700 mb-1">수수료 (12%)</p>
              <p className="text-2xl font-semibold text-yellow-800">
                -{(totalAmount * 0.12).toLocaleString()}원
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700 mb-1">실 정산금액</p>
              <p className="text-2xl font-semibold text-green-800">
                {(totalAmount * 0.88).toLocaleString()}원
              </p>
            </div>
          </div>

          {isDoneSettlement && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                ✓ 이번 달의 정산이 요청되었습니다.
              </p>
            </div>
          )}
        </div>

        {/* 정산 내역 테이블 */}
        {settlementList && <SettlementListView settlementList={settlementList} />}
      </div>

      {isOpenSettlementModal && (
        <SettlementModal
          totalAmount={totalAmount}
          onClose={() => setOpenSettlementModal(false)}
        />
      )}
    </div>
  );
}
