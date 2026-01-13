"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTE } from "@/configs/constant/route";

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTE.ADMIN_BRAND);
  }, [router]);

  return null;
}
