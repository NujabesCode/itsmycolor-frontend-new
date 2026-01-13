'use client';

import { useQueryString } from '@/hooks/common/useQueryString';
import { paymentApi } from '@/serivces/payment/request';
import { BANKCODE_TO_KOREAN, Payment } from '@/serivces/payment/type';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ROUTE } from '@/configs/constant/route';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/providers/ProductStoreProvider';

export default function PaymentSuccess() {
  const router = useRouter();

  const [paymentType] = useQueryString<string>('paymentType', '');
  const [orderId] = useQueryString<string>('orderId', '');
  const [paymentKey] = useQueryString<string>('paymentKey', '');
  const [amount] = useQueryString<number>('amount', 0);

  const [payment, setPayment] = useState<Payment | null>(null);
  const { cartProducts, addToCart } = useProductStore((state) => state);

  useEffect(() => {
    if (!paymentType || !orderId || !paymentKey || !amount) return;

    (async () => {
      // TODO: 결제 검증 로직 추가
      try {
        const tempPayment = await paymentApi.verifyPayment({
          paymentKey,
          orderId,
          amount,
        });
        setPayment(tempPayment);
      } catch (error) {
        router.push(ROUTE.PAYMENT_FAIL);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType, orderId, paymentKey, amount]);

  useEffect(() => {
    if (!payment) return;

    const productId = payment?.order?.orderItems?.[0]?.productId;
    if (!productId) return;

    const product = cartProducts.find((item) => item.id === productId);
    if (!product) return;

    addToCart(product, product.size, -product.quantity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 py-8 px-8 text-center border-b border-gray-100">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-gray-900 mb-2">
            {payment?.isPaid ? '결제가 완료되었습니다' : '입금 대기 중입니다.'}
          </h1>
          <p className="text-gray-500 text-sm">
            주문번호: {orderId || '주문 정보를 불러오는 중...'}
          </p>
        </div>

        {/* 주문 정보 */}
        <div className="px-8 py-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">주문 정보</h2>

          {/* 주문 상품 정보 */}
          <div className="space-y-4 mb-8">
            {payment?.order?.orderItems?.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md relative overflow-hidden">
                  {item.productImageUrl ? (
                    <Image
                      src={item.productImageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      이미지 없음
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.size}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">{item.quantity}개</p>
                    <p className="text-sm font-medium text-gray-900">
                      {item.price.toLocaleString()}
                      {payment?.order.currency === 'KRW' ? '원' : '$'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 결제 정보 */}
          {payment?.isPaid && (
            <div className="border-t border-gray-100 pt-6 mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4">
                결제 정보
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">상품 금액</span>
                  <span className="text-gray-900">
                    {payment?.order.productAmount?.toLocaleString()}
                    {payment?.order.currency === 'KRW' ? '원' : '$'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">배송비</span>
                  <span className="text-gray-900">
                    {payment?.order.shippingFee?.toLocaleString()}
                    {payment?.order.currency === 'KRW' ? '원' : '$'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">할인 금액</span>
                  <span className="text-gray-900">
                    -{payment?.order.discountAmount?.toLocaleString()}
                    {payment?.order.currency === 'KRW' ? '원' : '$'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-medium pt-4 border-t border-gray-100 mt-4">
                  <span className="text-gray-900">총 결제 금액</span>
                  <span className="text-gray-900">
                    {payment?.order.totalAmount.toLocaleString()}
                    {payment?.order.currency === 'KRW' ? '원' : '$'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 가상계좌 입금 정보 */}
          {!payment?.isPaid && (
            <div className="border-t border-gray-100 pt-6 mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4">
                가상계좌 입금 정보
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="text-gray-500 w-20">은행</span>
                  <span className="text-gray-900">
                    {
                      BANKCODE_TO_KOREAN[
                        JSON.parse(payment?.virtualAccount || '{}')['bankCode']
                      ]
                    }
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20">가상계좌</span>
                  <span className="text-gray-900">
                    {
                      JSON.parse(payment?.virtualAccount || '{}')[
                        'accountNumber'
                      ]
                    }
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20">입금자명</span>
                  <span className="text-gray-900">
                    {
                      JSON.parse(payment?.virtualAccount || '{}')[
                        'customerName'
                      ]
                    }
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20">입금 금액</span>
                  <span className="text-gray-900">
                    {payment?.order.totalAmount.toLocaleString()}
                    {payment?.order.currency === 'KRW' ? '원' : '$'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 배송 정보 */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              배송 정보
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="text-gray-500 w-20">받는 사람</span>
                <span className="text-gray-900">
                  {payment?.order.recipientName}
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">연락처</span>
                <span className="text-gray-900">
                  {payment?.order.recipientPhone}
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">주소</span>
                <span className="text-gray-900">
                  {payment?.order.shippingAddress}{' '}
                  {payment?.order.detailAddress}
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">배송 요청</span>
                <span className="text-gray-900">
                  {payment?.order.customDeliveryRequest || '없음'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <Link
            href={ROUTE.MYPAGE_ORDER}
            className="flex-1 bg-white border border-gray-200 rounded-lg py-3 px-4 text-center text-gray-700 hover:bg-gray-50 transition-colors"
          >
            주문 내역 확인
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
