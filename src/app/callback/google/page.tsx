"use client";

import { useSocialLoginCallback } from "@/hooks/auth/useSocialLoginCallback";

export default function GoogleCallbackPage() {
  useSocialLoginCallback("google");

  return null;
}
