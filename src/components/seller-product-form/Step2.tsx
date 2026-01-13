'use client';

import { useState } from 'react';
import { useSellerProductFormStore } from '@/providers/SellerProductFormStoreProvider';
import { formatDate } from '@/utils/date';
import { ROUTE } from '@/configs/constant/route';
import { useQueryString } from '@/hooks/common/useQueryString';
import { useRouter } from 'next/navigation';
import { QUERY } from '@/configs/constant/query';
import { useQueryClient } from '@tanstack/react-query';

export const Step2 = ({
  movePrev,
  moveNext,
}: {
  movePrev: () => void;
  moveNext: () => void;
}) => {
  const {
    price,
    usdPrice,
    stockQuantity,
    saleStartDate,
    hasSaleEndDate,
    saleEndDate,
    setStep2,
    onSave,
    onUpdate,
  } = useSellerProductFormStore((state) => state);

  const queryClient = useQueryClient();

  const [tempPrice, setTempPrice] = useState(price);
  const [tempUsdPrice, setTempUsdPrice] = useState(usdPrice);
  const [tempStockQuantity, setTempStockQuantity] = useState(stockQuantity);
  const [tempSaleStartDate, setTempSaleStartDate] = useState(saleStartDate);
  const [tempHasSaleEndDate, setTempHasSaleEndDate] = useState(hasSaleEndDate);
  const [tempSaleEndDate, setTempSaleEndDate] = useState(saleEndDate);

  const [productId] = useQueryString<string>('productId', '');
  const router = useRouter();

  const handleSave = () => {
    setStep2({
      price: tempPrice,
      usdPrice: tempUsdPrice,
      stockQuantity: tempStockQuantity,
      saleStartDate: tempSaleStartDate,
      hasSaleEndDate: tempHasSaleEndDate,
      saleEndDate: tempSaleEndDate,
    });

    onSave();

    alert('임시 저장되었습니다.');
  };

  const handleNext = () => {
    if (!tempPrice) return alert('판매가를 입력해주세요.');
    if (!tempUsdPrice) return alert('달러 가격을 입력해주세요.');
    if (tempStockQuantity === null) return alert('재고를 입력해주세요.');
    if (!tempSaleStartDate) return alert('판매 시작일을 입력해주세요.');
    if (tempHasSaleEndDate && !tempSaleEndDate)
      return alert('판매 종료일을 입력해주세요.');

    setStep2({
      price: tempPrice,
      usdPrice: tempUsdPrice,
      stockQuantity: tempStockQuantity,
      saleStartDate: tempSaleStartDate,
      hasSaleEndDate: tempHasSaleEndDate,
      saleEndDate: tempSaleEndDate,
    });

    moveNext();
  };

  const handleComplete = async () => {
    if (!productId) return;
    if (!tempPrice) return alert('판매가를 입력해주세요.');
    if (!tempUsdPrice) return alert('달러 가격을 입력해주세요.');
    if (tempStockQuantity === null) return alert('재고를 입력해주세요.');
    if (!tempSaleStartDate) return alert('판매 시작일을 입력해주세요.');
    if (tempHasSaleEndDate && !tempSaleEndDate) return alert('판매 종료일을 입력해주세요.');

    setStep2({
      price: tempPrice,
      usdPrice: tempUsdPrice,
      stockQuantity: tempStockQuantity,
      saleStartDate: tempSaleStartDate,
      hasSaleEndDate: tempHasSaleEndDate,
      saleEndDate: tempSaleEndDate,
    });

    try {
      await onUpdate(productId);
      await queryClient.invalidateQueries({ queryKey: [QUERY.PRODUCT_LIST_BY_BRAND] });
      alert('상품 수정이 완료되었습니다.');
      router.replace(ROUTE.SELLER_PRODUCT);
    } catch (e) {
      console.error(e);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-200 w-full">
      {/* 판매정보 */}
      <div className="font-bold text-base text-gray-800 mb-4">판매정보</div>

      {/* 2.1 가격 설정 */}
      <div className="bg-gray-50 p-4">
        <div className="font-semibold text-sm text-gray-700 mb-2">
          2.1 원화 가격 설정
        </div>
        <label className="block text-xs text-gray-600 mb-1" htmlFor="price">
          판매가 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center max-w-xs">
          <input
            id="price"
            type="number"
            placeholder="판매가 입력"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={tempPrice ?? ''}
            onChange={(e) => e.target.value ? setTempPrice(Number(e.target.value)) : setTempPrice(null)}
          />
          <span className="ml-2 text-sm text-gray-500">원</span>
        </div>
      </div>

      {/* 2.2 달러 가격 설정 */}
      <div className="bg-gray-50 p-4">
        <div className="font-semibold text-sm text-gray-700 mb-2">
          2.2 달러 가격 설정
        </div>
        <label className="block text-xs text-gray-600 mb-1" htmlFor="usdPrice">
          달러 가격 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center max-w-xs">
          <input
            id="usdPrice"
            type="number"
            placeholder="달러 가격 입력"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={tempUsdPrice ?? ''}
            onChange={(e) => e.target.value ? setTempUsdPrice(Number(e.target.value)) : setTempUsdPrice(null)}
          />
          <span className="ml-2 text-sm text-gray-500">$</span>
        </div>
      </div>

      {/* 2.3 재고 설정 */}
      <div className="bg-gray-50 p-4">
        <div className="font-semibold text-sm text-gray-700 mb-2">
          2.3 재고 설정
        </div>
        <label
          className="block text-xs text-gray-600 mb-1"
          htmlFor="stockQuantity"
        >
          재고 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center max-w-xs">
          <input
            id="stockQuantity"
            type="number"
            placeholder="재고 입력"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={tempStockQuantity ?? ''}
            onChange={(e) => e.target.value ? setTempStockQuantity(Number(e.target.value)) : setTempStockQuantity(null)}
          />
        </div>
      </div>

      <div className="h-6" />

      {/* 2.4 판매 기간 설정 */}
      <div className="bg-gray-50 p-4">
        <div className="font-semibold text-sm text-gray-700 mb-2">
          2.3 판매 기간 설정
        </div>
        <label className="block text-xs text-gray-600 mb-1" htmlFor="sale-date">
          판매 시작일 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center max-w-xs">
          <input
            id="sale-date"
            type="date"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={tempSaleStartDate ? formatDate(tempSaleStartDate) : ''}
            onChange={(e) => {
              const value = e.target.value;
              setTempSaleStartDate(value === '' ? null : new Date(value));
            }}
          />
        </div>

        {/* 판매 종료일 설정 토글 */}
        <div className="flex flex-col mt-4">
          <div className="flex items-center">
            <label htmlFor="end-toggle" className="text-xs text-gray-600 mr-2">
              판매 종료일 설정
            </label>
            <input
              id="end-toggle"
              type="checkbox"
              className="toggle toggle-sm"
              checked={tempHasSaleEndDate}
              onChange={(e) => {
                setTempHasSaleEndDate((prev) => !prev);
              }}
            />
          </div>

          <div className="h-2" />

          <span className="text-xs text-gray-400">
            판매 종료일을 설정하지 않으면 계속 판매합니다.
          </span>
        </div>

        {tempHasSaleEndDate && (
          <>
            <div className="h-4" />

            <label
              className="block text-xs text-gray-600 mb-1"
              htmlFor="sale-date"
            >
              판매 종료일
            </label>
            <div className="flex items-center max-w-xs">
              <input
                id="sale-date"
                type="date"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={tempSaleEndDate ? formatDate(tempSaleEndDate) : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSaleEndDate(value === '' ? null : new Date(value));
                }}
              />
            </div>
          </>
        )}
      </div>

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
            onClick={handleNext}
          >
            다음
          </button>
          {productId && (
            <button
              type="button"
              className="px-6 py-2 rounded-md bg-gray-700 text-white text-sm font-semibold hover:bg-gray-600"
              onClick={handleComplete}
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
