'use client';

import { ROUTE } from '@/configs/constant/route';
import {
  useGetProduct,
  useGetProductListMyType,
} from '@/serivces/product/query';
import { BodyType } from '@/serivces/user/type';
import Image from 'next/image';
import Link from 'next/link';

export const RelatedProducts = ({ id }: { id: string }) => {
  const { data: product } = useGetProduct(id);

  const { data: productList } = useGetProductListMyType(
    product?.recommendedBodyType ?? BodyType.STRAIGHT
  );

  if (!productList || productList.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-xl font-medium text-gray-900 mb-6">
        함께 보면 좋은 상품
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productList.slice(0, 4).map((product) => (
          <Link
            key={product.id}
            href={ROUTE.SHOPPING_PRODUCT_DETAIL(product.id)}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow cursor-pointer"
          >
            <div className="aspect-square bg-gray-100 relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
              <h3 className="text-sm text-gray-900 line-clamp-2 mb-2">
                {product.name}
              </h3>
              <p className="text-base font-medium text-gray-900">
                ₩{product.price.toLocaleString()} ($
                {product.usdPrice.toLocaleString()})
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
