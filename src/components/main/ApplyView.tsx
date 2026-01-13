"use client";

import { useRouter } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";

export const ApplyView = () => {
  const router = useRouter();

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-5xl font-light tracking-tight text-gray-900 mb-4 lg:mb-6">
              잇츠마이컬러 입점 신청
            </h2>
            <p className="text-base lg:text-lg text-gray-600 font-light mb-6 lg:mb-8">
              당신의 브랜드를 잇츠마이컬러와 함께 성장시켜보세요.
              <br />
              전문적인 분석과 함께 최적의 스타일을 제안합니다.
            </p>
          </div>

          <button
            className="w-full bg-gray-900 text-white py-3 lg:py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
            onClick={() => {
              router.push(ROUTE.MYPAGE_SELLER_APPLY);
            }}
          >
            입점 신청하기
          </button>
        </div>
      </div>
    </div>
  );
};
