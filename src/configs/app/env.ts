// api.itsmycolorshop.com은 SSL 인증서 만료로 사용 불가
// Vercel 환경 변수가 잘못 설정되어 있어도 런타임에 강제로 올바른 URL 사용
const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://13.125.130.10:3000";
  // api.itsmycolorshop.com이 설정되어 있으면 항상 올바른 URL로 변경
  if (envUrl.includes('api.itsmycolorshop.com')) {
    console.warn('[ENV] api.itsmycolorshop.com 감지 - 올바른 URL로 강제 변경');
    return "http://13.125.130.10:3000";
  }
  // Vercel 배포 환경에서는 항상 올바른 URL 사용
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return "http://13.125.130.10:3000";
  }
  return envUrl;
};

export const ENV = {
  API_URL: getApiUrl(),

  // TOSS
  TOSS_CLIENT_KEY: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "",

  // KAKAO
  KAKAO_JS_KEY: process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "",
  KAKAO_REDIRECT_URL: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL || "",

  // GOOGLE
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  GOOGLE_REDIRECT_URL: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || "",

  // NAVER
  NAVER_CLIENT_ID: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || "",
  NAVER_REDIRECT_URL: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URL || "",
  NAVER_STATE: process.env.NEXT_PUBLIC_NAVER_STATE || "",
};
