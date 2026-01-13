"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";

export default function Seller() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTE.SELLER_PRODUCT);
  }, [router]);

  return null;
}
