"use client";

import { useSellerProductFormStore } from "@/providers/SellerProductFormStoreProvider";
import { useEffect, useState } from "react";
import { ColorSeason } from "@/serivces/color-analysis/type";
import { StyleCategory, Gender } from "@/serivces/product/type";
import { ClothingCategory } from "@/serivces/product/clothing-category";
import { ROUTE } from "@/configs/constant/route";
import { useQueryString } from "@/hooks/common/useQueryString";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";

export const Step1 = ({ moveNext }: { moveNext: () => void }) => {
  const {
    name,
    recommendedColorSeason,
    styleCategories,
    clothingCategory,
    recommendedGender,
    setStep1,
    onSave,
    onUpdate,
  } = useSellerProductFormStore((state) => state);

  const queryClient = useQueryClient();

  const [tempName, setTempName] = useState(name);
  const [tempRecommendedColorSeason, setTempRecommendedColorSeason] = useState(
    recommendedColorSeason
  );
  const [tempStyleCategories, setTempStyleCategories] =
    useState(styleCategories);
  const [tempClothingCategory, setTempClothingCategory] = useState(clothingCategory);
  const [tempRecommendedGender, setTempRecommendedGender] = useState<Gender | null>(recommendedGender);

  const [productId] = useQueryString<string>("productId", "");
  const router = useRouter();

  useEffect(() => {
    setTempName(name);
    setTempRecommendedColorSeason(recommendedColorSeason);
    setTempStyleCategories(styleCategories);
    setTempClothingCategory(clothingCategory);
    setTempRecommendedGender(recommendedGender);
  }, [name, recommendedColorSeason, styleCategories, clothingCategory, recommendedGender]);

  const MAX_SELECTIONS = 5; // 최대 선택 가능 개수
  const MAX_COLOR_SELECTIONS = 4; // 퍼스널 컬러 최대 선택 가능 개수

  const handleStyleCategoryClick = (category: StyleCategory) => {
    setTempStyleCategories((prev) => {
      if (!prev) return [category];
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      if (prev.length >= MAX_SELECTIONS) {
        alert(`최대 ${MAX_SELECTIONS}개까지만 선택 가능합니다.`);
        return prev;
      }
      return [...prev, category];
    });
  };

  const handleColorSeasonClick = (color: ColorSeason) => {
    setTempRecommendedColorSeason((prev) => {
      if (!prev) return [color];
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      }
      if (prev.length >= MAX_COLOR_SELECTIONS) {
        alert(`최대 ${MAX_COLOR_SELECTIONS}개까지만 선택 가능합니다.`);
        return prev;
      }
      return [...prev, color];
    });
  };

  const handleSave = () => {
    setStep1({
      name: tempName,
      recommendedColorSeason: tempRecommendedColorSeason,
      styleCategories: tempStyleCategories,
      clothingCategory: tempClothingCategory,
      recommendedGender: tempRecommendedGender,
    });

    onSave();

    alert("임시 저장되었습니다.");
  };

  const handleNext = () => {
    if (!tempName) return alert("상품명을 입력해주세요.");

    setStep1({
      name: tempName,
      recommendedColorSeason: tempRecommendedColorSeason,
      styleCategories: tempStyleCategories,
      clothingCategory: tempClothingCategory,
      recommendedGender: tempRecommendedGender,
    });

    moveNext();
  };

  const handleComplete = async () => {
    if (!productId) return;
    if (!tempName) return alert("상품명을 입력해주세요.");

    setStep1({
      name: tempName,
      recommendedColorSeason: tempRecommendedColorSeason,
      styleCategories: tempStyleCategories,
      clothingCategory: tempClothingCategory,
      recommendedGender: tempRecommendedGender,
    });

    try {
      await onUpdate(productId);
      await queryClient.invalidateQueries({ queryKey: [QUERY.PRODUCT_LIST_BY_BRAND] });
      alert("상품 수정이 완료되었습니다.");
      router.replace(ROUTE.SELLER_PRODUCT);
    } catch (e) {
      console.error(e);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      {/* 상품 기본정보 폼 */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">상품 기본정보</h2>
        <div className="space-y-8">
          {/* 상품명 */}
          <div>
            <label
              className="block text-base font-medium mb-2"
              htmlFor="productName"
            >
              상품명 <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              type="text"
              value={tempName || ""}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="상품명을 입력하세요"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* 퍼스널 컬러 */}
          <div>
            <label className="block text-base font-medium mb-2">
              적합한 퍼스널 컬러
            </label>
            <p className="text-gray-600 text-sm mb-3">
              상품에 적합한 퍼스널 컬러를 선택해주세요. (최대{" "}
              {MAX_COLOR_SELECTIONS}개 선택 가능)
              {tempRecommendedColorSeason &&
                tempRecommendedColorSeason.length > 0 && (
                  <span className="ml-2 text-gray-900 font-medium">
                    {tempRecommendedColorSeason.length}개 선택됨
                  </span>
                )}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(ColorSeason).map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => handleColorSeasonClick(color)}
                  className={`border rounded px-3 py-2 text-sm transition-colors focus:outline-none ${
                    tempRecommendedColorSeason?.includes(color)
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* 추천 성별 */}
          <div>
            <label className="block text-base font-medium mb-2">
              추천 성별 <span className="text-red-500">*</span>
            </label>
            <p className="text-gray-600 text-sm mb-3">
              상품에 적합한 성별을 선택해주세요.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(Gender).map((gender) => (
                <button
                  type="button"
                  key={gender}
                  onClick={() => setTempRecommendedGender(tempRecommendedGender === gender ? null : gender)}
                  className={`border rounded px-3 py-2 text-sm transition-colors focus:outline-none ${
                    tempRecommendedGender === gender
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* 의류 카테고리 */}
          <div>
            <label className="block text-base font-medium mb-2">
              의류 카테고리
            </label>
            <p className="text-gray-600 text-sm mb-3">
              상품의 의류 카테고리를 선택해주세요.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(ClothingCategory).map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => setTempClothingCategory(tempClothingCategory === category ? null : category)}
                  className={`border rounded px-3 py-2 text-sm transition-colors focus:outline-none ${
                    tempClothingCategory === category
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 스타일 키워드 */}
          <div>
            <label className="block text-base font-medium mb-2">
              스타일 키워드
            </label>
            <p className="text-gray-600 text-sm mb-3">
              상품에 적합한 스타일 키워드를 선택해주세요. (최대 {MAX_SELECTIONS}
              개 선택 가능)
              {tempStyleCategories && tempStyleCategories.length > 0 && (
                <span className="ml-2 text-gray-900 font-medium">
                  {tempStyleCategories.length}개 선택됨
                </span>
              )}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(StyleCategory).map((keyword) => (
                <button
                  type="button"
                  key={keyword}
                  onClick={() => handleStyleCategoryClick(keyword)}
                  className={`border rounded px-3 py-2 text-sm transition-colors focus:outline-none ${
                    tempStyleCategories?.includes(keyword)
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2 mt-8">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={handleSave}
            >
              임시 저장
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              onClick={handleNext}
            >
              다음
            </button>
            {productId && (
              <button
                type="button"
                className="px-6 py-2 rounded bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
                onClick={handleComplete}
              >
                완료
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
