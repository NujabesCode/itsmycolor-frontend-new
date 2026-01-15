'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ROUTE } from '@/configs/constant/route';
import { IoChevronForward } from 'react-icons/io5';

import { ProductDetailView } from '@/components/shopping-product-detail/ProductDetailView';
import { ProductOptionView } from '@/components/shopping-product-detail/ProductOptionView';
import { MobileFixedBar } from '@/components/shopping-product-detail/MobileFixedBar';
import { RelatedProducts } from '@/components/shopping-product-detail/RelatedProducts';

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function ShoppingProductDetail() {
  const params = useParams();
  const id = params.id as string;

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
