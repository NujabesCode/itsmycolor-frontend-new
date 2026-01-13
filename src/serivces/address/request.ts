import { axiosInstance } from '../client';
import { Address } from './type';

export interface CreateAddressDto {
  name: string;
  phone: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  deliveryRequest?: string;
}

export const addressApi = {
  getAddress: async (): Promise<Address | null> => {
    const res = await axiosInstance.get('/addresses/me');
    return res.data;
  },
  createAddress: async (
    data: CreateAddressDto,
  ): Promise<Address> => {
    const res = await axiosInstance.post('/addresses/me', data);
    return res.data;
  },
}; 