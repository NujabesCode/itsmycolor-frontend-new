"use client";

import { ROUTE } from "@/configs/constant/route";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetUser } from "@/serivces/user/query";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiLogOut, FiHelpCircle } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { useState } from "react";
import { useGetThisMonthOrderListByBrand, useGetTodayOrderListByBrand } from "@/serivces/order/query";

export const SellerHeader = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const [{ data: user }, , { data: brand }] = useGetUser();
  const { data: todayOrderList } = useGetTodayOrderListByBrand(brand?.id ?? "");
  const { data: thisMonthOrderList } = useGetThisMonthOrderListByBrand(brand?.id ?? "");

  const name = user?.name;
  const brandName = brand?.name;

  const todayNewOrderCount = todayOrderList?.length ?? 0;
  const todayNewOrderAmount = todayOrderList?.reduce((acc, order) => acc + order.totalAmount, 0) ?? 0;
  const thisMonthNewOrderAmount = thisMonthOrderList?.reduce((acc, order) => acc + order.totalAmount, 0) ?? 0;

  const [showUserMenu, setShowUserMenu] = useState(false);

  const onLogout = () => {
    logout();
    alert("로그아웃에 성공했습니다.");
    router.replace(ROUTE.MAIN);
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white px-6 py-2 text-xs">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="font-medium">잇츠마이컬러 판매자 센터</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">
              신규 주문 <span className="text-green-400 font-bold">{todayNewOrderCount}건</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="hover:text-gray-300 transition-colors cursor-pointer"
              onClick={() =>
                alert(
                  "문의사항이 있으시면 아래 연락처로 연락 부탁드립니다.\n\n전화: 010-2076-2277\n이메일: itsmycolorlab@naver.com"
                )
              }
            >
              <FiHelpCircle className="inline mr-1" size={14} />
              도움말
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <Link href={ROUTE.SELLER_MAIN} className="flex items-center">
              <Image
                src="/image/itsmycolor-logo.png"
                alt="It&apos;s my color"
                width={180}
                height={48}
                priority
                className="h-10 w-auto"
              />
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                SELLER
              </span>
            </Link>

            <div className="h-8 w-px bg-gray-300" />

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MdStorefront size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {brandName}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Quick Stats */}
            <div className="flex items-center gap-6 mr-6">
              <div className="text-center">
                <p className="text-xs text-gray-500">오늘 매출</p>
                <p className="text-lg font-bold text-gray-900">₩{todayNewOrderAmount.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">이번 달 매출</p>
                <p className="text-lg font-bold text-gray-900">₩{thisMonthNewOrderAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-300" />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {name?.charAt(0).toUpperCase() || "S"}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">판매자</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <Link
                    href={ROUTE.MYPAGE}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  >
                    내 정보 관리
                  </Link>
                  <Link
                    href={ROUTE.SELLER_BRAND_SETTING}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    브랜드 설정
                  </Link>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FiLogOut size={16} />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};
