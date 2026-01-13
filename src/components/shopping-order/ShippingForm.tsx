'use client';

import { useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { Address as DaumAddress } from 'react-daum-postcode';
import { addressApi } from '@/serivces/address/request';
import type { Address as SavedAddress } from '@/serivces/address/type';

export interface ShippingFormType {
  name: string;
  phone: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  customDeliveryRequest: string;
}

export enum PaymentMethod {
  DOMESTIC = 'DOMESTIC',
  FOREIGN = 'FOREIGN',
}

export const ShippingForm = ({
  shippingForm,
  setShippingForm,
  paymentMethod,
  setPaymentMethod,
}: {
  shippingForm: ShippingFormType;
  setShippingForm: (shippingForm: ShippingFormType) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
}) => {
  const [isPostcodeOpen, setPostcodeOpen] = useState(false);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(null);

  // Fetch saved address on mount and populate form
  useEffect(() => {
    (async () => {
      try {
        const data = await addressApi.getAddress();

        if (!data) {
          setIsNewAddress(true);
          return;
        }

        setSavedAddress(data);
        setShippingForm({
          name: data.name ?? '',
          phone: data.phone ?? '',
          zipCode: data.postalCode ?? '',
          address: data.address ?? '',
          detailAddress: data.detailAddress ?? '',
          customDeliveryRequest: data.deliveryRequest ?? '',
        });
      } catch (error) {
        // No saved address found – treat as new address
        setIsNewAddress(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComplete = (data: DaumAddress) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setShippingForm({
      ...shippingForm,
      zipCode: data.zonecode,
      address: fullAddress,
    });
    setPostcodeOpen(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 배송지 정보 */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium text-neutral-800 mb-6">
            배송지 정보
          </h2>

          {/* 주소 선택 라디오 버튼 */}
          <div className="flex items-center mb-4 space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="address-type"
                className="w-4 h-4 accent-neutral-900"
                checked={!isNewAddress}
                disabled={!savedAddress}
                onChange={() => {
                  setIsNewAddress(false);
                  if (savedAddress) {
                    setShippingForm({
                      name: savedAddress.name ?? '',
                      phone: savedAddress.phone ?? '',
                      zipCode: savedAddress.postalCode ?? '',
                      address: savedAddress.address ?? '',
                      detailAddress: savedAddress.detailAddress ?? '',
                      customDeliveryRequest: savedAddress.deliveryRequest ?? '',
                    });
                  }
                }}
              />
              <span className="ml-2 text-sm text-neutral-600 select-none">
                기존 주소 사용
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="address-type"
                className="w-4 h-4 accent-neutral-900"
                checked={isNewAddress}
                onChange={() => {
                  setIsNewAddress(true);
                  setShippingForm({
                    name: '',
                    phone: '',
                    zipCode: '',
                    address: '',
                    detailAddress: '',
                    customDeliveryRequest: '',
                  });
                }}
              />
              <span className="ml-2 text-sm text-neutral-600 select-none">
                새 주소 입력
              </span>
            </label>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-600 mb-1.5"
                >
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition-colors"
                  value={shippingForm.name}
                  onChange={(e) =>
                    setShippingForm({ ...shippingForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-neutral-600 mb-1.5"
                >
                  연락처
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="010-1234-5678"
                  className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition-colors"
                  value={shippingForm.phone}
                  onChange={(e) =>
                    setShippingForm({ ...shippingForm, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-neutral-600 mb-1.5"
              >
                우편번호
              </label>
              <div className="flex gap-3">
                <input
                  id="zipCode"
                  type="text"
                  placeholder="우편번호"
                  className="w-32 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition-colors"
                  value={shippingForm.zipCode}
                  onChange={(e) =>
                    setShippingForm({
                      ...shippingForm,
                      zipCode: e.target.value,
                    })
                  }
                  readOnly
                />
                <button
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors font-medium text-sm"
                  onClick={() => setPostcodeOpen(true)}
                  type="button"
                >
                  우편번호 찾기
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-neutral-600 mb-1.5"
              >
                주소
              </label>
              <input
                id="address"
                type="text"
                placeholder="주소를 입력하세요"
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition-colors"
                value={shippingForm.address}
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, address: e.target.value })
                }
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="detailAddress"
                className="block text-sm font-medium text-neutral-600 mb-1.5"
              >
                상세 주소
              </label>
              <input
                id="detailAddress"
                type="text"
                placeholder="상세 주소"
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition-colors"
                value={shippingForm.detailAddress}
                onChange={(e) =>
                  setShippingForm({
                    ...shippingForm,
                    detailAddress: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label
                htmlFor="customDeliveryRequest"
                className="block text-sm font-medium text-neutral-600 mb-1.5"
              >
                배송 요청사항
              </label>
              <select
                id="customDeliveryRequest"
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23666%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.5em_1.5em]"
                value={shippingForm.customDeliveryRequest}
                onChange={(e) =>
                  setShippingForm({
                    ...shippingForm,
                    customDeliveryRequest: e.target.value,
                  })
                }
              >
                <option value="">-- 배송 요청 사항 --</option>
                <option value="배송 전 연락 바랍니다.">
                  배송 전 연락 바랍니다.
                </option>
                <option value="부재시 경비실에 맡겨주세요.">
                  부재시 경비실에 맡겨주세요.
                </option>
                <option value="부재시 문 앞에 놓아주세요.">
                  부재시 문 앞에 놓아주세요.
                </option>
                <option value="부재시 택배함에 놓아주세요.">
                  부재시 택배함에 놓아주세요.
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* 결제 방법 */}
        <div>
          <h2 className="text-lg font-medium text-neutral-800 mb-6">
            결제 방법
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
              <input
                type="radio"
                name="payment"
                className="w-5 h-5 accent-neutral-900"
                checked={paymentMethod === PaymentMethod.DOMESTIC}
                onChange={() => setPaymentMethod(PaymentMethod.DOMESTIC)}
              />
              <div>
                <span className="font-medium text-neutral-800">국내 결제</span>
                <p className="text-xs text-neutral-500 mt-0.5">
                  국내 신용카드, 무통장 입금, 간편결제
                </p>
              </div>
            </label>

            <div
              className={
                paymentMethod !== PaymentMethod.DOMESTIC ? 'hidden' : ''
              }
            >
              <div id="payment-method" />
            </div>

            <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
              <input
                type="radio"
                name="payment"
                className="w-5 h-5 accent-neutral-900"
                checked={paymentMethod === PaymentMethod.FOREIGN}
                onChange={() => setPaymentMethod(PaymentMethod.FOREIGN)}
              />
              <div>
                <span className="font-medium text-neutral-800">해외 결제</span>
                <p className="text-xs text-neutral-500 mt-0.5">
                  해외 신용카드, PayPal
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {isPostcodeOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-neutral-200">
              <h3 className="font-medium text-neutral-800">우편번호 검색</h3>
              <button
                onClick={() => setPostcodeOpen(false)}
                className="text-neutral-500 hover:text-neutral-700 p-1"
                aria-label="닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <DaumPostcode
              onComplete={handleComplete}
              autoClose={false}
              style={{ height: 450 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
