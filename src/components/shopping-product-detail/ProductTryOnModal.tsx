"use client";

import { useState } from "react";
import Image from "next/image";
import { productApi } from "@/serivces/product/request";

export const ProductTryOnModal = ({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) => {
  const [isLoading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [isShowAnswerImage, setShowAnswerImage] = useState(false);
  const [answerImageUrl, setAnswerImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (answerImageUrl) {
      onClose();
      return;
    }

    if (!selectedImage) return alert("사진을 첨부해주세요");

    try {
      setLoading(true);

      const resultImageUrl = await productApi.createProductTryOnImage({
        productId,
        userImage: selectedImage,
      });

      setAnswerImageUrl(resultImageUrl);
    } catch {
      alert("시착 사진 업로드에 실패했습니다. 다른 이미지로 시도해주세요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-black mb-4">시착 사진 확인</h2>
        <p className="text-gray-600 mb-6">
          {selectedImage
            ? "시착 완료 버튼을 눌러주세요"
            : "사진을 첨부해주세요"}
        </p>

        {/* 이미지 업로드 영역 */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          {answerImageUrl ? (
            <div className="relative w-full h-48">
              <Image
                src={answerImageUrl}
                alt="시착 사진"
                fill
                className="object-contain"
                quality={70}
                onLoad={() => setShowAnswerImage(true)}
              />
            </div>
          ) : selectedImage ? (
            <div className="relative w-full h-48">
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt="업로드된 이미지"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <>
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-center">
                사진을 클릭하거나 드래그하여 추가 (1장 업로드)
              </p>
            </>
          )}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            취소
          </button>
          <button
            className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {answerImageUrl ? "닫기" : "시착 완료"}
          </button>
        </div>
      </div>

      {(isLoading || (answerImageUrl && !isShowAnswerImage)) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-grey-20 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
