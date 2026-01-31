"use client";

import { useEffect } from "react";
import { ROUTE } from "@/configs/constant/route";

/**
 * index.html로 리다이렉트된 경우 상품 상세 페이지로 리다이렉트하는 핸들러
 * RouterGuard보다 먼저 실행되어야 함
 */
export const ProductRedirectHandler = () => {
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    const pathname = window.location.pathname;
    const fullUrl = window.location.href;
    
    console.log('[ProductRedirectHandler] 시작:', {
      pathname,
      fullUrl
    });
    
    // 전체 URL에서 상품 ID 추출 시도
    // S3에서 404 발생 시 index.html로 리다이렉트되지만 브라우저 주소창에는 원래 URL이 표시됨
    const urlMatch = fullUrl.match(/\/shopping\/product\/([^\/\?\#]+)/);
    
    if (urlMatch && urlMatch[1]) {
      const extractedId = urlMatch[1].replace(/\.html$/, '');
      if (extractedId && extractedId !== 'dummy') {
        console.log('[ProductRedirectHandler] 전체 URL에서 ID 추출:', extractedId);
        
        // pathname이 / 또는 /index.html인 경우 URL만 복원
        // 메인 페이지에서 상품 상세 페이지를 렌더링하도록 함 (리다이렉트하지 않음)
        if (pathname === '/' || pathname === '/index.html') {
          const productDetailPath = `/shopping/product/${extractedId}.html`;
          console.log('[ProductRedirectHandler] URL 복원:', productDetailPath);
          // 페이지 리로드 없이 URL만 변경 (메인 페이지가 상품 상세 페이지를 렌더링함)
          window.history.replaceState({}, '', productDetailPath);
          return;
        }
      }
    }
    
    console.log('[ProductRedirectHandler] 상품 ID를 찾을 수 없음 또는 이미 올바른 경로');
  }, []);

  return null;
};
