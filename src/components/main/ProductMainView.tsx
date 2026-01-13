'use client';

import { ROUTE } from "@/configs/constant/route";
import { useGetMainProducts } from "@/serivces/product/query";
import { ColorSeason } from "@/serivces/color-analysis/type";
import { BodyType } from "@/serivces/user/type";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";

// ColorSeason / BodyType 값을 그대로 표시하기 위해 매핑을 제거합니다.
// BodyType 영어 라벨 매핑 (enum 값은 한글이므로 표시용으로 사용)
const BODY_TYPE_EN: Record<string, string> = {
  [BodyType.STRAIGHT]: "Straight",
  [BodyType.WAVE]: "Wave",
  [BodyType.NATURAL]: "Natural",
};

// 모바일(기본)용 Color Season 순서
const COLOR_SEASON_KEYS_MOBILE: string[] = [
  ColorSeason.SPRING_BRIGHT,
  ColorSeason.SPRING_LIGHT,
  ColorSeason.SUMMER_LIGHT,
  ColorSeason.SUMMER_MUTE,

  ColorSeason.AUTUMN_MUTE,
  ColorSeason.AUTUMN_DEEP,
  ColorSeason.WINTER_DARK,
  ColorSeason.WINTER_BRIGHT,
];

// PC(lg 이상)용 Color Season 순서 (4-4)
const COLOR_SEASON_KEYS_PC: string[] = [
  ColorSeason.SPRING_BRIGHT,
  ColorSeason.SPRING_LIGHT,
  ColorSeason.SUMMER_LIGHT,
  ColorSeason.SUMMER_MUTE,

  ColorSeason.AUTUMN_MUTE,
  ColorSeason.AUTUMN_DEEP,
  ColorSeason.WINTER_DARK,
  ColorSeason.WINTER_BRIGHT,
];

// Body Type 순서 (모바일/PC 동일)
const BODY_TYPE_KEYS: string[] = [
  BodyType.STRAIGHT,
  BodyType.WAVE,
  BodyType.NATURAL,
];

// 체형별 설명 텍스트
const BODY_TYPE_DESCRIPTIONS: Record<string, string> = {
  [BodyType.STRAIGHT]: '직선적인 실루엣, 어깨와 골반이 비슷한 너비, 상체 발달',
  [BodyType.WAVE]: '곡선적인 실루엣, 잘록한 허리, 여성스러운 분위기',
  [BodyType.NATURAL]: '뚜렷한 관절, 안정적인 비율, 건강한 이미지',
};

// 퍼스널 컬러 시즌별 설명 텍스트
const COLOR_SEASON_DESCRIPTIONS: Record<string, string> = {
  [ColorSeason.SPRING_BRIGHT]: '옐로우 베이스의 쨍하고 선명한 톤, 청탁이 가장 중요한 봄브라이트',
  [ColorSeason.SPRING_LIGHT]: '부드러운 파스텔 톤, 밝고 따뜻한 느낌의 봄라이트',
  [ColorSeason.SUMMER_LIGHT]: '맑고 투명한 파스텔 계열, 깨끗하고 밝은 여름라이트',
  [ColorSeason.SUMMER_MUTE]: '톤 다운된 뿌연 컬러, 차분하고 은은한 여름뮤트',
  [ColorSeason.AUTUMN_MUTE]: '밝고 소프트한 가을색, 내추럴하고 따뜻한 가을뮤트',
  [ColorSeason.AUTUMN_DEEP]: '깊고 무게감 있는 컬러, 세련되고 고급스러운 가을딥',
  [ColorSeason.WINTER_DARK]: '차분한 딥톤, 무게감 있고 차분한 겨울다크',
  [ColorSeason.WINTER_BRIGHT]: '쨍하고 선명한 원색, 또렷하고 존재감 있는 겨울브라이트',
};

export const ProductMainView = () => {
  const { data: mainProducts } = useGetMainProducts();
  const isPC = useMediaQuery("(min-width: 1024px)"); // Tailwind 'lg' breakpoint
  const router = useRouter();
  const pathname = usePathname();

  // 분리된 Key 배열
  const COLOR_KEYS = isPC ? COLOR_SEASON_KEYS_PC : COLOR_SEASON_KEYS_MOBILE;

  // 공통 렌더 함수
  const renderColorSeasonItem = (key: string) => {
    const product = mainProducts?.[key as keyof typeof mainProducts] ?? null;
    const imageSrc = product?.imageUrl;
    const label = key;
    const description = COLOR_SEASON_DESCRIPTIONS[key] || '';

    const linkHref = `${ROUTE.SHOPPING}?colorSeasons=${encodeURIComponent(
      JSON.stringify([key])
    )}`;

    // 같은 페이지에서 쿼리 파라미터만 변경할 때는 스크롤 방지
    const handleClick = (e: React.MouseEvent) => {
      if (pathname === ROUTE.SHOPPING) {
        e.preventDefault();
        router.push(linkHref, { scroll: false });
      }
    };

    return (
      <div key={key} className="space-y-2">
        <Link
          href={linkHref}
          onClick={handleClick}
          className="group relative overflow-hidden aspect-[3/4] bg-gray-100 block"
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={label}
              fill
              quality={100}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-sm">상품 준비중</span>
            </div>
          )}
          {/* 오버레이 - attrangs 스타일 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <h3 className="font-normal whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: '14px', lineHeight: '1.5', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)' }}>
              {label}
            </h3>
          </div>
        </Link>
        {/* 설명 텍스트 */}
        {description && (
          <div className="text-sm md:text-base text-gray-600 leading-relaxed px-1" style={{ fontSize: '14px', color: 'var(--season_color_04)', lineHeight: '1.5' }}>
            {description.includes(',') ? (
              <>
                <div className="font-bold mb-0.5">{description.split(',')[0]}</div>
                <div>{description.split(',').slice(1).join(',').trim()}</div>
              </>
            ) : (
              <div>{description}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Color Season Grid - attrangs 스타일 */}
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {COLOR_KEYS.map((key) => renderColorSeasonItem(key))}
        </div>
      </div>
    </div>
  );
};

// 체형별 추천 컴포넌트
export const BodyTypeView = () => {
  const { data: mainProducts } = useGetMainProducts();
  const router = useRouter();
  const pathname = usePathname();

  const BT_KEYS = BODY_TYPE_KEYS;

  const renderBodyTypeItem = (key: string) => {
    const product = mainProducts?.[key as keyof typeof mainProducts] ?? null;
    const imageSrc = product?.imageUrl;
    const label = BODY_TYPE_EN[key] ?? key;
    const description = BODY_TYPE_DESCRIPTIONS[key] || '';

    const linkHref = `${ROUTE.SHOPPING}?bodyType=${encodeURIComponent(key)}`;

    const handleClick = (e: React.MouseEvent) => {
      if (pathname === ROUTE.SHOPPING) {
        e.preventDefault();
        router.push(linkHref, { scroll: false });
      }
    };

    return (
      <div key={key} className="space-y-2">
        <Link
          href={linkHref}
          onClick={handleClick}
          className="group relative overflow-hidden aspect-[3/4] bg-gray-100 block"
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={label}
              fill
              quality={100}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-sm">상품 준비중</span>
            </div>
          )}
          {/* 오버레이 - attrangs 스타일 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
            <h3 className="font-normal whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: '15px', lineHeight: '1.5', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)' }}>
              {label}
            </h3>
          </div>
        </Link>
        {/* 설명 텍스트 */}
        {description && (
          <div className="text-sm md:text-base text-gray-600 leading-relaxed px-1" style={{ fontSize: '14px', color: 'var(--season_color_04)', lineHeight: '1.5' }}>
            {description.includes(',') ? (
              <>
                <div className="font-bold mb-0.5">{description.split(',')[0]}</div>
                <div>{description.split(',').slice(1).join(',').trim()}</div>
              </>
            ) : (
              <div>{description}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {BT_KEYS.map((key) => renderBodyTypeItem(key))}
      </div>
    </div>
  );
};