"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";
import { STORAGE } from "@/configs/constant/storage";
import Link from "next/link";
import Image from "next/image";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { PasswordResetModal } from "@/components/common/PasswordResetModal";
import { useGetUser } from "@/serivces/user/query";
import { UserRole } from "@/serivces/user/type";

function SignInContent() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to") as string;

  const router = useRouter();
  const { login } = useAuth();
  const [{ data: user, isLoading: isUserLoading }] = useGetUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // LG-007: 자동로그인 기능 - localStorage에 토큰이 있으면 자동으로 판매자 메인 페이지로 이동
  useEffect(() => {
    const token = localStorage.getItem(STORAGE.TOKEN);
    
    if (token && !isUserLoading && user) {
      // 판매자 권한이 있고 브랜드가 승인된 경우에만 자동 로그인
      if (user.role === UserRole.BRAND_ADMIN) {
        if (to) {
          router.replace(atob(to));
        } else {
          router.replace(ROUTE.SELLER_MAIN);
        }
      }
    }
  }, [user, isUserLoading, router, to]);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // LG-003: 비밀번호 미입력 시 구체적인 에러 메시지
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const { hasBrand, isBrandApproved } = await login(email, password, isAutoLogin);

      if (!hasBrand) {
        router.push(ROUTE.APPLY_NEW);
        alert("브랜드 입점 신청서를 작성해주세요.");
        return;
      }

      if (isBrandApproved) {
        // LG-008: 로그인 후 원래 보던 페이지로 복귀
        if (to) {
          router.replace(atob(to));
        } else {
          router.push(ROUTE.SELLER_MAIN);
        }
        return;
      } else {
        alert("브랜드 심사 중입니다.\n심사 완료 후 이메일로 심사 결과를 전달해드립니다.");
        return;
      }
    } catch (error: any) {
      // LG-004: 비밀번호 연속 5회 오류 시 잠금 메시지 표시
      const errorMessage = error?.response?.data?.message || error?.message || "로그인에 실패했습니다.";
      
      if (errorMessage.includes("비밀번호를 5회 이상") || errorMessage.includes("계정이 잠금")) {
        alert(errorMessage);
      } else if (errorMessage.includes("비밀번호가 올바르지 않습니다")) {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      } else if (errorMessage.includes("가입되지 않은")) {
        alert("가입되지 않은 계정입니다.");
      } else if (errorMessage.includes("권한이 없습니다") || errorMessage.includes("판매자 권한")) {
        // LG-002: 일반 고객 계정 로그인 시 판매자 권한 없음 메시지
        alert("판매자 권한이 없습니다. 판매자 계정으로 로그인해주세요.");
        router.push(ROUTE.APPLY_NEW);
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
              판매자 센터 로그인
            </h1>
            <p className="text-sm text-gray-600">비즈니스 성장의 파트너, It&apos;s my color</p>
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
                  placeholder="seller@example.com"
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

          {/* 소셜 로그인 옵션 제거 */}

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              아직 판매자 회원이 아니신가요?{" "}
              <Link
                href={to ? `${ROUTE.SELLER_SIGNUP}?to=${to}` : ROUTE.SELLER_SIGNUP}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                판매자 등록하기
              </Link>
            </p>
          </div>
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
