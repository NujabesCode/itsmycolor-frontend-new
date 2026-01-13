import { axiosInstance } from "../client";
import { Brand } from "./type";

export const brandApi = {
  createBrand: async (data: FormData) => {
    return await axiosInstance.post("/brands", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getBrand: async (): Promise<Brand | null> => {
    try {
      const res = await axiosInstance.get("/brands/my");
      return res.data.items?.[0] || null;
    } catch (error) {
      // Return null if no brand exists for the user
      return null;
    }
  },
  getBrandById: async (id: string): Promise<Brand> => {
    const res = await axiosInstance.get(`/brands/${id}`);
    return res.data;
  },
  updateBrand: async (id: string, data: FormData) => {
    return await axiosInstance.put(`/brands/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // 브랜드 찜
  likeBrand: async (id: string) => {
    return await axiosInstance.post(`/brands/${id}/like`);
  },
  // 브랜드 찜 취소
  unlikeBrand: async (id: string) => {
    return await axiosInstance.delete(`/brands/${id}/like`);
  },
};
