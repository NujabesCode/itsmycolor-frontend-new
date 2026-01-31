"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ROUTE } from '@/configs/constant/route';
import { IoChevronForward } from 'react-icons/io5';

import { ProductDetailView } from '@/components/shopping-product-detail/ProductDetailView';
import { ProductOptionView } from '@/components/shopping-product-detail/ProductOptionView';
import { MobileFixedBar } from '@/components/shopping-product-detail/MobileFixedBar';
import { RelatedProducts } from '@/components/shopping-product-detail/RelatedProducts';

// 클라이언트 컴포넌트로 URL에서 ID를 읽어서 동적으로 렌더링
export function ShoppingProductDetailClient({ initialId }: { initialId?: string } = {}) {
  const [id, setId] = React.useState<string>(initialId || '');

  React.useEffect(() => {
    // initialId가 있으면 사용
    if (initialId && initialId !== 'dummy') {
      console.log('[ShoppingProductDetailClient] initialId 사용:', initialId);
      setId(initialId);
      return;
    }

    // URL에서 상품 ID 추출
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const fullUrl = window.location.href;
      
      console.log('[ShoppingProductDetailClient] URL 분석:', {
        pathname,
        fullUrl,
        hash,
        search: window.location.search,
        referrer: document.referrer,
        initialId
      });
      
      let extractedId = '';
      
      // 1. fullUrl에서 상품 ID 추출 시도 (가장 우선 - S3 404 리다이렉트 대응)
      // S3에서 404 발생 시 index.html로 리다이렉트되지만 브라우저 주소창에는 원래 URL이 표시됨
      const urlMatch = fullUrl.match(/\/shopping\/product\/([^\/\?\#]+)/);
      if (urlMatch && urlMatch[1]) {
        extractedId = urlMatch[1].replace(/\.html$/, '');
        console.log('[ShoppingProductDetailClient] fullUrl에서 ID 추출:', extractedId);
      }
      
      // 2. pathname에서 상품 ID 추출 (ProductRedirectHandler가 URL을 복원한 경우)
      if ((!extractedId || extractedId === 'dummy') && pathname.includes('/shopping/product/')) {
        const pathMatch = pathname.match(/\/shopping\/product\/([^\/\?]+)/);
        if (pathMatch && pathMatch[1]) {
          extractedId = pathMatch[1].replace(/\.html$/, '');
          console.log('[ShoppingProductDetailClient] pathname에서 ID 추출:', extractedId);
        }
      }
      
      // 3. 해시에서 상품 ID 확인 (index.html로 리다이렉트된 경우)
      if ((!extractedId || extractedId === 'dummy') && hash) {
        const hashMatch = hash.match(/\/shopping\/product\/([^\/\?]+)/);
        if (hashMatch && hashMatch[1]) {
          const hashId = hashMatch[1].replace(/\.html$/, '');
          const hashParams = new URLSearchParams(hash.split('?')[1] || '');
          extractedId = hashParams.get('productId') || hashId;
          console.log('[ShoppingProductDetailClient] hash에서 ID 추출:', extractedId);
        }
      }
      
      // 4. 쿼리 파라미터에서 상품 ID 확인 (가장 우선 - dummy.html에서 전달된 경우)
      if (!extractedId || extractedId === 'dummy') {
        extractedId = searchParams.get('productId') || '';
        if (extractedId && extractedId !== 'dummy') {
          console.log('[ShoppingProductDetailClient] 쿼리 파라미터에서 ID 추출:', extractedId);
        }
      }
      
      // pathname이 dummy인 경우 쿼리 파라미터에서 ID 추출 (우선순위 높음)
      if (pathname.includes('/shopping/product/dummy')) {
        const queryId = searchParams.get('productId');
        if (queryId && queryId !== 'dummy') {
          extractedId = queryId;
          console.log('[ShoppingProductDetailClient] dummy.html에서 쿼리 파라미터로 ID 추출:', extractedId);
        }
      }
      
      // 5. referrer에서 ID 추출 시도 (최후의 수단)
      if (!extractedId || extractedId === 'dummy') {
        const referrer = document.referrer;
        if (referrer) {
          const referrerMatch = referrer.match(/\/shopping\/product\/([^\/\?]+)/);
          if (referrerMatch && referrerMatch[1]) {
            extractedId = referrerMatch[1].replace(/\.html$/, '');
            console.log('[ShoppingProductDetailClient] referrer에서 ID 추출:', extractedId);
          }
        }
      }
      
      // 상품 ID를 찾았으면 설정
      if (extractedId && extractedId !== 'dummy') {
        console.log('[ShoppingProductDetailClient] 최종 ID 설정:', extractedId);
        setId(extractedId);
        return;
      } else {
        console.error('[ShoppingProductDetailClient] 상품 ID를 찾을 수 없습니다:', {
          pathname,
          fullUrl,
          hash,
          search: window.location.search,
          initialId
        });
        // ID를 찾지 못했지만 홈으로 리다이렉트하지 않음
      }
    }
  }, [initialId]);

  // ID가 없으면 로딩 표시
  if (!id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
