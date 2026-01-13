import { ColorSeason } from "../color-analysis/type";
import { QnaType } from "../qna/type";
import { BodyType } from "../user/type";

export enum CustomerType {
  // ALL = "전체",
  CONSULTING = "컨설팅 고객",
  PURCHASE = "구매 고객",
  VIP = "VIP 고객",
}

export interface Customer {
  id: string;
  isVip: boolean | null;
  lastVisitDate: string | null;
  name: string;
  phone: string;
  email: string;
  bodyType: BodyType;
  colorSeason: ColorSeason;
  purchaseInfo: {
    totalAmount: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export enum QnaStatus {
  WAITING = "답변대기",
  ANSWERED = "답변완료",
}

export interface Qna {
  id: string;
  title: string;
  content: string;
  type: QnaType;
  status: QnaStatus;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;

  user: {
    name: string;
  };

  answer: string | null;
  answeredAt: string | null;
  answeredBy: string | null;
}

export interface Dashboard {
  customerStatistics: {
    totalCustomers: number;
    consultingCustomers: number;
    purchaseCustomers: number;
    vipCustomers: number;
  };
  monthlySales: Array<{
    month: string;
    amount: number;
  }>;
  bodyTypeAnalysis: Array<{
    type: string;
    percentage: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: string;
  }>;
  ageGroupSales: Array<{
    ageGroup: string;
    male: number;
    female: number;
  }>;
  consultingConversion: {
    overall: number;
    colorAnalysis: number;
    bodyTypeAnalysis: number;
    styleAnalysis: number;
  };
  brandPerformance: Array<{
    brand: string;
    count: number;
    amount: number;
    growthRate: number;
    topStyles: string;
  }>;
  bodyTypeSales: Array<{
    type: string;
    percentage: number;
  }>;
}

export enum BannerVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string | null;
  visibility: BannerVisibility;
  priority: number;
  imagePcUrl?: string | null;
  imageMobileUrl?: string | null;
  linkUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}