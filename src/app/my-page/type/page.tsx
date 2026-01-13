'use client';

import { TypeGuide } from '@/components/my-page-type/TypeGuide';
import { ROUTE } from '@/configs/constant/route';
import { useGetUser } from '@/serivces/user/query';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { IoArrowBack, IoBody, IoColorPalette, IoSparkles, IoPerson, IoShirt, IoPencil } from 'react-icons/io5';
import { colorAnalysisApi } from '@/serivces/color-analysis/request';
import { BodyType } from '@/serivces/user/type';
import { ColorSeason } from '@/serivces/color-analysis/type';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY } from '@/configs/constant/query';

const BODYTYPE_TO_ENGLISH = {
  스트레이트: 'Straight',
  웨이브: 'Wave',
  내추럴: 'Natural',
};

// 스트레이트 타입 특징
const STRAIGHT_TYPE_FEMALE = ['바디감이 두께감이 있다.', '근육의 탄력이 느껴진다.', '바디의 중심이 윗 중심이다.'];
const STRAIGHT_TYPE_MALE = ['바디감이 두께감이 있다.', '탄력 있는 피부 질감이다.', '바디의 중심이 윗 중심이다.'];

// 웨이브 타입 특징
const WAVE_TYPE_FEMALE = ['바디감이 가냘프다.', '부드러운 피부 질감이다.', '바디의 중심이 아랫 중심이다.'];
const WAVE_TYPE_MALE = [
  '바디감이 날씬하고 마른 체형이 많다.',
  '부드러운 피부 질감이다.',
  '바디의 중심이 아랫 중심이다.',
];

// 내추럴 타입 특징
const NATURAL_TYPE_FEMALE = ['뼈, 관절이 크다.', '바디 프레임이 확실하다.', '육감적이지 않다.'];
const NATURAL_TYPE_MALE = ['뼈, 관절이 크다.', '바디 프레임이 확실하다.', '딱 벌어진 골격'];

// 스타일 태그
const STRAIGHT_STYLE_TAGS = ['지적인', '세련된', '깔끔한', '베이직', '심플', '품위있는', '고저스', '저스트핏'];
const WAVE_STYLE_TAGS = ['소프트한', '슬림한', '로맨틱한', '우아한', '화려한', '컴팩트한 핏'];
const NATURAL_STYLE_TAGS = ['러프한', '넉넉한', '릴렉스한', '캐주얼한', '여유로운', '이국적인', '남성적인'];

// 셀럽 리스트
const STRAIGHT_CELEBRITIES_FEMALE = ['카리나', '유리', '하지원', '김성령', '조여정', '김선아', '마돈나'];
const STRAIGHT_CELEBRITIES_MALE = ['이병헌', '고수', '옥택연', '김수현', '조정석', '유아인', '싸이'];
const WAVE_CELEBRITIES_FEMALE = ['제니', '손예진', '송혜교', '서현진', '이보영', '김희선', '장나라', '오드리 햅번'];
const WAVE_CELEBRITIES_MALE = ['송중기', '현빈', '원빈', '박보검', '박서준', '정경호', '권지용', '유재석'];
const NATURAL_CELEBRITIES_FEMALE = ['정려원', '공효진', '정유미', '윤아', '전도연', '김서형', '안젤리나 졸리'];
const NATURAL_CELEBRITIES_MALE = ['공유', '유연석', '김우빈', '다니엘헤니', '소지섭', '이수혁', '이민호'];

const BODYTYPE_CARDS = [
  {
    type: 'Straight',
    icon: '📐',
    color: 'from-pink-400 to-red-400',
    description: '직선적인 실루엣, 어깨와 골반이 비슷한 너비, 상체 발달',
  },
  {
    type: 'Wave',
    icon: '〰️',
    color: 'from-yellow-400 to-orange-400',
    description: '곡선적인 실루엣, 잘록한 허리, 여성스러운 분위기',
  },
  {
    type: 'Natural',
    icon: '🌿',
    color: 'from-green-400 to-emerald-400',
    description: '뚜렷한 관절, 안정적인 비율, 건강한 이미지',
  },
];

// 퍼스널 컬러 목록 (sign-up Step2 와 동일)
const PERSONAL_COLORS = [
  { label: ColorSeason.SPRING_BRIGHT, color: 'bg-yellow-300' },
  { label: ColorSeason.SPRING_LIGHT, color: 'bg-orange-300' },
  { label: ColorSeason.SUMMER_LIGHT, color: 'bg-pink-200' },
  { label: ColorSeason.SUMMER_MUTE, color: 'bg-purple-200' },
  { label: ColorSeason.AUTUMN_MUTE, color: 'bg-yellow-800' },
  { label: ColorSeason.AUTUMN_DEEP, color: 'bg-orange-900' },
  { label: ColorSeason.WINTER_DARK, color: 'bg-blue-700' },
  { label: ColorSeason.WINTER_BRIGHT, color: 'bg-purple-500' },
];

const LABEL_MAP = {
  bodyType: '체형',
  colorSeason: '퍼스널 컬러',
  height: '키',
  weight: '몸무게',
} as const;

type EditableField = keyof typeof LABEL_MAP;

// 필드 수정용 모달
const EditModal = ({
  field,
  initialValue,
  onClose,
  onSave,
}: {
  field: EditableField;
  initialValue: any;
  onClose: () => void;
  onSave: (value: any) => void;
}) => {
  const [value, setValue] = useState<any>(initialValue ?? (field === 'height' || field === 'weight' ? 0 : null));

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-md">
        <h3 className="text-lg font-semibold mb-4">{LABEL_MAP[field]} 수정</h3>

        {/* 입력/선택 영역 */}
        {field === 'height' || field === 'weight' ? (
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none mb-4"
            value={value ?? ''}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        ) : field === 'bodyType' ? (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.values(BodyType).map((type) => (
              <button
                key={type}
                type="button"
                className={`py-2 rounded-lg border ${
                  value === type ? 'bg-black text-white' : 'bg-white text-gray-700'
                }`}
                onClick={() => setValue(type)}
              >
                {type}
              </button>
            ))}
            <button
              type="button"
              className={`col-span-3 py-2 rounded-lg border ${
                value === null ? 'bg-black text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => setValue(null)}
            >
              모름
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {PERSONAL_COLORS.map((c) => (
              <button
                key={c.label}
                type="button"
                className={`h-16 rounded-lg flex items-center justify-center text-xs font-medium ${c.color} ${
                  value === c.label ? 'ring-2 ring-black' : ''
                }`}
                onClick={() => setValue(c.label)}
              >
                {c.label}
              </button>
            ))}
            <button
              type="button"
              className={`col-span-4 h-16 bg-gray-300 rounded-lg flex items-center justify-center text-xs font-medium ${
                value === null ? 'ring-2 ring-black' : ''
              }`}
              onClick={() => setValue(null)}
            >
              모름
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => onSave(value)}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

const getSeasonColor = (season?: string) => {
  if (!season) return { bg: 'bg-gray-100', text: 'text-gray-700' };
  if (season.includes('Spring')) return { bg: 'bg-pink-100', text: 'text-pink-700' };
  if (season.includes('Summer')) return { bg: 'bg-blue-100', text: 'text-blue-700' };
  if (season.includes('Autumn')) return { bg: 'bg-orange-100', text: 'text-orange-700' };
  if (season.includes('Winter')) return { bg: 'bg-purple-100', text: 'text-purple-700' };
  return { bg: 'bg-gray-100', text: 'text-gray-700' };
};

export default function MyPageType() {
  const router = useRouter();
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [{ data: user }, { data: colorAnalysis }] = useGetUser();

  const englishBodyType = BODYTYPE_TO_ENGLISH[colorAnalysis?.bodyType || '웨이브'];
  const seasonColor = getSeasonColor(colorAnalysis?.colorSeason || undefined);

  const queryClient = useQueryClient();
  const [editingField, setEditingField] = useState<EditableField | null>(null);

  const handleSave = async (value: any) => {
    if (!colorAnalysis || !editingField) return;

    try {
      if (editingField === 'height') {
        await colorAnalysisApi.updateColorAnalysis(colorAnalysis.id, Number(value), undefined, undefined, undefined);
      } else if (editingField === 'weight') {
        await colorAnalysisApi.updateColorAnalysis(colorAnalysis.id, undefined, Number(value), undefined, undefined);
      } else if (editingField === 'bodyType') {
        await colorAnalysisApi.updateColorAnalysis(colorAnalysis.id, undefined, undefined, value as BodyType, undefined);
      } else if (editingField === 'colorSeason') {
        await colorAnalysisApi.updateColorAnalysis(colorAnalysis.id, undefined, undefined, undefined, value as ColorSeason);
      }

      await queryClient.invalidateQueries({ queryKey: [QUERY.COLOR_ANALYSIS] });
      setEditingField(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 현재 체형에 맞는 데이터 가져오기
  const getCurrentTypeData = () => {
    switch (englishBodyType) {
      case 'Straight':
        return {
          features: gender === 'female' ? STRAIGHT_TYPE_FEMALE : STRAIGHT_TYPE_MALE,
          styleTags: STRAIGHT_STYLE_TAGS,
          celebrities: gender === 'female' ? STRAIGHT_CELEBRITIES_FEMALE : STRAIGHT_CELEBRITIES_MALE,
          description: '어깨와 골반이 비슷한 너비로 직선형이며, 상체가 발달되어 글래머러스한 인상을 주는 체형입니다.',
          icon: '📐',
          color: 'from-pink-400 to-red-400',
        };
      case 'Wave':
        return {
          features: gender === 'female' ? WAVE_TYPE_FEMALE : WAVE_TYPE_MALE,
          styleTags: WAVE_STYLE_TAGS,
          celebrities: gender === 'female' ? WAVE_CELEBRITIES_FEMALE : WAVE_CELEBRITIES_MALE,
          description: '전체적으로 곡선형이며, 어깨보다 골반이 넓고 팔다리는 가늘며 체구가 작고 어린 인상을 주는 체형입니다.',
          icon: '〰️',
          color: 'from-yellow-400 to-orange-400',
        };
      case 'Natural':
        return {
          features: gender === 'female' ? NATURAL_TYPE_FEMALE : NATURAL_TYPE_MALE,
          styleTags: NATURAL_STYLE_TAGS,
          celebrities: gender === 'female' ? NATURAL_CELEBRITIES_FEMALE : NATURAL_CELEBRITIES_MALE,
          description: '뼈대가 도드라지며 관절이 두껍고, 전체적인 비율이 안정적인 체형입니다.',
          icon: '🌿',
          color: 'from-green-400 to-emerald-400',
        };
      default:
        return {
          features: [],
          styleTags: [],
          celebrities: [],
          description: '',
          icon: '',
          color: '',
        };
    }
  };

  const currentTypeData = getCurrentTypeData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(ROUTE.MYPAGE)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <IoArrowBack size={20} />
              </button>
              <h1 className="text-xl font-semibold">내 정보</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${currentTypeData.color} p-8 text-white`}>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <IoPerson size={40} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{user?.name}님</h2>
                <p className="text-white/90">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">체형</p>
              <p className="font-semibold text-gray-900 flex items-center justify-center gap-1">
                {colorAnalysis?.bodyType ?? '없음'}
                <button onClick={() => setEditingField('bodyType')}>
                  <IoPencil size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">퍼스널 컬러</p>
              <p className={`font-semibold ${seasonColor.text} flex items-center justify-center gap-1`}>
                {colorAnalysis?.colorSeason ?? '없음'}
                <button onClick={() => setEditingField('colorSeason')}>
                  <IoPencil size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">키</p>
              <p className="font-semibold text-gray-900 flex items-center justify-center gap-1">
                {colorAnalysis?.height ? `${colorAnalysis.height}cm` : '없음'}
                <button onClick={() => setEditingField('height')}>
                  <IoPencil size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">몸무게</p>
              <p className="font-semibold text-gray-900 flex items-center justify-center gap-1">
                {colorAnalysis?.weight ? `${colorAnalysis.weight}kg` : '없음'}
                <button onClick={() => setEditingField('weight')}>
                  <IoPencil size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Body Type Analysis */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">체형 분석 결과</h3>
            <span className="text-4xl">{currentTypeData.icon}</span>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <IoBody className="text-gray-600" />
              {englishBodyType} 체형
            </h4>
            <p className="text-gray-700 leading-relaxed">{currentTypeData.description}</p>
          </div>

          {/* Gender Selector */}
          <div className="flex gap-3 mb-8">
            <button
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                gender === 'female'
                  ? 'bg-gradient-to-r from-pink-400 to-red-400 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setGender('female')}
            >
              여성
            </button>
            <button
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                gender === 'male'
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setGender('male')}
            >
              남성
            </button>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IoSparkles className="text-yellow-500" />
              주요 특징
            </h5>
            <div className="space-y-3">
              {currentTypeData.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Style Tags */}
          <div className="mb-8">
            <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IoShirt className="text-green-500" />
              추천 스타일
            </h5>
            <div className="flex flex-wrap gap-2">
              {currentTypeData.styleTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-full text-sm font-medium text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Celebrities */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IoSparkles className="text-pink-500" />
              {englishBodyType} 타입 셀럽
            </h5>
            <div className="bg-pink-50 rounded-xl p-4">
              <div className="flex flex-wrap gap-2">
                {currentTypeData.celebrities.map((celeb, index) => (
                  <span key={index} className="px-3 py-1 bg-white rounded-lg text-sm text-gray-700">
                    {celeb}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body Type Comparison */}
        {/* UI-036: 선택된 체형만 강조, 선택 불가 상태의 다른 체형은 호버 효과 제거 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {BODYTYPE_CARDS.map((card) => {
            const isSelected = englishBodyType === card.type;
            return (
              <div
                key={card.type}
                className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r ' + card.color + ' text-white shadow-lg scale-105'
                    : 'bg-white border border-gray-200 cursor-default'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                    나의 체형
                  </div>
                )}
                <div className="text-3xl mb-3">{card.icon}</div>
                <h4 className={`text-lg font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {card.type} 체형
                </h4>
                <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={ROUTE.TYPETEST}
            className="flex-1 bg-white border border-gray-200 text-gray-900 px-6 py-4 rounded-xl font-medium text-center hover:bg-gray-50 transition-colors"
          >
            체형 재진단 받기
          </Link>
          <button
            onClick={() => router.replace(ROUTE.MYPAGE_TYPE(true), { scroll: false })}
            className="flex-1 bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-6 py-4 rounded-xl font-medium hover:from-pink-600 hover:to-yellow-600 transition-all"
          >
            맞춤 스타일 추천 보기
          </button>
        </div>

        {/* Type Guide */}
        <div className="mt-12">
          <Suspense fallback={
            <div className="bg-white rounded-2xl p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          }>
            <TypeGuide bodyType={colorAnalysis?.bodyType || undefined} />
          </Suspense>
        </div>
      </div>
      {/* 수정 모달 */}
      {editingField && (
        <EditModal
          field={editingField}
          initialValue={
            editingField === 'bodyType'
              ? colorAnalysis?.bodyType
              : editingField === 'colorSeason'
              ? colorAnalysis?.colorSeason
              : editingField === 'height'
              ? colorAnalysis?.height
              : colorAnalysis?.weight
          }
          onClose={() => setEditingField(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}