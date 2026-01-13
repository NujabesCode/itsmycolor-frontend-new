import { STORAGE } from '@/configs/constant/storage';
import { ColorSeason } from '@/serivces/color-analysis/type';
import { productApi } from '@/serivces/product/request';
import { StyleCategory, Gender } from '@/serivces/product/type';
import { ClothingCategory } from '@/serivces/product/clothing-category';
import { BodyType } from '@/serivces/user/type';
import { createStore } from 'zustand/vanilla';

type Step1 = {
  name: string | null;
  recommendedColorSeason: ColorSeason[] | null;
  styleCategories: StyleCategory[] | null;
  clothingCategory: ClothingCategory | null;
  recommendedGender: Gender | null;
};

type Step2 = {
  price: number | null;
  usdPrice: number | null;
  stockQuantity: number | null;
  saleStartDate: Date | null;
  hasSaleEndDate: boolean;
  saleEndDate?: Date | null;
};

type Step3 = {
  description: string | null;

  mainImage: File | null;
  removeImageUrls: string[];
  additionalImages: File[] | null;

  originMainImage: string | null;
  originAdditionalImages: string[] | null;

  height: number | null;
  weight: number | null;

  S: {
    어깨너비: number | null;
    가슴둘레: number | null;
    소매길이: number | null;
    총장: number | null;
  };

  M: {
    어깨너비: number | null;
    가슴둘레: number | null;
    소매길이: number | null;
    총장: number | null;
  };

  L: {
    어깨너비: number | null;
    가슴둘레: number | null;
    소매길이: number | null;
    총장: number | null;
  };
};

type Step4 = {
  recommendedBodyType: BodyType | null;
};

type Step5 = {
  shippingFee: number | null;
  freeShippingAmount: number | null;
  refundAddress: string | null;
  returnReason1: string | null;
  returnReason2: string | null;
};

export type SellerProductFormState = Step1 & Step2 & Step3 & Step4 & Step5;

export type SellerProductFormActions = {
  setStep1: (state: Step1) => void;
  setStep2: (state: Step2) => void;
  setStep3: (state: Omit<Step3, 'originMainImage' | 'originAdditionalImages'>) => void;
  setStep4: (state: Step4) => void;
  setStep5: (state: Step5) => void;

  onSave: () => void;
  onLoad: () => void;
  onEditLoad: (productId: string) => Promise<void>;
  onRegister: (brandId: string, brandName: string) => Promise<void>;
  onUpdate: (productId: string) => Promise<void>;
};

export type SellerProductFormStore = SellerProductFormState &
  SellerProductFormActions;

export const defaultInitState: SellerProductFormState = {
  name: null,
  recommendedColorSeason: null,
  styleCategories: null,
  clothingCategory: null,
  recommendedGender: null,
  price: null,
  usdPrice: null,
  stockQuantity: null,
  saleStartDate: null,
  hasSaleEndDate: false,
  saleEndDate: null,
  description: null,
  mainImage: null,
  removeImageUrls: [],
  additionalImages: null,
  originMainImage: null,
  originAdditionalImages: null,
  height: null,
  weight: null,
  S: {
    어깨너비: null,
    가슴둘레: null,
    소매길이: null,
    총장: null,
  },
  M: {
    어깨너비: null,
    가슴둘레: null,
    소매길이: null,
    총장: null,
  },
  L: {
    어깨너비: null,
    가슴둘레: null,
    소매길이: null,
    총장: null,
  },
  recommendedBodyType: null,
  shippingFee: null,
  freeShippingAmount: null,
  refundAddress: null,
  returnReason1: null,
  returnReason2: null,
};

export const createSellerProductFormStore = (
  initState: SellerProductFormState = defaultInitState
) => {
  return createStore<SellerProductFormStore>()((set, get) => ({
    ...initState,
    setStep1: (step1: Step1) => set((state) => ({ ...state, ...step1 })),
    setStep2: (step2: Step2) => set((state) => ({ ...state, ...step2 })),
    setStep3: (step3: Omit<Step3, 'originMainImage' | 'originAdditionalImages'>) =>
      set((state) => ({ ...state, ...step3 })),
    setStep4: (step4: Step4) => set((state) => ({ ...state, ...step4 })),
    setStep5: (step5: Step5) => set((state) => ({ ...state, ...step5 })),
    onSave: () => {
      const state = get();

      localStorage.setItem(
        STORAGE.SELLER_PRODUCT_FORM,
        JSON.stringify({
          ...state,
          mainImage: null,
          additionalImages: null,
        })
      );
    },
    onLoad: () => {
      const state = localStorage.getItem(STORAGE.SELLER_PRODUCT_FORM);
      if (state) {
        set(JSON.parse(state));
      }
    },
    onEditLoad: async (productId: string) => {
      const product = await productApi.getProduct(productId);

      set({
        ...product,
        S: product.sizeInfo?.S
          ? JSON.parse(product.sizeInfo.S)
          : {
              어깨너비: null,
              가슴둘레: null,
              소매길이: null,
              총장: null,
            },
        M: product.sizeInfo?.M
          ? JSON.parse(product.sizeInfo.M)
          : {
              어깨너비: null,
              가슴둘레: null,
              소매길이: null,
              총장: null,
            },
        L: product.sizeInfo?.L
          ? JSON.parse(product.sizeInfo.L)
          : {
              어깨너비: null,
              가슴둘레: null,
              소매길이: null,
              총장: null,
            },
        height: product.bodyInfo?.height,
        weight: product.bodyInfo?.weight,
        saleStartDate: product.saleStartDate
          ? new Date(product.saleStartDate)
          : null,
        saleEndDate: product.saleEndDate ? new Date(product.saleEndDate) : null,
        mainImage: null,
        additionalImages: null,
        originMainImage: product.imageUrl,
        originAdditionalImages: product.additionalImageUrls,
        refundAddress: product.refundInfo?.address ?? null,
        recommendedGender: product.recommendedGender ?? null,
        returnReason1: null,
        returnReason2: null,
      });
    },
    onRegister: async (brandId, brandName) => {
      const state = get();

      // 이미지가 필수인지 확인
      if (!state.mainImage) {
        throw new Error('대표 이미지를 등록해주세요.');
      }

      await productApi.createProduct({
        name: state.name!,
        brandId,
        brand: brandName,
        price: state.price!,
        usdPrice: state.usdPrice!,
        stockQuantity: state.stockQuantity!,
        description: state.description!,
        recommendedColorSeason: state.recommendedColorSeason,
        recommendedBodyType: state.recommendedBodyType,
        recommendedGender: state.recommendedGender,
        styleCategories: state.styleCategories,
        clothingCategory: state.clothingCategory,
        sizeInfo: {
          S: Object.values(state.S).every((value) => value === null)
            ? undefined
            : JSON.stringify(state.S),
          M: Object.values(state.M).every((value) => value === null)
            ? undefined
            : JSON.stringify(state.M),
          L: Object.values(state.L).every((value) => value === null)
            ? undefined
            : JSON.stringify(state.L),
        },
        bodyInfo: {
          height: state.height!,
          weight: state.weight!,
        },
        saleStartDate: new Date(state.saleStartDate!),
        hasSaleEndDate: state.hasSaleEndDate,
        saleEndDate: state.saleEndDate
          ? new Date(state.saleEndDate)
          : undefined,
        shippingFee: state.shippingFee!,
        freeShippingAmount: state.freeShippingAmount!,
        refundInfo: {
          address: state.refundAddress!,
        },
        images: state.mainImage 
          ? [state.mainImage, ...(state.additionalImages ?? [])].filter((img): img is File => img !== null && img !== undefined)
          : [],
      });
    },
    onUpdate: async (productId: string) => {
      const state = get();

      await productApi.updateProduct(productId, {
        name: state.name!,
        price: state.price!,
        usdPrice: state.usdPrice!,
        stockQuantity: state.stockQuantity!,
        description: state.description!,
        recommendedColorSeason: state.recommendedColorSeason,
        recommendedBodyType: state.recommendedBodyType,
        recommendedGender: state.recommendedGender,
        styleCategories: state.styleCategories,
        clothingCategory: state.clothingCategory,
        sizeInfo: {
          S: Object.values(state.S).every((value) => value === null)
            ? undefined
            : JSON.stringify(state.S),
          M: Object.values(state.M).every((value) => value === null)
            ? undefined
            : JSON.stringify(state.M),
          L: Object.values(state.L).every((value) => value === null)
            ? undefined
            : JSON.stringify(state.L),
        },
        bodyInfo: {
          height: state.height!,
          weight: state.weight!,
        },
        saleStartDate: new Date(state.saleStartDate!),
        hasSaleEndDate: state.hasSaleEndDate,
        saleEndDate: state.saleEndDate
          ? new Date(state.saleEndDate)
          : undefined,
        shippingFee: state.shippingFee!,
        freeShippingAmount: state.freeShippingAmount!,
        refundInfo: {
          address: state.refundAddress!,
        },
        mainImage: state.mainImage,
        removeImageUrls: state.removeImageUrls,
        additionalImages: state.additionalImages,
      });
    },
  }));
};
