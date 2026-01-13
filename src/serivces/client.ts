import axios from "axios";

import { ENV } from "@/configs/app/env";
import { STORAGE } from "@/configs/constant/storage";

// 브라우저에서 실행 중일 때는 현재 호스트의 백엔드 포트 사용
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // 브라우저 환경: 현재 호스트의 백엔드 포트 사용
    const host = window.location.hostname;
    return `http://${host}:3000`;
  }
  // 서버 사이드: 환경 변수 또는 기본값 사용
  return (ENV.API_URL && ENV.API_URL.trim() !== "") ? ENV.API_URL : "http://localhost:3000";
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
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 로그인 페이지로 리다이렉트 등의 처리
    }
    return Promise.reject(error);
  }
);
