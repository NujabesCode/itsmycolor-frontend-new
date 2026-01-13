"use client";

import { Product } from "@/serivces/product/type";
import { qnaApi } from "@/serivces/qna/request";
import { QnaType } from "@/serivces/qna/type";
import Image from "next/image";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";

export const QnaFormModal = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const [qnaType, setQnaType] = useState<QnaType>(QnaType.PRODUCT);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setPrivate] = useState(false);

  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      setTempFiles(files);
    }
  };

  const removeImage = (index: number) => {
    setTempFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      await qnaApi.createQna({
        type: qnaType,
        title,
        content,
        isPrivate,
        images: tempFiles,
        productId: product.id,
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY.QNA_LIST_BY_PRODUCT, product.id],
      });

      alert("문의가 등록되었습니다.");
      onClose();
    } catch {
      alert("문의 등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-[560px] bg-white rounded-lg shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">상품 문의하기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* 상품 정보 */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              <Image
                src={product.imageUrl}
                alt="상품 이미지"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500">{product.brand}</p>
              <p className="text-sm font-medium text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-600">{product.price.toLocaleString()}원</p>
            </div>
          </div>

          {/* 문의 유형 */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              문의 유형
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              value={qnaType}
              onChange={(e) => setQnaType(e.target.value as QnaType)}
            >
              {Object.values(QnaType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 내용 */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              rows={5}
              placeholder="문의하실 내용을 작성해주세요"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/1000</p>
          </div>

          {/* 사진 첨부 */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사진 첨부 (선택)
            </label>
            <div className="flex gap-2">
              {tempFiles.map((file, idx) => (
                <div key={idx} className="relative w-20 h-20">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`첨부 이미지 ${idx + 1}`}
                    fill
                    className="object-cover rounded border border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {tempFiles.length < 3 && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">최대 3장, 장당 5MB 이하</p>
          </div>

          {/* 비밀글 체크 */}
          <div className="flex items-center mb-6">
            <input
              id="private"
              type="checkbox"
              className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-0"
              checked={isPrivate}
              onChange={(e) => setPrivate(e.target.checked)}
            />
            <label htmlFor="private" className="ml-2 text-sm text-gray-700">
              비밀글로 문의하기
            </label>
            <span className="ml-2 text-xs text-gray-500">
              (작성자와 판매자만 확인 가능)
            </span>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3">
            <button
              className="flex-1 py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="flex-1 py-2.5 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              onClick={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? "등록 중..." : "문의 등록"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
