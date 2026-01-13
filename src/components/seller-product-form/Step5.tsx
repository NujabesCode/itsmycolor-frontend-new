'use client';

import { ROUTE } from '@/configs/constant/route';
import { useSellerProductFormStore } from '@/providers/SellerProductFormStoreProvider';
import { useGetUser } from '@/serivces/user/query';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY } from '@/configs/constant/query';
import { useQueryString } from '@/hooks/common/useQueryString';

export const Step5 = ({ movePrev }: { movePrev: () => void }) => {
  const [productId] = useQueryString<string>('productId', '');

  const queryClient = useQueryClient();
  const [, , { data: brand }] = useGetUser();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const {
    shippingFee,
    freeShippingAmount,
    refundAddress,
    returnReason1,
    returnReason2,
    setStep5,
    onSave,
    onRegister,
    onUpdate,
  } = useSellerProductFormStore((state) => state);

  const [tempShippingFee, setTempShippingFee] = useState(shippingFee);
  const [tempFreeShippingAmount, setTempFreeShippingAmount] =
    useState(freeShippingAmount);
  const [tempRefundAddress, setTempRefundAddress] = useState(refundAddress);
  const [tempReturnReason1, setTempReturnReason1] = useState(returnReason1);
  const [tempReturnReason2, setTempReturnReason2] = useState(returnReason2);

  /* --- 추가 상태 --- */
  const [deliveryMethod, setDeliveryMethod] = useState<string>('택배');
  const [avgDeliveryFrom, setAvgDeliveryFrom] = useState<string>('');
  const [avgDeliveryTo, setAvgDeliveryTo] = useState<string>('');
  const [returnable, setReturnable] =
    useState<'가능' | '조건부 가능' | '불가능'>('가능');
  const [returnFee, setReturnFee] = useState<string>('');
  const [returnPeriod, setReturnPeriod] = useState<string>('');
  const [asAvailable, setAsAvailable] =
    useState<'가능' | '조건부 가능' | '불가능'>('가능');
  const [asDescription, setAsDescription] = useState<string>('');

  // 로컬 스토리지 키 상수
  const LOCAL_STORAGE_KEY = 'sellerProductFormStep5';

  /**
   * 컴포넌트 마운트 시 로컬 스토리지에 저장된 데이터가 있으면
   * 별도 확인 없이 자동으로 상태에 반영한다.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) return;

      const parsed: {
        shippingFee: number | null;
        freeShippingAmount: number | null;
        refundAddress: string | null;
        deliveryMethod?: string;
        avgDeliveryFrom?: string;
        avgDeliveryTo?: string;
        returnable?: '가능' | '조건부 가능' | '불가능';
        returnFee?: string;
        returnPeriod?: string;
        returnReason1?: string;
        returnReason2?: string;
        asAvailable?: '가능' | '조건부 가능' | '불가능';
        asDescription?: string;
      } = JSON.parse(saved);

      // 저장된 데이터가 있으면 자동으로 상태에 반영한다.
      if (parsed) {
        setTempShippingFee(parsed.shippingFee);
        setTempFreeShippingAmount(parsed.freeShippingAmount);
        setTempRefundAddress(parsed.refundAddress);
        setTempReturnReason1(parsed.returnReason1 ?? '');
        setTempReturnReason2(parsed.returnReason2 ?? '');

        setDeliveryMethod(parsed.deliveryMethod ?? '택배');
        setAvgDeliveryFrom(parsed.avgDeliveryFrom ?? '');
        setAvgDeliveryTo(parsed.avgDeliveryTo ?? '');
        setReturnable(parsed.returnable ?? '가능');
        setReturnFee(parsed.returnFee ?? '');
        setReturnPeriod(parsed.returnPeriod ?? '');
        setAsAvailable(parsed.asAvailable ?? '가능');
        setAsDescription(parsed.asDescription ?? '');

        // 스토어에는 배송비 관련 데이터만 반영
        setStep5({
          shippingFee: parsed.shippingFee ?? null,
          freeShippingAmount: parsed.freeShippingAmount ?? null,
          refundAddress: parsed.refundAddress ?? null,
          returnReason1: parsed.returnReason1 ?? '',
          returnReason2: parsed.returnReason2 ?? '',
        });
      }
    } catch (error) {
      console.error('Step5 로컬 스토리지 로드 실패', error);
    }
  }, []);

  const handleSave = () => {
    setStep5({
      shippingFee: tempShippingFee,
      freeShippingAmount: tempFreeShippingAmount,
      refundAddress: tempRefundAddress,
      returnReason1: tempReturnReason1,
      returnReason2: tempReturnReason2,
    });

    // 로컬 스토리지에 저장
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            shippingFee: tempShippingFee,
            freeShippingAmount: tempFreeShippingAmount,
            refundAddress: tempRefundAddress,
            returnReason1: tempReturnReason1,
            returnReason2: tempReturnReason2,
            deliveryMethod,
            avgDeliveryFrom,
            avgDeliveryTo,
            returnable,
            returnFee,
            returnPeriod,
            asAvailable,
            asDescription,
          })
        );
      }
    } catch (error) {
      console.error('Step5 로컬 스토리지 저장 실패', error);
    }

    onSave();

    alert('임시 저장되었습니다.');
  };

  const onSubmit = async () => {
    if (tempShippingFee === null || tempFreeShippingAmount === null)
      return alert('배송비와 무료 배송 기준 금액을 입력해주세요.');
    if (tempRefundAddress === null)
      return alert('환불 주소를 입력해주세요.');

    setStep5({
      shippingFee: tempShippingFee,
      freeShippingAmount: tempFreeShippingAmount,
      refundAddress: tempRefundAddress,
      returnReason1: tempReturnReason1,
      returnReason2: tempReturnReason2,
    });

    const brandId = brand?.id;
    const brandName = brand?.name;

    if (!brandId || !brandName) return alert('브랜드 정보를 불러오는데 실패했습니다.');

    try {
      setIsLoading(true);

      if (productId) {
        await onUpdate(productId);
      } else {
        await onRegister(brandId, brandName);
      }

      // 성공적으로 등록/수정된 경우 로컬 스토리지에도 저장한다.
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
              shippingFee: tempShippingFee,
              freeShippingAmount: tempFreeShippingAmount,
              refundAddress: tempRefundAddress,
              deliveryMethod,
              avgDeliveryFrom,
              avgDeliveryTo,
              returnable,
              returnFee,
              returnPeriod,
              returnReason1,
            returnReason2,
              asAvailable,
              asDescription,
            })
          );
        }
      } catch (error) {
        console.error('Step5 로컬 스토리지 저장 실패', error);
      }

      await queryClient.invalidateQueries({
        queryKey: [QUERY.PRODUCT_LIST_BY_BRAND, brandId],
      });

      alert(`상품 ${productId ? '수정' : '등록'}이 완료되었습니다.`);
      router.replace(ROUTE.SELLER_PRODUCT);
    } catch (e: any) {
      console.error(e);
      // PD-012: 중복 등록 에러 메시지 표시
      const errorMessage = e?.response?.data?.message || e?.message || '오류가 발생했습니다. 다시 시도해주세요.';
      if (errorMessage.includes('동일한 상품명과 모델명')) {
        alert('동일한 상품명과 모델명의 상품이 이미 등록되어 있습니다. 다른 상품명 또는 모델명을 사용해주세요.');
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
    // TODO: 상품 등록
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 mx-auto">
      {/* 제목 */}
      <h2 className="font-bold text-lg mb-8 text-gray-800">배송/환불 정보</h2>

      {/* 5.1 배송 방법 */}
      <div className="mb-10">
        <div className="font-semibold text-base text-gray-700 mb-4">
          5.1 배송 방법
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 배송 방법 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배송 방법 선택 <span className="text-red-600">*</span>
            </label>
            <select
              className="w-full border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            >
              <option value="택배">택배</option>
              <option value="직접배송">직접배송</option>
              <option value="퀵서비스">퀵서비스</option>
            </select>
          </div>
          {/* 배송비 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배송비 입력 <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className="flex-1 border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="배송비 입력"
                value={tempShippingFee ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setTempShippingFee(
                    value === '' ? 0 : Math.max(0, Number(value))
                  );
                }}
              />
              <span className="ml-2 text-gray-600">원</span>
            </div>
          </div>
        </div>
        {/* 무료 배송 기준 조건 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              무료 배송 기준 금액 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className="flex-1 border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="무료 배송 기준 금액"
                value={tempFreeShippingAmount ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setTempFreeShippingAmount(
                    value === '' ? 0 : Math.max(0, Number(value))
                  );
                }}
              />
              <span className="ml-2 text-gray-600">원 이상</span>
            </div>
          </div>
          {/* 평균 배송일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평균 배송일
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-20 border border-gray-200 rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="3"
                value={avgDeliveryFrom}
                onChange={(e) => setAvgDeliveryFrom(e.target.value)}
              />
              <span className="text-gray-600">~</span>
              <input
                type="number"
                className="w-20 border border-gray-200 rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="5"
                value={avgDeliveryTo}
                onChange={(e) => setAvgDeliveryTo(e.target.value)}
              />
              <span className="ml-2 text-gray-600">일</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5.2 반품/교환 정책 */}
      <div className="mb-10">
        <div className="font-semibold text-base text-gray-700 mb-4">
          5.2 반품/교환 정책
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            환불 주소 <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="환불 주소 입력"
            value={tempRefundAddress ?? ''}
            onChange={(e) => setTempRefundAddress(e.target.value)}
          />
        </div>

        <div className="mb-4 flex items-center gap-8">
          <span className="text-sm font-medium text-gray-700">
            반품/교환 가능 여부
          </span>
          <label className="flex items-center gap-1 text-sm font-normal text-gray-700">
            <input
              type="radio"
              name="returnable"
              value="가능"
              className="accent-gray-900"
              checked={returnable === '가능'}
              onChange={(e) => setReturnable(e.target.value as any)}
            />{' '}
            가능
          </label>
          <label className="flex items-center gap-1 text-sm font-normal text-gray-700">
            <input
              type="radio"
              name="returnable"
              value="조건부 가능"
              className="accent-gray-900"
              checked={returnable === '조건부 가능'}
              onChange={(e) => setReturnable(e.target.value as any)}
            />{' '}
            조건부 가능
          </label>
          <label className="flex items-center gap-1 text-sm font-normal text-gray-700">
            <input
              type="radio"
              name="returnable"
              value="불가능"
              className="accent-gray-900"
              checked={returnable === '불가능'}
              onChange={(e) => setReturnable(e.target.value as any)}
            />{' '}
            불가능
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 반품/교환 배송비 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              반품/교환 배송비
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className="flex-1 border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="반품/교환 배송비 입력"
                value={returnFee}
                onChange={(e) => setReturnFee(e.target.value)}
              />
              <span className="ml-2 text-gray-600">원</span>
            </div>
          </div>
          {/* 반품/교환 기간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              반품/교환 기간
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className="w-24 border border-gray-200 rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="7"
                value={returnPeriod}
                onChange={(e) => setReturnPeriod(e.target.value)}
              />
              <span className="ml-2 text-gray-600">일 이내</span>
            </div>
          </div>
        </div>
        {/* 반품/교환 불가 사유 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            반품/교환 불가 사유
          </label>
          <div className="space-y-3">
            <textarea
              className="w-full min-h-[60px] border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              placeholder="보통 반품/교환 배송비 가격이 달라서 입력칸이 2개로 해주세요"
              value={tempReturnReason1 ?? ''}
              onChange={(e) => setTempReturnReason1(e.target.value)}
            />
            <textarea
              className="w-full min-h-[60px] border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              placeholder="두 번째 반품/교환 불가 사유를 입력해주세요"
              value={tempReturnReason2 ?? ''}
              onChange={(e) => setTempReturnReason2(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 5.3 A/S 정보 */}
      <div className="mb-10">
        <div className="font-semibold text-base text-gray-700 mb-4">
          5.3 A/S 정보
        </div>
        <div className="mb-4 flex items-center gap-8">
          <span className="text-sm font-medium text-gray-700">
            A/S 가능 여부
          </span>
          <label className="flex items-center gap-1 text-sm font-normal text-gray-700">
            <input
              type="radio"
              name="as-available"
              value="가능"
              className="accent-gray-900"
              checked={asAvailable === '가능'}
              onChange={(e) => setAsAvailable(e.target.value as any)}
            />{' '}
            가능
          </label>
          <label className="flex items-center gap-1 text-sm font-normal text-gray-700">
            <input
              type="radio"
              name="as-available"
              value="조건부 가능"
              className="accent-gray-900"
              checked={asAvailable === '조건부 가능'}
              onChange={(e) => setAsAvailable(e.target.value as any)}
            />{' '}
            조건부 가능
          </label>
          <label className="flex items-center gap-1 text-sm font-normal text-gray-700">
            <input
              type="radio"
              name="as-available"
              value="불가능"
              className="accent-gray-900"
              checked={asAvailable === '불가능'}
              onChange={(e) => setAsAvailable(e.target.value as any)}
            />{' '}
            불가능
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            A/S 안내
          </label>
          <textarea
            className="w-full min-h-[60px] border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="A/S 관련 정보를 안내해주세요"
            value={asDescription}
            onChange={(e) => setAsDescription(e.target.value)}
          />
        </div>
      </div>

      {/* 5.4 판매자 정보 */}
      {/* <div className="mb-10">
        <div className="font-semibold text-base text-gray-700 mb-4">
          5.4 판매자 정보
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              판매자 상호 <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="판매자 상호 입력"
              />
              <button
                className="p-2 border border-gray-200 rounded bg-gray-50 hover:bg-gray-100"
                title="사업자등록증 업로드"
              >
                <span role="img" aria-label="upload">
                  📄
                </span>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대표자 이름
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="대표자 이름 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사업자 등록번호
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="사업자 등록번호 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연락처 <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="연락처 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="이메일 입력"
            />
          </div>
        </div>
      </div> */}

      {/* 하단 버튼 영역 */}
      <div className="flex justify-between items-center mt-8">
        <button
          className="px-6 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
          onClick={movePrev}
        >
          이전
        </button>
        <div className="flex gap-2">
          <button
            className="px-6 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100"
            onClick={handleSave}
          >
            임시 저장
          </button>
          <button
            className="px-6 py-2 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? '등록중...' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
};
