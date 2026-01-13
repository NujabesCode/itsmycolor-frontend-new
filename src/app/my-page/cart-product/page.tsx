'use client';

import { useProductStore } from '@/providers/ProductStoreProvider';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTE } from '@/configs/constant/route';
import { IoTrashOutline, IoAddOutline, IoRemoveOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { ProductForCart } from '@/stores/product-store';

export default function CartProduct() {
  const router = useRouter();

  const { cartProducts, addToCart } = useProductStore((state) => state);

  // 총 가격 계산
  const totalPrice = cartProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  // 컬러 시즌 태그 색상
  const getSeasonColor = (season: string) => {
    if (season.includes('Spring')) return 'bg-pink-100 text-pink-700';
    if (season.includes('Summer')) return 'bg-blue-100 text-blue-700';
    if (season.includes('Autumn')) return 'bg-orange-100 text-orange-700';
    if (season.includes('Winter')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const onBuy = (product: ProductForCart) => {
    router.push(
      ROUTE.SHOPPING_ORDER({
        productId: product.id,
        size: product.size,
        quantity: product.quantity,
      })
    );
  };

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">장바구니</h1>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              장바구니가 비어있습니다
            </h3>
            <p className="text-gray-500 mb-6">
              마음에 드는 상품을 장바구니에 담아보세요!
            </p>
            <Link
              href={ROUTE.SHOPPING}
              className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              쇼핑하러 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">장바구니</h1>

        <div className="space-y-4">
          {cartProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex gap-4">
                  {/* 상품 이미지 */}
                  <Link
                    href={ROUTE.SHOPPING_PRODUCT_DETAIL(product.id)}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {product.brand}
                        </p>
                        <Link
                          href={ROUTE.SHOPPING_PRODUCT_DETAIL(product.id)}
                          className="text-sm font-medium text-gray-900 hover:text-gray-700 line-clamp-2"
                        >
                          {product.name} / {product.size}
                        </Link>
                      </div>
                      <button
                        onClick={() =>
                          addToCart(product, product.size, -product.quantity)
                        }
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="상품 삭제"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </div>

                    {/* 태그들 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.recommendedColorSeason?.map((season) => (
                        <span
                          key={season}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeasonColor(
                            season
                          )}`}
                        >
                          {season}
                        </span>
                      ))}
                      {product.recommendedBodyType && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                          {product.recommendedBodyType}
                        </span>
                      )}
                    </div>

                    {/* 가격 및 수량 조절 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* 수량 조절 */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => addToCart(product, product.size, -1)}
                            disabled={product.quantity <= 1}
                            className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                          >
                            <IoRemoveOutline size={16} />
                          </button>
                          <span className="px-3 py-2 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(product, product.size, 1)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                          >
                            <IoAddOutline size={16} />
                          </button>
                        </div>
                      </div>

                      {/* 가격 */}
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          ₩{(product.price * product.quantity).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          개당 ₩{product.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 개별 구매 버튼 */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => onBuy(product)}
                  className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  구매하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
