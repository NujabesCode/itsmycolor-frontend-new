"use client";

import { QUERY } from "@/configs/constant/query";
import { orderApi } from "@/serivces/order/request";
import { Order, OrderStatus } from "@/serivces/order/type";
import { formatDate } from "@/utils/date";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const OrderManageModal = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();

  const [editedStatus, setEditedStatus] = useState<OrderStatus>(order.status);

  const onEdit = async () => {
    try {
      await orderApi.patchOrderStatus(order.id, editedStatus);
      await queryClient.invalidateQueries({
        queryKey: [QUERY.ORDER_LIST_BY_BRAND],
      });

      alert("주문 상태 수정에 성공했습니다.");
      onClose();
    } catch {
      alert("주문 상태 수정에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center border-b border-[var(--color-grey-91)] p-4">
          <h3 className="text-lg font-semibold">주문 상세 내역</h3>
          <button
            onClick={onClose}
            className="text-[var(--color-grey-47)] hover:text-[var(--color-grey-20)]"
          >
            ✕
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-4">
          <div className="mb-4">
            <div className="font-semibold mb-2">주문번호</div>
            <div className="text-[var(--color-grey-33)]">{order.id}</div>
          </div>

          <div className="mb-4">
            <div className="font-semibold mb-2">주문일시</div>
            <div className="text-[var(--color-grey-33)]">
              {formatDate(order.createdAt)}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-semibold mb-2">고객명</div>
            <div className="text-[var(--color-grey-33)]">
              {order.recipientName}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-semibold mb-2">연락처</div>
            <div className="text-[var(--color-grey-33)]">
              {order.recipientPhone}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-semibold mb-2">주소</div>
            <div className="text-[var(--color-grey-33)]">
              ({order.zipCode}) {order.shippingAddress} {order.detailAddress}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-semibold mb-2">배송요청사항</div>
            <div className="text-[var(--color-grey-33)]">
              {order.customDeliveryRequest}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-semibold mb-2">상품</div>
            <div className="space-y-2">
              {/* OM-012: 부분 취소/반품 표시 */}
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="text-[var(--color-grey-33)] border-b border-gray-100 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        {item.size} / 수량 {item.quantity}개 / {item.price.toLocaleString()}원
                      </p>
                    </div>
                    {/* 부분 취소/반품 표시는 OrderItem에 상태 필드가 필요하지만, 현재는 주문 상태로 표시 */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-semibold mb-2">결제 정보</div>
            <div className="text-[var(--color-grey-33)] space-y-1">
              <p>상품 금액: {order.productAmount.toLocaleString()}원</p>
              <p>할인 금액: {order.discountAmount.toLocaleString()}원</p>
              <p>배송비: {order.shippingFee.toLocaleString()}원</p>
              <p className="font-semibold text-lg">총 결제 금액: {order.totalAmount.toLocaleString()}원</p>
            </div>
          </div>

          {/* OM-006: 배송 정보 */}
          {order.deliveryCompany && order.deliveryTrackingNumber && (
            <div className="mb-4">
              <div className="font-semibold mb-2">배송 정보</div>
              <div className="text-[var(--color-grey-33)]">
                <p>택배사: {order.deliveryCompany}</p>
                <p>송장번호: {order.deliveryTrackingNumber}</p>
              </div>
            </div>
          )}

          {/* OM-006: 주문 상태 */}
          <div className="mb-4">
            <div className="font-semibold mb-2">주문 상태</div>
            <div className="text-[var(--color-grey-33)]">
              {order.status}
            </div>
          </div>

          {/* <div className="mb-4">
            <div className="font-semibold mb-2">주문상태</div>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value as OrderStatus)}
              className="w-full border border-[var(--color-grey-91)] rounded p-2"
              disabled={order.status === OrderStatus.CANCELLED}
            >
              {Object.values(OrderStatus)
                .filter((status) => status !== OrderStatus.PENDING)
                .map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
            </select>
          </div> */}
        </div>

        {/* 모달 푸터 */}
        <div className="flex justify-end gap-2 border-t border-[var(--color-grey-91)] p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--color-grey-91)] rounded hover:bg-[var(--color-grey-96)]"
          >
            닫기
          </button>
          {/* {order.status !== OrderStatus.CANCELLED && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-[var(--color-azure-48)] text-white rounded"
            >
              수정
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};
