import { axiosInstance } from "../client";
import { Return, ReturnStatus } from "./type";

export const returnApi = {
  createReturn: async (data: {
    orderId: string;
    orderItemId: string;
    reason: string;
    detailReason: string;

    refundBank: string;
    refundAccountNumber: string;
    refundAccountHolder: string;
  }) => {
    return await axiosInstance.post("/returns", data);
  },
  getReturnListByBrand: async (brandId: string): Promise<Return[]> => {
    const res = await axiosInstance.get(`/returns/brands/${brandId}`);
    return res.data;
  },
  putReturnStatus: async (returnId: string, status: ReturnStatus) => {
    return await axiosInstance.put(`/returns/${returnId}`, { status });
  },
};
