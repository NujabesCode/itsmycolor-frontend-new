import { ColorSeason } from '../color-analysis/type';
import { Order } from '../order/type';
import { BodyType } from '../user/type';

export enum Gender {
  MALE = '남성',
  FEMALE = '여성',
}

export enum StyleCategory {
  TRENDY = '트렌디(Trendy)',
  SPORTY = '스포티(Sporty)',
  AVANTGARDE = '아방가르드(Avant-garde)',
  ROMANTIC = '로맨틱(Romantic)',
  BOHEMIAN = '보헤미안(Bohemian)',
  CLASSIC = '클래식(Classic)',
  MODERN = '모던(Modern)',
  RETRO = '레트로(Retro)',
  HIPHOP = '힙합(Hip-hop)',
  NORMCORE = '놈코어(Normcore)',
  MINIMAL = '미니멀',
  FEMININE = '페미닌',
  STREET = '스트릿',
  VINTAGE = '빈티지',
}

export interface ProductListItem {
  id: string;
  name: string;
  price: number;
  usdPrice: number;
  stockQuantity: number;
  recommendedColorSeason: ColorSeason[];
  recommendedBodyType: BodyType;
  imageUrl: string;
  brand: string;
  brandInfo: {
    id: string;
    logoUrl: string;
    name: string;
  };
  isAvailable: boolean;
  rejectionReason?: string | null; // PD-011: 반려 사유
  createdAt: string;
}

export interface Product {
  id: string;
  imageUrl: string;
  isAvailable: boolean;
  description: string;
  material: string | null;
  modelInfo: object | null;
  name: string;
  price: number;
  usdPrice: number;
  recommendedColorSeason: ColorSeason[];
  recommendedBodyType: BodyType;
  recommendedGender?: Gender | null;
  refundInfo: {
    address?: string;
  } | null;
  reviewCount: number;
  saleStartDate: string;
  hasSaleEndDate: boolean;
  saleEndDate: string | null;
  salesCount: number;
  shippingFee: number;
  freeShippingAmount: number;
  sizeInfo: {
    S?: string;
    M?: string;
    L?: string;
  } | null;
  sizeOptions: object | null;
  stockQuantity: number;
  styleCategories: StyleCategory[];
  createdAt: string;
  updatedAt: string;
  colorOptions: object | null;
  viewCount: number;
  brand: string;
  brandInfo: {
    id: string;
    logoUrl: string;
    name: string;
  };
  bodyInfo: {
    height: number;
    weight: number;
  } | null;
  averageRating: number;
  additionalImageUrls: string[] | null;
}

export type MainProducts = {
  [ColorSeason.SPRING_BRIGHT]: ProductListItem | null;
  [ColorSeason.SPRING_LIGHT]: ProductListItem | null;
  [ColorSeason.SUMMER_LIGHT]: ProductListItem | null;
  [ColorSeason.SUMMER_MUTE]: ProductListItem | null;
  [ColorSeason.AUTUMN_DEEP]: ProductListItem | null;
  [ColorSeason.AUTUMN_MUTE]: ProductListItem | null;
  [ColorSeason.WINTER_DARK]: ProductListItem | null;
  [ColorSeason.WINTER_BRIGHT]: ProductListItem | null;
  [BodyType.NATURAL]: ProductListItem | null;
  [BodyType.STRAIGHT]: ProductListItem | null;
  [BodyType.WAVE]: ProductListItem | null;
};
