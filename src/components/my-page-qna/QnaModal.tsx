"use client";

import { Qna } from "@/serivces/admin/type";

interface QnaModalProps {
  qna: Qna;
  onClose: () => void;
}

export const QnaModal = ({ qna, onClose }: QnaModalProps) => {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">문의 상세</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6">
          {/* 문의 정보 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-semibold text-gray-800">
                제목: {qna.title}
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  qna.status === "답변완료"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {qna.status}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs mr-2">
                {qna.type}
              </span>
              <span>{formatDate(qna.createdAt)}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{qna.content}</p>
            </div>
          </div>

          {/* 답변 섹션 */}
          {qna.answer && (
            <div className="mt-8">
              <h5 className="font-medium text-gray-700 mb-2">답변</h5>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {qna.answer}
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>답변일: {formatDate(qna.answeredAt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
