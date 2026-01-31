"use client";

import AdminSideBar from "@/components/common/AdminSideBar";
import { Suspense, useEffect, useState, useRef } from "react";
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
  const hasRedirected = useRef(false); // 리다이렉트 여부 추적
  const lastCheckedPathname = useRef<string>(''); // 마지막으로 체크한 경로 저장
  
  // pathname에서 쿼리 파라미터 제거
  // usePathname()은 일반적으로 쿼리 파라미터를 포함하지 않지만, 안전을 위해 제거
  const cleanPathname = pathname.split('?')[0];
  
  // sessionStorage에 권한 확인 상태 저장 (페이지 리로드 후에도 유지)
  const getHasCheckedAuth = () => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('admin_auth_checked') === 'true';
  };
  
  const setHasCheckedAuth = (value: boolean) => {
    if (typeof window === 'undefined') return;
    if (value) {
      sessionStorage.setItem('admin_auth_checked', 'true');
    } else {
      sessionStorage.removeItem('admin_auth_checked');
    }
  };

  useEffect(() => {
    // 로그인 페이지는 체크하지 않음 (쿼리 파라미터 제거한 경로로 비교)
    if (cleanPathname.startsWith(ROUTE.ADMIN_SIGNIN) || cleanPathname.startsWith(ROUTE.ADMIN_SIGNUP)) {
      setIsChecking(false);
      hasRedirected.current = false; // 로그인 페이지에서는 리셋
      setHasCheckedAuth(false); // 권한 확인도 리셋
      lastCheckedPathname.current = ''; // 경로 체크 리셋
      return;
    }

    // 이미 리다이렉트했으면 실행하지 않음
    if (hasRedirected.current) {
      return;
    }

    const token = localStorage.getItem(STORAGE.TOKEN) || sessionStorage.getItem(STORAGE.TOKEN);

    // 토큰이 없으면 즉시 로그인 페이지로 리다이렉트
    if (!token) {
      hasRedirected.current = true; // 리다이렉트 플래그 설정
      setIsChecking(false);
      alert("로그인이 필요합니다.");
      // 정적 export 모드에서는 .html 확장자 추가
      window.location.href = `${ROUTE.ADMIN_SIGNIN}.html?to=${btoa(pathname)}`;
      return;
    }

    // 사용자 정보가 아직 로딩 중이면 대기 (새로고침 시 중요)
    if (isLoading) {
      return;
    }

    // 사용자 정보가 로드된 후 권한 확인
    if (user) {
      // 이미 권한이 확인되었고 유효한 경우 체크하지 않음 (새로고침 시 현재 페이지 유지)
      if (getHasCheckedAuth() && user.role === UserRole.SYSTEM_ADMIN) {
        lastCheckedPathname.current = cleanPathname; // 현재 경로 저장
        setIsChecking(false);
        return;
      }

      // 권한 확인 완료 표시
      setHasCheckedAuth(true);
      lastCheckedPathname.current = cleanPathname; // 현재 경로 저장
      
      if (user.role !== UserRole.SYSTEM_ADMIN) {
        hasRedirected.current = true; // 리다이렉트 플래그 설정
        setIsChecking(false);
        setHasCheckedAuth(false); // 권한 확인 상태 리셋
        lastCheckedPathname.current = ''; // 경로 체크 리셋
        alert("관리자 전용 페이지입니다. 접근 권한이 없습니다.");
        window.location.href = `${ROUTE.ADMIN_SIGNIN}.html`;
        return;
      }
      setIsChecking(false);
    } else {
      // 토큰은 있지만 사용자 정보를 가져올 수 없는 경우
      hasRedirected.current = true; // 리다이렉트 플래그 설정
      setIsChecking(false);
      setHasCheckedAuth(false); // 권한 확인 상태 리셋
      lastCheckedPathname.current = ''; // 경로 체크 리셋
      alert("로그인이 필요합니다.");
      // 정적 export 모드에서는 .html 확장자 추가
      window.location.href = `${ROUTE.ADMIN_SIGNIN}.html`;
    }
    // cleanPathname은 의존성에서 제거하여 쿼리 파라미터 변경 시 재실행하지 않도록 함
    // 경로 변경은 lastCheckedPathname ref로 확인
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // 로그인 페이지는 바로 렌더링 (쿼리 파라미터 제거한 경로로 비교)
  if (cleanPathname.startsWith(ROUTE.ADMIN_SIGNIN) || cleanPathname.startsWith(ROUTE.ADMIN_SIGNUP)) {
    return <>{children}</>;
  }

  // 권한 확인 중이거나 권한이 없으면 로딩 표시
  // 새로고침 시: 토큰이 있고 사용자 정보가 로딩 중이면 대기
  // 이미 권한이 확인된 경우는 제외
  const token = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE.TOKEN) || sessionStorage.getItem(STORAGE.TOKEN)) : null;
  
  if (!getHasCheckedAuth() && (isChecking || (isLoading && token) || (!user && token))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">권한을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 권한이 없으면 리다이렉트 (이미 useEffect에서 처리되지만 안전장치)
  if (getHasCheckedAuth() && user && user.role !== UserRole.SYSTEM_ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">접근 권한이 없습니다.</p>
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
