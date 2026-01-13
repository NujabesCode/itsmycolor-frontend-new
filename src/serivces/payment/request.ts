import { axiosInstance } from '../client';
import { Payment } from './type';

export const paymentApi = {
  verifyPayment: async (data: {
    paymentKey: string;
    orderId: string;
    amount: number;
  }): Promise<Payment> => {
    const res = await axiosInstance.post('/payments/verify', data);
    return res.data;
  },
};
