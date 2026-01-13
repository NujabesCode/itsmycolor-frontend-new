export enum ReturnReason {
  SIZE = "사이즈 문제",
  COLOR = "색상 문제",
  DAMAGED = "상품 불량",
  DIFFERENT = "상품 상이",
  LOST_INTEREST = "단순 변심",
  OTHER = "기타",
}

export enum ReturnStatus {
  REQUESTED = "반품신청",
  REVIEWING = "검토중",
  APPROVED = "승인",
  SHIPPING = "반품배송중",
  COMPLETED = "반품완료",
  REJECTED = "거부",
}

export interface Return {
  approvedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  detailReason: string;
  id: string;
  orderItem: {
    id: string;
    price: number;
    productName: string;
    quantity: number;
    size: string;
  };
  order: {
    recipientName: string;
  };
  reason: ReturnReason;
  status: ReturnStatus;
}
