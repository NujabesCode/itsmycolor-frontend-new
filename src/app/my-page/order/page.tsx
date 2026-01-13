'use client';

import { ReviewFormModal } from '@/components/my-page-order/ReviewFormModal';
import { ReturnFormModal } from '@/components/my-page-order/ReturnFormModal';
import { ROUTE } from '@/configs/constant/route';
import { useGetOrderList } from '@/serivces/order/query';
import { Order, OrderStatus } from '@/serivces/order/type';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  IoSearch,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoReceipt,
  IoChatbubbleEllipses,
  IoStar,
  IoCalendar,
  IoCube,
  IoRefresh,
  IoArrowForward,
  IoCarOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import Image from 'next/image';
import { useQueryString } from '@/hooks/common/useQueryString';
import { useDebounce } from '@/hooks/common/useDebounce';
import { Pagination } from '@/components/common/Pagination';

const ORDER_STATUS_MAP = {
  [OrderStatus.PENDING]: {
    label: '결제 대기',
    icon: IoCheckmarkCircle,
    color: 'text-orange-600',
  },
  [OrderStatus.CONFIRMED]: {
    label: '결제 완료',
    icon: IoCheckmarkCircle,
    color: 'text-blue-600 bg-blue-50',
  },
  [OrderStatus.SHIPPED]: {
    label: '배송 준비중',
    icon: IoCube,
    color: 'text-indigo-600 bg-indigo-50',
  },
  [OrderStatus.DELIVERING]: {
    label: '배송 중',
    icon: IoCarOutline,
    color: 'text-purple-600 bg-purple-50',
  },
  [OrderStatus.DELIVERED]: {
    label: '배송 완료',
    icon: IoCheckmarkCircle,
    color: 'text-green-600 bg-green-50',
  },
  [OrderStatus.CANCELLED]: {
    label: '주문 취소',
    icon: IoCloseCircle,
    color: 'text-red-600 bg-red-50',
  },
};

const PERIOD_OPTIONS = [
  { value: '1m', label: '1개월' },
  { value: '3m', label: '3개월' },
  { value: '6m', label: '6개월' },
  { value: '1y', label: '1년' },
  { value: '', label: '전체' },
];

export default function MyPageOrder() {
  const router = useRouter();
  const { data: ordersData } = useGetOrderList();

  const [period, setPeriod] = useQueryString<string>('period', '1m');

  const [tempSearch, setTempSearch] = useState('');
  const debouncedTempSearch = useDebounce(tempSearch, 500);
  const [, setSearch] = useQueryString<string>('search', '');
  const [status, setStatus] = useQueryString<string>('status', '');

  const [selectedReviewOrder, setSelectedReviewOrder] = useState<Order | null>(
    null
  );
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<Order | null>(
    null
  );

  const orderList = ordersData?.orders;
  const lastPage = ordersData?.lastPage;

  // 배송 단계에 따른 진행률 계산 함수
  const getDeliveryProgress = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CONFIRMED:
        return {
          step: 2,
          percentage: 40,
          steps: [
            '주문 접수',
            '결제 완료',
            '상품 준비',
            '배송 중',
            '배송 완료',
          ],
        };
      case OrderStatus.SHIPPED:
        return {
          step: 3,
          percentage: 60,
          steps: [
            '주문 접수',
            '결제 완료',
            '상품 준비',
            '배송 중',
            '배송 완료',
          ],
        };
      case OrderStatus.DELIVERING:
        return {
          step: 4,
          percentage: 80,
          steps: [
            '주문 접수',
            '결제 완료',
            '상품 준비',
            '배송 중',
            '배송 완료',
          ],
        };
      case OrderStatus.DELIVERED:
        return {
          step: 5,
          percentage: 100,
          steps: [
            '주문 접수',
            '결제 완료',
            '상품 준비',
            '배송 완료',
            '수령 완료',
          ],
        };
      default:
        return {
          step: 1,
          percentage: 20,
          steps: [
            '주문 접수',
            '결제 대기',
            '상품 준비',
            '배송 중',
            '배송 완료',
          ],
        };
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(date.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    setSearch(debouncedTempSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTempSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-yellow-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">주문 내역</h1>
          <p className="text-white/90">
            고객님의 주문 내역을 확인하실 수 있습니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Period Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              조회 기간
            </h3>
            <div className="flex flex-wrap gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPeriod(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    period === option.value
                      ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              주문 상태
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatus('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  status === ''
                    ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {Object.values(OrderStatus).map((orderStatus) => (
                <button
                  key={orderStatus}
                  onClick={() => setStatus(orderStatus as OrderStatus)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    status === orderStatus
                      ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ORDER_STATUS_MAP[orderStatus as OrderStatus].label}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <IoSearch
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="주문번호 또는 상품명으로 검색"
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Order List */}
        {orderList && orderList.length > 0 ? (
          <div className="space-y-6">
            {orderList.map((order: Order) => {
              const deliveryProgress = getDeliveryProgress(order.status);
              const StatusIcon =
                ORDER_STATUS_MAP[order.status as OrderStatus].icon;
              const statusConfig =
                ORDER_STATUS_MAP[order.status as OrderStatus];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <IoCalendar size={16} />
                          <span className="text-sm font-medium">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          주문번호: {order.id}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                      >
                        <StatusIcon size={16} />
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <Link
                            href={ROUTE.SHOPPING_PRODUCT_DETAIL(item.productId)}
                            className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 group"
                          >
                            {item.productImageUrl ? (
                              <Image
                                src={item.productImageUrl}
                                alt={item.productName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <IoCube className="text-gray-400" size={40} />
                              </div>
                            )}
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1">
                            <Link
                              href={ROUTE.SHOPPING_PRODUCT_DETAIL(
                                item.productId
                              )}
                              className="text-lg font-medium text-gray-900 hover:text-purple-600 transition-colors inline-block mb-2"
                            >
                              {item.productName}
                            </Link>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span>사이즈: {item.size}</span>
                              <span>수량: {item.quantity}개</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900">
                              {item.price.toLocaleString()}
                              {order.currency === 'KRW' ? '원' : '$'}
                            </p>

                            {/* 택배 정보 */}
                            {order.deliveryCompany && order.deliveryTrackingNumber && (
                              <p className="text-sm text-gray-500 mt-2">
                                택배사: {order.deliveryCompany} / 송장번호: {order.deliveryTrackingNumber}
                              </p>
                            )}

                            {/* Delivery Progress */}
                            {order.status !== OrderStatus.CANCELLED && (
                              <div className="mt-6">
                                <div className="relative">
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-pink-500 to-yellow-500 transition-all duration-500"
                                      style={{
                                        width: `${deliveryProgress.percentage}%`,
                                      }}
                                    />
                                  </div>
                                  <div className="flex justify-between">
                                    {deliveryProgress.steps.map(
                                      (step, index) => (
                                        <div
                                          key={index}
                                          className="flex flex-col items-center relative"
                                        >
                                          <div
                                            className={`w-3 h-3 rounded-full absolute -top-1.5 ${
                                              index < deliveryProgress.step
                                                ? 'bg-gradient-to-r from-pink-500 to-yellow-500'
                                                : 'bg-gray-300'
                                            }`}
                                          />
                                          <span
                                            className={`text-xs mt-4 ${
                                              index < deliveryProgress.step
                                                ? 'text-pink-600 font-medium'
                                                : 'text-gray-400'
                                            }`}
                                          >
                                            {step}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            {order.status === OrderStatus.DELIVERED &&
                              !item.isReviewed && (
                                <button
                                  onClick={() => setSelectedReviewOrder(order)}
                                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                                >
                                  <IoStar size={16} />
                                  리뷰 작성
                                </button>
                              )}

                            {order.status !== OrderStatus.CANCELLED && (
                              <button
                                onClick={() => setSelectedReturnOrder(order)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                              >
                                반품 신청
                              </button>
                            )}

                            <button
                              onClick={() =>
                                router.push(
                                  ROUTE.SHOPPING_PRODUCT_DETAIL(item.productId)
                                )
                              }
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                            >
                              <IoRefresh size={16} />
                              재구매
                            </button>

                            <Link
                              href={`${ROUTE.MYPAGE}/qna`}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                            >
                              <IoChatbubbleEllipses size={16} />
                              문의하기
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 px-6 py-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        총 {order.orderItems.length}개 상품
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">결제 금액</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
                          {order.totalAmount.toLocaleString()}
                          {order.currency === 'KRW' ? '원' : '$'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <IoReceipt className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              주문 내역이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">아직 주문하신 상품이 없습니다.</p>
            <Link
              href={ROUTE.SHOPPING}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              쇼핑하러 가기
              <IoArrowForward size={18} />
            </Link>
          </div>
        )}
      </div>

      {lastPage ? <Pagination lastPage={lastPage} /> : null}

      {selectedReviewOrder && (
        <ReviewFormModal
          order={selectedReviewOrder}
          onClose={() => setSelectedReviewOrder(null)}
        />
      )}

      {selectedReturnOrder && (
        <ReturnFormModal
          order={selectedReturnOrder}
          onClose={() => setSelectedReturnOrder(null)}
        />
      )}
    </div>
  );
}
