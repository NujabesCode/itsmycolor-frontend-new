import { axiosInstance } from "../client";
import { User } from "./type";

export const userApi = {
  getUser: async (): Promise<User> => {
    const res = await axiosInstance.get("/users/profile");
    return res.data;
  },
  updateUser: async (name: string, phone: string) => {
    return await axiosInstance.patch("/users/profile", { name, phone });
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    return await axiosInstance.patch("/users/profile/password", { currentPassword, newPassword });
  },
  checkEmail: async (email: string): Promise<{ isAvailable: boolean; message: string }> => {
    const res = await axiosInstance.get(`/users/check-email/${encodeURIComponent(email)}`);
    return res.data;
  },
};
