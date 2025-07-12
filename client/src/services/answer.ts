import { apiClient } from "@/apiClient/instance";
import type { SuccessResponse } from "@/types";

type CreateAnswerInput = {
  questionId: string;
  content: string;
};

const answerService = {
  createAnswer: async (data: CreateAnswerInput) => {
    const res = await apiClient.post<SuccessResponse<null>>(
      "/api/v1/answers",
      data
    );
    return res.data;
  },
};

export default answerService;
