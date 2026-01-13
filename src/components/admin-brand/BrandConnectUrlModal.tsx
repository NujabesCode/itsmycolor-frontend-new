"use client";

import { IoClose, IoCopy } from "react-icons/io5";

interface BrandConnectUrlModalProps {
  url: string;
  onClose: () => void;
}

export const BrandConnectUrlModal = ({ url, onClose }: BrandConnectUrlModalProps) => {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("URL이 복사되었습니다.");
    } catch (error) {
      alert("복사에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-96 text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">가입 URL</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <IoClose />
          </button>
        </div>
        <textarea
          readOnly
          value={url}
          className="w-full border border-gray-700 bg-gray-800 rounded p-2 mb-2 text-sm resize-none h-24 text-white"
        />
        <p className="text-xs text-gray-400 mb-4">⚠️ 120시간 뒤 만료됩니다.</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCopy}
            className="flex items-center gap-1 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            <IoCopy /> 복사
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};