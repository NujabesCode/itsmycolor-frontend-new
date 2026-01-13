"use client";

import Image from "next/image";
import Link from "next/link";
import { ROUTE } from "@/configs/constant/route";

export const SellerAuthHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-center py-2 text-sm font-medium">
        잇츠마이컬러 판매자 센터
      </div>

      {/* Main Header */}
      <div className="px-6 py-4 flex justify-center items-center gap-3">
        <Link href={ROUTE.SELLER_MAIN} className="flex items-center">
          <Image
            src="/image/itsmycolor-logo.png"
            alt="It&apos;s my color"
            width={160}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">SELLER</span>
      </div>
    </header>
  );
};