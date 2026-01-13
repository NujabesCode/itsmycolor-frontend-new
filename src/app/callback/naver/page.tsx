"use client";

import { useSocialLoginCallback } from "@/hooks/auth/useSocialLoginCallback";

export default function NaverCallbackPage() {
  useSocialLoginCallback("naver");

  return null;
}
