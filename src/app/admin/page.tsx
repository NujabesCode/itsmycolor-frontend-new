"use client";

import { useEffect } from "react";
import { ROUTE } from "@/configs/constant/route";

export default function Admin() {
  useEffect(() => {
    // 정적 export 모드에서는 window.location.href 사용
    if (typeof window !== 'undefined') {
      window.location.href = `${ROUTE.ADMIN_BRAND}.html`;
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">이동 중...</p>
      </div>
    </div>
  );
}
