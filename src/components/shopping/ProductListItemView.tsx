'use client';

import { ROUTE } from '@/configs/constant/route';
import { ProductListItem } from '@/serivces/product/type';
import Image from 'next/image';
import Link from 'next/link';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useLikeProduct } from '@/hooks/product/useLikeProduct';

export const ProductListItemView = ({
  product,
}: {
  product: ProductListItem;
}) => {
  const { isLiked, handleLikeProduct, user } = useLikeProduct(product.id);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleLikeProduct();
  };
  
  // 하트 색상 결정 로직
  const getHeartIcon = () => {
    // 로그인하지 않은 경우: 검정색 아웃라인 하트 (테두리만)
    if (!user) {
      return <IoHeartOutline size={20} className="text-black" />;
    }
    
    // 로그인한 경우
    if (isLiked) {
      // 찜 목록에 있는 경우: 검정색 채워진 하트
      return <IoHeart size={20} className="text-black" />;
    } else {
      // 찜 목록에 없는 경우: 회색 아웃라인 하트
      return <IoHeartOutline size={20} className="text-gray-400" />;
    }
  };

  // Color tag colors mapping
  const getSeasonColor = (season: string) => {
    if (season.includes('Spring')) return 'bg-pink-100 text-pink-700';
    if (season.includes('Summer')) return 'bg-blue-100 text-blue-700';
    if (season.includes('Autumn')) return 'bg-orange-100 text-orange-700';
    if (season.includes('Winter')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <Link
      href={ROUTE.SHOPPING_PRODUCT_DETAIL(product.id)}
      className="group block bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      <div className="flex gap-6 p-4">
        {/* Image */}
        <div className="relative w-32 h-40 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {/* Sold Out Badge */}
          {(!product.isAvailable || product.stockQuantity < 1) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-3 py-1 rounded font-medium text-sm">
                품절
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Brand & Name */}
            <p className="text-xs text-black font-semibold uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h3 className="font-normal text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700">
              {product.name}
            </h3>

            {/* Tags */}
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
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-normal text-gray-900">
                ₩{product.price.toLocaleString()} (${product.usdPrice.toLocaleString()})
              </span>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {getHeartIcon()}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
