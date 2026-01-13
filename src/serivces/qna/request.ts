import { Qna, QnaStatus } from "../admin/type";
import { axiosInstance } from "../client";
import { QnaType } from "./type";

export const qnaApi = {
  createQna: async (data: {
    title: string;
    content: string;
    type: QnaType;
    isPrivate: boolean;
    productId?: string;
    images?: File[];
  }) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("type", data.type);
    formData.append("isPrivate", data.isPrivate.toString());

    if (data.productId) {
      formData.append("productId", data.productId);
    }

    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    return await axiosInstance.post("/qna", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getQnaListByUser: async (params: {page?: number, status?: QnaStatus, type?: QnaType}): Promise<{qnas: Qna[], lastPage: number}> => {
    const res = await axiosInstance.get("/qna/my", {
      params,
    });
    return {
      qnas: res.data.items,
      lastPage: res.data.meta.totalPages,
    }
  },
  getQnaListByProduct: async (
    productId: string,
    page: number
  ): Promise<{ qnas: Qna[]; lastPage: number }> => {
    const res = await axiosInstance.get("/qna", {
      params: { productId, page },
    });
    return {
      qnas: res.data.items,
      lastPage: res.data.meta.totalPages,
    };
  },
  getQnaListByBrand: async (brandId: string): Promise<Qna[]> => {
    const res = await axiosInstance.get(`/qna/brands/${brandId}`);
    return res.data;
  },
  postQnaAnswer: async (qnaId: string, answer: string) => {
    await axiosInstance.post(`/qna/${qnaId}/answer`, { answer });
  },
};
