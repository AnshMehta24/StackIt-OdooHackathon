import answerService from "@/services/answer";
import { useMutation } from "@tanstack/react-query";

export function useCreateAnswer(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationKey: ["create_answer"],
    mutationFn: answerService.createAnswer,
    ...options,
  });
}
