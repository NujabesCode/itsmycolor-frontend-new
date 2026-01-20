import axios from "axios";

import { ENV } from "@/configs/app/env";
import { STORAGE } from "@/configs/constant/storage";

// 브라우저에서 실행 중일 때는 환경 변수 또는 기본값 사용
const getApiUrl = () => {
  // 기본 백엔드 URL (프로덕션) - 항상 이 값을 사용
  const defaultApiUrl = "http://13.125.130.10:3000";
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // 로컬 개발 환경
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:3000`;
    }
    
    // Vercel 배포 환경에서는 항상 올바른 URL 사용
    // api.itsmycolorshop.com은 SSL 인증서 만료로 사용 불가
    if (hostname.includes('vercel.app') || hostname.includes('itsmycolor')) {
      console.warn('[API URL] Vercel 배포 환경 감지 - 올바른 백엔드 URL 사용:', defaultApiUrl);
      return defaultApiUrl;
    }
    
    // 프로덕션 환경: 환경 변수 확인
    const protocol = window.location.protocol;
    let envApiUrl = ENV.API_URL || defaultApiUrl;
    
    // api.itsmycolorshop.com은 SSL 인증서 만료로 사용 불가 - 강제로 올바른 URL로 변경
    if (envApiUrl.includes('api.itsmycolorshop.com')) {
      console.warn('[API URL] api.itsmycolorshop.com 감지 - SSL 인증서 만료로 인해 올바른 URL로 강제 변경:', defaultApiUrl);
      envApiUrl = defaultApiUrl;
    }
    
    // HTTPS 사이트에서 HTTP API 호출 시 Mixed Content 경고
    if (protocol === 'https:' && envApiUrl.startsWith('http:')) {
      console.warn('[API URL] HTTPS 사이트에서 HTTP API 호출 - Mixed Content 문제 가능성:', envApiUrl);
    }
    
    // 디버깅 로그 (프로덕션에서도 표시)
    console.log('[API URL]', {
      url: envApiUrl,
      fromENV: ENV.API_URL,
      hostname,
      protocol,
      isVercel: hostname.includes('vercel.app'),
    });
    
    return envApiUrl;
  }
  
  // 서버 사이드: 항상 올바른 URL 사용
  return defaultApiUrl;
};

export const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const localToken = localStorage.getItem(STORAGE.TOKEN);
    const sessionToken = sessionStorage.getItem(STORAGE.TOKEN);

    const token = localToken || sessionToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // FormData를 사용하는 경우 Content-Type을 제거하여 브라우저가 자동으로 설정하도록 함
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // 디버깅: API 요청 로그
    console.log('[API Request]', config.method?.toUpperCase(), config.url, {
      baseURL: config.baseURL,
      params: config.params,
    });
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // 성공 응답 로그
    console.log('[API Response]', response.status, response.config?.url, {
      dataLength: response.data ? (Array.isArray(response.data) ? response.data.length : Object.keys(response.data).length) : 0,
    });
    return response;
  },
  (error) => {
    // 에러 로깅 (프로덕션에서도 확인 가능)
    if (error.response) {
      console.error('[API Error]', {
        status: error.response.status,
        url: error.response.config?.url,
        baseURL: error.response.config?.baseURL,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('[API Network Error]', {
        url: error.request.url || error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.message,
        code: error.code,
        request: error.request,
      });
    } else {
      console.error('[API Error]', {
        message: error.message,
        config: error.config,
      });
    }
    
    if (error.response?.status === 401) {
      // 로그인 페이지로 리다이렉트 등의 처리
    }
    return Promise.reject(error);
  }
);
