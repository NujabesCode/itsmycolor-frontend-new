'use client';

import { ROUTE } from '@/configs/constant/route';
import { ProductListItem } from '@/serivces/product/type';
import Image from 'next/image';
import Link from 'next/link';

export const ProductView = ({ product }: { product: ProductListItem }) => {

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
      className="group block h-full flex flex-col w-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-2 md:mb-3 flex-shrink-0 w-full">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs md:text-sm">No Image</span>
          </div>
        )}

        {/* Sold Out Badge */}
        {(!product.isAvailable || product.stockQuantity < 1) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-white text-gray-900 px-2 py-1 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm">
              품절
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 min-h-[100px] md:min-h-[140px]">
        {/* Tags */}
        <div className="flex flex-wrap gap-0.5 md:gap-1 mb-1 md:mb-2 min-h-[16px] md:min-h-[20px]">
          {product.recommendedColorSeason?.slice(0, 1).map((season) => (
            <span
              key={season}
              className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full font-medium ${getSeasonColor(
                season
              )}`}
            >
              {season}
            </span>
          ))}
          {product.recommendedBodyType && (
            <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
              {product.recommendedBodyType}
            </span>
          )}
        </div>

        {/* Brand */}
        <p className="text-[10px] md:text-xs text-black font-semibold uppercase tracking-wide mb-0.5 md:mb-1 line-clamp-1">
          {product.brand}
        </p>

        {/* Product Name - 고정 높이 */}
        <h3 className="font-normal text-xs md:text-sm text-gray-900 line-clamp-2 group-hover:text-gray-700 mb-auto min-h-[32px] md:min-h-[40px] leading-tight">
          {product.name}
        </h3>

        {/* Price - 하단 고정 */}
        <div className="flex items-center gap-1 md:gap-2 mt-auto pt-1 md:pt-2">
          <span className="text-xs md:text-base font-normal text-gray-900 line-clamp-1">
            ₩{product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
};
