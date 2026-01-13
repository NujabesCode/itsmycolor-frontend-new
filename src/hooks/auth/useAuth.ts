"use client";

import { QUERY } from "@/configs/constant/query";
import { STORAGE } from "@/configs/constant/storage";
import { authApi } from "@/serivces/auth/request";
import { colorAnalysisApi } from "@/serivces/color-analysis/request";
import { ColorSeason } from "@/serivces/color-analysis/type";
import { userApi } from "@/serivces/user/request";
import { BodyType } from "@/serivces/user/type";
import { useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const invalidateQueryCache = async () => {
    await queryClient.invalidateQueries({
      queryKey: [QUERY.USER],
    });
    await queryClient.invalidateQueries({
      queryKey: [QUERY.COLOR_ANALYSIS],
    });
    await queryClient.invalidateQueries({
      queryKey: [QUERY.BRAND],
    });
  };

  const removeQueryCache = () => {
    queryClient.removeQueries({
      queryKey: [QUERY.USER],
    });
    queryClient.removeQueries({
      queryKey: [QUERY.COLOR_ANALYSIS],
    });
    queryClient.removeQueries({
      queryKey: [QUERY.BRAND],
    });
  };

  const register = async (
    email: string,
    phone: string,
    password: string,
    passwordConfirm: string,
    name: string,
    height: number,
    weight: number,
    bodyType: BodyType | null,
    colorSeason: ColorSeason | null
  ) => {
    await authApi.register(email, password, passwordConfirm, name, phone);

    // 회원가입 후 자동 로그인 (localStorage에 저장하여 로그인 유지)
    const {
      accessToken,
      user: { id: userId },
    } = await authApi.loginByEmail(email, password);

    // 자동 로그인을 위해 localStorage에 저장
    localStorage.setItem(STORAGE.TOKEN, accessToken);

    await colorAnalysisApi.createColorAnalysis(userId, height, weight, bodyType, colorSeason);

    await invalidateQueryCache();
  };

  const socialRegister = async (
    userId: string,
    name: string,
    phone: string,
    height: number,
    weight: number,
    bodyType: BodyType | null,
    colorSeason: ColorSeason | null
  ) => {
    await userApi.updateUser(name, phone);

    await colorAnalysisApi.createColorAnalysis(userId, height, weight, bodyType, colorSeason);

    await invalidateQueryCache();
  };

  const login = async (email: string, password: string, isAutoLogin: boolean) => {
    const { hasBrand, isBrandApproved, accessToken } = await authApi.loginByEmail(email, password);

    if (isAutoLogin) {
      localStorage.setItem(STORAGE.TOKEN, accessToken);
    } else {
      sessionStorage.setItem(STORAGE.TOKEN, accessToken);
    }

    await invalidateQueryCache();

    return { hasBrand, isBrandApproved };
  };

  const socialLogin = async (provider: "google" | "kakao" | "naver", code: string): Promise<{ hasBrand: boolean; isRegistered: boolean }> => {
    const { hasBrand, isRegistered, accessToken } = await authApi.loginBySocial(provider, code);

    localStorage.setItem(STORAGE.TOKEN, accessToken);

    await invalidateQueryCache();

    return { hasBrand, isRegistered };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE.TOKEN);
    sessionStorage.removeItem(STORAGE.TOKEN);

    removeQueryCache();
  };

  const getToken = () => {
    return localStorage.getItem(STORAGE.TOKEN) || sessionStorage.getItem(STORAGE.TOKEN);
  };

  return { register, socialRegister, login, socialLogin, logout, getToken };
};
