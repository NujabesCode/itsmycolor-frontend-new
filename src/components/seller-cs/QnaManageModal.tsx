"use client";

import { QUERY } from "@/configs/constant/query";
import { Qna } from "@/serivces/admin/type";
import { qnaApi } from "@/serivces/qna/request";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const QnaManageModal = ({
  qna,
  onClose,
}: {
  qna: Qna;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState("");

  const onSubmit = async () => {
    if (!answer) return alert("답변을 입력해주세요.");

    try {
      await qnaApi.postQnaAnswer(qna.id, answer);

      await queryClient.invalidateQueries({
        queryKey: [QUERY.QNA_LIST_BY_BRAND],
      });

      alert("답변이 등록되었습니다.");
      onClose();
    } catch (error) {
      alert("답변 등록에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white-solid rounded-md shadow-lg max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-grey-90">
          <h3 className="text-lg font-medium">고객 문의 답변하기</h3>
          <button onClick={onClose} className="text-grey-33 hover:text-grey-11">
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

        {/* 모달 내용 */}
        <div className="p-4">
          <div className="mb-4">
            <div className="text-sm text-grey-33 mb-1">고객명</div>
            <div className="font-medium">{qna?.user?.name}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-grey-33 mb-1">문의 제목</div>
            <div className="p-3 bg-grey-97 rounded-md">{qna?.title}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-grey-33 mb-1">문의 내용</div>
            <div className="p-3 bg-grey-97 rounded-md">{qna?.content}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-grey-33 mb-1">답변 작성</div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 border border-grey-90 rounded-md resize-none h-24 focus:outline-none focus:ring-1 focus:ring-azure-48"
              placeholder="고객 문의에 대해 친절하게 답변해주세요."
            />
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="flex justify-end gap-2 p-4 border-t border-grey-90">
          <button
            onClick={onClose}
            className="px-4 py-2 text-grey-33 bg-grey-97 rounded-md hover:bg-grey-90"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-white-solid bg-azure-48 rounded-md hover:bg-azure-35"
          >
            답변 등록
          </button>
        </div>
      </div>
    </div>
  );
};
