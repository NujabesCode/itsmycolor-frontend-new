export enum OrderStatus {
  PENDING = '주문 접수',
  CONFIRMED = '결제 완료',
  SHIPPED = '배송 준비',
  DELIVERING = '배송 중',
  DELIVERED = '배송 완료',
  CANCELLED = '주문 취소',
}

export interface Order {
  id: string;
  createdAt: string;
  customDeliveryRequest?: string;
  detailAddress: string;
  discountAmount: number;
  orderItems: {
    id: string;
    createdAt: string;
    isReviewed: boolean;
    orderId: string;
    price: number;
    productId: string;
    productImageUrl: string;
    productName: string;
    quantity: number;
    size: string;

    order: Order;
  }[];
  orderNUmber: string;
  paymentId: string | null;
  paymentMethod: string;
  productAmount: number;
  currency: string;
  totalAmount: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingFee: number;
  status: OrderStatus;
  updatedAt: string;
  zipCode: string;
  deliveryCompany?: string;
  deliveryTrackingNumber?: string;
}
