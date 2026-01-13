"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";
import { emailApi } from "@/serivces/email/request";
import Image from "next/image";
import { IoLockClosedOutline } from "react-icons/io5";

function FindPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!token) {
      alert("잘못된 접근입니다. 다시 시도해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await emailApi.resetPassword(token, password);
      alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인 해주세요.");
      router.replace(ROUTE.SIGNIN);
    } catch (error) {
      alert("비밀번호 변경에 실패했습니다. 링크가 만료되었거나 유효하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/image/itsmycolor-logo.png"
            alt="It&apos;s my color"
            width={200}
            height={50}
            className="h-12 w-auto mx-auto"
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">비밀번호 재설정</h1>
            <p className="text-gray-600">새 비밀번호를 입력해주세요</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <IoLockClosedOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>
            <div className="relative">
              <IoLockClosedOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "변경 중..." : "확인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function FindPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">로딩 중...</div>}>
      <FindPasswordPageContent />
    </Suspense>
  );
}