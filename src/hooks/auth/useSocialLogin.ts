"use client";

import { ENV } from "@/configs/app/env";

export const useSocialLogin = () => {
  const onKakaoLogin = () => {
    const url =
      "https://kauth.kakao.com/oauth/authorize?client_id=" +
      ENV.KAKAO_JS_KEY +
      "&redirect_uri=" +
      ENV.KAKAO_REDIRECT_URL +
      "&response_type=code&" +
      "scope=account_email";

    window.location.href = url;
  };

  const onGoogleLogin = () => {
    const url =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
      ENV.GOOGLE_CLIENT_ID +
      "&redirect_uri=" +
      ENV.GOOGLE_REDIRECT_URL +
      "&response_type=code&" +
      "scope=email profile";

    window.location.href = url;
  };

  const onNaverLogin = () => {
    const url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' +
      ENV.NAVER_CLIENT_ID +
      "&redirect_uri=" +
      ENV.NAVER_REDIRECT_URL +
      "&state=" +
      ENV.NAVER_STATE;

    window.location.href = url;
  };

  return { onKakaoLogin, onGoogleLogin, onNaverLogin };
};
