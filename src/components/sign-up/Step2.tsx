'use client';

import { SignUpFormFields } from '@/app/sign-up/page';
import { ColorSeason } from '@/serivces/color-analysis/type';
import { BodyType } from '@/serivces/user/type';

const PERSONAL_COLORS = [
  { label: ColorSeason.SPRING_BRIGHT, color: 'bg-yellow-300' },
  { label: ColorSeason.SPRING_LIGHT, color: 'bg-orange-300' },
  { label: ColorSeason.SUMMER_LIGHT, color: 'bg-pink-200' },
  { label: ColorSeason.SUMMER_MUTE, color: 'bg-purple-200' },
  { label: ColorSeason.AUTUMN_MUTE, color: 'bg-yellow-800' },
  { label: ColorSeason.AUTUMN_DEEP, color: 'bg-orange-900' },
  { label: ColorSeason.WINTER_DARK, color: 'bg-blue-700' },
  { label: ColorSeason.WINTER_BRIGHT, color: 'bg-purple-500' },
];

export const Step2 = ({
  formData,
  setFormData,
  onBack,
  onComplete,
}: {
  formData: SignUpFormFields;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormFields>>;
  onBack: () => void;
  onComplete: () => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Title */}
      <div className="text-center">
        <h2 className="text-grey-20 text-2xl font-bold mb-2">추가 정보 입력</h2>
        <p className="text-grey-47 text-sm font-light">
          퍼스널 컬러 분석에 필요한 정보를 입력해주세요
        </p>
      </div>

      <div className="h-8" />

      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={onComplete}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-grey-33">이름</label>
          <input
            name="name"
            type="text"
            placeholder="홍길동"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-grey-90 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-grey-47 text-sm transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-grey-33">키 (cm)</label>
            <input
              name="height"
              type="number"
              placeholder="170"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-grey-90 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-grey-47 text-sm transition-all duration-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-grey-33">
              몸무게 (kg)
            </label>
            <input
              name="weight"
              type="number"
              placeholder="60"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-grey-90 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder:text-grey-47 text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* 골격 타입 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-grey-33">골격 타입</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(BodyType).map((type) => (
              <button
                type="button"
                key={type}
                className={`py-3 rounded-lg border transition-all duration-200 ${
                  formData.boneType === type
                    ? 'bg-black text-white font-medium shadow-sm'
                    : 'bg-white text-grey-33 border-grey-90 hover:border-black'
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, boneType: type }))
                }
              >
                {type}
              </button>
            ))}
            {/* Unknown option */}
            <button
              type="button"
              key="unknown-boneType"
              className={`col-span-3 w-full py-3 rounded-lg border transition-all duration-200 ${
                formData.boneType === null
                  ? 'bg-black text-white font-medium shadow-sm'
                  : 'bg-white text-grey-33 border-grey-90 hover:border-black'
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, boneType: null }))
              }
            >
              모름
            </button>
          </div>
        </div>

        {/* 퍼스널 컬러 선택 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-grey-33">
            퍼스널 컬러 선택
          </label>
          <div className="grid grid-cols-4 gap-3">
            {PERSONAL_COLORS.map((color) => (
              <button
                type="button"
                key={color.label}
                className={`group relative flex flex-col items-center justify-center h-24 rounded-lg transition-all duration-200 ${
                  color.color
                } ${
                  formData.personalColor === color.label
                    ? 'ring-2 ring-black ring-offset-2'
                    : 'hover:ring-2 hover:ring-gray-800 hover:ring-offset-2'
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
            {/* Unknown option */}
            <button
              type="button"
              key="unknown-personalColor"
              className={`col-span-4 w-full group relative flex flex-col items-center justify-center h-24 rounded-lg transition-all duration-200 bg-gray-300 ${
                formData.personalColor === null
                  ? 'ring-2 ring-black ring-offset-2'
                  : 'hover:ring-2 hover:ring-gray-800 hover:ring-offset-2'
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  personalColor: null,
                }))
              }
            >
              <span className="text-xs font-medium text-black drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                모름
              </span>
            </button>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            className="flex-1 py-3.5 bg-black hover:bg-gray-800 text-white text-base font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={onBack}
          >
            이전
          </button>
          <button
            type="button"
            className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={onComplete}
          >
            가입완료
          </button>
        </div>
      </form>
    </>
  );
};
