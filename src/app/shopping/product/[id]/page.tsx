import React, { Suspense } from 'react';
import Link from 'next/link';
import { ROUTE } from '@/configs/constant/route';
import { IoChevronForward } from 'react-icons/io5';

import { ProductDetailView } from '@/components/shopping-product-detail/ProductDetailView';
import { ProductOptionView } from '@/components/shopping-product-detail/ProductOptionView';
import { MobileFixedBar } from '@/components/shopping-product-detail/MobileFixedBar';
import { RelatedProducts } from '@/components/shopping-product-detail/RelatedProducts';

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://13.125.130.10:3000';
    // 공개 상품 목록 API 사용
    const allProductIds: string[] = [];
    let page = 1;
    let hasMore = true;
    const maxPages = 50; // 최대 페이지 제한
    
    while (hasMore && page <= maxPages) {
      try {
        const response = await fetch(`${apiUrl}/products?page=${page}&limit=100`, {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          console.warn(`상품 목록 페이지 ${page}를 가져올 수 없습니다.`);
          break;
        }
        
        const data = await response.json();
        const products = data.products || [];
        
        if (products.length === 0) {
          hasMore = false;
        } else {
          products.forEach((product: { id: string }) => {
            if (product.id) {
              allProductIds.push(product.id);
            }
          });
          page++;
          // 마지막 페이지 확인
          if (data.lastPage && page > data.lastPage) {
            hasMore = false;
          }
        }
      } catch (fetchError) {
        console.warn(`페이지 ${page} 가져오기 실패:`, fetchError);
        hasMore = false;
      }
    }
    
    console.log(`생성할 상품 페이지 수: ${allProductIds.length}`);
    // 최소 1개 이상 반환 필요 (빈 배열 시 빌드 실패)
    if (allProductIds.length === 0) {
      return [{ id: "dummy" }];
    }
    return allProductIds.map((id) => ({ id }));
  } catch (error) {
    console.error('generateStaticParams 상품 에러:', error);
    // 에러 발생 시 더미 ID 반환 (빈 배열 시 빌드 실패)
    return [{ id: "dummy" }];
  }
}

export default async function ShoppingProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href={ROUTE.MAIN}
              className="text-gray-500 hover:text-gray-700"
            >
              홈
            </Link>
            <IoChevronForward size={14} className="text-gray-400" />
            <Link
              href={ROUTE.SHOPPING}
              className="text-gray-500 hover:text-gray-700"
            >
              쇼핑
            </Link>
            <IoChevronForward size={14} className="text-gray-400" />
            <span className="text-gray-900 font-medium">상품 상세</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Detail - Left Side */}
          <div className="lg:col-span-8">
            <Suspense
              fallback={
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-6" />
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              }
            >
              <ProductDetailView id={id} />
            </Suspense>
          </div>

          {/* Product Options - Right Side (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <ProductOptionView id={id} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts id={id} />
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <MobileFixedBar id={id} />
    </div>
  );
}
