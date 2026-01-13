import { axiosInstance } from "@/serivces/client";

export const authApi = {
  register: async (email: string, password: string, passwordConfirm: string, name: string, phone: string, token?: string) => {
    return await axiosInstance.post("/auth/register", {
      email,
      password,
      passwordConfirm,
      name,
      phone,
      token: token ? token : undefined,
    });
  },

  loginByEmail: async (email: string, password: string): Promise<{
    hasBrand: boolean;
    isBrandApproved: boolean;
    accessToken: string;
    user: { id: string }
  }> => {
    const res = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return res.data;
  },

  loginBySocial: async (
    provider: "google" | "kakao" | "naver",
    code: string
  ): Promise<{
    hasBrand: boolean;
    isRegistered: boolean;
    accessToken: string;
  }> => {
    const res = await axiosInstance.get(`/auth/${provider}`, {
      params: { code },
    });
    return res.data;
  },
};
