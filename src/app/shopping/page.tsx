"use client";

import dynamic from 'next/dynamic';
import { ROUTE } from '@/configs/constant/route';
import Link from 'next/link';
import React from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// dynamic import를 사용하되, 명시적으로 ssr: false 설정
const ProductListView = dynamic(() => import('@/components/shopping/ProductListView').then(mod => ({ default: mod.ProductListView })), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

const ShoppingFilter = dynamic(() => import('@/components/shopping/ShoppingFilter').then(mod => ({ default: mod.ShoppingFilter })), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
});

const ShoppingMobileFilter = dynamic(() => import('@/components/shopping/ShoppingMobileFilter').then(mod => ({ default: mod.ShoppingMobileFilter })), { 
  ssr: false 
});

const BestProductsSection = dynamic(() => import('@/components/shopping/BestProductsSection').then(mod => ({ default: mod.BestProductsSection })), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

export default function Shopping() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link
              href={ROUTE.MAIN}
              className="hover:text-black transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-black">Shop</span>
          </nav>

          <div className="space-y-6">
            {/* SHOP ALL 정보 */}
            <div className="text-center">
              <h1 className="text-4xl font-light text-gray-900">
                SHOP ALL
              </h1>
            </div>

            {/* 나만의 스타일 발견 */}
            <div className="border-t pt-6" style={{ borderColor: 'var(--season_color_08)' }}>
              <h2 className="text-base md:text-lg font-normal mb-2 text-center" style={{ color: 'var(--season_color_01)' }}>나만의 스타일 발견</h2>
              <p className="text-xs md:text-sm mb-6 text-center" style={{ color: 'var(--season_color_04)' }}>퍼스널 컬러와 체형을 분석하여 나에게 맞는 스타일을 찾아보세요</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link
                  href={ROUTE.COLOR_TEST}
                  className="flex-1 bg-white border border-gray-300 text-black px-6 py-4 text-center text-sm md:text-base font-normal hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--season_color_08)' }}
                >
                  컬러별 진단하기
                </Link>
                <Link
                  href={ROUTE.TYPETEST}
                  className="flex-1 bg-white border border-gray-300 text-black px-6 py-4 text-center text-sm md:text-base font-normal hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--season_color_08)' }}
                >
                  체형별 진단하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST Products Section */}
      <section className="max-w-[1440px] mx-auto px-6 py-8 border-b border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-medium mb-2 text-gray-900">BEST</h2>
          <p className="text-sm text-gray-600">지금 가장 인기 있는 상품</p>
        </div>
        <ErrorBoundary>
          <BestProductsSection />
        </ErrorBoundary>
      </section>

      {/* Main Content */}
      <section className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <ErrorBoundary>
                <ShoppingFilter />
              </ErrorBoundary>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <ErrorBoundary>
              <ShoppingMobileFilter />
            </ErrorBoundary>

            {/* Products */}
            <ErrorBoundary>
              <ProductListView />
            </ErrorBoundary>
          </div>
        </div>
      </section>

    </div>
  );
}
