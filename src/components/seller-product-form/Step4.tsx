'use client';

import { useSellerProductFormStore } from '@/providers/SellerProductFormStoreProvider';
import { useState } from 'react';
import { BodyType } from '@/serivces/user/type';
import { ROUTE } from '@/configs/constant/route';
import { useQueryString } from '@/hooks/common/useQueryString';
import { useRouter } from 'next/navigation';
import { QUERY } from '@/configs/constant/query';
import { useQueryClient } from '@tanstack/react-query';

export const Step4 = ({ movePrev, moveNext }: { movePrev: () => void; moveNext: () => void }) => {
  const { recommendedBodyType, setStep4, onSave, onUpdate } = useSellerProductFormStore((state) => state);
  const [productId] = useQueryString<string>('productId', '');
  const queryClient = useQueryClient();
  const router = useRouter();

  const [tempRecommendedBodyType, setTempRecommendedBodyType] = useState<BodyType | null>(recommendedBodyType);

  const handleBodyTypeChange = (type: BodyType) => {
    setTempRecommendedBodyType(type);
  };

  const handleSave = () => {
    setStep4({
      recommendedBodyType: tempRecommendedBodyType,
    });

    onSave();

    alert('임시 저장되었습니다.');
  };

  const handleNext = () => {
    setStep4({
      recommendedBodyType: tempRecommendedBodyType,
    });

    moveNext();
  };

  const handleComplete = async () => {
    if (!productId) return;

    setStep4({
      recommendedBodyType: tempRecommendedBodyType,
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
    <div className="bg-white p-8 rounded-lg border border-gray-200 mx-auto">
      {/* 제목 */}
      <h2 className="font-bold text-lg mb-6 text-gray-800">체형 분석 정보</h2>

      {/* 4.1 채형 유형 선택 */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-gray-700">4.1 채형 유형 선택</label>
        <p className="text-sm text-gray-600 mb-4">이 상품에 어울리는 채형 유형을 선택해주세요.</p>
        <div className="flex gap-4">
          {Object.values(BodyType).map((value) => (
            <button
              key={value}
              className={`flex-1 py-3 rounded-lg border border-gray-200 font-medium ${
                tempRecommendedBodyType === value ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => handleBodyTypeChange(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* 4.2 상품 실루엣 정보 */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-gray-700">4.2 상품 실루엣 정보</label>
        <p className="text-sm text-gray-600 mb-4">실루엣 유형을 선택해주세요. (복수 선택 가능)</p>
        <div className="grid grid-cols-4 gap-4">
          {['A라인', 'H라인', 'X라인', 'O라인', '일자핏', '오버사이즈', '크롭', '와이드'].map((item) => (
            <label key={item} className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" className="accent-gray-900" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4.3 디자인 요소 */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-gray-700">4.3 디자인 요소</label>
        <p className="text-sm text-gray-600 mb-4">해당 디자인 요소를 선택해주세요. (복수 선택 가능)</p>
        <div className="grid grid-cols-4 gap-4">
          {['셔링', '프릴', '리본', '플리츠', '크롭', '단추', '색상', '드레이프', '레이스', '자수', '비즈'].map(
            (item) => (
              <label key={item} className="flex items-center gap-2 text-gray-700">
                <input type="checkbox" className="accent-gray-900" />
                <span>{item}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* 4.4 채형별 분석 이유 */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-gray-700">4.4 채형별 분석 이유</label>
        <textarea
          className="w-full h-24 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 text-gray-700"
          placeholder="채형별 분석 이유를 입력해주세요"
        />
      </div>

      {/* 4.5 스타일링 제안 */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-gray-700">4.5 스타일링 제안</label>
        <p className="text-sm text-gray-600 mb-2">이 상품의 스타일링에 어울리는 팁이 있다면 코디 팁을 입력해주세요.</p>
        <textarea
          className="w-full h-24 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 text-gray-700"
          placeholder="스타일링 팁을 입력해주세요"
        />
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
