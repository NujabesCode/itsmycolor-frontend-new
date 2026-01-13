"use client";

import AdminSideBar from "@/components/common/AdminSideBar";
import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";
import { STORAGE } from "@/configs/constant/storage";
import { useGetUser } from "@/serivces/user/query";
import { UserRole } from "@/serivces/user/type";

export default function AdminLayout({
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
    if (pathname.startsWith(ROUTE.ADMIN_SIGNIN) || pathname.startsWith(ROUTE.ADMIN_SIGNUP)) {
      setIsChecking(false);
      return;
    }

    const token = localStorage.getItem(STORAGE.TOKEN) || sessionStorage.getItem(STORAGE.TOKEN);

    // ADM-004, ADM-005: 권한 검증 즉시 처리
    if (!token) {
      alert("로그인이 필요합니다.");
      router.replace(`${ROUTE.ADMIN_SIGNIN}?to=${btoa(pathname)}`);
      return;
    }

    // 사용자 정보가 로드되면 권한 확인
    if (!isLoading && user) {
      if (user.role !== UserRole.SYSTEM_ADMIN) {
        alert("관리자 전용 페이지입니다. 접근 권한이 없습니다.");
        router.replace(ROUTE.MAIN);
        return;
      }
      setIsChecking(false);
    } else if (!isLoading && !user) {
      // 토큰은 있지만 사용자 정보를 가져올 수 없는 경우
      alert("로그인이 필요합니다.");
      router.replace(ROUTE.ADMIN_SIGNIN);
    }
  }, [user, isLoading, pathname, router]);

  // 로그인 페이지는 바로 렌더링
  if (pathname.startsWith(ROUTE.ADMIN_SIGNIN) || pathname.startsWith(ROUTE.ADMIN_SIGNUP)) {
    return <>{children}</>;
  }

  // 권한 확인 중이거나 권한이 없으면 로딩 표시
  if (isChecking || isLoading || !user || user.role !== UserRole.SYSTEM_ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">권한을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSideBar />

      <Suspense>
        <div className="flex-1">{children}</div>
      </Suspense>
    </div>
  );
}
