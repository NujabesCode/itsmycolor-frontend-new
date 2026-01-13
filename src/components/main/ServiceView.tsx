import { ROUTE } from '@/configs/constant/route';
import Image from 'next/image';
import Link from 'next/link';

const SERVICE_ITEMS = [
  {
    image: '/main/new-service1.png',
    title: '무료 퍼스널 컬러 분석',
    description: '당신만의 특별한 컬러를 찾아드립니다',
  },
  {
    image: '/main/new-service2.png',
    title: '무료 체형 분석',
    description: '체형에 맞는 최적의 스타일링',
  },
  {
    image: '/main/new-service3.png',
    title: '무료 시착 체험',
    description: '실제 착용 효과 미리보기',
  },
  {
    image: '/main/new-service4.png',
    title: '체형 맞춤 의류 추천',
    description: '개인 맞춤형 스타일 제안',
  },
];

export const ServiceView = () => {
  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 lg:mb-16">
          <h1 className="text-3xl lg:text-6xl font-light tracking-tight text-gray-900 mb-4 lg:mb-6">
            당신만의 특별한 스타일
          </h1>
          <p className="text-base lg:text-xl text-gray-600 font-light max-w-3xl mx-auto">
            10년차 전문가의 체형 및 퍼스널컬러 분석으로
            <br />
            당신만의 완벽한 스타일을 찾아보세요
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-10 lg:mb-16">
          {SERVICE_ITEMS.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-1 lg:mb-2">{item.title}</h3>
                <p className="text-gray-600 text-xs lg:text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={ROUTE.TYPETEST}
            className="inline-flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors duration-300"
          >
            체형 분석 시작하기
            <svg className="ml-2 w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
