"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ROUTE } from "@/configs/constant/route";
import { ColorSeason } from "@/serivces/color-analysis/type";
import { BodyType } from "@/serivces/user/type";
import { useGetUser } from "@/serivces/user/query";
import { useAuth } from "@/hooks/auth/useAuth";

interface OnBoardFormFields {
  phone: string;
  name: string;
  height: string;
  weight: string;
  boneType?: BodyType;
  personalColor?: ColorSeason;
}

const PERSONAL_COLORS = [
  { label: ColorSeason.SPRING_BRIGHT, color: "bg-yellow-300" },
  { label: ColorSeason.SPRING_LIGHT, color: "bg-orange-300" },
  { label: ColorSeason.SUMMER_LIGHT, color: "bg-pink-200" },
  { label: ColorSeason.SUMMER_MUTE, color: "bg-purple-200" },
  { label: ColorSeason.AUTUMN_MUTE, color: "bg-yellow-800" },
  { label: ColorSeason.AUTUMN_DEEP, color: "bg-orange-900" },
  { label: ColorSeason.WINTER_DARK, color: "bg-blue-700" },
  { label: ColorSeason.WINTER_BRIGHT, color: "bg-purple-500" },
];

export default function OnBoardPage() {
  const router = useRouter();

  const [{ data: user }] = useGetUser();
  const { socialRegister } = useAuth();

  const [formData, setFormData] = useState<OnBoardFormFields>({
    phone: "",
    name: "",
    height: "",
    weight: "",
  });
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onComplete = async () => {
    const { phone, name, height, weight, boneType, personalColor } = formData;

    if (!phone) return alert("전화번호를 입력해주세요.");
    if (!RegExp(/^\d{10,11}$/).test(phone.replace(/[^0-9]/g, ""))) return alert("전화번호 형식이 올바르지 않습니다.");
    if (!name) return alert("이름을 입력해주세요.");
    if (!height) return alert("키를 입력해주세요.");
    if (!weight) return alert("몸무게를 입력해주세요.");
    if (!boneType) return alert("골격 타입을 선택해주세요.");
    if (!personalColor) return alert("퍼스널 컬러를 선택해주세요.");
    if (!user) return alert("회원 정보를 찾을 수 없습니다.");

    try {
      setLoading(true);

      await socialRegister(
        user.id,
        name,
        phone.replace(/[^0-9]/g, ""),
        parseFloat(height),
        parseFloat(weight),
        boneType,
        personalColor
      );

      alert("프로필 완성이 완료되었습니다.");

      router.replace(ROUTE.MYPAGE);
    } catch (error) {
      alert("프로필 완성에 실패했습니다.");
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">프로필 완성하기</h1>
            <p className="text-gray-600">맞춤 스타일링을 위한 정보를 입력해주세요</p>
          </div>

          {/* Form Content */}
          <div className="mt-8">
            <form className="flex flex-col gap-6">
              {/* 전화번호 */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">전화번호</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-gray-400 text-sm transition-all duration-200"
                />
              </div>

              {/* 이름 */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">이름</label>
                <input
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-gray-400 text-sm transition-all duration-200"
                />
              </div>

              {/* 키와 몸무게 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">키 (cm)</label>
                  <input
                    name="height"
                    type="number"
                    placeholder="170"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-gray-400 text-sm transition-all duration-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">몸무게 (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    placeholder="60"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-gray-400 text-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* 골격 타입 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">골격 타입</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(BodyType).map((type) => (
                    <button
                      type="button"
                      key={type}
                      className={`py-3 rounded-lg border transition-all duration-200 ${
                        formData.boneType === type
                          ? "bg-black text-white font-medium shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:border-black"
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, boneType: type }))}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 퍼스널 컬러 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">퍼스널 컬러 선택</label>
                <div className="grid grid-cols-4 gap-3">
                  {PERSONAL_COLORS.map((color) => (
                    <button
                      type="button"
                      key={color.label}
                      className={`group relative flex flex-col items-center justify-center h-24 rounded-lg transition-all duration-200 ${
                        color.color
                      } ${
                        formData.personalColor === color.label
                          ? "ring-2 ring-black ring-offset-2"
                          : "hover:ring-2 hover:ring-gray-800 hover:ring-offset-2"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          personalColor: color.label,
                        }))
                      }
                    >
                      <span className="text-xs font-medium text-black drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                        {color.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 완료 버튼 */}
              <div className="mt-6">
                <button
                  type="button"
                  className="w-full py-3.5 bg-black hover:bg-gray-800 text-white text-base font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={onComplete}
                  disabled={isLoading}
                >
                  확인
                </button>
              </div>
            </form>
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
