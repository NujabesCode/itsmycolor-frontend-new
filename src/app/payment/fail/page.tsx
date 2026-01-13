"use client";

import { useQueryString } from "@/hooks/common/useQueryString";
import Link from "next/link";
import { ROUTE } from "@/configs/constant/route";
import { useEffect, useState } from "react";

export default function PaymentFail() {
  const [orderId] = useQueryString<string>("orderId", "");
  const [message] = useQueryString<string>(
    "message",
    "결제 처리 중 오류가 발생했습니다."
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 py-8 px-8 text-center border-b border-gray-100">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
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
            </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-gray-900 mb-2">
            결제에 실패했습니다
          </h1>
          <p className="text-gray-500 text-sm">
            {orderId ? `주문번호: ${orderId}` : ""}
          </p>
        </div>

        {/* 실패 정보 */}
        <div className="px-8 py-8">
          <div className="text-center py-6">
            <p className="text-gray-700 mb-6">{message}</p>
            <p className="text-sm text-gray-500">
              결제 과정에서 문제가 발생했습니다. 다시 시도하시거나 고객센터로
              문의해 주세요.
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <Link
            href={ROUTE.MYPAGE_ORDER}
            className="flex-1 bg-white border border-gray-200 rounded-lg py-3 px-4 text-center text-gray-700 hover:bg-gray-50 transition-colors"
          >
            주문 내역으로 이동
          </Link>
          <Link
            href={ROUTE.SHOPPING}
            className="flex-1 bg-gray-900 rounded-lg py-3 px-4 text-center text-white hover:bg-gray-800 transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
