"use client";

import { SignUpFormFields } from "@/app/sign-up/page";
import { ROUTE } from "@/configs/constant/route";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Agreement from "./Agreement";
import { emailApi } from "@/serivces/email/request";

export const Step1 = ({
  formData,
  setFormData,
  onComplete,
}: {
  formData: SignUpFormFields;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormFields>>;
  onComplete: () => void;
}) => {
  const router = useRouter();

  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [timer, setTimer] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // 이메일이 변경되면 인증 상태 초기화
    if (name === "email") {
      setIsEmailVerified(false);
      setVerificationCode("");
      setVerificationError("");
    }
  };

  // 인증 코드 발송
  const handleSendVerificationCode = async () => {
    const email = formData.email.trim();
    if (!email) {
      return alert("이메일을 입력해주세요.");
    }
    if (!RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)) {
      return alert("올바른 이메일 형식이 아닙니다.");
    }

    setIsSendingCode(true);
    setVerificationError("");
    try {
      await emailApi.sendVerification(email);
      alert("인증 코드가 발송되었습니다. 이메일을 확인해주세요.");
      setTimer(300); // 5분 타이머
    } catch (error: any) {
      alert(error?.response?.data?.message || "인증 코드 발송에 실패했습니다.");
    } finally {
      setIsSendingCode(false);
    }
  };

  // 인증 코드 검증
  const handleVerifyCode = async () => {
    const email = formData.email.trim();
    const code = verificationCode.trim();

    if (!email) {
      return alert("이메일을 입력해주세요.");
    }
    if (!code) {
      return alert("인증 코드를 입력해주세요.");
    }

    setIsVerifying(true);
    setVerificationError("");
    try {
      await emailApi.verifyEmail(email, code);
      setIsEmailVerified(true);
      setTimer(0);
      alert("이메일 인증이 완료되었습니다.");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "인증 코드가 맞지 않습니다.";
      setVerificationError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // 타이머
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsEmailVerified(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <>
      {/* Title */}
      <div className="text-center">
        <h2 className="text-grey-20 text-2xl font-bold mb-2">회원가입</h2>
        <p className="text-grey-47 text-sm font-light">
          잇츠마이컬러 계정을 만들어보세요
        </p>
      </div>

      <div className="h-8" />

      {/* Form */}
      <form className="flex flex-col gap-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-grey-33">이메일</label>
          <div className="flex gap-2">
            <input
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isEmailVerified}
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-grey-47 text-sm transition-all duration-200 ${
                isEmailVerified ? "bg-gray-100 border-green-500" : "border-grey-90"
              }`}
            />
            <button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={isSendingCode || isEmailVerified || !formData.email.trim()}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSendingCode ? "발송 중..." : isEmailVerified ? "인증 완료" : "인증 코드 발송"}
            </button>
          </div>
          {!isEmailVerified && formData.email && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="인증 코드 입력"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-grey-90 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-grey-47 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleVerifyCode();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifying || !verificationCode.trim()}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "확인 중..." : "인증 확인"}
                </button>
              </div>
              {timer > 0 && (
                <p className="text-xs text-gray-500">
                  인증 코드 유효 시간: {Math.floor(timer / 60)}분 {timer % 60}초
                </p>
              )}
              {verificationError && (
                <p className="text-xs text-red-500">{verificationError}</p>
              )}
              {timer === 0 && verificationCode && !isEmailVerified && (
                <p className="text-xs text-red-500">인증 코드가 만료되었습니다. 다시 발송해주세요.</p>
              )}
            </div>
          )}
          {isEmailVerified && (
            <p className="text-xs text-green-600 mt-1">✓ 이메일 인증이 완료되었습니다.</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-grey-33">전화번호</label>
          <input
            name="phone"
            type="tel"
            placeholder="010-1234-5678"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-grey-90 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-grey-47 text-sm transition-all duration-200"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-grey-33">비밀번호</label>
          <input
            name="password"
            type="password"
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-grey-90 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-grey-47 text-sm transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">
            영문, 숫자, 특수문자(@$!%*?&)를 포함하여 8자 이상 입력해주세요
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-grey-33">
            비밀번호 확인
          </label>
          <input
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호를 한번 더 입력해주세요"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-grey-90 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-grey-47 text-sm transition-all duration-200"
          />
        </div>

        <div className="flex items-start space-x-3 mt-2">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            checked={isAgree}
            onChange={() => {
              if (isAgree) {
                setIsAgree(false);
              } else {
                setIsAgreementOpen(true);
              }
            }}
            className="w-5 h-5 mt-0.5 text-black border-gray-300 rounded focus:ring-black transition-all duration-200"
          />
          <label htmlFor="agree" className="text-grey-33 text-sm font-light">
            <span className="text-black font-medium cursor-pointer">
              [필수]
            </span>{" "}
            이용약관 및 개인정보 처리방침에 동의합니다.
          </label>
        </div>

        <button
          className="w-full py-3.5 bg-black hover:bg-gray-800 text-white text-base font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mt-4"
          type="button"
          onClick={() => {
            if (!isAgree)
              return alert("이용약관 및 개인정보 처리방침에 동의해주세요.");

            onComplete();
          }}
        >
          다음
        </button>
      </form>

      {isAgreementOpen && (
        <Agreement
          isOpen={isAgreementOpen}
          onClose={() => setIsAgreementOpen(false)}
          onAgree={() => {
            setIsAgreementOpen(false);
            setIsAgree(true);
          }}
        />
      )}
    </>
  );
};
