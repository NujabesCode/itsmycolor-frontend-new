'use client';

import { useQueryString } from '@/hooks/common/useQueryString';
import { ProductDetailTab } from './ProductDetailTab';
import { ProductInfoView } from './ProductInfoView';
import { ReviewView } from './ReviewView';
import { QnaView } from './QnaView';
import { ShipView } from './ShipView';
import { useGetProduct } from '@/serivces/product/query';
import Image from 'next/image';
import { useState } from 'react';
import { useSaveRecommend } from '@/hooks/common/useSaveRecommend';

export const ProductDetailView = ({ id }: { id: string }) => {
  const [tabIndex] = useQueryString<number>('tabIndex', 0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product } = useGetProduct(id);

  useSaveRecommend(product);

  const allImages = product ? [product.imageUrl, ...(product.additionalImageUrls || [])] : [];

  return (
    <div className="flex-1 min-w-0">
      {/* 이미지 갤러리 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        {/* 메인 이미지 */}
        <div className="relative w-full aspect-[3/4] bg-gray-50 flex items-center justify-center overflow-hidden">
          {product?.imageUrl ? (
            <>
              <Image
                src={allImages[selectedImageIndex]}
                alt={product.name || '제품 이미지'}
                className="w-full h-full object-cover"
                width={800}
                height={1000}
                priority
              />
              {/* 이미지 인디케이터 */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        selectedImageIndex === index
                          ? 'w-6 bg-gray-800'
                          : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center text-gray-400">
              <span className="text-sm">이미지 로딩중...</span>
            </div>
          )}
        </div>

        {/* 썸네일 리스트 */}
        {allImages.length > 1 && (
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-gray-900'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={`${product?.name || '제품'} 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={64}
                    height={64}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 상세 정보 탭 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <ProductDetailTab />

        <div className="p-6">
          {product && (
            <>
              {tabIndex === 0 && <ProductInfoView product={product} />}
              {tabIndex === 1 && <ReviewView productId={id} />}
              {tabIndex === 2 && <QnaView product={product} />}
              {tabIndex === 3 && <ShipView product={product} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
