"use client";

import { Step1 } from "@/components/sign-up/Step1";
import { Step2 } from "@/components/sign-up/Step2";
import { ROUTE } from "@/configs/constant/route";
import { useAuth } from "@/hooks/auth/useAuth";
import { ColorSeason } from "@/serivces/color-analysis/type";
import { BodyType } from "@/serivces/user/type";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";

export interface SignUpFormFields {
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  name: string;
  height: string;
  weight: string;
  boneType?: BodyType | null;
  personalColor?: ColorSeason | null;
}

function SignUpContent() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to") as string;
  const email = searchParams.get("email") as string;

  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignUpFormFields>({
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    name: "",
    height: "",
    weight: "",
  });

  const onCompleteStep1 = async () => {
    const { email, phone, password, passwordConfirm } = formData;

    // 필수 입력값 검증
    if (!email.trim()) {
      return alert("이메일을 입력해주세요.");
    }
    if (!phone.trim()) {
      return alert("전화번호를 입력해주세요.");
    }
    if (!password.trim()) {
      return alert("비밀번호를 입력해주세요.");
    }
    if (!passwordConfirm.trim()) {
      return alert("비밀번호 확인을 입력해주세요.");
    }

    // 이메일 형식 검증
    if (!RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)) {
      return alert("올바른 이메일 형식이 아닙니다.");
    }

    // 전화번호 형식 검증
    if (!RegExp(/^\d{10,11}$/).test(phone.replace(/[^0-9]/g, ""))) {
      return alert("전화번호 형식이 올바르지 않습니다.");
    }

    // 비밀번호 정책 검증 (8자 이상, 영문, 숫자, 특수문자 포함)
    if (password.length < 8) {
      return alert("비밀번호는 8자 이상이어야 합니다.");
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return alert("비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.");
    }

    // 비밀번호 일치 검증
    if (password !== passwordConfirm) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    // 이메일 중복 체크
    try {
      const { userApi } = await import("@/serivces/user/request");
      const { isAvailable, message } = await userApi.checkEmail(email);
      if (!isAvailable) {
        return alert(message);
      }
    } catch (error: any) {
      if (error?.response?.status === 409 || error?.response?.data?.message?.includes("이미 가입된")) {
        return alert("이미 가입된 이메일입니다.");
      }
      console.error("이메일 중복 체크 실패:", error);
    }

    // 이메일 인증 확인 (선택사항이지만 권장)
    // 주석 처리: 이메일 인증을 필수로 하지 않음
    // if (!isEmailVerified) {
    //   return alert("이메일 인증을 완료해주세요.");
    // }

    setStep(2);
  };

  const onCompleteStep2 = async () => {
    try {
      const {
        email,
        phone,
        password,
        passwordConfirm,
        name,
        height,
        weight,
        boneType,
        personalColor,
      } = formData;

      if (!name) return alert("이름을 입력해주세요.");
      if (!height) return alert("키를 입력해주세요.");
      if (!weight) return alert("몸무게를 입력해주세요.");

      if (boneType === undefined) return alert("골격 타입을 선택해주세요.");
      if (personalColor === undefined) return alert("퍼스널 컬러를 선택해주세요.");

      await register(
        email,
        phone.replace(/[^0-9]/g, ""),
        password,
        passwordConfirm,
        name,
        parseFloat(height),
        parseFloat(weight),
        boneType,
        personalColor
      );

      // 회원가입 성공 - 환영 메시지 표시 후 자동 로그인
      alert("회원가입에 성공했습니다!\n잇츠마이컬러에 오신 것을 환영합니다. 🎉");

      // 자동 로그인 처리 (useAuth의 register에서 이미 처리됨)
      // 환영 페이지로 이동하거나 메인 페이지로 이동
      if (to) {
        router.replace(atob(to));
      } else {
        router.replace(ROUTE.MAIN);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "회원가입에 실패했습니다.";
      alert(errorMessage);
    }
  };

  useEffect(() => {
    if (email) {
      setFormData({
        ...formData,
        email,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {step === 1 ? "계정 만들기" : "프로필 완성하기"}
            </h1>
            <p className="text-gray-600">
              {step === 1 
                ? "It&apos;s my color와 함께 시작하세요" 
                : "맞춤 스타일링을 위한 정보를 입력해주세요"
              }
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: step === 2 ? '100%' : '0%' }}
                />
              </div>

              {/* Step 1 */}
              <div className="relative flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                  ${step >= 1 
                    ? 'bg-blue-600 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  {step > 1 ? <IoCheckmarkCircle size={24} /> : '1'}
                </div>
                <span className="absolute -bottom-6 text-sm font-medium text-gray-700 whitespace-nowrap">
                  계정 정보
                </span>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                  ${step >= 2 
                    ? 'bg-blue-600 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  2
                </div>
                <span className="absolute -bottom-6 text-sm font-medium text-gray-700 whitespace-nowrap">
                  개인 정보
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="mt-12">
            {step === 1 && (
              <Step1
                formData={formData}
                setFormData={setFormData}
                onComplete={onCompleteStep1}
              />
            )}
            {step === 2 && (
              <Step2
                formData={formData}
                setFormData={setFormData}
                onBack={() => setStep(1)}
                onComplete={onCompleteStep2}
              />
            )}
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              이미 회원이신가요?{" "}
              <Link
                href={to ? `${ROUTE.SIGNIN}?to=${to}` : ROUTE.SIGNIN}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
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