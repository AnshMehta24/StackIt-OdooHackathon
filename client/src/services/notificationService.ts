import { apiClient } from "@/apiClient/instance";

export const notificationService = {
  getAll: async () => {
    const response = await apiClient.get("/api/v1/notifications");
    return response.data;
  },
};
