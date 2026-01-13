"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetUser } from "@/serivces/user/query";
import { userApi } from "@/serivces/user/request";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";
import { ROUTE } from "@/configs/constant/route";
import { IoArrowBack, IoLockClosed, IoPerson, IoCall } from "react-icons/io5";
import Link from "next/link";

export default function MyPageProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [{ data: user }] = useGetUser();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // 사용자 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (phone && !/^010\d{8}$/.test(phone.replace(/-/g, ""))) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다. (010-1234-5678)";
    }

    // 비밀번호 변경 시에만 검증
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
      }
      if (!newPassword) {
        newErrors.newPassword = "새 비밀번호를 입력해주세요.";
      } else if (newPassword.length < 8) {
        newErrors.newPassword = "비밀번호는 최소 8자 이상이어야 합니다.";
      } else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
        newErrors.newPassword = "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.";
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "새 비밀번호가 일치하지 않습니다.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // UI-037: 프로필 정보 수정
      await userApi.updateUser(name.trim(), phone.trim());

      // 비밀번호 변경이 있는 경우 별도 처리
      if (newPassword && currentPassword) {
        try {
          await userApi.changePassword(currentPassword, newPassword);
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || error?.message || "비밀번호 변경에 실패했습니다.";
          alert(errorMessage);
          return;
        }
      }

      await queryClient.invalidateQueries({ queryKey: [QUERY.USER] });
      alert("프로필이 수정되었습니다.");
      router.push(ROUTE.MYPAGE);
    } catch (error: any) {
      console.error("프로필 수정 실패:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "프로필 수정에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    // 전화번호 자동 포맷팅
    const numbers = value.replace(/[^\d]/g, "");
    let formatted = numbers;
    if (numbers.length > 3 && numbers.length <= 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length > 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={ROUTE.MYPAGE}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <IoArrowBack size={20} />
            <span>마이페이지로 돌아가기</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">프로필 수정</h1>
          <p className="text-gray-600 mt-2">개인정보를 수정할 수 있습니다.</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {/* 이름 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <IoPerson size={18} />
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="이름을 입력하세요"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* 전화번호 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <IoCall size={18} />
              전화번호
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="010-1234-5678"
              maxLength={13}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* 이메일 (읽기 전용) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
          </div>

          {/* 비밀번호 변경 섹션 */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IoLockClosed size={20} />
              비밀번호 변경
            </h2>
            <p className="text-sm text-gray-500 mb-4">비밀번호를 변경하지 않으려면 비워두세요.</p>

            {/* 현재 비밀번호 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 비밀번호
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.currentPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="현재 비밀번호를 입력하세요"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
              )}
            </div>

            {/* 새 비밀번호 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="새 비밀번호를 입력하세요 (최소 8자, 영문/숫자/특수문자 포함)"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="새 비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

