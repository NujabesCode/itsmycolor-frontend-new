'use client';

import { useGetProduct } from '@/serivces/product/query';
import { useState } from 'react';
import { ProductTryOnModal } from './ProductTryOnModal';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/configs/constant/route';
import { useAuth } from '@/hooks/auth/useAuth';
import { useProductStore } from '@/providers/ProductStoreProvider';

const SIZE_TO_NUMBER: Record<string, string> = {
  S: '95~100',
  M: '100~105',
  L: '105~110',
};

const SIZE_ORDER: Record<string, number> = {
  XXS: 0,
  XS: 1,
  S: 2,
  M: 3,
  L: 4,
  XL: 5,
  XXL: 6,
  XXXL: 7,
  FREE: 8,
};

export const ProductOptionView = ({ id }: { id: string }) => {
  const { getToken } = useAuth();

  const router = useRouter();

  const { data: product } = useGetProduct(id);

  const [isOpenTryOnModal, setOpenTryOnModal] = useState(false);

  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const addToCart = useProductStore((state) => state.addToCart);

  // 상품 품절 여부
  const isSoldOut = (product?.stockQuantity ?? 0) <= 0;

  const onCart = () => {
    if (!size) return alert('사이즈를 선택해주세요.');

    if (product) {
      addToCart(product, size, quantity);

      alert('장바구니에 추가되었습니다.');
    } else {
      alert('상품 정보를 불러오는데 실패했습니다.');
    }
  };

  const onBuy = () => {
    if (!size) return alert('사이즈를 선택해주세요.');

    router.push(
      ROUTE.SHOPPING_ORDER({
        productId: id,
        size: size,
        quantity: quantity,
      })
    );
  };

  return (
    <>
      <div className="w-full lg:w-[400px] lg:shrink-0">
        <div className="w-full bg-white border border-gray-200 rounded-lg p-6 lg:sticky lg:top-48 lg:bottom-[400px] lg:right-[calc(50%-609px)] lg:w-[400px]">
          {/* 브랜드 정보 (클릭 시 브랜드 상세로 이동) */}
          <div
            className="text-sm text-gray-600 mb-2 cursor-pointer hover:underline"
            onClick={() => {
              if (product?.brandInfo?.id) {
                router.push(ROUTE.SHOPPING_BRAND_DETAIL(product.brandInfo.id));
              }
            }}
          >
            {product?.brand}
          </div>

          {/* 상품명 */}
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            {product?.name}
          </h2>

          {/* 퍼스널 컬러 & 체형 정보 */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
              {product?.recommendedColorSeason.join(', ')}
            </span>
            <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
              {product?.recommendedBodyType}
            </span>
          </div>

          {/* 가격 */}
          <div className="text-2xl font-medium text-gray-900 mb-6">
            {product?.price.toLocaleString()}원 ({product?.usdPrice.toLocaleString()}$)
          </div>

          {/* 사이즈 선택 */}
          <div className="mb-6">
            <span className="text-sm text-gray-700 font-medium mb-2 block">
              사이즈
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(product?.sizeInfo ?? {})
                .sort((a, b) => {
                  const orderA =
                    SIZE_ORDER[a] !== undefined ? SIZE_ORDER[a] : 999;
                  const orderB =
                    SIZE_ORDER[b] !== undefined ? SIZE_ORDER[b] : 999;
                  return orderA - orderB;
                })
                .map((item) => (
                  <button
                    key={'size' + item}
                    className={`px-4 py-2 rounded border text-sm transition-colors ${
                      size === item
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
            </div>
            {size && SIZE_TO_NUMBER[size] && (
              <p className="text-xs text-gray-500 mt-2">
                {size}: {SIZE_TO_NUMBER[size]}
              </p>
            )}
          </div>
          {/* 수량 선택 */}
          <div className="mb-6" id="quantity-selector">
            <span className="text-sm text-gray-700 font-medium mb-2 block">
              수량
            </span>
            <div className="flex items-center gap-3">
              <button
                className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50 text-gray-600"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </button>
              <input
                type="number"
                className="w-16 px-3 py-1 text-center border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
                defaultValue={1}
                min={1}
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1) {
                    setQuantity(value);
                  }
                }}
              />
              <button
                className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50 text-gray-600"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* 총 상품 금액 */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">총 상품 금액</span>
              <span className="text-lg font-medium text-gray-900">
                {((product?.price ?? 0) * quantity).toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col gap-2">
            {/* 시착하기 버튼 (항상 표시) */}
            <button
              className="w-full py-3 rounded bg-gray-100 text-gray-900 font-medium text-sm hover:bg-gray-200 transition-colors"
              onClick={() => {
                if (!getToken()) {
                  alert('로그인이 필요한 기능입니다.');
                  return router.push(ROUTE.SIGNIN);
                }

                setOpenTryOnModal(true);
              }}
            >
              시착하기
            </button>

            {isSoldOut ? (
              // 품절 상태
              <div className="w-full py-3 rounded bg-transparent text-red-600 font-medium text-sm text-center">
                품절
              </div>
            ) : (
              // 재고가 있을 때 표시되는 버튼들
              <>
                <button
                  className="w-full py-3 rounded bg-gray-100 text-gray-900 font-medium text-sm hover:bg-gray-200 transition-colors"
                  onClick={onCart}
                >
                  장바구니
                </button>
                <button
                  className="w-full py-3 rounded bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
                  onClick={onBuy}
                >
                  바로 구매하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {id && isOpenTryOnModal && (
        <ProductTryOnModal
          productId={id}
          onClose={() => setOpenTryOnModal(false)}
        />
      )}
    </>
  );
};
