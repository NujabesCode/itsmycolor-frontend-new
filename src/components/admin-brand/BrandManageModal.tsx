"use client";

import React, { useState } from "react";
import { Brand, BrandStatus } from "@/serivces/brand/type";
import { adminApi } from "@/serivces/admin/request";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";
import { UserRole } from "@/serivces/user/type";
import { 
  IoCheckmarkCircle, 
  IoCloseCircle, 
  IoClose, 
  IoBusiness, 
  IoPerson, 
  IoMail, 
  IoPhonePortrait, 
  IoStorefront, 
  IoPricetag,
  IoDocumentText,
  IoGlobe 
} from "react-icons/io5";

interface BrandManageModalProps {
  brand: Brand;
  onClose: () => void;
}

export const BrandManageModal = ({ brand, onClose }: BrandManageModalProps) => {
  const queryClient = useQueryClient();
  // SM-006, SM-007: 반려 사유 입력 상태
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const onApprove = async () => {
    if (!confirm('정말 승인하시겠습니까?')) {
      return;
    }

    try {
      await adminApi.putBrandStatus(brand.id, BrandStatus.APPROVED);
      await adminApi.putAccountRole(brand.userId, UserRole.BRAND_ADMIN);
      await queryClient.invalidateQueries({
        queryKey: [QUERY.ADMIN_BRAND_LIST],
      });

      alert("승인되었습니다.");
      onClose();
    } catch (error) {
      alert("승인에 실패했습니다.");
    }
  };

  const onReject = () => {
    // SM-006, SM-007: 반려 사유 입력 모달 표시
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    // SM-006: 반려 사유 필수 검증
    if (!rejectionReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }

    try {
      await adminApi.putBrandStatus(brand.id, BrandStatus.REJECTED, rejectionReason);
      await queryClient.invalidateQueries({
        queryKey: [QUERY.ADMIN_BRAND_LIST],
      });

      alert("반려되었습니다.");
      setShowRejectModal(false);
      setRejectionReason('');
      onClose();
    } catch (error) {
      alert("반려에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">브랜드 입점 신청서</h2>
              <p className="text-pink-100">브랜드 정보를 검토하고 승인 여부를 결정하세요</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <IoClose className="text-xl" />
            </button>
          </div>
        </div>
        
        {/* 컨텐츠 */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">

          {/* 기본 정보 섹션 */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IoBusiness className="text-pink-500" />
                기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <IoPricetag className="text-pink-500" />
                    <p className="font-semibold text-gray-700">문의 분류</p>
                  </div>
                  <p className="text-gray-900 font-medium">{brand.inquiryType ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <IoBusiness className="text-pink-500" />
                    <p className="font-semibold text-gray-700">회사명</p>
                  </div>
                  <p className="text-gray-900 font-medium">{brand.companyName ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <IoStorefront className="text-pink-500" />
                    <p className="font-semibold text-gray-700">브랜드명</p>
                  </div>
                  <p className="text-gray-900 font-medium">{brand.name ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <IoGlobe className="text-pink-500" />
                    <p className="font-semibold text-gray-700">홈페이지/SNS</p>
                  </div>
                  <p className="text-gray-900 font-medium break-all">{brand.sns ?? "-"}</p>
                </div>
              </div>
            </div>
            
            {/* 카테고리 정보 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IoPricetag className="text-blue-500" />
                카테고리 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2">1차 카테고리</p>
                  <p className="text-gray-900 font-medium">{brand.primaryCategory ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2">2차 카테고리</p>
                  <p className="text-gray-900 font-medium">{brand.secondaryCategory ?? "-"}</p>
                </div>
              </div>
            </div>
            
            {/* 담당자 정보 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IoPerson className="text-green-500" />
                담당자 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <IoPerson className="text-green-500" />
                    <p className="font-semibold text-gray-700">담당자명</p>
                  </div>
                  <p className="text-gray-900 font-medium">{brand.representativeName ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <IoMail className="text-green-500" />
                    <p className="font-semibold text-gray-700">이메일</p>
                  </div>
                  <p className="text-gray-900 font-medium break-all">{brand.email ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <IoPhonePortrait className="text-green-500" />
                    <p className="font-semibold text-gray-700">전화번호</p>
                  </div>
                  <p className="text-gray-900 font-medium">{brand.phoneNumber ?? "-"}</p>
                </div>
              </div>
            </div>
            
            {/* 사업 정보 */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IoStorefront className="text-orange-500" />
                사업 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2">사업자 유형</p>
                  <p className="text-gray-900 font-medium">{brand.businessType ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2">판매 예정 SKU 수</p>
                  <p className="text-gray-900 font-medium">{brand.skuCount ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2">주요 판매 채널</p>
                  <p className="text-gray-900 font-medium">{brand.salesChannels ?? "-"}</p>
                </div>
              </div>
            </div>
            
            {/* 상세 정보 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IoDocumentText className="text-purple-500" />
                상세 정보
              </h3>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-3">상품 주요 타깃군</p>
                  <p className="text-gray-900 leading-relaxed">{brand.targetCustomer ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-3">상품/브랜드 소개</p>
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{brand.description ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-3">기타 요청사항</p>
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{brand.etcRequest ?? "-"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-3">브랜드 소개서</p>
                  {brand.brandPdfUrl ? (
                    <a
                      href={brand.brandPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      <IoDocumentText />
                      브랜드 소개서 다운로드
                    </a>
                  ) : (
                    <p className="text-gray-500">업로드된 파일이 없습니다</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SM-012: 변경 이력 */}
          {brand.changeHistory && brand.changeHistory.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IoDocumentText className="text-gray-500" />
                변경 이력
              </h3>
              <div className="space-y-3">
                {brand.changeHistory.map((history, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{history.action}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(history.date).toLocaleString('ko-KR')} | {history.adminName}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded font-semibold ${
                        history.status === BrandStatus.APPROVED ? 'bg-green-100 text-green-700' :
                        history.status === BrandStatus.REJECTED ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {history.status}
                      </span>
                    </div>
                    {history.reason && (
                      <p className="text-sm text-gray-700 mt-2 pl-4 border-l-2 border-gray-300">
                        사유: {history.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 심사 버튼 */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">심사 결정</h3>
            <div className="flex justify-center gap-6">
              <button
                onClick={onReject}
                className="group flex items-center gap-3 px-8 py-4 text-red-600 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-semibold"
              >
                <IoCloseCircle className="text-xl group-hover:scale-110 transition-transform" />
                반려
              </button>
              <button
                onClick={onApprove}
                className="group flex items-center gap-3 px-8 py-4 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <IoCheckmarkCircle className="text-xl group-hover:scale-110 transition-transform" />
                승인
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SM-006, SM-007: 반려 사유 입력 모달 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">반려 사유 입력</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="반려 사유를 입력해주세요..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmReject}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                반려 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
