import { apiClient } from "@/apiClient/instance";
import type { SuccessResponse } from "@/types";

export const authService = {
  signUp: async (formData: FormData) => {
    const response = await apiClient.post<SuccessResponse<null>>(
      "/api/v1/auth/signup",
      formData
    );
    return response.data;
  },

  signIn: async (formData: FormData) => {
    const response = await apiClient.post<SuccessResponse<null>>(
      "/api/v1/auth/login",
      formData
    );
    return response.data;
  },

  logOut: async () => {
    const response = await apiClient.post<SuccessResponse<null>>(
      "/api/v1/auth/logout"
    );
    return response.data;
  },
};
