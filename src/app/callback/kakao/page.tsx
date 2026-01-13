"use client";

import { useSocialLoginCallback } from "@/hooks/auth/useSocialLoginCallback";

export default function KakaoCallbackPage() {
  useSocialLoginCallback("kakao");

  return null;
}
