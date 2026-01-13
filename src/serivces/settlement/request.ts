import { axiosInstance } from '../client';
import { Settlement } from './type';

export const settlementApi = {
  createSettlement: async (
    brandId: string,
    data: {
      settlementMonth: string;
      totalSales: number;
      commissionRate: number;
      commissionAmount: number;
      actualSettlementAmount: number;
    }
  ) => {
    return await axiosInstance.post(`/settlements/brands/${brandId}`, data);
  },
  getSettlementListByBrand: async (brandId: string): Promise<Settlement[]> => {
    const res = await axiosInstance.get(`/settlements/brands/${brandId}`);
    return res.data;
  },
};
