"use client";

import { QnaManageModal } from "@/components/seller-cs/QnaManageModal";
import { Qna, QnaStatus } from "@/serivces/admin/type";
import { useGetQnaListByBrand } from "@/serivces/qna/query";
import { useGetUser } from "@/serivces/user/query";
import { formatDate } from "@/utils/date";
import React, { useState } from "react";
import { IoHelpCircle, IoChatbubbleEllipses } from "react-icons/io5";

export default function SellerCs() {
  const [, , { data: brand }] = useGetUser();
  const { data: qnaList } = useGetQnaListByBrand(brand?.id ?? "");

  const [selectedQna, setSelectedQna] = useState<Qna | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-xl font-medium text-gray-900">고객 문의 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            전체 문의 {qnaList?.length || 0}건
          </p>
        </div>
      </div>

      {/* 문의 목록 */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    문의 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    고객
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    문의 유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    내용
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qnaList?.map((qna) => (
                  <tr key={qna.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          #{qna.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(qna.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{qna.user?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                        <IoHelpCircle className="text-gray-400" />
                        {qna.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 truncate max-w-xs">
                        {qna.content}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {qna.status === QnaStatus.ANSWERED ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          답변완료
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          대기중
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {qna.status === QnaStatus.ANSWERED ? (
                        <span className="text-sm text-gray-500">완료</span>
                      ) : (
                        <button
                          onClick={() => setSelectedQna(qna)}
                          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <IoChatbubbleEllipses className="text-lg" />
                          답변하기
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {(!qnaList || qnaList.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      문의 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 답변 모달 */}
      {selectedQna && (
        <QnaManageModal
          qna={selectedQna}
          onClose={() => setSelectedQna(null)}
        />
      )}
    </div>
  );
}
