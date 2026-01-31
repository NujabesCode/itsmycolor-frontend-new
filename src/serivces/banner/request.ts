import { axiosInstance } from "../client";
import { Banner } from "../admin/type";

export const bannerApi = {
  getPublicBanners: async (): Promise<Banner[]> => {
    const response = await axiosInstance.get("/banners");
    return response.data || [];
  },
};
