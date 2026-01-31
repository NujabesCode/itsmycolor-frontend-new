"use client";

export const useSocialLogin = () => {
  const onKakaoLogin = () => {
    const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '';
    const kakaoRedirectUrl = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL || '';
    const url =
      "https://kauth.kakao.com/oauth/authorize?client_id=" +
      kakaoJsKey +
      "&redirect_uri=" +
      kakaoRedirectUrl +
      "&response_type=code&" +
      "scope=account_email";

    window.location.href = url;
  };

  const onGoogleLogin = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const googleRedirectUrl = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || '';
    const url =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
      googleClientId +
      "&redirect_uri=" +
      googleRedirectUrl +
      "&response_type=code&" +
      "scope=email profile";

    window.location.href = url;
  };

  const onNaverLogin = () => {
    const naverClientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || '';
    const naverRedirectUrl = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URL || '';
    const naverState = process.env.NEXT_PUBLIC_NAVER_STATE || '';
    const url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' +
      naverClientId +
      "&redirect_uri=" +
      naverRedirectUrl +
      "&state=" +
      naverState;

    window.location.href = url;
  };

  return { onKakaoLogin, onGoogleLogin, onNaverLogin };
};
