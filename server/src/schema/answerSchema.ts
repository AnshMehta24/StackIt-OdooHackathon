import z from "zod";

export const answerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  content: z.string().min(5, "Answer content must be at least 5 characters"),
});

export const updateAnswerSchema = z.object({
  content: z.string().min(5, "Answer content must be at least 5 characters"),
});
