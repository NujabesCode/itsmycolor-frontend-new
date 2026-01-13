'use client';

import { ColorSeason } from '@/serivces/color-analysis/type';
import { useEffect } from 'react';
import { useGetFitProductList } from '@/serivces/product/query';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTE } from '@/configs/constant/route';
import { useGetUser } from '@/serivces/user/query';
import { colorAnalysisApi } from '@/serivces/color-analysis/request';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY } from '@/configs/constant/query';

interface Props {
  result: ColorSeason;
  gender: 0 | 1 | null;
}

export default function ResultCard({ result, gender }: Props) {
  const queryClient = useQueryClient();
  const [{ data: user }, { data: colorAnalysis }] = useGetUser();
  
  // 추천 상품 리스트
  const { data: productsData } = useGetFitProductList(undefined, result);
  const products = productsData?.products ?? [];

  // 결과를 데이터베이스에 저장
  useEffect(() => {
    const saveResult = async () => {
      if (!user || !result) return;
      
      try {
        if (colorAnalysis) {
          // 기존 colorAnalysis가 있으면 업데이트
          await colorAnalysisApi.updateColorAnalysis(
            colorAnalysis.id,
            undefined,
            undefined,
            undefined,
            result
          );
        } else {
          // colorAnalysis가 없으면 생성 (height, weight는 기본값 사용)
          await colorAnalysisApi.createColorAnalysis(
            user.id,
            170, // 기본 키
            60,  // 기본 몸무게
            null,
            result
          );
        }
        
        // 쿼리 무효화하여 최신 데이터 가져오기
        await queryClient.invalidateQueries({
          queryKey: [QUERY.COLOR_ANALYSIS],
        });
        
        console.log('퍼스널 컬러 결과 저장 완료:', result);
      } catch (error) {
        console.error('퍼스널 컬러 결과 저장 실패:', error);
      }
    };

    saveResult();
  }, [result, user, colorAnalysis, queryClient]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  /* ----------------- 이미지 폴더 매핑 ----------------- */
  const seasonFolderMap: Record<ColorSeason, string> = {
    [ColorSeason.SPRING_BRIGHT]: 'spring-bright',
    [ColorSeason.SPRING_LIGHT]: 'spring-light',
    [ColorSeason.SUMMER_LIGHT]: 'summer-light',
    [ColorSeason.SUMMER_MUTE]: 'summer-mute',
    [ColorSeason.AUTUMN_MUTE]: 'autumn-mute',
    [ColorSeason.AUTUMN_DEEP]: 'autumn-deep',
    [ColorSeason.WINTER_DARK]: 'winter-dark',
    [ColorSeason.WINTER_BRIGHT]: 'winter-bright',
  };

  // gender가 아직 결정되지 않았으면 이미지 표시하지 않음
  if (gender === null) {
    return null;
  }

  const genderFolder = gender === 0 ? 'man' : 'woman';
  const seasonFolder = seasonFolderMap[result];

  return (
    <div className="mt-12 bg-white py-8 px-2 lg:px-8 rounded-3xl shadow-xl text-center">
      <h3 className="text-2xl font-bold mb-4 text-rose-600">당신의 퍼스널 컬러는?</h3>
      <p className="text-3xl font-extrabold text-gray-800 mb-2">{result}일 가능성이 높습니다</p>

      <div className="h-[50px]" />

      <div className="max-w-[800px] mx-auto flex flex-col items-center gap-20 mb-4">
        {[1, 2, 3].map((num) => (
          <img
            key={num}
            src={`/color-test/${genderFolder}/${seasonFolder}/${num}.png`}
            alt={`퍼스널 컬러 추천 ${num}`}
            className="w-full h-auto rounded-lg"
          />
        ))}
      </div>

      {products.length > 0 && (
        <div className="pt-8">
          <h4 className="text-xl font-bold text-gray-800 mb-6">추천 상품</h4>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product) => (
              <Link
                key={product.id}
                href={ROUTE.SHOPPING_PRODUCT_DETAIL(product.id)}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-3">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}

                  {/* Sold Out Badge */}
                  {(!product.isAvailable || product.stockQuantity < 1) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">품절</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {/* Brand */}
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>

                  {/* Product Name */}
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-gray-700">{product.name}</h3>

                  {/* Price */}
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">₩{product.price.toLocaleString()} (${product.usdPrice.toLocaleString()})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {products.length > 8 && (
            <div className="text-center mt-8">
              <Link
                href={`${ROUTE.SHOPPING}?colorSeasons=${encodeURIComponent(result)}`}
                className="px-6 py-3 border border-gray-800 text-gray-800 rounded-full font-medium hover:bg-gray-800 hover:text-white transition-colors"
              >
                더 많은 상품 보기
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 