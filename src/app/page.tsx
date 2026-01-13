import { Suspense } from "react";
import Link from "next/link";
import { ROUTE } from "@/configs/constant/route";
import { ProductView } from "@/components/main/ProductView";
import { ProductMainView, BodyTypeView } from "@/components/main/ProductMainView";
import { BannerSlider } from "@/components/main/BannerSlider";
import { UserRecommendView } from "@/components/main/UserRecommendView";

export default function Main() {
  return (
    <main className="min-h-screen bg-white">
      {/* Main Banner Slider */}
      <BannerSlider />

      {/* 나만의 스타일 발견 - attrangs 스타일 */}
      <section className="py-12 md:py-16 bg-white border-t" style={{ borderColor: 'var(--season_color_08)' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8" style={{ color: 'var(--season_color_01)', letterSpacing: '0.05em' }}>
              IT&apos;S MY COLOR
            </h2>
            <div className="space-y-4 md:space-y-5 max-w-2xl mx-auto mb-8 md:mb-10">
              <p className="text-xl md:text-2xl font-light leading-relaxed" style={{ color: 'var(--season_color_01)' }}>
                퍼스널컬러를 기준으로 옷을 제안합니다.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed" style={{ color: 'var(--season_color_04)' }}>
                복잡한 선택 대신 나에게 어울리는 색만 남겨 쇼핑이 편안해지도록.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed" style={{ color: 'var(--season_color_04)' }}>
                당신의 색이 가장 자연스럽게 빛나도록 곁에서 함께하겠습니다.
              </p>
            </div>
          </div>
          
          <div className="mb-6 md:mb-8 text-center">
            <h3 className="text-xl md:text-2xl font-normal mb-2" style={{ color: 'var(--season_color_01)' }}>나만의 스타일 발견</h3>
            <p className="text-base md:text-lg mb-6 md:mb-8" style={{ color: 'var(--season_color_04)' }}>퍼스널 컬러와 체형을 분석하여 나에게 맞는 스타일을 찾아보세요</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href={ROUTE.COLOR_TEST}
              className="flex-1 bg-white border border-gray-300 text-black px-6 py-4 text-center text-sm md:text-base font-normal hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--season_color_08)' }}
            >
              컬러별 진단하기
            </Link>
            <Link
              href={ROUTE.TYPETEST}
              className="flex-1 bg-white border border-gray-300 text-black px-6 py-4 text-center text-sm md:text-base font-normal hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--season_color_08)' }}
            >
              체형별 진단하기
            </Link>
          </div>
        </div>
      </section>

      {/* BEST Products - attrangs 스타일 */}
      <section className="py-8 md:py-10 bg-white border-t" style={{ borderColor: 'var(--season_color_08)' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-5 md:mb-6 text-center">
            <h2 className="text-lg md:text-xl font-normal" style={{ color: 'var(--season_color_04)' }}>BEST</h2>
          </div>
          <Suspense fallback={<div className="h-80 bg-gray-50" />}>
            <ProductView type="all" />
          </Suspense>
        </div>
      </section>

      {/* 퍼스널 컬러별 추천 */}
      <section className="py-8 md:py-10 bg-white border-t" style={{ borderColor: 'var(--season_color_08)' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-5 md:mb-6 text-center">
            <h2 className="text-lg md:text-xl font-normal" style={{ color: 'var(--season_color_04)' }}>퍼스널 컬러별 추천</h2>
          </div>
          <Suspense fallback={<div className="h-80 bg-gray-50" />}>
            <ProductMainView />
          </Suspense>
        </div>
      </section>

      {/* 체형별 추천 */}
      <section className="py-8 md:py-10 bg-white border-t" style={{ borderColor: 'var(--season_color_08)' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-5 md:mb-6 text-center">
            <h2 className="text-lg md:text-xl font-normal" style={{ color: 'var(--season_color_04)' }}>체형별 추천</h2>
          </div>
          <Suspense fallback={<div className="h-80 bg-gray-50" />}>
            <BodyTypeView />
          </Suspense>
        </div>
      </section>

      {/* 신규상품 Section - attrangs 스타일 */}
      <section className="py-8 md:py-10 bg-white border-t" style={{ borderColor: 'var(--season_color_08)' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-5 md:mb-6 text-center">
            <h2 className="text-lg md:text-xl font-normal" style={{ color: 'var(--season_color_04)' }}>신규상품</h2>
          </div>
          <Suspense fallback={<div className="h-80 bg-gray-50" />}>
            <ProductView type="new" />
          </Suspense>
        </div>
      </section>

      {/* For You Section - attrangs 스타일 */}
      <section className="py-8 md:py-10 bg-white border-t" style={{ borderColor: 'var(--season_color_08)' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-5 md:mb-6 text-center">
            <h2 className="text-lg md:text-xl font-normal" style={{ color: 'var(--season_color_04)' }}>나를 위한 추천</h2>
          </div>
          <Suspense fallback={<div className="h-80 bg-gray-50" />}>
            <UserRecommendView />
          </Suspense>
        </div>
      </section>

      {/* 서비스 안내 - attrangs 스타일 */}
      <section className="py-12 md:py-16 bg-white border-t" style={{ borderColor: 'var(--season_color_08)' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={ROUTE.CONSULTING}
              className="bg-white border border-gray-200 p-6 text-center hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--season_color_08)' }}
            >
              <div className="text-2xl mb-3">💬</div>
              <h3 className="text-sm md:text-base font-normal mb-2" style={{ color: 'var(--season_color_01)' }}>컨설팅 예약하기</h3>
              <p className="text-xs text-gray-600" style={{ color: 'var(--season_color_04)' }}>1:1 퍼스널 컬러 컨설팅</p>
            </Link>
            <Link
              href={ROUTE.MYPAGE_SELLER_APPLY}
              className="bg-white border border-gray-200 p-6 text-center hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--season_color_08)' }}
            >
              <div className="text-2xl mb-3">🏪</div>
              <h3 className="text-sm md:text-base font-normal mb-2" style={{ color: 'var(--season_color_01)' }}>입점 신청하기</h3>
              <p className="text-xs text-gray-600" style={{ color: 'var(--season_color_04)' }}>브랜드 입점 신청</p>
            </Link>
            <Link
              href={ROUTE.MYPAGE_QNA}
              className="bg-white border border-gray-200 p-6 text-center hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--season_color_08)' }}
            >
              <div className="text-2xl mb-3">✉️</div>
              <h3 className="text-sm md:text-base font-normal mb-2" style={{ color: 'var(--season_color_01)' }}>일대일 문의</h3>
              <p className="text-xs text-gray-600" style={{ color: 'var(--season_color_04)' }}>문의하기</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
