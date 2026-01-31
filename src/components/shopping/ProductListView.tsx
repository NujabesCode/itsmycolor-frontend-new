"use client";

import dynamic from 'next/dynamic';
import { useQueryString } from "@/hooks/common/useQueryString";
import { useGetProductList } from "@/serivces/product/query";
import { useEffect, useState } from "react";
import { ProductListItem } from "@/serivces/product/type";
import { IoGrid, IoList } from "react-icons/io5";

// dynamic import로 순환 참조 방지
const ProductView = dynamic(() => import("./ProductView").then(mod => ({ default: mod.ProductView })), { 
  ssr: false 
});

const ProductListItemView = dynamic(() => import("./ProductListItemView").then(mod => ({ default: mod.ProductListItemView })), { 
  ssr: false 
});

export const ProductListView = () => {
  const [page, setPage] = useState(1);
  const [hasError, setHasError] = useState(false);
  
  // React Hook은 항상 같은 순서로 호출되어야 하므로 try-catch로 감쌀 수 없음
  // 대신 에러 발생 시 fallback UI를 표시
  const { data: productsData, isLoading, error } = useGetProductList(page);

  const [prevProducts, setPrevProducts] = useState<ProductListItem[]>([]);
  const products = productsData?.products;
  const lastPage = productsData?.lastPage;

  const [colorSeasons] = useQueryString<string[]>("colorSeasons", []);
  const [styleCategories] = useQueryString<string[]>("styleCategories", []);
  const [bodyType] = useQueryString<string>("bodyType", "");
  const [sortBy, setSortBy] = useQueryString<string>("sort", "latest");

  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  // 에러 로깅 및 상태 관리
  useEffect(() => {
    if (error) {
      setHasError(true);
      console.error('[ProductListView] API 에러:', error);
      console.error('[ProductListView] 에러 상세:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });
      
      // Mixed Content 에러인 경우 특별 처리
      if (error instanceof Error && (
        error.message.includes('Mixed Content') ||
        error.message.includes('MixedContent') ||
        error.name === 'MixedContentError'
      )) {
        console.error('[ProductListView] Mixed Content 문제 감지: HTTPS에서 HTTP API 호출 불가');
      }
    } else {
      setHasError(false);
    }
  }, [error]);

  // 필터가 변경되면 페이지를 1로 리셋
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
      setPrevProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorSeasons, styleCategories, bodyType, sortBy]);

  // 새로운 상품 추가
  useEffect(() => {
    if (products && page === 1) {
      setPrevProducts(products);
    } else if (products && page > 1) {
      setPrevProducts([...prevProducts, ...products]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, page]);

  const displayProducts = prevProducts.length > 0 ? prevProducts : products || [];

  // 서버에서 정렬된 데이터를 받으므로 클라이언트 사이드 정렬은 필요 없음
  // 하지만 sortBy가 "price-low", "price-high", "name"인 경우는 클라이언트 사이드 정렬 필요
  const sortedProducts = [...displayProducts].sort((a, b) => {
    // 서버에서 정렬된 경우 (latest, sales 등)는 그대로 사용
    if (sortBy === "latest" || sortBy === "sales") {
      return 0; // 서버에서 이미 정렬됨
    }
    // 클라이언트 사이드 정렬이 필요한 경우
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // 데이터 로깅
  useEffect(() => {
    console.log('[ProductListView] 상태:', {
      productsData: productsData ? {
        productsCount: productsData.products?.length || 0,
        lastPage: productsData.lastPage,
        hasData: !!productsData,
      } : null,
      products: products?.length || 0,
      displayProducts: displayProducts?.length || 0,
      sortedProducts: sortedProducts?.length || 0,
      isLoading,
      error: error ? (error instanceof Error ? error.message : String(error)) : null,
      page,
      sortBy,
    });
    
    // 상품이 없을 때 경고
    if (!isLoading && !error && (!products || products.length === 0)) {
      console.warn('[ProductListView] 상품 데이터가 없습니다:', {
        productsData,
        products,
        displayProducts,
        sortedProducts,
      });
    }
  }, [productsData, products, isLoading, error, page, sortBy, displayProducts, sortedProducts]);

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setPage(1);
    setPrevProducts([]);
  }, [colorSeasons.length, styleCategories.length, bodyType]);

  // 필터 변경 시 스크롤 이동 (체형 또는 퍼스널 컬러)
  useEffect(() => {
    if (bodyType || colorSeasons.length > 0) {
      // 약간의 지연을 두어 필터가 렌더링된 후 스크롤
      setTimeout(() => {
        const productList = document.getElementById("product-list");
        if (productList) {
          productList.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [bodyType, colorSeasons.length]);

  // 무한 스크롤
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 700 &&
        page < (lastPage || 1)
      ) {
        setPage(page + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, lastPage]);

  return (
    <div id="product-list" className="w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            총 <span className="font-semibold text-gray-900">{displayProducts.length || 0}</span>개의 상품
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
              setPrevProducts([]);
            }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
          >
            <option value="latest">최신순</option>
            <option value="price-low">낮은 가격순</option>
            <option value="price-high">높은 가격순</option>
            <option value="name">이름순</option>
          </select>

          {/* View Type Toggle - Desktop Only */}
          <div className="hidden md:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewType("grid")}
              className={`p-1.5 rounded ${
                viewType === "grid" ? "bg-gray-900 text-white" : "text-gray-400"
              }`}
            >
              <IoGrid size={18} />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-1.5 rounded ${
                viewType === "list" ? "bg-gray-900 text-white" : "text-gray-400"
              }`}
            >
              <IoList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 에러 표시 */}
      {(error || hasError) && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              상품을 불러오는 중 오류가 발생했습니다
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {error instanceof Error && (
                error.message.includes('Mixed Content') || 
                error.message.includes('MixedContent') ||
                error.name === 'MixedContentError'
              ) ? (
                <>
                  HTTPS 사이트에서 HTTP API를 호출할 수 없습니다.<br />
                  네트워크 연결을 확인해주세요.
                </>
              ) : (
                '페이지를 새로고침하거나 잠시 후 다시 시도해주세요.'
              )}
            </p>
            <button
              onClick={() => {
                setHasError(false);
                window.location.reload();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              페이지 새로고침
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left max-w-2xl mx-auto bg-gray-50 p-4 rounded">
                <summary className="cursor-pointer text-sm text-gray-600">에러 상세 정보</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {!error && isLoading && page === 1 ? (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
              <div className="space-y-1.5">
                <div className="h-2.5 bg-gray-200 animate-pulse rounded w-1/2" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !error && !isLoading && sortedProducts && sortedProducts.length > 0 ? (
        <div
          className={
            viewType === "grid"
              ? "grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6"
              : "space-y-4"
          }
        >
          {sortedProducts.map((product) => (
            viewType === "grid" ? (
              <ProductView key={product.id} product={product} />
            ) : (
              <ProductListItemView key={product.id} product={product} />
            )
          ))}
        </div>
      ) : !error && !isLoading ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">
            {sortedProducts && sortedProducts.length === 0 
              ? "조건에 맞는 상품이 없습니다" 
              : "상품 데이터를 불러올 수 없습니다"}
          </p>
          <p className="text-gray-400 text-sm mb-4">다른 필터를 선택해보세요</p>
          <details className="text-left max-w-2xl mx-auto bg-gray-50 p-4 rounded">
            <summary className="cursor-pointer text-sm text-gray-600">디버그 정보</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify({
                productsData,
                products: products?.length || 0,
                sortedProducts: sortedProducts?.length || 0,
                displayProducts: displayProducts?.length || 0,
                isLoading,
                error: error ? (error instanceof Error ? error.message : String(error)) : null,
              }, null, 2)}
            </pre>
          </details>
        </div>
      ) : null}

      {/* Loading indicator for infinite scroll */}
      {isLoading && page > 1 && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};