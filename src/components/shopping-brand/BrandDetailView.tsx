"use client";

import { useGetProductListByBrand } from "@/serivces/product/query";
import { useGetBrand } from "@/serivces/brand/query";
import Image from "next/image";
import { ProductView } from "@/components/shopping/ProductView";
import { Pagination } from "@/components/common/Pagination";
import { formatDate } from "@/utils/date";
import { FaHeart, FaRegHeart, FaChevronUp, FaChevronDown, FaGlobe, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { BiStore } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { Brand } from "@/serivces/brand/type";
import { useState, useEffect } from "react";
import { useLikeBrand } from "@/hooks/brand/useLikeBrand";

interface BrandDetailViewProps {
  brandId: string;
}

export const BrandDetailView = ({ brandId }: BrandDetailViewProps) => {
  const { data, isLoading } = useGetProductListByBrand(brandId);
  const { data: brand, isLoading: isLoadingBrand } = useGetBrand(brandId);
  const { isLiked, handleLikeBrand } = useLikeBrand(brandId);
  const [sortOption, setSortOption] = useState("popular");
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const products = data?.products ?? [];
  const brandInfo = brand ?? (products.length > 0 ? products[0].brandInfo : null);
  const brandData = brandInfo as Brand;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButtons(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  if (isLoading || isLoadingBrand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!brandInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏬</div>
          <p className="text-xl text-gray-600">브랜드 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Brand Title */}
      <div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">브랜드관</h1>
        </div>
      </div>

      {/* Brand Hero Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-200/30">
        <div className="flex justify-between gap-8">
          {/* Left: Brand Info */}
          <div className="max-w-2xl">
            <div className="flex justify-between gap-4">
              {/* Brand Logo */}
              {brandInfo.logoUrl ? (
                <div className="relative w-[120px] h-[120px] bg-white border border-gray-200 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                  <Image
                    src={brandInfo.logoUrl}
                    alt={`${brandInfo.name} 로고`}
                    fill
                    className="object-contain p-4"
                    sizes="120px"
                  />
                </div>
              ) : (
                <div className="relative w-[120px] h-[120px] bg-white border border-gray-200 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">브랜드 로고</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleLikeBrand}
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                style={{
                  height: 'fit-content',
                }}
              >
                {isLiked ? (
                  <FaHeart className="text-red-500" size={20} />
                ) : (
                  <FaRegHeart className="text-gray-500" size={20} />
                )}
                <span className="text-sm font-medium text-gray-700">{brandData?.brandLikes.length}</span>
              </button>
            </div>

            <div className="h-10" />

            {/* Brand Name */}
            <div className="flex flex-col">
              <h2 className="text-4xl font-extrabold text-gray-900">
                {brandData.name}
              </h2>
              {brandData.engName && (
                <span className="text-lg font-medium text-gray-600 mt-1">
                  {brandData.engName}
                </span>
              )}
            </div>

            <div className="h-2" />
            
            {/* Brand Description */}
            {brandData.description && (
              <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg">
                {brandData.description}
              </p>
            )}

            <div className="h-10" />
            
            {/* Brand Info Icons */}
            {/* <div className="grid grid-cols-2 gap-4">              
              {brandData.createdAt && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BsCalendar3 size={16} className="text-gray-400" />
                  <span>Since {new Date(brandData.createdAt).getFullYear()}</span>
                </div>
              )}
            </div> */}
          </div>
          
          {/* Right: Brand Background Image */}
          <div className="relative w-[400px] h-[300px] bg-gray-100 rounded-lg overflow-hidden">
            {brandData.backgroundUrl ? (
              <Image
                src={brandData.backgroundUrl}
                alt={`${brandInfo.name} 배경 이미지`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">브랜드 이미지</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="border-t border-b border-gray-200 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-600">
                대표 상품
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product, index) => (
                <div key={'product-' + index} className="group">
                  <ProductView product={product} />
                </div>
              ))}
            </div>

            {data && data.lastPage > 1 && (
              <div className="flex justify-center pt-8">
                <Pagination lastPage={data.lastPage} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-xl text-gray-500">아직 등록된 상품이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">곧 새로운 컬렉션이 추가될 예정입니다.</p>
          </div>
        )}
      </div>
      
      {/* Floating Scroll Buttons */}
      {showScrollButtons && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
          <button
            onClick={scrollToTop}
            className="p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Scroll to top"
          >
            <FaChevronUp size={16} className="text-gray-600" />
          </button>
          <button
            onClick={scrollToBottom}
            className="p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Scroll to bottom"
          >
            <FaChevronDown size={16} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}; 