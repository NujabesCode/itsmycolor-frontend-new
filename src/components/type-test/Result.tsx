'use client';

import Image from 'next/image';
import { BodyType } from '@/serivces/user/type';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/configs/constant/route';
import { useState } from 'react';
import { useGetProductListMyType } from '@/serivces/product/query';
import Link from 'next/link';

// 스트레이트 타입 특징
const STRAIGHT_TYPE_FEMALE = [
  '바디감이 두께감이 있다.',
  '근육의 탄력이 느껴진다.',
  '바디의 중심이 윗 중심이다.',
];
const STRAIGHT_TYPE_MALE = [
  '바디감이 두께감이 있다.',
  '탄력 있는 피부 질감이다.',
  '바디의 중심이 윗 중심이다.',
];

// 웨이브 타입 특징
const WAVE_TYPE_FEMALE = [
  '바디감이 가냘프다.',
  '부드러운 피부 질감이다.',
  '바디의 중심이 아랫 중심이다.',
];
const WAVE_TYPE_MALE = [
  '바디감이 날씬하고 마른 체형이 많다.',
  '부드러운 피부 질감이다.',
  '바디의 중심이 아랫 중심이다.',
];

// 내추럴 타입 특징
const NATURAL_TYPE_FEMALE = [
  '뼈, 관절이 크다.',
  '바디 프레임이 확실하다.',
  '육감적이지 않다.',
];
const NATURAL_TYPE_MALE = [
  '뼈, 관절이 크다.',
  '바디 프레임이 확실하다.',
  '딱 벌어진 골격',
];

// 스타일 태그
const STRAIGHT_STYLE_TAGS = [
  '지적인',
  '세련된',
  '깔끔한',
  '베이직',
  '심플',
  '품위있는',
  '고저스',
  '저스트핏',
];
const WAVE_STYLE_TAGS = [
  '소프트한',
  '슬림한',
  '로맨틱한',
  '우아한',
  '화려한',
  '컴팩트한 핏',
];
const NATURAL_STYLE_TAGS = [
  '러프한',
  '넉넉한',
  '릴렉스한',
  '캐주얼한',
  '여유로운',
  '이국적인',
  '남성적인',
];

// 셀럽 리스트
const STRAIGHT_CELEBRITIES_FEMALE =
  '카리나, 유리, 하지원, 김성령, 조여정, 김선아, 마돈나';
const STRAIGHT_CELEBRITIES_MALE =
  '이병헌, 고수, 옥택연, 김수현, 조정석, 유아인, 싸이';
const WAVE_CELEBRITIES_FEMALE =
  '제니, 손예진, 송혜교, 서현진, 이보영, 김희선, 장나라, 오드리 햅번';
const WAVE_CELEBRITIES_MALE =
  '송중기, 현빈, 원빈, 박보검, 박서준, 정경호, 권지용, 유재석';
const NATURAL_CELEBRITIES_FEMALE =
  '정려원, 공효진, 정유미, 윤아, 전도연, 김서형, 안젤리나 졸리';
const NATURAL_CELEBRITIES_MALE =
  '공유, 유연석, 김우빈, 다니엘헤니, 소지섭, 이수혁, 이민호';

// 이미지 경로
const STRAIGHT_IMAGES_FEMALE = [
  '/type-test/woman/1.png',
  '/type-test/woman/2.png',
  '/type-test/woman/3.png',
];
const STRAIGHT_IMAGES_MALE = [
  '/type-test/man/1.png',
  '/type-test/man/2.png',
  '/type-test/man/3.png',
];
const WAVE_IMAGES_FEMALE = [
  '/type-test/woman/4.png',
  '/type-test/woman/5.png',
  '/type-test/woman/6.png',
];
const WAVE_IMAGES_MALE = [
  '/type-test/man/4.png',
  '/type-test/man/5.png',
  '/type-test/man/6.png',
];
const NATURAL_IMAGES_FEMALE = [
  '/type-test/woman/7.png',
  '/type-test/woman/8.png',
  '/type-test/woman/9.png',
];
const NATURAL_IMAGES_MALE = [
  '/type-test/man/7.png',
  '/type-test/man/8.png',
  '/type-test/man/9.png',
];

// After image path constants and before GENDER constant, add descriptions
const DESCRIPTION = {
  [BodyType.STRAIGHT]: {
    female:
      '탄탄한 피부결과 볼륨감 있는 상체 라인을 가진 체형으로, 입체적으로 글래머러스한 인상을 줍니다.',
    male:
      '탄탄하고 입체적인 상체 중심 체형으로 클래식한 스타일이 잘 어울립니다.',
  },
  [BodyType.WAVE]: {
    female:
      '가녀리고 평평한 실루엣이 특징이며, 부드러운 피부 질감과 하체 중심의 곡선미가 돋보이는 체형입니다.',
    male:
      '슬림하고 부드러운 하체 중심 체형으로 유연한 핏과 레이어드 스타일이 어울립니다.',
  },
  [BodyType.NATURAL]: {
    female:
      '뼈대가 뚜렷하고 관절이 도드라지는 체형으로, 육감적이기보다는 자연스럽고 스타일리시한 느낌을 줍니다.',
    male:
      '뼈대가 굵고 프레임이 확실한 체형으로 오버핏과 캐주얼한 스타일이 잘 어울립니다.',
  },
};

const GENDER = ['female', 'male'];

export const Result = ({
  type,
  genderIndex,
}: {
  type: BodyType;
  genderIndex?: number;
}) => {
  const router = useRouter();

  const { data: productList } = useGetProductListMyType(type);

  type Gender = 'female' | 'male';
  const [gender, setGender] = useState<Gender>(GENDER[genderIndex ?? 0] as Gender);

  return (
    <div className="bg-gradient-to-b from-grey-99 to-white py-12">
      <div className="w-full max-w-[800px] mx-auto flex flex-col items-center px-6">
        <div className="w-[140px] h-[105px] md:w-[180px] md:h-[135px] relative mb-8">
          <Image
            src="/type-test/judi.png"
            alt="judi"
            fill
            className="object-contain"
          />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-grey-20 mb-4">
          체형 진단 결과
        </h2>

        <p className="text-center text-grey-40 text-base md:text-lg max-w-[600px] leading-relaxed mb-12">
          가장 많이 체크된 유형의 체형 결과입니다.
        </p>

        <div className="w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          {type === BodyType.STRAIGHT && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-grey-20 text-white text-xl font-bold">
                  A
                </span>
                <h3 className="text-2xl font-bold text-grey-20">스트레이트일 가능성이 높습니다</h3>
              </div>
              <p className="text-grey-40 text-base md:text-lg leading-relaxed">
                {DESCRIPTION[BodyType.STRAIGHT][gender]}
              </p>

              <div className="border-t border-grey-95 pt-8">
                <h4 className="text-xl font-bold text-grey-20 mb-4">
                  스트레이트 타입
                </h4>

                <div className="flex gap-4 mb-4">
                  <button
                    className={`px-4 py-2 rounded-full ${
                      gender === 'female'
                        ? 'bg-grey-20 text-white'
                        : 'bg-grey-95 text-grey-40'
                    }`}
                    onClick={() => setGender('female')}
                  >
                    여성
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full ${
                      gender === 'male'
                        ? 'bg-grey-20 text-white'
                        : 'bg-grey-95 text-grey-40'
                    }`}
                    onClick={() => setGender('male')}
                  >
                    남성
                  </button>
                </div>

                {/* 이미지 섹션 */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-grey-20 mb-3">
                    체형 이미지
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {(gender === 'female'
                      ? STRAIGHT_IMAGES_FEMALE
                      : STRAIGHT_IMAGES_MALE
                    ).map((imagePath, index) => (
                      <div
                        key={index}
                        className="relative w-full h-64 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={imagePath}
                          alt={`스트레이트 타입 ${
                            gender === 'female' ? '여성' : '남성'
                          } ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="space-y-2 text-grey-40 text-base md:text-lg mb-6">
                  {gender === 'female'
                    ? STRAIGHT_TYPE_FEMALE.map((text, index) => (
                        <li key={`female-${index}`}>- {text}</li>
                      ))
                    : STRAIGHT_TYPE_MALE.map((text, index) => (
                        <li key={`male-${index}`}>- {text}</li>
                      ))}
                </ul>

                <h4 className="text-lg font-bold text-grey-20 mb-3">스타일</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {STRAIGHT_STYLE_TAGS.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-grey-95 rounded-full text-grey-40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h4 className="text-lg font-bold text-grey-20 mb-3">
                  스트레이트 타입의 셀럽
                </h4>
                <p className="text-grey-40 text-base md:text-lg">
                  {gender === 'female'
                    ? STRAIGHT_CELEBRITIES_FEMALE
                    : STRAIGHT_CELEBRITIES_MALE}
                </p>
              </div>
            </div>
          )}

          {type === BodyType.WAVE && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-grey-20 text-white text-xl font-bold">
                  B
                </span>
                <h3 className="text-2xl font-bold text-grey-20">웨이브일 가능성이 높습니다</h3>
              </div>
              <p className="text-grey-40 text-base md:text-lg leading-relaxed">
                {DESCRIPTION[BodyType.WAVE][gender]}
              </p>

              <div className="border-t border-grey-95 pt-8">
                <h4 className="text-xl font-bold text-grey-20 mb-4">
                  웨이브 타입
                </h4>

                <div className="flex gap-4 mb-4">
                  <button
                    className={`px-4 py-2 rounded-full ${
                      gender === 'female'
                        ? 'bg-grey-20 text-white'
                        : 'bg-grey-95 text-grey-40'
                    }`}
                    onClick={() => setGender('female')}
                  >
                    여성
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full ${
                      gender === 'male'
                        ? 'bg-grey-20 text-white'
                        : 'bg-grey-95 text-grey-40'
                    }`}
                    onClick={() => setGender('male')}
                  >
                    남성
                  </button>
                </div>

                {/* 이미지 섹션 */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-grey-20 mb-3">
                    체형 이미지
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {(gender === 'female'
                      ? WAVE_IMAGES_FEMALE
                      : WAVE_IMAGES_MALE
                    ).map((imagePath, index) => (
                      <div
                        key={index}
                        className="relative w-full h-64 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={imagePath}
                          alt={`웨이브 타입 ${
                            gender === 'female' ? '여성' : '남성'
                          } ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="space-y-2 text-grey-40 text-base md:text-lg mb-6">
                  {gender === 'female'
                    ? WAVE_TYPE_FEMALE.map((text, index) => (
                        <li key={`female-${index}`}>- {text}</li>
                      ))
                    : WAVE_TYPE_MALE.map((text, index) => (
                        <li key={`male-${index}`}>- {text}</li>
                      ))}
                </ul>

                <h4 className="text-lg font-bold text-grey-20 mb-3">스타일</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {WAVE_STYLE_TAGS.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-grey-95 rounded-full text-grey-40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h4 className="text-lg font-bold text-grey-20 mb-3">
                  웨이브 타입의 셀럽
                </h4>
                <p className="text-grey-40 text-base md:text-lg">
                  {gender === 'female'
                    ? WAVE_CELEBRITIES_FEMALE
                    : WAVE_CELEBRITIES_MALE}
                </p>
              </div>
            </div>
          )}

          {type === BodyType.NATURAL && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-grey-20 text-white text-xl font-bold">
                  C
                </span>
                <h3 className="text-2xl font-bold text-grey-20">내추럴일 가능성이 높습니다</h3>
              </div>
              <p className="text-grey-40 text-base md:text-lg leading-relaxed">
                {DESCRIPTION[BodyType.NATURAL][gender]}
              </p>

              <div className="border-t border-grey-95 pt-8">
                <h4 className="text-xl font-bold text-grey-20 mb-4">
                  내추럴 타입
                </h4>

                <div className="flex gap-4 mb-4">
                  <button
                    className={`px-4 py-2 rounded-full ${
                      gender === 'female'
                        ? 'bg-grey-20 text-white'
                        : 'bg-grey-95 text-grey-40'
                    }`}
                    onClick={() => setGender('female')}
                  >
                    여성
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full ${
                      gender === 'male'
                        ? 'bg-grey-20 text-white'
                        : 'bg-grey-95 text-grey-40'
                    }`}
                    onClick={() => setGender('male')}
                  >
                    남성
                  </button>
                </div>

                {/* 이미지 섹션 */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-grey-20 mb-3">
                    체형 이미지
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {(gender === 'female'
                      ? NATURAL_IMAGES_FEMALE
                      : NATURAL_IMAGES_MALE
                    ).map((imagePath, index) => (
                      <div
                        key={index}
                        className="relative w-full h-64 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={imagePath}
                          alt={`내추럴 타입 ${
                            gender === 'female' ? '여성' : '남성'
                          } ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="space-y-2 text-grey-40 text-base md:text-lg mb-6">
                  {gender === 'female'
                    ? NATURAL_TYPE_FEMALE.map((text, index) => (
                        <li key={`female-${index}`}>- {text}</li>
                      ))
                    : NATURAL_TYPE_MALE.map((text, index) => (
                        <li key={`male-${index}`}>- {text}</li>
                      ))}
                </ul>

                <h4 className="text-lg font-bold text-grey-20 mb-3">스타일</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {NATURAL_STYLE_TAGS.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-grey-95 rounded-full text-grey-40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h4 className="text-lg font-bold text-grey-20 mb-3">
                  내추럴 타입의 셀럽
                </h4>
                <p className="text-grey-40 text-base md:text-lg">
                  {gender === 'female'
                    ? NATURAL_CELEBRITIES_FEMALE
                    : NATURAL_CELEBRITIES_MALE}
                </p>
              </div>
            </div>
          )}

          {productList && productList.length > 0 && (
            <div className="pt-8">
              <h4 className="text-xl font-bold text-grey-20 mb-6">
                {type === BodyType.STRAIGHT && '스트레이트'}
                {type === BodyType.WAVE && '웨이브'}
                {type === BodyType.NATURAL && '내추럴'} 타입 추천 상품
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {productList.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    href={`${ROUTE.SHOPPING_PRODUCT_DETAIL(product.id)}`}
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
                          <span className="text-gray-400 text-sm">
                            No Image
                          </span>
                        </div>
                      )}

                      {/* Sold Out Badge */}
                      {(!product.isAvailable || product.stockQuantity < 1) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                            품절
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {product.recommendedColorSeason?.map((season) => (
                          <span
                            key={season}
                            className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700"
                          >
                            {season}
                          </span>
                        ))}
                        {product.recommendedBodyType && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                            {product.recommendedBodyType}
                          </span>
                        )}
                      </div>

                      {/* Brand */}
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {product.brand}
                      </p>

                      {/* Product Name */}
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-gray-700">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-900">
                          ₩{product.price.toLocaleString()} (${product.usdPrice.toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {productList.length > 8 && (
                <div className="text-center mt-8">
                  <button
                    className="px-6 py-3 border border-grey-20 text-grey-20 rounded-full font-medium hover:bg-grey-20 hover:text-white transition-colors"
                    onClick={() =>
                      router.push(`${ROUTE.SHOPPING}?bodyType=${type}`)
                    }
                  >
                    더 많은 상품 보기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="w-[200px] bg-grey-20 text-white px-8 py-4 rounded-full font-semibold 
                   hover:bg-grey-30 transition-all duration-300 text-base md:text-lg
                   shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          onClick={() => router.push(ROUTE.MYPAGE)}
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};
