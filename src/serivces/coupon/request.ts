import { axiosInstance } from "../client";
import { Coupon } from "./type";

export const couponApi = {
  getMyCoupons: async (): Promise<Coupon[]> => {
    const res = await axiosInstance.get("/coupons");
    return res.data;
  },
};
