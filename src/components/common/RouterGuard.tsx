"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ROUTE } from "@/configs/constant/route";
import { STORAGE } from "@/configs/constant/storage";
import { useGetUser } from "@/serivces/user/query";
import { UserRole } from "@/serivces/user/type";

export const RouterGuard = () => {
  const [{ data: user }] = useGetUser();

  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const to = `${pathname}?${queryString}`;

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    // 상품 상세 페이지 관련 처리는 ProductRedirectHandler에서 처리하므로 여기서는 제외
    // pathname이 /shopping/product/로 시작하는 경우는 RouterGuard에서 처리하지 않음
    if (pathname.includes('/shopping/product/')) {
      return;
    }
    
    // index.html로 리다이렉트된 경우 전체 URL에서 상품 ID 확인
    if (pathname === '/' || pathname === '/index.html') {
      const fullUrl = window.location.href;
      const hash = window.location.hash;
      
      // 상품 상세 페이지로 리다이렉트되는 경우는 ProductRedirectHandler에서 처리
      if (fullUrl.includes('/shopping/product/') || hash.includes('/shopping/product/')) {
        return;
      }
    }
    
    let token: string | null = null;
    try {
      token =
        localStorage.getItem(STORAGE.TOKEN) ||
        sessionStorage.getItem(STORAGE.TOKEN);
    } catch (error) {
      console.error('[RouterGuard] Storage access error:', error);
      return;
    }

    // admin 페이지 접근 시 권한 확인 (AdminLayout에서도 처리하지만 이중 체크)
    if (pathname.startsWith(ROUTE.ADMIN_MAIN) && !pathname.startsWith(ROUTE.ADMIN_SIGNIN) && !pathname.startsWith(ROUTE.ADMIN_SIGNUP)) {
      if (!token) {
        alert("로그인이 필요합니다.");
        // 정적 export 모드에서는 .html 확장자 추가
        return router.replace(`${ROUTE.ADMIN_SIGNIN}.html?to=${btoa(to)}`);
      }

      if (user && user.role !== UserRole.SYSTEM_ADMIN) {
        // ADM-004, ADM-005: 구체적인 메시지 표시
        if (user.role === UserRole.BRAND_ADMIN) {
          alert("관리자 전용 페이지입니다. 판매자 계정으로는 접근할 수 없습니다.");
        } else {
          alert("관리자 전용 페이지입니다. 접근 권한이 없습니다.");
        }
        return router.replace(ROUTE.MAIN);
      }
    }

    // seller 페이지 접근 시 권한 확인
    if (pathname.startsWith(ROUTE.SELLER_MAIN) && !pathname.startsWith(ROUTE.SELLER_SIGNUP) && !pathname.startsWith(ROUTE.SELLER_SIGNIN)) {
      if (!token) {
        alert("로그인이 필요합니다.");
        // 정적 export 모드에서는 .html 확장자 추가
        return router.replace(`${ROUTE.SELLER_SIGNIN}.html?to=${btoa(to)}`);
      }

      if (user && user.role !== UserRole.BRAND_ADMIN) {
        alert("브랜드 관리자 권한이 없거나 아직 심사 중입니다.");
        // 정적 export 모드에서는 .html 확장자 추가
        return router.replace(`${ROUTE.SELLER_SIGNIN}.html?to=${btoa(to)}`);
      }
    }

    // private 페이지 접근 시 로그인 확인
    if (
      pathname === ROUTE.TYPETEST ||
      pathname === ROUTE.COLOR_TEST ||
      pathname.startsWith(ROUTE.SHOPPING_ORDER_MAIN) ||
      pathname.startsWith(ROUTE.MYPAGE) ||
      pathname.startsWith(ROUTE.PAYMENT_MAIN)
    ) {
      if (!token) {
        alert("로그인이 필요합니다.");

        if (pathname.startsWith(ROUTE.MYPAGE_SELLER_APPLY)) {
          // 정적 export 모드에서는 .html 확장자 추가
        return router.replace(`${ROUTE.SELLER_SIGNIN}.html?to=${btoa(to)}`);
        } else {
          // 정적 export 모드에서는 .html 확장자 추가
          return router.replace(`${ROUTE.SIGNIN}.html?to=${btoa(to)}`);
        }
      }
    }
  }, [router, pathname, to, user]);

  return null;
};
