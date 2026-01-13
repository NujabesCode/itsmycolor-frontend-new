import { axiosInstance } from '../client';
import { Order, OrderStatus } from './type';

export const orderApi = {
  createOrder: async (data: {
    currency: string;
    
    recipientName: string;
    recipientPhone: string;

    zipCode: string;
    shippingAddress: string;
    detailAddress: string;
    customDeliveryRequest: string;

    productAmount: number;
    shippingFee: number;
    totalAmount: number;

    orderItems: {
      productId: string;
      productName: string;
      quantity: number;
      size: string;
      price: number;
      productImageUrl: string;
    }[];

    couponId?: string;
  }): Promise<Order> => {
    const res = await axiosInstance.post('/orders', {
      ...data,
      privacyAgreement: true,
      purchaseAgreement: true,
    });

    return res.data;
  },
  getOrder: async (orderId: string): Promise<Order> => {
    const res = await axiosInstance.get(`/orders/${orderId}`);
    return res.data;
  },
  getOrderList: async (params: { page?: number, status?: OrderStatus, search?: string, startDate?: string, endDate?: string  }): Promise<{ orders: Order[]; lastPage: number }> => {
    const res = await axiosInstance.get('/orders', {
      params,
    });
    return {
      orders: res.data.orders,
      lastPage: res.data.lastPage,
    };
  },
  getOrderListByBrand: async (
    brandId: string, 
    params: { 
      page?: number; 
      statuses?: OrderStatus[]; 
      search?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }
  ): Promise<{ orders: Order[]; total: number; lastPage: number }> => {
    const res = await axiosInstance.get(`/orders/brands/${brandId}`, {
      params: {
        ...params,
        'statuses[]': params.statuses,
      },
    });
    return res.data;
  },
  getMonthlyOrderListByBrand: async (
    brandId: string,
    params: {
      year: number;
      month: number;
    }
  ): Promise<Order[]> => {
    const res = await axiosInstance.get(`/orders/brands/${brandId}/monthly`, {
      params,
    });
    return res.data;
  },
  getTodayOrderListByBrand: async (brandId: string): Promise<Order[]> => {
    const res = await axiosInstance.get(`/orders/brands/${brandId}/today`);
    return res.data;
  },
  patchManyOrderStatus: async (
    orderIds: string[], 
    status: OrderStatus, 
    deliveryCompany?: string, 
    deliveryTrackingNumber?: string
  ): Promise<{ data: { success: number; failed: number; failedIds: string[] } }> => {
    return await axiosInstance.patch('/orders/many/status', {
      orderIds,
      status,
      deliveryCompany,
      deliveryTrackingNumber,
    });
  },
  patchOrderStatus: async (orderId: string, status: OrderStatus, deliveryCompany?: string, deliveryTrackingNumber?: string) => {
    return await axiosInstance.patch(`/orders/${orderId}/status`, {
      status,
      deliveryCompany,
      deliveryTrackingNumber,
    });
  },
};
