import { axiosInstance } from "../client";
import { Review } from "./type";

export const reviewApi = {
  createReview: async (data: {
    productId: string;
    orderId: string;
    orderItemId: string;
    content: string;
    rating: number;
    sizeReview: string;
    colorReview: string;
    thicknessReview: string;
    images: File[];
  }) => {
    const formData = new FormData();
    formData.append("productId", data.productId);
    formData.append("orderId", data.orderId);
    formData.append("orderItemId", data.orderItemId);
    formData.append("content", data.content);
    formData.append("rating", data.rating.toString());
    formData.append("sizeReview", data.sizeReview);
    formData.append("colorReview", data.colorReview);
    formData.append("thicknessReview", data.thicknessReview);

    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    return await axiosInstance.post("/reviews", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getReviewListByProductId: async (params: {
    productId: string;
    sort: "latest" | "rating";
    page: number;
  }): Promise<{ reviews: Review[]; lastPage: number }> => {
    const res = await axiosInstance.get("/reviews", {
      params,
    });

    return {
      reviews: res.data.reviews,
      lastPage: res.data.lastPage,
    };
  },
};
