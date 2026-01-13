"use client";

import { ROUTE } from "@/configs/constant/route";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

export const Footer = () => {
  const isAdmin = usePathname().includes(ROUTE.ADMIN_MAIN);

  if (isAdmin) return null;

  return (
    <footer className="w-full bg-white border-t" style={{ borderColor: 'var(--season_color_08)' }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-8">
          {/* 로고 및 소개 */}
          <div className="md:col-span-4 space-y-3">
            <Image
              src="/footer/logo.png"
              alt="It's my color Logo"
              width={180}
              height={36}
              className="mb-2"
            />
            <p className="text-xs text-gray-600 leading-relaxed" style={{ fontSize: '13px', color: 'var(--season_color_02)' }}>
              당신만의 퍼스널 컬러와 핏을 찾아<br />
              더 아름다운 스타일을 완성하세요.
            </p>
          </div>

          {/* 고객센터 */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-normal mb-4" style={{ color: 'var(--season_color_04)', fontSize: '13px' }}>
              고객센터
            </h3>
            <div className="space-y-2.5 text-xs" style={{ fontSize: '12px', color: 'var(--season_color_02)' }}>
                <Link
                  href={ROUTE.MYPAGE_QNA}
                className="block hover:opacity-70 transition-opacity"
                >
                  문의 내역
                </Link>
              <p className="text-gray-500">평일 10:00 - 18:00</p>
              <p className="text-gray-500">주말 및 공휴일 휴무</p>
              <a 
                href="mailto:itsmycolorlab@naver.com" 
                className="block hover:opacity-70 transition-opacity"
              >
                itsmycolorlab@naver.com
              </a>
            </div>
          </div>

          {/* 회사정보 */}
          <div className="md:col-span-5">
            <h3 className="text-xs font-normal mb-4" style={{ color: 'var(--season_color_04)', fontSize: '13px' }}>
              회사정보
            </h3>
            <div className="space-y-1.5 text-xs leading-relaxed" style={{ fontSize: '12px', color: 'var(--season_color_02)' }}>
              <p className="text-gray-600">대표이사: 안선주</p>
              <p className="text-gray-600">사업자등록번호: 163-44-00853</p>
              <p className="text-gray-600">통신판매업신고: 제2024-서울강남-1234호</p>
              <p className="text-gray-600">서울특별시 강남구 강남대로 128길 61 401호 (현성512 빌딩)</p>
            </div>
            
            {/* 소비자 안전거래 안내 */}
            <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--season_color_08)' }}>
              <p className="text-xs leading-relaxed text-gray-500" style={{ fontSize: '11px' }}>
                [소비자안전거래 안내]<br />
                잇츠마이컬러는 결제 시스템으로 제휴된 PG사의 소비자피해보상서비스를 적용하고 있습니다. 현금 결제 없이도 안전하게 결제하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 하단 링크 및 저작권 */}
        <div className="pt-6 border-t" style={{ borderColor: 'var(--season_color_08)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ fontSize: '12px' }}>
              <Link
                href={ROUTE.MAIN}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                홈
              </Link>
              <Link
                href={ROUTE.SHOPPING}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                쇼핑
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                이용약관
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                개인정보처리방침
              </Link>
            </div>
            <div className="text-xs text-gray-500" style={{ fontSize: '12px' }}>
              © 2025 It's my color. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};