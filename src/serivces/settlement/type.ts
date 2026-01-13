import { Brand } from '../brand/type';

export interface Settlement {
  id: string;
  settlementMonth: string;
  totalSales: number;
  commissionAmount: number;
  actualSettlementAmount: number;
  status: SettlementStatus;
  createdAt: string;

  brand: Brand;
}

export enum SettlementStatus {
  PENDING = '정산대기',
  PAYMENT_SCHEDULED = '지급 예정',
  COMPLETED = '지급 완료',
}
