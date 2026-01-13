"use client";

import { ROUTE } from "@/configs/constant/route";
import { usePathname } from "next/navigation";
import { SellerHeader } from "./SellerHeader";
import { BuyerHeader } from "./BuyerHeader";
import { SellerAuthHeader } from "./SellerAuthHeader";

export const Header = () => {
  const pathname = usePathname();
  const isAdmin = pathname.includes(ROUTE.ADMIN_MAIN) || pathname.includes(ROUTE.APPLY_NEW);
  const isSellerAuthPage = pathname.startsWith(ROUTE.SELLER_SIGNUP) || pathname.startsWith(ROUTE.SELLER_SIGNIN);
  const isSeller =
    pathname.includes(ROUTE.SELLER_MAIN) && !pathname.startsWith(ROUTE.MYPAGE);

  switch (true) {
    case isAdmin:
      return null;
    case isSellerAuthPage:
      return <SellerAuthHeader />;
    case isSeller:
      return <SellerHeader />;
    default:
      return <BuyerHeader />;
  }
};
