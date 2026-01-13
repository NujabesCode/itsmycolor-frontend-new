'use client';

import { ROUTE } from '@/configs/constant/route';
import { brandApi } from '@/serivces/brand/request';
import { useGetUser } from '@/serivces/user/query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  IoStorefront,
  IoBusiness,
  IoPerson,
  IoDocumentText,
  IoColorPalette,
  IoCheckmarkCircle,
  IoInformationCircle,
  IoCamera,
  IoGlobe,
  IoLogoInstagram,
  IoMail,
  IoCall,
  IoLocation,
  IoShirt,
  IoPricetag,
  IoStar,
  IoArrowForward,
  IoArrowBack,
  IoAdd,
  IoWarning,
} from 'react-icons/io5';

type FormData = {
  brandName: string;
  engName?: string;
  businessType: 'individual' | 'corporate' | 'taxFree';
  businessNumber: string;
  onlineSalesNumber?: string;
  representativeName: string;
  address: string;
  phoneNumber: string;
  managerName: string;
  department?: string;
  phone: string;
  email: string;
  brandDescription?: string;
  brandLogo?: FileList;
  homepage?: string;
  instagram?: string;

  productCategories: string[];
  minPrice?: number;
  maxPrice?: number;
  brandKeywords: string[];
  productImages?: FileList;

  colorTypes: string[];
  seasonTypes: string[];
};

export default function MyPageSellerApply() {
  const [, , { data: brand }] = useGetUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const steps = [
    { id: 1, title: '브랜드 기본 정보', icon: IoStorefront },
    { id: 2, title: '담당자 정보', icon: IoPerson },
    { id: 3, title: '브랜드 소개', icon: IoDocumentText },
    { id: 4, title: '판매 상품 정보', icon: IoShirt },
    { id: 5, title: '특성 정보', icon: IoColorPalette },
  ];

  useEffect(() => {
    if (brand) {
      alert('이미 신청이 완료되었거나 신청 중입니다.');
      router.back();
    }
  }, [brand, router]);

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: FormData) => {
    const {
      brandName: name,
      engName,
      businessType,
      businessNumber,
      representativeName,
      phone: phoneNumber,
      email,
      address,
      homepage: website,
      instagram: sns,
    } = data;

    try {
      // await brandApi.createBrand({
      //   name,
      //   engName,
      //   businessType,
      //   businessNumber,
      //   representativeName,
      //   phoneNumber,
      //   email,
      //   address,
      //   website,
      //   sns,
      // });

      // alert('신청이 완료되었습니다.\n심사 결과는 영업일 기준 3-5일 내 이메일로 안내드립니다.');
      // router.push(ROUTE.MAIN);
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <IoStorefront className="mx-auto mb-4" size={64} />
            <h1 className="text-4xl font-bold mb-4">브랜드 입점 신청</h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              잇츠마이컬러와 함께 성장하실 브랜드를 모집합니다. 고객에게
              브랜드의 개성과 가치를 전달해보세요.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Benefits */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <IoStar className="text-yellow-500" />
            입점 혜택
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold mb-1">타겟 마케팅</h4>
              <p className="text-sm text-gray-600">
                퍼스널컬러 기반 정확한 고객 매칭
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📈</div>
              <h4 className="font-semibold mb-1">매출 증대</h4>
              <p className="text-sm text-gray-600">
                AI 추천으로 구매 전환율 향상
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-semibold mb-1">전담 지원</h4>
              <p className="text-sm text-gray-600">
                브랜드 성장을 위한 1:1 컨설팅
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex flex-col items-center cursor-pointer`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        currentStep >= step.id
                          ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <IoCheckmarkCircle size={24} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium text-center ${
                        currentStep >= step.id
                          ? 'text-pink-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mb-8 mx-2 ${
                        currentStep > step.id ? 'bg-pink-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          {/* Step 1: 브랜드 기본 정보 */}
          {currentStep === 1 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <IoStorefront className="text-pink-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    브랜드 기본 정보
                  </h2>
                  <p className="text-sm text-gray-500">
                    브랜드의 기본 정보를 입력해주세요
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    브랜드명<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    {...register('brandName', {
                      required: '브랜드명은 필수입니다',
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="브랜드명을 입력하세요"
                  />
                  {errors.brandName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <IoWarning size={12} />
                      {errors.brandName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    추가 브랜드명
                  </label>
                  <input
                    {...register('engName')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="영문명을 입력하세요"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  사업자 유형<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: 'individual',
                      label: '개인사업자',
                      icon: IoPerson,
                    },
                    {
                      value: 'corporate',
                      label: '법인사업자',
                      icon: IoBusiness,
                    },
                    {
                      value: 'taxFree',
                      label: '면세사업자',
                      icon: IoDocumentText,
                    },
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <label
                        key={type.value}
                        className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          watch('businessType') === type.value
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={type.value}
                          {...register('businessType', {
                            required: '사업자 유형을 선택해주세요',
                          })}
                          className="sr-only"
                        />
                        <Icon
                          className={`mb-2 ${
                            watch('businessType') === type.value
                              ? 'text-pink-600'
                              : 'text-gray-400'
                          }`}
                          size={24}
                        />
                        <span className="text-sm font-medium">
                          {type.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.businessType && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <IoWarning size={12} />
                    {errors.businessType.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사업자등록번호<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    {...register('businessNumber', {
                      required: '사업자등록번호는 필수입니다',
                      pattern: {
                        value: /^\d{3}-\d{2}-\d{5}$/,
                        message: '올바른 사업자등록번호 형식이 아닙니다',
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="000-00-00000"
                  />
                  {errors.businessNumber && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <IoWarning size={12} />
                      {errors.businessNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    통신판매업 신고번호
                  </label>
                  <input
                    {...register('onlineSalesNumber')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="신고번호를 입력하세요"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대표자명<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    {...register('representativeName', {
                      required: '대표자명은 필수입니다',
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="대표자명을 입력하세요"
                  />
                  {errors.representativeName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <IoWarning size={12} />
                      {errors.representativeName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대표 전화번호
                  </label>
                  <input
                    {...register('phoneNumber')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="02-0000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IoLocation className="inline mr-1" size={16} />
                  사업장 주소
                </label>
                <input
                  {...register('address')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="주소를 입력하세요"
                />
              </div>
            </section>
          )}

          {/* Step 2: 담당자 정보 */}
          {currentStep === 2 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <IoPerson className="text-purple-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    담당자 정보
                  </h2>
                  <p className="text-sm text-gray-500">
                    입점 관련 담당자 정보를 입력해주세요
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    담당자명<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    {...register('managerName', {
                      required: '담당자명은 필수입니다',
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="담당자명을 입력하세요"
                  />
                  {errors.managerName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <IoWarning size={12} />
                      {errors.managerName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    부서/직책
                  </label>
                  <input
                    {...register('department')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="부서/직책을 입력하세요"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IoCall className="inline mr-1" size={16} />
                    연락처<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    {...register('phone', {
                      required: '연락처는 필수입니다',
                      pattern: {
                        value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                        message: '올바른 전화번호 형식이 아닙니다',
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="010-0000-0000"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <IoWarning size={12} />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IoMail className="inline mr-1" size={16} />
                    이메일<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    {...register('email', {
                      required: '이메일은 필수입니다',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: '올바른 이메일 형식이 아닙니다',
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <IoWarning size={12} />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-pink-50 p-6 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <IoInformationCircle />
                  담당자 정보 안내
                </h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>
                    • 입력하신 담당자 정보로 입점 심사 결과를 안내드립니다.
                  </li>
                  <li>• 정확한 연락처를 입력해주시기 바랍니다.</li>
                  <li>• 심사 기간은 영업일 기준 3-5일 소요됩니다.</li>
                </ul>
              </div>
            </section>
          )}

          {/* Step 3: 브랜드 소개 */}
          {currentStep === 3 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <IoDocumentText className="text-green-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    브랜드 소개
                  </h2>
                  <p className="text-sm text-gray-500">
                    브랜드의 스토리와 정보를 공유해주세요
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  브랜드 소개
                </label>
                <textarea
                  {...register('brandDescription', { maxLength: 500 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                  rows={5}
                  placeholder="브랜드의 철학, 스토리, 특징 등을 자유롭게 소개해주세요 (최대 500자)"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {watch('brandDescription')?.length || 0} / 500
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IoCamera className="inline mr-1" size={16} />
                  브랜드 로고
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors relative">
                  <IoCamera className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-sm text-gray-600 mb-2">
                    클릭하여 로고를 업로드하세요
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG, SVG (최대 5MB)
                  </p>
                  <input
                    type="file"
                    {...register('brandLogo')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IoGlobe className="inline mr-1" size={16} />
                    홈페이지
                  </label>
                  <input
                    {...register('homepage', {
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                        message: '올바른 URL 형식이 아닙니다',
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="https://example.com"
                  />
                  {errors.homepage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.homepage.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IoLogoInstagram className="inline mr-1" size={16} />
                    인스타그램
                  </label>
                  <input
                    {...register('instagram')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="@instagram_id"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Step 4: 판매 상품 정보 */}
          {currentStep === 4 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <IoShirt className="text-indigo-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    판매 상품 정보
                  </h2>
                  <p className="text-sm text-gray-500">
                    판매하실 상품의 카테고리와 특징을 알려주세요
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  상품 카테고리
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['여성 의류', '남성 의류', '유니섹스', '액세서리'].map(
                    (category) => (
                      <label
                        key={category}
                        className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-500 transition-all"
                      >
                        <input
                          type="checkbox"
                          value={category}
                          {...register('productCategories')}
                          className="mr-2 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm font-medium">{category}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <IoPricetag className="inline mr-1" size={16} />
                  가격대
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      {...register('minPrice', { min: 0 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="최소 가격"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      {...register('maxPrice', { min: 0 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="최대 가격"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  브랜드 스타일 키워드
                  <span className="text-xs text-gray-400 ml-2">(최대 5개)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    '미니멀',
                    '캐주얼',
                    '모던',
                    '오피스',
                    '아메카지',
                    '스포티',
                    '빈티지',
                    '페미닌',
                    '스트릿',
                    '럭셔리',
                    '에스닉',
                    '로맨틱',
                  ].map((keyword) => (
                    <label
                      key={keyword}
                      className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-full cursor-pointer hover:border-pink-500 transition-all"
                    >
                      <input
                        type="checkbox"
                        value={keyword}
                        {...register('brandKeywords')}
                        className="sr-only"
                      />
                      <span className="text-sm">{keyword}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대표 상품 이미지
                  <span className="text-xs text-gray-400 ml-2">
                    (최대 10장)
                  </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors relative">
                  <IoAdd className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-sm text-gray-600 mb-2">
                    클릭하여 이미지를 업로드하세요
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG (각 5MB 이하)
                  </p>
                  <input
                    type="file"
                    multiple
                    {...register('productImages')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Step 5: 특성 정보 */}
          {currentStep === 5 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <IoColorPalette className="text-pink-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    잇츠마이컬러 특성 정보
                  </h2>
                  <p className="text-sm text-gray-500">
                    브랜드의 주요 타겟 퍼스널컬러를 선택해주세요
                  </p>
                </div>
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-pink-800">
                  <IoInformationCircle className="inline mr-1" size={16} />
                  아래 정보는 고객 매칭 및 상품 추천에 활용됩니다. 브랜드의 주요
                  타겟층을 고려하여 선택해주세요.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  주요 퍼스널컬러 타입
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: '봄 웜톤', color: 'bg-pink-100 text-pink-700' },
                    { name: '여름 쿨톤', color: 'bg-pink-100 text-yellow-700' },
                    {
                      name: '가을 웜톤',
                      color: 'bg-orange-100 text-orange-700',
                    },
                    {
                      name: '겨울 쿨톤',
                      color: 'bg-purple-100 text-purple-700',
                    },
                  ].map((colorType) => (
                    <label
                      key={colorType.name}
                      className={`flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-500 transition-all`}
                    >
                      <input
                        type="checkbox"
                        value={colorType.name}
                        {...register('colorTypes')}
                        className="sr-only"
                      />
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${colorType.color}`}
                      >
                        {colorType.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  주요 시즌
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['S/S (봄/여름)', 'F/W (가을/겨울)'].map((seasonType) => (
                    <label
                      key={seasonType}
                      className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-500 transition-all"
                    >
                      <input
                        type="checkbox"
                        value={seasonType}
                        {...register('seasonTypes')}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium">{seasonType}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  입점 신청 전 확인사항
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <IoCheckmarkCircle
                      className="text-green-500 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    <span>입력하신 정보는 심사 목적으로만 사용됩니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IoCheckmarkCircle
                      className="text-green-500 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    <span>심사 결과는 영업일 기준 3-5일 내 안내드립니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IoCheckmarkCircle
                      className="text-green-500 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    <span>추가 서류가 필요한 경우 별도 안내드립니다.</span>
                  </li>
                </ul>
              </div>
            </section>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={currentStep === 1}
            >
              <IoArrowBack />
              이전
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                다음
                <IoArrowForward />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                신청 완료
                <IoCheckmarkCircle size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
