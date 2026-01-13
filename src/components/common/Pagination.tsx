"use client";

import { useQueryString } from "@/hooks/common/useQueryString";

interface PaginationProps {
  lastPage: number;
}

export const Pagination = ({ lastPage }: PaginationProps) => {
  const [page, setPage] = useQueryString<number>("page", 1);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setPage(page);
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
