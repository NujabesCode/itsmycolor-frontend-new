'use client';

import {
  PaymentMethod,
  ShippingForm,
  ShippingFormType,
} from '@/components/shopping-order/ShippingForm';
import { useQueryString } from '@/hooks/common/useQueryString';
import { useTossWidget } from '@/hooks/common/useTossWidget';
import { addressApi } from '@/serivces/address/request';
import { orderApi } from '@/serivces/order/request';
import { useGetProduct } from '@/serivces/product/query';
import { useGetMyCoupons } from '@/serivces/coupon/query';
import { CouponType } from '@/serivces/coupon/type';
import { useState } from 'react';

export default function ShoppingOrder() {
  const [productId] = useQueryString<string>('productId', '');
  const [size] = useQueryString<string>('size', '');
  const [quantity] = useQueryString<number>('quantity', 0);

  // const [isPurchaseConfirm, setPurchaseConfirm] = useState(false);

  const [shippingForm, setShippingForm] = useState<ShippingFormType>({
    name: '',
    phone: '',
    zipCode: '',
    address: '',
    detailAddress: '',
    customDeliveryRequest: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.DOMESTIC
  );

  const { data: product } = useGetProduct(productId);
  const { data: coupons } = useGetMyCoupons();
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');

  const price = (product?.price ?? 0) * quantity;
  const shippingFee =
    price > (product?.freeShippingAmount ?? 0) ? 0 : product?.shippingFee ?? 0;

  const selectedCoupon = coupons?.find((c) => c.id === selectedCouponId);
  const discount =
    selectedCoupon && price >= selectedCoupon.minPrice
      ? selectedCoupon.type === CouponType.PERCENT
        ? Math.min(Math.floor((price * selectedCoupon.value) / 100), price)
        : Math.min(selectedCoupon.value, price)
      : 0;

  const finalProductPrice = price - discount;
  const finalTotalAmount = finalProductPrice + shippingFee;

  const { requestPayment } = useTossWidget(finalTotalAmount);

  const onPayment = async () => {
    if (!product) return alert('상품을 찾을 수 없습니다.');
    if (!shippingForm.name) return alert('이름을 입력해주세요.');
    if (
      !shippingForm.phone ||
      !RegExp(/^\d{10,11}$/).test(shippingForm.phone.replace(/[^0-9]/g, ''))
    )
      return alert('전화번호를 입력해주세요.');
    if (!shippingForm.zipCode) return alert('우편번호를 입력해주세요.');
    if (!shippingForm.address) return alert('주소를 입력해주세요.');
    if (!shippingForm.detailAddress) return alert('상세주소를 입력해주세요.');

    if (paymentMethod === PaymentMethod.DOMESTIC) {
      try {
        await addressApi.createAddress({
          name: shippingForm.name,
          phone: shippingForm.phone.replace(/[^0-9]/g, ''),
          postalCode: shippingForm.zipCode,
          address: shippingForm.address,
          detailAddress: shippingForm.detailAddress,
          deliveryRequest: shippingForm.customDeliveryRequest,
        });

        const order = await orderApi.createOrder({
          currency: 'KRW',
          recipientName: shippingForm.name,
          recipientPhone: shippingForm.phone.replace(/[^0-9]/g, ''),
          zipCode: shippingForm.zipCode,
          shippingAddress: shippingForm.address,
          detailAddress: shippingForm.detailAddress,
          customDeliveryRequest: shippingForm.customDeliveryRequest,

          productAmount: finalProductPrice,
          shippingFee,
          totalAmount: finalTotalAmount,

          orderItems: [
            {
              productId,
              productName: product.name,
              price: finalTotalAmount,
              quantity,
              size,
              productImageUrl: product.imageUrl,
            },
          ],
          couponId: selectedCouponId ? selectedCouponId : undefined,
        });

        await requestPayment(
          order.id,
          `${product.name} ${size} ${quantity}개 주문 건`,
          shippingForm.name,
          shippingForm.phone.replace(/[^0-9]/g, '')
        );
      } catch (error) {
        console.error(error);
      }
    }

    if (paymentMethod === PaymentMethod.FOREIGN) {
      alert('해외 결제는 준비 중입니다.');
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-3xl font-light text-neutral-800 mb-10 px-6">
          주문/결제
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          {/* 주문 상품 정보 */}
          <div className="p-8 border-b border-neutral-100">
            <h2 className="text-lg font-medium text-neutral-800 mb-6">
              주문 상품
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-32 bg-neutral-100 rounded-md overflow-hidden flex items-center justify-center">
                {product?.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product?.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-neutral-300 text-xs">이미지 없음</div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-neutral-800 text-lg">
                  {product?.name}
                </div>
                <div className="text-neutral-500 mt-1 text-sm">
                  사이즈:{' '}
                  <span className="font-medium text-neutral-700">{size}</span>
                </div>
                <div className="text-neutral-500 mt-1 text-sm">
                  수량:{' '}
                  <span className="font-medium text-neutral-700">
                    {quantity}개
                  </span>
                </div>
                <div className="text-neutral-800 font-medium mt-3 text-lg">
                  {price.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* 배송지 정보 & 결제 방법 */}
          <div className="p-8 border-b border-neutral-100">
            <ShippingForm
              shippingForm={shippingForm}
              setShippingForm={setShippingForm}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          {/* 쿠폰 선택 */}
          <div className="p-8 border-b border-neutral-100">
            <h2 className="text-lg font-medium text-neutral-800 mb-6">
              쿠폰 선택
            </h2>
            <select
              className="border border-neutral-200 rounded-lg px-4 py-3 w-full"
              value={selectedCouponId}
              onChange={(e) => setSelectedCouponId(e.target.value)}
            >
              <option value="">쿠폰을 선택하지 않습니다</option>
              {coupons?.map((coupon) => (
                <option
                  key={coupon.id}
                  value={coupon.id}
                  disabled={price < coupon.minPrice}
                >
                  {coupon.type === CouponType.PERCENT
                    ? `${coupon.value}% 할인`
                    : `${coupon.value.toLocaleString()}원 할인`} (최소
                  {` ${coupon.minPrice.toLocaleString()}원`})
                </option>
              ))}
            </select>
          </div>

          {/* 결제 금액 정보 */}
          <div className="p-8">
            <h2 className="text-lg font-medium text-neutral-800 mb-6">
              결제 금액
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-neutral-600">상품 금액</span>
                <span className="font-medium text-neutral-800">
                  {price.toLocaleString()}원
                </span>
              </div>

              <div className="flex justify-between text-base">
                <span className="text-neutral-600">배송비</span>
                <span className="font-medium text-neutral-800">
                  {shippingFee === 0
                    ? '무료'
                    : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-base">
                  <span className="text-neutral-600">쿠폰 할인</span>
                  <span className="font-medium text-neutral-800">-
                    {discount.toLocaleString()}원
                  </span>
                </div>
              )}

              <div className="border-t border-neutral-200 pt-4 mt-4">
                <div className="flex justify-between font-medium text-lg">
                  <span className="text-neutral-800">최종 결제 금액</span>
                  <span className="text-neutral-900 font-semibold">
                    {finalTotalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* <div className="mt-6 pt-4 border-t border-neutral-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-neutral-900"
                    checked={isPurchaseConfirm}
                    onChange={(e) => setPurchaseConfirm(e.target.checked)}
                  />
                  <span className="text-sm text-neutral-800">
                    구매조건 확인 및 결제 진행 동의{" "}
                    <span className="text-neutral-400">(필수)</span>
                  </span>
                </label>
              </div> */}

              <div className="m-[-30px] mt-[20px] mb-[-20px]">
                <div id="agreement" />
              </div>

              <button
                className="w-full mt-6 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-4 rounded-lg text-base transition-colors"
                onClick={onPayment}
              >
                결제하기
              </button>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-neutral-400 mt-10">
          © 2025 잇츠마이컬러. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
