"use client";

import { useState } from "react";
import { useGetBannerList } from "@/serivces/admin/query";
import { adminApi } from "@/serivces/admin/request";
import { Banner, BannerVisibility } from "@/serivces/admin/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";
import { BannerManageModal } from "@/components/admin-banner/BannerManageModal";

export default function AdminBanner() {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: bannerList, isLoading } = useGetBannerList();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY.ADMIN_BANNER_LIST] });
      alert("배너가 삭제되었습니다.");
    },
    onError: () => {
      alert("배너 삭제에 실패했습니다.");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsCreateModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedBanner(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBanner(null);
    setIsCreateModalOpen(false);
  };

  const publicBanners = bannerList?.filter((b) => b.visibility === BannerVisibility.PUBLIC) || [];
  const privateBanners = bannerList?.filter((b) => b.visibility === BannerVisibility.PRIVATE) || [];

  return (
    <div className="p-8 bg-grey-98 min-h-screen">
      {/* 상단 제목 및 설명 */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-azure-11 mb-1">배너 관리</h1>
          <p className="text-sm text-grey-46">
            메인 페이지 배너를 관리할 수 있습니다.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          배너 추가
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : (
        <div className="space-y-8">
          {/* 공개 배너 섹션 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              공개 배너 ({publicBanners.length}개)
            </h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">우선순위</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">제목</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">서브타이틀</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">PC 이미지</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">모바일 이미지</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">링크</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {publicBanners.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        공개 배너가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    publicBanners
                      .sort((a, b) => a.priority - b.priority)
                      .map((banner) => (
                        <tr key={banner.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{banner.priority}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{banner.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{banner.subtitle || "-"}</td>
                          <td className="px-4 py-3 text-sm">
                            {banner.imagePcUrl ? (
                              <a
                                href={banner.imagePcUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                보기
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {banner.imageMobileUrl ? (
                              <a
                                href={banner.imageMobileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                보기
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {banner.linkUrl ? (
                              <a
                                href={banner.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                링크
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(banner)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDelete(banner.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 비공개 배너 섹션 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              비공개 배너 ({privateBanners.length}개)
            </h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">제목</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">서브타이틀</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">PC 이미지</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">모바일 이미지</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">링크</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {privateBanners.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        비공개 배너가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    privateBanners.map((banner) => (
                      <tr key={banner.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{banner.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{banner.subtitle || "-"}</td>
                        <td className="px-4 py-3 text-sm">
                          {banner.imagePcUrl ? (
                            <a
                              href={banner.imagePcUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              보기
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {banner.imageMobileUrl ? (
                            <a
                              href={banner.imageMobileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              보기
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {banner.linkUrl ? (
                            <a
                              href={banner.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              링크
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(banner)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(banner.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(isCreateModalOpen || selectedBanner) && (
        <BannerManageModal
          banner={selectedBanner}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

