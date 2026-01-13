"use client";

import { ROUTE } from "@/configs/constant/route";
import { useAuth } from "@/hooks/auth/useAuth";
import { authApi } from "@/serivces/auth/request";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { IoMailOutline, IoCallOutline, IoPersonOutline, IoLockClosedOutline } from "react-icons/io5";

function SignUpContent() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to") as string;
  const emailQuery = searchParams.get("email") as string;

  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isAgree, setIsAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (emailQuery) {
      setEmail(emailQuery);
    }
  }, [emailQuery]);

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !phone || !name || !password || !passwordConfirm) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (!RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (!RegExp(/^\d{10,11}$/).test(phone.replace(/[^0-9]/g, ""))) {
      alert("전화번호 형식이 올바르지 않습니다.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isAgree) {
      alert("이용약관 및 개인정보 처리방침에 동의해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register(email, password, passwordConfirm, name, phone.replace(/[^0-9]/g, ""));

      // 회원가입 후 자동 로그인 처리
      await login(email, password, false);

      alert("회원가입에 성공했습니다.");

      if (to) {
        router.replace(atob(to));
      } else {
        router.replace(ROUTE.ADMIN_MAIN); 
      }
    } catch (error) {
      alert("회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">계정 만들기</h1>
            <p className="text-gray-600">판매자 계정을 생성하세요</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={onRegister} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                placeholder="전화번호 (숫자만 입력)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            {/* Name */}
            <div className="relative">
              <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="비밀번호 (8자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            {/* Password Confirm */}
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            {/* Agreement */}
            <label className="flex items-center cursor-pointer select-none text-sm text-gray-600">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={isAgree}
                onChange={() => setIsAgree(!isAgree)}
              />
              <span className="ml-2">
                <span className="font-medium text-gray-800">[필수]</span> 이용약관 및 개인정보 처리방침에 동의합니다.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              이미 회원이신가요?{' '}
              <Link href={to ? `${ROUTE.ADMIN_SIGNIN}?to=${to}` : ROUTE.ADMIN_SIGNIN} className="text-blue-600 font-semibold hover:text-blue-700">
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 It&apos;s my color. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">로딩 중...</div>}>
      <SignUpContent />
    </Suspense>
  );
}