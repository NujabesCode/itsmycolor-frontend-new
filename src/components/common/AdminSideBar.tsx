"use client";

import { useState } from "react";
import { BsPaletteFill } from "react-icons/bs";
import { FaDiagramProject } from "react-icons/fa6";
import { FaBoxOpen, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { IoIosSettings, IoIosLogOut, IoIosNotifications } from "react-icons/io";
import { MdDashboard, MdInventory, MdCampaign } from "react-icons/md";
import { MdImage } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";
import Image from "next/image";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetUser } from "@/serivces/user/query";

const MENU_ITEMS = [
  {
    id: "brand",
    name: "브랜드 관리",
    icon: FaDiagramProject,
    path: ROUTE.ADMIN_BRAND,
  },
  {
    id: "product",
    name: "상품 관리",
    icon: FaBoxOpen,
    path: ROUTE.ADMIN_PRODUCT,
  },
  {
    id: "customer",
    name: "고객 관리",
    icon: IoPeopleSharp,
    path: ROUTE.ADMIN_CUSTOMER,
  },
  {
    id: "analysis",
    name: "통계 분석",
    icon: TbBrandGoogleAnalytics,
    path: ROUTE.ADMIN_ANALYSIS,
  },
  {
    id: "order",
    name: "주문 관리",
    icon: FaBoxOpen,
    path: ROUTE.ADMIN_ORDER,
  },
  {
    id: "banner",
    name: "배너 관리",
    icon: MdImage,
    path: ROUTE.ADMIN_BANNER,
  },
  {
    id: "settlement",
    name: "정산 관리",
    icon: MdInventory,
    path: ROUTE.ADMIN_SETTLEMENT,
  },
  {
    id: "commission",
    name: "수수료 관리",
    icon: IoIosSettings,
    path: ROUTE.ADMIN_COMMISSION,
  },
  {
    id: "tax",
    name: "세금 관리",
    icon: IoIosSettings,
    path: ROUTE.ADMIN_TAX,
  },
  {
    id: "setting",
    name: "설정",
    icon: IoIosSettings,
    path: ROUTE.ADMIN_SETTING,
  },
];

export default function AdminSideBar() {
  const pathname = usePathname();

  const router = useRouter();
  const { logout } = useAuth();

  const [{ data: user }] = useGetUser();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const onLogout = () => {
    logout();
    alert("로그아웃에 성공했습니다.");
    router.replace(ROUTE.MAIN);
    router.refresh();
  };

  const isLoginPage = pathname.startsWith(ROUTE.ADMIN_SIGNUP) || pathname.startsWith(ROUTE.ADMIN_SIGNIN);

  if (isLoginPage) {
    return null;
  }

  return (
    <aside className="w-72 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/image/itsmycolor-logo.png"
            alt="It&apos;s my color Admin"
            width={200}
            height={50}
            className="h-12 w-auto brightness-0 invert"
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">관리자 패널</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-sm font-bold">{user?.name.slice(1)}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">관리자</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id}>
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3 text-sm">
            <IoIosLogOut size={16} />
            <span>로그아웃</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
