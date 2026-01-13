"use client";

import { useState, useEffect } from "react";
import { Banner, BannerVisibility } from "@/serivces/admin/type";
import { adminApi } from "@/serivces/admin/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";
import Image from "next/image";

interface BannerManageModalProps {
  banner: Banner | null;
  onClose: () => void;
}

export const BannerManageModal = ({ banner, onClose }: BannerManageModalProps) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [visibility, setVisibility] = useState<BannerVisibility>(BannerVisibility.PRIVATE);
  const [priority, setPriority] = useState<number>(1);
  const [imagePcUrl, setImagePcUrl] = useState("");
  const [imageMobileUrl, setImageMobileUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [pcImagePreview, setPcImagePreview] = useState<string>("");
  const [mobileImagePreview, setMobileImagePreview] = useState<string>("");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setSubtitle(banner.subtitle || "");
      setVisibility(banner.visibility);
      setPriority(banner.priority);
      setImagePcUrl(banner.imagePcUrl || "");
      setImageMobileUrl(banner.imageMobileUrl || "");
      setLinkUrl(banner.linkUrl || "");
      setPcImagePreview(banner.imagePcUrl || "");
      setMobileImagePreview(banner.imageMobileUrl || "");
    } else {
      setTitle("");
      setSubtitle("");
      setVisibility(BannerVisibility.PRIVATE);
      setPriority(1);
      setImagePcUrl("");
      setImageMobileUrl("");
      setLinkUrl("");
      setPcImagePreview("");
      setMobileImagePreview("");
    }
  }, [banner]);

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      subtitle?: string;
      visibility: BannerVisibility;
      priority?: number;
      imagePcUrl?: string;
      imageMobileUrl?: string;
      linkUrl?: string;
    }) => adminApi.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY.ADMIN_BANNER_LIST] });
      alert("배너가 생성되었습니다.");
      onClose();
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "배너 생성에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      title?: string;
      subtitle?: string;
      visibility?: BannerVisibility;
      priority?: number;
      imagePcUrl?: string;
      imageMobileUrl?: string;
      linkUrl?: string;
    }) => adminApi.updateBanner(banner!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY.ADMIN_BANNER_LIST] });
      alert("배너가 수정되었습니다.");
      onClose();
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "배너 수정에 실패했습니다.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    const data = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      visibility,
      priority: visibility === BannerVisibility.PUBLIC ? priority : undefined,
      imagePcUrl: imagePcUrl.trim() || undefined,
      imageMobileUrl: imageMobileUrl.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
    };

    if (banner) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {banner ? "배너 수정" : "배너 추가"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              서브타이틀
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              공개 여부 <span className="text-red-500">*</span>
            </label>
            <select
              value={visibility}
              onChange={(e) => {
                setVisibility(e.target.value as BannerVisibility);
                if (e.target.value === BannerVisibility.PRIVATE) {
                  setPriority(0);
                } else if (priority === 0) {
                  setPriority(1);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={BannerVisibility.PUBLIC}>공개</option>
              <option value={BannerVisibility.PRIVATE}>비공개</option>
            </select>
          </div>

          {visibility === BannerVisibility.PUBLIC && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                우선순위 (1~5) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                우선순위가 낮을수록 먼저 표시됩니다. (1~5)
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PC 이미지 URL
            </label>
            <input
              type="url"
              value={imagePcUrl}
              onChange={(e) => {
                setImagePcUrl(e.target.value);
                setPcImagePreview(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            {pcImagePreview && (
              <div className="relative w-full h-48 border border-gray-300 rounded-md overflow-hidden bg-gray-100 mt-2">
                <Image
                  src={pcImagePreview}
                  alt="PC 이미지 미리보기"
                  fill
                  className="object-contain"
                  onError={() => setPcImagePreview("")}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              모바일 이미지 URL
            </label>
            <input
              type="url"
              value={imageMobileUrl}
              onChange={(e) => {
                setImageMobileUrl(e.target.value);
                setMobileImagePreview(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            {mobileImagePreview && (
              <div className="relative w-full h-48 border border-gray-300 rounded-md overflow-hidden bg-gray-100 mt-2">
                <Image
                  src={mobileImagePreview}
                  alt="모바일 이미지 미리보기"
                  fill
                  className="object-contain"
                  onError={() => setMobileImagePreview("")}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              링크 URL
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "처리 중..."
                : banner
                ? "수정"
                : "생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

