'use client';

import { useQueryString } from "@/hooks/common/useQueryString";
import { Order, OrderStatus } from "@/serivces/order/type";
import { formatDate } from "@/utils/date";
import { IoEye } from "react-icons/io5";
import { useEffect, useState } from "react";
import { subHeaders } from "./OrderSubHeader";
import { orderApi } from "@/serivces/order/request";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";
import { ShippingModal } from "./ShippingModal";

interface OrderListViewProps {
  orders?: Order[];
  onSelectOrder: (order: Order) => void;
}

export function OrderListView({ orders, onSelectOrder }: OrderListViewProps) {
  const queryClient = useQueryClient();

  const [statuses] = useQueryString<string[]>('statuses', [OrderStatus.CONFIRMED]);
  const selectedSubHeader = subHeaders.find((item) => JSON.stringify(statuses) === JSON.stringify(item.key));

  // 선택된 주문 ID 상태
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 배송 모달을 위한 주문 ID 목록 (배열 길이가 0이면 닫힘)
  const [shippingIds, setShippingIds] = useState<string[]>([]);

  // 주문 목록이 바뀌면 선택 초기화
  useEffect(() => {
    setSelectedIds([]);
  }, [orders]);

  // 개별 선택 토글
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // 전체 선택 / 해제
  const handleSelectAll = () => {
    if (!orders || orders.length === 0) return;
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o.id));
    }
  };

  // OM-021: 일괄 주문 승인
  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm('선택한 주문을 승인하시겠습니까?')) return;
    try {
      const result = await orderApi.patchManyOrderStatus(selectedIds, OrderStatus.SHIPPED);
      await queryClient.invalidateQueries({
        queryKey: [QUERY.ORDER_LIST_BY_BRAND],
      });
      
      // OM-026: 일괄 처리 결과 메시지
      if (result.data?.failed > 0) {
        alert(`승인 완료: ${result.data.success}건, 처리 불가: ${result.data.failed}건\n처리 불가한 주문은 이미 완료되었거나 취소된 주문입니다.`);
      } else {
        alert(`선택한 ${result.data?.success || selectedIds.length}건의 주문이 승인되었습니다.`);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || err?.message || '주문 승인에 실패했습니다.';
      alert(errorMessage);
    }
  };

  // OM-022: 일괄 주문 취소
  const handleBatchCancel = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm('선택한 주문을 취소하시겠습니까?')) return;
    try {
      const result = await orderApi.patchManyOrderStatus(selectedIds, OrderStatus.CANCELLED);
      await queryClient.invalidateQueries({
        queryKey: [QUERY.ORDER_LIST_BY_BRAND],
      });
      
      // OM-026: 일괄 처리 결과 메시지
      if (result.data?.failed > 0) {
        alert(`취소 완료: ${result.data.success}건, 처리 불가: ${result.data.failed}건\n처리 불가한 주문은 이미 완료되었거나 취소된 주문입니다.`);
      } else {
        alert(`선택한 ${result.data?.success || selectedIds.length}건의 주문이 취소되었습니다.`);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || err?.message || '주문 취소에 실패했습니다.';
      alert(errorMessage);
    }
  };

  // OM-018: 일괄 배송 완료 처리
  const handleBatchComplete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm('선택한 주문을 배송 완료 처리하시겠습니까?')) return;
    try {
      const result = await orderApi.patchManyOrderStatus(selectedIds, OrderStatus.DELIVERED);
      await queryClient.invalidateQueries({
        queryKey: [QUERY.ORDER_LIST_BY_BRAND],
      });
      
      // OM-026: 일괄 처리 결과 메시지
      if (result.data?.failed > 0) {
        alert(`배송 완료 처리: ${result.data.success}건, 처리 불가: ${result.data.failed}건\n처리 불가한 주문은 이미 완료되었거나 취소된 주문입니다.`);
      } else {
        alert(`선택한 ${result.data?.success || selectedIds.length}건의 주문이 배송 완료 처리되었습니다.`);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || err?.message || '배송 완료 처리에 실패했습니다.';
      alert(errorMessage);
    }
  };

  // 상태 뱃지 렌더링 헬퍼
  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: { text: "주문 접수", className: "bg-yellow-100 text-yellow-800" },
      [OrderStatus.CONFIRMED]: { text: "결제 완료", className: "bg-blue-100 text-blue-800" },
      [OrderStatus.SHIPPED]: { text: "배송 준비", className: "bg-indigo-100 text-indigo-800" },
      [OrderStatus.DELIVERING]: { text: "배송중", className: "bg-purple-100 text-purple-800" },
      [OrderStatus.DELIVERED]: { text: "배송 완료", className: "bg-green-100 text-green-800" },
      [OrderStatus.CANCELLED]: { text: "주문 취소", className: "bg-red-100 text-red-800" },
    } as const;

    const config = statusConfig[status] || { text: status, className: "bg-gray-100 text-gray-800" };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* 상단 버튼 */}
      <div className="mb-4 text-right space-x-2">
        {selectedSubHeader?.index === 0 ? (
          <>
            <button
              onClick={handleBatchApprove}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              일괄 주문 승인
            </button>
            <button
              onClick={handleBatchCancel}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              일괄 주문 취소
            </button>
          </>
        ) : selectedSubHeader?.index === 1 ? (
          <>
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  alert('선택된 주문이 없습니다.');
                  return;
                }
                setShippingIds(selectedIds);
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
            >
              일괄 발송 처리
            </button>
            <button
              onClick={handleBatchCancel}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              일괄 주문 취소
            </button>
          </>
        ) : selectedSubHeader?.index === 2 ? (
          <>
            <button
              onClick={handleBatchComplete}
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
            >
              일괄 배송 완료 처리
            </button>
            <button
              onClick={handleBatchCancel}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              일괄 주문 취소
            </button>
          </>
        ) : null}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {/* 전체 선택 체크박스 */}
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={orders && orders.length > 0 && selectedIds.length === orders.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문 정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객 정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제 금액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
                          {/* OM-011: 취소/반품/교환 표시 */}
                          {order.status === OrderStatus.CANCELLED && (
                            <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800">
                              취소
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{order.recipientName}</p>
                        <p className="text-xs text-gray-500">{order.recipientPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{order.orderItems[0].productName}</p>
                        <p className="text-xs text-gray-500">
                          {order.orderItems[0].size} / 수량 {order.orderItems[0].quantity}개
                          {order.orderItems.length > 1 && ` 외 ${order.orderItems.length - 1}건`}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{order.totalAmount.toLocaleString()}원</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 flex">
                      {selectedSubHeader?.index === 0 ? (
                        <div className="flex gap-2">
                          {/* OM-025: 완료된 주문은 버튼 비활성화 */}
                          <button
                            onClick={async () => {
                              if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
                                alert('배송 완료 또는 취소된 주문은 재처리할 수 없습니다.');
                                return;
                              }
                              if (!window.confirm('해당 주문을 승인하시겠습니까?')) return;
                              try {
                                await orderApi.patchOrderStatus(order.id, OrderStatus.SHIPPED);
                                await queryClient.invalidateQueries({
                                  queryKey: [QUERY.ORDER_LIST_BY_BRAND],
                                });
                                alert('주문이 승인되었습니다.');
                              } catch (err: any) {
                                const errorMessage = err?.response?.data?.message || err?.message || '주문 승인에 실패했습니다.';
                                alert(errorMessage);
                              }
                            }}
                            disabled={order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            승인
                          </button>
                          <button
                            onClick={async () => {
                              if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
                                alert('배송 완료 또는 취소된 주문은 재처리할 수 없습니다.');
                                return;
                              }
                              if (!window.confirm('해당 주문을 취소하시겠습니까?')) return;
                              try {
                                await orderApi.patchOrderStatus(order.id, OrderStatus.CANCELLED);
                                await queryClient.invalidateQueries({
                                  queryKey: [QUERY.ORDER_LIST_BY_BRAND],
                                });
                                alert('주문이 취소되었습니다.');
                              } catch (err: any) {
                                const errorMessage = err?.response?.data?.message || err?.message || '주문 취소에 실패했습니다.';
                                alert(errorMessage);
                              }
                            }}
                            disabled={order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            취소
                          </button>
                        </div>
                      ) : selectedSubHeader?.index === 1 ? (
                        <div className="flex gap-2">
                          {/* OM-025: 완료된 주문은 버튼 비활성화 */}
                          <button
                            onClick={() => {
                              if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
                                alert('배송 완료 또는 취소된 주문은 재처리할 수 없습니다.');
                                return;
                              }
                              setShippingIds([order.id]);
                            }}
                            disabled={order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED}
                            className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            발송 처리
                          </button>
                          <button
                            onClick={async () => {
                              if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
                                alert('배송 완료 또는 취소된 주문은 재처리할 수 없습니다.');
                                return;
                              }
                              if (!window.confirm('해당 주문을 취소하시겠습니까?')) return;
                              try {
                                await orderApi.patchOrderStatus(order.id, OrderStatus.CANCELLED);
                                await queryClient.invalidateQueries({
                                  queryKey: [QUERY.ORDER_LIST_BY_BRAND],
                                });
                                alert('주문이 취소되었습니다.');
                              } catch (err: any) {
                                const errorMessage = err?.response?.data?.message || err?.message || '주문 취소에 실패했습니다.';
                                alert(errorMessage);
                              }
                            }}
                            disabled={order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            취소
                          </button>
                        </div>
                      ) : selectedSubHeader?.index === 2 ? (
                        <div className="flex gap-2">
                          {/* OM-018: 배송 완료 처리 */}
                          <button
                            onClick={async () => {
                              if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
                                alert('배송 완료 또는 취소된 주문은 재처리할 수 없습니다.');
                                return;
                              }
                              if (!window.confirm('해당 주문을 배송 완료 처리하시겠습니까?')) return;
                              try {
                                await orderApi.patchOrderStatus(order.id, OrderStatus.DELIVERED);
                                await queryClient.invalidateQueries({
                                  queryKey: [QUERY.ORDER_LIST_BY_BRAND],
                                });
                                alert('배송 완료 처리되었습니다.');
                              } catch (err: any) {
                                const errorMessage = err?.response?.data?.message || err?.message || '배송 완료 처리에 실패했습니다.';
                                alert(errorMessage);
                              }
                            }}
                            disabled={order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED}
                            className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            배송 완료 처리
                          </button>
                          <button
                            onClick={async () => {
                              if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
                                alert('배송 완료 또는 취소된 주문은 재처리할 수 없습니다.');
                                return;
                              }
                              if (!window.confirm('해당 주문을 취소하시겠습니까?')) return;
                              try {
                                await orderApi.patchOrderStatus(order.id, OrderStatus.CANCELLED);
                                await queryClient.invalidateQueries({
                                  queryKey: [QUERY.ORDER_LIST_BY_BRAND],
                                });
                                alert('주문이 취소되었습니다.');
                              } catch (err: any) {
                                const errorMessage = err?.response?.data?.message || err?.message || '주문 취소에 실패했습니다.';
                                alert(errorMessage);
                              }
                            }}
                            disabled={order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            취소
                          </button>
                        </div>
                      ) : null}
                      {/* 상세보기 버튼 */}
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="ml-2 px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                      >
                        상세보기
                      </button>
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {/* OM-013: 검색 결과 없음 안내 */}
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* 배송 정보 입력 모달 */}
      {shippingIds.length > 0 && (
        <ShippingModal
          orderIds={shippingIds}
          onClose={() => setShippingIds([])}
        />
      )}
    </div>
  );
} 