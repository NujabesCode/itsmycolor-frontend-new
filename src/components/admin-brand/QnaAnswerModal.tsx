"use client";

import React, { useState } from "react";
import { Qna } from "@/serivces/admin/type";
import { adminApi } from "@/serivces/admin/request";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";

interface QnaAnswerModalProps {
  qna: Qna;
  onClose: () => void;
}

export const QnaAnswerModal = ({ qna, onClose }: QnaAnswerModalProps) => {
  const queryClient = useQueryClient();

  const [answer, setAnswer] = useState("");

  const onAnswer = async () => {
    try {
      await adminApi.postQnaAnswer(qna.id, answer);
      await queryClient.invalidateQueries({
        queryKey: [QUERY.ADMIN_QNA_LIST],
      });

      alert("답변이 등록되었습니다.");
      onClose();
    } catch (error) {
      alert("답변 등록에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">고객 문의 답변하기</h3>
          <button onClick={onClose}>X</button>
        </div>
        <div className="mb-2">고객명: {qna.user.name}</div>
        <div className="mb-2">제목: {qna.title}</div>
        <div className="mb-2">문의 내용: {qna.content}</div>
        <textarea
          className="w-full border rounded p-2 mb-4"
          placeholder="고객 문의에 대해 친절하게 답변해 주세요."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-[#2563eb] text-white px-4 py-2 rounded"
            onClick={onAnswer}
          >
            답변 등록
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
