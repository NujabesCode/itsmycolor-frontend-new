"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";
import Link from "next/link";
import Image from "next/image";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { useSocialLogin } from "@/hooks/auth/useSocialLogin";
import { PasswordResetModal } from "@/components/common/PasswordResetModal";

function SignInContent() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to") as string;

  const router = useRouter();
  const { login } = useAuth();

  const { onKakaoLogin, onGoogleLogin, onNaverLogin } = useSocialLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, isAutoLogin);
      alert("로그인에 성공했습니다.");

      if (to) {
        router.replace(atob(to));
      } else {
        router.replace(ROUTE.MAIN);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "로그인에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={ROUTE.MAIN} className="inline-block">
            <Image
              src="/image/itsmycolor-logo.png"
              alt="It&apos;s my color"
              width={200}
              height={50}
              className="h-12 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">당신만의 스타일을 찾아드립니다</p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={onGoogleLogin}
            >
              <FcGoogle size={20} />
              <span className="text-sm font-medium text-gray-700">
                Google로 계속하기
              </span>
            </button>
            <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FEE500] rounded-xl hover:bg-[#FDD835] transition-colors"
              onClick={onKakaoLogin}
            >
              <RiKakaoTalkFill size={20} />
              <span className="text-sm font-medium text-gray-900">
                카카오로 계속하기
              </span>
            </button>
            <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#03C75A] rounded-xl hover:bg-[#02B350] transition-colors"
              onClick={onNaverLogin}
            >
              <SiNaver size={16} className="text-white" />
              <span className="text-sm font-medium text-white">
                네이버로 계속하기
              </span>
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={onLogin} className="space-y-4">
            <div className="relative">
              <IoMailOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
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
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                비밀번호 찾기
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              아직 회원이 아니신가요?{" "}
              <Link
                href={to ? `${ROUTE.SIGNUP}?to=${to}` : ROUTE.SIGNUP}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 It&apos;s my color. All rights reserved.</p>
        </div>
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
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
