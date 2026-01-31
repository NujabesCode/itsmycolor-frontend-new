"use client";

import { useQueryString } from "@/hooks/common/useQueryString";
import { useEffect, useState } from "react";

interface PaginationProps {
  lastPage: number;
}

export const Pagination = ({ lastPage }: PaginationProps) => {
  // window.location.search에서 직접 page 값을 읽기
  const getPageFromUrl = () => {
    if (typeof window === 'undefined') return 1;
    try {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      if (pageParam) {
        const pageNum = parseInt(pageParam);
        if (!isNaN(pageNum) && pageNum >= 1) {
          return pageNum;
        }
      }
    } catch (e) {
      // 에러 무시
    }
    return 1;
  };

  const [page, setPageState] = useState<number>(getPageFromUrl());
  
  // URL 변경 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkUrlChange = () => {
      const currentPage = getPageFromUrl();
      if (currentPage !== page) {
        setPageState(currentPage);
      }
    };
    
    // 짧은 간격으로 URL 변경 확인
    const intervalId = setInterval(checkUrlChange, 50);
    
    // popstate 이벤트도 감지
    window.addEventListener('popstate', checkUrlChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('popstate', checkUrlChange);
    };
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      console.log('[Pagination] 페이지 변경:', { current: page, new: newPage, lastPage });
      
      // URL 직접 업데이트 (기존 쿼리 파라미터 유지)
      if (typeof window !== 'undefined') {
        const currentUrl = new URL(window.location.href);
        // 기존 쿼리 파라미터 모두 유지하면서 page만 업데이트
        currentUrl.searchParams.set('page', newPage.toString());
        
        // pathname만 사용 (도메인 제외)
        const pathname = currentUrl.pathname;
        const searchParams = currentUrl.searchParams.toString();
        const newUrl = `${pathname}${searchParams ? '?' + searchParams : ''}`;
        
        console.log('[Pagination] URL 업데이트:', { 
          old: window.location.href, 
          new: newUrl,
          searchParams: searchParams
        });
        
        // URL 업데이트 (페이지 리로드 없이)
        window.history.pushState({}, '', newUrl);
        
        // 상태 업데이트
        setPageState(newPage);
        
        // 짧은 딜레이 후 popstate 이벤트 발생시켜 다른 리스너들이 감지하도록 함
        setTimeout(() => {
          window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
        }, 10);
      }
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    // 이전 페이지 버튼
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        aria-label="이전 페이지"
      >
        <span className="sr-only">이전</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    );

    // 페이지 번호 버튼들
    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            page === i
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-label={`${i} 페이지`}
          aria-current={page === i ? "page" : undefined}
        >
          {i}
        </button>
      );
    }

    // 다음 페이지 버튼
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === lastPage}
        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        aria-label="다음 페이지"
      >
        <span className="sr-only">다음</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    );

    return pages;
  };

  return (
    <nav
      className="flex justify-center items-center gap-1 py-4"
      aria-label="페이지네이션"
    >
      {renderPageNumbers()}
    </nav>
  );
};
