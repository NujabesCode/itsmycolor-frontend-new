'use client';

import { ROUTE } from '@/configs/constant/route';
import { QUERY } from '@/configs/constant/query';
import { productApi } from '@/serivces/product/request';
import { ColorSeason } from '@/serivces/color-analysis/type';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useGetUser } from '@/serivces/user/query';
import { STORAGE } from '@/configs/constant/storage';
import { BodyType } from '@/serivces/user/type';
import { useQuery } from '@tanstack/react-query';

// 퍼스널 컬러 시즌 한글 매핑
const COLOR_SEASON_KR: Record<string, string> = {
  [ColorSeason.SPRING_BRIGHT]: '봄브라이트',
  [ColorSeason.SPRING_LIGHT]: '봄라이트',
  [ColorSeason.SUMMER_LIGHT]: '여름라이트',
  [ColorSeason.SUMMER_MUTE]: '여름뮤트',
  [ColorSeason.AUTUMN_MUTE]: '가을뮤트',
  [ColorSeason.AUTUMN_DEEP]: '가을딥',
  [ColorSeason.WINTER_DARK]: '겨울다크',
  [ColorSeason.WINTER_BRIGHT]: '겨울브라이트',
};

export const ProductView = ({type}: {type: 'user' | 'recommend' | 'all' | 'new'}) => {
  const [,{ data: colorAnalysis }] = useGetUser();

  /* ------------------------------
   * 추천 상품 뷰에서는(localStorage 기반)
   * 최근 클릭한 상품들의 bodyType / colorSeason 기록 중
   * 가장 많이 등장한 값을 조회해 쿼리 파라미터로 사용한다.
   * -------------------------------- */

  const [recommendBodyType, setRecommendBodyType] = useState<BodyType | undefined>(undefined);
  const [recommendColorSeason, setRecommendColorSeason] = useState<ColorSeason | undefined>(undefined);

  useEffect(() => {
    if (type !== 'recommend') return;

    const getMostFrequent = (list: string[]): string | undefined => {
      if (!Array.isArray(list) || list.length === 0) return undefined;
      const frequency: Record<string, number> = {};
      list.forEach((item) => {
        if (!item) return;
        frequency[item] = (frequency[item] || 0) + 1;
      });
      // Find key with max count
      return Object.entries(frequency).sort((a, b) => b[1] - a[1])[0]?.[0];
    };

    try {
      // BodyType
      const bodyHistoryRaw = localStorage.getItem(STORAGE.CLICK_PRODUCT_BODY_TYPE);
      const bodyHistory: string[] = bodyHistoryRaw ? JSON.parse(bodyHistoryRaw) : [];
      const mostBody = getMostFrequent(bodyHistory);
      if (mostBody) setRecommendBodyType(mostBody as BodyType);

      // ColorSeason
      const seasonHistoryRaw = localStorage.getItem(STORAGE.CLICK_PRODUCT_COLOR_SEASON);
      const seasonHistory: string[] = seasonHistoryRaw ? JSON.parse(seasonHistoryRaw) : [];
      const mostSeason = getMostFrequent(seasonHistory);
      if (mostSeason) setRecommendColorSeason(mostSeason as ColorSeason);
    } catch (e) {
      console.error('Failed to read recommend history from localStorage', e);
    }
  }, [type]);

  const bodyType = type === 'user' ? (colorAnalysis?.bodyType || undefined) : recommendBodyType;
  const colorSeason = type === 'user' ? (colorAnalysis?.colorSeason || undefined) : recommendColorSeason;

  // 로그인하지 않았거나 필터가 없을 때는 전체 상품을 보여줌
  const shouldShowAll = type === 'all' || (!bodyType && !colorSeason);
  
  // BEST 섹션(type='all')은 판매량 기준으로 정렬, 신규상품(type='new')은 최신순 정렬
  const { data: productsData } = useQuery({
    queryKey: [QUERY.PRODUCT_LIST_FIT, bodyType, colorSeason, type === 'all' ? 'sales' : type === 'new' ? 'latest' : undefined],
    queryFn: () => productApi.getProductList({
      page: 1,
      limit: type === 'all' || type === 'new' ? 12 : 6,
      bodyType: shouldShowAll ? undefined : bodyType,
      colorSeasons: shouldShowAll ? undefined : (colorSeason ? [colorSeason] : undefined),
      sort: type === 'all' ? 'sales' : type === 'new' ? 'latest' : undefined,
    }),
  });
  
  const products = productsData?.products?.slice(0, type === 'all' || type === 'new' ? 12 : 6);

  // type이 'user'일 때 상품이 없으면 안내 메시지 표시
  const showEmptyMessage = type === 'user' && products && products.length === 0;

  // BEST 섹션(type='all')과 신규상품(type='new')은 그리드로, 나머지는 슬라이더로
  if (type === 'all' || type === 'new') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        {products?.map((item, index) => (
          <Link
            key={index}
            className="group relative bg-white overflow-hidden"
            href={ROUTE.SHOPPING_PRODUCT_DETAIL(item.id)}
          >
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              
              {/* Stock Status - attrangs 스타일 */}
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
    );
  }

  // 나머지 타입은 기존 슬라이더 유지
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

  // 초기 렌더링 시 중간 위치로 스크롤
  useEffect(() => {
    if (!products?.length || !scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    // 모바일에서는 첫 번째 아이템부터 시작
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      container.scrollLeft = 0;
      return;
    }
    
    const itemWidth = container.children[0]?.clientWidth || 280;
    const gap = 24;
    const totalWidth = products.length * (itemWidth + gap) - gap;
    const containerWidth = container.clientWidth;
    
    // 중간 위치로 스크롤하여 모든 상품이 보이도록
    if (totalWidth > containerWidth) {
      const scrollPosition = Math.max(0, (totalWidth - containerWidth) / 2);
      container.scrollLeft = scrollPosition;
    }
  }, [products]);

  useEffect(() => {
    if (!products?.length) return;

    const interval = setInterval(() => {
      if (isDragging) return; // 사용자가 드래그 중이면 자동 슬라이드 중단
      const container = scrollContainerRef.current;
      if (!container) return;

      const itemWidth = container.children[0]?.clientWidth || 0;
      // 모바일에서는 gap-3(12px), 데스크톱에서는 gap-6(24px)
      const gap = window.innerWidth < 768 ? 12 : 24;
      let nextIndex = currentIndex + 1;
      if (nextIndex >= products.length) nextIndex = 0;

      container.scrollTo({
        left: nextIndex * (itemWidth + gap),
        behavior: 'smooth',
      });
    }, 5000); // 5초마다

    return () => clearInterval(interval);
  }, [currentIndex, isDragging, products]);

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

  return (
    <div className="relative">
      <div className="max-w-[1440px] mx-auto">
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
            {products && products.length > 0 ? (
              products.map((item, index) => (
              <Link
                key={index}
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
                  
                  {/* Stock Status - attrangs 스타일 */}
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
              ))
            ) : (
              <div className="flex-shrink-0 w-full text-center py-12 text-gray-500">
                <p className="text-sm">추천 상품이 없습니다.</p>
              </div>
            )}
          </div>
          
          {/* Empty State or Loading */}
          {showEmptyMessage && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">로그인하고 퍼스널 컬러를 분석하면 나에게 맞는 상품을 추천해드립니다.</p>
            </div>
          )}
          {!products && !showEmptyMessage && <div className="h-80" />}
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
