'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  IoArrowForward,
  IoBusiness,
  IoCheckmarkCircle,
  IoDocumentText,
  IoGlobe,
  IoMail,
  IoPerson,
  IoPhonePortrait,
  IoPricetag,
  IoStorefront,
  IoWarning,
} from 'react-icons/io5';
import { brandApi } from '@/serivces/brand/request';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/configs/constant/route';
import Link from 'next/link';
import Image from 'next/image';
import { useGetUser } from '@/serivces/user/query';

export interface ApplyNewFormData {
  inquiryType: '입점 문의' | '제휴 제안' | '대량구매 문의';
  primaryCategory: string;
  secondaryCategory?: string;
  companyName: string;
  brandName: string;
  homepageUrl?: string;
  snsUrl?: string;
  managerName: string;
  email: string;
  phoneNumber: string;
  businessType?: '자체제작' | '국내유통' | '병행수입';
  skuCount?: number;
  salesChannels?: string;
  targetCustomer?: string;
  brandDescription?: string;
  brandPdf?: FileList;
  etcRequest?: string;
}

export default function ApplyNewForm() {
  const [, , { data: brand }] = useGetUser();

  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ApplyNewFormData>();

  useEffect(() => {
    if (brand) {
      alert('이미 신청이 완료되었거나 신청 중입니다.');
      router.back();
    }
  }, [brand, router]);

  const onSubmit = async (data: ApplyNewFormData) => {
    try {
      // 모든 입력값을 FormData 로 변환하여 전송
      const formData = new FormData();

      // 문의/카테고리 정보
      formData.append('inquiryType', data.inquiryType);
      formData.append('primaryCategory', data.primaryCategory);
      if (data.secondaryCategory) formData.append('secondaryCategory', data.secondaryCategory);

      // 회사/브랜드 기본 정보
      formData.append('companyName', data.companyName);
      formData.append('name', data.brandName);
      if (data.homepageUrl) formData.append('sns', data.homepageUrl);

      // 담당자 정보
      formData.append('representativeName', data.managerName);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber);

      // 선택 정보
      if (data.businessType) formData.append('businessType', data.businessType);
      if (data.skuCount) formData.append('skuCount', String(data.skuCount));
      if (data.salesChannels) formData.append('salesChannels', data.salesChannels);
      if (data.targetCustomer) formData.append('targetCustomer', data.targetCustomer);
      if (data.brandDescription) formData.append('description', data.brandDescription);
      if (data.etcRequest) formData.append('etcRequest', data.etcRequest);

      // 파일 업로드
      if (data.brandPdf && data.brandPdf[0]) {
        formData.append('brandPdf', data.brandPdf[0]);
      }

      await brandApi.createBrand(formData);
      setSubmitted(true);
      alert(
        '신청이 완료되었습니다.\n담당자가 검토 후 영업일 기준 3-5일 내 이메일로 안내드립니다.'
      );
      router.push(ROUTE.MAIN);
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const inquiryOptions = [
    { label: '입점 문의', value: '입점 문의' },
    { label: '제휴 제안', value: '제휴 제안' },
    { label: '대량구매 문의', value: '대량구매 문의' },
  ] as const;

  const businessTypeOptions = [
    { label: '자체제작', value: '자체제작' },
    { label: '국내유통', value: '국내유통' },
    { label: '병행수입', value: '병행수입' },
  ] as const;

  const primaryCategoryOptions = [
    { label: 'WOMEN', value: 'WOMEN' },
    { label: 'MEN', value: 'MEN' },
    { label: 'BEAUTY', value: 'BEAUTY' },
  ] as const;

  const secondaryCategoryOptions = {
    WOMEN: [
      { label: '의류', value: '의류' },
      { label: '가방', value: '가방' },
      { label: '신발', value: '신발' },
      { label: '주얼리', value: '주얼리' },
      { label: '언더웨어', value: '언더웨어' },
      { label: '라운지웨어', value: '라운지웨어' },
      { label: '기타잡화', value: '기타잡화' },
    ],
    MEN: [
      { label: '의류', value: '의류' },
      { label: '가방', value: '가방' },
      { label: '신발', value: '신발' },
      { label: '액세서리', value: '액세서리' },
    ],
    BEAUTY: [
      { label: '화장품', value: '화장품' },
      { label: '향수', value: '향수' },
      { label: '메이크업', value: '메이크업' },
    ],
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/30 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* 로고 헤더 */}
        <div className="text-center mb-8">
          <Link href={ROUTE.MAIN} className="inline-block">
            <Image
              src="/image/itsmycolor-logo.png"
              alt="It&apos;s my color"
              width={200}
              height={50}
              className="h-12 w-auto mx-auto hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        {/* 헤더 */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-pink-100/50 mb-6">
            <IoStorefront className="text-pink-500 text-xl" />
            <span className="text-sm font-medium text-pink-600 tracking-wide">PARTNERSHIP APPLICATION</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
            잇츠마이컬러 입점 신청
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
            퍼스널컬러 기반 큐레이션 플랫폼에서 함께할 브랜드를 찾고 있습니다. 
            간단한 정보 입력만으로 입점 검토를 시작하실 수 있습니다.
          </p>
        </section>

        {/* 프로세스 스텝 */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: '입점 신청서 작성', desc: '브랜드/상품 정보를 기입하여 입점 의사를 제출해주세요', icon: IoDocumentText },
              { step: '02', title: '담당자 검토 및 연락', desc: '플랫폼 콘셉트 및 스타일과의 적합성 검토 후 담당자가 이메일 또는 유선으로 연락드립니다.', icon: IoPerson },
              { step: '03', title: '조건 협의 및 계약 체결', desc: '판매방식, 정산조건, 콘텐츠 활용방식 등을 협의한 후 계약서를 체결합니다.', icon: IoCheckmarkCircle }
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <item.icon className="text-pink-500 text-2xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 입점 시 유의사항 */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-pink-100/50 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
              <IoCheckmarkCircle className="text-pink-500" />
              입점 시 유의사항
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3 p-4 bg-pink-50/50 rounded-xl">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="leading-relaxed">
                  잇츠마이컬러는 퍼스널컬러 / 체형 기반 큐레이션에 적합한 브랜드 중심으로 입점을 검토합니다.
                </p>
              </li>
              <li className="flex items-start gap-3 p-4 bg-pink-50/50 rounded-xl">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="leading-relaxed">
                  정산/배송/CS 처리 등 운영 담당자 지정이 필수이며, 미지정 시 입점이 거절될 수 있습니다.
                </p>
              </li>
              <li className="flex items-start gap-3 p-4 bg-pink-50/50 rounded-xl">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="leading-relaxed">
                  브랜드/상품 소개서 및 이미지, 상세 설명자료가 충실할수록 입점 검토가 원활하게 진행됩니다.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* 신청 폼 */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 space-y-10 border border-white/20"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">신청서 작성</h2>
            <p className="text-gray-600">정확한 정보 입력으로 빠른 검토를 받아보세요</p>
          </div>

          {/* 문의 분류 */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-900">
              문의 분류<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {inquiryOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`group relative flex items-center gap-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    watch('inquiryType') === opt.value
                      ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-25 shadow-lg'
                      : 'border-gray-200 hover:border-pink-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register('inquiryType', {
                      required: '문의 분류를 선택해주세요',
                    })}
                    className="sr-only"
                  />
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    watch('inquiryType') === opt.value
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-500'
                  }`}>
                    <IoPricetag className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 block">{opt.label}</span>
                    <span className="text-sm text-gray-500">
                      {opt.value === '입점 문의' && '브랜드 입점을 위한 문의'}
                      {opt.value === '제휴 제안' && '비즈니스 파트너십 제안'}
                      {opt.value === '대량구매 문의' && '대량 주문 및 도매 문의'}
                    </span>
                  </div>
                  {watch('inquiryType') === opt.value && (
                    <IoCheckmarkCircle className="text-pink-500 text-2xl" />
                  )}
                </label>
              ))}
            </div>
            {errors.inquiryType && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                <IoWarning size={16} /> {errors.inquiryType.message}
              </p>
            )}
          </div>

          {/* 카테고리 */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">카테고리 정보</h3>
              <p className="text-gray-600">브랜드의 주요 상품 카테고리를 선택해주세요</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoPricetag className="text-pink-500" />
                  1차 카테고리<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...register('primaryCategory', {
                    required: '1차 카테고리를 선택해주세요',
                  })}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="">1차 카테고리를 선택해주세요</option>
                  {primaryCategoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.primaryCategory && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <IoWarning size={16} /> {errors.primaryCategory.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoPricetag className="text-gray-400" />
                  2차 카테고리
                </label>
                <select
                  {...register('secondaryCategory')}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 appearance-none cursor-pointer"
                  disabled={!watch('primaryCategory')}
                >
                  <option value="">2차 카테고리를 선택해주세요</option>
                  {watch('primaryCategory') && 
                    secondaryCategoryOptions[watch('primaryCategory') as keyof typeof secondaryCategoryOptions]?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">브랜드 기본 정보</h3>
              <p className="text-gray-600">브랜드의 기본적인 정보를 입력해주세요</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoBusiness className="text-pink-500" />
                  회사명<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  {...register('companyName', {
                    required: '회사명을 입력해주세요',
                  })}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900"
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <IoWarning size={16} /> {errors.companyName.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoStorefront className="text-pink-500" />
                  브랜드명<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  {...register('brandName', {
                    required: '브랜드명을 입력해주세요',
                  })}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900"
                />
                {errors.brandName && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <IoWarning size={16} /> {errors.brandName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <IoGlobe className="text-pink-500" />
                홈페이지 / SNS 주소<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                {...register('homepageUrl', {
                  required: '주소를 입력해주세요',
                })}
                placeholder="https://"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
              />
              {errors.homepageUrl && (
                <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <IoWarning size={16} /> {errors.homepageUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* 담당자 정보 */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">담당자 정보</h3>
              <p className="text-gray-600">연락 및 상담을 위한 담당자 정보를 입력해주세요</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoPerson className="text-pink-500" />
                  담당자명<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  {...register('managerName', {
                    required: '담당자명을 입력해주세요',
                  })}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900"
                />
                {errors.managerName && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <IoWarning size={16} /> {errors.managerName.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoMail className="text-pink-500" />
                  이메일<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  {...register('email', {
                    required: '이메일을 입력해주세요',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: '올바른 이메일 형식이 아닙니다',
                    },
                  })}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <IoWarning size={16} /> {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoPhonePortrait className="text-pink-500" />
                  전화번호<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  {...register('phoneNumber', {
                    required: '전화번호를 입력해주세요',
                  })}
                  placeholder="010-0000-0000"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <IoWarning size={16} /> {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoBusiness className="text-gray-400" />
                  사업자 유형
                </label>
                <select
                  {...register('businessType')}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="">선택해주세요</option>
                  {businessTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 판매 정보 */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">판매 정보</h3>
              <p className="text-gray-600">브랜드의 판매 현황과 계획을 알려주세요</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoPricetag className="text-gray-400" />
                  판매 예정 SKU 수
                </label>
                <input
                  type="number"
                  {...register('skuCount', { min: 0 })}
                  placeholder="예: 50"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoStorefront className="text-gray-400" />
                  주요 판매 채널
                </label>
                <input
                  {...register('salesChannels')}
                  placeholder="예: 29CM, 무신사 등"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* 브랜드 상세 정보 */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">브랜드 상세 정보</h3>
              <p className="text-gray-600">브랜드에 대해 자세히 소개해주세요</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoPerson className="text-gray-400" />
                  상품 주요 타깃군
                </label>
                <textarea
                  {...register('targetCustomer')}
                  rows={3}
                  placeholder="예: 20-30대 여성, 트렌디한 의류를 선호하는 고객"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoDocumentText className="text-gray-400" />
                  상품 / 브랜드 소개
                </label>
                <textarea
                  {...register('brandDescription')}
                  rows={4}
                  placeholder="브랜드의 컨셉, 주요 상품의 특징, 차별화 포인트 등을 자세히 설명해주세요"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoDocumentText className="text-gray-400" />
                  브랜드 소개서 업로드 (PDF 최대 10MB)
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    {...register('brandPdf')} 
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 file:font-medium"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <IoDocumentText className="text-gray-400" />
                  기타 요청사항 (선택)
                </label>
                <textarea
                  {...register('etcRequest')}
                  rows={3}
                  placeholder="추가로 전달하고 싶은 내용이나 요청사항이 있으시면 입력해주세요"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* 제출 */}
          <div className="pt-8 border-t border-gray-100">
            <button
              disabled={submitted}
              className="group w-full py-5 rounded-2xl bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-xl"
            >
              <IoStorefront className="text-xl" />
              신청서 제출하기
              <IoArrowForward className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              제출 후 3-5일 내 담당자가 연락드립니다
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 