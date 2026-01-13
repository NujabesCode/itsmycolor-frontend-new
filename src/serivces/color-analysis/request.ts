import { axiosInstance } from "@/serivces/client";

import { BodyType } from "../user/type";
import { ColorAnalysis, ColorSeason } from "./type";

export const colorAnalysisApi = {
  createColorAnalysis: async (
    userId: string,
    height: number,
    weight: number,
    bodyType: BodyType | null,
    colorSeason: ColorSeason | null
  ) => {
    return await axiosInstance.post("/color-analysis", {
      userId,
      height,
      weight,
      bodyType: bodyType || undefined,
      colorSeason: colorSeason || undefined,
    });
  },

  getColorAnalysis: async (): Promise<ColorAnalysis | null> => {
    const res = await axiosInstance.get(`/color-analysis/user`);
    return res.data[0] || null;
  },

  updateColorAnalysis: async (
    colorAnalysisId: string,
    height?: number,
    weight?: number,
    bodyType?: BodyType,
    colorSeason?: ColorSeason,
  ) => {
    return await axiosInstance.patch(`/color-analysis/${colorAnalysisId}`, {
      height,
      weight,
      bodyType,
      colorSeason,
    });
  },
};
