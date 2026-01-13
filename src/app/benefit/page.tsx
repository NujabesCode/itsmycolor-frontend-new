'use client';

import {
  IoTicketOutline,
} from 'react-icons/io5';

const BENEFITS = [
  {
    title: 'WELCOME10 쿠폰',
    description: '신규 회원을 위한 특별 할인',
    discount: '10%',
    conditions: [
      '회원가입 시 자동 발급',
      '최소 결제금액 30,000원 이상',
      '유효기간 7일',
    ],
    bgColor: 'bg-black',
    textColor: 'text-white',
    type: 'welcome'
  },
];

export default function Benefit() {
  return (
    <div className="min-h-screen bg-white">      
      {/* Hero Section - 모바일 최적화 */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 tracking-tight leading-tight">
              MEMBER
              <br className="sm:hidden" />
              <span className="sm:inline hidden"> </span>
              BENEFIT
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 whitespace-nowrap sm:whitespace-normal">
              잇츠마이컬러와 함께 특별한 혜택을 경험해보세요
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section - 회원가입 쿠폰만 표시 */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-3 sm:mb-4 tracking-wide">
              신규 회원 혜택
            </h2>
            <div className="w-16 sm:w-20 h-px bg-black mx-auto"></div>
          </div>

          <div className="max-w-md mx-auto">
            {BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="group border hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                <div className={`${benefit.bgColor} ${benefit.textColor} p-6 sm:p-8 min-h-[240px] sm:min-h-[260px] flex flex-col justify-between`}>
                  <div>
                    <div className="text-right mb-3 sm:mb-4">
                      <span className="text-3xl sm:text-4xl font-light">{benefit.discount}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 tracking-wide break-keep">
                      {benefit.title}
                    </h3>
                    <p className="text-sm opacity-80 mb-4 sm:mb-6 break-keep">
                      {benefit.description}
                    </p>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    {benefit.conditions.map((condition, idx) => (
                      <div key={idx} className="text-xs sm:text-sm opacity-70 flex items-start">
                        <div className="w-1 h-1 bg-current rounded-full mr-2 mt-1 flex-shrink-0"></div>
                        <span className="break-keep">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 안내 메시지 */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <IoTicketOutline size={20} />
              <p>쿠폰은 마이페이지에서 확인하실 수 있습니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="bg-gray-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-3 sm:mb-4 tracking-wide text-gray-400">
              COMING SOON
            </h2>
            <div className="w-16 sm:w-20 h-px bg-gray-300 mx-auto mb-8"></div>
            
            <div className="max-w-2xl mx-auto space-y-4 text-gray-500">
              <p className="text-sm sm:text-base">
                더 많은 혜택을 준비중입니다
              </p>
              <ul className="text-xs sm:text-sm space-y-2">
                <li>• 리뷰 작성 포인트 시스템</li>
                <li>• 첫 구매 고객 컨설팅 할인</li>
                <li>• 생일 축하 쿠폰</li>
                <li>• 베스트 리뷰어 추가 혜택</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - 모바일 최적화 */}
      <section className="bg-black text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 tracking-wide">
            지금 가입하고 10% 할인받으세요
          </h2>
          <p className="text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-sm sm:max-w-md md:max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            신규 회원가입 시 첫 구매 10% 할인 쿠폰을 즉시 발급해드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0">
            <a
              href="/sign-up"
              className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-white text-black font-medium text-sm sm:text-base tracking-wide hover:bg-gray-100 transition-colors rounded-sm"
            >
              회원가입
            </a>
            <a
              href="/shopping"
              className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 border border-white text-white font-medium text-sm sm:text-base tracking-wide hover:bg-white hover:text-black transition-colors rounded-sm"
            >
              쇼핑하기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}