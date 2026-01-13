"use client";

import { ROUTE } from "@/configs/constant/route";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CheckboxState = {
  allAgree: boolean;
  termsAgree: boolean;
  privacyAgree: boolean;
  purchaseAgree: boolean;
  marketingAgree: boolean;
  age14Agree: boolean;
};

type CheckboxKey = keyof CheckboxState;

interface AgreementProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export default function Agreement({
  isOpen,
  onClose,
  onAgree,
}: AgreementProps) {
  const router = useRouter();

  const [checkboxes, setCheckboxes] = useState<CheckboxState>({
    allAgree: false,
    termsAgree: false,
    privacyAgree: false,
    purchaseAgree: false,
    marketingAgree: false,
    age14Agree: false,
  });

  const handleCheckboxChange = (name: CheckboxKey) => {
    setCheckboxes((prev) => {
      const newState = { ...prev, [name]: !prev[name] };

      if (name === "allAgree") {
        return {
          ...newState,
          termsAgree: newState.allAgree,
          privacyAgree: newState.allAgree,
          purchaseAgree: newState.allAgree,
          marketingAgree: newState.allAgree,
          age14Agree: newState.allAgree,
        };
      }

      const allChecked = [
        "termsAgree",
        "privacyAgree",
        "purchaseAgree",
        "age14Agree",
      ].every((key) =>
        key === name ? newState[key as CheckboxKey] : prev[key as CheckboxKey]
      );

      return {
        ...newState,
        allAgree: allChecked,
      };
    });
  };

  const isAllRequiredChecked = () => {
    return (
      checkboxes.termsAgree &&
      checkboxes.privacyAgree &&
      checkboxes.purchaseAgree &&
      checkboxes.age14Agree
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-grey-20">
              이용약관 및 개인정보 수집 동의
            </h2>
            <button
              onClick={onClose}
              className="text-grey-47 hover:text-grey-20 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-grey-47 mb-8">
            패션 서비스 이용을 위해 아래 약관에 동의해 주세요.
          </p>

          {/* 전체 동의 */}
          <div className="flex items-center p-4 bg-grey-98 rounded-lg mb-6">
            <input
              type="checkbox"
              id="all-agree"
              className="w-5 h-5 mr-3 text-black border-gray-300 rounded focus:ring-black transition-all duration-200"
              checked={checkboxes.allAgree}
              onChange={() => handleCheckboxChange("allAgree")}
            />
            <label htmlFor="all-agree" className="font-semibold text-grey-20">
              전체 동의
            </label>
          </div>

          {/* 이용약관 동의 */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms-agree"
                  className="w-5 h-5 mr-3 text-black border-gray-300 rounded focus:ring-black transition-all duration-200"
                  checked={checkboxes.termsAgree}
                  onChange={() => handleCheckboxChange("termsAgree")}
                />
                <label
                  htmlFor="terms-agree"
                  className="font-medium text-grey-20"
                >
                  이용약관 동의 <span className="text-red-500">(필수)</span>
                </label>
              </div>
              <button className="text-sm text-black hover:text-gray-800 transition-colors">
                내용보기
              </button>
            </div>
            <div className="bg-grey-98 p-4 rounded-lg text-sm text-grey-47">
              <p className="mb-2 font-medium">제1조 (목적)</p>
              <p className="mb-2">
                이 약관은 패션플랫폼(이하 &quot;회사&quot;라 합니다)이 제공하는
                서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및
                책임사항을 규정합니다.
              </p>
              <p className="mb-2 font-medium">제2조 (정의)</p>
              <p>
                ① &quot;이용자&quot;란 회사가 제공하는 인터넷 상의 서비스를
                의미합니다.
                <br />② &quot;이용약관&quot;은 회사의 서비스에 접속하거나 이용할
                때 회사가 제공하는 서비스를 받는 회원 및 비회원들을 말합니다.
              </p>
            </div>
          </div>

          {/* 개인정보 수집 및 이용 동의 */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="privacy-agree"
                  className="w-5 h-5 mr-3 text-black border-gray-300 rounded focus:ring-black transition-all duration-200"
                  checked={checkboxes.privacyAgree}
                  onChange={() => handleCheckboxChange("privacyAgree")}
                />
                <label
                  htmlFor="privacy-agree"
                  className="font-medium text-grey-20"
                >
                  개인정보 수집 및 이용 동의{" "}
                  <span className="text-red-500">(필수)</span>
                </label>
              </div>
              <button className="text-sm text-black hover:text-gray-800 transition-colors">
                내용보기
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-grey-98">
                    <th className="border border-grey-90 px-4 py-3 text-left text-sm font-medium text-grey-20">
                      수집항목
                    </th>
                    <th className="border border-grey-90 px-4 py-3 text-left text-sm font-medium text-grey-20">
                      이용목적
                    </th>
                    <th className="border border-grey-90 px-4 py-3 text-left text-sm font-medium text-grey-20">
                      보유기간
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-grey-90 px-4 py-3 text-sm text-grey-47">
                      이름, 아이디, 비밀번호, 이메일, 휴대폰번호
                    </td>
                    <td className="border border-grey-90 px-4 py-3 text-sm text-grey-47">
                      회원가입 및 서비스 이용, 고객식별, 주문 및 결제, 불만처리
                    </td>
                    <td className="border border-grey-90 px-4 py-3 text-sm text-grey-47">
                      회원 탈퇴 시까지
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-grey-90 px-4 py-3 text-sm text-grey-47">
                      주소, 전화번호
                    </td>
                    <td className="border border-grey-90 px-4 py-3 text-sm text-grey-47">
                      상품 배송, 공지사항 전달
                    </td>
                    <td className="border border-grey-90 px-4 py-3 text-sm text-grey-47">
                      회원 탈퇴 시까지
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 구매조건 확인 및 결제 진행 동의 */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="purchase-agree"
                  className="w-5 h-5 mr-3 text-black border-gray-300 rounded focus:ring-black transition-all duration-200"
                  checked={checkboxes.purchaseAgree}
                  onChange={() => handleCheckboxChange("purchaseAgree")}
                />
                <label
                  htmlFor="purchase-agree"
                  className="font-medium text-grey-20"
                >
                  구매조건 확인 및 결제 진행 동의{" "}
                  <span className="text-red-500">(필수)</span>
                </label>
              </div>
              <button className="text-sm text-black hover:text-gray-800 transition-colors">
                내용보기
              </button>
            </div>
            <div className="bg-grey-98 p-4 rounded-lg text-sm text-grey-47">
              <p className="mb-2 font-medium">1. 구매 계약의 성립</p>
              <p className="mb-2">
                - 회사가 제공하는 절차에 따라 회원이 청약의 의사표시를 하고 이에
                대하여 회사가 승낙의 의사표시를 함으로써 계약이 성립됩니다.
              </p>
              <p className="mb-2">
                - 회사는 다음 각 호의 사유에 해당하는 경우 청약을 승낙하지 않을
                수 있습니다.
              </p>
              <p>
                - 기타 구매신청에 승낙하는 것이 회사의 기술상 현저히 지장이
                있다고 판단되는 경우
              </p>
            </div>
          </div>

          {/* 마케팅 정보 수신 동의 (선택) */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing-agree"
                  className="w-5 h-5 mr-3 text-black border-gray-300 rounded focus:ring-black transition-all duration-200"
                  checked={checkboxes.marketingAgree}
                  onChange={() => handleCheckboxChange("marketingAgree")}
                />
                <label
                  htmlFor="marketing-agree"
                  className="font-medium text-grey-20"
                >
                  마케팅 정보 수신 동의{" "}
                  <span className="text-grey-47">(선택)</span>
                </label>
              </div>
              <button className="text-sm text-black hover:text-gray-800 transition-colors">
                내용보기
              </button>
            </div>
            <div className="bg-grey-98 p-4 rounded-lg text-sm text-grey-47">
              <p className="mb-2 font-medium">1. 마케팅 정보의 수집 및 이용</p>
              <p className="mb-2">
                - 회사는 회원에게 각종 이벤트 정보, 신상품 안내, 혜택 및
                서비스에 대한 정보, 혜택 및 이벤트, 신상품 안내 등을 SMS,
                이메일, 앱 알림 등으로 제공할 수 있습니다.
              </p>
              <p>- 회원은 언제든지 수신을 거부할 수 있습니다.</p>
            </div>
          </div>

          {/* 14세 이상 여부 */}
          <div className="flex items-center mb-8">
            <input
              type="checkbox"
              id="age14-agree"
              className="w-5 h-5 mr-3 text-black border-gray-300 rounded focus:ring-black transition-all duration-200"
              checked={checkboxes.age14Agree}
              onChange={() => handleCheckboxChange("age14Agree")}
            />
            <label htmlFor="age14-agree" className="font-medium text-grey-20">
              만 14세 이상입니다 <span className="text-red-500">(필수)</span>
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              className="flex-1 py-3.5 bg-grey-90 hover:bg-grey-80 text-white text-base font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className={`flex-1 py-3.5 rounded-lg text-base font-bold transition-all duration-200 shadow-sm hover:shadow-md ${
                isAllRequiredChecked()
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-grey-90 text-grey-47 cursor-not-allowed"
              }`}
              onClick={() => {
                if (isAllRequiredChecked()) {
                  onAgree();
                }
              }}
              disabled={!isAllRequiredChecked()}
            >
              동의하고 계속하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
