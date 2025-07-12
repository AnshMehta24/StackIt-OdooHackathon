import questionServices from "@/services/questions";
import type {
  FullQuestionResponse,
  QuestionWithAuthor,
  SuccessResponse,
} from "@/types";
import {
  useMutation,
  useQuery,
  type UseMutationOptions,
} from "@tanstack/react-query";

export function useAddQuestion(
  options?: UseMutationOptions<
    void,
    Error,
    {
      title: string;
      tags: string[];
      content: string;
    }
  >
) {
  return useMutation({
    mutationKey: ["add_questions"],
    mutationFn: questionServices.addQuestion,
    ...options,
  });
}

export function useGetQuestions(tag: string | null) {
  return useQuery<QuestionWithAuthor[], Error>({
    queryKey: ["get_questions", tag],
    queryFn: () => questionServices.getAllQuestions(tag),
  });
}

export function useGetQuestionById(id: string) {
  return useQuery<SuccessResponse<FullQuestionResponse>, Error>({
    queryKey: ["question", id],
    queryFn: () => questionServices.getQuestionById(id),
    enabled: !!id,
  });
}
