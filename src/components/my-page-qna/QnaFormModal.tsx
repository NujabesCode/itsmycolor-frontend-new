'use client';

import { QUERY } from '@/configs/constant/query';
import { qnaApi } from '@/serivces/qna/request';
import { QnaType } from '@/serivces/qna/type';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface QnaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QnaFormModal = ({ isOpen, onClose }: QnaFormModalProps) => {
  const queryClient = useQueryClient();

  const [type, setType] = useState<QnaType>(QnaType.BODY);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await qnaApi.createQna({
        title,
        content,
        type,
        isPrivate: false,
      });
      await queryClient.invalidateQueries({
        queryKey: [QUERY.QNA_LIST_BY_USER],
      });

      alert('문의가 등록되었습니다.');

      // 폼 초기화
      setTitle('');
      setContent('');
      setType(QnaType.BODY);
      onClose();
    } catch (error) {
      alert('문의 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Q&A 문의하기</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-6">
          {/* 탭 버튼 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setType(QnaType.BODY)}
              className={`flex-1 px-4 py-2 text-sm rounded-lg border font-medium transition-all ${
                type === QnaType.BODY
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              체형 문의
            </button>
            <button
              onClick={() => setType(QnaType.COLOR)}
              className={`flex-1 px-4 py-2 text-sm rounded-lg border font-medium transition-all ${
                type === QnaType.COLOR
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              퍼스널컬러 문의
            </button>
          </div>

          {/* 제목 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="제목을 입력해 주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 내용 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={5}
              placeholder="문의하실 내용을 자세히 작성해 주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
