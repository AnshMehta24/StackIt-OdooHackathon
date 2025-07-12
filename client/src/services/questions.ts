import { apiClient } from "@/apiClient/instance";
import type {
  FullQuestionResponse,
  QuestionWithAuthor,
  SuccessResponse,
} from "@/types";

const questionServices = {
  addQuestion: async (data: {
    title: string;
    tags: string[];
    content: string;
  }) => {
    const res = await apiClient.post(`api/v1/questions`, data);
    return res.data;
  },

  getAllQuestions: async (
    tag: string | null
  ): Promise<QuestionWithAuthor[]> => {
    const res = await apiClient.get(`api/v1/questions`, {
      params: tag ? { tag } : {},
    });
    return res.data.data;
  },

  getQuestionById: async (
    id: string
  ): Promise<SuccessResponse<FullQuestionResponse>> => {
    const res = await apiClient.get(`/api/v1/questions/${id}`);
    return res.data;
  },
};

export default questionServices;
