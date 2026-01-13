"use client";

import { SellerTabBar } from "@/components/common/SellerTabBar";
import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";
import { STORAGE } from "@/configs/constant/storage";
import { useGetUser } from "@/serivces/user/query";
import { UserRole } from "@/serivces/user/type";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [{ data: user, isLoading }] = useGetUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 로그인 페이지는 체크하지 않음
    if (pathname.startsWith(ROUTE.SELLER_SIGNIN) || pathname.startsWith(ROUTE.SELLER_SIGNUP)) {
      setIsChecking(false);
      return;
    }

    const token = localStorage.getItem(STORAGE.TOKEN) || sessionStorage.getItem(STORAGE.TOKEN);

    // LG-005: 비로그인 상태에서 판매자 페이지 접근 시 로그인 페이지로 리다이렉트
    if (!token) {
      alert("로그인이 필요합니다.");
      router.replace(`${ROUTE.SELLER_SIGNIN}?to=${btoa(pathname)}`);
      return;
    }

    // 사용자 정보가 로드되면 권한 확인
    if (!isLoading && user) {
      // LG-006: 일반 고객이 판매자 페이지 접근 시 차단
      if (user.role !== UserRole.BRAND_ADMIN) {
        if (user.role === UserRole.USER) {
          alert("판매자 권한이 없습니다. 판매자 계정으로 로그인해주세요.");
        } else {
          alert("브랜드 관리자 권한이 없거나 아직 심사 중입니다.");
        }
        router.replace(ROUTE.SELLER_SIGNIN);
        return;
      }
      setIsChecking(false);
    } else if (!isLoading && !user) {
      // 토큰은 있지만 사용자 정보를 가져올 수 없는 경우
      alert("로그인이 필요합니다.");
      router.replace(ROUTE.SELLER_SIGNIN);
    }
  }, [user, isLoading, pathname, router]);

  // 로그인 페이지는 바로 렌더링
  if (pathname.startsWith(ROUTE.SELLER_SIGNIN) || pathname.startsWith(ROUTE.SELLER_SIGNUP)) {
    return <>{children}</>;
  }

  // 권한 확인 중이거나 권한이 없으면 로딩 표시
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-grey-98">
      <div className="h-5" />

      <div className="max-w-[1280px] mx-auto">
        <SellerTabBar />

        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
