import { Product } from "../product/type";

export enum BrandStatus {
  PENDING = "심사중",
  APPROVED = "승인됨",
  REJECTED = "거부됨",
  REAPPLY = "재심사 요청", // SM-008: 재심사 요청 상태 추가
}

export interface Brand {
  id: string;
  name: string;
  engName: string | null;
  logoUrl: string | null;
  backgroundUrl: string | null;
  description: string | null;
  businessType: string | null;
  businessNumber: string | null;
  representativeName: string | null;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
  sns: string | null;

  companyName: string | null;
  // 신규 필드
  /** 문의 유형 */
  inquiryType: string | null;
  /** 카테고리 */
  primaryCategory: string | null;
  /** 서브 카테고리 */
  secondaryCategory: string | null;
  /** SKU 개수 */
  skuCount: number | null;
  /** 판매 채널 */
  salesChannels: string | null;
  /** 타겟 고객 */
  targetCustomer: string | null;
  /** 기타 요청사항 */
  etcRequest: string | null;
  /** 브랜드 PDF URL */
  brandPdfUrl: string | null;

  status: BrandStatus;
  userId: string;
  recommendedColors: object | null;
  createdAt: string;
  updatedAt: string;

  // SM-006, SM-007: 반려 사유
  rejectionReason?: string | null;
  // SM-010: 제재 사유
  sanctionReason?: string | null;
  // SM-012: 변경 이력
  changeHistory?: Array<{
    date: string;
    adminName: string;
    action: string;
    reason?: string;
    status: BrandStatus;
  }> | null;

  products: Product[];

  brandLikes: {
    id: string;
    userId: string;
    brandId: string;
    createdAt: string;
  }[];
}
