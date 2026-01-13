"use client";

import { useGetReturnListByBrand } from "@/serivces/return/query";
import { Return, ReturnStatus } from "@/serivces/return/type";
import { useGetUser } from "@/serivces/user/query";
import React, { useState } from "react";
import { ReturnManageModal } from "@/components/seller-return/ReturnManageModal";
import { IoSwapHorizontal, IoCheckmarkCircle } from "react-icons/io5";

export default function SellerReturn() {
  const [, , { data: brand }] = useGetUser();
  const { data: returnList } = useGetReturnListByBrand(brand?.id ?? "");

  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);

  const getStatusBadge = (status: ReturnStatus) => {
    switch (status) {
      case ReturnStatus.REQUESTED:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            요청됨
          </span>
        );
      case ReturnStatus.APPROVED:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            승인됨
          </span>
        );
      case ReturnStatus.REJECTED:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            거절됨
          </span>
        );
      case ReturnStatus.COMPLETED:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            완료
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-xl font-medium text-gray-900">반품/교환 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            전체 반품/교환 {returnList?.length || 0}건
          </p>
        </div>
      </div>

      {/* 반품 목록 */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    요청 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    고객
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사유
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {returnList?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        #{item.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{item.order.recipientName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {item.orderItem.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.orderItem.size} / 수량 {item.orderItem.quantity}개
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{item.reason}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4">
                      {item.status !== ReturnStatus.COMPLETED ? (
                        <button
                          onClick={() => setSelectedReturn(item)}
                          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <IoSwapHorizontal className="text-lg" />
                          상태 변경
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                          <IoCheckmarkCircle className="text-lg" />
                          완료
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!returnList || returnList.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      반품/교환 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 반품 상태 변경 모달 */}
      {selectedReturn && (
        <ReturnManageModal
          selectedReturn={selectedReturn}
          onClose={() => setSelectedReturn(null)}
        />
      )}
    </div>
  );
}
