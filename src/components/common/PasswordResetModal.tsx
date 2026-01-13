'use client';

import { useState } from 'react';
import { emailApi } from '@/serivces/email/request';
import { IoClose, IoMailOutline } from 'react-icons/io5';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordResetModal = ({ isOpen, onClose }: PasswordResetModalProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email) {
      alert('이메일을 입력해 주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      await emailApi.sendPasswordReset(email);
      alert('비밀번호 재설정 링크가 전송되었습니다. 이메일을 확인해 주세요.');
      setEmail('');
      onClose();
    } catch (error) {
      alert('해당 이메일로 가입된 계정이 없습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">비밀번호 재설정</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <IoClose size={20} className="text-gray-500" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-600">
            가입 시 사용한 이메일 주소를 입력해 주세요. 비밀번호 재설정 링크를 보내드립니다.
          </div>

          <div className="relative">
            <IoMailOutline
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              disabled={isSubmitting}
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? '전송 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}; 