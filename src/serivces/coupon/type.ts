export interface Coupon {
  id: string;
  type: CouponType;
  value: number;
  expiredAt: string; // ISO formatted date string
  isUsed: boolean;
  minPrice: number;
}

export enum CouponType {
  PERCENT = 'per',
  FIXED = 'fix',
}
