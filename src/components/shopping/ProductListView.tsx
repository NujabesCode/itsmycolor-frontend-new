"use client";

import { useQueryString } from "@/hooks/common/useQueryString";
import { useGetProductList } from "@/serivces/product/query";
import { useEffect, useState } from "react";
import { ProductView } from "./ProductView";
import { ProductListItemView } from "./ProductListItemView";
import { ProductListItem } from "@/serivces/product/type";
import { IoGrid, IoList } from "react-icons/io5";

export const ProductListView = () => {
  const [page, setPage] = useState(1);
  const { data: productsData, isLoading } = useGetProductList(page);

  const [prevProducts, setPrevProducts] = useState<ProductListItem[]>([]);
  const products = productsData?.products;
  const lastPage = productsData?.lastPage;

  const [colorSeasons] = useQueryString<string[]>("colorSeasons", []);
  const [styleCategories] = useQueryString<string[]>("styleCategories", []);
  const [bodyType] = useQueryString<string>("bodyType", "");

  const [sortBy, setSortBy] = useState("latest");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

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

  // Sort products
  const sortedProducts = [...displayProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default: // latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

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
            onChange={(e) => setSortBy(e.target.value)}
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

      {/* Products Grid/List */}
      {isLoading && page === 1 ? (
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
      ) : sortedProducts.length > 0 ? (
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
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">조건에 맞는 상품이 없습니다</p>
          <p className="text-gray-400 text-sm">다른 필터를 선택해보세요</p>
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {isLoading && page > 1 && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};