import { apiClient } from "@/apiClient/instance";
import type { SuccessResponse } from "@/types";

export const uploadService = {
  uploadFileFromEditor: async (formData: FormData) => {
    const res = await apiClient.post<
      SuccessResponse<{
        filePath: string;
        fullUrl: string;
      }>
    >(`/api/v1/upload`, formData);
    return res.data;
  },
};
