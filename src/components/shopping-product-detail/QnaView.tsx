"use client";

import React, { useState } from "react";
import { QnaFormModal } from "./QnaFormModal";
import { Product } from "@/serivces/product/type";
import { useGetQnaListByProduct } from "@/serivces/qna/query";
import { QnaStatus } from "@/serivces/admin/type";
import { Pagination } from "../common/Pagination";
import { formatDate } from "@/utils/date";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";

export const QnaView = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { getToken } = useAuth();

  const { data: qnasData } = useGetQnaListByProduct(product.id);

  const qnaList = qnasData?.qnas;
  const lastPage = qnasData?.lastPage;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedQnaId, setExpandedQnaId] = useState<string | null>(null);

  const toggleQnaContent = (qnaId: string) => {
    setExpandedQnaId(expandedQnaId === qnaId ? null : qnaId);
  };

  return (
    <div>
      {/* 상단: Q&A 타이틀, 문의하기 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Q&A</h2>
        <button
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors"
          onClick={() => {
            if (!getToken()) {
              alert("로그인이 필요한 기능입니다.");
              return router.push(ROUTE.SIGNIN);
            }
            setIsModalOpen(true);
          }}
        >
          문의하기
        </button>
      </div>

      {/* QnA 리스트 */}
      <div className="space-y-4">
        {qnaList?.map((qna, idx) => (
          <div
            key={"qna" + idx}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className={`p-4 ${
                !qna.isPrivate ? "cursor-pointer hover:bg-gray-50" : ""
              }`}
              onClick={() => !qna.isPrivate && toggleQnaContent(qna.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {qna.status === QnaStatus.ANSWERED ? (
                      <span className="inline-block px-2 py-1 bg-gray-900 text-white text-xs rounded">
                        답변완료
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        미답변
                      </span>
                    )}
                    <h3 className="text-sm font-medium text-gray-900">
                      {qna.isPrivate ? "비밀글입니다" : qna.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{qna.isPrivate ? "익명" : qna.user.name}</span>
                    <span>•</span>
                    <span>{formatDate(qna.createdAt)}</span>
                  </div>
                </div>
                {!qna.isPrivate && (
                  <div className="text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          expandedQnaId === qna.id
                            ? "M5 15l7-7 7 7"
                            : "M19 9l-7 7-7-7"
                        }
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* 확장된 내용 */}
            {!qna.isPrivate && expandedQnaId === qna.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="mb-3">
                  <span className="text-xs font-medium text-gray-700">Q.</span>
                  <p className="text-sm text-gray-700 mt-1">{qna.content}</p>
                </div>

                {qna.answer && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-xs font-medium text-gray-700">
                      A.
                    </span>
                    <p className="text-sm text-gray-900 mt-1">{qna.answer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* 빈 상태 */}
        {qnaList && qnaList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">문의 내역이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {lastPage ? (
        <div className="mt-8">
          <Pagination lastPage={lastPage} />
        </div>
      ) : null}

      {/* 문의 모달 */}
      {isModalOpen && (
        <QnaFormModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
