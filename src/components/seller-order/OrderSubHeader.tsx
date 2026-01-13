'use client';

import { useQueryString } from "@/hooks/common/useQueryString";
import { OrderStatus } from "@/serivces/order/type";

export const subHeaders = [
  {
    index: 0,
    key: [OrderStatus.CONFIRMED],
    title: "주문 승인/취소",
    description: "주문을 승인, 취소하는 화면입니다.\n주문 승인 후 '발송 처리' 탭에서 송장 번호를 입력해주세요.",
  },
  {
    index: 1,
    key: [OrderStatus.SHIPPED],
    title: "발송 처리",
    description: "택배 발송 후 송장 번호를 입력하는 화면입니다.",
  },
  {
    index: 2,
    key: [OrderStatus.DELIVERING],
    title: "완료 처리",
    description: "배송 완료 후 주문 완료 처리를 하는 화면입니다.",
  },
  {
    index: 3,
    key: [OrderStatus.DELIVERED],
    title: "완료된 주문",
    description: "배송 완료된 주문을 확인하는 화면입니다.",
  },
  {
    index: 4,
    key: [OrderStatus.CANCELLED],
    title: "취소된 주문",
    description: "취소된 주문을 확인하는 화면입니다.",
  },
];

export const OrderSubHeader = () => {
  const [statuses, setStatuses] = useQueryString<string[]>('statuses', [OrderStatus.CONFIRMED]);

  return (
    <div className="bg-white border-b border-gray-200">
      <nav className="flex px-6 space-x-8" aria-label="Order sub navigation">
        {subHeaders.map(({ key, title }, i) => (
          <button
            key={`order-sub-header-${i}`}
            onClick={() => setStatuses(key)}
            className={`py-4 text-sm font-medium whitespace-nowrap ${
              JSON.stringify(statuses) === JSON.stringify(key)
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {title}
          </button>
        ))}
      </nav>
      <p className="px-6 py-5 text-xs leading-5 text-gray-500 whitespace-pre-line">
        {subHeaders.find((item) => JSON.stringify(statuses) === JSON.stringify(item.key))?.description}
      </p>
    </div>
  );
};