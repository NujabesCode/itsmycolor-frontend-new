'use client';

import { useGetSettlementList } from '@/serivces/admin/query';
import { useState } from 'react';
import { Settlement, SettlementStatus } from '@/serivces/settlement/type';
import { BrandSettlementModal } from './BrandSettlementModal';

export const BrandSettlementList = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());

  const { data: settlementList } = useGetSettlementList(year, month);

  const [settlementData, setSettlementData] = useState<Settlement | null>(null);

  return (
    <section className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-grey-33">
            전체 결제 현황 및 정산
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-grey-47">조회 월 :</span>
            <input
              type="month"
              className="border border-grey-91 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-40"
              value={`${year}-${month.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                setYear(Number(year));
                setMonth(Number(month));
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-grey-96 text-grey-33">
                <th className="px-4 py-3 font-semibold text-left">브랜드명</th>
                <th className="px-4 py-3 font-semibold text-left">매출 (₩)</th>
                <th className="px-4 py-3 font-semibold text-left">
                  수수료 (12%)
                </th>
                <th className="px-4 py-3 font-semibold text-left">
                  정산 대기 금액
                </th>
                <th className="px-4 py-3 font-semibold text-left">
                  정산 완료 금액
                </th>
                <th className="px-4 py-3 font-semibold text-left">정산</th>
              </tr>
            </thead>
            <tbody>
              {settlementList?.map((settlement) => (
                <tr className="border-t border-grey-91" key={settlement.id}>
                  <td className="px-4 py-3">{settlement.brand.name}</td>
                  <td className="px-4 py-3">
                    {settlement.totalSales.toLocaleString()}원
                  </td>
                  <td className="px-4 py-3">
                    {settlement.commissionAmount.toLocaleString()}원
                  </td>
                  <td className="px-4 py-3">
                    {settlement.actualSettlementAmount.toLocaleString()}원
                  </td>
                  <td className="px-4 py-3">
                    {settlement.status === SettlementStatus.PENDING
                      ? 0
                      : settlement.actualSettlementAmount.toLocaleString()}
                    원
                  </td>
                  <td className="px-4 py-3">
                    {settlement.status === SettlementStatus.PENDING ? (
                      <button
                        className="text-blue-40 hover:underline"
                        onClick={() => setSettlementData(settlement)}
                      >
                        정산하기
                      </button>
                    ) : (
                      <span className="text-grey-47">정산 완료</span>
                    )}
                  </td>
                </tr>
              ))}

              {settlementList && settlementList?.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-grey-47"
                  >
                    해당 월의 정산 요청 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {settlementData && (
          <BrandSettlementModal
            settlementData={settlementData}
            onClose={() => setSettlementData(null)}
          />
        )}
      </div>
    </section>
  );
};
