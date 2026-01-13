'use client';

import { ROUTE } from '@/configs/constant/route';
import { useQueryString } from '@/hooks/common/useQueryString';
import { useGetProductListMyType } from '@/serivces/product/query';
import { BodyType } from '@/serivces/user/type';
import Image from 'next/image';
import Link from 'next/link';
import { IoCheckmarkCircle, IoCloseCircle, IoSparkles, IoShirt, IoColorPalette, IoHeart, IoArrowForward } from 'react-icons/io5';

const BODYTYPE_TO_ENGLISH = {
  스트레이트: 'Straight',
  웨이브: 'Wave',
  내추럴: 'Natural',
} as const;

type EnglishBodyType = (typeof BODYTYPE_TO_ENGLISH)[keyof typeof BODYTYPE_TO_ENGLISH];

// 각 체형별 스타일 가이드 데이터
const STYLE_GUIDE_DATA: Record<
  EnglishBodyType,
  {
    description: string;
    recommended: string[];
    notRecommended: string[];
    colors: string[];
    icon: string;
    gradient: string;
  }
> = {
  Straight: {
    description:
      'Straight 체형에게는 구조적이고 깔끔한 실루엣의 의류가 가장 잘 어울립니다. 직선적인 라인, 탄탄한 소재, 미니멀한 디자인이 세련되고 지적인 이미지를 더욱 돋보이게 합니다.',
    recommended: [
      '구조적인 재킷과 블레이저',
      '직선적인 라인의 원피스',
      '탄탄한 소재의 팬츠',
      '미니멀한 디자인의 셔츠',
      '깔끔한 실루엣의 코트',
    ],
    notRecommended: [
      '과도하게 여유로운 핏',
      '프릴이나 러플 장식',
      '너무 부드러운 소재',
      '복잡한 패턴이나 디테일',
      '과도한 레이어링',
    ],
    colors: ['블랙', '화이트', '네이비', '그레이', '딥 레드'],
    icon: '📐',
    gradient: 'from-pink-400 to-red-400',
  },
  Wave: {
    description:
      'Wave 체형에게는 부드럽고 곡선적인 실루엣의 의류가 가장 잘 어울립니다. 여성스러운 라인, 부드러운 소재, 로맨틱한 디테일이 우아하고 섬세한 이미지를 더욱 돋보이게 합니다.',
    recommended: [
      '부드러운 곡선의 블라우스',
      '웨이스트 라인을 강조하는 원피스',
      '슬림핏 팬츠와 스커트',
      '섬세한 디테일의 니트',
      '여성스러운 라인의 코트',
    ],
    notRecommended: [
      '너무 구조적인 재킷',
      '과도하게 직선적인 라인',
      '두꺼운 소재의 의류',
      '오버사이즈 핏',
      '남성적인 디자인',
    ],
    colors: ['파스텔 핑크', '라벤더', '스카이 블루', '크림', '피치'],
    icon: '〰️',
    gradient: 'from-yellow-400 to-orange-400',
  },
  Natural: {
    description:
      'Natural 체형에게는 편안하면서도 자연스러운 실루엣의 의류가 가장 잘 어울립니다. 구조적이지 않고 여유로운 핏, 자연스러운 텍스처의 원단, 심플한 디자인이 건강하고 안정적인 이미지를 더욱 돋보이게 합니다.',
    recommended: [
      '여유로운 핏의 셔츠',
      '자연스러운 텍스처의 니트',
      '편안한 실루엣의 팬츠',
      '캐주얼한 디자인의 아우터',
      '러프한 느낌의 데님',
    ],
    notRecommended: [
      '너무 타이트한 핏',
      '과도한 구조감',
      '인위적인 장식',
      '너무 정형화된 디자인',
      '과도하게 여성스러운 스타일',
    ],
    colors: ['베이지', '카키', '브라운', '올리브', '머스타드'],
    icon: '🌿',
    gradient: 'from-green-400 to-emerald-400',
  },
};

export const TypeGuide = ({ bodyType }: { bodyType?: BodyType }) => {
  const [isOpen] = useQueryString<boolean>('isOpen', false);

  const { data: productList } = useGetProductListMyType(bodyType);

  const englishBodyType = BODYTYPE_TO_ENGLISH[bodyType || '웨이브'] as EnglishBodyType;
  const styleData = STYLE_GUIDE_DATA[englishBodyType];

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn">
      {/* Header Section */}
      <div className={`bg-gradient-to-r ${styleData.gradient} rounded-2xl p-8 text-white mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{styleData.icon}</span>
              <h4 className="text-3xl font-bold">{englishBodyType} 스타일 가이드</h4>
            </div>
            <p className="text-white/90 text-lg max-w-3xl">
              {styleData.description}
            </p>
          </div>
          <IoSparkles className="text-white/20" size={120} />
        </div>
      </div>

      {/* Style Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recommended Items */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <IoCheckmarkCircle className="text-green-600" size={28} />
            </div>
            <h5 className="text-xl font-bold text-gray-900">추천 아이템</h5>
          </div>
          <ul className="space-y-3">
            {styleData.recommended.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IoCheckmarkCircle className="text-white" size={12} />
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not Recommended Items */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-red-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <IoCloseCircle className="text-red-600" size={28} />
            </div>
            <h5 className="text-xl font-bold text-gray-900">피해야 할 아이템</h5>
          </div>
          <ul className="space-y-3">
            {styleData.notRecommended.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IoCloseCircle className="text-white" size={12} />
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Colors */}
      <div className="bg-gradient-to-r from-pink-50 to-yellow-50 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <IoColorPalette className="text-pink-600" size={32} />
          <h5 className="text-xl font-bold text-gray-900">추천 컬러</h5>
        </div>
        <div className="flex flex-wrap gap-3">
          {styleData.colors.map((color, index) => (
            <div
              key={index}
              className="px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200"
            >
              <span className="font-medium text-gray-700">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Products */}
      {productList && productList.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h5 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <IoShirt className="text-pink-600" />
              {englishBodyType} 체형 맞춤 추천 상품
            </h5>
            <Link
              href={ROUTE.SHOPPING}
              className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
            >
              더 많은 상품 보기
              <IoArrowForward size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {productList.slice(0, 6).map((product) => (
              <Link
                key={'my-product' + product.id}
                href={ROUTE.SHOPPING_PRODUCT_DETAIL(product.id)}
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {product.imageUrl && (
                  <div className="relative h-64 bg-gray-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <IoHeart className="text-pink-500" size={20} />
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <h6 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h6>
                  <p className="text-sm text-gray-500 mb-2">{product.brandInfo?.name || product.brand}</p>
                  <p className="text-lg font-bold text-gray-900">{product.price.toLocaleString()}원</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center">
        <h5 className="text-2xl font-bold text-white mb-3">
          더 정확한 스타일 분석을 원하시나요?
        </h5>
        <p className="text-gray-300 mb-6">
          전문 컨설턴트가 직접 당신만의 스타일을 찾아드립니다
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://booking.naver.com/booking/6/bizes/703026"
            target="_blank"
            className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2"
          >
            오프라인 컨설팅 예약하기
            <IoArrowForward />
          </Link>
          <Link
            href={ROUTE.SHOPPING}
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
          >
            맞춤 쇼핑 시작하기
            <IoArrowForward />
          </Link>
        </div>
      </div>
    </div>
  );
};