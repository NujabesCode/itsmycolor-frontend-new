"use client";

import { QUERY } from "@/configs/constant/query";
import { returnApi } from "@/serivces/return/request";
import { Return, ReturnStatus } from "@/serivces/return/type";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const ReturnManageModal = ({
  selectedReturn,
  onClose,
}: {
  selectedReturn: Return;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useState<ReturnStatus>(
    selectedReturn.status
  );

  const onSubmit = async () => {
    try {
      await returnApi.putReturnStatus(selectedReturn.id, selectedStatus);
      await queryClient.invalidateQueries({
        queryKey: [QUERY.RETURN_LIST_BY_BRAND],
      });

      alert("반품 상태가 변경되었습니다.");
      onClose();
    } catch (error) {
      alert("반품 상태 변경에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            고객명: {selectedReturn.order.recipientName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              반품 상태
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus || ""}
              onChange={(e) =>
                setSelectedStatus(e.target.value as ReturnStatus)
              }
            >
              <option value={ReturnStatus.REQUESTED}>
                {ReturnStatus.REQUESTED}
              </option>
              <option value={ReturnStatus.REVIEWING}>
                {ReturnStatus.REVIEWING}
              </option>
              <option value={ReturnStatus.APPROVED}>
                {ReturnStatus.APPROVED}
              </option>
              <option value={ReturnStatus.SHIPPING}>
                {ReturnStatus.SHIPPING}
              </option>
              <option value={ReturnStatus.COMPLETED}>
                {ReturnStatus.COMPLETED}
              </option>
              <option value={ReturnStatus.REJECTED}>
                {ReturnStatus.REJECTED}
              </option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            상태 변경
          </button>
        </div>
      </div>
    </div>
  );
};
