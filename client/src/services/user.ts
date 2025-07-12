import { apiClient } from "@/apiClient/instance";
import type { ProfileRoles, SuccessResponse } from "@/types";

export const userService = {
  getUser: async () => {
    const response = await apiClient.get<
      SuccessResponse<{
        id: string;
        name: string;
        email: string;
        role: ProfileRoles;
      }>
    >("/api/v1/user");
    return response.data;
  },
};
