"use client";

import { BrandEditForm } from "@/components/seller-brand/BrandEditForm";
import { useGetUser } from "@/serivces/user/query";

const BrandSettingPage = () => {
  const [{ data: _user }, , { data: brand, isLoading }] = useGetUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-600">Loading...</div>
    );
  }

  if (!brand) {
    return (
      <div className="max-w-[800px] mx-auto py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">브랜드 정보가 없습니다.</h2>
        <p className="text-gray-600">관리자에게 문의하여 브랜드 등록 후 이용해주세요.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">브랜드 정보 수정</h1>
      <BrandEditForm brand={brand} />
    </div>
  );
};

export default BrandSettingPage; 