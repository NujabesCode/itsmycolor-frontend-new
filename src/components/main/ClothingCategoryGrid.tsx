"use client";

import Link from "next/link";
import { ROUTE } from "@/configs/constant/route";
import { ClothingCategory } from "@/serivces/product/clothing-category";

const clothingCategories = [
  ClothingCategory.DRESS,      // 원피스
  ClothingCategory.BLOUSE,     // 블라우스
  ClothingCategory.OUTER,      // 아우터
  ClothingCategory.KNIT,       // 니트
  ClothingCategory.T_SHIRT,    // 티셔츠
  ClothingCategory.SHORT_SLEEVE, // 반팔
  ClothingCategory.SKIRT,      // 스커트
  ClothingCategory.PANTS,      // 팬츠
  ClothingCategory.SHIRT,      // 셔츠
  ClothingCategory.CARDIGAN,   // 가디건
  ClothingCategory.HOODIE,     // 후드
  ClothingCategory.SWEATSHIRT, // 맨투맨
  ClothingCategory.JEANS,      // 청바지
  ClothingCategory.SHORTS,     // 반바지
];

export const ClothingCategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
      {clothingCategories.map((category) => (
        <Link
          key={category}
          href={`${ROUTE.SHOPPING}?clothingCategory=${encodeURIComponent(category)}`}
          className="group bg-white border border-gray-200 hover:border-gray-400 px-4 py-3 text-center transition-colors rounded"
          style={{ borderColor: 'var(--season_color_08)' }}
        >
          <span className="text-xs md:text-sm font-normal text-gray-900 group-hover:text-gray-700" style={{ color: 'var(--season_color_01)' }}>
            {category}
          </span>
        </Link>
      ))}
    </div>
  );
};
