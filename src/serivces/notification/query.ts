"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY } from "@/configs/constant/query";
import { notificationApi } from "./request";

export const useGetMyNotifications = () => {
  return useQuery({
    queryKey: [QUERY.NOTIFICATION_LIST],
    queryFn: notificationApi.getMyNotifications,
  });
};