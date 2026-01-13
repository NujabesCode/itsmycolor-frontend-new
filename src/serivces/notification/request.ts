import { axiosInstance } from "../client";
import { Notification } from "./type";

export const notificationApi = {
  getMyNotifications: async (): Promise<Notification[]> => {
    const res = await axiosInstance.get("/notifications/me");
    return res.data;
  },
  markNotificationAsRead: async (id: string): Promise<Notification> => {
    const res = await axiosInstance.patch(`/notifications/${id}/read`);
    return res.data;
  },
};