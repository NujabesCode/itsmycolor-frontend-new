import { axiosInstance } from '../client';
import { ColorSeason } from '../color-analysis/type';
import { BodyType } from '../user/type';
import { Product, ProductListItem, StyleCategory, MainProducts, Gender } from './type';

export const productApi = {
  createProduct: async (data: {
    name: string;
    brandId: string;
    brand: string;
    price: number;
    usdPrice: number;
    stockQuantity: number;
    description: string;
    recommendedColorSeason: ColorSeason[] | null;
    recommendedBodyType: BodyType | null;
    recommendedGender?: Gender | null;
    styleCategories: StyleCategory[] | null;
    clothingCategory?: string | null;
    sizeInfo: {
      S?: string;
      M?: string;
      L?: string;
    };
    bodyInfo: {
      height: number;
      weight: number;
    };
    saleStartDate: Date;
    hasSaleEndDate: boolean;
    saleEndDate?: Date;
    shippingFee: number;
    freeShippingAmount: number;
    refundInfo: {
      address: string;
    },
    images: File[];
  }) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('brandId', data.brandId);
    formData.append('brand', data.brand);
    formData.append('price', data.price.toString());
    formData.append('usdPrice', data.usdPrice.toString());
    formData.append('stockQuantity', data.stockQuantity.toString());
    formData.append('description', data.description);

    data.recommendedColorSeason?.forEach((colorSeason) => {
      formData.append('recommendedColorSeason', colorSeason);
    });
    if (data.recommendedBodyType) {
      formData.append('recommendedBodyType', data.recommendedBodyType);
    }
    // recommendedGender는 필수 필드
    if (data.recommendedGender) {
      formData.append('recommendedGender', data.recommendedGender);
    } else {
      throw new Error('추천 성별을 선택해주세요.');
    }

    data.styleCategories?.forEach((styleCategory) => {
      formData.append('styleCategories', styleCategory);
    });
    if (data.clothingCategory) {
      formData.append('clothingCategory', data.clothingCategory);
      // recommendedCategory는 필수 필드이므로 clothingCategory를 사용
      formData.append('recommendedCategory', data.clothingCategory);
    } else {
      // recommendedCategory는 필수 필드이므로 기본값 설정
      formData.append('recommendedCategory', '기타');
    }

    formData.append('sizeInfo', JSON.stringify(data.sizeInfo));
    formData.append('bodyInfo', JSON.stringify(data.bodyInfo));
    formData.append('saleStartDate', data.saleStartDate.toISOString());
    formData.append('hasSaleEndDate', data.hasSaleEndDate.toString());
    formData.append('saleEndDate', data.saleEndDate?.toISOString() ?? '');
    formData.append('shippingFee', data.shippingFee.toString());
    formData.append('freeShippingAmount', data.freeShippingAmount.toString());
    formData.append('refundInfo', JSON.stringify(data.refundInfo));

    // 이미지가 있을 때만 추가 - images 필드명으로 여러 파일 추가
    console.log('전송할 이미지 수:', data.images?.length || 0);
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        if (image instanceof File) {
          console.log(`이미지 ${index + 1}:`, image.name, image.size, image.type);
          // FilesInterceptor는 'images' 필드명으로 여러 파일을 받을 수 있음
          // 파일명을 명시적으로 지정하여 백엔드에서 제대로 받을 수 있도록 함
          formData.append('images', image, image.name);
        } else {
          console.warn(`이미지 ${index + 1}이 File 객체가 아닙니다:`, image);
        }
      });
      console.log('FormData에 이미지 추가 완료');
    } else {
      console.warn('전송할 이미지가 없습니다!');
    }

    formData.append('isAvailable', 'false');

    // 디버깅: FormData 내용 확인
    console.log('FormData 전송 전 확인:');
    console.log('- recommendedGender:', data.recommendedGender);
    console.log('- recommendedCategory:', data.clothingCategory || '기타');
    console.log('- images 개수:', data.images?.length || 0);

    // FormData를 사용할 때는 Content-Type을 설정하지 않아야 브라우저가 자동으로 boundary를 포함한 올바른 Content-Type을 설정합니다.
    try {
      const response = await axiosInstance.post('/products', formData);
      console.log('상품 등록 성공:', response.data);
      return response;
    } catch (error: any) {
      console.error('상품 등록 실패:', error);
      console.error('에러 응답:', error?.response?.data);
      console.error('에러 상태:', error?.response?.status);
      if (error?.response?.data?.message) {
        console.error('에러 메시지:', error.response.data.message);
      }
      if (error?.response?.data?.error) {
        console.error('에러 타입:', error.response.data.error);
      }
      throw error;
    }
  },
  updateProduct: async (
    productId: string,
    data: {
      name: string;
      price: number;
      usdPrice: number;
      stockQuantity: number;
      description: string;
      recommendedColorSeason: ColorSeason[] | null;
      recommendedBodyType: BodyType | null;
      recommendedGender?: Gender | null;
      styleCategories: StyleCategory[] | null;
      clothingCategory?: string | null;
      sizeInfo: {
        S?: string;
        M?: string;
        L?: string;
      };
      bodyInfo: {
        height: number;
        weight: number;
      };
      saleStartDate: Date;
      hasSaleEndDate: boolean;
      saleEndDate?: Date;
      shippingFee: number;
      freeShippingAmount: number;
      refundInfo: {
        address: string;
      },
      mainImage: File | null;
      removeImageUrls: string[];
      additionalImages: File[] | null;
    }
  ) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('usdPrice', data.usdPrice.toString());
    formData.append('stockQuantity', data.stockQuantity.toString());
    formData.append('description', data.description);

    data.recommendedColorSeason?.forEach((colorSeason) => {
      formData.append('recommendedColorSeason', colorSeason);
    });
    if (data.recommendedBodyType) {
      formData.append('recommendedBodyType', data.recommendedBodyType);
    }
    if (data.recommendedGender) {
      formData.append('recommendedGender', data.recommendedGender);
    }

    data.styleCategories?.forEach((styleCategory) => {
      formData.append('styleCategories', styleCategory);
    });
    if (data.clothingCategory) {
      formData.append('clothingCategory', data.clothingCategory);
    }

    formData.append('sizeInfo', JSON.stringify(data.sizeInfo));
    formData.append('bodyInfo', JSON.stringify(data.bodyInfo));
    formData.append('saleStartDate', data.saleStartDate.toISOString());
    formData.append('hasSaleEndDate', data.hasSaleEndDate.toString());
    formData.append('saleEndDate', data.saleEndDate?.toISOString() ?? '');
    formData.append('shippingFee', data.shippingFee.toString());
    formData.append('freeShippingAmount', data.freeShippingAmount.toString());
    formData.append('refundInfo', JSON.stringify(data.refundInfo));

    if (data.mainImage) {
      formData.append('mainImage', data.mainImage);
    }
    if (data.additionalImages) {
      data.additionalImages.forEach((image) => {
        formData.append('additionalImages', image);
      });
    }
    data.removeImageUrls.forEach((imageUrl) => {
      formData.append('removeImageUrls', imageUrl);
    });

    return await axiosInstance.put(`/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  createProductTryOnImage: async (data: {
    productId: string;
    userImage: File;
  }): Promise<string> => {
    const formData = new FormData();

    formData.append('productId', data.productId);
    formData.append('userImage', data.userImage);

    const res = await axiosInstance.post('/products/try-on', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.resultImageUrl;
  },
  getProduct: async (id: string): Promise<Product> => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  },
  getProductList: async (params: {
    page?: number;
    limit?: number;
    sort?: string;
    bodyType?: BodyType;
    colorSeasons?: ColorSeason[];
    styleCategories?: StyleCategory[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    clothingCategory?: string;
  }): Promise<{ products: ProductListItem[]; lastPage: number }> => {
    const res = await axiosInstance.get('/products', {
      params,
    });
    return res.data;
  },
  getProductListMyType: async (params: {
    bodyType?: BodyType;
  }): Promise<ProductListItem[]> => {
    const res = await axiosInstance.get('/products', {
      params,
    });
    return res.data.products;
  },
  getProductListByBrand: async (
    brandId: string,
    params: {
      page?: number;
    }
  ): Promise<{
    products: ProductListItem[];
    total: number;
    lastPage: number;
  }> => {
    const res = await axiosInstance.get(`/products/brands/${brandId}`, {
      params,
    });
    return res.data;
  },

  // 찜한 상품 리스트
  getLikedProductList: async (
    params: {
      page?: number;
      limit?: number;
    }
  ): Promise<{
    products: ProductListItem[];
    total: number;
    lastPage: number;
  }> => {
    const res = await axiosInstance.get('/products/likes', { params });
    return res.data;
  },
  deleteProduct: async (productId: string) => {
    return await axiosInstance.delete(`/products/${productId}`);
  },
  // 상품 찜
  likeProduct: async (productId: string) => {
    return await axiosInstance.post(`/products/${productId}/like`);
  },

  // 상품 찜 취소
  unlikeProduct: async (productId: string) => {
    return await axiosInstance.delete(`/products/${productId}/like`);
  },

  // 메인 페이지 상품 조회
  getMainProducts: async (): Promise<MainProducts> => {
    const res = await axiosInstance.get('/products/main');
    return res.data;
  },
};
