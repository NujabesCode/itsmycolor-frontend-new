import { Product } from "../product/type";

export enum BodyType {
  STRAIGHT = "스트레이트",
  WAVE = "웨이브",
  NATURAL = "내추럴",
}

export enum UserRole {
  USER = "일반 고객",
  CONSULTANT = "컨설턴트",
  BRAND_ADMIN = "브랜드 관리자",
  SYSTEM_ADMIN = "시스템 관리자",
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  productLikes: {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
  }[];
  brandLikes: {
    id: string;
    userId: string;
    brandId: string;
    createdAt: string;
  }[];
}