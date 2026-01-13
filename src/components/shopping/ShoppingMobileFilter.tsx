'use client';

import { useQueryString } from '@/hooks/common/useQueryString';
import { ColorSeason } from '../../serivces/color-analysis/type';
import { StyleCategory } from '../../serivces/product/type';
import { ClothingCategory } from '../../serivces/product/clothing-category';
import { BodyType } from '../../serivces/user/type';
import { useGetUser } from '@/serivces/user/query';
import { useState } from 'react';
import {
  IoFilter,
  IoColorPalette,
  IoBody,
  IoShirt,
  IoSparkles,
  IoClose,
} from 'react-icons/io5';

// UI-020~029: 검색어를 카테고리로 매핑
const SEARCH_TO_CATEGORY_MAP: Record<string, string> = {
  '원피스': '원피스',
  '블라우스': '블라우스',
  '아우터': '아우터',
  '니트': '니트',
  '티셔츠': '티셔츠',
  '스커트': '스커트',
  '팬츠': '팬츠',
  '상의': '상의',
  '하의': '하의',
  '의류': '의류',
};

export const ShoppingMobileFilter = () => {
  const [, { data: colorAnalysis }] = useGetUser();
  const [isLoading, setLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // 퍼스널 컬러 다중 선택을 위한 string[] 상태
  const [colorSeasons, setColorSeasons] = useQueryString<string[]>(
    'colorSeasons',
    []
  );
  const [styleCategories, setStyleCategories] = useQueryString<string[]>(
    'styleCategories',
    []
  );
  const [bodyType, setBodyType] = useQueryString<string>('bodyType', '');
  const [search, setSearch] = useQueryString<string>('search', '');
  const [clothingCategory, setClothingCategory] = useQueryString<string>('clothingCategory', '');

  const onShowFitProduct = async () => {
    if (!colorAnalysis) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    const ownColorSeason = colorAnalysis.colorSeason;
    const ownBodyType = colorAnalysis.bodyType;

    const tempParam = setColorSeasons(ownColorSeason ? [ownColorSeason] : []);
    const tempParam2 = setBodyType(ownBodyType ?? '', tempParam);
    setStyleCategories(styleCategories, tempParam2);

    const productList = document.getElementById('product-list');
    if (productList) {
      productList.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearAllFilters = () => {
    const tempParam = setColorSeasons([]);
    const tempParam2 = setBodyType('', tempParam);
    const tempParam3 = setStyleCategories([], tempParam2);
    const tempParam4 = setSearch('', tempParam3);
    setClothingCategory('', tempParam4);
  };

  const clearSearch = () => {
    setSearch('');
  };

  const activeFiltersCount =
    colorSeasons.length + styleCategories.length + (bodyType ? 1 : 0) + (search ? 1 : 0) + (clothingCategory ? 1 : 0);

  // UI-020~029: 검색어가 카테고리인 경우 표시
  const currentCategory = search && SEARCH_TO_CATEGORY_MAP[search] ? search : null;

  const FilterContent = () => (
    <>
      {/* Filter Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <IoFilter size={20} />
          필터
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            모두 지우기
          </button>
        )}
      </div>

      {/* Personal Color Section */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IoColorPalette size={18} />
          퍼스널 컬러
        </h4>
        <div className="space-y-2">
          {Object.values(ColorSeason).map((season) => (
            <label
              key={season}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={season}
                checked={colorSeasons.includes(season)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setColorSeasons([...colorSeasons, season]);
                  } else {
                    setColorSeasons(colorSeasons.filter((s) => s !== season));
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {season}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Body Type Section */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IoBody size={18} />
          체형
        </h4>
        <div className="space-y-2">
          {Object.values(BodyType).map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="bodyType"
                value={type}
                checked={bodyType === type}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 의류 카테고리 Section */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IoShirt size={18} />
          의류
        </h4>
        <div className="space-y-2">
          {Object.values(ClothingCategory).map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="clothingCategory"
                value={category}
                checked={clothingCategory === category}
                onChange={(e) => setClothingCategory(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {category}
              </span>
            </label>
          ))}
        </div>
        {clothingCategory && (
          <button
            onClick={() => setClothingCategory('')}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700"
          >
            의류 필터 제거
          </button>
        )}
      </div>

      {/* UI-020~029: 현재 선택된 카테고리 표시 */}
      {currentCategory && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IoShirt size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                현재 카테고리: {currentCategory}
              </span>
            </div>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="카테고리 필터 제거"
            >
              <IoClose size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Style Category Section */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IoShirt size={18} />
          스타일
        </h4>
        <div className="space-y-2">
          {Object.values(StyleCategory).map((style) => (
            <label
              key={style}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={style}
                checked={styleCategories.includes(style)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setStyleCategories([...styleCategories, style]);
                  } else {
                    setStyleCategories(
                      styleCategories.filter((s) => s !== style)
                    );
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {style}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* My Fit Button */}
      {colorAnalysis && (
        <div className="border-t pt-6">
          <button
            onClick={onShowFitProduct}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <IoSparkles size={18} />
            나에게 맞는 제품 보기
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            내 프로필 기반 추천
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="flex items-center gap-2">
            <IoFilter size={18} />
            필터 및 정렬
          </span>
          {activeFiltersCount > 0 && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileFilter(false)}
          />

          {/* Filter Drawer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">필터</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              {/* Handle bar */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Filter Content */}
            <div className="p-6">
              <FilterContent />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {activeFiltersCount > 0
                  ? `${activeFiltersCount}개 필터 적용하기`
                  : '닫기'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-700">
              맞춤 제품을 찾고 있습니다...
            </p>
          </div>
        </div>
      )}
    </>
  );
};
