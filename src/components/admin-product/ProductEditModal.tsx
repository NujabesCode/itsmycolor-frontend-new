'use client';

import { ProductListItem } from '@/serivces/product/type';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY } from '@/configs/constant/query';
import Image from 'next/image';
import { adminApi } from '@/serivces/admin/request';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/configs/constant/route';
import { BodyType } from '@/serivces/user/type';
import { ColorSeason } from '@/serivces/color-analysis/type';

export const ProductEditModal = ({
  product,
  onClose,
}: {
  product: ProductListItem;
  onClose: () => void;
}) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const [isAvailable, setIsAvailable] = useState(true);
  const [bodyType, setBodyType] = useState<BodyType | null>(
    product.recommendedBodyType
  );
  const [colorSeason, setColorSeason] = useState<ColorSeason[] | null>(
    product.recommendedColorSeason
  );

  const handleSubmit = async () => {
    if (!bodyType) return alert('체형을 선택해주세요.');
    if (!colorSeason) return alert('퍼스널 컬러를 선택해주세요.');

    try {
      setIsLoading(true);

      await adminApi.putProduct(product.id, {
        recommendedBodyType: bodyType,
        recommendedColorSeason: colorSeason,
        isAvailable,
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY.ADMIN_PRODUCT_LIST],
      });

      alert('상품 정보가 수정되었습니다.');
      onClose();
    } catch (error) {
      alert('상품 정보 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            상품 정보 수정
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* 상품 기본 정보 */}
          <div className="flex items-center mb-6 bg-gray-50 p-3 rounded-md">
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex-shrink-0 relative">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                  sizes="64px"
                />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">상품 ID: {product.id}</p>
              <p className="text-sm text-gray-500">
                브랜드: {product.brandInfo.name}
              </p>
            </div>
          </div>

          {/* 상품 상세 페이지 버튼 */}
          <div className="mb-6">
            <button
              className="w-fit px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-500 transition-colors"
              onClick={() =>
                router.push(ROUTE.SHOPPING_PRODUCT_DETAIL(product.id))
              }
            >
              상품 상세 페이지 보러가기
            </button>
          </div>

          {/* 상품명 */}
          <div className="mb-6">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </span>
            <span className="text-sm text-gray-500">{product.name}</span>
          </div>

          {/* 체형 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              추천 체형
            </label>
            <select
              value={bodyType ?? ''}
              onChange={(e) => setBodyType(e.target.value as BodyType)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">선택</option>
              {Object.values(BodyType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 퍼스널 컬러 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              추천 퍼스널 컬러
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(ColorSeason).map((season) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => {
                    setColorSeason((prev) => {
                      if (!prev) return [season];
                      if (prev.includes(season)) {
                        return prev.filter((s) => s !== season);
                      }
                      return [...prev, season];
                    });
                  }}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    colorSeason?.includes(season)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          {/* 판매 상태 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              판매 상태
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isAvailable"
                  checked={!isAvailable}
                  onChange={() => setIsAvailable(false)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <span className="ml-2">승인 대기</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isAvailable"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(true)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <span className="ml-2">판매 중</span>
              </label>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end p-5 border-t border-gray-200 gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};
