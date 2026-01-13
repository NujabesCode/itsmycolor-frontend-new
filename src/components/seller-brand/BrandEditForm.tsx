"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Brand, BrandStatus } from "@/serivces/brand/type";
import { brandApi } from "@/serivces/brand/request";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";
import { motion } from "framer-motion";
import { FaStore, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaInstagram, FaImage, FaBuilding, FaIdCard, FaInfoCircle, FaSave, FaUpload } from "react-icons/fa";

interface BrandEditFormProps {
  brand: Brand;
}

export const BrandEditForm = ({ brand }: BrandEditFormProps) => {
  const queryClient = useQueryClient();

  interface BrandFormState {
    name: string;
    engName: string; // 추가: 브랜드 영문명
    description: string;
    phoneNumber: string;
    email: string;
    address: string;
    website: string;
    sns: string;
    logoUrl: string;
    backgroundUrl: string;
    businessType: string;
    businessNumber: string;
    representativeName: string;
  }

  const [form, setForm] = useState<BrandFormState>({
    name: "",
    engName: "", // 추가: 초기값
    description: "",
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
    sns: "",
    logoUrl: "",
    backgroundUrl: "",
    businessType: "",
    businessNumber: "",
    representativeName: "",
  });

  useEffect(() => {
    if (brand) {
      setForm({
        name: brand.name ?? "",
        engName: brand.engName ?? "", // 추가: 브랜드 영문명 초기화
        description: brand.description ?? "",
        phoneNumber: brand.phoneNumber ?? "",
        email: brand.email ?? "",
        address: brand.address ?? "",
        website: brand.website ?? "",
        sns: brand.sns ?? "",
        logoUrl: brand.logoUrl ?? "",
        backgroundUrl: brand.backgroundUrl ?? "",
        businessType: brand.businessType ?? "",
        businessNumber: brand.businessNumber ?? "",
        representativeName: brand.representativeName ?? "",
      });
    }
  }, [brand]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 파일 업로드 state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    if (name === 'logo') {
      setLogoFile(files[0]);
      // 미리보기용 URL 업데이트
      setForm(prev => ({ ...prev, logoUrl: URL.createObjectURL(files[0]) }));
    } else if (name === 'background') {
      setBackgroundFile(files[0]);
      setForm(prev => ({ ...prev, backgroundUrl: URL.createObjectURL(files[0]) }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // 텍스트 필드
      formData.append('name', form.name);
      formData.append('engName', form.engName); // 추가: 영문명 전송
      formData.append('description', form.description);
      formData.append('phoneNumber', form.phoneNumber);
      formData.append('address', form.address);
      formData.append('website', form.website);
      formData.append('sns', form.sns);
      formData.append('representativeName', form.representativeName);

      // 파일 필드 (선택적)
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      if (backgroundFile) {
        formData.append('background', backgroundFile);
      }

      await brandApi.updateBrand(brand.id, formData);
      alert("브랜드 정보가 수정되었습니다.");
      // invalidate cache
      queryClient.invalidateQueries({ queryKey: [QUERY.BRAND] });
    } catch (error: any) {
      console.error(error);
      alert("브랜드 정보 수정에 실패했습니다.");
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
      onSubmit={handleSubmit}
    >
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl p-8 mb-8">
        <h2 className="text-3xl font-light mb-2">브랜드 정보 관리</h2>
        <p className="text-indigo-100">브랜드의 상세 정보를 업데이트하고 관리하세요</p>
      </div>

      <div className="bg-white rounded-b-2xl shadow-xl p-8 space-y-8">
        {/* 기본 정보 섹션 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
              <FaStore className="text-lg" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">기본 정보</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaStore className="text-gray-400" />
                브랜드명
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                placeholder="브랜드명을 입력하세요"
              />
            </div>

            {/* 추가된 영문명 입력 필드 */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaStore className="text-gray-400" />
                추가 브랜드명
              </label>
              <input
                type="text"
                name="engName"
                value={form.engName}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                placeholder="Brand English Name"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaPhone className="text-gray-400" />
                대표 전화번호
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                placeholder="010-0000-0000"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" />
                대표 이메일
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  readOnly
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  수정 불가
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaGlobe className="text-gray-400" />
                웹사이트
              </label>
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                placeholder="https://example.com"
              />
            </div>

            <div className="group md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" />
                주소
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                placeholder="서울특별시 강남구..."
              />
            </div>

            <div className="group md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaInstagram className="text-gray-400" />
                SNS 주소
              </label>
              <input
                type="text"
                name="sns"
                value={form.sns}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                placeholder="https://instagram.com/yourbrand"
              />
            </div>
          </div>
        </motion.div>

        {/* 이미지 업로드 섹션 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 border-t pt-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
              <FaImage className="text-lg" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">브랜드 이미지</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 로고 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">로고 이미지</label>
              <div className="relative group">
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="logo preview" className="h-full w-full object-contain p-4" />
                  ) : (
                    <>
                      <FaUpload className="text-3xl text-gray-400 mb-3" />
                      <span className="text-sm text-gray-500">클릭하여 로고 업로드</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (최대 5MB)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* 배경 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">배경 이미지</label>
              <div className="relative group">
                <input
                  type="file"
                  name="background"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="background-upload"
                />
                <label
                  htmlFor="background-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  {form.backgroundUrl ? (
                    <img src={form.backgroundUrl} alt="background preview" className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <FaUpload className="text-3xl text-gray-400 mb-3" />
                      <span className="text-sm text-gray-500">클릭하여 배경 이미지 업로드</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG (최대 10MB)</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            <p>로고 권장 크기 120x120</p>
            <p>배경 이미지 권장 크기 300x400 (3:4 비율)</p>
          </div>
        </motion.div>

        {/* 사업자 정보 섹션 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 border-t pt-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
              <FaBuilding className="text-lg" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">사업자 정보</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaBuilding className="text-gray-400" />
                사업자 유형
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="businessType"
                  value={form.businessType}
                  readOnly
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  수정 불가
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaIdCard className="text-gray-400" />
                사업자등록번호
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="businessNumber"
                  value={form.businessNumber}
                  readOnly
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  수정 불가
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaUser className="text-gray-400" />
                대표자명
              </label>
              <input
                type="text"
                name="representativeName"
                value={form.representativeName}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                placeholder="대표자명을 입력하세요"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaInfoCircle className="text-gray-400" />
                상태
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={brand.status}
                  readOnly
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-full ${
                  brand.status === BrandStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {brand.status === BrandStatus.APPROVED ? '활성' : '비활성'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 브랜드 소개 섹션 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 border-t pt-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white">
              <FaInfoCircle className="text-lg" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">브랜드 소개</h3>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              브랜드 스토리를 들려주세요
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300 resize-none"
              placeholder="브랜드의 철학, 비전, 특별한 이야기를 공유해주세요..."
            />
            <p className="text-xs text-gray-400 mt-2">최대 500자까지 입력 가능합니다</p>
          </div>
        </motion.div>

        {/* 저장 버튼 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end gap-4 mt-8 pt-8 border-t"
        >
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaSave className="text-lg" />
            변경사항 저장하기
          </button>
        </motion.div>
      </div>
    </motion.form>
  );
}; 