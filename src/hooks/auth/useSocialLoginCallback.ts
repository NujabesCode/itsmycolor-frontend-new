"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useQueryString } from "@/hooks/common/useQueryString";
import { useAuth } from "@/hooks/auth/useAuth";
import { ROUTE } from "@/configs/constant/route";

export const useSocialLoginCallback = (provider: "google" | "kakao" | "naver") => {
  const router = useRouter();
  const { socialLogin } = useAuth();

  const [code] = useQueryString<string>("code", "");

  const isDoubleCheckRef = useRef(false);

  useEffect(() => {
    if (!code || isDoubleCheckRef.current) {
      return;
    }

    (async () => {
      isDoubleCheckRef.current = true;

      try {
        const { isRegistered } = await socialLogin(provider, code);

        // if (hasBrand) {
        //   router.replace(ROUTE.SELLER_MAIN);
        //   return;
        // }

        if (isRegistered) {
          alert("로그인에 성공했습니다.");

          router.replace(ROUTE.MYPAGE);
        } else {
          alert("추가 정보를 입력해주세요.");

          router.replace(ROUTE.MYPAGE_ONBOARD);
        }
      } catch {
        alert("일시적인 오류로 로그인에 실패했습니다.");
        router.replace(ROUTE.SIGNIN);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);
};
