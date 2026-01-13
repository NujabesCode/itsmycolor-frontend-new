"use client";

import { ROUTE } from "@/configs/constant/route";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TAB_ITEMS = [
  {
    name: "상품 등록",
    path: ROUTE.SELLER_PRODUCT,
  },
  {
    name: "전체 주문 목록",
    path: ROUTE.SELLER_ORDER,
  },
  {
    name: "CS관리",
    path: ROUTE.SELLER_CS,
  },
  {
    name: "취소/반품/교환",
    path: ROUTE.SELLER_RETURN,
  },
  {
    name: "정산 내역",
    path: ROUTE.SELLER_SETTLEMENT,
  },
];

export const SellerTabBar = () => {
  const pathname = usePathname();

  const isLoginPage = pathname.startsWith(ROUTE.SELLER_SIGNUP) || pathname.startsWith(ROUTE.SELLER_SIGNIN);

  if (isLoginPage) {
    return null;
  }

  return (
    <div className="flex rounded-t-md overflow-hidden">
      {TAB_ITEMS.map((item, i) => (
        <Link
          key={"seller-tab-bar" + i}
          href={item.path}
          className={`flex-1 py-3 text-lg font-semibold flex justify-center items-center ${
            pathname.includes(item.path)
              ? "bg-blue-40 text-white-solid"
              : "bg-grey-91 text-blue-40"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};
