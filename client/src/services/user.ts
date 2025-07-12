import { apiClient } from "@/apiClient/instance";
import type { SuccessResponse } from "@/types";

export const userService = {
  getUser: async () => {
    const response = await apiClient.get<
      SuccessResponse<{
        userId: string;
        email: string;
        name: string;
        username: string;
      }>
    >("/api/v1/user");
    return response.data;
  },

  getUserQuestions: async () => {
    const res = await apiClient.get(`/api/v1/users/questions`);
    return res.data.data;
  },

  getAnsweredQuestions: async () => {
    const res = await apiClient.get(`/api/v1/users/answered-questions`);
    return res.data.data;
  },
};
