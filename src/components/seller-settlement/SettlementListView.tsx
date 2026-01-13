import { Settlement } from '@/serivces/settlement/type';

export const SettlementListView = ({ settlementList }: { settlementList: Settlement[] }) => {
  return (
    <div>
      <div className="flex items-center mb-2 text-gray-700 font-semibold">
        <span className="mr-2">⟳</span>최근 정산 내역
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-[#f3f4f6] text-gray-700">
            <tr>
              <th className="py-2 px-4 font-semibold">정산월</th>
              <th className="py-2 px-4 font-semibold">총 매출</th>
              <th className="py-2 px-4 font-semibold">수수료(12%)</th>
              <th className="py-2 px-4 font-semibold">실정산금액</th>
              <th className="py-2 px-4 font-semibold">진행상태</th>
            </tr>
          </thead>
          <tbody>
            {settlementList.map((settlement, idx) => (
              <tr key={settlement.id} className="border-t last:border-b hover:bg-[#f3f4f6]">
                <td className="py-2 px-4 text-center">{settlement.settlementMonth}</td>
                <td className="py-2 px-4 text-right">{settlement.totalSales.toLocaleString()}원</td>
                <td className="py-2 px-4 text-right">{settlement.commissionAmount.toLocaleString()}원</td>
                <td className="py-2 px-4 text-right">{settlement.actualSettlementAmount.toLocaleString()}원</td>
                <td className="py-2 px-4 text-center">
                  <span className="px-3 py-1 rounded-full text-white bg-[#1d4ed8] text-xs font-semibold">
                    {settlement.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
