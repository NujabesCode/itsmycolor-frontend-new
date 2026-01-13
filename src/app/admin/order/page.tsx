'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/serivces/client';
import { Order, OrderStatus } from '@/serivces/order/type';
import { IoCalendarOutline, IoSearchOutline, IoDownloadOutline, IoWarningOutline } from 'react-icons/io5';

export default function AdminOrder() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shippingModal, setShippingModal] = useState<{ order: Order | null; isPartial: boolean }>({ order: null, isPartial: false });
  const [deliveryCompany, setDeliveryCompany] = useState<string>('');
  const [deliveryTrackingNumber, setDeliveryTrackingNumber] = useState<string>('');
  const [selectedOrderItems, setSelectedOrderItems] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // OC-001, OC-002, OC-003: 주문 목록 조회 (날짜 필터, 주문번호 검색, 상태 필터)
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', startDate, endDate, searchTerm, statusFilter],
    queryFn: async () => {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      const response = await axiosInstance.get('/orders/admin/all', { params });
      return response.data;
    },
  });

  // OC-009: 배송 지연 주문 조회
  const { data: delayedOrders } = useQuery({
    queryKey: ['delayed-orders'],
    queryFn: async () => {
      const response = await axiosInstance.get('/orders/admin/delayed');
      return response.data;
    },
  });

  // OC-004: 주문 상세 조회
  const { data: orderDetail } = useQuery({
    queryKey: ['order-detail', selectedOrder?.id],
    queryFn: async () => {
      if (!selectedOrder?.id) return null;
      const response = await axiosInstance.get(`/orders/${selectedOrder.id}`);
      return response.data;
    },
    enabled: !!selectedOrder?.id,
  });

  // OC-005: 송장 입력
  const shippingMutation = useMutation({
    mutationFn: async ({ orderId, company, trackingNumber }: { orderId: string; company: string; trackingNumber: string }) => {
      await axiosInstance.patch(`/orders/admin/${orderId}/shipping`, {
        deliveryCompany: company,
        deliveryTrackingNumber: trackingNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-detail'] });
      setShippingModal({ order: null, isPartial: false });
      setDeliveryCompany('');
      setDeliveryTrackingNumber('');
      alert('송장 정보가 입력되었습니다. 주문 상태가 "배송 중"으로 변경되었습니다.');
    },
  });

  // OC-008: 부분 배송 처리
  const partialShippingMutation = useMutation({
    mutationFn: async ({ orderId, company, trackingNumber, itemIds }: { orderId: string; company: string; trackingNumber: string; itemIds: string[] }) => {
      await axiosInstance.patch(`/orders/admin/${orderId}/partial-shipping`, {
        orderItemIds: itemIds,
        deliveryCompany: company,
        deliveryTrackingNumber: trackingNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-detail'] });
      setShippingModal({ order: null, isPartial: false });
      setSelectedOrderItems([]);
      alert('부분 배송이 처리되었습니다.');
    },
  });

  // OC-007: 상태 변경
  const statusChangeMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      await axiosInstance.patch(`/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-detail'] });
      alert('주문 상태가 변경되었습니다.');
    },
  });

  // OC-006: 송장 엑셀 업로드 (CSV 형식 지원)
  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map((h) => h.trim());
        
        const results = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',').map((v) => v.trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });

          try {
            if (!row['주문ID'] || !row['택배사'] || !row['송장번호']) {
              results.push({ orderId: row['주문ID'] || '알 수 없음', success: false, reason: '필수 정보 누락' });
              continue;
            }

            await axiosInstance.patch(`/orders/admin/${row['주문ID']}/shipping`, {
              deliveryCompany: row['택배사'],
              deliveryTrackingNumber: row['송장번호'],
            });
            results.push({ orderId: row['주문ID'], success: true });
          } catch (error: any) {
            results.push({
              orderId: row['주문ID'] || '알 수 없음',
              success: false,
              reason: error.response?.data?.message || '처리 실패',
            });
          }
        }

        const successCount = results.filter((r) => r.success).length;
        const failCount = results.filter((r) => !r.success).length;
        const failDetails = results.filter((r) => !r.success).map((r) => `주문ID ${r.orderId}: ${r.reason}`).join('\n');
        alert(`처리 완료: 성공 ${successCount}건, 실패 ${failCount}건${failDetails ? `\n\n실패 내역:\n${failDetails}` : ''}`);
        
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      } catch (error) {
        alert('파일 처리 중 오류가 발생했습니다. CSV 형식(주문ID,택배사,송장번호)으로 업로드해주세요.');
      }
    };
    reader.readAsText(file);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CONFIRMED:
        return 'text-blue-600 bg-blue-50';
      case OrderStatus.DELIVERING:
        return 'text-purple-600 bg-purple-50';
      case OrderStatus.DELIVERED:
        return 'text-green-600 bg-green-50';
      case OrderStatus.CANCELLED:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const isDelayed = (order: Order) => {
    if (!order.createdAt) return false;
    const orderDate = new Date(order.createdAt);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return orderDate < threeDaysAgo && (!order.deliveryTrackingNumber || order.status === OrderStatus.CONFIRMED);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grey-98 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-grey-71">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  const orders = ordersData?.orders || [];
  const delayedOrderIds = (delayedOrders || []).map((o: Order) => o.id);

  return (
    <div className="min-h-screen bg-grey-98 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-grey-20">주문 관리</h1>
        <div className="flex items-center gap-2">
          <label className="px-4 py-2 bg-azure-39 text-white rounded-lg hover:bg-azure-50 transition-colors cursor-pointer">
            <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" />
            송장 일괄등록
          </label>
        </div>
      </div>

      {/* OC-009: 배송 지연 알림 */}
      {delayedOrderIds.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-2">
          <IoWarningOutline className="text-yellow-600" size={20} />
          <span className="text-yellow-800 font-medium">
            출고 지연: {delayedOrderIds.length}건의 주문이 3일 이상 배송되지 않았습니다.
          </span>
        </div>
      )}

      {/* OC-001, OC-002, OC-003: 필터 */}
      <div className="bg-white-solid rounded-xl shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-grey-20 mb-1">시작 날짜</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-grey-20 mb-1">종료 날짜</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-grey-20 mb-1">주문번호 검색</label>
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-46" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="주문번호 입력"
                className="w-full pl-10 pr-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-grey-20 mb-1">상태 필터</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
            >
              <option value="">전체</option>
              <option value={OrderStatus.CONFIRMED}>결제 완료</option>
              <option value={OrderStatus.DELIVERING}>배송 중</option>
              <option value={OrderStatus.DELIVERED}>배송 완료</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setSearchTerm('');
              setStatusFilter('');
            }}
            className="px-4 py-2 bg-grey-91 text-grey-20 rounded-lg hover:bg-grey-80 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 주문 리스트 */}
      <div className="bg-white-solid rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-91 bg-grey-98">
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">주문번호</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">구매자</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">상품</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-grey-20">주문금액</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-grey-20">상태</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">배송정보</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-grey-20">작업</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order: Order) => (
                  <tr
                    key={order.id}
                    className={`border-b border-grey-91 hover:bg-grey-98 ${
                      isDelayed(order) ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-sm text-grey-20">
                      {order.id.substring(0, 8)}
                      {isDelayed(order) && (
                        <span className="ml-2 text-xs text-yellow-600 font-medium">[출고 지연]</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-grey-20">
                      {order.recipientName || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-grey-20">
                      {order.orderItems?.[0]?.productName || '-'}
                      {order.orderItems && order.orderItems.length > 1 && (
                        <span className="text-grey-46"> 외 {order.orderItems.length - 1}건</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-grey-20 text-right">
                      {order.totalAmount.toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-grey-20">
                      {order.deliveryCompany && order.deliveryTrackingNumber ? (
                        <div>
                          <div>{order.deliveryCompany}</div>
                          <div className="text-grey-46">{order.deliveryTrackingNumber}</div>
                        </div>
                      ) : (
                        <span className="text-grey-46">미입력</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1 bg-grey-91 text-grey-20 rounded text-xs hover:bg-grey-80"
                        >
                          상세
                        </button>
                        {order.status === OrderStatus.CONFIRMED && (
                          <button
                            onClick={() => setShippingModal({ order, isPartial: false })}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            송장입력
                          </button>
                        )}
                        {order.status === OrderStatus.DELIVERING && (
                          <button
                            onClick={() => {
                              if (confirm('배송 완료로 변경하시겠습니까?')) {
                                statusChangeMutation.mutate({ orderId: order.id, status: OrderStatus.DELIVERED });
                              }
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            배송완료
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-grey-46">
                    조회된 주문이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OC-004: 주문 상세 모달 */}
      {selectedOrder && orderDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-grey-20">주문 상세</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-grey-46 hover:text-grey-20"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* 구매자 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-grey-20 mb-3">구매자 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">이름</label>
                    <div className="text-base text-grey-20">{orderDetail.user?.name || orderDetail.recipientName || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">이메일</label>
                    <div className="text-base text-grey-20">{orderDetail.user?.email || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-46 mb-1">전화번호</label>
                    <div className="text-base text-grey-20">{orderDetail.recipientPhone || '-'}</div>
                  </div>
                </div>
              </div>

              {/* 배송지 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-grey-20 mb-3">배송지 정보</h3>
                <div className="text-base text-grey-20">
                  [{orderDetail.zipCode}] {orderDetail.shippingAddress} {orderDetail.detailAddress}
                </div>
              </div>

              {/* 상품 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-grey-20 mb-3">상품 정보</h3>
                <div className="space-y-2">
                  {orderDetail.orderItems?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-grey-98 rounded">
                      <div className="flex items-center gap-3">
                        {item.productImageUrl && (
                          <img src={item.productImageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div>
                          <div className="font-medium text-grey-20">{item.productName}</div>
                          <div className="text-sm text-grey-46">사이즈: {item.size} / 수량: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-grey-20">{(item.price * item.quantity).toLocaleString()}원</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 가격 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-grey-20 mb-3">가격 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-grey-46">상품 총액</span>
                    <span className="text-grey-20">{orderDetail.productAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-grey-46">할인 금액</span>
                    <span className="text-grey-20">-{orderDetail.discountAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-grey-46">배송비</span>
                    <span className="text-grey-20">{orderDetail.shippingFee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-grey-91">
                    <span className="font-semibold text-grey-20">총 결제 금액</span>
                    <span className="font-semibold text-azure-39 text-lg">{orderDetail.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* 결제 로그 */}
              {orderDetail.payment && (
                <div>
                  <h3 className="text-lg font-semibold text-grey-20 mb-3">결제 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-grey-46 mb-1">결제 방법</label>
                      <div className="text-base text-grey-20">{orderDetail.payment.method || '-'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-grey-46 mb-1">결제 일시</label>
                      <div className="text-base text-grey-20">
                        {orderDetail.payment.createdAt ? new Date(orderDetail.payment.createdAt).toLocaleString() : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OC-005, OC-008: 송장 입력 모달 */}
      {shippingModal.order && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-grey-20">
                {shippingModal.isPartial ? '부분 배송' : '송장 입력'}
              </h2>
              <button
                onClick={() => setShippingModal({ order: null, isPartial: false })}
                className="text-grey-46 hover:text-grey-20"
              >
                ✕
              </button>
            </div>

            {shippingModal.isPartial && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-grey-20 mb-2">배송할 상품 선택</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {shippingModal.order.orderItems?.map((item: any) => (
                    <label key={item.id} className="flex items-center gap-2 p-2 hover:bg-grey-98 rounded">
                      <input
                        type="checkbox"
                        checked={selectedOrderItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrderItems([...selectedOrderItems, item.id]);
                          } else {
                            setSelectedOrderItems(selectedOrderItems.filter((id) => id !== item.id));
                          }
                        }}
                      />
                      <span className="text-sm text-grey-20">{item.productName} (수량: {item.quantity})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-grey-20 mb-2">배송사</label>
                <select
                  value={deliveryCompany}
                  onChange={(e) => setDeliveryCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
                >
                  <option value="">선택하세요</option>
                  <option value="CJ대한통운">CJ대한통운</option>
                  <option value="한진택배">한진택배</option>
                  <option value="로젠택배">로젠택배</option>
                  <option value="롯데택배">롯데택배</option>
                  <option value="우체국택배">우체국택배</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-20 mb-2">송장번호</label>
                <input
                  type="text"
                  value={deliveryTrackingNumber}
                  onChange={(e) => setDeliveryTrackingNumber(e.target.value)}
                  placeholder="송장번호를 입력하세요"
                  className="w-full px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    if (!deliveryCompany || !deliveryTrackingNumber) {
                      alert('배송사와 송장번호를 모두 입력해주세요.');
                      return;
                    }
                    if (shippingModal.isPartial && selectedOrderItems.length === 0) {
                      alert('배송할 상품을 선택해주세요.');
                      return;
                    }
                    if (shippingModal.isPartial) {
                      partialShippingMutation.mutate({
                        orderId: shippingModal.order!.id,
                        company: deliveryCompany,
                        trackingNumber: deliveryTrackingNumber,
                        itemIds: selectedOrderItems,
                      });
                    } else {
                      shippingMutation.mutate({
                        orderId: shippingModal.order!.id,
                        company: deliveryCompany,
                        trackingNumber: deliveryTrackingNumber,
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-azure-39 text-white rounded-lg hover:bg-azure-50 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => setShippingModal({ order: null, isPartial: false })}
                  className="px-4 py-2 bg-grey-91 text-grey-20 rounded-lg hover:bg-grey-80 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

