"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";
import Link from "next/link";
import Image from "next/image";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { PasswordResetModal } from "@/components/common/PasswordResetModal";

function SignInContent() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to") as string;

  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, isAutoLogin);
      alert("로그인에 성공했습니다.");

      if (to) {
        router.replace(atob(to));
      } else {
        router.replace(ROUTE.ADMIN_MAIN);
      }
    } catch (error: any) {
      // ADM-002: 구체적인 에러 메시지 표시
      const errorMessage = error?.response?.data?.message || error?.message || "로그인에 실패했습니다.";
      if (errorMessage.includes("가입되지 않은") || errorMessage.includes("비밀번호가 올바르지 않습니다")) {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      } else if (errorMessage.includes("계정이 잠금")) {
        alert(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href={ROUTE.MAIN} className="inline-block">
            <Image
              src="/image/itsmycolor-logo.png"
              alt="It&apos;s my color"
              width={200}
              height={50}
              className="h-10 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              어드민 로그인
            </h1>
            <p className="text-sm text-gray-600">시스템 관리를 위한 포털</p>
          </div>

          {/* Email Login Form */}
          <form onSubmit={onLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <div className="relative">
                <IoMailOutline
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <div className="relative">
                <IoLockClosedOutline
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={isAutoLogin}
                  onChange={() => setIsAutoLogin(!isAutoLogin)}
                />
                <span className="ml-2 text-sm text-gray-600">
                  로그인 상태 유지
                </span>
              </label>
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                비밀번호 찾기
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 관리자 페이지는 소셜 로그인 및 회원가입 기능이 필요 없으므로 해당 섹션을 제거했습니다. */}
        </div>

        {/* Password Reset Modal */}
        <PasswordResetModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
        />
        {/* Footer Links */}
        {/* <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-700">이용약관</Link>
            <span>|</span>
            <Link href="#" className="hover:text-gray-700">개인정보처리방침</Link>
            <span>|</span>
            <Link href="#" className="hover:text-gray-700">판매자 가이드</Link>
          </div>
          <p className="text-xs text-gray-400">© 2025 It&apos;s my color. All rights reserved.</p>
        </div> */}
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">로딩 중...</div>}>
      <SignInContent />
    </Suspense>
  );
}
