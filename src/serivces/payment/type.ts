import { Order } from '../order/type';

export interface Payment {
  id: string;
  orderId: string;
  paymentKey: string;
  virtualAccount: string | null;
  isPaid: boolean;
  isCanceled: boolean;
  paidAmount: number;
  cancelAmount: number;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;

  order: Order;
}

export const BANKCODE_TO_KOREAN = {
  '39': '경남은행',
  '34': '광주은행',
  '12': '단위농협(지역농축협)',
  '32': '부산은행',
  '45': '새마을금고',
  '64': '산림조합',
  '88': '신한은행',
  '48': '신협',
  '27': '씨티은행',
  '20': '우리은행',
  '71': '우체국예금보험',
  '50': '저축은행중앙회',
  '37': '전북은행',
  '35': '제주은행',
  '90': '카카오뱅크',
  '89': '케이뱅크',
  '92': '토스뱅크',
  '81': '하나은행',
  '54': '홍콩상하이은행',
  '03': 'IBK기업은행',
  '06': 'KB국민은행',
  '31': 'DGB대구은행',
  '02': 'KDB산업은행',
  '11': 'NH농협은행',
  '23': 'SC제일은행',
  '07': 'Sh수협은행',
} as { [key: string]: string };
