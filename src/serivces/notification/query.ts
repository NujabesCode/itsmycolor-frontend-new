"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";
import { notificationApi } from "./request";

export const useGetMyNotifications = () => {
  return useQuery({
    queryKey: [QUERY.NOTIFICATION_LIST],
    queryFn: async () => {
      try {
        return await notificationApi.getMyNotifications();
      } catch (error: any) {
        // 401 에러는 정상 (로그인 안 된 상태)
        if (error?.response?.status === 401) {
          return [];
        }
        // 네트워크 에러는 조용히 처리 (백엔드 서버 연결 불가 시)
        if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error') || error?.message?.includes('ERR_CONNECTION_REFUSED')) {
          console.warn('[useGetMyNotifications] 네트워크 에러 - 알림 정보를 가져올 수 없습니다:', error?.message);
          return [];
        }
        console.error('[useGetMyNotifications] Failed to fetch notifications:', error);
        return []; // 에러 발생 시 빈 배열 반환하여 앱이 크래시하지 않도록 함
      }
    },
    retry: false,
  });
};