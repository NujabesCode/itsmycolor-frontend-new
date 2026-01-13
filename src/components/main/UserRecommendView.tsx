'use client';

import { ROUTE } from '@/configs/constant/route';
import { useGetFitProductList } from '@/serivces/product/query';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useGetUser } from '@/serivces/user/query';

// 한 줄 슬라이더 컴포넌트
const ProductSlider = ({ products, title }: { products: any[] | undefined; title: string }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || !products) return;
      const container = scrollContainerRef.current;
      const scrollPercentage = container.scrollLeft / (container.scrollWidth - container.clientWidth);
      const index = Math.round(scrollPercentage * (products.length - 1));
      setCurrentIndex(index);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [products]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">{title} 추천 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-6 text-center">
        <h3 className="text-lg md:text-xl font-normal" style={{ color: 'var(--season_color_04)' }}>
          {title}
        </h3>
      </div>
      <div className="relative overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-0 py-2"
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {products.map((item, index) => (
            <Link
              key={item.id || index}
              className="group relative bg-white overflow-hidden flex-shrink-0 w-[170px] sm:w-[180px] md:w-[220px] transform transition-opacity duration-200 hover:opacity-80"
              href={ROUTE.SHOPPING_PRODUCT_DETAIL(item.id)}
              onClick={(e) => {
                if (isDragging) {
                  e.preventDefault();
                }
              }}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  draggable={false}
                />
                
                {/* Stock Status */}
                {(!item.isAvailable || item.stockQuantity === 0) && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-black px-3 py-1 text-xs">품절</span>
                  </div>
                )}
              </div>
              
              <div className="p-3.5 md:p-4.5 space-y-2">
                {item.brandInfo?.name && (
                  <p className="text-sm md:text-base mb-0.5 font-bold" style={{ color: 'var(--season_color_04)' }}>
                    {item.brandInfo.name}
                  </p>
                )}
                <h3 className="leading-tight line-clamp-2 min-h-[40px]" style={{ fontSize: '14px', color: 'var(--season_color_01)', lineHeight: '1.5' }}>
                  {item.name}
                </h3>
                <p className="font-bold" style={{ fontSize: '15px', color: 'var(--season_color_01)' }}>
                  ₩{item.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export const UserRecommendView = () => {
  const [,{ data: colorAnalysis, isLoading: isLoadingColorAnalysis }] = useGetUser();
  
  const bodyType = colorAnalysis?.bodyType || undefined;
  const colorSeason = colorAnalysis?.colorSeason || undefined;

  // 디버깅 로그
  console.log('UserRecommendView - colorAnalysis:', colorAnalysis);
  console.log('UserRecommendView - bodyType:', bodyType);
  console.log('UserRecommendView - colorSeason:', colorSeason);

  // 퍼스널 컬러별 상품 (colorSeason만 사용)
  const { data: colorSeasonProductsData, isLoading: isLoadingColorSeason } = useGetFitProductList(undefined, colorSeason);
  const colorSeasonProducts = colorSeasonProductsData?.products?.slice(0, 10);

  // 체형별 상품 (bodyType만 사용)
  const { data: bodyTypeProductsData, isLoading: isLoadingBodyType } = useGetFitProductList(bodyType, undefined);
  const bodyTypeProducts = bodyTypeProductsData?.products?.slice(0, 10);

  console.log('UserRecommendView - colorSeasonProducts:', colorSeasonProducts);
  console.log('UserRecommendView - bodyTypeProducts:', bodyTypeProducts);

  // 로딩 중일 때
  if (isLoadingColorAnalysis) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm">로딩 중...</p>
      </div>
    );
  }

  // 로그인하지 않았거나 데이터가 없을 때
  if (!colorAnalysis) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm">로그인하고 퍼스널 컬러를 분석하면 나에게 맞는 상품을 추천해드립니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 퍼스널 컬러별 추천 - 상단 한 줄 */}
      {colorSeason && (
        <ProductSlider 
          products={colorSeasonProducts} 
          title={`나의 퍼스널 컬러: ${colorSeason}`}
        />
      )}
      
      {/* 체형별 추천 - 하단 한 줄 */}
      {bodyType && (
        <ProductSlider 
          products={bodyTypeProducts} 
          title={`나의 체형: ${bodyType}`}
        />
      )}
      
      {/* 둘 다 없을 때 */}
      {!colorSeason && !bodyType && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">퍼스널 컬러와 체형 정보가 없습니다. 분석을 완료해주세요.</p>
        </div>
      )}
    </div>
  );
};
