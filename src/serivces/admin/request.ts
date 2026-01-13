import { Brand, BrandStatus } from "../brand/type";
import { axiosInstance } from "../client";
import { ColorSeason } from "../color-analysis/type";
import { ProductListItem } from "../product/type";
import { QnaType } from "../qna/type";
import { Settlement } from "../settlement/type";
import { BodyType, UserRole } from "../user/type";
import { Account, Banner, BannerVisibility, Customer, CustomerType, Dashboard, Qna } from "./type";

export const adminApi = {
  getCustomerList: async (params: {
    customerType?: CustomerType;
    bodyType?: BodyType;
    colorSeason?: ColorSeason;
    searchTerm?: string;
    page?: number;
  }): Promise<{ customers: Customer[]; lastPage: number }> => {
    const response = await axiosInstance.get("/admin/customers", { params });

    return {
      customers: response.data.data,
      lastPage: response.data.lastPage,
    };
  },
  getAccountList: async (params: {
    role?: UserRole;
    searchTerm?: string;
    page?: number;
  }): Promise<{ accounts: Account[]; lastPage: number }> => {
    const response = await axiosInstance.get("/admin/users", { params });

    return {
      accounts: response.data.data,
      lastPage: response.data.lastPage,
    };
  },
  putAccountRole: async (userId: string, role: UserRole) => {
    await axiosInstance.put(`/admin/users/${userId}/role`, { role });
  },
  putAccountStatus: async (userId: string, isActive: boolean) => {
    await axiosInstance.put(`/admin/users/${userId}/status`, { isActive });
  },
  getBrandList: async (params: { status?: BrandStatus }): Promise<Brand[]> => {
    const response = await axiosInstance.get("/brands/admin/all", { params });
    return response.data;
  },
  putBrandStatus: async (brandId: string, status: BrandStatus, rejectionReason?: string, sanctionReason?: string) => {
    await axiosInstance.put(`/brands/${brandId}/status`, { 
      status, 
      rejectionReason,
      sanctionReason,
    });
  },
  getQnaList: async (params: {
    type?: QnaType;
    page?: number;
  }): Promise<{ qnas: Qna[]; lastPage: number }> => {
    const response = await axiosInstance.get("/qna/admin/all", { params });

    return {
      qnas: response.data.items,
      lastPage: response.data.meta.totalPages,
    };
  },
  postQnaAnswer: async (qnaId: string, answer: string) => {
    await axiosInstance.post(`/qna/${qnaId}/answer`, { answer });
  },
  getProductList: async (params: {
    page?: number;
    sort?: "latest" | "old";
    bodyType?: BodyType;
    search?: string;
  }): Promise<{ products: ProductListItem[]; lastPage: number }> => {
    const res = await axiosInstance.get("/products/admin/all", { params });

    return {
      products: res.data.products,
      lastPage: res.data.lastPage,
    };
  },
  putProduct: async (
    productId: string,
    data: {
      recommendedColorSeason?: ColorSeason[];
      recommendedBodyType?: BodyType;
      isAvailable?: boolean;
    }
  ) => {
    return await axiosInstance.put(`/products/${productId}`, data);
  },
  getSettlementList: async (params: {
    year: number;
    month: number;
  }): Promise<Settlement[]> => {
    const response = await axiosInstance.get("/settlements", { params });
    return response.data;
  },
  putSettlementComplete: async (settlementId: string) => {
    return await axiosInstance.put(`/settlements/${settlementId}/complete`);
  },
  getDashboard: async (): Promise<Dashboard> => {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data;
  },
  postBrandConnectUrl: async (brandId: string) => {
    return await axiosInstance.post(`/brands/connect-url`, { brandId });
  },
  // Banner APIs
  getBannerList: async (params?: { page?: number; limit?: number }): Promise<Banner[]> => {
    const response = await axiosInstance.get("/admin/banners", { params });
    // 백엔드는 { items, total, page, totalPages } 형식으로 반환
    return response.data?.items || response.data || [];
  },
  getBanner: async (id: number): Promise<Banner> => {
    const response = await axiosInstance.get(`/admin/banners/${id}`);
    return response.data;
  },
  createBanner: async (data: {
    title: string;
    subtitle?: string;
    visibility: BannerVisibility;
    priority?: number;
    imagePcUrl?: string;
    imageMobileUrl?: string;
    linkUrl?: string;
  }): Promise<Banner> => {
    const response = await axiosInstance.post("/admin/banners", data);
    return response.data;
  },
  updateBanner: async (id: number, data: {
    title?: string;
    subtitle?: string;
    visibility?: BannerVisibility;
    priority?: number;
    imagePcUrl?: string;
    imageMobileUrl?: string;
    linkUrl?: string;
  }): Promise<Banner> => {
    const response = await axiosInstance.patch(`/admin/banners/${id}`, data);
    return response.data;
  },
  updateBannerPriority: async (id: number, order: number): Promise<Banner> => {
    const response = await axiosInstance.patch(`/admin/banners/${id}/priority/${order}`);
    return response.data;
  },
  deleteBanner: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/banners/${id}`);
  },
};
