import axios from "axios";

import { STORAGE } from "@/configs/constant/storage";

// 브라우저에서 실행 중일 때는 환경 변수 또는 기본값 사용
// ENV를 직접 import하지 않고 런타임에 값을 가져와서 순환 참조 방지
const getApiUrl = () => {
  // 기본 백엔드 URL (프로덕션) - 항상 이 값을 사용
  const defaultApiUrl = "http://43.201.54.58:3000";
  
  try {
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      
      // 로컬 개발 환경
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://${hostname}:3000`;
      }
      
      // Vercel 배포 환경 또는 프로덕션 환경에서는 항상 올바른 URL 사용
      // api.itsmycolorshop.com은 SSL 인증서 만료로 사용 불가
      // 환경 변수에 관계없이 항상 올바른 URL 반환
      console.warn('[API URL] 프로덕션 환경 감지 - 올바른 백엔드 URL 사용:', defaultApiUrl);
      
      // HTTPS 사이트에서 HTTP API 호출 시 Mixed Content 경고
      const protocol = window.location.protocol;
      if (protocol === 'https:' && defaultApiUrl.startsWith('http:')) {
        console.warn('[API URL] HTTPS 사이트에서 HTTP API 호출 - Mixed Content 문제 가능성:', defaultApiUrl);
      }
      
      // 디버깅 로그 (프로덕션에서도 표시)
      console.log('[API URL] 최종 설정:', {
        url: defaultApiUrl,
        hostname,
        protocol,
        isVercel: hostname.includes('vercel.app'),
      });
      
      return defaultApiUrl;
    }
  } catch (e) {
    // window 접근 실패 시 기본값 반환
    console.warn('[API URL] window 접근 실패, 기본값 사용:', e);
  }
  
  // 서버 사이드: 항상 올바른 URL 사용
  return defaultApiUrl;
};

// axios instance를 동적으로 생성하여 런타임에 올바른 URL 사용
// Vercel 환경 변수가 잘못 설정되어 있어도 런타임에 강제로 올바른 URL 사용
const getRuntimeApiUrl = () => {
  if (typeof window === 'undefined') {
    return "http://43.201.54.58:3000";
  }
  
  const hostname = window.location.hostname;
  
  // 로컬 개발 환경
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://${hostname}:3000`;
  }
  
  // 프로덕션 환경에서는 항상 올바른 URL 사용
  // api.itsmycolorshop.com은 SSL 인증서 만료로 사용 불가
  const correctUrl = "http://43.201.54.58:3000";
  console.log('[getRuntimeApiUrl] 올바른 API URL 반환:', correctUrl);
  return correctUrl;
};

// 항상 올바른 API URL 사용 (api.itsmycolorshop.com 완전 차단)
const FORCE_API_URL = "http://43.201.54.58:3000";

export const axiosInstance = axios.create({
  baseURL: FORCE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: null, // 배열을 colorSeasons[] 형식으로 직렬화
  },
});

// axios instance의 baseURL을 런타임에 강제로 설정 (빌드 시점 값 무시)
if (typeof window !== 'undefined') {
  axiosInstance.defaults.baseURL = FORCE_API_URL;
  console.log('[axiosInstance] baseURL 강제 설정:', FORCE_API_URL);
}

axiosInstance.interceptors.request.use(
  (config) => {
    // 항상 올바른 API URL 사용 (로컬 개발 환경 제외)
    const correctApiUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? `http://${window.location.hostname}:3000`
      : FORCE_API_URL;
    
    // baseURL을 항상 올바른 URL로 강제 설정
    if (config.baseURL !== correctApiUrl) {
      if (config.baseURL && config.baseURL.includes('api.itsmycolorshop.com')) {
        console.error('[API Request] api.itsmycolorshop.com 차단 - 올바른 URL로 강제 변경:', config.baseURL, '->', correctApiUrl);
      }
      config.baseURL = correctApiUrl;
    }
    
    // url이 전체 URL로 시작하는 경우
    if (config.url && (config.url.startsWith('http://') || config.url.startsWith('https://'))) {
      // api.itsmycolorshop.com이 포함되어 있으면 무조건 차단하고 올바른 URL로 변경
      if (config.url.includes('api.itsmycolorshop.com')) {
        console.error('[API Request] url에 api.itsmycolorshop.com 포함 - 차단하고 올바른 URL로 변경');
        const urlPath = config.url.replace(/https?:\/\/api\.itsmycolorshop\.com/, '');
        config.url = urlPath;
        config.baseURL = correctApiUrl;
      } else if (!config.url.includes('43.201.54.58') && !config.url.includes('localhost')) {
        // 다른 잘못된 URL인 경우도 차단
        console.error('[API Request] 잘못된 URL 감지 - 올바른 URL로 변경:', config.url);
        const urlPath = config.url.replace(/https?:\/\/[^\/]+/, '');
        config.url = urlPath;
        config.baseURL = correctApiUrl;
      }
    }
    
    // 최종 확인: baseURL이 올바른지 체크 (로컬 개발 환경 제외)
    if (config.baseURL && config.baseURL !== correctApiUrl && !config.baseURL.includes('localhost')) {
      console.warn('[API Request] baseURL이 예상과 다릅니다. 올바른 URL로 변경:', config.baseURL, '->', correctApiUrl);
      config.baseURL = correctApiUrl;
    }
    
    // 서버 사이드에서는 localStorage/sessionStorage 접근 불가
    let token = null;
    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem(STORAGE.TOKEN);
      const sessionToken = sessionStorage.getItem(STORAGE.TOKEN);
      token = localToken || sessionToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // FormData를 사용하는 경우 Content-Type을 제거하여 브라우저가 자동으로 설정하도록 함
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // 디버깅: API 요청 로그
    const finalFullUrl = (config.baseURL || correctApiUrl) + (config.url || '');
    console.log('[API Request]', config.method?.toUpperCase(), config.url, {
      baseURL: config.baseURL,
      fullURL: finalFullUrl,
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
      // 네트워크 에러 또는 Mixed Content 문제 감지
      const isMixedContent = typeof window !== 'undefined' && 
        window.location.protocol === 'https:' && 
        error.config?.baseURL?.startsWith('http:');
      
      const isCorsError = error.message?.includes('CORS') || 
        error.message?.includes('Network Error') ||
        error.code === 'ERR_NETWORK';
      
      console.error('[API Network Error]', {
        url: error.request.url || error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.message,
        code: error.code,
        isMixedContent,
        isCorsError,
        request: error.request,
      });
      
      // Mixed Content 문제인 경우 사용자에게 알림
      if (isMixedContent && typeof window !== 'undefined') {
        console.error('[API] Mixed Content 문제 감지: HTTPS 사이트에서 HTTP API 호출 시도');
        // 에러 메시지에 Mixed Content 정보 추가
        const mixedContentError = new Error('Mixed Content: HTTPS 사이트에서 HTTP API를 호출할 수 없습니다. 네트워크 연결을 확인해주세요.');
        mixedContentError.name = 'MixedContentError';
        return Promise.reject(mixedContentError);
      }
      
      // CORS 에러인 경우
      if (isCorsError) {
        console.error('[API] CORS 에러 감지: 서버에서 CORS를 허용하지 않거나 네트워크 연결 문제');
        const corsError = new Error('네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
        corsError.name = 'NetworkError';
        return Promise.reject(corsError);
      }
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
