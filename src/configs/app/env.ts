// api.itsmycolorshop.com은 SSL 인증서 만료로 사용 불가
// 빌드 시점과 런타임 모두에서 올바른 URL 사용 보장
// 모듈 초기화 순서 문제를 방지하기 위해 모든 값을 상수로 설정

// API URL은 항상 고정값 사용 (로컬 개발은 client.ts에서 처리)
const DEFAULT_API_URL = "http://43.201.54.58:3000";

// 환경 변수에서 가져오되, api.itsmycolorshop.com은 차단
const envApiUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
const safeApiUrl = envApiUrl.includes('api.itsmycolorshop.com') 
  ? DEFAULT_API_URL 
  : envApiUrl;

export const ENV = {
  // API_URL은 항상 고정값 사용 (런타임에 window 체크는 client.ts에서 수행)
  API_URL: safeApiUrl,

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
} as const;
