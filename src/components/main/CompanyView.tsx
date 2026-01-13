'use client';

import Image from 'next/image';

export const CompanyView = () => {
  const handleDownload = () => {
    // PDF 파일 다운로드 처리
    const link = document.createElement('a');
    link.href = '/main/itsmycolor.pdf';
    link.download = 'itsmycolor.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl mb-10 lg:mb-16">
          <div className="aspect-[16/9] relative">
            <Image src="/main/company.jpg" alt="company" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 lg:mb-4">
              잇츠마이컬러 회사 소개서
            </h2>
            <p className="text-base lg:text-lg text-gray-600 font-light">본연의 나를 찾을 수 있는 시간</p>
          </div>

          <button
            onClick={handleDownload}
            className="group inline-flex items-center gap-2 lg:gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Image
              src="/main/download.svg"
              alt="download"
              width={20}
              height={20}
              className="group-hover:scale-110 transition-transform duration-300 lg:w-6 lg:h-6"
            />
            <span className="text-gray-900 text-sm lg:text-base font-medium">회사소개서 다운로드</span>
          </button>
        </div>
      </div>
    </div>
  );
};
