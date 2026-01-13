"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTE } from "@/configs/constant/route";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const banners = [
  {
    id: 1,
    image: "/main/banner-collmute.png",
    mobileImage: "/main/banner-collmute.png", // 모바일용 이미지 (없으면 image 사용)
    title: "personal color",
    subtitle: "COOLMUTE - 나만의 퍼스널컬러 맞춤",
    link: ROUTE.SHOPPING,
    buttonText: "를 뮤트펀",
    gradient: "from-purple-700 to-purple-900",
  },
  {
    id: 2,
    image: "/main/banner-collmute.png",
    mobileImage: "/main/banner-collmute.png",
    title: "personal color",
    subtitle: "COOLMUTE - 나만의 퍼스널컬러 맞춤",
    link: ROUTE.SHOPPING,
    buttonText: "를 뮤트펀",
    gradient: "from-purple-700 to-purple-900",
  },
  {
    id: 3,
    image: "/main/banner-collmute.png",
    mobileImage: "/main/banner-collmute.png",
    title: "personal color",
    subtitle: "COOLMUTE - 나만의 퍼스널컬러 맞춤",
    link: ROUTE.SHOPPING,
    buttonText: "를 뮤트펀",
    gradient: "from-purple-700 to-purple-900",
  },
];

export const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // 5초마다 자동 슬라이드
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // 수동 조작 후에도 자동 재생 계속
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    // 수동 조작 후에도 자동 재생 계속
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    // 수동 조작 후에도 자동 재생 계속
  };

  // attrangs 스타일 배너 - 모바일/데스크톱 반응형
  return (
    <div className="relative h-[400px] md:h-[700px] overflow-hidden bg-white group w-full" style={{ 
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    }}>
      {/* Banner Images */}
      <div className="relative w-full h-full" style={{
        imageRendering: '-webkit-optimize-contrast',
        imageRendering: 'crisp-edges',
        transform: 'translateZ(0)',
      }}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* 배경 이미지 또는 그라데이션 */}
            {banner.image ? (
              <>
                {/* 모바일용 이미지 */}
                <Image
                  src={banner.mobileImage || banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover md:hidden"
                  style={{
                    imageRendering: 'high-quality',
                    imageRendering: '-webkit-optimize-contrast',
                  } as React.CSSProperties}
                  priority={index === 0}
                  quality={100}
                  sizes="100vw"
                  unoptimized={true}
                />
                {/* 데스크톱용 이미지 */}
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="hidden md:block object-cover"
                  style={{
                    imageRendering: 'high-quality',
                    imageRendering: '-webkit-optimize-contrast',
                  } as React.CSSProperties}
                  priority={index === 0}
                  quality={100}
                  sizes="100vw"
                  unoptimized={true}
                />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient || "from-gray-800 to-gray-900"}`} />
            )}
            {/* 오버레이 그라데이션 제거 - 원본 이미지 밝기 유지 */}
          </div>
        ))}
      </div>

      {/* Content Overlay - attrangs 스타일 (좌측 정렬, 작은 폰트) */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 w-full">
          <div className="max-w-md text-white" style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
            transform: 'translateZ(0)',
          }}>
            <h1 className="text-lg md:text-xl font-normal mb-1.5 leading-tight" style={{ 
              fontSize: '18px', 
              lineHeight: '1.4',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }}>
              {banners[currentIndex].title}
            </h1>
            <p className="text-xs md:text-sm mb-3.5" style={{ 
              fontSize: '13px', 
              color: 'rgba(255,255,255,0.9)',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }}>
              {banners[currentIndex].subtitle}
            </p>
            <Link
              href={banners[currentIndex].link}
              className="inline-flex items-center gap-1 bg-black text-white px-3 py-1.5 text-xs hover:bg-gray-800 transition-all"
              style={{ fontSize: '12px' }}
            >
              {banners[currentIndex].buttonText}
              <span className="text-xs">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - attrangs 스타일 (작고 미니멀) */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-black p-1.5 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
        aria-label="이전 배너"
      >
        <IoIosArrowBack size={16} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-black p-1.5 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
        aria-label="다음 배너"
      >
        <IoIosArrowForward size={16} />
      </button>

      {/* Dots Indicator - attrangs 스타일 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all ${
              index === currentIndex
                ? "w-6 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`배너 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

