"use client";

import { Order } from "@/serivces/order/type";
import { returnApi } from "@/serivces/return/request";
import { ReturnReason } from "@/serivces/return/type";
import Image from "next/image";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export const ReturnFormModal = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  const [reason, setReason] = useState(ReturnReason.LOST_INTEREST);
  const [detailReason, setDetailReason] = useState("");
  const [isChecked, setChecked] = useState(false);

  const handleSubmit = async () => {
    if (!detailReason) return alert("상세 사유를 입력해주세요.");
    if (!isChecked) return alert("개인정보 수집 동의가 필요합니다.");

    try {
      await returnApi.createReturn({
        orderId: order.id,
        orderItemId: order.orderItems[0].id,
        reason,
        detailReason,
        refundBank: "",
        refundAccountNumber: "",
        refundAccountHolder: "",
      });

      alert("반품 문의가 정상적으로 접수되었습니다.");
      onClose();
    } catch {
      alert("반품 문의 접수에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">반품 신청</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* 상품 정보 */}
          <div className="flex items-center mb-6 bg-gray-50 p-3 rounded-md">
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex-shrink-0 relative">
              {order.orderItems[0].productImageUrl && (
                <Image
                  src={order.orderItems[0].productImageUrl}
                  alt={order.orderItems[0].productName}
                  fill
                />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {order.orderItems[0].productName}
              </h3>
              <p className="text-sm text-gray-500">
                사이즈: {order.orderItems[0].size} / 수량:{" "}
                {order.orderItems[0].quantity}개
              </p>
            </div>
          </div>

          {/* 사유 선택 */}
          <div className="mb-6">
            <p className="font-medium text-gray-900 mb-2">사유 선택</p>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 h-12 focus:outline-none focus:ring-2 focus:ring-black"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnReason)}
            >
              {Object.values(ReturnReason).map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* 상세 사유 */}
          <div className="mb-6">
            <p className="font-medium text-gray-900 mb-2">상세 사유</p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]"
              placeholder="교환/반품을 신청하시는 상세 사유를 작성해주세요."
              value={detailReason}
              onChange={(e) => setDetailReason(e.target.value)}
            ></textarea>
          </div>



          {/* 개인정보 수집 동의 */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setChecked(!isChecked)}
                className="form-checkbox h-5 w-5 text-black rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                개인정보 수집 및 이용에 동의합니다.
              </span>
            </label>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end p-5 border-t border-gray-200 gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
          >
            신청하기
          </button>
        </div>
      </div>
    </div>
  );
};
