"use client";

import Link from "next/link";
import Image from "next/image";
import { useQueries } from "@tanstack/react-query";
import { productApi } from "@/serivces/product/request";
import { ColorSeason } from "@/serivces/color-analysis/type";
import { BodyType } from "@/serivces/user/type";
import { ROUTE } from "@/configs/constant/route";
import { useGetUser } from "@/serivces/user/query";

interface CategoryConfig {
  /** unique key for React Query */
  key: string;
  title: string;
  subtitle: string;
  link: string;
  /** Fallback static image path stored in /public */
  fallbackImage: string;
  /** Filter params for product list API. Undefined if no dynamic image needed */
  queryParams?: {
    colorSeasons?: ColorSeason[];
    bodyType?: BodyType;
  };
}

const categories: CategoryConfig[] = [
  {
    key: "warm-tone",
    title: "WARM TONE",
    subtitle: "Spring & Autumn",
    link: `${ROUTE.SHOPPING}?colorSeasons=${encodeURIComponent(JSON.stringify([ColorSeason.SPRING_BRIGHT, ColorSeason.SPRING_LIGHT, ColorSeason.AUTUMN_DEEP, ColorSeason.AUTUMN_MUTE]))}`,
    fallbackImage: "/main/new-service1.png",
    queryParams: {
      colorSeasons: [ColorSeason.SPRING_BRIGHT, ColorSeason.SPRING_LIGHT, ColorSeason.AUTUMN_DEEP, ColorSeason.AUTUMN_MUTE],
    },
  },
  {
    key: "cool-tone",
    title: "COOL TONE",
    subtitle: "Summer & Winter",
    link: `${ROUTE.SHOPPING}?colorSeasons=${encodeURIComponent(JSON.stringify([ColorSeason.SUMMER_LIGHT, ColorSeason.SUMMER_MUTE, ColorSeason.WINTER_BRIGHT, ColorSeason.WINTER_DARK]))}`,
    fallbackImage: "/main/new-service2.png",
    queryParams: {
      colorSeasons: [ColorSeason.SUMMER_LIGHT, ColorSeason.SUMMER_MUTE, ColorSeason.WINTER_BRIGHT, ColorSeason.WINTER_DARK],
    },
  },
  {
    key: "body-type",
    title: "BODY TYPE",
    subtitle: "Find Your Fit",
    link: ROUTE.SHOPPING,
    fallbackImage: "/main/new-service3.png",
    queryParams: {
      bodyType: BodyType.STRAIGHT,
    },
  },
  {
    key: "consulting",
    title: "CONSULTING",
    subtitle: "Professional Service",
    link: "https://booking.naver.com/booking/6/bizes/703026",
    fallbackImage: "/main/consulting.png",
  },
];

export const CategoryGrid = () => {
  const [, { data: colorAnalysis }] = useGetUser();
  const bodyType = colorAnalysis?.bodyType;

  // Fetch one product for categories that have queryParams defined
  const queries = useQueries({
    queries: categories.map((cat, i) => ({
      queryKey: ["category-thumbnail", cat.key],
      // If no queryParams, skip the request
      enabled: !!cat.queryParams,
      queryFn: async () => {
        if (i === 0) {
          const res = await productApi.getProductList({
            page: 1,
            limit: 1,
            colorSeasons: [ColorSeason.SPRING_BRIGHT, ColorSeason.SPRING_LIGHT, ColorSeason.AUTUMN_DEEP, ColorSeason.AUTUMN_MUTE],
          });
          return res.products?.[0];
        } else if (i === 1) {
          const res = await productApi.getProductList({
            page: 1,
            limit: 1,
            colorSeasons: [ColorSeason.SUMMER_LIGHT, ColorSeason.SUMMER_MUTE, ColorSeason.WINTER_BRIGHT, ColorSeason.WINTER_DARK],
          });
          return res.products?.[0];
        } else if (i === 2) {
          const res = await productApi.getProductList({
            page: 1,
            limit: 1,
            bodyType: bodyType ?? BodyType.STRAIGHT,
          });
          return res.products?.[0];
        }

        return undefined;
      },
      staleTime: 5 * 60 * 1000, // cache for 5 minutes
    })),
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {categories.map((category, idx) => {
        // Obtain product image from corresponding query result if available
        const product = queries[idx]?.data as
          | { imageUrl: string }
          | undefined;
        const imageSrc = product?.imageUrl ?? category.fallbackImage;

        return (
          <div key={category.key} className="group relative overflow-hidden aspect-square">
            <Link
              href={(idx === 2 && bodyType) ? category.link + `?bodyType=${bodyType}` : category.link}
              className="block w-full h-full relative"
            >
              <Image
                src={imageSrc}
                alt={category.title}
                fill
                quality={100}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* 그라데이션 오버레이 - attrangs 스타일 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* 텍스트 오버레이 - attrangs 스타일 (하단 정렬) */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white z-10">
                <h3 className="font-normal mb-0.5" style={{ fontSize: '13px', lineHeight: '1.5' }}>{category.title}</h3>
                <p className="opacity-90" style={{ fontSize: '11px', lineHeight: '1.5' }}>{category.subtitle}</p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}; 